import './Categories.css';
import CategoryCard from "./CategoryCard.tsx";
import React, {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import configData from '../../../../config/frontend-config.json';

interface Config {
    host: string;
    user: string;
    password: string;
    database: string;
}

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
}

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

const hostData: Config = configData;

const Categories: React.FC = () => {
    const [currentCategory, setCurrentCategory] = useState('Vegetarian')
    const [sampleCategories, setSampleCategories] = useState<ListItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [allRecipesCurrentCategory, setAllRecipesCurrentCategory] = useState<RecipesByCategory[]>([]);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    async function getAllCategories(): Promise<Category[] | null> {
        try {
            const response = await fetch('https://' + hostData.host + ':30155/getAllCategories');
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

    async function getRecipesByCategory(currentCat: string): Promise<Recipe[] | null> {
        try {
            const response = await fetch(`https://` + hostData.host + `:30155/getRecipesByCategory?category=${encodeURIComponent(currentCat)}`, {
                method: 'GET'
            });
            if (response.ok) {
                const recipes = await response.json();
                const allRecipesFromCategory: RecipesByCategory[] = recipes.map((item: Recipe) => ({
                    title: item.Title,
                    category: item.Category,
                    imageUrl: item.Image,
                    id: item.ID
                }));

                setAllRecipesCurrentCategory(allRecipesFromCategory);
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

    async function getRecipes(category: string): Promise<Recipe[] | null> {
        try {
            if (sampleCategories.some(item => item.title === category)) return null;
            const response = await fetch(`https://` + hostData.host + `:30155/getRecipesByCategory?category=${encodeURIComponent(category)}`, {
                method: 'GET'
            });
            if (response.ok) {
                const recipes = await response.json();

                if (recipes.length > 0) {
                    const newCategory: ListItem = {
                        functionActive: setCurrentCategory,
                        title: recipes[0].Category,
                        imageUrl: recipes[0].Image,
                        active: currentCategory === recipes[0].Category ? 'true' : 'false',
                    };

                    setSampleCategories((prevSampleCategories) => {
                        if (prevSampleCategories.some(item => item.title === newCategory.title)) {
                            return prevSampleCategories;
                        }
                        return [...prevSampleCategories, newCategory];
                    });
                    return recipes;
                }
                return null;
            } else {
                console.error('API request error:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Network error:', error);
            return null;
        }
    }

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
        categories!.forEach(category => {
            getRecipes(category);
        })
    }, [categories, getRecipes]);

    useEffect(() => {
            setSampleCategories((prevItem) =>
                prevItem.map((item =>
                    item.title === currentCategory ? {...item, active: "true"} : {...item, active: "false"}))
            );
            getRecipesByCategory(currentCategory);
        }, [currentCategory]
    );

    return (
        <div className="main-content">
            <div className="categories-main-content">
                <div className="categories">
                    <img src="/images/menu.png" alt="Menü Button Mobile" className="menu-button-mobile-categories"
                         onClick={() => setShowMobileMenu(!showMobileMenu)}/>
                    <h1 className="categories__title">Kategorien</h1>
                    <div className="categories__list">
                        {sampleCategories!.sort().map((recipe, index) => (
                            <CategoryCard key={index} {...recipe}/>
                        ))}
                    </div>
                </div>
                {showMobileMenu && <div className="categories-actions-mobile">
                    {sampleCategories!.sort().map((item) => (
                        <button className="categories-mobile-menu-buttons" disabled={!item.active} onClick={() => {
                            setShowMobileMenu(false);
                            setCurrentCategory(item.title)
                        }}>{item.title}</button>
                    ))}
                </div>}
                <div className="recipes-by-category">
                    <h2 className="categories__title"></h2>
                    <div className="recipes-by-category-list">
                        <table className="recipes-table">
                            <thead>
                            <tr>
                                <th scope="col1">#</th>
                                <th scope="col2">Titel</th>
                                <th scope="col3">Kategorie</th>
                                <th scope="col4">Bild</th>
                            </tr>
                            </thead>
                            <tbody>
                            {allRecipesCurrentCategory!.sort().map((recipe, index) => (
                                <tr onClick={() => window.location.href = `/recipe/${recipe.id}/`}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{recipe.title}</td>
                                    <td>{recipe.category}</td>
                                    <td>
                                        <img src={recipe.imageUrl}
                                             style={{height: "7vw", objectFit: "cover", width: "100%"}}
                                             alt="Bild Rezept"/>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Categories;
