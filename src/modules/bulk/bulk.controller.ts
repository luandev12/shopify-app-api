import { Body, Controller, Get, Post, Res, Response } from '@nestjs/common';
import { BulkService } from './bulk.service';
import { ShopifyAuth } from '../authors/shopify.decorator';

@Controller('bulk')
export class BulkController {
  constructor(private readonly bulkService: BulkService) {}

  @Post('/products')
  async createProductsBulk(@ShopifyAuth() shopify, @Res() res) {
    const resp = await this.bulkService.createProductsBulk(shopify.shop);
    return res.json(resp);
  }

  @Get('/current')
  async currentBulkOperation(@ShopifyAuth() shopify, @Res() res) {
    const resp = await this.bulkService.currentBulkOperation(shopify.shop);
    return res.json(resp);
  }

  @Post('/notification')
  async notificationBulkOperationFinish(
    @ShopifyAuth() shopify,
    @Res() res,
    @Body() url: string,
  ) {
    const resp = await this.bulkService.webhookBulkOperation(shopify.shop, url);
    return res.json(resp);
  }

  @Get('/products')
  async getProductsBulk(@ShopifyAuth() shopify, @Res() res) {
    const resp = await this.bulkService.getProductsBulk(shopify.shop);

    return res.json(resp);
  }
}
