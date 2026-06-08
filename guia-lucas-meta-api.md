# Guia pro Lucas: Configurar Meta API pro pipeline de carrossel

Lucas, preciso que voce consiga 3 informacoes da conta Meta/Instagram pra gente
configurar a postagem automatica de carrosseis. Sao 3 valores que voce vai me
mandar no final. O processo leva uns 15-20 minutos.

---

## O que eu preciso que voce me mande no final

```
META_PAGE_ACCESS_TOKEN = (token longo, tipo EAAGm0PX...)
META_PAGE_ID = (numero, tipo 123456789)
META_IG_USER_ID = (numero, tipo 17841400...)
```

---

## Passo a passo

### 1. Verificar que o Instagram esta como Business/Creator

- Abrir o Instagram do cliente no celular
- Ir em Configuracoes → Conta → Mudar tipo de conta
- Tem que estar como "Profissional" (Business ou Creator)
- Se ja estiver, pular pro passo 2

### 2. Verificar que o Instagram esta conectado a uma Pagina do Facebook

- No Instagram: Configuracoes → Conta → Contas vinculadas → Facebook
- Tem que mostrar uma Pagina do Facebook conectada
- Se nao tiver, conectar agora (vai pedir login no Facebook)
- A Pagina do Facebook e OBRIGATORIA pra API funcionar

### 3. Criar um App no Meta for Developers

- Acessar: https://developers.facebook.com/
- Logar com a conta do Facebook que administra a Pagina
- Clicar em "Meus Apps" (canto superior direito)
- Clicar em "Criar App"
- Tipo: "Business" (ou "Outro" se nao aparecer Business)
- Nome: "AutomaWeb Carrossel" (ou o nome que quiser)
- Email: o email da conta
- Criar

### 4. Adicionar o produto "Instagram Graph API"

- Dentro do App recem criado, no menu lateral: "Adicionar Produto"
- Procurar "Instagram Graph API" e clicar "Configurar"
- Isso ativa a capacidade de postar via API

### 5. Pegar o META_PAGE_ID e META_IG_USER_ID

Jeito mais facil — pelo Graph API Explorer:

- Acessar: https://developers.facebook.com/tools/explorer/
- No topo, selecionar o App que voce criou
- Clicar em "Gerar Token de Acesso"
- Vai pedir permissoes. Marcar TODAS estas:
  - `pages_show_list`
  - `pages_read_engagement`
  - `pages_manage_posts`
  - `instagram_basic`
  - `instagram_content_publish`
- Clicar "Gerar Token" e autorizar

Agora no campo de consulta, digitar:

```
me/accounts
```

Clicar "Enviar". Vai aparecer uma lista de Paginas. Copiar:
- **id** → esse e o META_PAGE_ID
- **access_token** → esse e um token temporario (vamos trocar por permanente)

Agora consultar o Instagram Business ID. No campo, digitar:

```
<META_PAGE_ID>?fields=instagram_business_account
```

(substituir <META_PAGE_ID> pelo numero que voce copiou)

Clicar "Enviar". Vai retornar:

```json
{
  "instagram_business_account": {
    "id": "17841400XXXXXXX"
  }
}
```

Copiar esse **id** → esse e o META_IG_USER_ID

### 6. Gerar token de longa duracao (importante!)

O token do passo 5 expira em 1 hora. Precisamos de um que dure 60 dias.

No campo do Graph API Explorer, digitar:

```
oauth/access_token?grant_type=fb_exchange_token&client_id=SEU_APP_ID&client_secret=SEU_APP_SECRET&fb_exchange_token=TOKEN_TEMPORARIO
```

Onde:
- **SEU_APP_ID**: Configuracoes do App → Basico → ID do Aplicativo
- **SEU_APP_SECRET**: Configuracoes do App → Basico → Chave Secreta (clicar "Mostrar")
- **TOKEN_TEMPORARIO**: o access_token que voce copiou no passo 5

Ou usar este metodo mais simples:

- Acessar: https://developers.facebook.com/tools/debug/accesstoken/
- Colar o token temporario
- Clicar "Depurar"
- Clicar "Estender Token de Acesso" (aparece embaixo)
- Copiar o novo token gerado

Esse novo token e o **META_PAGE_ACCESS_TOKEN** que eu preciso.

### 7. Me mandar os 3 valores

Manda pra mim (Eduardo) por mensagem privada (NAO postar em lugar publico):

```
META_PAGE_ACCESS_TOKEN = EAAG...token longo aqui...
META_PAGE_ID = 123456789
META_IG_USER_ID = 17841400XXXXXXX
```

---

## Resumo visual do que voce vai fazer

```
Facebook (sua conta)
  → developers.facebook.com
    → Criar App "AutomaWeb Carrossel"
      → Adicionar produto "Instagram Graph API"
        → Graph API Explorer
          → me/accounts → pega PAGE_ID + token
          → <PAGE_ID>?fields=instagram_business_account → pega IG_USER_ID
          → Estender token → pega ACCESS_TOKEN permanente
            → Me manda os 3 valores
```

---

## Se der erro

- "Instagram Business Account nao encontrado" → Instagram nao esta como Business ou nao esta conectado a Pagina
- "Permissao negada" → precisa marcar as permissoes certas no passo 5
- "App nao aprovado" → pro modo teste funciona com a conta do admin. Pra aprovar oficialmente precisa do App Review (eu cuido dessa parte depois)
- Qualquer outro erro → me manda print que eu resolvo

---

*Esse guia e pra uso interno. Os tokens sao sensiveis — tratar como senha.*
