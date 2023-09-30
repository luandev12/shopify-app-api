import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import AppConstant from 'src/constants/app';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly appConstant: AppConstant) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Unauthorized access');
    }

    try {
      const decoded = jwt.verify(token, process.env.SHOPIFY_API_SECRET);
      const shop = decoded.dest.replace(this.appConstant.HTTP_PREFIX, '');

      res.locals.shop = shop;
      next();
    } catch (error) {
      console.log(
        '%cauthor.middleware.ts line:37 error',
        'color: #007acc;',
        error,
      );
      throw new UnauthorizedException('Unauthorized access');
    }
  }
}
