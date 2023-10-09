import nonce from 'nonce';
import Shopify = require('shopify-api-node');
import crypto = require('crypto');

import { PrismaService } from '../prisma/prisma.service';

const jwt = require('jsonwebtoken');
const queryString = require('querystring');
const axios = require('axios');
const nonce = require('nonce')();

import { Injectable } from '@nestjs/common';
import AppConstant from 'src/constants/app';

export interface CallbackResponse {
  status: boolean;
  message?: string;
  url?: string | null;
}

export interface EventAuthRequest {
  shop: string;
  hmac: string;
  code?: string;
  state?: string;
  host: string;
  timestamp: string;
}

export interface AuthorizationRequest {
  authorization: string;
}

export interface AuthorizationResponse {
  status: boolean;
  token: string;
  message: string;
}

@Injectable()
export class AuthorServices {
  constructor(
    private readonly prisma: PrismaService,
    private readonly appConstants: AppConstant,
  ) {}

  async author(shop: string): Promise<CallbackResponse> {
    if (!shop) {
      return {
        status: false,
        message: 'Missing Shop Name parameter!!',
      };
    }

    const state = nonce();
    const redirectURL = `${process.env.API_ENDPOINT}/shopify/callback`;
    const apiKey = process.env.SHOPIFY_API_KEY;
    const scopes = process.env.SCOPES;

    const installUrl =
      'https://' +
      shop +
      '/admin/oauth/authorize?client_id=' +
      apiKey +
      '&scope=' +
      scopes +
      '&state=' +
      state +
      '&redirect_uri=' +
      redirectURL;
    console.log(
      '%cauthor.services.ts line:72 installUrl',
      'color: #007acc;',
      installUrl,
    );
    return {
      status: true,
      message: 'success',
      url: installUrl,
    };
  }

  async authorCallback(event: EventAuthRequest): Promise<CallbackResponse> {
    const { shop, hmac, code, state } = event;
    console.log(shop, hmac, code, 'authorCallback');
    try {
      if (shop && hmac && code) {
        const map = Object.assign({}, { shop, code, state: nonce(), hmac });
        delete map.hmac;

        const message = queryString.stringify(map);
        const providedHmac = Buffer.from(hmac, 'utf-8');
        const generatedHash = Buffer.from(
          crypto
            .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
            .update(message)
            .digest('hex'),
          'utf-8',
        );
        let hashEquals = false;

        try {
          hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
        } catch (e) {
          hashEquals = false;
        }

        // // delete cookie browser if running
        // if (!hashEquals) {
        //   return {
        //     status: false,
        //     url: null,
        //     message: 'HMAC validation failed',
        //   };
        // }

        const accessTokenPayload = {
          client_id: process.env.SHOPIFY_API_KEY,
          client_secret: process.env.SHOPIFY_API_SECRET,
          code,
        };

        const resp = await axios.post(
          `https://${event.shop}/admin/oauth/access_token`,
          { ...accessTokenPayload },
          {
            headers: {
              'content-type': 'application/json',
            },
          },
        );

        console.log(resp.data.access_token, 'access token shopify');
        const shopify = new Shopify({
          shopName: event.shop,
          accessToken: resp.data.access_token,
        });

        // save access token to database sqlite prisma
        try {
          await this.prisma.store.upsert({
            where: {
              shop: event.shop,
            },
            create: {
              access_token: resp.data.access_token,
              shop: event.shop,
            },
            update: {
              access_token: resp.data.access_token,
              shop: event.shop,
            },
          });
        } catch (error) {
          console.log(
            '%cauthor.services.ts line:143 error',
            'color: #007acc;',
            error,
          );
        }

        return shopify.shop.get().then(() => {
          return {
            status: true,
            url: `https://${event.shop}/admin/apps/${process.env.SHOPIFY_API_KEY}`,
          };
        });
      }
    } catch (error) {
      return {
        status: false,
        message: error,
        url: null,
      };
    }
  }

  async verifySessionToken(
    authorization: string,
  ): Promise<AuthorizationResponse> {
    if (!authorization) {
      return {
        status: false,
        token: null,
        message: 'Unauthorized',
      };
    }

    const token: string = authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SHOPIFY_API_SECRET);

    if (!decoded) {
      return {
        status: false,
        token: null,
        message: 'Unauthorized',
      };
    }

    return {
      status: true,
      token,
      message: 'Ok',
    };
  }
}
