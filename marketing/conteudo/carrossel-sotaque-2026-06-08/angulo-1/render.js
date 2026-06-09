const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const HTML_FILE = path.join(__dirname, "carrossel.html");
const OUTPUT_DIR = path.join(__dirname, "instagram");

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1350 });

  const fileUrl = "file:///" + HTML_FILE.replace(/\\/g, "/");
  await page.goto(fileUrl, { waitUntil: "networkidle" });

  await page.waitForTimeout(2000);

  const slides = await page.$$(".slide");
  console.log(`${slides.length} slides encontrados`);

  for (let i = 0; i < slides.length; i++) {
    const num = String(i + 1).padStart(2, "0");
    const outPath = path.join(OUTPUT_DIR, `slide-${num}.png`);

    await slides[i].screenshot({ path: outPath });
    const size = (fs.statSync(outPath).size / 1024).toFixed(0);
    console.log(`slide-${num}.png (${size}KB)`);
  }

  await browser.close();
  console.log(`\nPronto. ${slides.length} slides em ${OUTPUT_DIR}`);
})();
