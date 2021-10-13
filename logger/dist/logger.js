"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston = require("winston");
const logger_transport_type_1 = require("./interfaces/logger-transport-type");
const log_level_1 = require("./interfaces/log-level");
const _1 = require(".");
class Logger {
    constructor(options, notifier) {
        this.options = options;
        this.notifier = notifier;
        console.log('LoggerOptions', options);
        console.log('notifier', notifier);
        if (!options) {
            throw new Error(`'options' must not be null or undefined`);
        }
        if (!options.console && !options.transport) {
            throw new Error(`either 'options.console' or 'options.transport' must be provided`);
        }
        this.isDevelopment =
            !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
        const consoleFormatProvider = (msg) => {
            if (options.console && options.console.format) {
                return options.console.format(Object.assign(Object.assign({}, msg), { context: msg.meta }));
            }
            const jsonFormat = json => {
                if (!json) {
                    return '';
                }
                return `\n${JSON.stringify(json, null, 2)}`;
            };
            return `${new Date().toLocaleTimeString('en', { hour12: false })} [${msg.level}] ${msg.message}${jsonFormat(msg.error)}${jsonFormat(msg.meta)}`;
        };
        const transports = [];
        if (options.console) {
            transports.push(new winston.transports.Console({
                format: winston.format.combine(winston.format.splat(), winston.format.label({ label: options.serviceName }), winston.format.timestamp(), winston.format.colorize(), winston.format.json(), winston.format.printf(consoleFormatProvider)),
            }));
        }
        if (options.transport &&
            options.transport.type === logger_transport_type_1.LoggerTransportType.Udp) {
            const udp = new _1.UdpTransport({
                host: options.transport.host || 'localhost',
                port: options.transport.port || 5045,
                format: winston.format.combine(winston.format(info => (Object.assign(Object.assign({}, info), { application: options.serviceName })))(), winston.format.json(), winston.format.timestamp()),
            });
            transports.push(udp);
        }
        this.logger = winston.createLogger({
            transports,
            level: options.level || log_level_1.LogLevel.Information,
        });
        if (notifier) {
            notifier.onLogLevelChange.subscribe(logLevel => {
                this.logger.transports.forEach(transport => (transport.level = logLevel));
            });
            notifier.startNotifications();
        }
    }
    debug(message, context) {
        this.logger.debug(message, { context });
    }
    warn(message, context) {
        this.logger.warn(message, { context });
    }
    info(message, context, debugOnlyContext) {
        if (context && (!debugOnlyContext || this.logger.isDebugEnabled())) {
            this.logger.info(message, { context });
        }
        else {
            this.logger.info(message);
        }
    }
    error(message, error, context) {
        if (!error) {
            this.logger.error(message, { context });
        }
        else {
            this.logger.error(message, { error }, { context });
        }
    }
    crit(message, error, context) {
        if (!error) {
            this.logger.error(message, { context });
        }
        else {
            this.logger.error(message, { error }, { context });
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map