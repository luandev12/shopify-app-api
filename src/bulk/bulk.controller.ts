import { Body, Controller, Get, Post } from '@nestjs/common';
import { BulkService } from './bulk.service';

@Controller('bulk')
export class BulkController {
  constructor(private readonly bulkService: BulkService) {}

  @Post('/products')
  async createProductsBulk() {
    const resp = await this.bulkService.createProductsBulk();
    return resp;
  }

  @Get('/current')
  async currentBulkOperation() {
    const resp = await this.bulkService.currentBulkOperation();
    return resp;
  }

  @Post('/notification')
  async notificationBulkOperationFinish(@Body() url: string) {
    const resp = await this.bulkService.webhookBulkOperation(url);
    return resp;
  }

  @Get('/products')
  async getProductsBulk() {
    const resp = await this.bulkService.getProductsBulk();
    console.log('%cbulk.controller.ts line:10 resp', 'color: #007acc;', resp);
    return resp;
  }
}
