import * as dgram from 'dgram';
import * as os from 'os';
import Transport = require('winston-transport');
import { UdpTransportOptions } from '../interfaces';


/* eslint-disable no-empty-function */
function noop() {}
/* eslint-enable no-empty-function */

export class UdpTransport extends Transport {
  private readonly options: UdpTransportOptions;
  private client: dgram.Socket;

  constructor(options) {
    super(options);

    this.options = this.coerceOptions(options);
    this.connect()
  }
  
  log(info, callback) {
    if (this.silent) {
      return callback(null, true)
    }

    this.send(info[Symbol.for('message')], (err) => {
      try {
        this.emit('logged', !err);
        callback(err, !err);
      } catch {}
    })
  }

  private connect() {
    this.client = dgram.createSocket('udp4')
    this.client.unref()
  }

  private send(message: string, callback) {
    if (this.options.trailingLineFeed === true) {
      message = `${message.replace(/\s+$/, '')}${this.options.trailingLineFeedChar}`;
    }

    const buf = Buffer.from(message);
    if (!this.client) {
      this.connect();
    }

    this.client.send(buf, 0, buf.length, this.options.port, this.options.host, (callback || noop))
  }

  private coerceOptions(options: UdpTransportOptions): UdpTransportOptions {
    return {
      ...options,
      trailingLineFeed: options.trailingLineFeed === true,
      trailingLineFeedChar: options.trailingLineFeedChar || os.EOL,
      silent: options.silent === true,
    };
  }
}