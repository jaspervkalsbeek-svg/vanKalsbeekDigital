# Van Kalsbeek Digital — vankalsbeekdigital.com / .nl

Statische bedrijfswebsite + portfolio. Pure HTML, CSS en JavaScript, geen build-stap — draait op GitHub Pages.

## Lokaal bekijken

Open `index.html` in de browser, of serveer het met een simpele server:

```powershell
python -m http.server 8080
```

## Deploy naar GitHub Pages

1. Maak een nieuwe GitHub-repo aan, bijv. `vankalsbeekdigital`, en push deze map erin.
2. In de repo: **Settings → Pages → Branch**: `main`, root (`/`). Sla op.
3. Bij **Custom domain**: vul `vankalsbeekdigital.com` in (dit schrijft hetzelfde als het `CNAME`-bestand).
4. Wacht tot het certificaat is aangemaakt (kan enkele minuten duren).

## DNS

GitHub Pages ondersteunt maar één custom domein per site. Daarom:

- **vankalsbeekdigital.com** → GitHub Pages:
  - A-record (apex): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - (subdomein `www`: CNAME naar `jaspervkalsbeek-svg.github.io`)
- **vankalsbeekdigital.nl** → 301-redirect naar `.com`, ingesteld bij de domeinprovider (web-forwarding). Zo werken beide domeinen, zonder dat GitHub Pages ze beiden hoeft te hosten.

## Inhoud aanpassen

- Diensten, portfolio en contact staan in `index.html`; kleuren en lettertypen in `style.css` (bovenaan het bestand, `:root`).
- Logo's: `assets/logo.png` (navy op transparant, lichte modus) en `assets/logo-dark.png` (wit op transparant, donkere modus). Vervang beide als het logo verandert.

## Light / dark mode

De site kiest bij het eerste bezoek automatisch licht of donker op basis van de systeeminstelling (`prefers-color-scheme`). Via de maan-/zonknop in de header schakel je handmatig; die keuze wordt onthouden in `localStorage` (key `vkd-theme`) en heeft voorrang bij het volgende bezoek.

- Thema wordt vóór de eerste weergave gezet door een klein script in de `<head>` van `index.html` (voorkomt lichtflits).
- Kleuren: beide paletten staan in `style.css` bovenaan (`:root` voor licht, `:root[data-theme="dark"]` voor donker).
- `logo-dark.png` is gegenereerd uit `logo.png` (inkt opnieuw gekleurd naar wit, transparantie behouden). Opnieuw genereren kan via `C:\Users\jaspe\AppData\Local\Temp\opencode\make-logo-dark.ps1`.

- E-mail- en telefoongegevens: controleer die bij **Contact** en in de hero-CTA in `index.html`.
