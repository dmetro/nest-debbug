import { Subject } from "rxjs";
import { CtlmServiceClient } from "../clients/ctlm-service-client";
import { LogLevel } from "../interfaces";
import { ILogLevelNotifier } from "../interfaces/log-level-notifier";
export declare class CtlmLogLevelPoller implements ILogLevelNotifier {
    private readonly client;
    private readonly intervalSeconds;
    private currentLogLevel;
    private interval;
    private subscription;
    onLogLevelChange: Subject<LogLevel>;
    constructor(client: CtlmServiceClient, intervalSeconds: any, initialLogLevel: LogLevel);
    startNotifications(): void;
    stopNotifications(): void;
}
