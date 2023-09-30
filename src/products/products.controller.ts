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

@Controller('products')
export class ProductsController {
  constructor(private productServices: ProductsService) {}

  @Get('/sync')
  async getProducts(@Res() res): Promise<any> {
    console.log(
      '%cproducts.controller.ts line:19 res.locals.shop',
      'color: #007acc;',
      res.locals.shop,
    );
    const resp = await this.productServices.getProducts(res.locals.shop);

    return res.json(resp);
  }

  @Get('/:id')
  async getProduct(@Res() res, @Param('id') id): Promise<any> {
    const resp = await this.productServices.getProduct(res.locals.shop, id);

    return res.json(resp);
  }

  @Post('/:id')
  async updateProduct(
    @Res() res,
    @Param('id') id,
    @Body() productBodyRequest: ProductBodyRequest,
  ): Promise<any> {
    const resp = await this.productServices.updateProduct(
      res.locals.shop,
      id,
      productBodyRequest,
    );

    return res.json(resp);
  }

  @Delete('/:id')
  async deleteProduct(@Res() res, @Param('id') id): Promise<any> {
    const resp = await this.productServices.deleteProduct(res.locals.shop, id);

    return res.json(resp);
  }
}
