/* ── Templates de email ──
   Identidade visual da plataforma aplicada a email: paleta zinc,
   Plus Jakarta Sans com fallback de sistema, card branco sobre fundo
   claro, rodape institucional. HTML em tabela pra renderizar bem em
   qualquer cliente de email. */

const SITE = process.env.NEXT_PUBLIC_URL ?? "https://automaweb.pro";
const LOGO = `${SITE}/automaweb_logo_preta_horizontal.png`;

const FONTE =
  "'Plus Jakarta Sans', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

export type EmailPronto = { subject: string; html: string };

type Cta = { label: string; url: string };

function paragrafo(texto: string) {
  return `<p style="margin:0 0 14px;font-family:${FONTE};font-size:15px;line-height:1.7;color:#3F3F46;">${texto}</p>`;
}

function caixaInfo(linhas: Array<[string, string]>) {
  const rows = linhas
    .map(
      ([label, valor], i) => `
        <p style="margin:${i === 0 ? "0" : "14px"} 0 3px;font-family:${FONTE};font-size:11px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#71717A;">${label}</p>
        <p style="margin:0;font-family:${FONTE};font-size:15px;font-weight:600;color:#09090B;">${valor}</p>`
    )
    .join("");
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 6px;">
      <tr>
        <td style="background-color:#FAFAFA;border:1px solid #E4E4E7;border-radius:10px;padding:20px 24px;">
          ${rows}
        </td>
      </tr>
    </table>`;
}

function botao(cta: Cta) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:26px;">
      <tr>
        <td style="border-radius:10px;background-color:#18181B;">
          <a href="${cta.url}" target="_blank" style="display:inline-block;padding:13px 28px;font-family:${FONTE};font-size:14px;font-weight:600;color:#FAFAFA;text-decoration:none;border-radius:10px;">${cta.label}</a>
        </td>
      </tr>
    </table>`;
}

