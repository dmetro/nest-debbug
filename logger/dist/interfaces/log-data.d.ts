export interface LogData {
    level: string;
    message: string;
    context: any;
    [key: string]: any;
}
