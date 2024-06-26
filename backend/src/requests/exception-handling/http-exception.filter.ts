import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
  HttpStatus,
  ImATeapotException,
} from '@nestjs/common';
// import { Request, Response } from 'express';
import { join } from 'path';

/**
 * Filter NotFound Exceptions and give custom response
 * Is logging the responses, and returns JSON if custom Response message,
 * otherwise returns JSON (May be needed in frontend)
 * Ugly but it works
 */
@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const exceptionCause = exception.getResponse();

    const response = ctx.getResponse();
    if (typeof exceptionCause == 'object') {
      const regexp = new RegExp(`^Cannot GET \\/[\\w\\/]*`);
      if (
        // @ts-ignore
        !(exceptionCause.message === 'undefined' || regexp.test(exceptionCause.message)) // eslint-disable-line
      ) {
        // custom message detected -> returns JSON
        response.status(HttpStatus.NOT_FOUND).json({
          ...exceptionCause,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        return;
      }
    }
    // ordinary message -> returns HTML site
    response
      .status(HttpStatus.NOT_FOUND)
      .sendFile(join(`${process.cwd()}/static/404.html`));
  }
}

/**
 * Catches the ImATeapotException and response with a static HTML file,
 * is logging the incident
 */
@Catch(ImATeapotException)
export class ImATeapotFilter implements ExceptionFilter {
  // @ts-ignore
  catch(_exception: ImATeapotException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response
      .status(HttpStatus.I_AM_A_TEAPOT)
      .sendFile(join(`${process.cwd()}/static/418.html`));
  }
}
