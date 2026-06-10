"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { landingViewport } from "@/lib/animations";

const QUESTIONS = [
  {
    q: "Preciso entender de tecnologia?",
    a: "Não. Nós cuidamos de toda a parte técnica. Você só precisa nos contar sobre o seu negócio e aprovar o que construímos.",
  },
  {
    q: "Meu negócio não aparece no Google. Vocês resolvem?",
    a: "Sim. Arrumamos seu perfil do Google (fotos, horários, avaliações respondidas), colocamos seu site no ar e deixamos seu negócio visível pra quem procura na sua região. Quem não aparece, não é escolhido.",
  },
  {
    q: "Quanto tempo leva para ter tudo funcionando?",
    a: "O site fica pronto em 5 a 10 dias. O conteúdo começa a sair em 2 semanas. O painel sob medida leva de 3 a 4 semanas, dependendo do que seu negócio precisar.",
  },
  {
    q: "Como funciona o conteúdo toda semana?",
    a: "A gente parte do que você já tem: uma gravação, um áudio, os temas que seus clientes mais perguntam. Nossa operação produz os posts com a sua identidade, você aprova e a publicação sai agendada.",
  },
  {
    q: "É tudo feito por IA?",
    a: "Não. A IA é ferramenta da nossa produção, como a câmera é ferramenta do fotógrafo. Direção, curadoria e estratégia são nossas, e a aprovação final é sempre sua. Nada vai pro ar sem o seu ok.",
  },
  {
    q: "E se eu quiser cancelar?",
    a: "Sem contrato anual. Cancele quando quiser. O site e os sistemas que construímos continuam no ar enquanto durar a assinatura.",
  },
  {
    q: "Vocês atendem qualquer tipo de negócio?",
    a: "Focamos em negócios locais e criadores de conteúdo. Dentistas, barbearias, personal trainers, academias, boutiques, professores e infoprodutores. Se você tem clientes recorrentes, somos pra você.",
  },
  {
    q: "O que diferencia vocês de uma agência comum?",
    a: "Agências vendem sites bonitos. Nós construímos sistemas que geram resultado: mais clientes, mais retenção, menos trabalho manual. O sistema trabalha por você o dia inteiro, em vez de entregar um arquivo e sumir.",
  },
];

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  return (
    <div className="border-b border-[#E4E4E7]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex min-h-[44px] w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18181B]"
      >
        <span className="text-base font-medium text-[#09090B]">{question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="shrink-0"
        >
          <ChevronDown className="h-4 w-4 text-[#71717A]" strokeWidth={1.5} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="max-w-[640px] pb-5 text-[15px] leading-relaxed text-[#71717A]">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#FAFAFA] py-20 md:py-28">
      <div className="mx-auto max-w-[680px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={landingViewport}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <h2
            className="font-bold text-[#09090B]"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Perguntas frequentes
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#71717A]">
            O que todo dono de negócio pergunta antes de assinar.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={landingViewport}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.1,
          }}
          className="mt-10 border-t border-[#E4E4E7]"
        >
          {QUESTIONS.map((item, i) => (
            <FaqItem
              key={item.q}
              question={item.q}
              answer={item.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
