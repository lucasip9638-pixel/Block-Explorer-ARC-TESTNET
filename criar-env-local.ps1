# Script para criar o arquivo .env.local
# Execute este script no PowerShell: .\criar-env-local.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuração do .env.local" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verifica se o arquivo já existe
if (Test-Path .env.local) {
    Write-Host "⚠️  O arquivo .env.local já existe!" -ForegroundColor Yellow
    $resposta = Read-Host "Deseja sobrescrever? (s/N)"
    if ($resposta -ne "s" -and $resposta -ne "S") {
        Write-Host "Operação cancelada." -ForegroundColor Yellow
        exit
    }
}

Write-Host "📝 Para obter sua API key:" -ForegroundColor Green
Write-Host "   1. Acesse: https://platform.openai.com/api-keys" -ForegroundColor White
Write-Host "   2. Faça login ou crie uma conta" -ForegroundColor White
Write-Host "   3. Clique em 'Create new secret key'" -ForegroundColor White
Write-Host "   4. Copie a chave (começa com 'sk-')" -ForegroundColor White
Write-Host ""

$apiKey = Read-Host "Cole sua API key do OpenAI aqui"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host "❌ API key não fornecida. Operação cancelada." -ForegroundColor Red
    exit
}

if (-not $apiKey.StartsWith("sk-")) {
    Write-Host "⚠️  Aviso: A API key geralmente começa com 'sk-'. Tem certeza que está correta?" -ForegroundColor Yellow
    $confirmacao = Read-Host "Continuar mesmo assim? (s/N)"
    if ($confirmacao -ne "s" -and $confirmacao -ne "S") {
        Write-Host "Operação cancelada." -ForegroundColor Yellow
        exit
    }
}

# Cria o conteúdo do arquivo
$conteudo = @"
# OpenAI API Key
# Obtenha sua chave em: https://platform.openai.com/api-keys
OPENAI_API_KEY=$apiKey
"@

# Escreve o arquivo
$conteudo | Out-File -FilePath .env.local -Encoding utf8 -NoNewline

Write-Host ""
Write-Host "✅ Arquivo .env.local criado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📌 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Reinicie o servidor (Ctrl+C e depois 'npm run dev')" -ForegroundColor White
Write-Host "   2. Teste o chat de IA" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Pronto! O chat agora usa ChatGPT completo!" -ForegroundColor Green





