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
exports.CtlmServiceClient = void 0;
const axios = require("axios");
const interfaces_1 = require("../interfaces");
const ctlm_data_types_1 = require("../interfaces/ctlm-data-types");
class CtlmServiceClient {
    constructor(serviceName, url, dataType) {
        this.serviceName = serviceName;
        const ctlmApiPath = 'report/v1/servicestates';
        this.httpClient = axios.default;
        this.ctlmUrl = `${url}/${ctlmApiPath}/${serviceName}`;
        this.ctlmDataType = dataType;
    }
    getLogLevel(logLevelState) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.httpClient.get(this.ctlmUrl);
                const serviceStates = response.data[this.serviceName];
                const currentState = serviceStates.find(serviceState => serviceState.type === this.ctlmDataType);
                let severity;
                severity = parseInt(currentState.severity);
                if (isNaN(severity)) {
                    throw new Error('Log severity received is not a number');
                }
                return {
                    active: currentState.active,
                    logLevel: severity > 1 ? this.severityToLogLevel(currentState.severity) : null
                };
            }
            catch (ex) {
                if (ex.response && ex.response.status === 404) {
                    yield this.registerService(logLevelState);
                    return logLevelState;
                }
                else {
                    throw new Error('Failed to query for CTLM log level');
                }
            }
        });
    }
    registerService(logLevelState) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestBody = [
                {
                    type: ctlm_data_types_1.CtlmDataTypes.Logging,
                    severity: logLevelState.active ? this.logLevelToSeverity(logLevelState.logLevel) : "0"
                }
            ];
            try {
                const response = yield this.httpClient.post(this.ctlmUrl, requestBody);
                return response;
            }
            catch (ex) {
                throw new Error(ex);
            }
        });
    }
    logLevelToSeverity(logLevel) {
        switch (logLevel) {
            case interfaces_1.LogLevel.Debug:
                return "2";
            case interfaces_1.LogLevel.Information:
                return "3";
            case interfaces_1.LogLevel.Warning:
                return "4";
            case interfaces_1.LogLevel.Error:
                return "5";
            case interfaces_1.LogLevel.Critical:
                return "6";
        }
    }
    severityToLogLevel(severity) {
        switch (severity) {
            case "2":
                return interfaces_1.LogLevel.Debug;
            case "3":
                return interfaces_1.LogLevel.Information;
            case "4":
                return interfaces_1.LogLevel.Warning;
            case "5":
                return interfaces_1.LogLevel.Error;
            case "6":
                return interfaces_1.LogLevel.Critical;
        }
    }
}
exports.CtlmServiceClient = CtlmServiceClient;
//# sourceMappingURL=ctlm-service-client.js.map