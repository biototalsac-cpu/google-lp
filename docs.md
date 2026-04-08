# Documentação - Landing Page Óleo de Avestruz

## Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Instalação & Setup](#instalação--setup)
4. [Desenvolvimento](#desenvolvimento)
5. [Deploy](#deploy)
6. [Troubleshooting](#troubleshooting)

---

## Visão Geral

**Landing Page Óleo de Avestruz** é um site de vendas de suplementos 100% natural, construído com:

- **Astro 5** - Framework estático/server-side
- **React** - Componentes interativos
- **Tailwind CSS** - Estilos
- **Vercel** - Hosting & deploy

**Funcionalidades principais:**
- Landing page responsiva com múltiplas seções
- Página de produto dedicada com structured data
- Integração com WhatsApp
- Google Tag Manager (GTM)
- Open Graph metadata para redes sociais
- Conformidade com Google Merchant Center

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
│   │   └── ui/                 # Componentes reutilizáveis
│   │       ├── Button.astro
│   │       ├── Card.astro
│   │       └── Section.astro
│   ├── layouts/
│   │   └── Layout.astro        # Layout principal com meta tags
│   ├── pages/
│   │   ├── index.astro         # Página home
│   │   ├── produto/
│   │   │   └── oleo-avestruz.astro  # Página do produto
│   │   ├── aviso-legal.astro
│   │   ├── politica-de-privacidade.astro
│   │   ├── termos-de-uso.astro
│   │   ├── trocas-e-devolucoes.astro
│   │   └── quem-somos.astro
│   ├── styles/
│   │   └── global.css
│   ├── assets/
│   │   └── images/
│   └── middleware.ts
├── public/
│   ├── avatars/
│   ├── thumbnails/
│   └── videos/
├── astro.config.mjs
├── tsconfig.json
├── vercel.json
└── package.json
```

---

## Instalação & Setup

### Pré-requisitos
- Node.js 18+ ou 20+
- npm ou yarn

### Instalação local

```bash
# 1. Instale dependências
npm install

# 2. Inicie desenvolvimento
npm run dev

# 3. Abra no navegador: http://localhost:4321
```

### Scripts disponíveis

```bash
npm run dev       # Inicia servidor de desenvolvimento
npm run build     # Build para produção
npm run preview   # Visualiza build localmente
```

---

## Desenvolvimento

### Adicionar nova seção

1. Crie componente em `src/components/sections/MinhaSeccao.astro`
2. Importe em `src/pages/index.astro`

### Modificar Open Graph

Edite `src/layouts/Layout.astro` ou passe props por página:

```astro
<Layout 
  title="Título custom"
  description="Descrição custom"
  ogImage="/custom-image.png"
>
```

---

## Deploy

### Deploy no Vercel

```bash
# Via Git (recomendado)
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
# Vercel detecta e faz deploy automaticamente
```

---

## Troubleshooting

### Build falha no Vercel

1. Verifique logs: `vercel logs --follow`
2. Limpe cache: Vercel Dashboard → Settings → Clear build cache
3. Refaça deploy: `git push origin main`

---

**Última atualização:** Abril 2026
