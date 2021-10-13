import { ILogger } from './interfaces/logger.interface';
import { LoggerOptions } from './interfaces/logger-options.interface';
import * as winston from 'winston';
import { ILogLevelNotifier } from './interfaces/log-level-notifier';
export declare class Logger implements ILogger {
    readonly options: LoggerOptions;
    readonly notifier?: ILogLevelNotifier;
    readonly logger: winston.Logger;
    readonly isDevelopment: boolean;
    constructor(options: LoggerOptions, notifier?: ILogLevelNotifier);
    debug(message: string, context?: object): void;
    warn(message: string, context?: object): void;
    info(message: string, context?: object, debugOnlyContext?: boolean): void;
    error(message: string, error?: Error, context?: object): void;
    crit(message: string, error?: Error, context?: object): void;
}
