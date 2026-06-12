"use client";

import Image from "next/image";

/* ── Imagem de slide ──
   Os slides moram no R2 como PNG de 1080px sem cache nenhum (~600 KB
   cada). O next/image reduz pro tamanho exibido, converte pra WebP e
   cacheia no proprio servidor — o painel baixa ~30 KB por slide e as
   visitas seguintes nem voltam no R2. URLs fora do R2 caem no <img>
   comum, porque o otimizador so aceita os hosts liberados no config. */

function isR2(src: string) {
  try {
    return new URL(src).hostname.endsWith(".r2.dev");
  } catch {
    return false;
  }
}

/** Acrescenta a versao na URL: a fabrica re-renderiza slides editados
 *  no mesmo endereco do R2, e sem isso o cache mostraria o preview velho. */
export function slideSrc(url: string, versao?: number) {
  if (!versao) return url;
  return `${url}${url.includes("?") ? "&" : "?"}v=${versao}`;
}

export function SlideImage({
  src,
  alt,
  sizes,
  className,
  versao,
  onLoad,
}: {
  src: string;
  alt: string;
  /** Largura renderizada (atributo sizes do srcset), ex: "208px". */
  sizes: string;
  /** Classe de object-fit (object-contain / object-cover). */
  className?: string;
  versao?: number;
  onLoad?: () => void;
}) {
  if (!isR2(src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        onLoad={onLoad}
        className={`h-full w-full ${className ?? ""}`}
      />
    );
  }
  return (
    <Image
      src={slideSrc(src, versao)}
      alt={alt}
      fill
      sizes={sizes}
      onLoad={onLoad}
      className={className}
    />
  );
}
