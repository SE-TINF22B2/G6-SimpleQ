# Frontend Applikation für G6-SimpleQ

Hier findet sich der SourceCode für das Frontend des G6-SimpleQ Projektes.

Die Anwendung baut auf die JavaScript-Bibliothek [React](https://fr.react.dev/reference/react) auf und wird in diesem Projekt als SinglePage-Application genutzt.
Das Kernkonzept von React ist, dass einzelne Elemente der Benutzeroberfläche als Komponente zusammengefasst werden und die Komponenten wiederverwendet werden können.

## Erste Schritte
### Verfügbare Skripte von React
    // TODO
Im Projektverzeichnis können Sie folgendes ausführen:

`npm start`
Führt die Anwendung im Entwicklungsmodus aus.\
Öffnen Sie [http://localhost:3000](http://localhost:3000), um sie im Browser zu betrachten.
Die Seite wird neu geladen, wenn Sie Änderungen vornehmen.\
Sie werden auch alle Lint-Fehler in der Konsole sehen.

`npm test` 
Startet den Test Runner im interaktiven Überwachungsmodus.\
Weitere Informationen finden Sie im Abschnitt über [Tests ausführen] (https://facebook.github.io/create-react-app/docs/running-tests).

`npm run build`

Baut die Anwendung für die Produktion in den `build` Ordner.\
Es bündelt React korrekt im Produktionsmodus und optimiert den Build für die beste Leistung.
Der Build ist minifiziert und die Dateinamen enthalten die Hashes.\
Ihre App ist bereit für das Deployment!
Siehe den Abschnitt über [deployment](https://facebook.github.io/create-react-app/docs/deployment) für weitere Informationen.

### Hinweise
    // TODO

## Projektstruktur

```text
src
|- components
|- def
|- illustrations
|- images
|- locales
    |- en
|- pages
    |- dashboard
    |- home
    |= App.tsx

|= index.scss
|= index.tsx
|= react-app-env.d.ts
|= setupTests.ts
```

| Directory/File   | Beschreibung                                                                       |
|------------------|------------------------------------------------------------------------------------|
| `src/`           | Quellcode für das Frontend                                                         |
| `images/`        | Bildressourcen                                                                     |
| `illustrations/` | Illustrationen                                                                     |
| `locales/`       | Sprachressourcen, Standard- and Rückfallsprache is `en`                            |
| `pages/`         | Quelltext für einzelne Seiten                                                      |
| `components/`    | Wiederverwendbare Komponenten z.B. Schaltflächen, Auswahlfelder, Diagrammbausteine |
| `src/index.tsx`  | Einstiegspunkt der Anwendung                                                       |
| `package.json`   | Datei des Packetmanagers für externe pakete (dependencies)                         |


Die Komponenten bestehen jeweils aus einer `.JSX` und einer `.SCSS`-Datei.
[TSX](https://fr.react.dev/learn/typescript) ist eine Syntaxerweiterung für TypeScript, die HTML-Ähnliches Markup in der Datei ermöglicht.
[SCSS](https://sass-lang.com/documentation/syntax/) (Syntactically Awesome Stylesheets) ist eine geänderte [Stylesheet-Sprache](https://en.wikipedia.org/wiki/Style_sheet_language)
