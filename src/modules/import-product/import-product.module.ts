import { Module } from '@nestjs/common';

import { ImportProductController } from './import-product.controller';
import { ImportProductService } from './import-product.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ImportProductController],
  providers: [ImportProductService, PrismaService],
})
export class ImportProductModule {}
