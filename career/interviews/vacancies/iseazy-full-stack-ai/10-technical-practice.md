# isEazy — treino técnico prático

Use como entrevista simulada de Full Stack / IA. Cada pergunta tem uma resposta falada. **Experiência real** significa fato registrado; **Simulação** significa raciocínio para um exercício, não experiência para alegar. A vaga cita NestJS, MongoDB, Temporal, AWS e Bedrock/Vertex; a experiência registrada não comprova uso profissional dessas tecnologias.

## 1. NestJS e desenho de API

### Você precisa implementar `POST /workflows` em NestJS. Como organizaria controller, validação e regra?

**Resposta — simulação:** “Eu deixaria o controller responsável pelo transporte: validar DTO, autenticação e formato, depois chamar um caso de uso. A regra de criação ficaria em um serviço/caso de uso sem depender de HTTP; repositórios encapsulariam persistência. Eu definiria respostas para erro de validação, conflito e falha interna sem vazar detalhe. Testaria controller/DTO e regra separadamente, além de uma integração real com banco. Minha experiência transferível é TypeScript, APIs e separação de fronteiras; não afirmo experiência profissional com NestJS.”

### Um DTO usa `tenantId` enviado pelo browser. Basta validar que é UUID?

**Resposta:** “Não. O formato válido não torna o tenant autorizado. Eu obteria o tenant do contexto autenticado ou validaria membership/capacidade do usuário no servidor. O DTO pode aceitar um identificador para selecionar contexto, mas cada operação ainda precisa confirmar o acesso. Também testaria tentativa de usar o ID de outro tenant.”

## 2. MongoDB e consistência

### Como modelaria uma execução de workflow com etapas e histórico em MongoDB?

**Resposta — simulação:** “Começaria pelas consultas: carregar execução atual, listar histórico por workflow/tenant e procurar execuções pendentes por estado/horário. Manteria o documento principal com estado atual e metadados compactos; histórico crescente poderia ficar em coleção separada para evitar documento sem limite. Usaria tenant e workflow nos filtros e índices conforme consultas reais, com versionamento de esquema. Transições concorrentes exigiriam compare-and-set/version field ou transação quando apropriado. Minha experiência comprovada é SQL/PostgreSQL; MongoDB é uma lacuna direta, então validaria os trade-offs com a carga e a versão adotada.”

### Quando embutir documentos e quando usar referências?

**Resposta:** “Embutiria dado pequeno que é lido junto e tem ciclo de vida contido. Separaria quando cresce sem limite, é consultado independentemente ou tem escrita concorrente por vários fluxos. Evitaria copiar dados mutáveis sem uma estratégia de consistência. Antes de decidir, listaria as consultas críticas e estimaria cardinalidade e tamanho.”

## 3. Temporal e workflows duráveis

### Uma atividade de cobrança expirou por timeout. Como evitar cobrança duplicada no retry?

**Resposta — simulação:** “O workflow pode repetir uma atividade, então eu não presumiria execução exatamente uma vez. A atividade enviaria uma chave de idempotência estável ao provedor, persistiria a referência e reconciliaria estado desconhecido antes de cobrar de novo. Separaria timeout de falha definitiva e modelaria compensação se a etapa seguinte falhar. Também instrumentaria tentativas e estado. Não tenho experiência direta com Temporal; é como desenharia o problema de workflow durável.”

### O que precisa ser determinístico no código de workflow?

**Resposta:** “O código que o motor reexecuta precisa produzir a mesma sequência de decisões a partir do mesmo histórico. Chamadas de rede, relógio aleatório e efeitos externos ficam em atividades; decisões usam APIs determinísticas do motor. Eu versionaria mudanças incompatíveis para execuções já abertas e testaria replay/compatibilidade. Confirmaria detalhes com a versão de Temporal usada pelo time.”

## 4. LLM, prompts e avaliações

### Como construir uma avaliação inicial para um agente que classifica documentos?

**Resposta — experiência real + aplicação:** “Primeiro definiria o que conta como classificação correta e o custo de cada erro, depois montaria um conjunto de exemplos representativos com rótulo revisado e casos difíceis. Avaliaria por classe, matriz de confusão e consistência do formato, não só por média. Separaria versões de prompt/contexto/modelo, registraria custo e latência e bloquearia regressões críticas. No trabalho com harnesses, usei especificações e verificações determinísticas com limites de custo/escopo; para classificação, esse conjunto e essas métricas seriam a implementação proposta, não um resultado já medido.”

### A resposta precisa ser JSON válido. Prompt basta?

