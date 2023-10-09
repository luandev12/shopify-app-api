import { Module } from '@nestjs/common';
import { AuthorServices } from './author.services';
import { AuthorController } from './author.controller';
import AppConstant from 'src/constants/app';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  providers: [AuthorServices, PrismaService, AppConstant],
  exports: [AuthorServices],
  controllers: [AuthorController],
})
export class AuthorModule {}
