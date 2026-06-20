/**
 * Payload sent to the API to create or update a recipe.
 */
export interface RecipePayload {
  title: string;
  description: string;
  ingredients: string[];
  preparationTime: number;
}

/**
 * Recipe structure received from the API.
 */
export interface RecipeResponse {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  preparationTime: number;
  authorId: string;
}