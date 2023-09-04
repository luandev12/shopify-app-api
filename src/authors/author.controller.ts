import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthorServices, EventAuthRequest } from './author.services';

@Controller('shopify')
export class AuthorController {
  constructor(private authServices: AuthorServices) {}

  @Get()
  async author(@Req() request: Request, response: Response) {
    const shopName: string = request.query.shop.toString();
    const authServices = await this.authServices.author(shopName);

    if (!authServices.status) {
      return response.json(400).json(authServices.message);
    }

    response.status(200).redirect(authServices.url);
  }

  @Get('/callback')
  async authorCallback(@Req() request: Request, @Res() response: Response) {
    const { shop, hmac, code, state, host, timestamp } = request.query;

    const event: EventAuthRequest = {
      shop: shop?.toString(),
      host: host?.toString(),
      hmac: hmac?.toString(),
      timestamp: timestamp.toString(),
      code: code?.toString(),
      state: state?.toString(),
    };

    const authCallbackServices = await this.authServices.authorCallback(event);

    if (!authCallbackServices?.status) {
      return response.json(400).json(authCallbackServices?.message);
    }

    response.status(200).redirect(authCallbackServices.url);
  }

  @Get('/verify')
  async verifySessionToken(@Req() request: Request, @Res() response: Response) {
    const { authorization } = request.headers;

    const auth = await this.authServices.verifySessionToken(authorization);

    if (!auth.status) {
      return response.status(401).json(auth.message);
    }

    return response.json(200).json(auth);
  }
}
