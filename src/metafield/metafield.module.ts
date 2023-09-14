import { Module } from '@nestjs/common';
import { MetafieldController } from './metafield.controller';
import { MetafieldService } from './metafield.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MetafieldController],
  providers: [MetafieldService, PrismaService],
})
export class MetafieldModule {}
