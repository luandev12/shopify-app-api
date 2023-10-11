import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ShopifyAuth = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.shopify;
  },
);
