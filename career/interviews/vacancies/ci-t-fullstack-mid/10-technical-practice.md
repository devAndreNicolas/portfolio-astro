# CI&T — treino técnico prático

Perguntas no estilo pair programming/system design para Full Stack Java + Angular. **Experiência real** é explicitamente rotulada. A memória registra atuação hands-on com Java, Spring/Spring Boot e Azure na MSPA, mas não descreve tarefas concretas o bastante para atribuir ownership ou profundidade; não comprova SQL Server, Bamboo ou Angular 21. As perguntas de implementação abaixo são simuladas para praticar fundamentos e não atribuem uma entrega inventada.

## Angular e TypeScript

### Um formulário Angular salva e depois o usuário vê dados antigos. Onde você investigaria?

**Resposta — experiência real transferível:** “Eu seguiria o fluxo: evento do formulário, validação, chamada HTTP, resposta, atualização do estado e renderização. Conferiria se o componente mantém uma cópia local desatualizada, se o fluxo RxJS está sendo encerrado/reutilizado corretamente e se Signals/estado derivado está lendo a fonte certa. Verificaria também se o servidor confirmou a alteração. Criaria um teste para sucesso, erro e navegação rápida entre registros. Minha experiência de produção inclui Angular, TypeScript, Signals e RxJS; o diagnóstico específico depende do código.”

### Como evita subscription leak em Angular?

**Resposta:** “Prefiro APIs que completam com o ciclo de vida quando apropriado, como `async` pipe ou `takeUntilDestroyed`, e evito subscription manual se posso compor o observable. Para listeners e recursos externos, defino cleanup explícito. Testaria destruir/recriar o componente e confirmar que não há requisições ou callbacks duplicados.”

### Quando usar Signal e quando RxJS?

**Resposta:** “Signals são bons para estado síncrono e derivação local de UI; RxJS representa fluxos assíncronos, eventos, cancelamento e composição temporal. Não converteria tudo para um só modelo. Manteria uma fronteira clara e evitaria duas fontes de verdade. A escolha depende da versão Angular e convenções do projeto.”

### Como você lida com acessibilidade em componente reutilizável?

**Resposta — experiência real:** “Eu começo pelo padrão semântico correto, label associado, foco visível, operação por teclado e estados anunciados por tecnologia assistiva. Num componente compartilhado, o contrato precisa permitir nome acessível e mensagens de erro, sem exigir que cada consumidor descubra detalhes internos. Também valido com teclado e ferramentas de inspeção, porque um componente visualmente correto pode estar inacessível. Acessibilidade faz parte da minha experiência de entrega frontend.”

## Java e Spring — exercícios simulados

### Implemente um endpoint `POST /orders` em Spring. Como separaria as camadas?

**Resposta — simulação técnica, com experiência de stack:** “O controller recebe e valida o request, mapeia para um caso de uso e traduz o resultado para HTTP. O serviço aplica regra de negócio e transação; o repositório persiste através de uma interface. DTOs não seriam entidades de banco expostas diretamente. Eu escreveria testes unitários para regra e de integração para persistência/contrato. Tenho atuação hands-on com Java/Spring na MSPA, mas os exemplos concretos dessa memória não detalham uma rota Spring específica; então apresentaria o desenho como exercício e depois explicaria apenas o código que realmente toquei.”

### Uma transação grava o pedido, mas falha ao publicar mensagem. O que pode acontecer?

**Resposta — simulação:** “Se banco e broker não participarem da mesma transação distribuída, posso persistir sem publicar ou publicar sem persistir. Uma solução comum é outbox transacional: grava pedido e evento na mesma transação local, e um publicador entrega com retry/idempotência. O consumidor também precisa tolerar duplicatas. Eu escolheria isso se consistência entre estado e evento for requisito; para fluxo simples, avaliaria custo operacional.”

### Como evitar N+1 ao carregar pedidos com itens?

**Resposta:** “Primeiro confirmaria o padrão de consulta e o SQL gerado. Dependendo da cardinalidade, usaria fetch join/entity graph, projeção ou consulta em lote. Evitaria eager global, que pode multiplicar linhas e carregar dados demais. Testaria com volume realista e mediria queries, não escolheria só por estilo.”

### Como tratar concorrência ao reservar a última unidade?

**Resposta:** “A checagem e decremento precisam ser atômicos. Posso usar update condicional (`stock > 0`) e verificar linhas afetadas, ou lock/transação conforme a carga e o banco. Uma checagem separada seguida de update tem race condition. Testaria dois pedidos concorrentes contra uma unidade e garantiria que só um confirma.”

## REST, banco e arquitetura

### Uma rota aceita `PATCH /users/{id}`. Como impedir alteração de campo administrativo?

**Resposta:** “Não faria bind automático da entidade inteira. Definiria um DTO permitido para aquele contexto, validaria autorização no servidor e aplicaria somente campos editáveis. A resposta também evitaria expor campos internos. Testaria tentativa de incluir campo extra privilegiado e acesso a ID de outra pessoa.”

