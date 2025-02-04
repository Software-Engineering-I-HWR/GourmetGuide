## API-Endpunkte

### Datenbank-API
- **POST `/saveRecipe`**: Speichert ein Rezept.
- **GET `/getRecipes`**: Ruft alle Rezepte ab.
- **GET `/getAllCategories`**: Ruft alle Rezeptkategorien ab.
- **GET `/getAllIngredients`**: Ruft alle Zutaten ab.
- **GET `/getRecipeByID`**: Ruft ein Rezept anhand der ID ab.
- **POST `/deleteRecipeByID`**: Löscht ein Rezept anhand der ID.
- **GET `/getRecipesByRating`**: Ruft Rezepte basierend auf einer Bewertung ab.
- **GET `/getRecipesByUser`**: Ruft Rezepte eines bestimmten Benutzers ab.
- **GET `/getRatedRecipesByUser`**: Ruft bewertete Rezepte eines Benutzers ab.
- **GET `/getHighRatedRecipesByUser`**: Ruft hoch bewertete Rezepte eines Benutzers ab.
- **GET `/getRecipesByCategory`**: Ruft Rezepte einer bestimmten Kategorie ab.
- **GET `/getFilteredRecipes`**: Ruft gefilterte Rezepte basierend auf mehreren Kriterien ab.
- **GET `/getRatingByID`**: Ruft die Bewertung eines Rezepts anhand der ID ab.
- **GET `/getRatingByIDAndUser`**: Ruft die Bewertung eines Rezepts für einen Benutzer ab.
- **POST `/saveRating`**: Speichert eine Bewertung für ein Rezept.
- **GET `/getBookmarkByIDAndUser`**: Ruft die Lesezeichen eines Benutzers für ein Rezept ab.
- **GET `/getBookmarkedRecipesByUser`**: Ruft alle Lesezeichen eines Benutzers ab.
- **POST `/saveBookmark`**: Speichert oder entfernt ein Lesezeichen für ein Rezept.
- **GET `/getFollowByUsers`**: Ruft die Follower-Daten zwischen zwei Benutzern ab.
- **GET `/getFollowedUsersByUser`**: Ruft die Benutzer ab, denen ein bestimmter Benutzer folgt.
- **POST `/saveFollow`**: Speichert oder entfernt eine Follow-Beziehung zwischen Benutzern.
- **GET `/getMaxID`**: Ruft die höchste Rezept-ID in der Datenbank ab.
- **GET `/getNewRecipesByUser`**: Ruft neue Rezepte von Benutzern ab, denen ein Benutzer folgt.
- **GET `/getBestRecipes`**: Ruft die besten Rezepte basierend auf durchschnittlichen Bewertungen ab.

### Login-API
- **POST `/login`**: Authentifiziert einen Benutzer.
- **POST `/register`**: Registriert einen neuen Benutzer.

### User-API
- **POST `/updatePasswordByUsername`**: Aktualisiert das Passwort eines Benutzers basierend auf dem Benutzernamen.
- **POST `/deleteUserByUsername`**: Löscht einen Benutzer basierend auf dem Benutzernamen.
- **GET `/getUsers`**: Ruft alle Benutzer ab.
- **GET `/getUserInfo`**: Ruft Informationen zu einem Benutzer ab.
- **GET `/getLastLoginByUser`**: Ruft den letzten Login eines Benutzers ab.
- **POST `/setLastLoginByUser`**: Speichert den letzten Login eines Benutzers.

### PDF-API
- **POST `/generate-pdf`**: Generiert ein PDF basierend auf bereitgestellten Rezeptdaten.

### Upload-API
- **POST `/upload-image`**: Lädt ein Bild hoch. Unterstützt die Dateitypen JPEG, PNG und WEBP.

### Admin-API
- **POST `/checkAdmin`**: Überprüft, ob ein Benutzer Adminrechte hat.