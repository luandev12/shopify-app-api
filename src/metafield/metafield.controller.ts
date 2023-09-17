import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MetafieldService } from './metafield.service';
import { CustomerMetaFieldRequest } from './dto';

@Controller('customers')
export class MetafieldController {
  constructor(private readonly metafieldService: MetafieldService) {}

  @Get('/metafield')
  async getCustomers() {
    const resp = await this.metafieldService.getCustomer();

    return resp;
  }

  @Post('/metafield')
  async updateMetafield(
    @Param('ownerId') ownerId,
    @Body() metafield: CustomerMetaFieldRequest,
  ) {
    const resp = await this.metafieldService.updateMetafield(metafield);
  }

  @Delete('/metafield/:metaFieldId')
  async updateCustomers(@Param('metaFieldId') ownerId) {
    const resp = await this.metafieldService.deleteMetafield(ownerId);
  }
}
