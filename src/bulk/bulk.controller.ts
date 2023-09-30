import { Body, Controller, Get, Post, Res, Response } from '@nestjs/common';
import { BulkService } from './bulk.service';

@Controller('bulk')
export class BulkController {
  constructor(private readonly bulkService: BulkService) {}

  @Post('/products')
  async createProductsBulk(@Res() res) {
    const resp = await this.bulkService.createProductsBulk(res.locals.shop);
    return res.json(resp);
  }

  @Get('/current')
  async currentBulkOperation(@Res() res) {
    const resp = await this.bulkService.currentBulkOperation(res.locals.shop);
    return res.json(resp);
  }

  @Post('/notification')
  async notificationBulkOperationFinish(@Res() res, @Body() url: string) {
    const resp = await this.bulkService.webhookBulkOperation(
      res.locals.shop,
      url,
    );
    return res.json(resp);
  }

  @Get('/products')
  async getProductsBulk(@Res() res) {
    const resp = await this.bulkService.getProductsBulk(res.locals.shop);

    return res.json(resp);
  }
}
