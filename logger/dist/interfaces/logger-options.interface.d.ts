import { LoggerTransportType } from './logger-transport-type';
import { LogLevel } from './log-level';
import { LogData } from './log-data';
export interface LoggerOptions {
    serviceName: string;
    level?: LogLevel;
    transport?: {
        type: LoggerTransportType;
        host: string;
        port: number;
    };
    console?: {
        enabled: boolean;
        format?: (msg: LogData) => string;
    };
}
