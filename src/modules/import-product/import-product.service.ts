import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as parse from 'csv-parser';
import axios from 'axios';

import Shopify = require('shopify-api-node');
import FormData = require('form-data');

import { PrismaService } from '../prisma/prisma.service';
import {
  BULK_OPERATION_RUN_MUTATION,
  STAGED_UPLOADS_CREATE,
} from 'src/graphql/mutation';

type CsvParseOption = {
  separator: string;
  from_line: number;
};

@Injectable()
export class ImportProductService {
  constructor(private readonly prisma: PrismaService) {}

  private async shopify(shop: string) {
    const store = await this.prisma.store.findUnique({
      where: {
        shop,
      },
    });

    return new Shopify({
      shopName: store.shop,
      accessToken: store.access_token,
    });
  }

  private async processStreamCsv(filePath) {
    const rows = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(
          parse({ separator: ',', from_line: 2 } as Partial<CsvParseOption>),
        )
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', () => {
          resolve(rows);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  private transformDataStagedUpload(values: any, key: string) {
    const data = values.find((d) => d.name === key);
    return data.value;
  }

  private async transformDataToJsonL(data: any) {
    const result = data
      .flatMap((obj) => ({
        input: {
          title: obj.Title,
          descriptionHtml: obj['Body (HTML)'],
          handle: obj.Handle,
          vendor: obj.Vendor,
          productType: obj['Type'],
          tags: obj['Tags'].split(','),
          status: obj['Status'].toUpperCase(),
          options: [obj['Option1 Value']],
          variants: [
            {
              price: obj['Variant Price'],
              weight: parseFloat(obj['Variant Grams']),
              taxable: obj['Variant Taxable'] === 'true',
              barcode: obj['Variant Barcode'],
              requiresShipping: obj['Variant Requires Shipping'] === 'true',
              compareAtPrice: obj['Variant Compare At Price'] || '0.0',
              mediaSrc: obj['Variant Image'],
              inventoryPolicy: obj['Variant Inventory Policy'].toUpperCase(),
            },
          ],
        },
      }))
      .map((obj) => JSON.stringify(obj))
      .join('\n');

    await fs.writeFileSync(
      path.join('product_template.jsonl'),
      result,
      'utf-8',
    );

    return result;
  }

  private async stagedUploadsCreate(shop: string) {
    const shopify = await this.shopify(shop);
    const data = await shopify.graphql(STAGED_UPLOADS_CREATE, {});
    const staged = data.stagedUploadsCreate.stagedTargets[0];

    const updateStore = {
      bulk_staged_upload_url: staged.url,
      bulk_staged_upload_key: this.transformDataStagedUpload(
        staged.parameters,
        'key',
      ),
      bulk_staged_upload_policy: this.transformDataStagedUpload(
        staged.parameters,
        'policy',
      ),
      bulk_x_goog_credential: this.transformDataStagedUpload(
        staged.parameters,
        'x-goog-credential',
      ),
      bulk_x_goog_algorithm: this.transformDataStagedUpload(
        staged.parameters,
        'x-goog-algorithm',
      ),
      bulk_x_goog_date: this.transformDataStagedUpload(
        staged.parameters,
        'x-goog-date',
      ),
      bulk_x_goog_signature: this.transformDataStagedUpload(
        staged.parameters,
        'x-goog-signature',
      ),
    };

    await this.prisma.store.update({
      where: {
        shop: shop,
      },
      data: {
        shop: shop,
        ...updateStore,
      },
    });

    return updateStore;
  }

  private async createBulkProduct(shop: string, file: string) {
    const shopify = await this.shopify(shop);
    const resp = await this.prisma.store.findUnique({ where: { shop } });

    const {
      bulk_staged_upload_url,
      bulk_staged_upload_key,
      bulk_staged_upload_policy,
      bulk_x_goog_algorithm,
      bulk_x_goog_credential,
      bulk_x_goog_date,
      bulk_x_goog_signature,
    } = resp;

    // const fileJsonl = fs.createReadStream(path.join('product_template.jsonl'));

    const formData = new FormData();
    formData.append('key', bulk_staged_upload_key);
    formData.append('acl', 'private');
    formData.append('success_action_status', '201');
    formData.append('policy', bulk_staged_upload_policy);
    formData.append('x-goog-credential', bulk_x_goog_credential);
    formData.append('x-goog-algorithm', bulk_x_goog_algorithm);
    formData.append('x-goog-date', bulk_x_goog_date);
    formData.append('x-goog-signature', bulk_x_goog_signature);
    formData.append('Content-Type', 'text/jsonl');
    formData.append('file', file);

    await axios({
      url: bulk_staged_upload_url,
      data: formData,
      method: 'post',
      headers: {
        ...formData.getHeaders(),
      },
    });

    const respShopify = await shopify.graphql(BULK_OPERATION_RUN_MUTATION, {
      src: bulk_staged_upload_key,
    });

    return respShopify;
  }

  async processImportProductCsv(shop: string) {
    const filePath = path.join(
      process.cwd(),
      './src/assets/product_template.csv',
    );

    const dataCsv = await this.processStreamCsv(filePath);
    const dataToJsonl = await this.transformDataToJsonL(dataCsv);
    await this.stagedUploadsCreate(shop);

    const uploadJsonlToShopify = await this.createBulkProduct(
      shop,
      dataToJsonl,
    );

    return uploadJsonlToShopify;
  }
}
