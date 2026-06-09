"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { variants } from "@/lib/animations";
import { CarouselCard } from "./carousel-card";

const FILTERS = [
  { key: "all", label: "Todos" },
  { key: "action", label: "Aguardando você" },
  { key: "production", label: "Em produção" },
  { key: "done", label: "Publicados" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

const mockCarousels = [
  {
    id: "1",
    titulo: "5 erros de pronúncia que brasileiros cometem",
    angulo: "Educativo com humor",
    status: "AGUARDANDO_CLIENTE",
    slides: [
      "Slide 1: Capa — 5 erros de pronúncia que todo brasileiro comete",
      "Slide 2: Erro #1 — 'TH' vira 'F' ou 'D'",
      "Slide 3: Erro #2 — Vogais longas vs curtas",
      "Slide 4: Erro #3 — O 'R' americano",
      "Slide 5: Erro #4 — Sílaba tônica errada",
      "Slide 6: Erro #5 — 'ED' no final dos verbos",
      "Slide 7: CTA — Salva pra praticar depois",
    ],
    legenda:
      "Você comete algum desses? Marca alguém que precisa ver isso. Salva pra consultar sempre que precisar.",
    operador: "Ana",
    updatedAt: "Hoje, 09:45",
  },
  {
    id: "2",
    titulo: "Phrasal verbs do dia a dia",
    angulo: "Lista prática",
    status: "AGENDADO",
    slides: [
      "Slide 1: Capa — 7 phrasal verbs que você usa todo dia sem saber",
      "Slide 2: Wake up — Acordar",
      "Slide 3: Pick up — Pegar / Buscar",
      "Slide 4: Find out — Descobrir",
      "Slide 5: Give up — Desistir",
      "Slide 6: Look for — Procurar",
      "Slide 7: CTA — Qual você mais usa? Comenta aqui",
    ],
    legenda:
      "Phrasal verbs parecem difíceis mas fazem parte do inglês do dia a dia. Qual desses você já sabia?",
    operador: "Ana",
    updatedAt: "Hoje, 10:15",
  },
  {
    id: "3",
    titulo: "Sotaque americano vs britânico",
    angulo: "Comparativo",
    status: "APROVADO",
    slides: [
      "Slide 1: Capa — Americano vs Britânico: qual a diferença real?",
      "Slide 2: Pronúncia do R",
      "Slide 3: Vocabulário diferente",
      "Slide 4: Entonação",
      "Slide 5: Gírias de cada lado",
      "Slide 6: Qual escolher?",
      "Slide 7: CTA — Team americano ou britânico?",
    ],
    legenda:
      "Americano ou britânico? A verdade é que os dois funcionam. Mas entender as diferenças muda tudo na hora de ouvir.",
    operador: "Carlos",
    updatedAt: "Ontem, 18:00",
  },
  {
    id: "4",
    titulo: "Present perfect simplificado",
    angulo: "Explicação direta",
    status: "EM_PRODUCAO",
    slides: [
      "Slide 1: Capa — Present perfect sem complicação",
      "Slide 2: Quando usar",
      "Slide 3: Estrutura",
      "Slide 4: Exemplos do dia a dia",
      "Slide 5: Erros comuns",
      "Slide 6: Dica de ouro",
      "Slide 7: CTA — Pratica nos comentários",
    ],
    legenda:
      "Present perfect parece difícil até você entender quando usar. Depois disso, nunca mais erra.",
    operador: "Carlos",
    updatedAt: "05 jun, 16:20",
  },
  {
    id: "5",
    titulo: "Gírias americanas 2026",
    angulo: "Tendência / atualidade",
    status: "PUBLICADO",
    slides: [
      "Slide 1: Capa — Gírias que os americanos estão usando agora",
      "Slide 2: No cap — Sem mentira",
      "Slide 3: Slay — Arrasar",
      "Slide 4: Bet — Combinado / Pode crer",
      "Slide 5: Sus — Suspeito",
      "Slide 6: It's giving — Tá passando a vibe de...",
      "Slide 7: CTA — Qual você já usou?",
    ],
    legenda:
      "Se você quer falar como um nativo de verdade, precisa saber essas. Qual você já conhecia?",
    operador: "Ana",
    updatedAt: "03 jun, 14:30",
  },
];

function filterCarousels(key: FilterKey) {
  if (key === "all") return mockCarousels;
  if (key === "action")
    return mockCarousels.filter(
      (c) => c.status === "AGUARDANDO_CLIENTE" || c.status === "REVISAO_INTERNA"
    );
  if (key === "production")
    return mockCarousels.filter(
      (c) =>
        c.status === "EM_PRODUCAO" ||
        c.status === "APROVADO" ||
        c.status === "AGENDADO"
    );
  return mockCarousels.filter((c) => c.status === "PUBLICADO");
}

export function CarouselList() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const filtered = filterCarousels(filter);

  return (
    <div className="space-y-5">
      <div className="flex gap-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-150 ${
              filter === f.key
                ? "bg-[#18181B] text-[#FAFAFA]"
                : "text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#09090B]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.div
        className="grid grid-cols-2 gap-5"
        variants={variants.staggerContainer}
        initial="hidden"
        animate="visible"
        key={filter}
      >
        {filtered.map((c) => (
          <CarouselCard key={c.id} data={c} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="flex h-40 items-center justify-center rounded-xl border border-[#E4E4E7] bg-white">
          <p className="text-sm text-[#A1A1AA]">Nenhum carrossel nesta categoria</p>
        </div>
      )}
    </div>
  );
}
