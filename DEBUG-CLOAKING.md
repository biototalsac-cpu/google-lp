# 🔍 Guia de Debug - Cloaking (Bots + Geolocalização)

## Checklist rápido:

### 1. Bots devem ser redirecionados (Middleware)
- [ ] Bots são detectados no **servidor** (middleware.ts)
- [ ] Status code 301 (Moved Permanently)
- [ ] Redirecionam para G1 Globo automaticamente

### 2. Usuários fora do Brasil devem ser redirecionados (Cliente)
- [ ] Script GeoRedirect.astro está no `<head>` do Layout
- [ ] Script executa **ANTES** do GT```M e antes de renderizar a página
- [ ] Detecta IP via ipapi.co ou api.country.is
- [ ] Se não for BR, redireciona silenciosamente

---

## 🧪 Como testar:

### A. Testar redirecionamento de bots (no servidor)

```bash
# Terminal 1: inicie o servidor de preview
npm run build && npm run preview

# Terminal 2: execute os testes
node test-cloaking.js http://localhost:3000/ "Mozilla/5.0 (compatible; Googlebot/2.1)"
```

**Esperado**: Status 301, "Location: https://g1.globo.com/..."

### B. Testar com curl (simular bot do Facebook)

```bash
curl -I -H "User-Agent: facebookexternalhit/1.1" http://localhost:3000/
```

**Esperado**:
```
HTTP/1.1 301 Moved Permanently
Location: https://g1.globo.com/ro/rondonia/especial-publicitario/amazon-struthio/noticia/2022/08/08/suplemento-alimentar-combate-estresse-e-ansiedade.ghtml
```

### C. Verificar no navegador (dev tools)

1. Abra: http://localhost:3000/
2. F12 → Console
3. Procure por logs `[CLOAK]`:
   ```
   [CLOAK] 🤖 Bot detectado: ...
   [CLOAK] 🔍 Detectando geolocalização...
   [CLOAK] 📍 País detectado: BR ✅
   ```

### D. Simular IP fora do Brasil

A detecção acontece via `ipapi.co` ou `api.country.is`. Essas APIs detectam seu IP real.

Para testar se está funcionando:
1. Abra DevTools → Console
2. Procure por: `[CLOAK] 📍 País detectado:`
3. Se for BR: ✅ Site carrega
4. Se não for BR: Deve redirecionar em 1-3 segundos

---

## 🐛 Problemas comuns:

### ❌ Bots não redirecionam
- Verifique se middleware.ts está correto
- Confirme que `output: 'server'` no astro.config.mjs
- Logs: `npm run build` deve compilar sem erros

### ❌ Script geo não executa
- Verifique se GeoRedirect está importado no Layout.astro
- Verifique no DevTools se script está no HTML renderizado
- Console deve mostrar `[CLOAK]` logs

### ❌ Erro de CORS nas APIs
- ipapi.co e api.country.is permitem requisições CORS
- Se falhar, há fallback (permitindo acesso)

### ❌ Redirecionamento lento
- Geolocalização pode levar 1-3s
- Há cache de 24h via localStorage

---

## 📊 Fluxo esperado:

```
Requisição
  ↓
[Middleware detecta bot?]
  ├─ SIM → 301 redirect para G1 ✅
  └─ NÃO → continua
      ↓
  [Cliente carrega]
    ↓
  [GeoRedirect.astro executa script]
    ↓
  [Detecta país via ipapi.co]
    ├─ BR → Site carrega normalmente ✅
    └─ Não BR → redireciona para G1 ✅
```

---

## 🚀 Deploy no Vercel:

Aconfiguração já está pronta:
- ✅ `output: 'server'`
- ✅ `adapter: vercel({ edgeMiddleware: true })`
- ✅ Middleware em `src/middleware.ts`

Apenas faça push para main/master que o Vercel buildará automaticamente!

```bash
git add .
git commit -m "chore: improve cloaking detection"
git push origin main
```

---

## 💡 Dicas:

1. **Logs são amigos**: Abra DevTools → Console e procure por `[CLOAK]`
2. **Cache localStorage**: Limpe com `localStorage.removeItem('__geo_check')` no console
3. **Teste múltiplos IPs**: Use VPN para simular IPs de diferentes países
4. **Monitor**: Verifique logs do Vercel: `vercel logs`

---

Pronto! Se tiver problemas, os logs no console vão te dizer exatamente qual etapa falhou. 🎯
