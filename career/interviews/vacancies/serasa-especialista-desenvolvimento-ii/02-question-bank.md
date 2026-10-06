# Perguntas prováveis

## Como protegeria dados capturados no cliente?

“Eu trataria o cliente como uma superfície não confiável. Validaria entradas, reduziria dados coletados, protegeria o transporte, aplicaria autorização no backend e registraria apenas eventos necessários para auditoria. Também definiria testes para adulteração, falhas de rede, replay e comportamento inesperado.”

## Qual sua experiência com segurança web?

“Minha experiência mais direta é em privacidade, consentimento e integridade de fluxos. Trabalhei em uma solução que precisava bloquear scripts antes do consentimento e gerar eventos auditáveis, usando Web Components, Shadow DOM e Cloudflare. Para OWASP específico, eu separaria o que já implementei do que estudaria no contexto da plataforma.”

## Como investigaria um problema de compatibilidade?

“Reproduziria por navegador, dispositivo e versão, isolaria a etapa do fluxo, compararia logs e telemetria e verificaria se o problema está no cliente, contrato ou serviço. Depois criaria um caso automatizado ou uma matriz de compatibilidade para evitar regressão.”

## Como influencia decisões técnicas?

“Levo contexto, risco e alternativas, especialmente quando segurança e experiência entram em tensão. No Trust Center, a decisão robusta foi priorizar o bloqueio correto antes do consentimento, porque esse era o requisito de confiança do produto.”
