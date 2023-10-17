# Umfang
SimpleQ ist eine Frageplattform, die durch automatische KI-Antworten schneller Antworten liefert als bisherige Plattformen. 
Eine hohe Nutzerinteraktivität wird durch Expertenantworten ermöglicht. 
Insgesamt ist SimpleQ eine hybride Plattform zwischen benutzergenerierten und durch künstliche Intelligenz generierten Inhalt. 


### Für Diskussionen soll folgendes implementiert werden: 
  * KI-Generierte Antworten ermöglichen (Abhängig von Stufe / highlight)
  * Diskussionsforum für Nutzer
  * Suchbarkeit von Fragen anhand der Titel und der Tags
  * Verschlagwortung der Themen mit Tags
  * Für alle Nutzer: Contentmoderationssystem

### Zusätzlich soll folgendes implementiert werden.
* verschiedene Anmeldemöglichkeiten:
    * Google-Login
    * Apple-Login
    * GitHub-Login
    * Custom-Login mit 2FA / MFA
    * Sicherheitsschlüssel

* 3 Stufen Modell
    1. Gast -
        * kann anonym Fragen stellen, die von Nutzern beantwortet werden können,
        * Frage verschwindet zeitnah (ca. 1 Tag)
        * Spamfilter und Blacklist für Themen z.B. [Spamfilter-API](https://rapidapi.com/blaazetech/api/spam-caller-check)
    2. Registrierter Nutzer:
        * Fragen können von Nutzern und KI (einfacher Zugang) beantwortet werden.
        * Limitierte Anzahl von Fragen, die von KI beantwortet werden können.
        Daumen geben.
        * Fragen Speichern
        * E-Mail Benachrichtigung
     3. Premium Nutzer:
        * Fragen können von Nutzern und KI (erweiterter Zugang) beantwortet werden.
        * Anbindung: Wolfram Alpha
        * SimpleChat-Einbindung, kommunizieren zwischen Nutzern
    

* Gamification:
  * verschiedene Rollen (z.B. Anfänger, Experte etc.), erreichbar durch regelmäßig Aktivitität und sinnvolle Beiträge
  * tägliche "Quests" zur Förderung der Aktivität?