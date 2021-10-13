import { LogLevel } from "./log-level";

export interface LogLevelState {
	active: boolean;
	logLevel: LogLevel;
}