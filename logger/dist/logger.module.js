"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var LoggerModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerModule = void 0;
const common_1 = require("@nestjs/common");
const filters_1 = require("./filters");
const logger_1 = require("./logger");
let LoggerModule = LoggerModule_1 = class LoggerModule {
    static forRoot(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggerOptionsProvider = {
                provide: 'LoggerOptions',
                useValue: options,
            };
            const loggerProvider = {
                provide: 'Logger',
                useFactory: () => __awaiter(this, void 0, void 0, function* () { return yield LoggerModule_1.loggerFactory(options); }),
            };
            return {
                module: LoggerModule_1,
                providers: [
                    loggerOptionsProvider,
                    loggerProvider,
                ],
                exports: [loggerProvider],
            };
        });
    }
    static loggerFactory(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('loggerFactory', options);
            const logger = new logger_1.Logger(options);
            return logger;
        });
    }
    static initializeLoggerDependencies(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultPollingInterval = 10;
            const defaultDataType = 'logging';
            if (!options.serviceName) {
                throw new Error(`Service name not provided`);
            }
            return Promise.resolve(null);
        });
    }
};
LoggerModule = LoggerModule_1 = __decorate([
    common_1.Module({
        imports: [],
        providers: [logger_1.Logger, filters_1.AllExceptionsFilter],
        exports: [logger_1.Logger, filters_1.AllExceptionsFilter],
    })
], LoggerModule);
exports.LoggerModule = LoggerModule;
//# sourceMappingURL=logger.module.js.map