# 🔑 Como Configurar a API Key do OpenAI

## ⚠️ Problema Atual

Você está vendo a mensagem: "OpenAI API key não configurada"

Isso significa que o chat está funcionando em **modo fallback** (respostas inteligentes básicas). Para usar o ChatGPT completo, siga os passos abaixo.

## 📝 Passo a Passo

### 1. Obter a API Key do OpenAI

1. Acesse: **https://platform.openai.com/api-keys**
2. Faça login ou crie uma conta (é grátis criar conta)
3. Clique em **"Create new secret key"**
4. Dê um nome (ex: "ARC Explorer Chat")
5. **Copie a chave** (ela começa com `sk-` e só aparece uma vez!)

### 2. Criar o Arquivo .env.local

1. Na raiz do projeto (mesma pasta do `package.json`)
2. Crie um arquivo chamado: **`.env.local`**
3. Adicione esta linha (substitua pela sua chave):

```
OPENAI_API_KEY=sk-sua-chave-real-aqui
```

**Exemplo:**
```
OPENAI_API_KEY=sk-proj-abc123xyz789...
```

### 3. Reiniciar o Servidor

Após criar/editar o arquivo `.env.local`:

1. **Pare o servidor** (Ctrl+C no terminal)
2. **Inicie novamente:**
   ```bash
   npm run dev
   ```

### 4. Testar

1. Abra o chat de IA
2. Digite uma mensagem
3. Agora deve funcionar com ChatGPT completo! 🎉

## ✅ Verificação

Se configurado corretamente:
- ✅ O chat responde com ChatGPT real
- ✅ Conversas mais inteligentes e contextuais
- ✅ Respostas personalizadas e detalhadas

Se ainda não funcionar:
- ❌ Verifique se o arquivo se chama exatamente `.env.local`
- ❌ Verifique se está na raiz do projeto
- ❌ Verifique se a chave está correta (começa com `sk-`)
- ❌ Reinicie o servidor após criar/editar o arquivo

## 💰 Custos

- O modelo usado (`gpt-4o-mini`) é muito barato
- Aproximadamente $0.15 por 1M tokens de entrada
- Para uso moderado: alguns centavos por mês
- Você pode definir um limite de gastos na conta OpenAI

## 🔒 Segurança

- ⚠️ **NUNCA** compartilhe sua API key
- ⚠️ **NUNCA** faça commit do arquivo `.env.local` no Git
- ✅ O arquivo já está no `.gitignore` (protegido)

## 🆘 Ainda com Problemas?

1. Verifique o console do navegador (F12) para erros
2. Verifique os logs do servidor no terminal
3. Certifique-se de que a API key está ativa na conta OpenAI
4. Verifique se você tem créditos na conta OpenAI

---

**Nota**: O chat funciona mesmo sem API key (modo fallback), mas com respostas mais básicas. Configure a API key para a melhor experiência!





