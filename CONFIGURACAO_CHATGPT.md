# 🤖 Configuração do Chat com ChatGPT

## 📋 Como Configurar

Para usar o chat de IA com o algoritmo do ChatGPT, você precisa configurar a API key do OpenAI.

### 1. Obter a API Key

1. Acesse: https://platform.openai.com/api-keys
2. Faça login ou crie uma conta
3. Clique em "Create new secret key"
4. Copie a chave gerada (ela começa com `sk-`)

### 2. Configurar no Projeto

1. Crie um arquivo `.env.local` na raiz do projeto (mesmo nível do `package.json`)
2. Adicione a seguinte linha:

```
OPENAI_API_KEY=sk-sua-chave-aqui
```

**⚠️ IMPORTANTE:**
- Nunca compartilhe sua API key
- Não faça commit do arquivo `.env.local` no Git
- O arquivo `.env.local` já está no `.gitignore`

### 3. Reiniciar o Servidor

Após adicionar a API key, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

## 💰 Custos

O chat usa o modelo `gpt-4o-mini` que é mais barato e rápido. Os custos são:
- Aproximadamente $0.15 por 1M tokens de entrada
- Aproximadamente $0.60 por 1M tokens de saída

Para uso moderado, os custos são muito baixos (alguns centavos por mês).

## 🔧 Modelos Disponíveis

Você pode alterar o modelo no arquivo `app/api/chat/route.ts`:

- `gpt-4o-mini` - Mais barato e rápido (recomendado)
- `gpt-4o` - Mais inteligente, mas mais caro
- `gpt-3.5-turbo` - Alternativa mais antiga

## ✅ Teste

Após configurar, teste o chat:
1. Abra o dApp
2. Clique no botão de IA no canto inferior direito
3. Digite uma pergunta
4. A IA deve responder usando o ChatGPT!

## 🐛 Problemas Comuns

### "OpenAI API key não configurada"
- Verifique se o arquivo `.env.local` existe
- Verifique se a variável está escrita corretamente: `OPENAI_API_KEY=`
- Reinicie o servidor após criar/editar o arquivo

### "Erro ao comunicar com a API do OpenAI"
- Verifique se sua API key está válida
- Verifique se você tem créditos na conta OpenAI
- Verifique sua conexão com a internet

### Chat não responde
- Abra o console do navegador (F12) para ver erros
- Verifique os logs do servidor
- Certifique-se de que a API key está correta





