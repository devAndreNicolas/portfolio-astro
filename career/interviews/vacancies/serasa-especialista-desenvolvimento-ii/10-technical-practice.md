# Serasa Experian — treino técnico prático

Perguntas de entrevista técnica para SDK web, navegador, segurança e integridade. **Experiência real** usa fatos registrados do Trust Center/MSPA. Perguntas marcadas **Simulação** são exercícios, não alegações de que você trabalhou com antifraude, WebAuthn, biometria ou device fingerprinting.

## 1. SDK embutido em sites de clientes

### Um SDK precisa funcionar em páginas React, Angular e sites sem framework. Como reduzir conflitos?

**Resposta — ligada ao Trust Center:** “Eu definiria um ponto de entrada pequeno e um contrato de inicialização estável. Para UI, Web Components permitem integração sem obrigar o cliente a usar nosso framework; Shadow DOM ajuda a isolar estilos internos. Manteria CSS e dependências encapsulados, evitaria variáveis globais e documentaria eventos, atributos e compatibilidade. Ainda testaria em páginas hospedeiras reais: o isolamento visual não impede conflito de JavaScript, ordem de carregamento ou comportamento de foco. No Trust Center, usamos Lit/Web Components/Shadow DOM justamente para uma UI de consentimento framework-agnostic.”

### Como faria upgrade sem quebrar integrações antigas?

**Resposta — simulação:** “Versionaria o contrato público e identificaria mudanças aditivas versus incompatíveis. Evitaria depender de detalhes internos do DOM e manteria uma janela de compatibilidade documentada. Testaria a versão nova contra páginas fixture com os frameworks e versões suportadas. Para mudança incompatível, publicaria migração e telemetria de versão, com estratégia de rollback. É desenho proposto; não afirmo ter mantido um SDK público versionado.”

## 2. Segurança client-side e carregamento de scripts

### Como prova que um script de terceiro não carregou antes do consentimento?

**Resposta — experiência real:** “Eu abriria uma sessão limpa, capturaria a rede desde o primeiro documento e verificaria cookies/storage. Antes da escolha, os requests opcionais não devem existir. Depois de aceitar uma categoria, só os scripts autorizados devem aparecer; ao rejeitar, nenhum deles. Repetiria após reload e mudança de preferência, olhando ordem de execução e eventos de auditoria. No Trust Center, verificávamos esse comportamento com DevTools e snapshots em nossos próprios sites. Não confundo um banner visível com bloqueio efetivo.”

### Um script carregou antes de o banner aparecer. Como investigaria?

**Resposta:** “Eu olharia a ordem real de execução no waterfall, quem injeta o script e se ele vem de tag manager, HTML do cliente, preload ou dependência. Verificaria CSP e pontos de entrada do SDK, porque um banner que inicia tarde não consegue desfazer uma chamada já feita. A correção pode exigir mudar instalação do script, bloquear por padrão e documentar tags que o host precisa remover. Repetiria o teste em cache limpo e com navegação lenta.”

### CSP resolve XSS?

**Resposta:** “CSP é uma camada que limita origens e tipos de execução permitidos; não substitui escaping, sanitização correta, codificação contextual, revisão de dependências ou controle de inline scripts. Uma política permissiva pode dar falsa segurança. Eu começaria em report-only para observar violações, reduziria permissões gradualmente e testaria os fluxos legítimos. Não usaria CSP como justificativa para inserir conteúdo não confiável.”

### Diferencie CORS e CSRF numa resposta curta.

**Resposta:** “CORS é uma política do navegador sobre quais origens podem ler respostas de uma API; não é autenticação nem impede todos os requests cross-origin. CSRF explora credenciais que o browser envia automaticamente para induzir uma ação. SameSite, tokens anti-CSRF, validação de origem e desenho de autenticação ajudam conforme o caso. Eu verificaria o modelo de sessão em vez de aplicar uma configuração genérica.”

## 3. Antifraude e integridade

### Um cliente pede fingerprinting invasivo para reduzir fraude. Como avaliaria?

**Resposta — simulação, sem alegar experiência direta:** “Eu perguntaria qual ameaça e qual decisão o sinal deve melhorar, qual base legal e política de retenção se aplicam, e quais falsos positivos são aceitáveis. Compararia sinais menos invasivos, avaliaria viés por dispositivo/rede e garantiria que a decisão não dependa de um único atributo manipulável. O servidor tomaria a decisão final; o browser pode fornecer sinais, mas é controlado pelo usuário. Minha experiência próxima é privacidade/consentimento e integridade de dados, não implementação de device fingerprinting.”

### Como evitar que um cliente altere o resultado antifraude no DevTools?

**Resposta:** “Qualquer decisão sensível precisa ser recalculada ou validada no servidor. O cliente não deve enviar um `isSafe: true` como autoridade. Eu assinaria ou verificaria dados quando houver um protocolo apropriado, limitaria validade de tokens e registraria a decisão no backend. Ofuscação e minificação não são controles de segurança.”

