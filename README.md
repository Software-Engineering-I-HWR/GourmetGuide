# GourmetGuide

## Übersicht

Webanwendung zur Verwaltung von Kochrezepten. Ermöglicht das Erstellen, Bearbeiten, Löschen, Suchen und Filtern von Rezepten. Umfasst Benutzerverwaltung mit JWT-Authentifizierung, Bewertungssystem, Lesezeichen, Follow-System und PDF-Export. Hochschulprojekt im Modul Software-Engineering I.

## Projektstatus

| Feld | Wert |
|------|------|
| Status | Aktiv |
| Stabilität | Stabil |
| Produktiv nutzbar | Ja (gourmet-guide.com) |
| Letzte bekannte Änderung | Noch nicht dokumentiert |
| Offene Hauptaufgaben | Noch nicht dokumentiert |

## Metadaten

| Feld | Wert |
|------|------|
| Projektname | GourmetGuide |
| Repository-URL | Noch nicht dokumentiert |
| Version | 1.0.0 |
| Autoren | GourmetGuide-Team |
| Lizenz | MIT |

## Technologie-Stack

| Bereich | Technologie | Zweck |
|---------|-------------|-------|
| Sprache (Frontend) | TypeScript | Typsichere Frontend-Entwicklung |
| Sprache (Backend) | JavaScript / TypeScript | Backend-Services |
| Framework (Frontend) | React 18 | UI-Framework |
| Build-Tool | Vite 6 | Frontend-Bundler und Dev-Server |
| CSS-Framework | Bootstrap 5 | Responsive Styling |
| Icons | FontAwesome 6 | Icon-Bibliothek |
| Routing (Frontend) | React Router 6 | Client-side Routing |
| Framework (Backend) | Express 4 | HTTP-Server und Routing |
| Datenbank | MariaDB | Persistenz |
| DB-Treiber | mysql2, mariadb | Datenbankverbindung |
| Authentifizierung | JWT (jsonwebtoken) | Token-basierte Auth |
| Passwort-Verschlüsselung | AES-256-CBC (crypto) | Symmetrische Verschlüsselung |
| Datei-Upload | multer | Multipart-Upload-Handling |
| Bildverarbeitung | sharp | Komprimierung und Konvertierung |
| PDF-Generierung | pdf-lib | Rezept-PDF-Erstellung |
| HTTP-Client | axios, fetch | Service-zu-Service-Kommunikation |
| Bildspeicherung | GitHub API | Bilder in separatem GitHub-Repository |
| Containerisierung | Docker | Service-Isolation |
| HTTPS | Node.js https-Modul | TLS-Terminierung in Global-API |

## Dependencies

### Frontend

| Dependency | Zweck |
|------------|-------|
| `react` / `react-dom` | UI-Framework und DOM-Rendering |
| `react-router-dom` | Client-side Routing |
| `bootstrap` | CSS-Framework |
| `@fortawesome/fontawesome-free` | Icons |
| `jwt-decode` | JWT-Token-Dekodierung im Client |
| `vite` | Build-Tool und Dev-Server |
| `typescript` | Typsicherheit |
| `@vitejs/plugin-react` | React-Plugin für Vite |
| `eslint` | Linting |

### Global-API

| Dependency | Zweck |
|------------|-------|
| `express` | HTTP-Server |
| `cors` | Cross-Origin Resource Sharing |
| `axios` | HTTP-Client |
| `multer` | Datei-Upload-Handling |
| `form-data` | Multipart-Formulardaten |
| `mysql2` / `mariadb` | Datenbankverbindung |

### Datenbank-API

| Dependency | Zweck |
|------------|-------|
| `express` | HTTP-Server |
| `cors` | Cross-Origin Resource Sharing |
| `axios` | HTTP-Client |
| `mysql2` / `mariadb` | Datenbankverbindung |

### Login-Service

| Dependency | Zweck |
|------------|-------|
| `express` | HTTP-Server |
| `cors` | Cross-Origin Resource Sharing |
| `jsonwebtoken` | JWT-Erstellung und -Validierung |
| `jwt-decode` | JWT-Dekodierung |
| `bcryptjs` | Passwort-Hashing (verfügbar, aber AES wird verwendet) |
| `cookie-parser` | Cookie-Handling |
| `dotenv` | Umgebungsvariablen |
| `body-parser` | Request-Body-Parsing |

### PDF-Service

