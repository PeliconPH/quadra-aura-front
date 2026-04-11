# Quadra Aura — front-end

Landing page do **Quadra Aura**, empreendimento em Belém (PA): HTML estático, CSS modular e JavaScript vanilla, servido e empacotado com [Vite](https://vitejs.dev/).

## O que tem aqui

- **Página única** (`index.html`) com seções (hero, plantas, galeria, formulários de lead, etc.).
- **Estilos** em `css/` (tokens, reset, layout, componentes e seções).
- **Scripts** em `js/` (carrossel, modal de vídeo, máscara de telefone, envio de leads).
- **Assets** em `assets/images/` (PNG de origem e WebP gerados para produção).

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Yarn Classic](https://classic.yarnpkg.com/) (1.x), conforme `packageManager` do projeto

## Começando

```bash
yarn install
yarn dev
```

Abra o endereço que o Vite mostrar no terminal (por padrão costuma ser `http://localhost:5173`).

### Variáveis de ambiente

Copie o exemplo e ajuste se precisar:

```bash
cp .env.example .env
```

- **`BACKEND_URL`**: URL base da API **sem** barra no final. Se estiver vazio em desenvolvimento, o front usa `POST /lead` e o Vite encaminha para `http://localhost:3001` (veja `vite.config.js`).
- **`TUNNEL_EXTRA_ALLOWED_HOSTS`**: hosts extras (separados por vírgula) quando usar túnel com domínio próprio; `*.trycloudflare.com` e `*.ngrok-free.dev` já são aceitos.

Reinicie o `yarn dev` depois de alterar o `.env`.

## Scripts

| Comando | Descrição |
|--------|-----------|
| `yarn dev` | Servidor de desenvolvimento com hot reload |
| `yarn build` | Gera WebPs a partir dos PNGs (`scripts/generate-assets-webp.mjs`) e faz o build de produção em `dist/` |
| `yarn preview` | Serve a pasta `dist/` localmente |
| `yarn optimize:pngs` | Otimiza PNGs com Sharp (`scripts/optimize-pngs.mjs`) |
| `yarn tunnel` | [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) apontando para `http://127.0.0.1:5175` — alinhe a porta com a do `yarn dev` (ex.: `yarn dev --port 5175`) ou ajuste o script |
| `yarn deps:unlock` | Utilitário interno de dependências |

## Formulários de lead

O cliente chama `POST …/lead` (URL completa se `BACKEND_URL` / `VITE_API_URL` estiver definido, ou caminho relativo `/lead` com proxy no dev). É necessário um backend compatível nessa rota.

## Deploy

O repositório inclui `vercel.json` com cabeçalhos de cache longo para `/assets` e `/fonts`. O fluxo típico é conectar o repositório à [Vercel](https://vercel.com/) e usar o comando de build padrão (`yarn build`, saída `dist`).

## Estrutura rápida

```
├── index.html          # marcação da página
├── css/                # estilos
├── js/                 # comportamento
├── assets/images/      # imagens (png + webp)
├── public/fonts/       # fontes self-hosted (quando aplicável)
├── scripts/            # Node (webp, otimização de PNG)
└── vite.config.js      # proxy /lead, hosts de túnel, envPrefix
```

## Licença

Repositório **privado** (`private: true` no `package.json`). Uso e distribuição conforme política da organização.
