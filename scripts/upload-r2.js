const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

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

const ENDPOINT = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`;
const REGION = "auto";
const SERVICE = "s3";

function hmac(key, data) {
  return crypto.createHmac("sha256", key).update(data).digest();
}

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function sigV4(method, key, body, contentType) {
  const now = new Date();
  const dateStamp = now.toISOString().replace(/[-:]/g, "").slice(0, 8);
  const amzDate = dateStamp + "T" + now.toISOString().replace(/[-:]/g, "").slice(9, 15) + "Z";
  const scope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;

  const host = `${ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const payloadHash = sha256(body);

  const headers = {
    host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
    "content-type": contentType,
  };

  const signedHeaderKeys = Object.keys(headers).sort();
  const signedHeaders = signedHeaderKeys.join(";");
  const canonicalHeaders = signedHeaderKeys
    .map((k) => `${k}:${headers[k]}\n`)
    .join("");

  const encodedKey = "/" + key.split("/").map(encodeURIComponent).join("/");

  const canonicalRequest = [
    method,
    `/${BUCKET}${encodedKey}`,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    sha256(canonicalRequest),
  ].join("\n");

  const kDate = hmac(`AWS4${SECRET_KEY}`, dateStamp);
  const kRegion = hmac(kDate, REGION);
  const kService = hmac(kRegion, SERVICE);
  const kSigning = hmac(kService, "aws4_request");
  const signature = hmac(kSigning, stringToSign).toString("hex");

  const authorization = `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return {
    url: `${ENDPOINT}/${BUCKET}${encodedKey}`,
    headers: {
      Authorization: authorization,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      "Content-Type": contentType,
    },
  };
}

async function uploadFile(filePath, key) {
  const body = fs.readFileSync(filePath);
  const { url, headers } = sigV4("PUT", key, body, "image/png");

  const res = await fetch(url, { method: "PUT", headers, body });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload falhou (${res.status}): ${text}`);
  }

  const publicUrl = PUBLIC_URL
    ? `${PUBLIC_URL.replace(/\/$/, "")}/${key}`
    : key;

  return publicUrl;
}

async function uploadDir(localDir, r2Prefix) {
  const absDir = path.resolve(localDir);

  if (!fs.existsSync(absDir)) {
    throw new Error(`Diretorio nao encontrado: ${absDir}`);
  }

  const prefix = r2Prefix.endsWith("/") ? r2Prefix : r2Prefix + "/";
  const files = fs.readdirSync(absDir).filter((f) => f.endsWith(".png"));

  if (files.length === 0) {
    throw new Error(`Nenhum PNG encontrado em ${absDir}`);
  }

  const urls = {};

  for (const file of files) {
    const filePath = path.join(absDir, file);
    const key = `${prefix}${file}`;
    const url = await uploadFile(filePath, key);
    urls[file] = url;
    console.log(`${file} → ${url}`);
  }

  const urlsPath = path.join(absDir, "urls.json");
  fs.writeFileSync(urlsPath, JSON.stringify(urls, null, 2));
  console.log(`\nURLs salvas em: ${urlsPath}`);
  console.log(`Total: ${files.length} arquivos`);

  return urls;
}

const inputDir = process.argv[2];
const inputPrefix = process.argv[3];

if (!inputDir || !inputPrefix) {
  console.error("Uso: node upload-r2.js <pasta-local> <prefixo-r2>");
  console.error(
    'Ex: node upload-r2.js angulo-1/instagram/ carrosseis/rodger/2026-06-08-angulo-1/'
  );
  process.exit(1);
}

uploadDir(inputDir, inputPrefix).catch((err) => {
  console.error("Erro:", err.message);
  process.exit(1);
});
