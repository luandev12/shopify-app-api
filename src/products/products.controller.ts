import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductBodyRequest } from './dto';

@Controller('products')
export class ProductsController {
  constructor(private productServices: ProductsService) {}

  @Get('/sync')
  async getProducts(): Promise<any> {
    const resp = await this.productServices.getProducts();

    return resp;
  }

  @Get('/:id')
  async getProduct(@Param('id') id): Promise<any> {
    const resp = await this.productServices.getProduct(id);

    return resp;
  }

  @Post('/:id')
  async updateProduct(
    @Param('id') id,
    @Body() productBodyRequest: ProductBodyRequest,
  ): Promise<any> {
    const resp = await this.productServices.updateProduct(
      id,
      productBodyRequest,
    );

    return resp;
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id): Promise<any> {
    const resp = await this.productServices.deleteProduct(id);

    return resp;
  }
}
