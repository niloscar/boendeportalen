# Frontendramverk, kunskapskontroll 2 – Boendeportalen

## Grupp 2

- Erica Friberg
- Oscar Nilsson
- Sebastian Valdemarsson
- Sofie Johnsson
- Viktor Lindqvist 

## Tech stack

- TypeScript
- React
- Tailwind CSS
- PostgreSQL

## Projektstandard

### Namngivning

#### Branches

Branches namnges enligt:

```text
typ/kort-beskrivning
```

Tillåtna branch-prefix:

```text
feature/  - Ny funktionalitet
fix/      - Buggfix
hotfix/   - Akut fix i produktion
chore/    - Underhåll, deps, config
refactor/ - Omstrukturering utan ny funktionalitet
docs/     - Dokumentation
```

Exempel:

```text
feature/login-page
chore/dependencies-1
refactor/api
docs/readme-update-1
```

#### Filer och mappar

Generellt namnges filer och mappar med `camelCase`.

- **React-komponenter** skrivs i `.tsx`-filer och namnges med `PascalCase`.
- **Variabler och funktioner** skrivs med `camelCase`.
- **Typer och interfaces** skrivs med `PascalCase`.
- **Klasser** skrivs med `PascalCase`.
- **Miljövariabler** skrivs med `versaler och understreck`.

### Kodstil

- Kod skrivs på engelska.
- TypeScript används för all applikationskod.
- Läsbar kod bör prioriteras framför kort kod.
- Håll funktioner små och fokuserade.
- Undvik upprepning (DRY).
- Följ befintlig kodstil i projektet.

#### TypeScript

- Använd tydliga typer där det förbättrar läsbarhet och säkerhet.
- Undvik `any` om det inte finns en tydlig anledning.

#### Indentering

Använd 4 mellanslag för indentering.

#### Kommentarer

Kommentarer skrivs på engelska och används när koden inte är självförklarande.

```ts
// Redirect if the user is not authenticated.
if (!user) {
    redirect('/login');
}
```

#### Före pull request

Ta bort sådant som inte ska mergas in:

- oanvänd kod
- tillfälliga `console.log`
- testdata
- tillfälliga kommentarer

### Dokumentation

All dokumentation utöver denna README skrivs på engelska.

Det gäller till exempel:

- kodkommentarer
- PR-beskrivningar
- commit-meddelanden

### Commits

Commits ska vara korta och tydliga.

Exempel:

```text
Add login page
Fix broken document upload
Update README
Refactor API client
```

### Pull requests

En pull request kräver:

- En tydlig titel och en kort beskrivning av vad som har ändrats.
- Att ändringen är kontrollerad lokalt genom att appen har startats och berörd funktionalitet har testats manuellt.
- Att branch-namnet följer projektets standard.
- Att oanvänd kod, tillfälliga `console.log`, testdata och tillfälliga kommentarer är borttagna.
- Att dokumentation är uppdaterad om ändringen kräver det.

#### PR-beskrivning

Använd gärna följande format:

```md
## What has changed?

Short description of the change.

## Why?

Short description of the purpose of the change.
```

#### Merge

- Pull requests mergas i första hand till `dev`.
- `dev` används för pågående utveckling och ska vara körbar.
- `main` används för stabila versioner och ska alltid vara körbar.
- Ändringar mergas från `dev` till `main` när de är testade och redo för leverans.