import crypto from "crypto";

// Cliente minimo do R2 (S3 SigV4): so PUT e DELETE, que e tudo que a
// plataforma precisa. Upload de fundo enviado pelo cliente e limpeza
// dos slides depois da publicacao.

const REGION = "auto";
const SERVICE = "s3";

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Variavel ${name} nao configurada`);
  return value;
}

function hmac(key: crypto.BinaryLike, data: string) {
  return crypto.createHmac("sha256", key).update(data).digest();
}

function sha256(data: crypto.BinaryLike) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function sigV4(method: "PUT" | "DELETE", key: string, body: Buffer, contentType: string) {
  const accountId = env("CLOUDFLARE_ACCOUNT_ID");
  const accessKey = env("R2_ACCESS_KEY_ID");
  const secretKey = env("R2_SECRET_ACCESS_KEY");
  const bucket = env("R2_BUCKET_NAME");

  const now = new Date();
  const dateStamp = now.toISOString().replace(/[-:]/g, "").slice(0, 8);
  const amzDate =
    dateStamp + "T" + now.toISOString().replace(/[-:]/g, "").slice(9, 15) + "Z";
  const scope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;

  const host = `${accountId}.r2.cloudflarestorage.com`;
  const payloadHash = sha256(body);

  const headers: Record<string, string> = {
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
    `/${bucket}${encodedKey}`,
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

  const kDate = hmac(`AWS4${secretKey}`, dateStamp);
  const kRegion = hmac(kDate, REGION);
  const kService = hmac(kRegion, SERVICE);
  const kSigning = hmac(kService, "aws4_request");
  const signature = hmac(kSigning, stringToSign).toString("hex");

  return {
    url: `https://${host}/${bucket}${encodedKey}`,
    headers: {
      Authorization: `AWS4-HMAC-SHA256 Credential=${accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      "Content-Type": contentType,
    },
  };
}

export async function r2Put(key: string, body: Buffer, contentType: string) {
  const { url, headers } = sigV4("PUT", key, body, contentType);
  const res = await fetch(url, { method: "PUT", headers, body: new Uint8Array(body) });
  if (!res.ok) {
    throw new Error(`Upload pro R2 falhou (${res.status}): ${await res.text()}`);
  }
  const publicBase = env("R2_PUBLIC_URL").replace(/\/$/, "");
  return `${publicBase}/${key}`;
}

export async function r2Delete(key: string) {
  const { url, headers } = sigV4("DELETE", key, Buffer.alloc(0), "application/octet-stream");
  const res = await fetch(url, { method: "DELETE", headers });
  // 204 = apagou, 404 = ja nao existia; os dois servem
  if (!res.ok && res.status !== 404) {
    throw new Error(`Delete no R2 falhou (${res.status}): ${await res.text()}`);
  }
}

/** Converte URL publica de volta pra chave do bucket. Null se nao for nossa. */
export function r2KeyFromUrl(url: string) {
  const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  if (!publicBase || !url.startsWith(publicBase + "/")) return null;
  return url.slice(publicBase.length + 1);
}
