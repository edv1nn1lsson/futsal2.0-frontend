<p align="center"> <img src="images/logo.png" alt="futsal logo" width="400"/> </p>

En webbapplikation som delar upp spelare i jämna futsallag. Välj vilka som är på plats, tryck på **Skapa lag** och få en lagindelning som tar hänsyn till både position och skicklighet. Laggenereringen sker i en separat backend byggd med Quarkus (Java).

**🌐 Testa appen:** [edv1nn1lsson.github.io/futsal2.0-frontend](https://edv1nn1lsson.github.io/futsal2.0-frontend/)

> Backend körs på Render. Om tjänsten har legat oanvänd en stund kan det ta en liten stund innan första anropet svarar.

## Funktioner

- **Välj spelare** från en lista i bokstavsordning, eller markera alla på en gång.
- **Lägg till tillfälliga spelare** (gäster) med namn, skill och position. De sorteras in i listan bland de ordinarie spelarna och finns bara kvar tills sidan laddas om.
- **Skapa lag:** två, tre eller fyra lag beroende på antalet spelare, med så jämn fördelning av position och skicklighet som möjligt.
- **Responsiv design** som fungerar på både mobil och dator.

## Teknik

- HTML, CSS och JavaScript (ingen byggprocess)
- [Bootstrap 5](https://getbootstrap.com/) för layout, komponenter och overlay
- [Axios](https://axios-http.com/) för anrop till backend
- Hostas på GitHub Pages

## Projektstruktur

| Fil          | Innehåll                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html` | Sidans struktur: spelarlista, knappar, lagindelning, formuläret för tillfällig spelare (som overlay) och laddningsoverlay.            |
| `app.js`     | All logik: hämta och rendera spelare, lägga till och ta bort tillfälliga spelare, skapa lag via backend, visa lag och felmeddelanden. |
| `styles.css` | Egen styling ovanpå Bootstrap: gröna accentfärger, overlay, felmeddelanden, responsiva justeringar och footer.                        |
| `images/`    | Logotyp, favicon, bilder och animationer som visas under laggenerering.                                                               |

## Utvecklare

Skapad av [Edvin Nilsson](https://github.com/edv1nn1lsson).
