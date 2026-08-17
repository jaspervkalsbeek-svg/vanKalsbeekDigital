# Technisch Ontwerp — Van Kalsbeek Digital

Laatst bijgewerkt: 17 augustus 2026

## 1. Architectuur

**Type:** Statische single-page website
**Bouwtool:** Geen —纯 HTML, CSS, JavaScript zonder build-stap
**Hosting:** GitHub Pages
**Domein:** vankalsbeekdigital.com (CNAME), .nl redirect via domeinprovider

Er is geen framework, geen package.json, geen bundler. De site bestaat uit vier kernbestanden die direct door de browser worden geladen.

## 2. Bestandsstructuur

```
vankalsbeekdigital/
  index.html              -- hoofdpagina (single-page)
  privacy.html            -- privacy, cookies, voorwaarden
  style.css               -- alle stijlen (601 regels)
  script.js               -- alle interactie (149 regels)
  favicon.svg             -- SVG favicon
  CNAME                   -- GitHub Pages custom domain
  README.md               -- projectdocumentatie
  docs/
    functioneel_ontwerp.md
    technisch_ontwerp.md
  assets/
    logo.png              -- logo lichte modus
    logo-dark.png         -- logo donkere modus
    profile.jpg           -- profielfoto
    og-image.png          -- Open Graph afbeelding
```

## 3. Technische stack

### 3.1 HTML
- Semantische HTML5-elementen (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- `lang="nl"` op het `<html>`-element
- Skip-link voor toegankelijkheid
- ARIA-labels en aria-expanded op interactieve elementen
- Vooraf renderen van thema via inline `<script>` in `<head>` (voorkomt FOUC)

### 3.2 CSS
- CSS Custom Properties voor kleursysteem (light + dark)
- Theme-wissel via `data-theme` attribuut op `<html>`
- Geen preprocessors, geen CSS-in-JS
- Responsive breakpoints:
  - `max-width: 560px` — formulier wordt enkelkoloms
  - `max-width: 768px` — mobiel menu, grids naar 1 kolom
  - `min-width: 1024px` — desktop layout (contact 2 kolom, about 2 kolom)
- Scroll-reveal animaties via CSS transitions (`.reveal` / `.visible`)
- `prefers-reduced-motion` media query schakelt animaties uit

### 3.3 JavaScript
- IIFE (Immediately Invoked Function Expression), geen modules
- `'use strict'` mode
- Geen externe dependencies
- Functionaliteit:
  1. **Cookie consent** — banner tonen/verbergen, keuze in localStorage
  2. **Google Analytics** — pas laden na expliciete toestemming
  3. **Mobile menu** — toggle open/dicht via `aria-expanded`
  4. **Theme toggle** — schakel light/dark, sla op in localStorage
  5. **Footer year** — vult huidig jaar dynamisch in
  6. **Tier toggle** — wissel tussen nieuwbouw/redesign prijskaarten
  7. **Scroll reveal** — IntersectionObserver voor `.reveal` elementen
  8. **Active nav** — IntersectionObserver markeert actieve sectie in navigatie

## 4. Kleurensysteem

### Licht thema (`:root`)
| Variable | Waarde | Gebruik |
|---|---|---|
| `--navy` | `#07234B` | Brand kleur (hero, contact, footer) |
| `--primary` | `#07234B` | Buttons, accenten |
| `--accent` | `#0E4C92` | Links, labels |
| `--bg` | `#FFFFFF` | Achtergrond |
| `--bg-soft` | `#F4F6FA` | Afwisselende secties |
| `--text` | `#1B2534` | Body tekst |
| `--muted` | `#5A6678` | Secundaire tekst |

### Donker thema (`:root[data-theme="dark"]`)
| Variable | Waarde | Gebruik |
|---|---|---|
| `--primary` | `#2B5DA8` | Buttons, accenten |
| `--accent` | `#8FB6E8` | Links, labels |
| `--bg` | `#0A0F1C` | Achtergrond |
| `--surface` | `#131C30` | Cards |
| `--text` | `#E8EDF5` | Body tekst |

## 5. Lettertypen

| Lettertype | Gebruik | Bron |
|---|---|---|
| DM Serif Display | Headlines (h1, h2, testimonials) | Google Fonts |
| DM Sans | Body tekst, navigatie, buttons | Google Fonts |

Beide worden geladen via Google Fonts CDN met `preconnect`.

## 6. Responsief gedrag

| Breakpoint | Gedrag |
|---|---|
| **<=560px** | Contactformulier: naam en e-mail onder elkaar |
| **<=768px** | Navigatie wordt hamburger-menu; grids 1 kolom; padding verkleind |
| **769-1024px** | Tussenliggende layout; grids 2-3 kolommen |
| **>1024px** | Volledige desktop layout; max-width 1100px |

Touch targets minimaal 44px (WCAG 2.5.8). Font sizes minimaal 12px.

## 7. Prestaties

- Geen frameworks of libraries — totale JS is <5KB, CSS is <15KB
- Geen build-stap nodig
- Google Fonts met `display=swap` (geen FOIT)
- Scroll-reveal met IntersectionObserver (niet blokkerend)
- Cookie consent blokkeert GA-script tot na toestemming
- Thema-inline script in `<head>` voorkomt FOUC (Flash of Unstyled Content)
- Afbeeldingen: optimale formaten (JPG voor foto's, PNG voor logo's met transparantie, SVG voor favicon)

## 8. Toegankelijkheid

| Maatregel | Implementatie |
|---|---|
| Skip-link | `<a class="skip-link" href="#hoofd">` |
| Semantic HTML | `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>`, `<dl>`, `<blockquote>` |
| ARIA | `aria-label`, `aria-expanded`, `aria-controls`, `aria-pressed`, `role="tablist"`, `role="tab"`, `role="tabpanel"` |
| Focus states | `focus-visible` outlines op alle interactieve elementen |
| Reduced motion | `prefers-reduced-motion: reduce` schakelt animaties uit |
| Alt teksten | Op alle afbeeldingen |
| Kleurcontrast | navy (#07234B) op wit voldoet aan WCAG AA |

## 9. Beveiliging

- HTTPS via GitHub Pages (automatisch certificaat)
- Cookie consent: geen tracking zonder toestemming
- Formspree voor formulierverwerking (geen server-side code nodig)
- Geen wachtwoorden, geen authenticatie, geen gevoelige data opslag
- Externe links met `rel="noopener"`

## 10. Hosting & Deployment

1. Git push naar `main` branch op GitHub
2. GitHub Pages serveert automatisch vanaf de root
3. Custom domain: `vankalsbeekdigital.com` (CNAME-bestand)
4. `.nl` domein: 301-redirect via domeinprovider
5. SSL-certificaat automatisch via GitHub Pages

## 11. localStorage sleutels

| Sleutel | Waarde | Doel |
|---|---|---|
| `vkd-theme` | `"light"` of `"dark"` | Thema-keuze gebruiker |
| `vkd-cookie-consent` | `"accepted"` of `"rejected"` | Cookie-toestemming |

## 12. Externe afhankelijkheden

| Dienst | Type | Risico |
|---|---|---|
| GitHub Pages | Hosting | Laag —微软 ondersteund |
| Google Fonts | CDN lettertypen | Laag — fallback naar systeemlettertypen |
| Formspree | Formulier service | Laag — fallback via mailto-link |
| Google Analytics | Analyse | Laag — optioneel, pas na toestemming |
