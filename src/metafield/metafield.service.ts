import { Injectable } from '@nestjs/common';

import Shopify = require('shopify-api-node');

import { PrismaService } from 'src/prisma/prisma.service';
import { CUSTOMER_QUERY } from 'src/graphql/query';

@Injectable()
export class MetafieldService {
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

  async getCustomer() {
    const shopify = await this.shopify('alertrend.myshopify.com');

    const data = await shopify.graphql(CUSTOMER_QUERY, {
      first: 25,
    });

    return data.customers.nodes;
  }
}
