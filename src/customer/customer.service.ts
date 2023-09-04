import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { print } from 'graphql';
import Shopify = require('shopify-api-node');

import { METAFIELD } from './graphql';
import {
  CustomerRequest,
  CustomerResponse,
  MetaFieldResponse,
  ResourceType,
} from './dto';

@Injectable()
export class CustomerService {
  async searchEmail(event: CustomerRequest): Promise<CustomerResponse> {
    const { email, shop } = event;

    const shopify = new Shopify({
      shopName: shop,
      accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
    });

    const resp = await shopify.customer.search({ email });

    if (!resp[0]) {
      return {
        status: false,
        message: 'Not find customer',
      };
    }
    return {
      id: resp[0].id,
      verified_email: resp[0].verified_email,
      status: true,
      message: 'OK',
    };
  }

  async searchMetaField(event: CustomerRequest): Promise<CustomerResponse> {
    const { email, shop, metafields, namespace } = event;

    const customer = await this.searchEmail(event);

    if (!customer.status) return customer;

    const shopify = new Shopify({
      shopName: shop,
      accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
    });

    const resp = await shopify.metafield.list({
      metafield: {
        owner_resource: 'customer',
        owner_id: customer.id,
        namespace: 'POINTS',
      },
    });

    const metaField = resp.find((res) => res.namespace === namespace);

    if (!metaField.id) {
      return {
        status: false,
        message: 'MetaField Not Found',
      };
    }
    return {
      status: true,
      message: 'OK',
      ...metaField,
    };
  }

  async createMetaField(event: CustomerRequest): Promise<MetaFieldResponse> {
    const { shop, namespace, key, value } = event;

    const customer = await this.searchEmail(event);

    if (!customer.status) return customer;
    const shopify = new Shopify({
      shopName: shop,
      accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
    });

    try {
      const resp = await shopify.metafield.create({
        key,
        value,
        namespace,
        owner_resource: ResourceType.Customer,
        owner_id: customer.id,
        type: 'string',
      });

      return {
        status: true,
        message: 'ok',
        data: resp,
      };
    } catch (error) {
      return {
        status: false,
        message: 'Error Create MetaField',
      };
    }
  }

  async updateMetaField(event: CustomerRequest): Promise<MetaFieldResponse> {
    const { shop, metafields } = event;

    const customer = await this.searchEmail(event);

    if (!customer.status) return customer;
    console.log(metafields);
    try {
      const resp = await axios.post(
        `https://${shop}/admin/api/2023-04/graphql.json`,
        {
          query: print(METAFIELD),
          variables: {
            metafields: metafields,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
          },
        },
      );

      console.log(resp.data.extensions.cost);

      return {
        status: true,
        message: 'ok',
        // data: resp.data.data.metafieldsSet.metafields,
      };
    } catch (error) {
      console.log(error, 'error');
      return {
        status: false,
        message: 'Error Create MetaField',
      };
    }
  }
}
