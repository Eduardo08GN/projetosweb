"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { variants, transitions } from "@/lib/animations";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Unplug,
  ChevronRight,
} from "lucide-react";
import { siInstagram } from "simple-icons";
import { Button } from "@/components/ui/button";
import { desconectarInstagram } from "@/app/actions/integracao-actions";

function InstagramGlyph({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d={siInstagram.path} />
    </svg>
  );
}

type ConnectionStatus = "DESCONECTADO" | "CONECTADO" | "TOKEN_EXPIRADO" | "ERRO";

type MetaConnectionData = {
  status: ConnectionStatus;
  igUsername?: string;
  igProfilePic?: string;
  pageName?: string;
  connectedAt?: string;
  tokenExpiresAt?: string;
};

const statusConfig: Record<
  ConnectionStatus,
  { label: string; color: string; bg: string; icon: typeof CheckCircle2 }
> = {
  DESCONECTADO: {
    label: "Desconectado",
    color: "text-[#71717A]",
    bg: "bg-[#F4F4F5]",
    icon: Unplug,
  },
  CONECTADO: {
    label: "Conectado",
    color: "text-[#166534]",
    bg: "bg-[#DCFCE7]",
    icon: CheckCircle2,
  },
  TOKEN_EXPIRADO: {
    label: "Acesso expirado",
    color: "text-[#854D0E]",
    bg: "bg-[#FEF9C3]",
    icon: AlertTriangle,
  },
  ERRO: {
    label: "Erro na conexão",
    color: "text-[#991B1B]",
    bg: "bg-[#FEE2E2]",
    icon: XCircle,
  },
};

const DEFAULT_DISCONNECTED: MetaConnectionData = {
  status: "DESCONECTADO",
};

// erros que o retorno da Meta traz na URL, traduzidos pro cliente
const ERROS_CONEXAO: Record<string, string> = {
  denied: "Conexao cancelada no login da Meta. Tente de novo quando quiser.",
  state: "A conexao demorou demais. Tente de novo.",
  token: "A Meta nao liberou o acesso. Tente de novo em instantes.",
  no_page: "Sua conta da Meta nao tem uma Pagina do Facebook. Veja o passo a passo abaixo.",
  no_ig: "Seu Instagram ainda nao esta ligado a uma Pagina do Facebook. Veja o passo a passo abaixo.",
};

