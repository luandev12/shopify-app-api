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

@Controller('customers')
export class MetafieldController {
  constructor(private readonly metafieldService: MetafieldService) {}

  @Get('/metafield')
  async getCustomers(@Res() res) {
    const resp = await this.metafieldService.getCustomer(res.locals.shop);

    return res.json(resp);
  }

  @Post('/metafield')
  async updateMetafield(
    @Res() res,
    @Param('ownerId') ownerId,
    @Body() metafield: CustomerMetaFieldRequest,
  ) {
    const resp = await this.metafieldService.updateMetafield(
      res.locals.shop,
      metafield,
    );

    return res.json(resp);
  }

  @Delete('/metafield/:metaFieldId')
  async updateCustomers(@Res() res, @Param('metaFieldId') ownerId) {
    const resp = await this.metafieldService.deleteMetafield(
      res.locals.shop,
      ownerId,
    );

    return res.json(resp);
  }
}