| Dependency | Zweck |
|------------|-------|
| `express` | HTTP-Server |
| `cors` | Cross-Origin Resource Sharing |
| `pdf-lib` | PDF-Dokument-Erstellung |
| `jsonwebtoken` | JWT-Validierung |
| `bcryptjs` | Verfügbar |
| `cookie-parser` | Cookie-Handling |
| `dotenv` | Umgebungsvariablen |

### ImageUpload-Service

| Dependency | Zweck |
|------------|-------|
| `express` | HTTP-Server |
| `cors` | Cross-Origin Resource Sharing |
| `multer` | Datei-Upload |
| `sharp` | Bildkomprimierung und -konvertierung |
| `dayjs` | Datums-/Zeitformatierung |
| `jsonwebtoken` | JWT-Validierung |

## Projektstruktur

```text
GourmetGuide/
├── Frontend/                # React-Anwendung (Vite + TypeScript)
│   ├── src/
│   │   ├── components/      # UI-Komponenten (Home, Login, Search, etc.)
│   │   ├── App.tsx          # Hauptkomponente
│   │   └── main.tsx         # Einstiegspunkt
│   ├── public/              # Statische Assets (Bilder, Icons)
│   ├── package.json
│   └── vite.config.ts
├── Global-API/              # Öffentliche HTTPS-API (Gateway, Port 3000)
│   ├── global-api.js        # Express-Server mit allen öffentlichen Endpunkten
│   ├── AllEndpoints.md      # Endpunkt-Übersicht
│   └── package.json
├── Datenbank-API/           # Interne Datenbank-API
│   ├── api.js               # Rezept-API (Port 3007)
│   ├── local-api.js         # User-API (Port 3006)
│   ├── encrypt.js           # Passwort-Verschlüsselungs-Tool (CLI)
│   └── package.json
├── Backend/
│   ├── Login/               # Login-Service (TypeScript, Port 30156)
│   │   └── src/
│   │       ├── index.ts
│   │       ├── authcontroller.ts
│   │       └── database.ts
│   ├── PDF-Share/           # PDF-Export-Service (TypeScript, Port 30157)
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── recipe.ts
│   │   └── assets/
│   └── ImageUpload/         # Bild-Upload-Service (TypeScript, Port 30158)
│       └── src/
│           └── index.ts
├── config/                  # Konfigurationsdateien (nicht im Git)
│   ├── config.json          # DB-Credentials und Host
│   ├── frontend-config.json # Frontend-spezifische Konfiguration
│   ├── jwt-secret.json      # JWT-Secret
│   ├── encryption-secret.json # AES-Encryption-Key
│   ├── github-config.json   # GitHub-API-Token für Bild-Upload
│   ├── unlocked-users.json  # Admin-Benutzerliste
│   └── cert/                # HTTPS-Zertifikate
├── .gitignore
├── LICENSE                  # MIT-Lizenz
└── README.md
```

## Architektur

### Komponentenübersicht

| Komponente | Aufgabe | Technologie | Port |
|------------|---------|-------------|------|
| Frontend | Benutzeroberfläche | React 18, TypeScript, Vite 6 | Dev: 5173 |
| Global-API | Öffentliches HTTPS-Gateway | Node.js, Express 4 | 3000 (HTTPS) |
| Datenbank-API | Interne Rezept-Datenbankoperationen | Node.js, Express 4 | 3007 |
| User-API | Interne Benutzerverwaltung | Node.js, Express 4 | 3006 |
| Login-Service | JWT-Authentifizierung | Node.js, TypeScript, Express 4 | 30156 |
| PDF-Service | PDF-Export von Rezepten | Node.js, TypeScript, Express 4, pdf-lib | 30157 |
| ImageUpload-Service | Bild-Upload und -Komprimierung | Node.js, TypeScript, Express 4, sharp | 30158 |
| Datenbank | Persistenz | MariaDB | 3306 |
| Bildspeicher | Rezeptbilder | GitHub Repository (GourmetGuidePictures) | – |

### Architekturdiagramm

```text
[Browser / Client]
        |
        | HTTPS (Port 3000)
        v
[Global-API (Gateway)]
        |
        ├── HTTP (Port 3007) ──────> [Datenbank-API] ──> [MariaDB]
        ├── HTTP (Port 3006) ──────> [User-API] ───────> [MariaDB]
        ├── HTTP (Port 30156) ─────> [Login-Service] ──> [User-API]
        ├── HTTP (Port 30157) ─────> [PDF-Service]
        └── HTTP (Port 30158) ─────> [ImageUpload-Service] ──> [GitHub API]
```

