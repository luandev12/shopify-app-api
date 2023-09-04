import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/search')
  async searchEmail(@Req() request: Request, @Res() response: Response) {
    const customer = await this.customerService.searchEmail(request.body);

    if (!customer.status) {
      return response.status(400).json(customer);
    }
    return response.status(200).json(customer);
  }

  @Post('/metafield/search')
  async searchMetaField(@Req() request: Request, @Res() response: Response) {
    const metaField = await this.customerService.searchMetaField(request.body);

    if (!metaField.status) {
      return response.status(400).json(metaField);
    }
    return response.status(200).json(metaField);
  }

  @Post('/metafield/create')
  async createMetaField(@Req() request: Request, @Res() response: Response) {
    const metaField = await this.customerService.createMetaField(request.body);

    if (!metaField.status) {
      return response.status(400).json(metaField);
    }
    return response.status(200).json(metaField);
  }

  @Post('/metafield/update')
  async updateMetaField(@Req() request: Request, @Res() response: Response) {
    const metaField = await this.customerService.updateMetaField(request.body);

    if (!metaField.status) {
      return response.status(400).json(metaField);
    }
    return response.status(200).json(metaField);
  }
}
