const puppeteer = require('puppeteer');
const path = require('path');

const file = process.argv[2] || 'example-essential.html';
const url = 'file:///' + path.join(process.cwd(), file).replace(/\\/g, '/');
const widths = [{w:1280,n:'desktop'},{w:768,n:'tablet'},{w:375,n:'mobile'}];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  for (const {w, n} of widths) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));
    const fonts = await page.evaluate(() => {
      const bad = [];
      document.querySelectorAll('body,p,a,span,div,li,td,th,label,h1,h2,h3').forEach(el => {
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs > 0 && fs < 12 && el.textContent.trim()) bad.push({tag:el.tagName,cls:(el.className||'').toString().split(' ').slice(0,2).join('.'),fs:Math.round(fs*10)/10,text:el.textContent.trim().slice(0,30)});
      });
      return bad;
    });
    const touches = await page.evaluate(() => {
      const bad = [];
      document.querySelectorAll('a,button,input,textarea,label,[role="button"]').forEach(el => {
        const r = el.getBoundingClientRect();
        if ((r.height < 44 || r.width < 44) && r.height > 0 && r.width > 0) bad.push({tag:el.tagName,cls:(el.className||'').toString().split(' ').slice(0,2).join('.'),w:Math.round(r.width),h:Math.round(r.height),text:(el.textContent||'').trim().slice(0,25)});
      });
      return bad;
    });
    const ov = await page.evaluate(vp => document.documentElement.scrollWidth > vp + 5, w);
    console.log(`${n} (${w}px): fonts<12: ${fonts.length}, touch<44: ${touches.length}, overflow: ${ov}`);
    if (fonts.length) console.log('  fonts:', JSON.stringify(fonts));
    if (touches.length) console.log('  touches:', JSON.stringify(touches));
  }
  await browser.close();
})();
