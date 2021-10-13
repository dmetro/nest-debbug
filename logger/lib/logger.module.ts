import { Module, DynamicModule } from '@nestjs/common';
import { AllExceptionsFilter } from './filters';
import { LoggerOptions } from './interfaces/logger-options.interface';
import { ILogger } from './interfaces/logger.interface';
import { Logger } from './logger';


@Module({
  imports: [],
  providers: [Logger,AllExceptionsFilter],
  exports: [Logger,AllExceptionsFilter],
})
export class LoggerModule {
  static async forRoot(options: LoggerOptions): Promise<DynamicModule> {
    const loggerOptionsProvider = {
      provide: 'LoggerOptions',
      useValue: options,
    };

    const loggerProvider = {
      provide: 'Logger',
      useFactory: async () => await LoggerModule.loggerFactory(options),
    };

    return {
      module: LoggerModule,
      providers: [
        loggerOptionsProvider,
        loggerProvider,
      ],
      exports: [loggerProvider],
    };
  }

  private static async loggerFactory(options: LoggerOptions): Promise<ILogger> {
  //  const ctlmLogLevelPoller = await LoggerModule.initializeLoggerDependencies(options);
    console.log('loggerFactory',options)
    const logger = new Logger(options);
    return logger;
  }

  private static async initializeLoggerDependencies(options: LoggerOptions): Promise<any> {

    // const ctlmOptions = options.ctlm;
    const defaultPollingInterval = 10;
    const defaultDataType = 'logging';

    if (!options.serviceName) {
      throw new Error(`Service name not provided`);
    }

  

    return Promise.resolve(null);
  }

}
