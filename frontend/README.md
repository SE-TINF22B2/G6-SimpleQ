# Frontend Applikation für G6-SimpleQ

Hier findet sich der SourceCode für das Frontend des G6-SimpleQ Projektes.

Die Anwendung baut auf die JavaScript-Bibliothek [React](https://fr.react.dev/reference/react) auf und wird in diesem
Projekt als SinglePage-Application genutzt.
Das Kernkonzept von React ist, dass einzelne Elemente der Benutzeroberfläche als Komponente zusammengefasst werden und
die Komponenten wiederverwendet werden können.

## Erste Schritte

### Verfügbare Skripte des Frontends

`yarn start`
Führt die Anwendung im Entwicklungsmodus aus.\
Diese lässt sich unter [http://localhost:3006](http://localhost:3006) im Browser betrachten.
Die Seite wird neu geladen, wenn Änderungen vorgenommen werden.\

`yarn tunnel`
Der Ory-Tunnel wird auf Port 4000 gestartet, um die Anmeldung zum lokalen Testen zu ermöglichen.

`yarn test`
Führt alle Tests geänderter Dateien aus.

`yarn coverage`
Berechnet die Abdeckung des SourceCodes durch Tests.

`yarn build`
Bereitet das Frontend für das Deployment vor und baut die Anwendung für die Produktion im `build` Ordner.

### Hinweise

## Projektstruktur

```text
src
|- components
    |- button
        |= Button.tsx
        |= Button.test.tsx
        |= Button.scss
|- def
|- illustrations
|- images
|- locales
    |- en
        |= translation.json
|- pages
    |- dashboard
        |- editor
            |= Editor.tsx
            |= Editor.scss
        |- ...
        |= Dashboard.tsx
        |= Dashboard.scss
    |- home
        |- ...
    |= App.tsx
    |= App.scss
|= index.tsx
|= index.scss
```

| Directory/File       | Beschreibung                                                                       |
|----------------------|------------------------------------------------------------------------------------|
| `src/`               | Quellcode für das Frontend                                                         |
| `src/images/`        | Bildressourcen                                                                     |
| `src/illustrations/` | Illustrationen                                                                     |
| `src/locales/`       | Sprachressourcen, Standard- and Rückfallsprache is `en`                            |
| `src/pages/`         | Quelltext für einzelne Seiten, hierarchische Struktur                              |
| `src/components/`    | Wiederverwendbare Komponenten z.B. Schaltflächen, Auswahlfelder, Diagrammbausteine |
| `src/index.tsx`      | Einstiegspunkt der Anwendung                                                       |
| `package.json`       | Datei des Paketmanagers für externe Pakete (dependencies)                          |

Die Komponenten bestehen jeweils aus einer `.tsx` und einer `.scss`-Datei.
[TSX](https://fr.react.dev/learn/typescript) ist eine Syntaxerweiterung für TypeScript, die HTML-Ähnliches Markup in der
Datei ermöglicht.
[SCSS](https://sass-lang.com/documentation/syntax/) (Syntactically Awesome Stylesheets) ist eine
geänderte [Stylesheet-Sprache](https://en.wikipedia.org/wiki/Style_sheet_language)
