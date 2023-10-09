import { Body, Controller, Post } from '@nestjs/common';

@Controller('webhooks')
export class WebhooksController {
  @Post('/create-order')
  async createOrder(@Body() requestBody: any) {
    console.log(await requestBody, 'requestBody');
  }
}
