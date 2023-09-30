import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthorModule } from './authors/author.module';
import { LoggerModule } from './logger/logger.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { ProductsModule } from './products/products.module';
import { PrismaService } from './prisma/prisma.service';
import { MetafieldModule } from './metafield/metafield.module';
import { BulkModule } from './bulk/bulk.module';
import { AuthMiddleware } from './authors/author.middleware';
import AppConstant from './constants/app';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    LoggerModule.forRoot(),
    AuthorModule,
    WebhooksModule,
    ProductsModule,
    MetafieldModule,
    BulkModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AppConstant],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('products');
    consumer.apply(AuthMiddleware).forRoutes('customers');
    consumer.apply(AuthMiddleware).forRoutes('bulk');
  }
}
