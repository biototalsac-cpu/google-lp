#!/usr/bin/env node

/**
 * Script para testar o cloaking (detecção de bots e geolocalização)
 * 
 * Uso:
 *   node test-cloaking.js [URL] [User-Agent]
 * 
 * Exemplos:
 *   node test-cloaking.js https://localhost:3000/ "Mozilla/5.0 (compatible; Googlebot/2.1)"
 *   node test-cloaking.js https://www.biototalnatural.com.br/ "facebookexternalhit"
 */

const https = require('https');
const http = require('http');

const testUrl = process.argv[2] || 'http://localhost:3000/';
const testUA = process.argv[3] || 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

// Bots para testar
const botsToTest = [
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  'Mozilla/5.0 (compatible; Twitterbot/1.0)',
  'whatsapp',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', // Normal browser
];

async function testCloaking(url, userAgent) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname || '/',
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html',
      },
      redirect: 'manual', // Manual redirect handling
      timeout: 5000,
    };

    const req = protocol.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          location: res.headers.location,
          isRedirected: res.statusCode >= 300 && res.statusCode < 400,
          dataLength: data.length,
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Iniciando testes de cloaking...\n');
  console.log(`🎯 URL: ${testUrl}`);
  console.log(`📝 User-Agents a testar: ${botsToTest.length}\n`);
  console.log('═'.repeat(80));

  for (let i = 0; i < botsToTest.length; i++) {
    const ua = botsToTest[i];
    const isBot = ua.includes('bot') || ua.includes('facebook') || ua.includes('twitter') || ua.includes('whatsapp') || ua.includes('crawler') || ua.includes('spider');

    try {
      process.stdout.write(`\n[${i + 1}/${botsToTest.length}] Testando: ${ua.substring(0, 60)}...`);
      
      const result = await testCloaking(testUrl, ua);

      if (result.isRedirected) {
        console.log(`\n  ✅ Status: ${result.status} (Redirecionado)`);
        console.log(`  📍 Vai para: ${result.location}`);
        if (isBot) {
          console.log(`  ✓ CORRETO - Bot foi redirecionado`);
        } else {
          console.log(`  ⚠️ AVISO - Usuário normal foi redirecionado`);
        }
      } else {
        console.log(`\n  ✅ Status: ${result.status} (Não redirecionado)`);
        console.log(`  📄 Tamanho resposta: ${result.dataLength} bytes`);
        if (isBot) {
          console.log(`  ❌ ERRO - Bot deveria ter sido redirecionado`);
        } else {
          console.log(`  ✓ CORRETO - Usuário normal foi permitido`);
        }
      }

      console.log('─'.repeat(80));
    } catch (error) {
      console.log(`\n  ❌ Erro: ${error.message}`);
      console.log('─'.repeat(80));
    }
  }

  console.log('\n✨ Testes concluídos!');
}

runTests().catch(console.error);
