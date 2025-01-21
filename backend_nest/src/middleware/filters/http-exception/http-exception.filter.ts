import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let code = status;
    let msg = exception instanceof HttpException ? exception.message : exception;

    if (exception instanceof HttpException) {
      // @ts-ignore
      msg = exception.getResponse().resultMsg != null ? exception.getResponse().resultMsg : exception.message;
    } else {
    }

    try {
      // @ts-ignore
      code = exception.getResponse().resultCode != null ? exception.getResponse().resultCode : exception.getResponse().code;
    } catch (e) {
      code = status;
    }

    response.status(status).json({
      resultCode: code,
      resultMsg: msg,
      timestamp: new Date().toISOString(),
      path: request.url,
      reqBody: (Object.keys(request.body).length > 0) ? request.body : request.params,
      stack:
        exception instanceof HttpException && exception.stack != null
          ? exception.stack
          : exception,
    });
  }
}
