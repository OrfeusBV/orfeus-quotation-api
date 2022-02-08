import { ConfigService } from '@nestjs/config';
import { TimingInterceptor } from './interceptors/timing.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.useGlobalInterceptors(new TimingInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableShutdownHooks();
  await app.listen(app.get(ConfigService).get('PORT') || 3000);
}
bootstrap();