**Resposta:** “Não. Usaria saída estruturada/API de schema quando disponível, validaria do lado da aplicação e teria tratamento explícito para campos ausentes ou inválidos. Se não passar, aplicaria retry limitado ou fallback, sem aceitar texto arbitrário como se fosse objeto confiável. Guardaria a resposta bruta com controles de privacidade adequados para debugging e não executaria ações críticas sem validação de domínio.”

### Como versionaria prompt sem perder rastreabilidade?

**Resposta — simulação:** “Versionaria instruções, contexto recuperado, schema de saída e modelo/configuração como uma unidade identificável. Cada execução registraria versão, resultado da validação, latência e custo; não incluiria PII sem necessidade. Mudança teria conjunto de regressão e possibilidade de rollback. No meu trabalho real, harnesses estruturavam contexto e especificação e tinham checks determinísticos; esse mecanismo de versionamento é a proposta de treino.”

### Um modelo melhorou a média, mas falha mais em documentos raros. O que faria?

**Resposta:** “Não liberaria com base só na média. Separaria desempenho por classe e severidade, revisaria exemplos raros, acrescentaria casos ao conjunto de regressão e decidiria com produto qual erro é aceitável. Poderia usar rota de revisão humana ou fallback para casos de baixa confiança. Comunicaria a troca entre qualidade, custo e latência.”

## 5. AWS, segurança e operação

### Como projetaria uma chamada a Bedrock com timeout e limite de custo?

**Resposta — simulação:** “Colocaria a chamada atrás de um serviço com timeout explícito, limite de tamanho de entrada, modelo permitido e orçamento por operação/tenant. Registraria latência e custo sem guardar conteúdo sensível. Retry apenas em erros transitórios e com limite; não faria retry de validação ou de resposta inválida sem controle. Credenciais e permissões ficariam no mecanismo da plataforma, com menor privilégio. Tenho atuação hands-on confirmada com AWS/Azure na MSPA, mas a evidência disponível não detalha um serviço AWS específico nem Bedrock; eu explicaria essa diferença com precisão.”

### Como sua experiência de borda ajuda num desenho AWS?

**Resposta — experiência real:** “Na MSPA contribuí com serviços de borda usando Cloudflare Workers, KV, D1 e Durable Objects para uma solução leve de consentimento e configuração. Isso me deu experiência em pensar latência, estado, contratos e comportamento de navegador em uma arquitetura distribuída. Os serviços AWS têm modelos e limites próprios, então eu não faria equivalência automática; começaria pelos requisitos e estudaria a plataforma do time.”

### Um agente pode executar ação destrutiva. Quais guardrails colocaria?

**Resposta:** “Separaria recomendação de execução. O agente não receberia credenciais amplas; ferramentas teriam escopo mínimo, validação server-side e lista explícita de operações. Ações de alto impacto exigiriam confirmação ou revisão humana, com idempotência, trilha de auditoria e limite de taxa. Também testaria prompt injection em conteúdo externo e garantiria que texto recuperado não vira instrução privilegiada.”

## 6. SDD, TypeScript e testes

### Como você transforma uma especificação vaga em implementação testável?

**Resposta — experiência real:** “Eu escrevo o comportamento observável, atores, limites e casos de erro antes de escolher detalhe interno. Para uma regra de workflow, por exemplo, listaria transições permitidas, quem pode executá-las e o efeito persistido. Depois criaria testes de aceitação para os fluxos e testes menores para validação. Uso especificações estruturadas e checks determinísticos em harnesses de IA e no desenvolvimento; não trato o documento como substituto de revisão do código.”

### Como testar concorrência ao iniciar duas vezes o mesmo workflow?

**Resposta — simulação:** “Dispararia duas requisições em paralelo com a mesma chave de negócio, verificaria que só existe uma execução ativa e que ambas recebem uma resposta coerente. A proteção precisa estar no banco/lock transacional ou no motor, não só num `if` em memória. Repetiria com timeout após commit para testar retry e observaria notificações duplicadas.”

### Quando um teste de unidade é insuficiente?

**Resposta:** “Quando o risco está na interação com banco, fila, autorização do framework ou contrato externo. Unidade prova regra isolada; integração prova composição com dependência real; contrato verifica formato/compatibilidade; ponta a ponta cobre jornada crítica. Eu escolheria pela falha que quero detectar, evitando uma suíte enorme de E2E lenta e frágil.”

## Perguntas de aprofundamento para o entrevistador

- “Qual parte do agente já está em produção e qual ainda é experimento?”
- “Como vocês versionam workflows longos que já estão em execução?”
- “Quais classes de erro exigem aprovação humana?”
- “Como medem custo e qualidade por tenant sem guardar conteúdo sensível?”
- “Qual é a divisão atual entre aplicação NestJS e atividades duráveis?”