## Datenfluss

### Hauptdatenfluss

```text
Benutzer
  │
  │ Browser-Interaktion
  v
Frontend (React)
  │
  │ HTTPS Request (Port 3000)
  v
Global-API (Gateway)
  │
  ├─── Rezept-Operationen ──> Datenbank-API (Port 3007) ──> MariaDB
  ├─── User-Operationen ───> User-API (Port 3006) ──────── > MariaDB
  ├─── Login/Register ─────> Login-Service (Port 30156) ──> User-API ──> MariaDB
  ├─── PDF-Export ──────────> PDF-Service (Port 30157)
  └─── Bild-Upload ────────> ImageUpload-Service (Port 30158) ──> GitHub API
  │
  │ Response
  v
Frontend
  │
  v
Benutzer
```

### Ablauf im Detail

1. Der Benutzer interagiert mit dem React-Frontend im Browser.
2. Das Frontend sendet HTTPS-Requests an die Global-API (Port 3000).
3. Die Global-API leitet Anfragen an den zuständigen internen Service weiter.
4. Die Datenbank-API (Port 3007) führt SQL-Operationen für Rezepte, Bewertungen, Lesezeichen und Follows auf MariaDB aus.
5. Die User-API (Port 3006) verwaltet Benutzerkonten und liefert Benutzerstatistiken.
6. Der Login-Service (Port 30156) authentifiziert Benutzer, verschlüsselt Passwörter (AES-256-CBC) und erstellt JWT-Tokens (Gültigkeit: 1h).
7. Der PDF-Service (Port 30157) generiert PDFs aus Rezeptdaten mit pdf-lib.
8. Der ImageUpload-Service (Port 30158) komprimiert Bilder mit sharp und lädt sie per GitHub API in ein separates Repository hoch.
9. Die Antwort wird über die Global-API zurück an das Frontend geliefert.

### Fehlerfluss

```text
Fehlerhafte Anfrage / Netzwerkfehler
  │
  v
Global-API fängt Fehler ab
  │
  v
HTTP-Fehlercode + Fehlermeldung an Frontend
  │
  v
Anzeige im UI
```

## Datenmodell

### Datenbanktabellen (MariaDB)

#### Rezept

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| ID | INT (Auto-Increment) | Primärschlüssel |
| Title | VARCHAR | Rezeptname |
| Image | VARCHAR | URL zum Rezeptbild |
| Difficulty | VARCHAR | Schwierigkeitsgrad |
| Ingredients | TEXT | Zutaten (Pipe-separiert) |
| Steps | TEXT | Zubereitungsschritte (Pipe-separiert) |
| Category | VARCHAR | Kategorie |
| Vegan | BOOLEAN | Vegan-Kennzeichnung |
| Vegetarian | BOOLEAN | Vegetarisch-Kennzeichnung |
| Allergen | VARCHAR | Allergen-Informationen |
| Creator | VARCHAR | Benutzername des Erstellers |

#### Account

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| Username | VARCHAR | Primärschlüssel, Benutzername |
| Password | VARCHAR | Verschlüsseltes Passwort (AES-256-CBC) |

#### Bewertung

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| ID | INT | Rezept-ID (FK) |
| Username | VARCHAR | Benutzername (FK) |
| Bewertung | INT | Bewertungszahl |

Primärschlüssel: (ID, Username)

#### Lesezeichen

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| ID | INT | Rezept-ID (FK) |
| Username | VARCHAR | Benutzername (FK) |
| Bookmark | BOOLEAN | Lesezeichen-Status |
| Updatetime | DATETIME | Zeitstempel der letzten Änderung |

Primärschlüssel: (ID, Username)

#### UserFolgen

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| UserFollowing | VARCHAR | Benutzername (wer folgt) |
| UserFollowed | VARCHAR | Benutzername (wem gefolgt wird) |
| Follow | BOOLEAN | Follow-Status |
| Updatetime | DATETIME | Zeitstempel der letzten Änderung |

Primärschlüssel: (UserFollowing, UserFollowed)

#### LastLogin

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| username | VARCHAR | Primärschlüssel |
| time | DATETIME | Zeitpunkt des letzten Logins |
| maxID | INT | Höchste Rezept-ID zum Zeitpunkt des Logins |

