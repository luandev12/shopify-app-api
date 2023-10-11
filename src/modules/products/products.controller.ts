import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductBodyRequest } from './dto';
import { ShopifyAuth } from '../authors/shopify.decorator';

@Controller('products')
export class ProductsController {
  constructor(private productServices: ProductsService) {}

  @Get('/sync')
  async getProducts(@ShopifyAuth() shopify, @Res() res): Promise<any> {
    const resp = await this.productServices.getProducts(shopify.shop);

    return res.json(resp);
  }

  @Get('/:id')
  async getProduct(
    @ShopifyAuth() shopify,
    @Res() res,
    @Param('id') id,
  ): Promise<any> {
    const resp = await this.productServices.getProduct(shopify.shop, id);

    return res.json(resp);
  }

  @Post('/:id')
  async updateProduct(
    @ShopifyAuth() shopify,
    @Res() res,
    @Param('id') id,
    @Body() productBodyRequest: ProductBodyRequest,
  ): Promise<any> {
    const resp = await this.productServices.updateProduct(
      shopify.shop,
      id,
      productBodyRequest,
    );

    return res.json(resp);
  }

  @Delete('/:id')
  async deleteProduct(
    @ShopifyAuth() shopify,
    @Res() res,
    @Param('id') id,
  ): Promise<any> {
    const resp = await this.productServices.deleteProduct(shopify.shop, id);

    return res.json(resp);
  }
}
