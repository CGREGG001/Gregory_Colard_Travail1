import { ApiProperty } from '@nestjs/swagger';

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
}
