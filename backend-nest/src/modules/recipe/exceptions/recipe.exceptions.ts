import { ApiCodeResponse } from "@core/api";
import { ForbiddenException, NotFoundException } from "@nestjs/common";

export class RecipeNotFoundException extends NotFoundException {
    constructor() {
        super(ApiCodeResponse.RECIPE_NOT_FOUND);
    }
}

export class RecipeForbiddenActionException extends ForbiddenException {
    constructor() {
        super(ApiCodeResponse.RECIPE_FORBIDDEN_ACTION);
    }
}
