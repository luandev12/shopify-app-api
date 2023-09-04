import { DynamicModule } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { createLoggerProviders } from './logger.providers';

export class LoggerModule {
  static forRoot(): DynamicModule {
    const prefixedLoggerProviders = createLoggerProviders();
    return {
      module: LoggerModule,
      providers: [
        {
          provide: LoggerService,
          useClass: LoggerService,
        },
        ...prefixedLoggerProviders,
      ],
      exports: [LoggerService, ...prefixedLoggerProviders],
    };
  }
}
