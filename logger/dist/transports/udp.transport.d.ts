import Transport = require('winston-transport');
export declare class UdpTransport extends Transport {
    private readonly options;
    private client;
    constructor(options: any);
    log(info: any, callback: any): any;
    private connect;
    private send;
    private coerceOptions;
}
