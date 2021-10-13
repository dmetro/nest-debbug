export interface ILogger {
    debug(message: string, context?: object): any;
    warn(message: string, context?: object): any;
    info(message: string, context?: object, debugOnlyContext?: boolean): any;
    error(message: string, exception?: any, context?: object): any;
    crit(message: string, exception?: any, context?: object): any;
}
