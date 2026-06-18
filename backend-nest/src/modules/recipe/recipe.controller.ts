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
import { JwtAuthGuard } from '@security/guards';

@ApiTags('Recipes')
@Controller('recipe')
export class RecipeController {
    constructor(private readonly recipeService: RecipeService) {}
    
    @Post()
    @UseGuards(JwtAuthGuard)
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

    @Public()
    @Get()
    @ApiOperation(RecipeControllerListDocumentation)
    @ApiResponse({ status: 200, description: 'List of all recipes', type: [RecipeResponseDto] })
    async findAll(): Promise<RecipeResponseDto[]> {
        const recipes = await this.recipeService.findAll();
        // Utilisation du mapper statique sur le tableau de recettes
        return recipes.map(recipe => RecipeResponseDto.fromEntity(recipe));
    }

    @Public()
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation(RecipeControllerDetailsDocumentation)
    @ApiResponse({ status: 200, description: 'Recipe details', type: RecipeResponseDto })
    async findOne(@Param('id') id: string): Promise<RecipeResponseDto> {
        const recipe = await this.recipeService.findByIdOrFail(id);
        return RecipeResponseDto.fromEntity(recipe);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
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

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
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
