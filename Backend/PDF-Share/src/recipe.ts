export interface Recipe {
    name: string,
    image: string,
    category: string,
    description: string,
    ingredients: string[],
    creator: string,
    allergen: string[],
    id: number,
}