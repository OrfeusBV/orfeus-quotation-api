import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new Logger(this.constructor.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const logLine = `${request.method} ${request.url} ${status}`;
    const isInternalServerError = status >= 500 && status <= 600;
    const exceptionResponse = exception.getResponse();
    this.logger.debug(exceptionResponse, exception.stack);
    if (isInternalServerError) {
      this.logger.error(logLine);
    } else {
      this.logger.log(logLine);
    }
    response.status(status).json(exceptionResponse);
  }
}
