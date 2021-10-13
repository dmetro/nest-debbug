import { Subject } from "rxjs";
import { LogLevel } from "./log-level";

export interface ILogLevelNotifier {
  startNotifications();
  stopNotifications();
  onLogLevelChange: Subject<LogLevel>;
}