import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Logger } from '../logger';
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger;
    constructor(logger: Logger);
    catch(error: any, host: ArgumentsHost): void;
}
