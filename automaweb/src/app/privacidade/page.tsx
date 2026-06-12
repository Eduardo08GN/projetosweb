import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/landing/legal-shell";
import { CONTACT_EMAIL } from "@/components/landing/landing-config";

export const metadata: Metadata = {
  title: "Politica de Privacidade — AutomaWeb",
  description:
    "Como a AutomaWeb coleta, usa, protege e exclui os dados dos clientes da plataforma.",
};

/* Pagina exigida pela revisao da Meta (Privacy Policy URL) e pela LGPD.
   A ancora #exclusao e a Data Deletion Instructions URL do app Meta. */

export default function PrivacidadePage() {
  return (
    <LegalShell titulo="Politica de Privacidade" atualizadoEm="12 de junho de 2026">
      <LegalSection titulo="Quem somos">
        <p>
          A AutomaWeb e uma plataforma de marketing digital que produz e
          publica conteudo, cria sites e opera automacoes para negocios
          locais e criadores de conteudo. Esta politica explica quais dados
          tratamos, por que tratamos e como voce pode exercer seus direitos,
          em conformidade com a Lei Geral de Protecao de Dados (LGPD, Lei
          13.709/2018).
        </p>
      </LegalSection>

      <LegalSection titulo="Quais dados coletamos">
        <p>Coletamos apenas o necessario pra operar o servico contratado:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-[#09090B]">Dados de cadastro:</strong>{" "}
            nome, email, telefone e CPF/CNPJ (este ultimo apenas pra emissao
            de cobranca).
          </li>
          <li>
            <strong className="text-[#09090B]">Dados de contas conectadas:</strong>{" "}
            quando voce conecta seu Instagram ou Pagina do Facebook, recebemos
            da Meta o identificador da conta, nome de usuario, foto de perfil
            e um token de acesso que nos autoriza a publicar em seu nome. Nunca
            recebemos nem armazenamos sua senha.
          </li>
          <li>
            <strong className="text-[#09090B]">Conteudo produzido:</strong>{" "}
            os carrosseis, textos e imagens criados pra sua conta, incluindo
            fotos que voce envia pela plataforma.
          </li>
          <li>
            <strong className="text-[#09090B]">Interacoes em redes sociais:</strong>{" "}
            quando automacoes de resposta estiverem ativas na sua conta,
            processamos comentarios e mensagens recebidas no seu perfil
            apenas pra identificar e responder as palavras-chave que voce
            configurou.
          </li>
          <li>
            <strong className="text-[#09090B]">Dados de pagamento:</strong>{" "}
            as cobrancas sao processadas pelo Asaas, instituicao de pagamento
            autorizada. Nao armazenamos numeros de cartao.
          </li>
        </ul>
      </LegalSection>

      <LegalSection titulo="Como usamos os dados">
        <ul className="list-disc space-y-2 pl-5">
          <li>Publicar no seu Instagram o conteudo que voce aprovou;</li>
          <li>Exibir no seu painel a conta conectada e o historico de publicacoes;</li>
          <li>Responder automaticamente interacoes, quando voce ativar automacoes;</li>
          <li>Emitir cobrancas e enviar avisos sobre sua conta por email;</li>
          <li>Prestar suporte e melhorar o servico.</li>
        </ul>
        <p>
          Nao vendemos nem alugamos seus dados a terceiros, e nao usamos seus
          dados pra publicidade de terceiros.
        </p>
      </LegalSection>

      <LegalSection titulo="Com quem compartilhamos">
        <p>
          Compartilhamos dados somente com os operadores estritamente
          necessarios pro servico funcionar: Meta (publicacao no Instagram e
          Facebook que voce autorizou), Asaas (processamento de cobrancas),
          Brevo (envio de emails transacionais) e os provedores de
          infraestrutura onde a plataforma e hospedada. Cada um recebe apenas
          o minimo necessario pra sua funcao.
        </p>
      </LegalSection>

      <LegalSection titulo="Como armazenamos e protegemos">
        <p>
          Os dados ficam em banco de dados proprio, em servidor com acesso
          restrito a equipe da AutomaWeb, trafego criptografado (HTTPS) e
          senhas armazenadas com criptografia de mao unica. Os tokens de
          acesso das contas conectadas expiram automaticamente em ate 60 dias
          e podem ser revogados por voce a qualquer momento.
        </p>
      </LegalSection>

      <LegalSection titulo="Seus direitos">
        <p>
          Conforme a LGPD, voce pode solicitar a qualquer momento: confirmacao
          de tratamento, acesso aos seus dados, correcao, portabilidade e
          exclusao. Basta escrever pra{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-[#09090B] underline underline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>
          . Respondemos em ate 15 dias.
        </p>
      </LegalSection>

      <LegalSection id="exclusao" titulo="Exclusao de dados">
        <p>Voce pode encerrar o tratamento dos seus dados de duas formas:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-[#09090B]">Revogar o acesso as redes sociais:</strong>{" "}
            no seu painel, em Integracoes, clique em Desconectar — o token de
            acesso e descartado na hora. Voce tambem pode remover a AutomaWeb
            em Configuracoes do Instagram/Facebook, na area de apps conectados.
          </li>
          <li>
            <strong className="text-[#09090B]">Excluir a conta e todos os dados:</strong>{" "}
            envie um email pra{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Exclusao de dados`}
              className="font-medium text-[#09090B] underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            com o assunto &ldquo;Exclusao de dados&rdquo;, a partir do email
            cadastrado. Em ate 15 dias excluimos seu cadastro, tokens,
            conteudos e historico de interacoes, exceto registros que a lei
            obriga a manter (como documentos fiscais de cobranca).
          </li>
        </ul>
      </LegalSection>

      <LegalSection titulo="Cookies">
        <p>
          Usamos apenas um cookie essencial de sessao, necessario pro login na
          plataforma. Nao usamos cookies de rastreamento ou publicidade.
        </p>
      </LegalSection>

      <LegalSection titulo="Mudancas nesta politica">
        <p>
          Se esta politica mudar de forma relevante, avisaremos por email e
          atualizaremos a data no topo da pagina. Duvidas? Fale com a gente em{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-[#09090B] underline underline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
