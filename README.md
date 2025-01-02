![futsal logo](images/logo.png)

En webbapplikation för att generera futsallag. Användaren kan välja vilka spelare som ska ingå i lagindelningen från listan. Utifrån de valda spelarna skapas balanserade lag med hjälp av backend-tjänster.

## Användning

- **Välj spelare:** Markera de spelare som ska inkluderas i lagindelningen.
- **Rensa val:** Klicka på "Rensa"-knappen för att avmarkera alla spelare.
- **Skapa lag:** Klicka på "Skapa lag"-knappen för att generera lag.

## Filer

#### index.html

HTML-struktur för applikationen. Innehåller layouten för spelare, lagindelning och en bild.

#### app.js

JavaScript-logik för att hämta spelare, rendera spelare och lag, hantera användarinteraktioner, och göra anrop till backend-tjänster.

- Hämta spelare: Hämtar spelare från backend-endpointen.
- Rendera spelare: Visar spelarna som en lista med checkboxar.
- Skapa lag: Genererar lag baserat på valda spelare och anropar backend-tjänster.
- Visa/dölj overlay: Visar en overlay med en laddningsanimering under laggenerering.
- Rendera lag: Visar de genererade lagen på sidan.
- Event-hanterare: Hanterar användarinteraktioner såsom klick på knappar och checkboxar.

## Utvecklare

Skapad av [Edvin Nilsson](https://github.com/edv1nn1lsson).