## Features

| Feature | Beschreibung | Status |
|---------|--------------|--------|
| Rezept CRUD | Erstellen, Lesen, Bearbeiten, Löschen von Rezepten | Fertig |
| Benutzer-Authentifizierung | Registrierung und Login mit JWT (1h Gültigkeit) | Fertig |
| Bewertungen | Rezepte mit Sternebewertung bewerten | Fertig |
| Lesezeichen | Rezepte als Lesezeichen speichern und entfernen | Fertig |
| Follow-System | Anderen Benutzern folgen, neue Rezepte sehen | Fertig |
| Gefilterte Suche | Suche nach Name, Schwierigkeit, Kategorie, Zutaten, Bewertung, vegan, vegetarisch, Allergene | Fertig |
| PDF-Export | Rezepte als formatiertes PDF herunterladen | Fertig |
| Bild-Upload | Rezeptfotos hochladen (JPEG, PNG, WEBP, max. 5 MB, Komprimierung auf JPEG) | Fertig |
| Admin-Funktionen | Benutzerverwaltung, Benutzer löschen | Fertig |
| Neue Rezepte (Feed) | Neue Rezepte von gefolgten Benutzern seit letztem Login | Fertig |
| Benutzerstatistiken | Anzahl Rezepte, Bewertungen, Lesezeichen, Follower, Folgt | Fertig |
| Responsive Design | Bootstrap 5 für Desktop und mobile Geräte | Fertig |
| Impressum | Impressum-Seite | Fertig |

## API-Endpunkte

Alle Endpunkte sind über die Global-API (Port 3000, HTTPS) erreichbar.

### Rezept-Endpunkte

| Methode | Pfad | Beschreibung | Auth erforderlich |
|---------|------|--------------|-------------------|
| POST | `/saveRecipe` | Rezept erstellen oder aktualisieren (id=0 für neu) | Nein |
| GET | `/getRecipes` | Alle Rezepte abrufen | Nein |
| GET | `/getBestRecipes` | Bestbewertete Rezepte (nach Durchschnitt) | Nein |
| GET | `/getRecipeByID?id=` | Einzelnes Rezept nach ID | Nein |
| POST | `/deleteRecipeByID?id=` | Rezept löschen (inkl. Bewertungen und Lesezeichen) | Nein |
| GET | `/getRecipesByRating?rating=` | Rezepte mit Mindestbewertung | Nein |
| GET | `/getRecipesByUser?user=` | Rezept-IDs eines Benutzers | Nein |
| GET | `/getRecipesByCategory?category=` | Rezepte nach Kategorie | Nein |
| GET | `/getFilteredRecipes?name=&difficulty=&category=&ingredients=&vegetarian=&vegan=&allergens=&rating=` | Gefilterte Rezeptsuche | Nein |
| GET | `/getAllCategories` | Alle vorhandenen Kategorien | Nein |
| GET | `/getAllIngredients` | Alle Zutaten (bereinigt und dedupliziert) | Nein |
| GET | `/getMaxID` | Höchste Rezept-ID | Nein |
| GET | `/getNewRecipesByUser?user=` | Neue Rezepte von gefolgten Benutzern seit letztem Login | Nein |

### Bewertungs-Endpunkte

| Methode | Pfad | Beschreibung | Auth erforderlich |
|---------|------|--------------|-------------------|
| GET | `/getRatingByID?id=` | Durchschnittsbewertung eines Rezepts | Nein |
| GET | `/getRatingByIDAndUser?id=&user=` | Bewertung eines Benutzers für ein Rezept | Nein |
| POST | `/saveRating?id=&user=&rating=` | Bewertung speichern (INSERT oder UPDATE) | Nein |
| GET | `/getRatedRecipesByUser?user=` | Von Benutzer bewertete Rezept-IDs | Nein |
| GET | `/getHighRatedRecipesByUser?user=` | Hoch bewertete Rezepte (≥4) eines Benutzers | Nein |

### Lesezeichen-Endpunkte

| Methode | Pfad | Beschreibung | Auth erforderlich |
|---------|------|--------------|-------------------|
| GET | `/getBookmarkByIDAndUser?id=&user=` | Lesezeichen-Status für Rezept und Benutzer | Nein |
| GET | `/getBookmarkedRecipesByUser?user=` | Alle Lesezeichen eines Benutzers | Nein |
| POST | `/saveBookmark?id=&user=&bookmark=` | Lesezeichen setzen oder entfernen | Nein |

