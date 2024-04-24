# Backend Applikation für G6-SimpleQ

Hier findet sich der SourceCode des Backends für das G6-SimpleQ Projekt.


## Hinweis für den Identity Provider

Aufgrund der Tatsache, dass wir Social Logins via GitHub, Apple und Google verwenden, muss man sich in der Entwicklung bei der ory-cli auf dem ory Cloud Projekt einloggen, damit das einwandfrei funktioniert. Dafür kann der ` yarn ory-auth` Befehl verwendet werden. Dieser führt den Login aus. Danach kann der Befehl `yarn tunnel` verwendet werden. Dieser setzt den für die Entwicklung notwendigen und hilfsbereiten Tunnel zu verwenden.