### Como desenharia paginação para uma lista que cresce?

**Resposta:** “Para listas pequenas e ordenação estável, offset pode bastar; em conjunto grande ou mutável, cursor/keyset costuma evitar custo e duplicações entre páginas. A ordenação precisa ter desempate único, e filtros precisam ser validados e indexados. Eu definiria limite máximo e incluiria cursor opaco sem confiar nele como autorização.”

### Como faria uma migração de banco sem indisponibilidade?

**Resposta — simulação:** “Aplicaria expand-and-contract: adicionar estrutura compatível, publicar código que lê/escreve de forma compatível, backfill em lotes, validar consistência e só então remover campo antigo numa etapa posterior. A migração deve ser idempotente e observável, com rollback possível para o código. Evitaria deploy que exige mudança destrutiva simultânea ao código.”

### Monólito modular ou microsserviços?

**Resposta:** “Começaria com limites de domínio claros e módulos testáveis dentro do mesmo deploy, a menos que haja necessidade real de escala, autonomia de deploy ou isolamento organizacional que justifique serviços separados. Microsserviços adicionam rede, observabilidade, falhas parciais e contratos distribuídos. Em eCarryOn desenhei um monólito modular com caminho para integrações; isso é evidência de arquitetura desenhada, não afirmação de que escalei microsserviços em produção.”

## Testes, entrega e containers

### Como escolher entre teste unitário, integração e ponta a ponta?

**Resposta:** “Unidade cobre regra isolada e casos de borda; integração confirma persistência, autorização ou mensageria com dependências reais; E2E verifica os poucos fluxos críticos do usuário. Eu manteria E2E focado e determinístico, usando testes mais baratos para a maioria das combinações. Para integração, há experiência registrada com Testcontainers para PostgreSQL, SpiceDB e Pub/Sub.”

### O que você realmente fez com containers?

**Resposta — experiência real:** “Na MSPA, o ambiente local de desenvolvimento do serviço Go usa scripts Bash e Podman com compatibilidade Docker para subir PostgreSQL, SpiceDB, Pub/Sub, Mailpit, Jaeger, Gotenberg e um emulador de GCS. O setup prepara banco e migrações; os testes de integração usam Testcontainers para algumas dependências. Também há uma imagem de produção montada com estágio de build Go e imagem final distroless. Eu não apresento isso como experiência Kubernetes ou ownership de SRE.”

### A imagem é grande e inclui ferramentas de compilação. Como reduzir?

**Resposta — ligação ao Dockerfile real:** “Separaria build e runtime com multi-stage build, copiando só o binário e artefatos necessários para uma base mínima, executando como usuário não-root e mantendo certificados/configuração necessários. Verificaria também reprodutibilidade, scan e compatibilidade de libc. A imagem Go de produção documentada já usa estágio de build e final distroless; qualquer redução precisa ser medida e testada.”

### Como diagnosticaria container que funciona local e falha no CI?

**Resposta:** “Compararia versões de imagem, arquitetura, variáveis, portas, permissões, readiness e ordem de inicialização. Inspecionaria logs e exit code e tentaria reproduzir com a mesma imagem e configuração. Evitaria corrigir com espera fixa; usaria health check/readiness. Também verificaria se testes dependem de estado persistido local.”

## Design de fluxo full-stack

### Desenhe uma tela Angular para alterar consentimento e gravar auditoria.

**Resposta — Trust Center (experiência real):** “A tela de administração no Compass define a configuração por categoria; o componente embutido apresenta escolha no site e aplica a decisão localmente antes de liberar scripts opcionais. O backend precisa persistir configuração e produzir eventos de auditoria, com identidade/escopo de tenant validado no servidor. Eu separaria contrato de configuração da UI, validaria transições e cobriria estados de aceitar, rejeitar, atualizar e falha de rede. Na experiência real, trabalhei em UI framework-agnostic, Cloudflare Workers/KV/D1/Durable Objects e fluxo de auditoria; os detalhes de cada endpoint variam conforme implementação.”

### Uma chamada de salvar demora. Como manter a tela utilizável?

**Resposta:** “Mostraria estado de envio e impediria duplicação da ação, preservaria o formulário e exibiria erro recuperável. Cancelaria ou ignoraria resposta antiga se o usuário mudar de registro. Se a operação puder levar tempo, explicaria o estado e buscaria status em vez de bloquear a página. No backend, timeout e idempotência precisam ser definidos pelo efeito da operação.”

## Perguntas para aprofundar com o entrevistador

- “Quanto do trabalho atual é Angular e quanto é Java/Spring?”
- “A vaga exige experiência produtiva imediata em Spring ou considera base acadêmica com ramp-up?”
- “Como estão organizados os limites entre serviços e domínio?”
- “Que estratégia de CI e qualidade vocês usam para front e back?”
- “O trabalho presencial em Campinas é requisito para a posição ou há opção remota para outras regiões?”
