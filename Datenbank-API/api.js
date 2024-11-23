const fs = require('fs');
const https = require('https');
const express = require('express');
const {host, user, password, database} = require('../config/config.json');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// SSL-Zertifikat und privater Schlüssel
const privateKey = fs.readFileSync('../config/cert/privkey.pem', 'utf8');
const certificate = fs.readFileSync('../config/cert/cert.pem', 'utf8');
const ca = fs.readFileSync('../config/cert/chain.pem', 'utf8');

const credentials = {key: privateKey, cert: certificate, ca: ca};

const connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});

app.use(express.json());
app.use(cors());

app.post('/saveRecipe', (req, res) => {
    const data = req.body;
    console.log("Received data:", data);

    const query = `
        INSERT INTO Rezept (Title, Image, Difficulty, Ingredients, Steps, Category, Vegan, Vegetarian, Allergen, Creator)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    console.log(query);

    connection.query(query, [
        data.title, data.image, data.difficulty, data.ingredients, data.steps, data.category, data.vegan, data.vegetarian, data.allergen, data.creator
    ], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Speichern des Rezepts');
        } else {
            res.status(200).send('Rezept erfolgreich gespeichert');
        }
    });
});

app.get('/getRecipes', (req, res) => {
    const query = 'SELECT * FROM Rezept';

    connection.query(query, (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Abrufen der Rezepte');
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/getAllCategories', (req, res) => {
    const query = 'SELECT DISTINCT Category FROM Rezept';

    connection.query(query, (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Abrufen der Rezepte');
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/getAllIngredients', (req, res) => {
    const query = 'SELECT Ingredients FROM Rezept';

    connection.query(query, (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Abrufen der Zutaten');
        } else {
            const unwantedWords = [
                'Bunch', 'Stout', 'Stock', 'The', 'Other', 'Halved', 'Pieces', 'Sprigs', 'Fresh', 'Shredded', 'Garnish', 'Topping', 'Small', 'Big', 'minced', 'chopped', 'pinch', 'as required', 'to glaze', 'Tbsp', 'Tsp', 'Serve', 'Sliced', 'Can', 'Of', 'Into', 'inch', 'To', 'Dash', 'Finely', 'Unsalted', 'Cup', 'Piece', 'Cut', 'Handful', 'Peeled', 'And', 'Coarsely Grated', 'Diced', 'Ground', 'Stewing', 'Thin', 'Bulb', 'Pod', 'Steamed', 'Crushed', 'Top', 'Pack', 'Clove', 'Taste', 'Teaspoon'
            ];

            let allIngredients = results.map(row => row.Ingredients)
                .join('|')
                .split('|')
                .map(ingredient => {
                    let cleanedIngredient = ingredient
                        .replace(/\b\d+(\.\d+)?\s*\w*\b/g, '')
                        .replace(/\/.*/g, '')
                        .replace(/[,.]\s*Beaten/g, '')
                        .replace(/[,.]$/, '')
                        .replace(/^\s*,/, '')
                        .replace(/[¼½¾().,-]/g, '')
                        .replace(/\binch\b/gi, '')
                        .trim();

                    unwantedWords.forEach(word => {
                        const regex = new RegExp('\\b' + word + '\\b', 'gi');
                        cleanedIngredient = cleanedIngredient.replace(regex, '');
                    });

                    cleanedIngredient = cleanedIngredient.replace(/\s\s+/g, ' ').trim();

                    return cleanedIngredient
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ');
                })
                .filter(ingredient => ingredient !== '');

            let uniqueIngredients = [...new Set(allIngredients)];

            uniqueIngredients.sort((a, b) => a.localeCompare(b));

            res.status(200).json(uniqueIngredients);
        }
    });
});

app.get('/getRecipeByID', (req, res) => {
    const id = req.query.id;
    const query = 'SELECT * FROM Rezept WHERE ID = ?';

    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Abrufen der Rezepte');
        } else {
            res.status(200).json(results);
        }
    });
});

app.post('/deleteRecipeByID', (req, res) => {
    const id = req.query.id;
    const query1 = 'DELETE FROM Rezept WHERE ID = ?';
    const query2 = 'DELETE FROM Bewertung WHERE ID = ?';
    const query3 = 'DELETE FROM Lesezeichen WHERE ID = ?';

    console.log(query1);
    console.log(query2);
    console.log(query3);

    connection.query(query1, [id], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Löschen des Rezepts');
        } else {
            res.status(200).send('Rezept erfolgreich gelöscht');
        }
    });

    connection.query(query2, [id], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Löschen des Rezepts');
        } else {
            res.status(200).send('Rezept erfolgreich gelöscht');
        }
    });

    connection.query(query3, [id], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Löschen des Rezepts');
        } else {
            res.status(200).send('Rezept erfolgreich gelöscht');
        }
    });
});

app.get('/getRecipesByRating', (req, res) => {
    const rating = req.query.rating;
    const query = `SELECT r.*, AVG(rt.Bewertung) as average_rating
        FROM Rezept r
        JOIN Bewertung rt ON r.ID = rt.ID
        GROUP BY r.ID
        HAVING average_rating >= ?`;

    connection.query(query, [rating], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Abrufen der Rezepte');
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/getRecipesByUser', (req, res) => {
    const user = req.query.user;
    const query = 'SELECT ID FROM Rezept WHERE Creator = ?';

    connection.query(query, [user], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Abrufen der Rezepte');
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/getRatedRecipesByUser', (req, res) => {
    const user = req.query.user;
    const query = 'SELECT ID FROM Bewertung WHERE Username = ?';

    connection.query(query, [user], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Abrufen der Rezepte');
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/getRecipesByCategory', (req, res) => {
    const category = req.query.category;
    const query = 'SELECT * FROM Rezept WHERE Category = ?';

    connection.query(query, [category], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Abrufen der Rezepte');
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/getFilteredRecipes', (req, res) => {
    const {name, difficulty, category, ingredients, vegetarian, vegan, allergens, rating} = req.query;

    let query = 'SELECT * FROM Rezept WHERE 1=1';
    let queryParams = [];

    if (name) {
        query += ' AND Title LIKE ?';
        queryParams.push(`%${name}%`);
    }

    if (difficulty) {
        query += ' AND Difficulty = ?';
        queryParams.push(difficulty);
    }

    if (category) {
        query += ' AND Category = ?';
        queryParams.push(category);
    }

    if (ingredients) {
        const ingredientsArray = ingredients.split(',');
        ingredientsArray.forEach((ingredient) => {
            query += ' AND Ingredients LIKE ?';
            queryParams.push(`%${ingredient.trim()}%`);
        });
    }

    if (vegetarian) {
        query += ' AND Vegetarian = ?';
        queryParams.push(vegetarian);
    }

    if (vegan) {
        query += ' AND Vegan = ?';
        queryParams.push(vegan);
    }

    if (allergens) {
        const allergenArray = allergens.split(',');
        allergenArray.forEach((allergen) => {
            query += ' AND Allergen LIKE ?';
            queryParams.push(`%${allergen}%`);
        });
    }

    connection.query(query, queryParams, (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Abrufen der Rezepte');
        } else {
            if (rating) {
                const query2 = `SELECT r.*, AVG(rt.Bewertung) as average_rating
                            FROM Rezept r
                            JOIN Bewertung rt ON r.ID = rt.ID
                            GROUP BY r.ID
                            HAVING average_rating >= ?`;

                connection.query(query2, [rating], (error, results2) => {
                    if (error) {
                        console.error("Database Error:", error);
                        res.status(500).send('Fehler beim Abrufen der Rezepte');
                    } else {
                        const filteredResults = results.filter(result1 =>
                            results2.some(result2 => result1.ID === result2.ID)
                        );
                        res.status(200).json(filteredResults);
                    }
                });
            } else {
                res.status(200).json(results);
            }
        }
    });
});

app.get('/getRatingByID', (req, res) => {
    const id = req.query.id;
    const query = 'SELECT AVG(Bewertung) FROM Bewertung WHERE ID = ?';

    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Abrufen der Rezepte');
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/getRatingByIDAndUser', (req, res) => {
    const id = req.query.id;
    const user = req.query.user;
    const query = 'SELECT * FROM Bewertung WHERE ID = ? AND Username = ?';

    connection.query(query, [id, user], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Abrufen der Bewertung');
        } else {
            res.status(200).json(results);
        }
    });
});

app.post('/saveRating', (req, res) => {
    const data = req.query;
    console.log("Received data:", data);

    const query = `
        INSERT INTO Bewertung (ID, Username, Bewertung)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE Bewertung = VALUES(Bewertung);
    `;

    console.log(query);

    connection.query(query, [
        data.id, data.user, data.rating
    ], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Speichern der Bewertung');
        } else {
            res.status(200).send('Bewertung erfolgreich gespeichert');
        }
    });
});

app.get('/getBookmarkByIDAndUser', (req, res) => {
    const id = req.query.id;
    const user = req.query.user;
    const query = 'SELECT * FROM Lesezeichen WHERE ID = ? AND Username = ?';

    connection.query(query, [id, user], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Abrufen der Bewertung');
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/getBookmarkedRecipesByUser', (req, res) => {
    const user = req.query.user;
    const query = 'SELECT ID FROM Lesezeichen WHERE Username = ? AND Bookmark = 1';

    connection.query(query, [user], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Abrufen der Rezepte');
        } else {
            res.status(200).json(results);
        }
    });
});

app.post('/saveBookmark', (req, res) => {
    const data = req.query;
    console.log("Received data:", data);

    const now = new Date();

    const formattedDate = now.toLocaleString('de-DE', {
        timeZone: 'Europe/Berlin',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(',', '').replace(/\./g, '-');

    const [datePart, timePart] = formattedDate.split(' ');
    const [day, month, year] = datePart.split('-');
    const isoFormattedDate = `${year}-${month}-${day} ${timePart}`;

    console.log("Formatted Date:", isoFormattedDate);

    const query = `
        INSERT INTO Lesezeichen (ID, Username, Bookmark, Updatetime)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE Bookmark = VALUES(Bookmark), Updatetime = VALUES(Updatetime);
    `;

    console.log(query);

    connection.query(query, [
        data.id, data.user, data.bookmark, isoFormattedDate
    ], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Speichern der Bewertung');
        } else {
            res.status(200).send('Bewertung erfolgreich gespeichert');
        }
    });
});

https.createServer(credentials, app).listen(3000, () => {
    console.log('HTTPS-Server läuft auf Port 3000');
});