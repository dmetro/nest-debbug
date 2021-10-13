import * as axios from 'axios';
import { RegisterServiceRequestDto } from '../dtos/register-service-request-dto';
import { ServiceStateDto } from '../dtos/service-state-dto';
import { LogLevel } from '../interfaces';
import { CtlmDataTypes } from '../interfaces/ctlm-data-types';
import { LogLevelState } from '../interfaces/log-level-state';

export class CtlmServiceClient {

  private httpClient: axios.AxiosStatic;
  private ctlmUrl: string;
  private ctlmDataType: string;

  constructor(private readonly serviceName: string, url: string, dataType: string) {
    const ctlmApiPath = 'report/v1/servicestates';
    this.httpClient = axios.default;
    this.ctlmUrl = `${url}/${ctlmApiPath}/${serviceName}`;
    this.ctlmDataType = dataType;
  }

  public async getLogLevel(logLevelState: LogLevelState): Promise<LogLevelState> {
    try {
      const response: axios.AxiosResponse<ServiceStateDto[]> = await this.httpClient.get(this.ctlmUrl);
      const serviceStates = response.data[this.serviceName];
      const currentState = serviceStates.find(serviceState => serviceState.type === this.ctlmDataType);
      let severity: number;

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
      // We want to register service again in case that specified service was not found.
      // This may happen for example if somone clears the CTLM cache.
      if (ex.response && ex.response.status === 404) {
        await this.registerService(logLevelState);
        return logLevelState;
      }
      else {
        throw new Error('Failed to query for CTLM log level');
      }
    }
  }

  public async registerService(logLevelState: LogLevelState) {
    const requestBody: RegisterServiceRequestDto[] = [
      {
        type: CtlmDataTypes.Logging,
        severity: logLevelState.active ? this.logLevelToSeverity(logLevelState.logLevel) : "0"
      }
    ];

    try {
      const response = await this.httpClient.post(this.ctlmUrl, requestBody);
      return response;
    }

    catch (ex) {
      throw new Error(ex);
    }

  }

  private logLevelToSeverity(logLevel: LogLevel): string {
    switch (logLevel) {
      case LogLevel.Debug:
        return "2";
      case LogLevel.Information:
        return "3";
      case LogLevel.Warning:
        return "4";
      case LogLevel.Error:
        return "5";
      case LogLevel.Critical:
        return "6";
    }
  }

  private severityToLogLevel(severity: string): LogLevel {
    switch (severity) {
      case "2":
        return LogLevel.Debug;
      case "3":
        return LogLevel.Information;
      case "4":
        return LogLevel.Warning;
      case "5":
        return LogLevel.Error;
      case "6":
        return LogLevel.Critical;
    }
  }
}