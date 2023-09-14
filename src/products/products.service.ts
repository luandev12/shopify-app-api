import { Injectable } from '@nestjs/common';

import Shopify = require('shopify-api-node');
import { ProductBodyRequest } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

interface ProductResponse<T> {
  data: T;
  status: boolean;
  message: string;
}

@Injectable()
export class ProductsService {
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

  async getProducts(): Promise<ProductResponse<Shopify.IProduct[]>> {
    try {
      const shopify = await this.shopify('alertrend.myshopify.com');
      const products = await shopify.product.list({ limit: 10 });

      return {
        data: products,
        status: true,
        message: 'Get list products from shop success',
      };
    } catch (error) {
      return {
        data: null,
        status: false,
        message: 'Get list products from shop failed',
      };
    }
  }

  async getProduct(id: number): Promise<ProductResponse<Shopify.IProduct>> {
    try {
      const shopify = await this.shopify('alertrend.myshopify.com');
      const product = await shopify.product.get(id);

      return {
        data: product,
        status: true,
        message: 'Fetch product from shop success',
      };
    } catch (error) {
      return {
        data: null,
        status: false,
        message: 'Fetch product from shop failed',
      };
    }
  }

  async updateProduct(id: number, productBodyRequest: ProductBodyRequest) {
    try {
      const shopify = await this.shopify('alertrend.myshopify.com');
      const data = await shopify.product.update(id, {
        title: productBodyRequest.title,
      });

      return data;
    } catch (error) {
      console.log(
        '%cproducts.service.ts line:63 error',
        'color: #007acc;',
        error,
      );
    }
  }

  async deleteProduct(id: number) {
    try {
      const shopify = await this.shopify('alertrend.myshopify.com');
      const data = await shopify.product.delete(id);

      return data;
    } catch (error) {
      console.log(
        '%cproducts.service.ts line:63 error',
        'color: #007acc;',
        error,
      );
    }
  }
}
