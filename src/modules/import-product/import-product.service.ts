import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as parse from 'csv-parser';

import Shopify = require('shopify-api-node');

import { PrismaService } from '../prisma/prisma.service';
import { STAGED_UPLOADS_CREATE } from 'src/graphql/mutation';

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

  private async transformDataToJsonL(data: any) {
    return data.map((obj) => JSON.stringify(obj)).join('\n');
  }

  private transformDataStagedUpload(values: any, key: string) {
    const data = values.find((d) => d.name === key);
    return data.value;
  }

  private async stagedUploadsCreate(shop: string) {
    const shopify = await this.shopify(shop);

    const data = await shopify.graphql(STAGED_UPLOADS_CREATE, {});
    console.log(
      '%cimport-product.service.ts line:61 data',
      'color: #007acc;',
      data,
    );

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

  private async createBulkProduct(data: any) {}

  async processImportProductCsv(shop: string) {
    const filePath = path.join(
      process.cwd(),
      './src/assets/product_template.csv',
    );

    const dataCsv = await this.processStreamCsv(filePath);
    const dataToJsonl = this.transformDataToJsonL(dataCsv);

    const shopify = await this.shopify(shop);
    return this.stagedUploadsCreate(shop);
    console.log(
      '%cimport-product.service.ts line:66 shopify',
      'color: #007acc;',
      shopify,
    );
    return dataToJsonl;
  }
}
