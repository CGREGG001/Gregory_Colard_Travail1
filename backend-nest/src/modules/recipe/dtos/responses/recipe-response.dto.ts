import { ApiProperty } from '@nestjs/swagger';
import { Recipe } from '@recipe/entities';

/**
 * DTO used for input/output validation.
 * All properties are optional because DTOs are instantiated
 * by class-transformer and not via a constructor.
 * This avoids strictPropertyInitialization errors.
 */
export class RecipeResponseDto {
    @ApiProperty({
        example: 'a3f1c2d4-5678-90ab-cdef-1234567890ab',
        description: 'Unique identifier of the recipe',
    })
    id?: string;

    @ApiProperty({
        example: 'Pâtes carbonara',
        description: 'Title of the recipe',
    })
    title?: string;

    @ApiProperty({
        example: 'Une délicieuse recette italienne prête en 20 minutes.',
        description: 'Short description of the recipe',
    })
    description?: string;

    @ApiProperty({
        example: ['Pâtes', 'Œufs', 'Lardons', 'Parmesan'],
        description: 'List of ingredients required for the recipe',
    })
    ingredients?: string[];

    @ApiProperty({
        example: 20,
        description: 'Preparation time in minutes',
    })
    preparationTime?: number;

    @ApiProperty({
        example: 'b7e9f3a1-1234-5678-90ab-cdef12345678',
        description: 'Identifier of the member who authored the recipe',
    })
    authorId?: string;

    /**
     * Maps a Recipe entity to a RecipeResponseDto.
     * 
     * @param recipe - The Recipe entity from the database.
     * @returns A mapped RecipeResponseDto.
     */
    static fromEntity(recipe: Recipe): RecipeResponseDto {
        const dto = new RecipeResponseDto();

        dto.id = recipe.id;
        dto.title = recipe.title;
        dto.description = recipe.description;
        dto.ingredients = recipe.ingredients;
        dto.preparationTime = recipe.preparationTime;

        dto.authorId = recipe.author?.id; // FK

        return dto;
    }
}
