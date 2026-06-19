import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RecipeService } from '@recipe/services';
import { 
    RecipeControllerCreateDocumentation,
    RecipeControllerDeleteDocumentation,
    RecipeControllerDetailsDocumentation,
    RecipeControllerListDocumentation,
    RecipeControllerUpdateDocumentation
} from './docs/recipe.swagger';
import { RecipeDto, RecipeResponseDto } from './dtos';
import { CurrentUser, Public } from '@core/decorators';
import { Member } from '@member/entities';

@ApiTags('Recipes')
@Controller('recipe')
export class RecipeController {
    constructor(private readonly recipeService: RecipeService) {}

    /**
     * Creates a new recipe associated with the authenticated user.
     *
     * Requires a valid Access Token.
     *
     * @param dto - Data required to create a recipe
     * @param user - Authenticated user extracted from JWT (contains the member ID)
     * @returns The newly created recipe as a response DTO
     */
    @Post()
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation(RecipeControllerCreateDocumentation)
    @ApiBody({ type: RecipeDto })
    @ApiResponse({ status: 201, description: 'Recipe successfully created', type: RecipeResponseDto })
    async create(
        @Body() dto: RecipeDto,
        @CurrentUser() user: { sub: string }
    ): Promise<RecipeResponseDto> {
        const author = { id: user.sub } as Member
        const recipe = await this.recipeService.create(dto, author);

        return RecipeResponseDto.fromEntity(recipe);
    }

    /**
     * Retrieves the list of all recipes.
     *
     * Public endpoint — no authentication required.
     *
     * @returns An array of recipe response DTOs
     */
    @Public()
    @Get()
    @ApiOperation(RecipeControllerListDocumentation)
    @ApiResponse({ status: 200, description: 'List of all recipes', type: [RecipeResponseDto] })
    async findAll(): Promise<RecipeResponseDto[]> {
        const recipes = await this.recipeService.findAll();
        // Utilisation du mapper statique sur le tableau de recettes
        return recipes.map(recipe => RecipeResponseDto.fromEntity(recipe));
    }

    /**
     * Retrieves a single recipe by its ID.
     *
     * Public endpoint — no authentication required.
     *
     * @param id - Recipe identifier
     * @returns The recipe as a response DTO
     * @throws RecipeNotFoundException if the recipe does not exist
     */
    @Public()
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation(RecipeControllerDetailsDocumentation)
    @ApiResponse({ status: 200, description: 'Recipe details', type: RecipeResponseDto })
    async findOne(@Param('id') id: string): Promise<RecipeResponseDto> {
        const recipe = await this.recipeService.findByIdOrFail(id);
        return RecipeResponseDto.fromEntity(recipe);
    }

    /**
     * Updates a recipe.
     *
     * Requires a valid Access Token.
     * Only the recipe's author or an admin can update it.
     *
     * @param id - Recipe identifier
     * @param dto - Updated recipe data
     * @param user - Authenticated user performing the update
     * @returns The updated recipe as a response DTO
     * @throws RecipeNotFoundException if the recipe does not exist
     * @throws RecipeForbiddenActionException if the user is not allowed to update the recipe
     */
    @Put(':id')
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation(RecipeControllerUpdateDocumentation)
    @ApiBody({ type: RecipeDto })
    @ApiResponse({ status: 200, description: 'Recipe successfully updated', type: RecipeResponseDto })
    async update(
        @Param('id') id: string,
        @Body() dto: RecipeDto,
        @CurrentUser() user: { sub: string; role: string }
    ): Promise<RecipeResponseDto> {
        const recipe = await this.recipeService.update(id, dto, user);
        return RecipeResponseDto.fromEntity(recipe);
    }

    /**
     * Deletes a recipe.
     *
     * Requires a valid Access Token.
     * Only the recipe's author or an admin can delete it.
     *
     * @param id - Recipe identifier
     * @param user - Authenticated user performing the deletion
     * @throws RecipeNotFoundException if the recipe does not exist
     * @throws RecipeForbiddenActionException if the user is not allowed to delete the recipe
     */
    @Delete(':id')
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation(RecipeControllerDeleteDocumentation)
    @ApiResponse({ status: 204, description: 'Recipe successfully deleted' })
    async delete(
        @Param('id') id: string,
        @CurrentUser() user: { sub: string; role: string }
    ): Promise<void> {
        await this.recipeService.delete(id, user);
    }
}
