import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/landing/legal-shell";
import { CONTACT_EMAIL } from "@/components/landing/landing-config";

export const metadata: Metadata = {
  title: "Termos de Servico — AutomaWeb",
  description:
    "Condicoes de uso da plataforma AutomaWeb: o que entregamos, o que o cliente autoriza e como cancelar.",
};

export default function TermosPage() {
  return (
    <LegalShell titulo="Termos de Servico" atualizadoEm="12 de junho de 2026">
      <LegalSection titulo="O que e a AutomaWeb">
        <p>
          A AutomaWeb produz conteudo pra redes sociais, cria e mantem sites e
          opera automacoes de marketing em nome dos clientes. Ao criar uma
          conta ou contratar um plano, voce concorda com estes termos.
        </p>
      </LegalSection>

      <LegalSection titulo="O que entregamos">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Producao de carrosseis e conteudo conforme o plano contratado;
          </li>
          <li>
            Publicacao automatica no seu Instagram, quando voce conectar a
            conta;
          </li>
          <li>Painel pra acompanhar, aprovar e editar cada publicacao;</li>
          <li>
            Criacao e hospedagem de site, quando incluido no seu pacote;
          </li>
          <li>Suporte direto com a equipe.</li>
        </ul>
      </LegalSection>

      <LegalSection titulo="O que voce autoriza">
        <p>
          Ao conectar seu Instagram ou Pagina do Facebook, voce autoriza a
          AutomaWeb a publicar em seu nome o conteudo aprovado por voce. A
          autorizacao usa o sistema oficial da Meta, nunca envolve sua senha e
          pode ser revogada a qualquer momento no seu painel (Integracoes,
          botao Desconectar) ou nas configuracoes do proprio Instagram.
        </p>
      </LegalSection>

      <LegalSection titulo="Aprovacao e agendamento de conteudo">
        <p>
          Todo conteudo passa pelo seu painel antes de ir ao ar. Voce pode
          aprovar como esta, editar uma vez (texto e fotos) ou mudar a data e
          o horario da publicacao — tudo ate 4 horas antes do horario marcado.
        </p>
        <p>
          Pra manter a regularidade do seu perfil, conteudo que nao receber
          resposta ate 4 horas antes do horario agendado e aprovado
          automaticamente e publicado conforme o calendario. Voce recebe o
          aviso de cada conteudo com dias de antecedencia por email e pelo
          painel.
        </p>
      </LegalSection>

      <LegalSection titulo="Pagamento e renovacao">
        <p>
          Os planos sao mensais, cobrados pelo Asaas (Pix ou cartao). Avisamos
          o vencimento com antecedencia por email, com o link de pagamento.
          Sem o pagamento, a conta segue funcionando por alguns dias de
          tolerancia e depois entra em espera: as publicacoes pausam e o
          acesso ao painel fica limitado. Nada e apagado — regularizou, tudo
          volta de onde parou.
        </p>
      </LegalSection>

      <LegalSection titulo="Cancelamento">
        <p>
          Sem fidelidade. Pra cancelar, fale com a gente em{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Cancelamento`}
            className="font-medium text-[#09090B] underline underline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          — o cancelamento vale a partir do ciclo seguinte e nao gera multa.
          Apos o cancelamento, voce pode pedir a exclusao dos seus dados
          conforme a nossa{" "}
          <a
            href="/privacidade#exclusao"
            className="font-medium text-[#09090B] underline underline-offset-2"
          >
            Politica de Privacidade
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection titulo="Conteudo e propriedade">
        <p>
          O conteudo produzido e aprovado pra sua conta e seu. Voce pode
          baixa-lo pelo painel a qualquer momento, inclusive apos o
          cancelamento, dentro do prazo de exclusao de dados. Voce e
          responsavel pelas informacoes do seu negocio fornecidas pra
          producao (precos, promessas, claims de saude) e por ter os direitos
          das fotos que enviar.
        </p>
      </LegalSection>

      <LegalSection titulo="Uso aceitavel">
        <p>
          A plataforma nao pode ser usada pra conteudo ilegal, enganoso ou que
          viole as politicas da Meta. Automacoes respondem apenas a quem
          interage com o seu perfil — a AutomaWeb nao faz envio em massa nem
          spam, e pode suspender contas que tentem usar o servico pra isso.
        </p>
      </LegalSection>

      <LegalSection titulo="Limites de responsabilidade">
        <p>
          Dependemos de servicos de terceiros (Meta, provedores de hospedagem
          e pagamento) que podem ficar indisponiveis ou mudar suas regras.
          Nesses casos, trabalhamos pra restabelecer o servico o mais rapido
          possivel, mas nao respondemos por perdas indiretas como lucros
          cessantes. Publicacoes que falharem sao retentadas automaticamente
          e, persistindo a falha, tratadas pela equipe.
        </p>
      </LegalSection>

      <LegalSection titulo="Foro e legislacao">
        <p>
          Estes termos seguem a legislacao brasileira. Fica eleito o foro da
          comarca de Contagem, MG, pra resolver qualquer controversia.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
