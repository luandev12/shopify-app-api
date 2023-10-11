import { Body, Controller, Post, Res } from '@nestjs/common';
import { ImportProductService } from './import-product.service';
import { ShopifyAuth } from '../authors/shopify.decorator';

@Controller('import-product')
export class ImportProductController {
  constructor(private readonly importProducCsv: ImportProductService) {}

  @Post('/csv')
  async importProductCsv(
    @ShopifyAuth() shopify,
    @Body() body: any,
    @Res() response,
  ): Promise<any> {
    const data = await this.importProducCsv.processImportProductCsv(
      shopify.shop,
    );
    return response.status(200).json({ data });
  }
}
