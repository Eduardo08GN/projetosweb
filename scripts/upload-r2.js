const fs = require("fs");
const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET = process.env.R2_BUCKET_NAME;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const PUBLIC_URL = process.env.R2_PUBLIC_URL;

if (!ACCESS_KEY || !SECRET_KEY || !BUCKET || !ACCOUNT_ID) {
  console.error(
    "Faltando R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME ou CLOUDFLARE_ACCOUNT_ID no .env"
  );
  process.exit(1);
}

const localDir = process.argv[2];
const r2Prefix = process.argv[3];

if (!localDir || !r2Prefix) {
  console.error("Uso: node upload-r2.js <pasta-local> <prefixo-r2>");
  console.error(
    'Ex: node upload-r2.js angulo-1/instagram/ carrosseis/rodger/2026-06-08-angulo-1/'
  );
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

async function uploadDir(localDir, r2Prefix) {
  const absDir = path.resolve(localDir);

  if (!fs.existsSync(absDir)) {
    throw new Error(`Diretorio nao encontrado: ${absDir}`);
  }

  const files = fs.readdirSync(absDir).filter((f) => f.endsWith(".png"));

  if (files.length === 0) {
    throw new Error(`Nenhum PNG encontrado em ${absDir}`);
  }

  const urls = {};

  for (const file of files) {
    const filePath = path.join(absDir, file);
    const key = `${r2Prefix}${file}`;
    const body = fs.readFileSync(filePath);

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: "image/png",
      })
    );

    const publicUrl = PUBLIC_URL
      ? `${PUBLIC_URL.replace(/\/$/, "")}/${key}`
      : `https://${BUCKET}.${ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;

    urls[file] = publicUrl;
    console.log(`Uploaded: ${file} → ${publicUrl}`);
  }

  const urlsPath = path.join(absDir, "urls.json");
  fs.writeFileSync(urlsPath, JSON.stringify(urls, null, 2));
  console.log(`\nURLs salvas em: ${urlsPath}`);
  console.log(`Total: ${files.length} arquivos`);

  return urls;
}

uploadDir(localDir, r2Prefix).catch((err) => {
  console.error("Erro:", err.message);
  process.exit(1);
});
