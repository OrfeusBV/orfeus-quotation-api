import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  logger = new Logger(this.constructor.name);
  getHello(): string {
    return 'Hello World!';
  }

  onApplicationShutdown(signal: string) {
    this.logger.log(`${signal}. Shutting down...`);
  }
}
