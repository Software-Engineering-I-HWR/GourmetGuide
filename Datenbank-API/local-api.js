const express = require('express');
const {host, user, password, database} = require('../config/config.json');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

const connection = mysql.createConnection({
    host: host, user: user, password: password, database: database
});

app.use(express.json());
app.use(cors());

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
    const {email, password} = req.body;

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

app.get('/getUsers', (req, res) => {
    const query = 'SELECT Username FROM Account';

    connection.query(query, [], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Abrufen der User');
        } else {
            res.status(200).json(results);
        }
    });
});

app.post('/deleteUserByUsername', (req, res) => {
    const user = req.query.user;

    const query1 = 'DELETE FROM Account WHERE Username = ?';
    const query2 = 'DELETE FROM Bewertung WHERE Username = ?';
    const query3 = 'DELETE FROM Lesezeichen WHERE Username = ?';
    const query4 = 'DELETE FROM Rezept WHERE Creator = ?';
    const query5 = 'DELETE FROM UserFolgen WHERE UserFollowing = ? OR UserFollowed = ?';

    const queries = [{query: query1, params: [user]}, {query: query2, params: [user]}, {
        query: query3,
        params: [user]
    }, {query: query4, params: [user]}, {query: query5, params: [user, user]}];

    const promises = queries.map(({query, params}) => new Promise((resolve, reject) => {
        connection.query(query, params, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    }));

    Promise.all(promises)
        .then(() => {
            res.status(200).send('User und zugehörige Daten erfolgreich gelöscht');
        })
        .catch((error) => {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Löschen der Daten');
        });
});

app.post('/updatePasswordByUsername', (req, res) => {
    const {user, password} = req.body;

    if (!user || !password) {
        return res.status(400).send('Username oder Passwort fehlen');
    }

    const query = 'UPDATE Account SET Password = ? WHERE Username = ?';

    connection.query(query, [password, user], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            res.status(500).send('Fehler beim Ändern des Passworts');
        } else {
            res.status(201).send('Benutzer erfolgreich erstellt');
        }
    });
});

app.get('/getUserInfo', (req, res) => {
    const {user} = req.body;

    const query1 = 'SELECT COUNT(*) AS bewertungen FROM Bewertung WHERE Username = ?';
    const query2 = 'SELECT COUNT(*) AS lesezeichen FROM Lesezeichen WHERE Username = ?';
    const query3 = 'SELECT COUNT(*) AS rezepte FROM Rezept WHERE Creator = ?';
    const query4 = 'SELECT COUNT(*) AS folgt FROM UserFolgen WHERE UserFollowing = ?';
    const query5 = 'SELECT COUNT(*) AS follower FROM UserFolgen WHERE UserFollowed = ?';

    const queries = [
        {query: query1, params: [user]},
        {query: query2, params: [user]},
        {query: query3, params: [user]},
        {query: query4, params: [user]},
        {query: query5, params: [user]},
    ];

    const promises = queries.map(({query, params}) =>
        new Promise((resolve, reject) => {
            connection.query(query, params, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0]);
                }
            });
        })
    );

    Promise.all(promises)
        .then((results) => {
            const response = {
                user: user,
                bewertungen: results[0].bewertungen,
                lesezeichen: results[1].lesezeichen,
                rezepte: results[2].rezepte,
                folgt: results[3].folgt,
                follower: results[4].follower,
            };

            res.status(200).json(response);
        })
        .catch((error) => {
            console.error('Database Error:', error);
            res.status(500).json({error: 'Fehler beim Abrufen der Daten'});
        });
});


app.listen(3000, () => {
    console.log('Server läuft auf Port 3000');
});