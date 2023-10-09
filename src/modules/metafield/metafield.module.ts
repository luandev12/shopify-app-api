import { Module } from '@nestjs/common';
import { MetafieldController } from './metafield.controller';
import { MetafieldService } from './metafield.service';
import { PrismaService } from '../prisma/prisma.service';

import AppConstant from 'src/constants/app';

@Module({
  imports: [],
  providers: [MetafieldService, PrismaService, AppConstant],
  controllers: [MetafieldController],
})
export class MetafieldModule {}
