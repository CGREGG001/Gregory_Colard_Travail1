import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class RecipeDto {
    @ApiProperty({ example: 'Tarte aux figues' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    title!: string;

    @ApiProperty({ example: 'Une délicieuse recette de tarte...' })
    @IsString()
    @IsNotEmpty()
    description!: string;

    @ApiProperty({ example: ['Figues', 'Pâte brisée', 'Sucre'] })
    @IsArray()
    @IsString({ each: true })
    ingredients!: string[];

    @ApiProperty({ example: 45 })
    @IsInt()
    @Min(1)
    preparationTime!: number;
}
