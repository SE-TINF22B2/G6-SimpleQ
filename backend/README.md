# Backend Applikation für G6-SimpleQ

Hier findet sich der SourceCode des Backends für das G6-SimpleQ Projekt.

## Initialisierung des Backends

Um die Verbindungen zu Ory und der Datenbank herstellen zu können, muss die Datei `.env.example` kopiert und in `.env` umbenannt werden. In dieser Datei müssen dann die URLs für Ory und der Datenbank angegeben werden. Mit dem Befehl `yarn prisma` wird die Datenbank initialisiert und dabei die nötigen Tabellen erstellt. Um die nötigen Packages für den Server herunterzuladen, muss der Befehl `yarn` ausgeführt werden.


## Hinweis für den Identity Provider

Aufgrund der Tatsache, dass wir Social Logins via GitHub, Apple und Google verwenden, muss man sich in der Entwicklung bei der ory-cli auf dem ory Cloud Projekt einloggen, damit das einwandfrei funktioniert. Dafür kann der `yarn ory-auth` Befehl verwendet werden. Dieser führt den Login aus. Danach kann der Befehl `yarn tunnel` verwendet werden. Dieser setzt den für die Entwicklung notwendigen und hilfsbereiten Tunnel zu verwenden.


## Starten des Backends

Der Befehl `yarn start:dev` startet den Server, welcher dann über localhost:3000 erreichbar ist
