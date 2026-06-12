// Gera os icones do aplicativo (tela de inicio) a partir da marca:
// quadrado #18181B com o simbolo "A" centralizado na zona segura de
// icones mascaraveis. Rodar de dentro de automaweb/:
//   node ../scripts/gerar-icones-pwa.js
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const FAVICON = path.resolve(__dirname, "../automaweb/public/AutomaWeb_favicon.png");
const FAVICON_B64 = `data:image/png;base64,${fs.readFileSync(FAVICON).toString("base64")}`;
const OUT = path.resolve(__dirname, "../automaweb/public");

const SIZES = [
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
  { file: "apple-touch-icon.png", size: 180 },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const { file, size } of SIZES) {
    await page.setViewportSize({ width: size, height: size });
    // marca em ~56% da largura: dentro da zona segura do maskable (80%)
    await page.setContent(`<!DOCTYPE html>
      <html><body style="margin:0;width:${size}px;height:${size}px;
        background:#18181B;display:flex;align-items:center;justify-content:center;">
        <img src="${FAVICON_B64}" style="width:${Math.round(size * 0.56)}px;" />
      </body></html>`);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, file), type: "png" });
    console.log(`OK ${file} (${size}x${size})`);
  }

  await browser.close();
})();
