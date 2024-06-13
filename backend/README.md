# Backend Applikation für G6-SimpleQ

Hier findet sich der SourceCode des Backends für das G6-SimpleQ Projekt.

Die Backendanwendung baut auf der JavaScript-Bibliothek _NestJS_ auf, welches auf Node.js und Express.js basiert.
NestJS gibt eine robuste Architektur vor.

## Erste Schritte

-------
### Initialisierung des Backends
#### Schnellstart
1. Umgebungsvariablen anpassen: `.env` erstellen und anpassen
2. Pakete installieren: `yarn install`
3. Datenbank initialisieren: `yarn prisma`
4. Ausführen: 
   1. Tunnel zu ory starten: `yarn  tunnel`
   2. Server starten: `yarn start:dev`

----
#### Beschreibung
+ Die Ausführung findet im Ordner `/backend` statt.
    ```bash
    cd ./backend
    ```

+ Um die Verbindungen zu Ory und der Datenbank herstellen zu können, muss die Datei `.env.example` kopiert und in `.env` umbenannt werden.
In dieser Datei sind Änderungen notwendig. Siehe Hinweise: [Umgebungsvariablen](#env)
  ```bash
  cp .env.example .env
  ```
+ Die nötigen Pakete mit yarn installieren:
    ```bash
    yarn install
    ```
+ Einrichtung der Datenbank
    ```bash
    yarn prisma
    ```
    Falls die Datenbank URL korrekt in der `env` eingetragen wurde, wird die Datenbank mit Prisma initialisiert und die nötigen Tabellen erstellt.

+ Aufgrund von [CORS](https://developer.mozilla.org/fr/docs/Web/HTTP/CORS) wird ein Tunnel zu Ory über die Applikation benötigt
    [https://www.ory.sh/docs/guides/cli/proxy-and-tunnel](https://www.ory.sh/docs/guides/cli/proxy-and-tunnel).
    Der Tunnel kann gestartet werden mittels:
    ```bash
    yarn tunnel
    ```

+ Starten der Anwendung im _Entwicklermodus_.
    ```bash
    yarn start:dev
    ```
  Wenn der Port nicht in der .env geändert wurde, ist nach dem Start des Servers ist die Applikation auf _localhost:3000_ erreichbar.
  Durch den _Entwicklermodus_ wird der Sourcecode auf Dateiänderungen überprüft und startet den Server mit den Änderungen neu.
  Dieser Mechanismus funktioniert allerdings **_nicht_** bei Änderungen an der `.env`-Datei.


### Hinweise:
<h4 id="env"> Umgebungsvariablen (`.env`)</h4>

+ Änderungen _zwingend_ Notwendig
   + `DATABASE_URL`: Verbindung zur Datenbank
+ Änderungen optional:
  + `ORY_URL`: URL, auf dem der Tunnel/Proxy erreichbar ist
  + `NODE_ENV`: Modus der Applikation, Auswahl: [`dev`, `prod`] 

#### Hinweis für den Identity Provider

Aufgrund der Tatsache, dass wir Social Logins via GitHub und Google verwenden, muss man sich in der Entwicklung bei der ory-cli auf dem ory Cloud Projekt einloggen. 
Dafür kann der Befehl `yarn ory-auth` verwendet werden, der den Login ausführt.
Die Ausführung ist jedoch optional, da durch die Verwendung des Befehls `yarn tunnel` ggf. zum Einloggen auffordert.


## Projektstruktur

------------
In NestJS sind Module die oberste Ebene der Organisation und dienen als Container für weitere Komponenten, 
wie Controller, Services und Submodule.
Die Controller sind für die Verarbeitung von HTTP-Anfragen und Antworten verantwortlich und interagieren mit den 
Services, die die Geschäftslogik beinhalten.

### Dateistruktur
```
src
|- auth
|- database
|- quests
|- login
|- middleware/auth
|- requests
    |- development
    |- favourites
    |- questions
    |- quests
    |- special
    |- tag
    |- user
    |= requests.module.ts
|= app.controller.ts
|= app.module.ts
|= app.service.ts
|= main.ts

config.ts
.env
```
| Ordner/Datei                | Beschreibung                                                |
|-----------------------------|-------------------------------------------------------------|
| `src/`                      | Quellcode für das Backend                                   |
| `request/`                  | Verwaltung der Anfragen                                     |
| `database/`                 | Services für Datenbankanfragen                              |
| `auth/`                     | Services zur Authentifizierungen                            |
| `request/request.module.ts` | Modul der Verarbeitung von Anfragen                         |
| `main.ts`                   | Einstieg der Applikation, verweist direkt auf das AppModule |
| `.env`                      | Systemvariablen                                             |
| `config.ts`                 | Konstanten                                                  |



Der Einstieg der Applikation liegt in der `main.ts`, welche direkt auf das `AppModule` in `app.module.ts` verweist.
Alle Anfragen in `request/` wurden entsprechend der _OpenAPI_ Spezifikation in separate Controller aufgeteilt.

Konstanten in `config.ts` sind eingestellt und werden zur Laufzeit überprüft.
Diese geben z.B. die Längen von Texten in Anfragen vor.

Für jeden Service und Controller ist eine Testdatei angelegt (`*.spec.ts`), 
welche jeweils direkt bei der Logikkomponente liegt. 

### Werkzeuge
Für die Generierung von einzelnen Komponenten wurde das [_Commandline-interface (CLI)_](https://docs.nestjs.com/recipes/crud-generator) von NestJS genutzt,
die CLI legt ein Grundgerüst einer Komponente zusammen mit einem Test in dem ggf. erstellten Ordner ab.

Als Paketmanager wird [_yarn_](https://classic.yarnpkg.com/lang/en/docs/) in der Version 1 verwendet.

### Versionen auf denen entwickelt wurde
| Werkzeug      | Version |
|---------------|---------|
| yarn          | 1.22    |
| NestJS        | 10      |
| ory-client    | 1.9     |
| prisma-client | 5.14    |


## Externe API's
Um den Nutzern der simpleQ Platform die Möglichkeit zu bieten, eine künstlich generierte Antwort zu bekommen. Hier gibt es für mathematische Fragen die Wolfram Alpha Schnittstelle und allgemeine Fragen können von einem Sprachmodell beantwortet werden, welches selbst betrieben wird.

### Wolfram Alpha
Die Wolfram Aplha KI kann eine mathematische Frage entgegen nehmen und gibt eine Antwort als Bilddatei, da zur Erklärung ebenfalls Diagramme Hilfreich sind.

Das Backend von SimpleQ sendet eine GET Anfrage an diese Schnittstelle und liefert das Bild als Zeichenkette an das Frontend.

Bsp. : Prompt: What is pi
```
http://api.wolframalpha.com/v1/simple?appid={appID}&i=What+is+pi
```

Damit das Backend auch die Anfrage auf Wunsch des Nutzers auch senden kann, muss folgende ENV gesetzt werden. Es gibt keine Authentifizierung für Schutz vor Fremdzugriffen, weshalb die appID nicht auf GitHub gepusht werden sollte:

```
WOLFRAM_APP_ID="http://api.wolframalpha.com/v1/simple?appid={appID}"
```

### Sprachmodell
Das Sprachmodell wird selber auf einem privaten Server gehostet und bietet eine Schnittstelle über einen Python Webserver.

HTTP-METHOD: POST
HOST: https://model.mybrauni.de

body:
```json
{
	"prompt": ""
}
```

header:
```
'Authorization': '{base64 encoded "Basic username:password"}'
'Content-Type': 'application/json'
```