### Follow-Endpunkte

| Methode | Pfad | Beschreibung | Auth erforderlich |
|---------|------|--------------|-------------------|
| GET | `/getFollowByUsers?user=&follows=` | Follow-Status zwischen zwei Benutzern | Nein |
| GET | `/getFollowedUsersByUser?user=` | Gefolgte Benutzer | Nein |
| POST | `/saveFollow?user=&follows=&follow=` | Follow-Status setzen oder entfernen | Nein |

### Authentifizierungs-Endpunkte

| Methode | Pfad | Beschreibung | Auth erforderlich |
|---------|------|--------------|-------------------|
| POST | `/login` | Benutzer-Login, gibt JWT-Token zurück | Nein |
| POST | `/register` | Benutzer-Registrierung | Nein |
| POST | `/checkAdmin` | Admin-Status prüfen (via Token) | Ja (Token im Body) |
| POST | `/updatePasswordByUsername` | Passwort ändern | Ja |

### Benutzer-Endpunkte

| Methode | Pfad | Beschreibung | Auth erforderlich |
|---------|------|--------------|-------------------|
| GET | `/getUsers` | Alle Benutzernamen (Admin) | Nein |
| GET | `/getUserInfo?user=` | Benutzerstatistiken (Rezepte, Bewertungen, Lesezeichen, Follower) | Nein |
| POST | `/deleteUserByUsername?user=` | Benutzer und alle zugehörigen Daten löschen | Nein |
| GET | `/getLastLoginByUser?user=` | Letzter Login eines Benutzers | Nein |
| POST | `/setLastLoginByUser?user=` | Letzten Login speichern | Nein |

### PDF- und Upload-Endpunkte

| Methode | Pfad | Beschreibung | Auth erforderlich |
|---------|------|--------------|-------------------|
| POST | `/generate-pdf` | PDF aus Rezeptdaten generieren | Nein |
| POST | `/upload-image` | Rezeptbild hochladen (JPEG, PNG, WEBP, max. 5 MB) | Nein |

## Commands / CLI / Bot-Befehle

| Command | Beschreibung | Parameter | Ergebnis |
|---------|--------------|-----------|----------|
| `node encrypt.js <password>` | Passwort mit AES-256-CBC verschlüsseln | Passwort als Argument | Verschlüsselter String auf stdout |

## Konfiguration

Die Konfiguration erfolgt über JSON-Dateien im `config/`-Verzeichnis. Das gesamte `config/`-Verzeichnis ist in `.gitignore` eingetragen und muss manuell erstellt werden.

### Benötigte Konfigurationsdateien

| Datei | Zweck |
|-------|-------|
| `config/config.json` | Datenbank-Host und -Credentials |
| `config/frontend-config.json` | Frontend-spezifische Konfiguration |
| `config/jwt-secret.json` | JWT-Signatur-Secret |
| `config/encryption-secret.json` | AES-256-Schlüssel (32 Zeichen) |
| `config/github-config.json` | GitHub-API-Token für Bild-Upload |
| `config/unlocked-users.json` | Liste der Admin-Benutzer |
| `config/cert/privkey.pem` | HTTPS Private Key |
| `config/cert/cert.pem` | HTTPS-Zertifikat |
| `config/cert/chain.pem` | HTTPS CA-Chain |

## Umgebungsvariablen

Die Anwendung verwendet keine Umgebungsvariablen. Konfiguration erfolgt ausschließlich über JSON-Dateien im `config/`-Verzeichnis.

## Konfigurationsdateien

| Datei | Zweck | Muss angepasst werden |
|-------|-------|----------------------|
| `config/config.json` | DB-Host, User, Passwort, Datenbankname | Ja |
| `config/frontend-config.json` | Frontend-Konfiguration | Ja |
| `config/jwt-secret.json` | JWT-Secret (`{ "jwtsecret": "YOUR_SECRET_HERE" }`) | Ja |
| `config/encryption-secret.json` | AES-Key (`{ "encryption_key": "YOUR_32_CHAR_KEY" }`) | Ja |
| `config/github-config.json` | GitHub-Token (`{ "username": "...", "password": "...", "token": "YOUR_TOKEN_HERE" }`) | Ja |
| `config/unlocked-users.json` | Admin-Liste (`{ "unlocked_users": [{ "username": "..." }] }`) | Ja |
| `config/cert/*` | HTTPS-Zertifikate (privkey.pem, cert.pem, chain.pem) | Ja |

