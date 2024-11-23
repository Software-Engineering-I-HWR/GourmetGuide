const fs = require('fs');
const https = require('https');
const express = require('express');
const {host} = require('../config/config.json');
const cors = require('cors');

const app = express();

// SSL-Zertifikat und privater Schlüssel
const privateKey = fs.readFileSync('../config/cert/privkey.pem', 'utf8');
const certificate = fs.readFileSync('../config/cert/cert.pem', 'utf8');
const ca = fs.readFileSync('../config/cert/chain.pem', 'utf8');

const credentials = {key: privateKey, cert: certificate, ca: ca};

app.use(express.json());
app.use(cors());


//DATENBANK-API
app.post('/saveRecipe', async (req, res) => {
    const data = req.body;
    console.log("Received data:", data);

    try {
        const response = await fetch('http://' + host + ':3007/saveRecipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data}),
        });

        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/getRecipes', async (req, res) => {
    try {
        const response = await fetch('http://' + host + ':3007/getRecipes');
        console.log(response);
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/getAllCategories', async (req, res) => {
    try {
        const response = await fetch('http://' + host + ':3007/getAllCategories');
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/getAllIngredients', async (req, res) => {
    try {
        const response = await fetch('http://' + host + ':3007/getAllIngredients');
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/getRecipeByID', async (req, res) => {
    const id = req.query.id;

    try {
        const response = await fetch(`http://` + host + `:3007/getRecipeByID?id=${encodeURIComponent(id)}`);
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.post('/deleteRecipeByID', async (req, res) => {
    const id = req.query.id;

    try {
        const response = await fetch(
            `http://` + host + `:3007/deleteRecipeByID?id=${encodeURIComponent(id)}`,
            {
                method: "POST",
            }
        );

        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/getRecipesByRating', async (req, res) => {
    const rating = req.query.rating;

    try {
        const response = await fetch(`http://` + host + `:3007/getRecipesByRating?rating=${encodeURIComponent(rating)}`);
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/getRecipesByUser', async (req, res) => {
    const user = req.query.user;

    try {
        const response = await fetch(`http://` + host + `:3007/getRecipesByUser?user=${encodeURIComponent(user)}`);
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/getRatedRecipesByUser', async (req, res) => {
    const user = req.query.user;

    try {
        const response = await fetch(`http://` + host + `:30155/getRatedRecipesByUser?user=${encodeURIComponent(user)}`);
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/getRecipesByCategory', async (req, res) => {
    const category = req.query.category;

    try {
        const response = await fetch(`http://` + host + `:3007/getRecipesByCategory?category=${encodeURIComponent(category)}`);
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/getFilteredRecipes', async (req, res) => {
    const {name, difficulty, category, ingredients, vegetarian, vegan, allergens, rating} = req.query;

    try {
        const response = await fetch(`http://` + host + `:3007/getFilteredRecipes` +
            `?name=${encodeURIComponent(name)}&` +
            `difficulty=${encodeURIComponent(difficulty)}&` +
            `category=${encodeURIComponent(category)}&` +
            `ingredients=${encodeURIComponent(ingredients)}&` +
            `vegetarian=${encodeURIComponent(vegetarian)}&` +
            `vegan=${encodeURIComponent(vegan)}&` +
            `allergens=${encodeURIComponent(allergens)}&`+
            `rating=${encodeURIComponent(rating)}&`)
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/getRatingByID', async (req, res) => {
    const id = req.query.id;

    try {
        const response = await fetch(`http://` + host + `:3007/getRatingByID?id=${encodeURIComponent(id)}`);
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/getRatingByIDAndUser', async (req, res) => {
    const id = req.query.id;
    const user = req.query.user;

    try {
        const response = await fetch(`http://` + host + `:3007/getRatingByIDAndUser?id=${encodeURIComponent(id)}&user=${encodeURIComponent(user)}`);
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.post('/saveRating', async (req, res) => {
    const id = req.query.id;
    const username = req.query.user;
    const ratingNumber = req.query.rating;
    console.log("Received data:", req.query);

    try {
        const response = await fetch(`http://` + host + `:3007/saveRating?id=${encodeURIComponent(id)}&user=${encodeURIComponent(username)}&rating=${encodeURIComponent(ratingNumber)}`, {
            method: 'POST'
        });

        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/getBookmarkByIDAndUser', async (req, res) => {
    const id = req.query.id;
    const user = req.query.user;

    try {
        const response = await fetch(`http://` + host + `:3007/getBookmarkByIDAndUser?id=${encodeURIComponent(id)}&user=${encodeURIComponent(user)}`);
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/getBookmarkedRecipesByUser', async (req, res) => {
    const user = req.query.user;

    try {
        const response = await fetch(`http://` + host + `:3007/getBookmarkedRecipesByUser?user=${encodeURIComponent(user)}`);
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.post('/saveBookmark', async (req, res) => {
    const id = req.query.id;
    const username = req.query.user;
    const newBookmarkState = req.query.bookmark;
    console.log("Received data:", req.query);

    try {
        const response = await fetch(`http://` + host + `:3007/saveBookmark?id=${encodeURIComponent(id)}&user=${encodeURIComponent(username)}&bookmark=${encodeURIComponent(newBookmarkState ? 1 : 0)}`, {
            method: 'POST',
        });

        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

//LOGIN_API
app.post('/login', async (req, res) => {
    const data = req.body;

    try {
        const response = await fetch('http://' + host + ':30156/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(data => data.json());

        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.post('/register', async (req, res) => {
    const data = req.body;

    try {
        const response = await fetch('http://' + host + ':30156/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching recipes from API'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

//PDF-API
app.post('/generate-pdf', async (req, res) => {
    const requestData = req.body;

    try {
        const response = await fetch('http://' + host + ':30157/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (response.ok) {
            const pdfBuffer = await response.arrayBuffer();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=recipe.pdf');

            res.send(Buffer.from(pdfBuffer));
        } else {
            console.error('Fehler bei der PDF-API:', response.status);
            res.status(response.status).json({ error: 'Fehler bei der PDF-Generierung' });
        }
    } catch (error) {
        console.error('Netzwerkfehler:', error.message);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

https.createServer(credentials, app).listen(3000, () => {
    console.log('HTTPS-Server läuft auf Port 3000');
});