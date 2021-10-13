import { ILogger } from './interfaces/logger.interface';
import { LoggerOptions } from './interfaces/logger-options.interface';
import * as winston from 'winston';
import { LoggerTransportType } from './interfaces/logger-transport-type';
import { LogLevel } from './interfaces/log-level';
import { UdpTransport } from '.';
import { TransformableInfo } from 'logform';
import { ILogLevelNotifier } from './interfaces/log-level-notifier';

export class Logger implements ILogger {
  readonly logger: winston.Logger;
  readonly isDevelopment: boolean;

  constructor(
    readonly options: LoggerOptions,
    readonly notifier?: ILogLevelNotifier,
  ) {
    console.log('LoggerOptions',options);
    console.log('notifier',notifier);
    if (!options) {
      throw new Error(`'options' must not be null or undefined`);
    }

    if (!options.console && !options.transport) {
      throw new Error(
        `either 'options.console' or 'options.transport' must be provided`,
      );
    }

    this.isDevelopment =
      !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    const consoleFormatProvider = (msg: TransformableInfo) => {
      if (options.console && options.console.format) {
        return options.console.format({
          ...msg,
          context: msg.meta,
        });
      }

      const jsonFormat = json => {
        if (!json) {
          return '';
        }

        return `\n${JSON.stringify(json, null, 2)}`;
      };

      return `${new Date().toLocaleTimeString('en', { hour12: false })} [${
        msg.level
      }] ${msg.message}${jsonFormat(msg.error)}${jsonFormat(msg.meta)}`;
    };

    const transports = [];
    if (options.console) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.splat(),
            winston.format.label({ label: options.serviceName }),
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.json(),
            winston.format.printf(consoleFormatProvider),
          ),
        }),
      );
    }

    if (
      options.transport &&
      options.transport.type === LoggerTransportType.Udp
    ) {
      const udp = new UdpTransport({
        host: options.transport.host || 'localhost',
        port: options.transport.port || 5045,
        format: winston.format.combine(
          winston.format(info => ({
            ...info,
            application: options.serviceName,
          }))(),
          winston.format.json(),
          winston.format.timestamp(),
        ),
      });
      transports.push(udp);
    }

    this.logger = winston.createLogger({
      transports,
      level: options.level || LogLevel.Information,
    });

    if (notifier) {
      notifier.onLogLevelChange.subscribe(logLevel => {
        this.logger.transports.forEach(
          transport => (transport.level = logLevel),
        );
      });
      notifier.startNotifications();
    }
  }

  debug(message: string, context?: object) {
    this.logger.debug(message, { context });
  }

  warn(message: string, context?: object) {
    this.logger.warn(message, { context });
  }

  info(message: string, context?: object, debugOnlyContext?: boolean) {
    if (context && (!debugOnlyContext || this.logger.isDebugEnabled())) {
      this.logger.info(message, { context });
    } else {
      this.logger.info(message);
    }
  }

  error(message: string, error?: Error, context?: object) {
    if (!error) {
      this.logger.error(message, { context });
    } else {
      this.logger.error(message, { error }, { context });
    }
  }

  crit(message: string, error?: Error, context?: object) {
    if (!error) {
      this.logger.error(message, { context });
    } else {
      this.logger.error(message, { error }, { context });
    }
  }
}
