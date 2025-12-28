import { NextRequest, NextResponse } from "next/server"

// Função de fallback quando não há API key configurada
function generateFallbackResponse(messages: any[]): string {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ""
  const allMessages = messages.map((m) => m.content.toLowerCase()).join(" ")

  // Respostas inteligentes baseadas no contexto
  if (lastMessage.includes("mercado") || lastMessage.includes("financeiro") || lastMessage.includes("investimento")) {
    return `O mercado financeiro está em constante evolução! 📈\n\n**Principais conceitos:**\n• **Diversificação**: Espalhe seus investimentos entre diferentes ativos\n• **Análise Fundamental**: Estude os fundamentos antes de investir\n• **Gestão de Risco**: Nunca invista mais do que pode perder\n• **DeFi**: Protocolos descentralizados oferecem novas oportunidades\n\n**Na ARC Testnet**, você pode testar estratégias sem risco real. Quer saber mais sobre algum conceito específico?\n\n💡 **Dica**: Para respostas ainda mais inteligentes, configure a API key do OpenAI no arquivo .env.local`
  }

  if (lastMessage.includes("cripto") || lastMessage.includes("bitcoin") || lastMessage.includes("ethereum") || lastMessage.includes("usdc")) {
    return `Criptomoedas são fascinantes! 💰\n\n**Principais:**\n• **Bitcoin (BTC)**: "Ouro digital", reserva de valor\n• **Ethereum (ETH)**: Plataforma para smart contracts e DeFi\n• **Stablecoins (USDC)**: Moedas estáveis vinculadas ao dólar\n\n**Na ARC Testnet**, você pode testar DApps sem riscos. Explore ArcFlow, Curve, Synthra e outros DApps verificados!\n\n💡 **Dica**: Configure a API key do OpenAI para conversas mais detalhadas`
  }

  if (lastMessage.includes("defi") || lastMessage.includes("swap") || lastMessage.includes("liquidez") || lastMessage.includes("pool")) {
    return `DeFi (Finanças Descentralizadas) é revolucionário! 🚀\n\n**Conceitos:**\n• **DEX**: Troque tokens sem intermediários\n• **Liquidity Pools**: Forneça liquidez e ganhe taxas\n• **Yield Farming**: Otimize retornos através de protocolos\n• **Bridges**: Transfira ativos entre blockchains\n\n**Na ARC Testnet**, experimente DApps como ArcFlow, Curve e Synthra sem risco!\n\n💡 **Dica**: Para respostas mais personalizadas, adicione sua API key do OpenAI`
  }

  if (lastMessage.includes("arc") || lastMessage.includes("testnet") || lastMessage.includes("dapp")) {
    return `ARC Testnet é incrível! 🌐\n\n**Recursos:**\n• **15+ DApps Verificados**: Explore aplicações descentralizadas\n• **Faucets**: Obtenha tokens de teste gratuitos\n• **Bridges**: Transfira tokens entre redes\n• **NFTs**: Crie e explore coleções\n• **Domínios**: Registre domínios Web3\n\n**DApps populares:**\n• ArcFlow (DEX)\n• Curve (Swaps)\n• Superbridge (Bridge)\n• OnChainGM (NFT)\n• ZNS Connect (Domínios)\n\n💡 **Dica**: Configure a API key do OpenAI para conversas mais detalhadas sobre cada DApp`
  }

  if (lastMessage.includes("ajuda") || lastMessage.includes("help") || lastMessage.includes("como")) {
    return `Posso ajudar com:\n\n📊 **Mercado Financeiro**: Estratégias, conceitos, análises\n💰 **Criptomoedas**: Bitcoin, Ethereum, stablecoins\n🚀 **DeFi**: DEXs, pools, yield farming\n⛓️ **Blockchain**: Tecnologia, smart contracts\n🌐 **ARC Testnet**: DApps, ferramentas, desenvolvimento\n\n**Para respostas ainda mais inteligentes:**\n1. Acesse https://platform.openai.com/api-keys\n2. Crie uma API key\n3. Adicione no arquivo .env.local: OPENAI_API_KEY=sua-chave-aqui\n4. Reinicie o servidor\n\nFaça uma pergunta específica e eu te ajudo! 😊`
  }

  // Resposta padrão conversacional
  return `Interessante! 🤔 Posso ajudar com:\n\n• **Mercado financeiro** e investimentos\n• **Criptomoedas** (Bitcoin, Ethereum, USDC)\n• **DeFi** e protocolos descentralizados\n• **ARC Testnet** e seus DApps\n• **Trading** e estratégias\n• **Blockchain** e smart contracts\n\n**Exemplos de perguntas:**\n• "Como funciona yield farming?"\n• "O que é um DEX?"\n• "Como usar a ARC Testnet?"\n• "Quais os riscos do DeFi?"\n\n💡 **Dica**: Para conversas mais inteligentes e personalizadas, configure a API key do OpenAI no arquivo .env.local. Veja o arquivo CONFIGURACAO_CHATGPT.md para instruções detalhadas!`
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    // Verifica se a API key está configurada
    const apiKey = process.env.OPENAI_API_KEY

    // Se não houver API key, usa modo fallback inteligente
    if (!apiKey || apiKey === "sk-your-api-key-here") {
      return NextResponse.json({
        message: generateFallbackResponse(messages),
      })
    }

    // Prepara as mensagens para o formato do OpenAI
    const formattedMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Adiciona mensagem do sistema para contexto
    const systemMessage = {
      role: "system",
      content: `Você é um assistente especializado em mercado financeiro, criptomoedas, DeFi, blockchain e ARC Testnet. 
      Seja conversacional, útil e detalhado nas suas respostas. Responda em português brasileiro.
      Quando relevante, mencione os DApps da ARC Testnet como ArcFlow, Curve, Synthra, Superbridge, etc.
      Seja amigável e encoraje o usuário a fazer mais perguntas.`,
    }

    // Chama a API do OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Modelo mais barato e rápido, pode mudar para gpt-4 se quiser
        messages: [systemMessage, ...formattedMessages],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("OpenAI API Error:", errorData)
      return NextResponse.json(
        {
          error: "Erro ao comunicar com a API do OpenAI",
          details: errorData,
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      message: data.choices[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.",
    })
  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    )
  }
}