function layout({
  preheader,
  eyebrow,
  titulo,
  corpo,
  cta,
  motivo,
}: {
  preheader: string;
  eyebrow: string;
  titulo: string;
  corpo: string;
  cta?: Cta;
  motivo: string;
}) {
  const ano = new Date().getFullYear();
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <title>${titulo}</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F4F5;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F4F5;">
    <tr>
      <td align="center" style="padding:44px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;">
          <tr>
            <td style="padding:0 6px 26px;">
              <img src="${LOGO}" alt="AutomaWeb" height="24" style="display:block;border:0;height:24px;width:auto;">
            </td>
          </tr>
          <tr>
            <td style="background-color:#FFFFFF;border:1px solid #E4E4E7;border-radius:14px;padding:40px;">
              <p style="margin:0 0 12px;font-family:${FONTE};font-size:11px;font-weight:600;letter-spacing:1.6px;text-transform:uppercase;color:#71717A;">${eyebrow}</p>
              <h1 style="margin:0 0 18px;font-family:${FONTE};font-size:22px;line-height:1.35;font-weight:600;color:#09090B;">${titulo}</h1>
              ${corpo}
              ${cta ? botao(cta) : ""}
            </td>
          </tr>
          <tr>
            <td style="padding:36px 6px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid #E4E4E7;padding-top:30px;">
                    <img src="${LOGO}" alt="AutomaWeb" height="16" style="display:block;border:0;height:16px;width:auto;margin:0 0 14px;">
                    <p style="margin:0 0 20px;font-family:${FONTE};font-size:13px;line-height:1.7;color:#71717A;max-width:400px;">Sites, conteudo e presenca digital cuidados de ponta a ponta para o seu negocio.</p>
                    <p style="margin:0 0 26px;font-family:${FONTE};font-size:13px;">
                      <a href="${SITE}" target="_blank" style="font-weight:600;color:#3F3F46;text-decoration:none;">automaweb.pro</a>
                      <span style="color:#D4D4D8;">&nbsp;&nbsp;&#124;&nbsp;&nbsp;</span>
                      <a href="mailto:contato@automaweb.pro" style="font-weight:600;color:#3F3F46;text-decoration:none;">contato@automaweb.pro</a>
                    </p>
                    <p style="margin:0 0 6px;font-family:${FONTE};font-size:11px;line-height:1.7;color:#A1A1AA;">${motivo}</p>
                    <p style="margin:0;font-family:${FONTE};font-size:11px;letter-spacing:0.3px;color:#A1A1AA;">&copy; ${ano} AutomaWeb &middot; Contagem, MG &middot; Brasil</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ───────────────────────── Emails pro cliente ───────────────────────── */

export function emailBoasVindas({
  nome,
  email,
  senha,
}: {
  nome: string;
  email: string;
  senha: string;
}): EmailPronto {
  const primeiroNome = nome.split(" ")[0];
  return {
    subject: "Seu acesso ao painel AutomaWeb",
    html: layout({
      preheader: "Sua conta foi criada. Entre com os dados abaixo.",
      eyebrow: "Acesso liberado",
      titulo: `${primeiroNome}, seu espaco na AutomaWeb esta pronto`,
      corpo:
        paragrafo(
          "Criamos sua conta no painel da AutomaWeb. La voce acompanha seus conteudos, aprova cada publicacao antes dela ir ao ar e baixa tudo o que produzimos para voce."
        ) +
        paragrafo("Use os dados abaixo no seu primeiro acesso:") +
        caixaInfo([
          ["Email", email],
          ["Senha de acesso", senha],
        ]),
      cta: { label: "Entrar no meu painel", url: `${SITE}/login` },
      motivo:
        "Voce recebeu este email porque uma conta foi criada para voce na plataforma AutomaWeb.",
    }),
  };
}

export function emailPostParaAprovar({ titulo }: { titulo: string }): EmailPronto {
  return {
    subject: "Novo conteudo pronto para sua aprovacao",
    html: layout({
      preheader: `"${titulo}" espera o seu ok para ser publicado.`,
      eyebrow: "Aprovacao pendente",
      titulo: "Um novo conteudo espera o seu ok",
      corpo:
        paragrafo(
          `Acabamos de finalizar <strong style="color:#09090B;">${titulo}</strong> e ele ja esta no seu painel.`
        ) +
        paragrafo(
          "De uma olhada com calma: voce pode aprovar do jeito que esta ou ajustar texto e fotos antes da publicacao."
        ),
      cta: { label: "Revisar e aprovar", url: `${SITE}/tenant/carrossel` },
      motivo:
        "Voce recebeu este aviso porque um conteudo aguarda sua aprovacao na AutomaWeb.",
    }),
  };
}

export function emailPostPublicado({ titulo }: { titulo: string }): EmailPronto {
  return {
    subject: "Seu conteudo esta no ar",
    html: layout({
      preheader: `"${titulo}" acabou de ser publicado no seu Instagram.`,
      eyebrow: "Publicado",
      titulo: "Seu conteudo acabou de entrar no ar",
      corpo:
        paragrafo(
          `<strong style="color:#09090B;">${titulo}</strong> foi publicado no seu Instagram conforme o combinado e ja esta disponivel para o seu publico.`
        ) +
        paragrafo("Voce encontra o historico completo das publicacoes no seu painel."),
      cta: { label: "Ver minhas publicacoes", url: `${SITE}/tenant/carrossel` },
      motivo:
        "Voce recebeu este aviso porque uma publicacao sua foi concluida pela AutomaWeb.",
    }),
  };
}

export function emailSitePublicado({ dominio }: { dominio: string | null }): EmailPronto {
  return {
    subject: "Seu site esta no ar",
    html: layout({
      preheader: "Seu novo site acabou de ser publicado.",
      eyebrow: "Lancamento",
      titulo: "Seu novo site acabou de entrar no ar",
      corpo:
        paragrafo(
          dominio
            ? `Seu site ja esta publicado e aberto ao publico no endereco <strong style="color:#09090B;">${dominio}</strong>.`
            : "Seu site ja esta publicado e aberto ao publico."
        ) +
        paragrafo(
          "Qualquer ajuste que voce sentir falta, e so falar com a gente."
        ),
      cta: dominio
        ? { label: "Visitar meu site", url: `https://${dominio}` }
        : undefined,
      motivo:
        "Voce recebeu este aviso porque o seu site foi publicado pela AutomaWeb.",
    }),
  };
}

export function emailConexaoVencendo({ dias }: { dias: number }): EmailPronto {
  const prazo = dias <= 1 ? "amanha" : `em ${dias} dias`;
  return {
    subject: `Sua conexao com o Instagram vence ${prazo}`,
    html: layout({
      preheader: "Renove em menos de um minuto e tudo segue normal.",
      eyebrow: "Atencao",
      titulo: "Hora de renovar sua conexao com o Instagram",
      corpo:
        paragrafo(
          `A autorizacao que permite publicarmos no seu Instagram vence ${prazo}.`
        ) +
        paragrafo(
          "A renovacao leva menos de um minuto e garante que suas publicacoes continuem saindo normalmente."
        ),
      cta: { label: "Renovar agora", url: `${SITE}/tenant/integracoes` },
      motivo:
        "Voce recebeu este aviso porque sua conexao com o Instagram esta perto de vencer.",
    }),
  };
}

export function emailConexaoVencida(): EmailPronto {
  return {
    subject: "Sua conexao com o Instagram precisa ser renovada",
    html: layout({
      preheader: "Suas publicacoes ficam em espera ate a renovacao.",
      eyebrow: "Acao necessaria",
      titulo: "Suas publicacoes estao em espera",
      corpo:
        paragrafo(
          "A autorizacao do seu Instagram venceu e as publicacoes automaticas ficaram pausadas."
        ) +
        paragrafo(
          "Renove a conexao no seu painel para tudo voltar ao normal. Leva menos de um minuto."
        ),
      cta: { label: "Renovar conexao", url: `${SITE}/tenant/integracoes` },
      motivo:
        "Voce recebeu este aviso porque sua conexao com o Instagram venceu.",
    }),
  };
}

export function emailPlanoVencendo({
  dias,
  linkPagamento,
}: {
  dias: number;
  linkPagamento?: string | null;
}): EmailPronto {
  const prazo = dias <= 1 ? "amanha" : `em ${dias} dias`;
  return {
    subject: `Seu plano vence ${prazo}`,
    html: layout({
      preheader: linkPagamento
        ? "Pague com Pix ou cartao e tudo segue sem pausa."
        : "Renove e suas publicacoes seguem sem pausa.",
      eyebrow: "Seu plano",
      titulo: "Seu periodo incluso esta chegando ao fim",
      corpo:
        paragrafo(
          `O periodo incluso no seu pacote vence ${prazo}. Depois dessa data, as publicacoes automaticas entram em espera.`
        ) +
        (linkPagamento
          ? paragrafo(
              "Seu link de pagamento ja esta pronto: da pra pagar com Pix ou cartao em menos de um minuto e tudo segue sem pausa."
            )
          : paragrafo(
              "Pra seguir sem pausa, escolha um plano de continuidade no seu painel ou fale com a gente. Leva um minuto."
            )),
      cta: linkPagamento
        ? { label: "Pagar com Pix ou cartao", url: linkPagamento }
        : { label: "Ver planos no painel", url: `${SITE}/tenant/conta` },
      motivo: "Voce recebeu este aviso porque seu plano na AutomaWeb esta perto de vencer.",
    }),
  };
}

export function emailPlanoVencido({
  linkPagamento,
}: {
  linkPagamento?: string | null;
} = {}): EmailPronto {
  return {
    subject: "Seu plano venceu, suas publicacoes vao pausar",
    html: layout({
      preheader: linkPagamento
        ? "Pague com Pix ou cartao e nada para."
        : "Regularize em poucos dias e nada para.",
      eyebrow: "Acao necessaria",
      titulo: "Seu periodo incluso terminou",
      corpo:
        paragrafo(
          "O periodo incluso no seu pacote venceu. Suas publicacoes seguem por mais alguns dias e depois entram em espera automaticamente."
        ) +
        (linkPagamento
          ? paragrafo(
              "Pra manter tudo rodando, e so pagar pelo link abaixo: aceita Pix ou cartao e a confirmacao e na hora."
            )
          : paragrafo(
              "Escolha um plano de continuidade no seu painel ou fale com a gente pra manter tudo rodando."
            )),
      cta: linkPagamento
        ? { label: "Pagar agora", url: linkPagamento }
        : { label: "Regularizar agora", url: `${SITE}/tenant/conta` },
      motivo: "Voce recebeu este aviso porque seu plano na AutomaWeb venceu.",
    }),
  };
}

export function emailContaPausada(): EmailPronto {
  return {
    subject: "Sua conta esta em espera",
    html: layout({
      preheader: "Nada foi apagado. Regularize e tudo volta na hora.",
      eyebrow: "Conta em espera",
      titulo: "Suas publicacoes foram pausadas",
      corpo:
        paragrafo(
          "Como o plano venceu e nao foi renovado, sua conta entrou em espera: as publicacoes automaticas pararam e o acesso ao painel ficou limitado."
        ) +
        paragrafo(
          "Nada foi apagado. Assim que voce regularizar, tudo volta exatamente de onde parou."
        ),
      cta: {
        label: "Falar com a gente",
        url: "mailto:contato@automaweb.pro?subject=Quero reativar minha conta",
      },
      motivo: "Voce recebeu este aviso porque sua conta na AutomaWeb foi pausada por vencimento do plano.",
    }),
  };
}

/* ───────────────────────── Emails pra equipe ───────────────────────── */

export function emailInterno({
  assunto,
  titulo,
  resumo,
  linhas,
  cta,
}: {
  assunto: string;
  titulo: string;
  resumo: string;
  linhas: Array<[string, string]>;
  cta?: Cta;
}): EmailPronto {
  return {
    subject: assunto,
    html: layout({
      preheader: resumo,
      eyebrow: "Aviso interno",
      titulo,
      corpo: paragrafo(resumo) + caixaInfo(linhas),
      cta: cta ?? { label: "Abrir o painel", url: `${SITE}/master` },
      motivo:
        "Aviso operacional interno da AutomaWeb, enviado para a equipe master.",
    }),
  };
}
