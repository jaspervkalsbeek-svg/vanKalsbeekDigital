const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const pageDir = path.join(__dirname, 'audits');
fs.mkdirSync(pageDir, { recursive: true });

const file = path.join(__dirname, '..', 'example-ultimate-v2.html').replace(/\\/g, '/');
const url = 'file:///' + file;
const widths = [{w:1280,n:'desktop'},{w:768,n:'tablet'},{w:375,n:'mobile'}];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const results = [];

  for (const {w, n} of widths) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 800, deviceScaleFactor: 2 });
    await page.goto(url, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    const shot = path.join(pageDir, `v2-${n}.png`);
    await page.screenshot({ path: shot, fullPage: true });

    const fontSizes = await page.evaluate(() => {
      const bad = [];
      document.querySelectorAll('body, p, a, span, div, li, td, th, label, h1, h2, h3').forEach(el => {
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs > 0 && fs < 12 && el.textContent.trim()) {
          bad.push({ tag: el.tagName, cls: el.className.split(' ').slice(0,2).join('.'), fs: Math.round(fs*10)/10, text: el.textContent.trim().slice(0,30) });
        }
      });
      return bad;
    });

    const touches = await page.evaluate(() => {
      const bad = [];
      document.querySelectorAll('a, button, input, textarea, select, label, [role="button"], [role="tab"]').forEach(el => {
        const r = el.getBoundingClientRect();
        const h = r.height, w = r.width;
        if ((h < 44 || w < 44) && h > 0 && w > 0) {
          bad.push({ tag: el.tagName, cls: (el.className||'').toString().split(' ').slice(0,2).join('.'), w: Math.round(w), h: Math.round(h), text: (el.textContent||'').trim().slice(0,25) });
        }
      });
      return bad;
    });

    const overflows = await page.evaluate((vp) => {
      const doc = document.documentElement;
      return { scroll: doc.scrollWidth, client: doc.clientWidth, overflows: doc.scrollWidth > vp + 5 };
    }, w);

    const headingOrder = await page.evaluate(() => {
      const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
      return heads.map(h => ({ tag: h.tagName, text: h.textContent.trim().slice(0,40) }));
    });

    const results_obj = { width: w, name: n, screenshot: shot, fontSizes, touches, overflows, headingOrder };
    results.push(results_obj);
    console.log(`${n} (${w}px): fonts<12px: ${fontSizes.length}, touch<44px: ${touches.length}, overflow: ${overflows.overflows}, screenshot: ${shot}`);
  }

  fs.writeFileSync(path.join(pageDir, 'v2-audit.json'), JSON.stringify(results, null, 2));
  await browser.close();
})();
