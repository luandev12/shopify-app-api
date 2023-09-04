import { Module } from '@nestjs/common';
import { AuthorServices } from './author.services';
import { AuthorController } from './author.controller';

@Module({
  imports: [],
  providers: [AuthorServices],
  exports: [AuthorServices],
  controllers: [AuthorController],
})
export class AuthorModule {}
