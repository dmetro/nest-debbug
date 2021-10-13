export interface ILogger {
  debug(message: string, context?: object);
  warn(message: string, context?: object);
  info(message: string, context?: object, debugOnlyContext?: boolean);
  error(message: string, exception?: any, context?: object);
  crit(message: string, exception?: any, context?: object);
}