## Schnellstart

```bash
git clone <repository-url>
cd GourmetGuide

# config/-Verzeichnis erstellen und Dateien befüllen (siehe Konfiguration)

# Frontend
cd Frontend && npm install && npm run dev

# Datenbank-API (Rezepte, Port 3007)
cd ../Datenbank-API && npm install && node api.js

# User-API (Port 3006)
node local-api.js

# Login-Service (Port 30156)
cd ../Backend/Login && npm install && npm run start

# PDF-Service (Port 30157)
cd ../PDF-Share && npm install && npm run start

# ImageUpload-Service (Port 30158)
cd ../ImageUpload && npm install && npm run dev

# Global-API (Port 3000, HTTPS)
cd ../../Global-API && npm install && node global-api.js
```

## Installation

### Voraussetzungen

- Node.js (empfohlen: LTS-Version)
- npm
- MariaDB
- HTTPS-Zertifikate (für produktiven Betrieb der Global-API)
- GitHub-Account mit Token (für Bild-Upload)

### Schritte

```bash
git clone <repository-url>
cd GourmetGuide
```

Jeden Service separat installieren:

```bash
cd Frontend && npm install
cd ../Datenbank-API && npm install
cd ../Global-API && npm install
cd ../Backend/Login && npm install
cd ../Backend/PDF-Share && npm install
cd ../Backend/ImageUpload && npm install
```

Das `config/`-Verzeichnis mit allen benötigten JSON-Dateien und Zertifikaten erstellen (siehe Abschnitt Konfigurationsdateien).

MariaDB-Datenbank `GourmetGuide` mit den Tabellen Rezept, Account, Bewertung, Lesezeichen, UserFolgen und LastLogin einrichten.

## Lokale Entwicklung

### Services und Ports

| Service | Port | Startbefehl | Verzeichnis |
|---------|------|-------------|-------------|
| Frontend (Vite Dev) | 5173 | `npm run dev` | `Frontend/` |
| Global-API | 3000 (HTTPS) | `node global-api.js` | `Global-API/` |
| Datenbank-API (Rezepte) | 3007 | `node api.js` | `Datenbank-API/` |
| User-API | 3006 | `node local-api.js` | `Datenbank-API/` |
| Login-Service | 30156 | `npm run start` | `Backend/Login/` |
| PDF-Service | 30157 | `npm run start` | `Backend/PDF-Share/` |
| ImageUpload-Service | 30158 | `npm run dev` | `Backend/ImageUpload/` |

### Benötigte Dienste

- MariaDB muss lokal oder als Container auf dem konfigurierten Host erreichbar sein
- Alle Backend-Services müssen gestartet sein, bevor die Global-API korrekt funktioniert

### Startreihenfolge

1. MariaDB
2. Datenbank-API + User-API
3. Login-Service, PDF-Service, ImageUpload-Service
4. Global-API
5. Frontend

## Build

| Befehl | Verzeichnis | Zweck |
|--------|-------------|-------|
| `npm run build` | `Frontend/` | TypeScript-Build + Vite-Produktionsbuild |
| `npm run build` | `Backend/Login/` | TypeScript-Kompilierung |
| `npm run build` | `Backend/PDF-Share/` | TypeScript-Kompilierung |
| `npm run build` | `Backend/ImageUpload/` | TypeScript-Kompilierung |

## Tests

Keine Tests vorhanden.

## Deployment

| Feld | Wert |
|------|------|
| Hosting | Synology NAS |
| Containerisierung | Docker |
| Domain | gourmet-guide.com |
| HTTPS | Ja (Zertifikate in `config/cert/`) |
| Bildspeicher | GitHub Repository (GourmetGuidePictures) |

Kein `docker-compose.yml` im Repository vorhanden. Docker-Setup wird extern verwaltet.

## CI/CD

Noch nicht dokumentiert.

## Sicherheit

- HTTPS-Verschlüsselung über TLS-Zertifikate in der Global-API
- JWT-basierte Authentifizierung (Gültigkeit: 1 Stunde)
- AES-256-CBC-Passwortverschlüsselung mit deterministischem IV
- Admin-Berechtigungsprüfung über Token-Dekodierung und Whitelist (`unlocked-users.json`)
- Datei-Upload auf JPEG, PNG, WEBP beschränkt (max. 5 MB)
- Bildkomprimierung vor Upload (max. 2 MB nach Komprimierung)

