"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import { Smartphone, Share, SquarePlus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/* Card de instalacao do aplicativo na tela de inicio.
   Android/Chrome: o navegador entrega o prompt nativo (um toque).
   iPhone/iPad: Safari nao tem prompt, entao mostramos os 2 passos.
   Ja instalado (aberto pelo icone): vira confirmacao. */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallAppCard() {
  const [instalado, setInstalado] = useState(false);
  const [ios, setIos] = useState(false);
  const [promptNativo, setPromptNativo] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setInstalado(window.matchMedia("(display-mode: standalone)").matches);
    setIos(/iPhone|iPad|iPod/.test(navigator.userAgent));

    function captura(e: Event) {
      e.preventDefault();
      setPromptNativo(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", captura);
    return () => window.removeEventListener("beforeinstallprompt", captura);
  }, []);

  async function instalar() {
    if (!promptNativo) return;
    await promptNativo.prompt();
    const escolha = await promptNativo.userChoice;
    if (escolha.outcome === "accepted") setInstalado(true);
    setPromptNativo(null);
  }

  return (
    <motion.div
      className="rounded-xl border border-[#E4E4E7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      variants={variants.fadeUpSmall}
      initial="hidden"
      animate="visible"
      transition={transitions.smooth}
    >
      <div className="flex items-center gap-3 border-b border-[#E4E4E7] px-6 py-4">
        <Smartphone size={18} strokeWidth={1.5} className="text-[#71717A]" />
        <h3 className="text-sm font-semibold text-[#09090B]">
          Aplicativo no celular
        </h3>
      </div>

      <div className="px-6 py-5">
        {instalado ? (
          <div className="flex items-center gap-3 rounded-lg bg-[#F0FDF4] px-4 py-3">
            <CheckCircle2 size={16} strokeWidth={1.5} className="shrink-0 text-[#166534]" />
            <p className="text-sm text-[#166534]">
              Aplicativo instalado. Voce ja abre o painel direto pelo icone.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#09090B]">
              Adicione a AutomaWeb na tela de inicio e abra seu painel com um
              toque, como um aplicativo.
            </p>

            {promptNativo ? (
              <Button
                onClick={instalar}
                className="mt-4 gap-2 rounded-lg bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A]"
              >
                <SquarePlus size={15} strokeWidth={1.5} />
                Adicionar a tela de inicio
              </Button>
            ) : ios ? (
              <ol className="mt-4 space-y-2.5">
                <li className="flex items-center gap-3 text-sm text-[#52525B]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F4F4F5] text-xs font-semibold text-[#09090B]">
                    1
                  </span>
                  Toque em
                  <span className="inline-flex items-center gap-1 font-medium text-[#09090B]">
                    <Share size={14} strokeWidth={1.5} /> Compartilhar
                  </span>
                  no Safari
                </li>
                <li className="flex items-center gap-3 text-sm text-[#52525B]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F4F4F5] text-xs font-semibold text-[#09090B]">
                    2
                  </span>
                  Escolha
                  <span className="font-medium text-[#09090B]">
                    Adicionar a Tela de Inicio
                  </span>
                </li>
              </ol>
            ) : (
              <p className="mt-3 text-xs text-[#71717A]">
                No menu do navegador do seu celular, toque em{" "}
                <span className="font-medium text-[#09090B]">
                  Adicionar a tela de inicio
                </span>
                .
              </p>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
