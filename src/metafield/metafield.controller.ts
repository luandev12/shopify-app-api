import { Controller, Get } from '@nestjs/common';
import { MetafieldService } from './metafield.service';

@Controller('metafield')
export class MetafieldController {
  constructor(private readonly metafieldService: MetafieldService) {}
  @Get('/customers')
  async getCustomers() {
    const resp = await this.metafieldService.getCustomer();

    return resp;
  }
}
