import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationFieldError } from '@core/exceptions';

export interface ValidationErrorPayload {
    statusCode: number;
    message: string;
    errorCode: string;
    errors: ValidationFieldError[];
}

export class ValidationException extends HttpException {
    constructor(errors: ValidationFieldError[]) {
        const response: ValidationErrorPayload = {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Validation failed',
            errorCode: 'VALIDATION_ERROR',
            errors,
        };

        super(response, HttpStatus.BAD_REQUEST);
    }
}
