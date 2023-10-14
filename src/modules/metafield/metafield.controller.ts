import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { MetafieldService } from './metafield.service';
import { CustomerMetaFieldRequest } from './dto';
import { ShopifyAuth } from '../authors/shopify.decorator';

@Controller('customers')
export class MetafieldController {
  constructor(private readonly metafieldService: MetafieldService) {}

  @Get('/metafield')
  async getCustomers(@ShopifyAuth() shopify, @Res() res) {
    const resp = await this.metafieldService.getCustomer(shopify.shop);

    return res.json(resp);
  }

  @Post('/metafield')
  async updateMetafield(
    @ShopifyAuth() shopify,
    @Res() res,
    @Param('ownerId') ownerId,
    @Body() metafield: CustomerMetaFieldRequest,
  ) {
    const resp = await this.metafieldService.updateMetafield(
      shopify.shop,
      metafield,
    );

    return res.json(resp);
  }

  @Delete('/metafield/:metaFieldId')
  async updateCustomers(
    @ShopifyAuth() shopify,
    @Res() res,
    @Param('metaFieldId') ownerId,
  ) {
    const resp = await this.metafieldService.deleteMetafield(
      shopify.shop,
      ownerId,
    );

    return res.json(resp);
  }
}
