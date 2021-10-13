import { DynamicModule } from '@nestjs/common';
import { LoggerOptions } from './interfaces/logger-options.interface';
export declare class LoggerModule {
    static forRoot(options: LoggerOptions): Promise<DynamicModule>;
    private static loggerFactory;
    private static initializeLoggerDependencies;
}
