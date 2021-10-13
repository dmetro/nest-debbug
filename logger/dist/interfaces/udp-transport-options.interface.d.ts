import * as TransportStream from 'winston-transport';
export interface UdpTransportOptions extends TransportStream.TransportStreamOptions {
    host: string;
    port: number;
    trailingLineFeed?: boolean;
    trailingLineFeedChar?: string;
    silent?: boolean;
}
