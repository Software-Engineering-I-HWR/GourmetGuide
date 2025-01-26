const fs = require('fs');
const https = require('https');
const express = require('express');
const {host} = require('../config/config.json');
const cors = require('cors');
const multer = require('multer');

const privateKey = fs.readFileSync('../config/cert/privkey.pem', 'utf8');
const certificate = fs.readFileSync('../config/cert/cert.pem', 'utf8');
const ca = fs.readFileSync('../config/cert/chain.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate, ca: ca};

const app = express();

const upload = multer({
    storage: multer.memoryStorage(), fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Ungültiger Dateityp. Erlaubt sind nur JPEG, PNG oder WEBP."));
        }
    }, limits: {fileSize: 5 * 1024 * 1024},
});

app.use((req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`[INFO] ${new Date().toISOString()} - Zugriff auf Route: ${req.method} ${req.originalUrl} von IP: ${clientIp}`);
    next();
});
app.use(express.json());
app.use(cors());


//DATENBANK-API
app.post('/saveRecipe', async (req, res) => {
    const data = req.body;
    console.log("Received data:", data);

    try {
        const response = await fetch('http://' + host + ':3007/saveRecipe', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(data),
        });

        console.log('API Antwort:', response);

        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error saving recipe');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.get('/getRecipes', (req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`[INFO] Zugriff auf /getRecipes von IP: ${clientIp}`);
    next();
}, async (req, res) => {
    try {
        const response = await fetch('http://' + host + ':3007/getRecipes');
        console.log(response);
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.get('/getAllCategories', async (req, res) => {
    try {
        const response = await fetch('http://' + host + ':3007/getAllCategories');
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.get('/getAllIngredients', async (req, res) => {
    try {
        const response = await fetch('http://' + host + ':3007/getAllIngredients');
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.get('/getRecipeByID', async (req, res) => {
    const id = req.query.id;

    try {
        const response = await fetch(`http://` + host + `:3007/getRecipeByID?id=${encodeURIComponent(id)}`);
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.post('/deleteRecipeByID', async (req, res) => {
    const id = req.query.id;

    try {
        const response = await fetch(`http://` + host + `:3007/deleteRecipeByID?id=${encodeURIComponent(id)}`, {
            method: "POST",
        });
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.get('/getRecipesByRating', async (req, res) => {
    const rating = req.query.rating;

    try {
        const response = await fetch(`http://` + host + `:3007/getRecipesByRating?rating=${encodeURIComponent(rating)}`);
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.get('/getRecipesByUser', async (req, res) => {
    const user = req.query.user;

    try {
        const response = await fetch(`http://` + host + `:3007/getRecipesByUser?user=${encodeURIComponent(user)}`);
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.get('/getRatedRecipesByUser', async (req, res) => {
    const user = req.query.user;

    try {
        const response = await fetch(`http://` + host + `:3007/getRatedRecipesByUser?user=${encodeURIComponent(user)}`);
        console.log(response);
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.get('/getHighRatedRecipesByUser', async (req, res) => {
    const user = req.query.user;

    try {
        const response = await fetch(`http://` + host + `:3007/getHighRatedRecipesByUser?user=${encodeURIComponent(user)}`);
        console.log(response);
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.get('/getRecipesByCategory', async (req, res) => {
    const category = req.query.category;

    try {
        const response = await fetch(`http://` + host + `:3007/getRecipesByCategory?category=${encodeURIComponent(category)}`);
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.get('/getFilteredRecipes', async (req, res) => {
    const {name, difficulty, category, ingredients, vegetarian, vegan, allergens, rating} = req.query;

    try {
        const response = await fetch(`http://` + host + `:3007/getFilteredRecipes` + `?name=${encodeURIComponent(name)}&` + `difficulty=${encodeURIComponent(difficulty)}&` + `category=${encodeURIComponent(category)}&` + `ingredients=${encodeURIComponent(ingredients)}&` + `vegetarian=${encodeURIComponent(vegetarian)}&` + `vegan=${encodeURIComponent(vegan)}&` + `allergens=${encodeURIComponent(allergens)}&` + `rating=${encodeURIComponent(rating)}&`)
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.get('/getRatingByID', async (req, res) => {
    const id = req.query.id;

    try {
        const response = await fetch(`http://` + host + `:3007/getRatingByID?id=${encodeURIComponent(id)}`);
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.get('/getRatingByIDAndUser', async (req, res) => {
    const id = req.query.id;
    const user = req.query.user;

    try {
        const response = await fetch(`http://` + host + `:3007/getRatingByIDAndUser?id=${encodeURIComponent(id)}&user=${encodeURIComponent(user)}`);
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
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
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.get('/getBookmarkByIDAndUser', async (req, res) => {
    const id = req.query.id;
    const user = req.query.user;

    try {
        const response = await fetch(`http://` + host + `:3007/getBookmarkByIDAndUser?id=${encodeURIComponent(id)}&user=${encodeURIComponent(user)}`);
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.get('/getBookmarkedRecipesByUser', async (req, res) => {
    const user = req.query.user;

    try {
        const response = await fetch(`http://` + host + `:3007/getBookmarkedRecipesByUser?user=${encodeURIComponent(user)}`);
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
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
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.get('/getFollowByUsers', async (req, res) => {
    const user = req.query.user;
    const follows = req.query.follows;

    try {
        const response = await fetch(`http://` + host + `:3007/getFollowByUsers?user=${encodeURIComponent(user)}&follows=${encodeURIComponent(follows)}`);
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.get('/getFollowedUsersByUser', async (req, res) => {
    const user = req.query.user;

    try {
        const response = await fetch(`http://` + host + `:3007/getFollowedUsersByUser?user=${encodeURIComponent(user)}`);
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.post('/saveFollow', async (req, res) => {
    const user = req.query.user;
    const follows = req.query.follows;
    const newFollowState = req.query.follow;
    console.log("Received data:", req.query);

    try {
        const response = await fetch(`http://` + host + `:3007/saveFollow?user=${encodeURIComponent(user)}&follows=${encodeURIComponent(follows)}&follow=${encodeURIComponent(newFollowState ? 1 : 0)}`, {
            method: 'POST',
        });
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

//LOGIN_API
app.post('/login', async (req, res) => {
    const data = req.body;

    try {
        const response = await fetch('http://' + host + ':30156/login', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(data),
        });
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error fetching from API'});
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
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(data),
        });
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error while registering'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.post('/checkAdmin', async (req, res) => {
    const data = req.query;

    try {
        const response = await fetch('http://' + host + ':30156/checkAdmin', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(data),
        });
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error while admin check'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.post('/updatePasswordByUsername', async (req, res) => {
    const data = req.query;
    console.log('Received data: ', data);

    try {
        const response = await fetch('http://' + host + ':30156/updatePasswordByUsername', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(data),
        });
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error while changing password'});
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/getUsers', async (req, res) => {
    try {
        const response = await fetch('http://' + host + ':3006/getUsers');
        console.log(response);
        if (response.ok) {
            const data = await response.text();
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.get('/getUserInfo', async (req, res) => {
    const user = req.query.user;

    try {
        const response = await fetch(`http://` + host + `:3006/getUserInfo?user=${user}`);
        console.log(response);
        if (response.ok) {
            const data = await response.text();
            console.log(data);
            res.status(200).send(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.post('/deleteUserByUsername', async (req, res) => {
    const user = req.query.user;

    try {
        const response = await fetch(`http://` + host + `:3007/getRecipesByUser?user=${encodeURIComponent(user)}`);
        if (response.ok) {
            const data = await response.text();
            console.log(data);
            const recipes = JSON.parse(data);

            for (const recipe of recipes) {
                const id = recipe.ID;
                console.log(id);

                try {
                    const response = await fetch(`http://` + host + `:3007/deleteRecipeByID?id=${encodeURIComponent(id)}`, {
                        method: "POST",
                    });
                    if (response.ok) {
                        const data = await response.text();
                        res.status(200).send(data);
                    } else {
                        console.error('API 2 Error Status:', response.status);
                        res.status(response.status).send('Error while request');
                    }
                } catch (error) {
                    console.error('Network error:', error.message);
                    res.status(500).send('Internal server error');
                }
            }
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error while request');
        }
    } catch (error) {
        console.error('Network error:', error.message);
        res.status(500).send('Internal server error');
    }

    try {
        console.log("User to delete:", user);
        const response = await fetch(`http://` + host + `:3006/deleteUserByUsername?user=${encodeURIComponent(user)}`, {
            method: "POST",
        });
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API request error:', response.status);
            res.status(response.status).json({error: 'Error while deleting the user'});
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
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(requestData),
        });
        if (response.ok) {
            const pdfBuffer = await response.arrayBuffer();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=recipe.pdf');

            res.send(Buffer.from(pdfBuffer));
        } else {
            console.error('Fehler bei der PDF-API:', response.status);
            res.status(response.status).json({error: 'Fehler bei der PDF-Generierung'});
        }
    } catch (error) {
        console.error('Netzwerkfehler:', error.message);
        res.status(500).json({error: 'Interner Serverfehler'});
    }
});

//UploadImage
app.post('/upload-image', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Keine Datei hochgeladen.');
    }

    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    const formData = new FormData();
    formData.append('file', new Blob([fileBuffer], {type: mimeType}), req.file.originalname);

    try {
        const response = await fetch('http://' + host + ':30158/upload', {
            method: "POST", body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            console.error('API 2 Error Status:', response.status);
            res.status(response.status).send('Error uploading image');
        }
    } catch (error) {
        console.error("Fehler bei der Weiterleitung:", error);
        res.status(500).send("Fehler beim Weiterleiten der Anfrage.");
    }
});


https.createServer(credentials, app).listen(3000, () => {
    console.log('HTTPS-Server läuft auf Port 3000');
});