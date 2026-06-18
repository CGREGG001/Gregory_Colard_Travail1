import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Recipe } from "@recipe/entities/recipe.entity";
import { RecipeDto } from "@recipe/dtos/requests/recipe.dto";
import { Member } from "@member/entities";
import { MemberRole } from "@member/enums";
import { 
    RecipeForbiddenActionException,
    RecipeNotFoundException
} from "@recipe/exceptions";

@Injectable()
export class RecipeService {

    constructor(
        @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>
    ) {}

    /**
     * Creates a new recipe associated with the given author.
     *
     * @param dto - Data required to create a recipe
     * @param author - Member creating the recipe
     * @returns The created recipe entity
     */
    async create(dto: RecipeDto, author: Member): Promise<Recipe> {
        const recipe = this.recipeRepository.create({ ...dto, author });

        return this.recipeRepository.save(recipe);
    }

    /**
     * Retrieves all recipes with their authors.
     *
     * @returns List of all recipes
     */    
    async findAll(): Promise<Recipe[]> {
        return this.recipeRepository.find({ relations: ['author'] });
    }

    /**
     * Finds a recipe by its ID, including its author.
     *
     * @param id - Recipe identifier
     * @returns The recipe if found, otherwise null
     */
    async findById(id: string): Promise<Recipe | null> {
        return this.recipeRepository.findOne({ where: { id }, relations: ['author'] });
    }

    /**
     * Updates a recipe if the current user is its author or an admin.
     *
     * @param id - Recipe identifier
     * @param dto - Updated recipe data
     * @param currentUser - Authenticated user performing the action
     * @throws NotFoundException if recipe does not exist
     * @throws ForbiddenException if user is not allowed to update the recipe
     * @returns The updated recipe
     */
    async update(id: string, dto: RecipeDto, currentUser: { sub: string; role: string }): Promise<Recipe> {
        const recipe = await this.findById(id);

        if (!recipe){
            throw new RecipeNotFoundException;
        } 

        // Security: Only the creator or an Admin is allowed to modify it
        if (recipe.author.id !== currentUser.sub && currentUser.role !== MemberRole.ADMIN) {
            throw new RecipeForbiddenActionException;
        }

        // Updates the recipe entity with the values from the DTO.
        // Only the fields present in the DTO overwrite the existing ones.
        Object.assign(recipe, dto);
    
        return this.recipeRepository.save(recipe);
    }

    /**
     * Deletes a recipe if the current user is its author or an admin.
     *
     * @param id - Recipe identifier
     * @param currentUser - Authenticated user performing the action
     * @throws NotFoundException if recipe does not exist
     * @throws ForbiddenException if user is not allowed to delete the recipe
     */
    async delete(id: string, currentUser: { sub: string; role: string }): Promise<void> {

        const recipe = await this.findById(id);

        if (!recipe) {
            throw new RecipeNotFoundException;
        }

        // Security: Only the creator or an Admin is allowed to modify it
        if (recipe.author.id !== currentUser.sub && currentUser.role !== MemberRole.ADMIN) {
            throw new RecipeForbiddenActionException;
        }

        await this.recipeRepository.remove(recipe);
    }
}
