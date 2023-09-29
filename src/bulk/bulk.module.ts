import { Module } from '@nestjs/common';
import { BulkController } from './bulk.controller';
import { BulkService } from './bulk.service';
import AppConstant from 'src/constants/app';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [BulkService, AppConstant, PrismaService],
  controllers: [BulkController],
})
export class BulkModule {}
