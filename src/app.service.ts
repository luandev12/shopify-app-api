import { Injectable } from '@nestjs/common';

import { Logger } from './modules/logger/logger.decorator';
import { LoggerService } from './modules/logger/logger.service';

@Injectable()
export class AppService {
  constructor(@Logger('AppService') private logger: LoggerService) {}

  getHello(): string {
    this.logger.log('Hello World');
    return 'Hello World!';
  }
}
