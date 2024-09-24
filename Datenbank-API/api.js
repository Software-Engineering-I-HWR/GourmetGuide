const express = require('express');
const { host, user, password, database } = require('./config.json');
const mysql = require('mysql2');
const app = express();

const connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});

app.use(express.json());

app.post('/saveRecipe', (req, res) => {
    const data = req.body;
    console.log("Received data:", data);

    const query = `
        INSERT INTO Rezept (Title, Image, Difficulty, Ingredients, Steps)
        VALUES (?, ?, ?, ?, ?)
    `;

    console.log(query);

    connection.query(query, [
        data.title, data.image, data.difficulty, data.ingredients, data.steps
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