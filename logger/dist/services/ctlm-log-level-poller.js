"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CtlmLogLevelPoller = void 0;
const rxjs_1 = require("rxjs");
class CtlmLogLevelPoller {
    constructor(client, intervalSeconds, initialLogLevel) {
        this.client = client;
        this.intervalSeconds = intervalSeconds;
        this.onLogLevelChange = new rxjs_1.Subject();
        this.currentLogLevel = initialLogLevel;
    }
    startNotifications() {
        this.interval = rxjs_1.interval(this.intervalSeconds * 1000);
        this.subscription = this.interval
            .subscribe((_) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.getLogLevel({ active: true, logLevel: this.currentLogLevel });
                if (this.currentLogLevel !== response.logLevel) {
                    this.currentLogLevel = response.logLevel;
                    this.onLogLevelChange.next(this.currentLogLevel);
                }
            }
            catch (ex) { }
        }));
    }
    stopNotifications() {
        if (this.subscription)
            this.subscription.unsubscribe();
    }
}
exports.CtlmLogLevelPoller = CtlmLogLevelPoller;
//# sourceMappingURL=ctlm-log-level-poller.js.map