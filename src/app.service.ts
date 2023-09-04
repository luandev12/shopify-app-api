import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { Logger } from './logger/logger.decorator';

@Injectable()
export class AppService {
  constructor(@Logger('AppService') private logger: LoggerService) {}

  getHello(): string {
    this.logger.log('Hello World');
    return 'Hello World!';
  }
}
