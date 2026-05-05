import { ConflictException } from "@nestjs/common/exceptions/conflict.exception";

export class EmailAlreadyExistException extends ConflictException {
    constructor() {
        super('api.exception.email_already_exists');
    }
}

export class NicknameAlreadyExistException extends ConflictException {
    constructor() {
        super('api.exception.nickname_already_exists');
    }
}
