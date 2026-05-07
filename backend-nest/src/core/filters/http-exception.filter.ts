import {
    Catch,
    HttpException,
    ExceptionFilter,
    ArgumentsHost
} from "@nestjs/common";
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status = exception.getStatus();
        const exceptionResponse =  exception.getResponse();

        let payload: unknown; // unknown any becaouse cleaner

        // Payload already structured (ValidationException, ApiException, etc)
        if (typeof exceptionResponse === 'object') {
            payload = exceptionResponse;
        }

        // payload string (e.g. throw new BadRequestException("Oups"))
        else {
            payload = {
                statusCode: status,
                message: exceptionResponse,
                errorCode: 'UNHANDLED_ERROR',
            };
        }

        response.status(status).json(payload);
    }
}
