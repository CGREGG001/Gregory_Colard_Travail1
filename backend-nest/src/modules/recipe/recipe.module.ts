import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Recipe } from '@recipe/entities';
import { RecipeController } from '@recipe/recipe.controller';
import { RecipeService } from '@recipe/services';

@Module({
    imports: [TypeOrmModule.forFeature([Recipe])],
    controllers: [RecipeController],
    providers: [RecipeService],
    exports: [RecipeService]
})
export class RecipeModule { }
