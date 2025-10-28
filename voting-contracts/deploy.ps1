# Script de Deploy para Windows PowerShell
# Este script carrega as variáveis do arquivo .env e executa o deploy

Write-Host "🚀 Iniciando deploy do contrato Voting..." -ForegroundColor Cyan

# Verificar se o arquivo .env existe
if (-not (Test-Path ".env")) {
    Write-Host "❌ Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host "📝 Crie um arquivo .env baseado no env-template.txt" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Passos:" -ForegroundColor Yellow
    Write-Host "1. Copie env-template.txt para .env" -ForegroundColor Yellow
    Write-Host "2. Edite .env com suas configurações reais" -ForegroundColor Yellow
    Write-Host "3. Execute este script novamente" -ForegroundColor Yellow
    exit 1
}

# Carregar variáveis de ambiente do arquivo .env
Write-Host "📋 Carregando variáveis de ambiente..." -ForegroundColor Yellow
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$' -and -not $_.StartsWith('#')) {
        $varName = $matches[1].Trim()
        $varValue = $matches[2].Trim()
        [System.Environment]::SetEnvironmentVariable($varName, $varValue, 'Process')
        Write-Host "  ✓ $varName carregada" -ForegroundColor Green
    }
}

# Verificar se as variáveis foram carregadas
$sepoliaRpc = [System.Environment]::GetEnvironmentVariable('SEPOLIA_RPC_URL', 'Process')
$privateKey = [System.Environment]::GetEnvironmentVariable('PRIVATE_KEY', 'Process')

if ([string]::IsNullOrEmpty($sepoliaRpc) -or $sepoliaRpc -eq 'https://eth-sepolia.g.alchemy.com/v2/SEU_API_KEY_AQUI') {
    Write-Host "❌ SEPOLIA_RPC_URL não está configurada corretamente!" -ForegroundColor Red
    Write-Host "📝 Edite o arquivo .env e adicione sua URL RPC da Sepolia" -ForegroundColor Yellow
    exit 1
}

if ([string]::IsNullOrEmpty($privateKey) -or $privateKey -eq 'sua_chave_privada_aqui_sem_0x') {
    Write-Host "❌ PRIVATE_KEY não está configurada corretamente!" -ForegroundColor Red
    Write-Host "📝 Edite o arquivo .env e adicione sua chave privada" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🔨 Compilando contratos..." -ForegroundColor Cyan
forge build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro na compilação!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Compilação concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Executando deploy na Sepolia..." -ForegroundColor Cyan
Write-Host ""

# Executar deploy
forge script script/Deploy.s.sol:DeployVoting --rpc-url $sepoliaRpc --broadcast -vvv

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
    Write-Host "1. Copie o endereço do contrato do output acima" -ForegroundColor White
    Write-Host "2. Atualize o arquivo lib/contract-config.ts no frontend" -ForegroundColor White
    Write-Host "3. Execute o comando abaixo para copiar o ABI:" -ForegroundColor White
    Write-Host ""
    Write-Host "   Get-Content out/Voting.sol/Voting.json | ConvertFrom-Json | Select-Object -ExpandProperty abi | ConvertTo-Json -Depth 100 | Out-File ../abi.json -Encoding utf8" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Erro no deploy!" -ForegroundColor Red
    Write-Host "Verifique as mensagens de erro acima" -ForegroundColor Yellow
}

