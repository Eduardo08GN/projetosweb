#!/usr/bin/env node
/**
 * coolify.js -- CLI de operacao do deploy da AutomaWeb no Coolify.
 *
 * Saida curta de proposito: o agente le um resumo, nao o JSON inteiro.
 *
 * Comandos:
 *   node scripts/coolify.js status
 *     Situacao do app, ultimo deployment e resposta do site.
 *
 *   node scripts/coolify.js deploy
 *     Dispara deploy do ultimo commit e acompanha ate terminar.
 *
 *   node scripts/coolify.js restart
 *     Reinicia o app (sem rebuild) e acompanha ate terminar.
 *
 *   node scripts/coolify.js env list
 *     Lista as CHAVES das variaveis (valores nunca aparecem).
 *
 *   node scripts/coolify.js env set CHAVE valor
 *     Cria ou atualiza a variavel. Valor com "$" vira is_literal
 *     automaticamente (sem isso o Docker interpola e entrega vazio).
 *     Lembrete: env nova so vale depois de um restart/deploy.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
for (const file of [path.join(ROOT, ".env"), path.join(ROOT, "automaweb", ".env")]) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const URL_BASE = process.env.COOLIFY_API_URL;
const TOKEN = process.env.COOLIFY_API_TOKEN;
const APP = process.env.COOLIFY_APP_UUID;
const SITE = process.env.NEXT_PUBLIC_URL ?? "https://automaweb.pro";

if (!URL_BASE || !TOKEN || !APP) {
  console.error("Faltam COOLIFY_API_URL / COOLIFY_API_TOKEN / COOLIFY_APP_UUID no .env");
  process.exit(1);
}

async function api(rota, opts = {}) {
  const res = await fetch(`${URL_BASE}/api/v1${rota}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...opts.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const motivo = data.message ?? JSON.stringify(data.errors ?? data) ?? res.status;
    throw new Error(`Coolify respondeu ${res.status}: ${motivo}`);
  }
  return data;
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Acompanha um deployment ate status terminal. Sai 1 se falhar. */
async function acompanhar(deploymentUuid) {
  const inicio = Date.now();
  let ultimo = "";
  while (Date.now() - inicio < 12 * 60 * 1000) {
    const d = await api(`/deployments/${deploymentUuid}`).catch(() => null);
    const status = d?.status ?? "desconhecido";
    if (status !== ultimo) {
      console.log(`deployment: ${status}`);
      ultimo = status;
    }
    if (["finished", "failed", "cancelled-by-user"].includes(status)) {
      return status === "finished";
    }
    await espera(10_000);
  }
  console.error("deployment: timeout de 12 min sem status terminal");
  return false;
}

async function checarSite() {
  try {
    const res = await fetch(`${SITE}/login`, { redirect: "manual" });
    return `site: HTTP ${res.status}`;
  } catch (err) {
    return `site: fora do ar (${err.message})`;
  }
}

async function main() {
  const [cmd, sub, ...resto] = process.argv.slice(2);

  if (cmd === "status") {
    const app = await api(`/applications/${APP}`);
    console.log(`app: ${app.status ?? "desconhecido"}`);
    console.log(await checarSite());
    return;
  }

  if (cmd === "deploy") {
    const r = await api(`/deploy?uuid=${APP}`);
    const uuid = r.deployments?.[0]?.deployment_uuid;
    if (!uuid) throw new Error(`Deploy nao enfileirou: ${JSON.stringify(r)}`);
    console.log(`deploy enfileirado (${uuid})`);
    const ok = await acompanhar(uuid);
    console.log(await checarSite());
    process.exit(ok ? 0 : 1);
  }

  if (cmd === "restart") {
    const r = await api(`/applications/${APP}/restart`);
    const uuid = r.deployment_uuid;
    if (!uuid) throw new Error(`Restart nao enfileirou: ${JSON.stringify(r)}`);
    console.log(`restart enfileirado (${uuid})`);
    const ok = await acompanhar(uuid);
    console.log(await checarSite());
    process.exit(ok ? 0 : 1);
  }

  if (cmd === "env" && sub === "list") {
    // a API devolve tambem a variante de preview de cada variavel; so a real importa
    const envs = (await api(`/applications/${APP}/envs`)).filter((e) => !e.is_preview);
    for (const e of envs) {
      const flags = [e.is_literal && "literal", e.is_buildtime && "buildtime"]
        .filter(Boolean)
        .join(", ");
      console.log(`${e.key}${flags ? `  (${flags})` : ""}`);
    }
    console.log(`${envs.length} variaveis (valores nao sao exibidos)`);
    return;
  }

  if (cmd === "env" && sub === "set") {
    const [chave, ...valorParts] = resto;
    const valor = valorParts.join(" ");
    if (!chave || !valor) {
      console.error("Uso: node scripts/coolify.js env set CHAVE valor");
      process.exit(1);
    }
    const body = JSON.stringify({
      key: chave,
      value: valor,
      is_preview: false,
      // valor com $ precisa ser literal, senao o Docker interpola e entrega vazio
      is_literal: valor.includes("$"),
    });
    try {
      await api(`/applications/${APP}/envs`, { method: "POST", body });
      console.log(`${chave}: criada${valor.includes("$") ? " (literal)" : ""}`);
    } catch (err) {
      if (!String(err.message).includes("already exists")) throw err;
      await api(`/applications/${APP}/envs`, { method: "PATCH", body });
      console.log(`${chave}: atualizada${valor.includes("$") ? " (literal)" : ""}`);
    }
    console.log("Lembrete: rode restart ou deploy pra valer no container");
    return;
  }

  console.error(
    "Comandos: status | deploy | restart | env list | env set CHAVE valor"
  );
  process.exit(1);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
