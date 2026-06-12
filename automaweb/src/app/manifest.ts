import type { MetadataRoute } from "next";

/* Manifesto do aplicativo (tela de inicio do celular).
   start_url /tenant cobre todos os casos: sem sessao cai no login,
   cliente logado cai no painel, master e redirecionado pro /master
   pelo proxy. Sem service worker de proposito: o valor aqui e o
   atalho com icone, nao modo offline. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AutomaWeb",
    short_name: "AutomaWeb",
    description: "Seu conteudo no ar, no automatico",
    start_url: "/tenant",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FAFAFA",
    theme_color: "#FFFFFF",
    lang: "pt-BR",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
