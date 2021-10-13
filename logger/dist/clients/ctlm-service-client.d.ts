import * as axios from 'axios';
import { LogLevelState } from '../interfaces/log-level-state';
export declare class CtlmServiceClient {
    private readonly serviceName;
    private httpClient;
    private ctlmUrl;
    private ctlmDataType;
    constructor(serviceName: string, url: string, dataType: string);
    getLogLevel(logLevelState: LogLevelState): Promise<LogLevelState>;
    registerService(logLevelState: LogLevelState): Promise<axios.AxiosResponse<any>>;
    private logLevelToSeverity;
    private severityToLogLevel;
}
