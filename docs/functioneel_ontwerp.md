# Functioneel Ontwerp — Van Kalsbeek Digital

Laatst bijgewerkt: 17 augustus 2026

## 1. Projectoverzicht

**Naam:** Van Kalsbeek Digital — bedrijfswebsite
**Domein:** vankalsbeekdigital.com (+ .nl redirect)
**Doel:** Potentiele klanten informeren over de diensten, vertrouwen opbouwen en contact stimuleren.
**Doelgroep:** Kleine tot middelgrote bedrijven in Limburg die een professionele website of webapplicatie zoeken.

## 2. Kernfunctionaliteit

### 2.1 Homepage (index.html)

De gehele site is een enkele pagina met anker-navigatie naar secties.

| Sectie | Functie |
|---|---|
| **Hero** | Eerste indruk: headline, subtekst, twee CTA-knoppen (contact + portfolio) |
| **Concepten** | Toont drie prijscategorieen voor nieuwe website en redesign, met tabblad-toggle |
| **Werkwijze** | Drie stappen: Bespreken, Bouwen, Live zetten |
| **Waarom bijhouden** | Vier argumenten waarom een up-to-date site belangrijk is |
| **Portfolio** | Eerste projectcase (Arbo Adviesburo Van Kalsbeek) |
| **Testimonial** | Citaat van eerste klant |
| **Over mij** | Profieltekst + foto |
| **FAQ** | Drie veelgestelde vragen |
| **Contact** | Formulier (naam, email, bericht) + contactgegevens (email, telefoon, locatie, socials) |

### 2.2 Navigatie

- Bovenaan vastgeplakt (sticky header) met blurring achtergrond
- Vier links: Concepten, Portfolio, Over mij, Contact (CTA-knop)
- Actieve sectie wordt automatisch gemarkeerd tijdens scrollen
- Op mobiel: hamburger-menu dat open/klemt

### 2.3 Donkere/Lichte modus

- Automatische keuze op basis van systeeminstelling (prefers-color-scheme)
- Handmatig overschrijven via maan-/zonknop in de header
- Keuze wordt onthouden in localStorage (sleutel: `vkd-theme`)
- Thema wordt voor het eerste renderen toegepast (voorkomt lichtflits)

### 2.4 Cookie consent

- Banner onderaan het scherm bij eerste bezoek
- Twee opties: Akkoord (Google Analytics) of Weigeren
- Keuze opslaan in localStorage (sleutel: `vkd-cookie-consent`)
- Na akkoord: Google Analytics script laden
- Cookie-instellingen later aanpasbaar via knop in de footer

### 2.5 Contactformulier

- Velden: Naam (verplicht), E-mail (verplicht), Bericht (verplicht)
- Versturen via Formspree (extern formulier-service)
- Alternatief: directe mailto-link

### 2.6 Privacy & voorwaarden (privacy.html)

- Afzonderlijke pagina met drie secties:
  - Privacybeleid (AVG-conform)
  - Cookiebeleid
  - Algemene voorwaarden
- Header met logo + thema-toggle (geen navigatie)

### 2.7 Scroll-reveal animaties

- Elementen met klasse `.reveal` verschijnen geleidelijk bij het scrollen
- Werkt via IntersectionObserver (fallback: direct tonen zonder JS)
- Respecteert `prefers-reduced-motion`

## 3. Gebruikersstromen

### Nieuwe bezoeker
1. Komt op de homepage
2. Ziet de hero-sectie met headline en CTA's
3. Scrollt door de concepten en prijzen
4. Klikt op "Neem contact op" of vult het formulier in
5. Optioneel: bekijkt portfolio, leest testimonial, stelt een vraag via FAQ

### Terugkerende bezoeker
1. Thema-keuze en cookie-instelling worden hersteld uit localStorage
2. Navigeert direct naar een specifieke sectie via ankerlink

## 4. Non-functiele eisen

| Eisen | Toelichting |
|---|---|
| **Responsief** | Moet werken op mobiel (<=768px), tablet (769-1024px) en desktop (>1024px) |
| **Prestaties** | Zo min mogelijk externe requests; geen frameworks, geen build-stap |
| **Toegankelijkheid** | Skip-link, semantic HTML, ARIA-labels, focus-visible states, 44px touch targets |
| **SEO** | Meta-tags, Open Graph, Twitter Card, semantische HTML, alt-teksten |
| **Privacy** | AVG-conform; geen tracking zonder toestemming |
| **Onderhoud** | dünyanrakkelijk door Jasper zelf aan te passen (HTML/CSS/JS, geen bouwtool nodig) |
| **Browser-support** | Moderne browsers (Chrome, Firefox, Safari, Edge); IE niet ondersteund |

## 5. Inhoudelijke structuur

```
index.html          -- volledige single-page site
privacy.html        -- privacybeleid, cookiebeleid, algemene voorwaarden
style.css           -- alle stijlen (light + dark palet)
script.js           -- cookie consent, analytics, menu, thema, reveals, nav-highlight
favicon.svg         -- site-icoon
assets/
  logo.png          -- logo (navy op transparant)
  logo-dark.png     -- logo (wit op transparant)
  profile.jpg       -- profielfoto
  og-image.png      -- social share afbeelding
CNAME               -- custom domain voor GitHub Pages
```

## 6. Externe diensten

| Dienst | Doel | Wanneer |
|---|---|---|
| **GitHub Pages** | Hosting | Altijd |
| **Google Fonts** | Lettertypen (DM Sans, DM Serif Display) | Altijd |
| **Formspree** | Contactformulier verwerking | Bij versturen formulier |
| **Google Analytics** | Bezoekersstatistieken | Alleen na cookie-toestemming |

## 7. Toekomstige uitbreidingen (nu niet van toepassing)

- CMS voor het zelf beheren van content
- Blog/nieuws-sectie
- Meerdere portfolio-cases
- Meertaligheid (NL/EN)