### Sicherheitshinweise

- DB-Credentials liegen in `config/config.json` (nicht als Umgebungsvariablen)
- Kein serverseitiges Auth-Middleware auf den meisten Endpunkten (Autorisierung wird clientseitig gehandhabt)
- Keine Input-Validierung / Sanitization auf API-Ebene erkennbar
- Keine Rate-Limiting-Mechanismen vorhanden
- Passwort-Verschlüsselung verwendet deterministischen IV (abgeleitet vom Passwort selbst)

## Logging / Monitoring

- Console-Logging in allen Services (Request-Method, Route, IP, Zeitstempel)
- Kein zentrales Logging-System
- Kein Monitoring-Dashboard

## Fehlerbehandlung

- Try-Catch in allen Service-zu-Service-Aufrufen (Global-API)
- HTTP-Statuscodes werden durchgereicht
- Datenbankfehler werden als 500 Internal Server Error mit generischer Meldung zurückgegeben
- Keine strukturierte Fehlerbehandlung oder Error-Klassen

## Bekannte Limitierungen / Offene Punkte

- Kein serverseitiges Auth-Middleware (die meisten Endpunkte prüfen keine Berechtigung)
- Keine Input-Validierung auf API-Ebene
- Keine Rate-Limiting-Mechanismen
- Kein Docker-Compose im Repository
- Keine Tests vorhanden
- Keine OpenAPI-/Swagger-Dokumentation
- Passwort-Verschlüsselung mit deterministischem IV (kein Standard-Hashing wie bcrypt/argon2)
- Konfiguration über JSON-Dateien statt Umgebungsvariablen
- `config/`-Verzeichnis muss manuell erstellt werden (keine `.env.example` vorhanden)
- Login-Service und PDF-Service lauschen intern auf Port 3000, werden aber auf 30156/30157 deployed (Portmapping über Docker)
- ImageUpload-Service lauscht intern auf Port 5000, wird auf 30158 deployed

## Wartung und Erweiterung

### Neuen Endpunkt hinzufügen

1. Endpunkt in der Datenbank-API (`api.js` oder `local-api.js`) implementieren.
2. Proxy-Route in der Global-API (`global-api.js`) hinzufügen.
3. Frontend-Aufruf ergänzen.

### Neuen Service hinzufügen

1. Neues Verzeichnis unter `Backend/` erstellen.
2. Express-Server mit TypeScript aufsetzen.
3. Proxy-Route in der Global-API ergänzen.
4. Port in der Architektur-Dokumentation eintragen.

## NPM-Scripts / Build-Befehle

### Frontend

| Script | Beschreibung |
|--------|--------------|
| `npm run dev` | Vite Dev-Server starten |
| `npm run build` | TypeScript-Build + Vite-Produktionsbuild |
| `npm run lint` | ESLint ausführen |
| `npm run preview` | Vite Preview (Produktionsbuild lokal testen) |

### Backend/Login

| Script | Beschreibung |
|--------|--------------|
| `npm run build` | TypeScript-Kompilierung |
| `npm run start` | Server starten (ts-node) |
| `npm run dev` | Server mit nodemon starten |

### Backend/PDF-Share

| Script | Beschreibung |
|--------|--------------|
| `npm run build` | TypeScript-Kompilierung |
| `npm run start` | Server starten (ts-node) |
| `npm run dev` | Server mit nodemon starten |

### Backend/ImageUpload

| Script | Beschreibung |
|--------|--------------|
| `npm run build` | TypeScript-Kompilierung |
| `npm run start` | Kompilierten Server starten (node dist/index.js) |
| `npm run dev` | Server mit ts-node starten |

### Global-API / Datenbank-API

Keine NPM-Scripts definiert. Start direkt mit `node <datei>.js`.

## Änderungsverlauf der Dokumentation

| Datum | Änderung |
|-------|----------|
| 2025-07-14 | Dokumentation nach verbindlicher Struktur erstellt |
| 2025-07-27 | Vollständige Aktualisierung: User-API (Port 3006) ergänzt, Datenmodell dokumentiert, alle API-Endpunkte aus Quellcode verifiziert, Sicherheitshinweise erweitert, Konfigurationsdateien vollständig beschrieben |
