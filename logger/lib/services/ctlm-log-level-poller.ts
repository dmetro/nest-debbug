import { interval, Observable, Subject, Subscription } from "rxjs";
import { CtlmServiceClient } from "../clients/ctlm-service-client";
import { LogLevel } from "../interfaces";
import { ILogLevelNotifier } from "../interfaces/log-level-notifier";

export class CtlmLogLevelPoller implements ILogLevelNotifier {

  private currentLogLevel: LogLevel;
  private interval: Observable<number>;
  private subscription: Subscription;
  public onLogLevelChange = new Subject<LogLevel>();

  constructor(private readonly client: CtlmServiceClient, private readonly intervalSeconds, initialLogLevel: LogLevel) {
    this.currentLogLevel = initialLogLevel;
  }

  public startNotifications() {
    this.interval = interval(this.intervalSeconds * 1000);
    this.subscription = this.interval
      .subscribe(async (_) => {
        try {
          const response = await this.client.getLogLevel({ active: true, logLevel: this.currentLogLevel });

          if (this.currentLogLevel !== response.logLevel) {
            this.currentLogLevel = response.logLevel;
            this.onLogLevelChange.next(this.currentLogLevel);
          }
        }

        catch (ex) { }
      });
  }

  public stopNotifications() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

}