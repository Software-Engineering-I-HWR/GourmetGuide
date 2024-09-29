const express = require('express');
const { host, user, password, database } = require('./config.json');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

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
        INSERT INTO Rezept (Title, Image, Difficulty, Ingredients, Steps, Category, Vegan, Vegetarian, Allergen)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    console.log(query);

    connection.query(query, [
        data.title, data.image, data.difficulty, data.ingredients, data.steps, data.category, data.vegan, data.vegetarian, data.allergen
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

app.get('/getUserByEmail', (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(400).send('E-Mail fehlt');
    }

    const query = 'SELECT Username, Password FROM Account WHERE Username = ?';

    connection.query(query, [email], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Abrufen des Benutzers');
        } else if (results.length === 0) {
            res.status(404).send('Benutzer nicht gefunden');
        } else {
            res.status(200).json(results[0]);
        }
    });
});

app.post('/createUser', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('E-Mail und Passwort fehlen');
    }

    const query = 'INSERT INTO Account (Username, Password) VALUES (?, ?)';

    connection.query(query, [email, password], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Erstellen des Benutzers');
        } else {
            res.status(201).send('Benutzer erfolgreich erstellt');
        }
    });
});

app.listen(3000, () => {
    console.log('Server läuft auf Port 3000');
});