/** Pre-requisito da Meta numa linha, com passo a passo recolhido. */
function PreRequisito({ abrirDireto }: { abrirDireto: boolean }) {
  const [aberto, setAberto] = useState(abrirDireto);

  return (
    <div className="rounded-lg bg-[#FAFAFA] px-3.5 py-2.5">
      <button
        onClick={() => setAberto((v) => !v)}
        className="flex w-full items-center gap-1.5 text-left text-xs text-[#71717A] transition-colors duration-150 hover:text-[#09090B]"
      >
        <ChevronRight
          size={13}
          strokeWidth={1.5}
          className={`shrink-0 transition-transform duration-150 ${aberto ? "rotate-90" : ""}`}
        />
        Voce precisa de conta profissional ligada a uma Pagina do Facebook
      </button>
      {aberto && (
        <ol className="mt-2.5 space-y-1.5 pl-5 text-xs leading-relaxed text-[#71717A]">
          <li>
            1. No Instagram: Configuracoes, depois{" "}
            <span className="font-medium text-[#09090B]">Mudar para conta profissional</span>
          </li>
          <li>
            2. Ainda la: Central de contas, depois{" "}
            <span className="font-medium text-[#09090B]">vincular sua Pagina do Facebook</span>{" "}
            (crie uma se nao tiver, leva 1 minuto)
          </li>
          <li className="text-[#A1A1AA]">Travou? Fale com a gente que conectamos juntos.</li>
        </ol>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function MetaConnectionCard({
  initialData,
  erroConexao,
}: {
  initialData: MetaConnectionData | null;
  erroConexao?: string;
}) {
  const [connection, setConnection] = useState<MetaConnectionData>(
    initialData ?? DEFAULT_DISCONNECTED
  );
  const [disconnecting, startDisconnect] = useTransition();
  const config = statusConfig[connection.status];
  const StatusIcon = config.icon;

  const msgErro = erroConexao ? ERROS_CONEXAO[erroConexao] : undefined;
  // falhou por falta de pagina/vinculo: o passo a passo ja abre aberto
  const faltaPreRequisito = erroConexao === "no_page" || erroConexao === "no_ig";

  function handleConnect() {
    window.location.href = "/api/meta/auth";
  }

  function handleDisconnect() {
    startDisconnect(async () => {
      const result = await desconectarInstagram();
      if (result.success) setConnection(DEFAULT_DISCONNECTED);
    });
  }

  function handleReconnect() {
    window.location.href = "/api/meta/auth";
  }

  return (
    <motion.div
      className="rounded-xl border border-[#E4E4E7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      variants={variants.fadeUpSmall}
      initial="hidden"
      animate="visible"
      transition={transitions.smooth}
    >
      <div className="flex items-center justify-between border-b border-[#E4E4E7] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#4F5BD5] via-[#962FBF] to-[#D62976]">
            <InstagramGlyph size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#09090B]">Instagram</h3>
            <p className="text-xs text-[#71717A]">Publicação automática</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${config.bg} ${config.color}`}
        >
          <StatusIcon size={12} />
          {config.label}
        </span>
      </div>

      <div className="px-6 py-5">
        <AnimatePresence mode="wait">
          {connection.status === "DESCONECTADO" && (
            <motion.div
              key="disconnected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              {msgErro && (
                <div className="rounded-lg bg-[#FEF9C3] px-4 py-3">
                  <p className="text-sm text-[#854D0E]">{msgErro}</p>
                </div>
              )}

              <p className="text-sm text-[#09090B]">
                Conecte sua conta do Instagram para que a AutomaWeb publique
                carrosséis automaticamente no seu perfil.
              </p>

              <PreRequisito abrirDireto={faltaPreRequisito} />

              <Button
                onClick={handleConnect}
                className="gap-2 rounded-lg bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A]"
              >
                <InstagramGlyph size={16} />
                Conectar Instagram
              </Button>

              <p className="text-[11px] text-[#A1A1AA]">
                Você será redirecionado para o login da Meta. Nenhuma senha é
                armazenada pela AutomaWeb.
              </p>
            </motion.div>
          )}

          {connection.status === "CONECTADO" && (
            <motion.div
              key="connected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F4F5] text-sm font-semibold text-[#09090B]">
                  {connection.igUsername?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#09090B]">
                    @{connection.igUsername}
                  </p>
                  <p className="text-xs text-[#71717A]">{connection.pageName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-[#FAFAFA] px-4 py-3">
                  <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#A1A1AA]">
                    Conectado em
                  </p>
                  <p className="mt-1 text-sm text-[#09090B]">
                    {connection.connectedAt && formatDate(connection.connectedAt)}
                  </p>
                </div>
                <div className="rounded-lg bg-[#FAFAFA] px-4 py-3">
                  <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#A1A1AA]">
                    Acesso expira em
                  </p>
                  <p className="mt-1 text-sm text-[#09090B]">
                    {connection.tokenExpiresAt &&
                      `${daysUntil(connection.tokenExpiresAt)} dias`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleReconnect}
                  className="gap-2 rounded-lg bg-[#18181B] px-4 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A]"
                >
                  Renovar acesso
                </Button>
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#09090B] disabled:opacity-50"
                >
                  {disconnecting ? "Desconectando..." : "Desconectar"}
                </button>
              </div>
            </motion.div>
          )}

          {connection.status === "TOKEN_EXPIRADO" && (
            <motion.div
              key="expired"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <div className="rounded-lg bg-[#FEF9C3] px-4 py-3">
                <p className="text-sm text-[#854D0E]">
                  O acesso expirou. Reconecte para continuar publicando.
                </p>
              </div>
              <Button
                onClick={handleReconnect}
                className="gap-2 rounded-lg bg-[#18181B] px-4 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A]"
              >
                Reconectar Instagram
              </Button>
            </motion.div>
          )}

          {connection.status === "ERRO" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <div className="rounded-lg bg-[#FEE2E2] px-4 py-3">
                <p className="text-sm text-[#991B1B]">
                  Nao foi possivel manter a conexao. Tente reconectar.
                </p>
              </div>
              <Button
                onClick={handleReconnect}
                className="gap-2 rounded-lg bg-[#18181B] px-4 py-2.5 text-sm font-medium text-[#FAFAFA] hover:bg-[#27272A]"
              >
                Reconectar Instagram
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
