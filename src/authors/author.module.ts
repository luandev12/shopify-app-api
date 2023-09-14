import { Module } from '@nestjs/common';
import { AuthorServices } from './author.services';
import { AuthorController } from './author.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import AppConstant from 'src/constants/app';

@Module({
  imports: [],
  providers: [AuthorServices, PrismaService, AppConstant],
  exports: [AuthorServices],
  controllers: [AuthorController],
})
export class AuthorModule {}
