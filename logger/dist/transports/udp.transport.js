"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UdpTransport = void 0;
const dgram = require("dgram");
const os = require("os");
const Transport = require("winston-transport");
function noop() { }
class UdpTransport extends Transport {
    constructor(options) {
        super(options);
        this.options = this.coerceOptions(options);
        this.connect();
    }
    log(info, callback) {
        if (this.silent) {
            return callback(null, true);
        }
        this.send(info[Symbol.for('message')], (err) => {
            try {
                this.emit('logged', !err);
                callback(err, !err);
            }
            catch (_a) { }
        });
    }
    connect() {
        this.client = dgram.createSocket('udp4');
        this.client.unref();
    }
    send(message, callback) {
        if (this.options.trailingLineFeed === true) {
            message = `${message.replace(/\s+$/, '')}${this.options.trailingLineFeedChar}`;
        }
        const buf = Buffer.from(message);
        if (!this.client) {
            this.connect();
        }
        this.client.send(buf, 0, buf.length, this.options.port, this.options.host, (callback || noop));
    }
    coerceOptions(options) {
        return Object.assign(Object.assign({}, options), { trailingLineFeed: options.trailingLineFeed === true, trailingLineFeedChar: options.trailingLineFeedChar || os.EOL, silent: options.silent === true });
    }
}
exports.UdpTransport = UdpTransport;
//# sourceMappingURL=udp.transport.js.map