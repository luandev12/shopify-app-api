import { Injectable } from '@nestjs/common';

import Shopify = require('shopify-api-node');

import { PrismaService } from 'src/prisma/prisma.service';
import { CUSTOMER_QUERY } from 'src/graphql/query';
import {
  CREATE_METAFIELD_TAG,
  DELETE_METAFIELD_TAG,
} from 'src/graphql/mutation';
import { CustomerMetaFieldRequest } from './dto';

import AppConstant from '../constants/app';

@Injectable()
export class MetafieldService {
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

  async getCustomer() {
    const shopify = await this.shopify('alertrend.myshopify.com');

    const data = await shopify.graphql(CUSTOMER_QUERY, {
      first: 25,
    });

    return data.customers.nodes;
  }

  async updateMetafield(metafield: CustomerMetaFieldRequest) {
    const shopify = await this.shopify('alertrend.myshopify.com');

    const data = await shopify.graphql(CREATE_METAFIELD_TAG, metafield);

    return data;
  }

  async deleteMetafield(metaFieldId: string) {
    const shopify = await this.shopify('alertrend.myshopify.com');

    const data = await shopify.graphql(DELETE_METAFIELD_TAG, {
      id: `${this.appConstant.PREFIX_METAFIELD}/${metaFieldId}`,
    });

    return data;
  }
}
