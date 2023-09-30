import { Injectable, Res } from '@nestjs/common';
import axios from 'axios';

import Shopify = require('shopify-api-node');

import AppConstant from 'src/constants/app';

import { PrismaService } from 'src/prisma/prisma.service';

import {
  INSERT_PRODUCTS_BULK,
  WEBHOOK_BULK_OPERATION,
} from 'src/graphql/mutation';
import { CURRENT_BULK_OPERATION } from 'src/graphql/query';

@Injectable()
export class BulkService {
  constructor(
    private readonly appConstant: AppConstant,
    private readonly prisma: PrismaService,
  ) {}

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

  async createProductsBulk(shop) {
    const shopify = await this.shopify(shop);

    const data = await shopify.graphql(INSERT_PRODUCTS_BULK, {});

    return data;
  }

  async webhookBulkOperation(shop: string, url: string) {
    const shopify = await this.shopify(shop);

    const data = await shopify.graphql(WEBHOOK_BULK_OPERATION, {
      url,
    });

    return data;
  }

  async currentBulkOperation(shop: string) {
    const shopify = await this.shopify(shop);

    const resp = await shopify.graphql(CURRENT_BULK_OPERATION, {});

    return resp;
  }

  async getProductsBulk(shop: string) {
    try {
      const response = await axios.get(this.appConstant.URL_PRODUCTS_BULK);

      return response.data
        .split('\n')
        .filter((line) => line !== '')
        .map(JSON.parse);
    } catch (error) {
      throw error;
    }
  }
}
