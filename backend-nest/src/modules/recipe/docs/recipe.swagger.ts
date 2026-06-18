import { ApiOperationOptions } from "@nestjs/swagger";

export const RecipeControllerCreateDocumentation: ApiOperationOptions = {
    summary: 'Create a new recipe manually',
}

export const RecipeControllerUpdateDocumentation: ApiOperationOptions = {
    summary: 'Update a recipe',
};

export const RecipeControllerDeleteDocumentation: ApiOperationOptions = {
    summary: 'Delete a recipe',
};

export const RecipeControllerListDocumentation: ApiOperationOptions = {
    summary: 'List all recipes',
};

export const RecipeControllerDetailsDocumentation: ApiOperationOptions = {
    summary: 'Get recipe details',
};
