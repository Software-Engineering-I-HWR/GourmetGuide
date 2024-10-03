
import RecipeCard from '../Home/RecipeCard.tsx';
import '../../App.css';
import './SearchRecezeptView.css'
import React, {useEffect, useState} from "react";

interface SuchFilter{
    name:string;
    difficulty:string;
    category:string;
    ingredients:string
}

interface Recipe {
    Title: string;
    Category: string;
    Image: string;
    ID: number
}

interface ListItem {
    title: string;
    description: string;
    imageUrl: string;
    id: number
}

async function getRecipes({name, difficulty, category, ingredients}: { name: string, difficulty: string, category: string, ingredients: string }): Promise<Recipe[] | null> {
    console.log(ingredients);
    const promt = `http://canoob.de:3007/getFilteredRecipes` +
        `?name=`+ (name==``? `&`: `${encodeURIComponent(name) }&`) +
        `difficulty=`+ (difficulty==``? `&`: `${encodeURIComponent(difficulty)}&`) +
        `category=`+ (category==``? `&`: `${encodeURIComponent(category)}&`) +
        `ingredients=` + (ingredients==``? `&`: `${encodeURIComponent(ingredients)}`)
    console.log(promt);
    try {
        const response = await fetch(promt);
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


const SearchRecezeptView: React.FC<SuchFilter> = ({name, difficulty, category, ingredients}) => {
    const [sampleRecipes, setSampleRecipes] = useState<ListItem[]>([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const recipes = await getRecipes({name, difficulty, category, ingredients});
            console.log(recipes);
            if (recipes && Array.isArray(recipes)) {
                const lastFifteenRecipes = recipes.map(recipe => ({
                    title: recipe.Title,
                    description: recipe.Category,
                    imageUrl: recipe.Image,
                    id: recipe.ID
                }));
                setSampleRecipes(lastFifteenRecipes);
            } else {
                console.error('No valid recipes received or the data is not an array.');
            }
        };

        fetchRecipes();
    }, []);

    return (
        <div>
            <main className="main-SearchRecezeptView">
                <section className="recipes">
                    <h2 className="recipes__title"/>
                    <a className="recipes__list">
                        {sampleRecipes!.map((recipe, index) => (
                            <a
                                key={index}
                                className="recipes-link"
                                href={`/recipe/${recipe.id}`}
                                style={{textDecoration: 'none'}}
                            >
                                <RecipeCard key={index} {...recipe} />
                            </a>
                        ))}
                    </a>
                </section>
            </main>
        </div>
    );
};

export default SearchRecezeptView;
