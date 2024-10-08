import './Categories.css';
import CategoryCard from "./CategoryCard.tsx";
import React, {useEffect, useState} from "react";
import AllRecipesByCategory from "./AllRecipesByCategory.tsx";

interface Recipe {
    Title: string;
    Category: string;
    Image: string;
    ID: number;
    Allergen: string;
    Ingredients: string;
    Steps: string;
    Vegan: boolean;
    Vegetarian: boolean;
};

interface ListItem {
    functionActive: (newText: string) => void;
    title: string;
    imageUrl: string;
    active: string;
}

interface Category {
    Category: string;
}

interface RecipesByCategory {
    title: string;
    category: string;
    imageUrl: string;
    id: number;
}

const Categories: React.FC = () => {

    const [currentCategory, setCurrentCategory] = useState('Vegetarian')
    const [sampleCategories, setSampleCategories] = useState<ListItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [allRecipesCurrentCategory, setAllRecipesCurrentCategory] = useState<Recipe[]>([]);

    async function getAllCategories(): Promise<Category[] | null> {
        try {
            const response = await fetch('https://canoob.de:3007/getAllCategories');
            if (response.ok) {
                return await response.json();
            } else {
                console.error('API request error:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Network error:', error);
            return null;
        }
    }

    async function getRecipes(category: string): Promise<Recipe[] | null> {
        console.log("test", category);
        try {
            const response = await fetch(`https://canoob.de:3007/getRecipesByCategory?category=${encodeURIComponent(category)}`, {
                method: 'GET'
            });
            console.log(sampleCategories.some(item => item.title === category), "   ", category, sampleCategories);
            if (response.ok && !sampleCategories.some(item => item.title === category)) {
                if (category === currentCategory) {
                    const a = await response.json();
                    const allRecipesFromCategory = a.map((item: { Title: any; Category: any; Image: any; ID: any; }) => ({
                        title: item.Title,
                        category: item.Category,
                        imageUrl: item.Image,
                        id: item.ID
                    }));
                    setAllRecipesCurrentCategory(allRecipesFromCategory)
                }
                const recipes = await response.json();
                const newCategory: ListItem = {
                    functionActive: setCurrentCategory,
                    title: recipes[0].Category,
                    imageUrl: recipes[0].Image,
                    active: currentCategory === recipes[0].Category ? 'true' : 'false'
                };
                setSampleCategories((prevSampleCategories) => [...prevSampleCategories, newCategory]);
                return recipes;
            } else {
                console.error('API request error:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Network error:', error);
            return null;
        }
    }

    /* useEffect(() => {
         const fetchRecipe = async () => {
             const recipe = await getRecipes();
             if (recipe && Array.isArray(recipe)) {
                 const newRecipe: ListItem[] = recipe.map(item => ({
                     functionActive: setCurrentCategory,
                     title: item.Category,
                     imageUrl: item.Image,
                     active: currentCategory === item.Title ? 'true' : 'false'
                 }));
                 setSampleCategories(newRecipe);
             } else {
                 console.error('No valid recipes received or the data is not an array.');
             }
         };
         fetchRecipe();

     }, [getRecipes]);*/

    const fetchCategories = async () => {
        const allCategoriesJson = await getAllCategories();
        if (allCategoriesJson) {
            const categoriesList: string[] = allCategoriesJson.map(item => item.Category);
            setCategories(categoriesList);
        }

    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        console.log("alle Kategorien", categories);
        categories!.forEach(category => {
            getRecipes(category);
        })
    }, [categories]);

    useEffect(() => {
        console.log("alle Kategorien mit Inhalt", sampleCategories);
    }, [sampleCategories]);

    useEffect(() => {
        setSampleCategories((prevItem) =>
            prevItem.map((item =>
                item.title === currentCategory ? {...item, active: "true"} : {...item, active: "false"}))
        );
    }, [currentCategory]);

    return (
        <div className="main-content">
            <section className="categories">
                <h2 className="categories__title">Kategorien</h2>
                <div className="categories__list">
                    {sampleCategories!.sort().map((recipe, index) => (
                        <CategoryCard key={index} {...recipe}/>
                    ))}
                </div>
            </section>
            <section className="recipes-by-category">
                <div className="recipes-by-category-list">
                    {allRecipesCurrentCategory!.sort().map((recipe, index) => (
                        <AllRecipesByCategory key={index} {...recipe}/>
                    ))}
                </div>
            </section>
        </div>
    );
};


export default Categories;
