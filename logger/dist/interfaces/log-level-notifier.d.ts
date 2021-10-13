import { Subject } from "rxjs";
import { LogLevel } from "./log-level";
export interface ILogLevelNotifier {
    startNotifications(): any;
    stopNotifications(): any;
    onLogLevelChange: Subject<LogLevel>;
}