### Qual seria a diferença entre criptografia, assinatura e hash?

**Resposta:** “Criptografia busca confidencialidade e precisa de gestão de chaves; assinatura permite verificar autenticidade e integridade com chave privada/pública; hash é resumo unidirecional e sozinho não prova quem produziu o dado. Para senha, usaríamos função de derivação de senha com salt, não hash rápido genérico. Eu escolheria o mecanismo conforme ameaça e não inventaria criptografia própria.”

## 4. Telemetria e dados

### Como instrumentar um SDK sem coletar dados pessoais desnecessários?

**Resposta — experiência real + desenho:** “Definiria eventos voltados à operação: versão do SDK, etapa, resultado e latência; evitaria conteúdo de formulário, identificadores diretos ou URLs com query sensível. Aplicaria minimização, retenção e acesso limitado, e validaria se a telemetria funciona mesmo com políticas de consentimento adequadas. Na MSPA, trabalhei com eventos de auditoria e com eventos/funis de produto; para o SDK, eu documentaria exatamente quais campos saem e testaria a coleta.”

### Como investigaria queda na taxa de inicialização após release?

**Resposta:** “Segmentaria por versão, navegador, framework hospedeiro, região e etapa de inicialização; verificaria mudanças de CSP, erro de download, exceção JS e timeout de dependência. Compararia a implantação e faria rollback se o impacto justificar. Precisaria evitar colocar identificadores pessoais nos eventos. Criaria um teste de compatibilidade reproduzível para o ambiente afetado.”

## 5. Performance e compatibilidade

### Como manter um SDK pequeno e rápido sem esconder funcionalidade importante?

**Resposta — ligada à experiência de borda:** “Eu mediria tamanho transferido e tempo até a UI estar pronta, dividiria código opcional e evitaria bloquear a thread principal. A inicialização precisa ser resiliente: falha de telemetria não pode quebrar a página cliente. No Trust Center, a escolha por componentes leves e execução na borda veio da necessidade de integração rápida e controle de configuração. Eu mediria em dispositivos e redes representativas antes de afirmar ganho.”

### Como testa Shadow DOM, foco e acessibilidade?

**Resposta:** “Testaria navegação por teclado, ordem de foco, leitor de tela, contraste e comportamento do diálogo, além de eventos emitidos pelo componente. O Shadow DOM muda o limite de seleção e a propagação de eventos, então validaria retargeting e integração com o host. Também rodaria testes em navegadores suportados e verificaria estados em que o banner abre, fecha e reabre.”

## 6. Perguntas de system design

### Desenhe um SDK de decisão de risco que precisa de resposta rápida e auditoria.

**Resposta — simulação:** “Separaria coleta mínima no cliente, endpoint de avaliação e serviço de política. O backend validaria sessão, integridade dos campos e limites; uma regra síncrona rápida produziria decisão e motivo auditável, enquanto sinais mais caros poderiam ser assíncronos. Definiria timeout e fallback por tipo de operação, sem transformar indisponibilidade em aprovação automática. Guardaria decisão, versão de regra/modelo e sinais permitidos com retenção controlada. Precisaria esclarecer latência alvo, volume, falsos positivos e requisitos legais antes de escolher armazenamento.”

### Como impedir replays de uma requisição legítima?

**Resposta — simulação:** “Usaria nonce ou identificador de operação ligado à sessão e validade curta, guardado/consumido atomicamente no servidor. Uma assinatura pode proteger integridade do payload quando o protocolo e a gestão de chaves sustentam isso, mas não impede replay sozinha sem nonce/expiração. Também aplicaria idempotência ao efeito de negócio e monitoraria repetição anômala. Não diria que um token no frontend torna o cliente confiável.”

### O que você faria se um SDK antigo mantivesse uma vulnerabilidade sem upgrade imediato dos clientes?

**Resposta:** “Primeiro caracterizaria a vulnerabilidade e a exposição por versão, sem divulgar detalhes exploráveis desnecessariamente. Prepararia versão corrigida, mitigação temporária e instruções claras para clientes; se possível, bloquearia comportamento remoto inseguro com cuidado para não quebrar o produto. Acompanharia adoção e ofereceria suporte a migração. Para uma falha ativa, seguiria o processo de resposta a incidente e coordenação de segurança.”

## Perguntas de aprofundamento para o entrevistador

- “O SDK é carregado diretamente pelo cliente ou por uma tag manager?”
- “Quais navegadores e versões fazem parte do suporte formal?”
- “Como vocês medem falsos positivos e custo de fricção para o usuário?”
- “Quais dados o SDK pode coletar e quais são as regras de retenção?”
- “Qual é a divisão entre regras client-side para UX e decisão server-side?”
