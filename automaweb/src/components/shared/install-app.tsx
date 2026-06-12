"use client";

import { useEffect, useState } from "react";
import { Share, SquarePlus } from "lucide-react";

/* Instalacao do aplicativo na tela de inicio.
   Android/Chrome entrega o prompt nativo (um toque); iPhone nao tem
   prompt, entao mostramos os 2 passos do Safari. */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function useInstallApp() {
  const [instalado, setInstalado] = useState(false);
  const [ios, setIos] = useState(false);
  const [promptNativo, setPromptNativo] =
    useState<BeforeInstallPromptEvent | null>(null);

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

  return { instalado, ios, promptNativo, instalar };
}

/** Botao compacto pro login: primeiro contato do cliente com a plataforma. */
export function InstallAppButton() {
  const { instalado, ios, promptNativo, instalar } = useInstallApp();
  const [passosIos, setPassosIos] = useState(false);

  if (instalado || (!promptNativo && !ios)) return null;

  return (
    <div className="mt-4 flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => (promptNativo ? instalar() : setPassosIos(!passosIos))}
        className="flex items-center gap-2 rounded-lg border border-[#E4E4E7] bg-white px-4 py-2 text-xs font-medium text-[#52525B] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#09090B]"
      >
        <SquarePlus size={14} strokeWidth={1.5} />
        Instalar aplicativo
      </button>
      {passosIos && (
        <p className="flex items-center gap-1.5 text-xs text-[#71717A]">
          No Safari: toque em
          <Share size={12} strokeWidth={1.5} className="inline" />
          <span className="font-medium text-[#09090B]">Compartilhar</span>
          e depois em
          <span className="font-medium text-[#09090B]">
            Adicionar a Tela de Inicio
          </span>
        </p>
      )}
    </div>
  );
}
