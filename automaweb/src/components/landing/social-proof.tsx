"use client";

import {
  siCloudflare,
  siCoolify,
  siInstagram,
  siMeta,
  siNextdotjs,
  siPrisma,
  siTailwindcss,
  siYoutube,
} from "simple-icons";

type Brand = { title: string; path: string };

const ROW_A: Brand[] = [
  { title: "Cloudflare", path: siCloudflare.path },
  { title: "Instagram", path: siInstagram.path },
  { title: "YouTube", path: siYoutube.path },
  { title: "Meta", path: siMeta.path },
];

const ROW_B: Brand[] = [
  { title: "Next.js", path: siNextdotjs.path },
  { title: "Prisma", path: siPrisma.path },
  { title: "Tailwind CSS", path: siTailwindcss.path },
  { title: "Coolify", path: siCoolify.path },
];

function BrandMark({ brand }: { brand: Brand }) {
  return (
    <span className="flex shrink-0 items-center gap-3 text-[#A1A1AA] opacity-60 transition-all duration-200 hover:text-[#09090B] hover:opacity-100">
      <svg
        viewBox="0 0 24 24"
        className="h-[22px] w-[22px] fill-current"
        role="img"
        aria-label={brand.title}
      >
        <path d={brand.path} />
      </svg>
      <span className="text-sm font-semibold">{brand.title}</span>
    </span>
  );
}

function MarqueeRow({
  brands,
  direction,
}: {
  brands: Brand[];
  direction: "left" | "right";
}) {
  // Lista duplicada: metade visível, metade de reserva pro loop contínuo
  const doubled = [...brands, ...brands, ...brands, ...brands];
  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div
        className={`flex w-max items-center gap-12 py-3 ${
          direction === "left" ? "landing-marquee-left" : "landing-marquee-right"
        }`}
      >
        {doubled.map((brand, i) => (
          <BrandMark key={`${brand.title}-${i}`} brand={brand} />
        ))}
      </div>
    </div>
  );
}

export function SocialProof() {
  return (
    <section className="relative bg-[#F4F4F5] pb-20 md:pb-28" aria-label="Ferramentas integradas">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-sm text-[#71717A]">
          Construído sobre as ferramentas que o mercado já confia
        </p>
        <div className="mt-8">
          <MarqueeRow brands={ROW_A} direction="left" />
          <MarqueeRow brands={ROW_B} direction="right" />
        </div>
      </div>
      {/* Bleed de saída: F4F4F5 sangra pro FAFAFA da próxima seção */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 translate-y-full bg-gradient-to-b from-[#F4F4F5] to-transparent"
      />
    </section>
  );
}
