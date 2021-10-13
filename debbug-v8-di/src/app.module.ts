import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerModule, LoggerTransportType, LogLevel } from '@dimago/logger_ctlm';
import { AppService } from './app.service';

export const SERVICE_NAME = 'dimago-service';

@Module({
  imports: [
    LoggerModule.forRoot({
      serviceName: SERVICE_NAME,
      level: (process.env.LOG_LEVEL as LogLevel) || LogLevel.Information,
      transport: {
        type: LoggerTransportType.Udp,
        host: process.env.LOG_TRANSPORT_HOST || 'localhost',
        port: 5045,
      },
      console: {
        enabled: true,
      }      
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,

  ],
})
export class AppModule {}