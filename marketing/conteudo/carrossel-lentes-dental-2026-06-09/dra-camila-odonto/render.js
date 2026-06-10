const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const htmlPath = path.join(__dirname, "carrossel.html");
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });

  await page.waitForTimeout(2000);

  const slides = await page.$$(".slide");
  const outDir = path.join(__dirname, "instagram");
  const fs = require("fs");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < slides.length; i++) {
    const num = String(i + 1).padStart(2, "0");
    await slides[i].screenshot({
      path: path.join(outDir, `slide-${num}.png`),
      type: "png",
    });
    console.log(`slide-${num}.png OK`);
  }

  await browser.close();
  console.log(`\nDone — ${slides.length} slides rendered to ${outDir}`);
})();
