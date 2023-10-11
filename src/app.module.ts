import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import AppConstant from './constants/app';

import { LoggerModule } from './modules/logger/logger.module';
import { AuthorModule } from './modules/authors/author.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { ProductsModule } from './modules/products/products.module';
import { MetafieldModule } from './modules/metafield/metafield.module';
import { BulkModule } from './modules/bulk/bulk.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { AuthMiddleware } from './modules/authors/author.middleware';
import { ImportProductModule } from './modules/import-product/import-product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    LoggerModule.forRoot(),
    AuthorModule,
    WebhooksModule,
    ProductsModule,
    MetafieldModule,
    BulkModule,
    ImportProductModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AppConstant],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('products');
    consumer.apply(AuthMiddleware).forRoutes('customers');
    consumer.apply(AuthMiddleware).forRoutes('bulk');
    consumer.apply(AuthMiddleware).forRoutes('import-product');
  }
}
