import { ApiCodeResponse } from "@core/api";
import { ConflictException } from "@nestjs/common/exceptions/conflict.exception";

export class EmailAlreadyExistException extends ConflictException {
    constructor() {
        super(ApiCodeResponse.EMAIL_ALREADY_EXISTS);
    }
}

export class NicknameAlreadyExistException extends ConflictException {
    constructor() {
        super(ApiCodeResponse.NICKNAME_ALREADY_EXISTS);
    }
}
