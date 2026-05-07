import { ValidationException } from '@core/exceptions';
import { ValidationError } from '@nestjs/common';

export interface ValidationFieldError {
    field: string;
    errors: string[];
}

const extractErrors = (
    error: ValidationError,
    parentPath = '',
): ValidationFieldError[] => {
    const fieldPath = parentPath ? `${parentPath}.${error.property}` : error.property;

    const current: ValidationFieldError[] = [];

    if (error.constraints) {
        current.push({
            field: fieldPath,
            errors: Object.values(error.constraints),
        });
    }

    if (error.children?.length) {
        for (const child of error.children) {
            current.push(...extractErrors(child, fieldPath));
        }
    }

    return current;
};

export const exceptionFactory = (
    validationErrors: ValidationError[] = [],
): ValidationException => {
    const formatted = validationErrors.flatMap(err => extractErrors(err));
    return new ValidationException(formatted);
};
