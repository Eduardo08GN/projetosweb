// Chamadas de teste da Meta — destrava o botao "Request Advanced Access"
// no App Review. Le a MetaConnection do banco (DATABASE_URL do .env do
// automaweb) e exercita as 4 permissoes da fase 1 com o token salvo.
//
// Uso:
//   node scripts/meta-test-calls.js           -> so as 3 chamadas de leitura
//   node scripts/meta-test-calls.js --publish -> inclui o post de teste real
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const GRAPH = "https://graph.facebook.com/v21.0";

function databaseUrl() {
  const env = fs.readFileSync(
    path.join(__dirname, "..", "automaweb", ".env"),
    "utf8"
  );
  const m = env.match(/^DATABASE_URL="?([^"\r\n]+)"?/m);
  if (!m) throw new Error("DATABASE_URL nao encontrada no automaweb/.env");
  return m[1];
}

async function graphGet(label, url) {
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) {
    console.log(`[FALHOU] ${label}: ${data.error.message} (code ${data.error.code})`);
    return null;
  }
  console.log(`[OK] ${label}`);
  return data;
}

// mesmo padrao do src/lib/instagram.ts (form-encoded)
async function graphPost(label, pathPart, params) {
  const res = await fetch(`${GRAPH}/${pathPart}`, {
    method: "POST",
    body: new URLSearchParams(params),
  });
  const data = await res.json();
  if (data.error || !data.id) {
    console.log(`[FALHOU] ${label}: ${data.error?.message ?? "sem id"} (code ${data.error?.code ?? "?"})`);
    return null;
  }
  console.log(`[OK] ${label}`);
  return data;
}

async function waitContainerReady(containerId, accessToken) {
  for (let i = 0; i < 10; i++) {
    const res = await fetch(
      `${GRAPH}/${containerId}?fields=status_code&access_token=${accessToken}`
    );
    const data = await res.json();
    if (data.status_code === "FINISHED") return true;
    if (data.status_code === "ERROR") return false;
    await new Promise((r) => setTimeout(r, 3000));
  }
  return false;
}

// fallback: um slide PNG ja hospedado no R2 (mesmo formato que a
// publicacao agendada de producao usa)
async function slideUrlFromDb(db) {
  const { rows } = await db.query(
    `select slides from "Carrossel" where slides is not null limit 5`
  );
  for (const r of rows) {
    const slides = Array.isArray(r.slides) ? r.slides : [];
    const url = slides
      .map((s) => (typeof s === "string" ? s : s?.url ?? s?.png ?? null))
      .find((u) => typeof u === "string" && u.startsWith("http"));
    if (url) return url;
  }
  return null;
}

async function publishTest(c, imageUrl) {
  const caption =
    "Post de teste da integracao AutomaWeb x Instagram. Pode arquivar.";
  const container = await graphPost(
    `instagram_content_publish  POST /media (container) [${imageUrl}]`,
    `${c.igUserId}/media`,
    { image_url: imageUrl, caption, access_token: c.accessToken }
  );
  if (!container) return null;

  const ready = await waitContainerReady(container.id, c.accessToken);
  if (!ready) {
    console.log("[FALHOU] container nao ficou FINISHED");
    return null;
  }

  const published = await graphPost(
    "instagram_content_publish  POST /media_publish",
    `${c.igUserId}/media_publish`,
    { creation_id: container.id, access_token: c.accessToken }
  );
  if (!published) return null;

  const link = await graphGet(
    "permalink  GET /{media-id}",
    `${GRAPH}/${published.id}?fields=permalink&access_token=${c.accessToken}`
  );
  if (link?.permalink) console.log(`     post publicado: ${link.permalink}`);
  return published.id;
}

async function main() {
  const publish = process.argv.includes("--publish");
  const db = new Client({ connectionString: databaseUrl() });
  await db.connect();
  const { rows } = await db.query(
    `select "tenantId", "igUserId", "igUsername", "pageId", "pageName",
            "accessToken", "tokenExpiresAt", status
       from "MetaConnection" where status = 'CONECTADO'`
  );

  if (rows.length === 0) {
    console.log("Nenhuma MetaConnection com status CONECTADO no banco.");
    console.log("Conecte uma conta em /tenant/integracoes antes de rodar.");
    await db.end();
    process.exit(1);
  }

  for (const c of rows) {
    console.log(
      `\nConta: @${c.igUsername} (pagina "${c.pageName}", tenant ${c.tenantId})`
    );
    console.log(`Token expira em: ${c.tokenExpiresAt?.toISOString?.() ?? c.tokenExpiresAt}`);
    const t = c.accessToken;

    // pages_show_list — listar paginas do usuario
    const pages = await graphGet(
      "pages_show_list  GET /me/accounts",
      `${GRAPH}/me/accounts?fields=id,name,instagram_business_account&access_token=${t}`
    );
    if (pages?.data) console.log(`     paginas retornadas: ${pages.data.length}`);

    // instagram_basic — perfil do Instagram Business
    const profile = await graphGet(
      "instagram_basic  GET /{ig-user-id}",
      `${GRAPH}/${c.igUserId}?fields=username,name,profile_picture_url,followers_count,media_count&access_token=${t}`
    );
    if (profile) {
      console.log(
        `     @${profile.username} — ${profile.followers_count} seguidores, ${profile.media_count} posts`
      );
    }

    // pages_read_engagement — posts e engajamento da pagina
    const feed = await graphGet(
      "pages_read_engagement  GET /{page-id}/posts",
      `${GRAPH}/${c.pageId}/posts?fields=id,message,comments.summary(true),reactions.summary(true)&limit=5&access_token=${t}`
    );
    if (feed?.data) console.log(`     posts da pagina lidos: ${feed.data.length}`);

    if (!publish) {
      console.log("[PULADO] instagram_content_publish (rode com --publish)");
      continue;
    }

    // instagram_content_publish — post REAL no feed
    let ok = await publishTest(c, "https://automaweb.pro/icon-512.png");
    if (!ok) {
      const fallback = await slideUrlFromDb(db);
      if (fallback) {
        console.log("tentando de novo com slide do R2...");
        await publishTest(c, fallback);
      } else {
        console.log("nenhum slide no banco pra usar de fallback");
      }
    }
  }
  await db.end();
}

main().catch((e) => {
  console.error("erro:", e.message);
  process.exit(1);
});
