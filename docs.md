# 📚 Documentação - Landing Page Ôleo de Avestruz

## 📖 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Instalação & Setup](#instalação--setup)
4. [Sistema de Cloaking](#sistema-de-cloaking)
5. [Desenvolvimento](#desenvolvimento)
6. [Deploy](#deploy)
7. [Troubleshooting](#troubleshooting)

---

## Visão Geral

**Landing Page Ôleo de Avestruz** é um site de vendas de suplementos 100% natural, construído com:

- **Astro 5** - Framework estático/server-side
- **React** - Componentes interativos
- **Tailwind CSS** - Estilos
- **Vercel** - Hosting & deploy

**Funcionalidades principais:**
- ✅ Landing page responsiva com múltiplas seções
- ✅ Sistema inteligente de cloaking (detecção de bots + geolocalização)
- ✅ Integração com WhatsApp
- ✅ Google Tag Manager (GTM)
- ✅ Open Graph metadata para redes sociais

---

## Estrutura do Projeto

```
landing-page-oleo/
├── src/
│   ├── components/
│   │   ├── sections/           # Seções da landing page
│   │   │   ├── Hero.astro
│   │   │   ├── Benefits.astro
│   │   │   ├── Ingredients.astro
│   │   │   ├── Testimonials.astro
│   │   │   ├── Pricing.astro
│   │   │   ├── FAQ.astro
│   │   │   └── ... (outras seções)
│   │   ├── ui/                 # Componentes reutilizáveis
│   │   │   ├── Button.astro
│   │   │   ├── Card.astro
│   │   │   └── Section.astro
│   │   └── GeoRedirect.astro   # 🔴 Sistema de cloaking
│   ├── layouts/
│   │   └── Layout.astro        # Layout principal com meta tags
│   ├── pages/
│   │   ├── index.astro         # Página home
│   │   ├── aviso-legal.astro
│   │   ├── politica-de-privacidade.astro
│   │   └── ... (outras páginas)
│   ├── styles/
│   │   └── global.css
│   ├── assets/
│   │   └── images/             # Imagens otimizadas
│   └── middleware.ts           # 🔴 Detectar bots no servidor
├── public/
│   ├── avatars/                # Fotos dos depoentes
│   ├── thumbnails/             # Thumbnails dos vídeos
│   └── videos/                 # Vídeos
├── astro.config.mjs            # Configuração Astro
├── tsconfig.json               # Configuração TypeScript
├── vercel.json                 # Configuração Vercel
├── DEBUG-CLOAKING.md           # Guia de debug do cloaking
├── test-cloaking.js            # Script de testes
└── package.json
```

---

## Instalação & Setup

### Pré-requisitos
- Node.js 18+ ou 20+
- npm ou yarn

### Instalação local

```bash
# 1. Clone o repositório
git clone https://github.com/seu-user/landing-page-oleo.git
cd landing-page-oleo

# 2. Instale dependências
npm install

# 3. Inicie desenvolvimento
npm run dev

# 4. Abra no navegador
# Acesse: http://localhost:3000
```

### Scripts disponíveis

```bash
npm run dev       # Inicia servidor de desenvolvimento (Astro)
npm run build     # Build para produção
npm run preview   # Visualiza build localmente (Node.js server)
npm run astro     # Executa CLI do Astro
```

---

## Sistema de Cloaking

O sistema de cloaking é composto por **2 camadas**:

### 1️⃣ Detectar Bots (Servidor - Middleware)

**Arquivo**: `src/middleware.ts`

**Como funciona:**
- Roda em **cada requisição** no servidor Vercel
- Detecta bots pelo `User-Agent` HTTP
- Redireciona com status **301** para URL de imprensa

**Bots detectados:**
- ✅ Google (Googlebot, AdsBot)
- ✅ Microsoft (Bingbot, MSNBot)
- ✅ Redes Sociais (Facebook, Twitter, LinkedIn, Instagram, Pinterest)
- ✅ Mensageria (WhatsApp, Telegram)
- ✅ SEO Tools (Semrush, Ahrefs, MozBot)
- ✅ Genéricos (bot, crawler, spider, scraper)

**Exemplo:**
```bash
# Teste com curl
curl -I -H "User-Agent: facebookbot" https://biototalnatural.com.br/

# Resultado
HTTP/1.1 301 Moved Permanently
Location: https://g1.globo.com/ro/rondonia/especial-publicitario/amazon-struthio/noticia/2022/08/08/suplemento-alimentar-combate-estresse-e-ansiedade.ghtml
```

### 2️⃣ Detectar Geolocalização (Cliente)

**Arquivo**: `src/components/GeoRedirect.astro`

**Como funciona:**
- Executa no **JavaScript do cliente** após carregar página
- Detecta país do usuário via `ipapi.co` ou `api.country.is`
- Cacheia resultado por 24h (localStorage)
- Redireciona para imprensa se **NOT `BR`**

**Fluxo:**
```
1. Página carrega (usuário vê conteúdo por 1-2s)
2. Script executa silenciosamente
3. Detecta país do IP
4. Se não BR → redireciona sem avisar
5. Se BR → continua normal
```

**Console logs** (F12 → Console):
```
[CLOAK] 🔍 Detectando geolocalização...
[CLOAK] ✓ ipapi.co respondeu: BR
[CLOAK] 📍 País detectado: BR
[CLOAK] ✅ Brasil detectado, permitindo acesso
```

### URL de Redirecionamento

Ambas as camadas redirecionam para:
```
https://g1.globo.com/ro/rondonia/especial-publicitario/amazon-struthio/noticia/2022/08/08/suplemento-alimentar-combate-estresse-e-ansiedade.ghtml
```

**Para alterar**, edite:
- `src/middleware.ts` → `REDIRECT_URL`
- `src/components/GeoRedirect.astro` → `redirectUrl` (define:vars)

---

## Desenvolvimento

### Adicionar nova seção

1. Crie componente em `src/components/sections/MinhaSeccao.astro`:

```astro
---
// MinhaSeccao.astro
---

<section class="py-12 bg-white">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="text-4xl font-bold mb-8">Minha Seção</h2>
    <p>Conteúdo aqui...</p>
  </div>
</section>
```

2. Importe em `src/pages/index.astro`:

```astro
---
import MinhaSeccao from '../components/sections/MinhaSeccao.astro';
---

<Layout title="...">
  <main>
    <MinhaSeccao />
  </main>
</Layout>
```

### Modificar Open Graph

Edite `src/layouts/Layout.astro`:

```astro
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={`${siteUrl}${ogImage}`} />
```

Ou passe props por página:

```astro
<Layout 
  title="Título custom"
  description="Descrição custom"
  ogImage="/custom-image.png"
>
```

### Adicionar novas rotas

Crie arquivo em `src/pages/nova-rota.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Minha Página">
  <main>
    <!-- conteúdo -->
  </main>
</Layout>
```

A rota será automaticamente `/nova-rota`

---

## Deploy

### Verificação pré-deploy

```bash
# 1. Build local
npm run build

# 2. Preview (simula produção)
npm run preview

# 3. Testar cloaking
node test-cloaking.js http://localhost:3000/ "facebookbot"
```

### Deploy no Vercel

#### Opção 1: Via CLI

```bash
# Instale Vercel CLI
npm install -g vercel

# Deploy
vercel

# Produração
vercel --prod
```

#### Opção 2: Via Git (recomendado)

```bash
# Commit suas mudanças
git add .
git commit -m "feat: nova funcionalidade"

# Push para main/master
git push origin main

# Vercel detecta e faz deploy automaticamente
```

#### Opção 3: Dashboard Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Vercel faz deploy automático a cada push

### Variáveis de Ambiente

Se precisar adicionar secrets (API keys, etc):

1. **Vercel Dashboard** → Seu Projeto
2. **Settings** → **Environment Variables**
3. Add `VITE_MEU_VAR=valor`

Acesse em código:
```javascript
const apiKey = import.meta.env.VITE_MEU_VAR;
```

---

## Troubleshooting

### ❌ Bots não estão sendo redirecionados

**Checklist:**

- [ ] Verificar se middleware.ts está compilando
  ```bash
  npm run build
  ```

- [ ] Testar via curl
  ```bash
  npm run preview
  curl -I -H "User-Agent: googlebot" http://localhost:3000/
  ```

- [ ] Verificar console do Vercel
  ```bash
  vercel logs
  ```

- [ ] Confirmar `output: 'server'` em `astro.config.mjs`

### ❌ Geolocalização não funciona

**Checklist:**

1. Abra DevTools (F12) → Console
2. Procure por logs `[CLOAK]`
3. Se nada aparecer:
   - Refresh a página (Ctrl+R)
   - Limpe cache: `localStorage.removeItem('__geo_check')`
   - Abra Console novamente

4. Verifique se GeoRedirect está no Layout:
   ```bash
   grep -r "GeoRedirect" src/
   ```

### ❌ Build falha no Vercel

**Solução:**

1. Verifique logs:
   ```bash
   vercel logs --follow
   ```

2. Limpe cache do Vercel:
   - Vercel Dashboard → Seu projeto
   - Settings → Deployments
   - Opção "Clear build cache"

3. Refaça deploy:
   ```bash
   git push origin main
   ```

### ❌ Erro de permissão em arquivos

Se build local falha com `EACCES`:

```bash
# Corrija permissões
chmod -R 755 public/
chmod -R 644 public/**/*

# Tente novamente
npm run build
```

### ❌ Cache de geolocalização está velho

Limpe localStorage no console:

```javascript
localStorage.removeItem('__geo_check');
location.reload();
```

---

## 🔧 Configuração Avançada

### Alterar URL de redirecionamento

**Servidor (para bots):**
```typescript
// src/middleware.ts
const REDIRECT_URL = 'sua-nova-url-aqui';
```

**Cliente (para geolocalização):**
```astro
<!-- src/components/GeoRedirect.astro -->
<script define:vars={{ redirectUrl: 'sua-nova-url-aqui' }}>
```

### Adicionar mais bots à detecção

```typescript
// src/middleware.ts
const botPatterns = [
  // ... padrões existentes
  'meu-novo-bot', // adicione aqui
];
```

### Modificar tempo de cache (geolocalização)

```javascript
// src/components/GeoRedirect.astro
// 24 horas em ms
if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
  // mude este valor
}
```

---

## 📊 Monitoramento

### Verificar performance

```bash
# Lighthouse via CLI
npm install -g @lhci/cli@latest

# Rodar análise
lhci autorun
```

### Logs no Vercel

```bash
# Seguir logs em tempo real
vercel logs --follow

# Apenas erros
vercel logs --follow | grep -i error

# Com filtro
vercel logs --follow | grep "CLOAK"
```

---

## 📞 Suporte

Para problemas:

1. Consulte [DEBUG-CLOAKING.md](./DEBUG-CLOAKING.md) para issues de cloaking
2. Verifique [Astro Docs](https://docs.astro.build)
3. Confira [Vercel Docs](https://vercel.com/docs)

---

**Última atualização:** Março 2026

**Versão:** 1.0.0
