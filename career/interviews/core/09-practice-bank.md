# Banco de treino — respostas completas

Este arquivo é para ensaiar respostas em voz alta, não para decorar palavra por palavra. As respostas marcadas **Experiência real** usam situações registradas na entrevista Kova e no Master Career Document. As marcadas **Simulação** são exercícios técnicos inventados para praticar raciocínio; nunca as apresente como algo que você implementou.

Nas histórias reais, mantenha o resultado no limite do que foi observado. Se perguntarem por métrica que não foi registrada, diga isso com clareza e explique qual sinal vocês acompanhavam.

## Glossário deste banco

Definições curtas para revisar antes do treino. Em entrevista, explique o conceito com suas palavras e conecte-o a um exemplo; evite recitar siglas sem contexto.

### Frontend e navegador

- **Angular Signals:** mecanismo reativo do Angular para representar estado e valores derivados, atualizando consumidores quando o valor muda.
- **RxJS / Observable:** biblioteca e abstração para compor fluxos assíncronos, como eventos, respostas HTTP e cancelamento.
- **Web Component:** componente web baseado em padrões do navegador, que pode ser usado sem exigir um framework específico.
- **Custom Element:** elemento HTML definido pela aplicação, com comportamento e ciclo de vida próprios.
- **Shadow DOM:** árvore DOM encapsulada associada a um elemento; ajuda a isolar estrutura e estilos, mas não é uma barreira de segurança.
- **SDK:** biblioteca e contrato que outro produto incorpora para usar uma capacidade, como um widget ou integração.
- **CSP (Content Security Policy):** política do navegador que limita origens e tipos de conteúdo que a página pode carregar ou executar.
- **CORS (Cross-Origin Resource Sharing):** mecanismo do navegador que controla quando uma página de outra origem pode ler uma resposta.
- **CSRF (Cross-Site Request Forgery):** ataque que tenta induzir o navegador autenticado a enviar uma ação não desejada.
- **XSS (Cross-Site Scripting):** execução de conteúdo/script não confiável dentro do contexto de uma página.
- **DevTools:** ferramentas do navegador para inspecionar DOM, estilos, requests, armazenamento, erros e desempenho.

### Backend, dados e confiabilidade

- **API REST:** interface HTTP organizada em recursos e operações, com contratos de request, response e códigos de estado.
- **DTO (Data Transfer Object):** estrutura de dados definida para entrada ou saída de uma API; evita expor diretamente entidades internas.
- **Tenant / multitenancy:** organização de um sistema para atender vários clientes, mantendo o escopo e isolamento dos dados de cada um.
- **RBAC (Role-Based Access Control):** controle de acesso baseado em papéis que concedem capacidades; cada operação ainda precisa validar autorização.
- **Transação:** conjunto de operações de banco tratado como uma unidade, para preservar invariantes diante de sucesso ou falha.
- **Idempotência:** propriedade em que repetir a mesma operação não duplica seu efeito final.
- **Retry:** repetição controlada de uma operação após falha, normalmente limitada e usada para erros transitórios.
- **Backoff exponencial:** aumento progressivo do intervalo entre tentativas; jitter adiciona variação para evitar que muitas tentem juntas.
- **Outbox transacional:** padrão que grava mudança de domínio e evento na mesma transação local; outro processo publica o evento depois.
- **N+1:** problema em que uma consulta inicial é seguida por uma consulta adicional para cada item de uma lista.
- **Keyset/cursor pagination:** paginação que continua a partir da última chave/posição vista, em vez de pular um grande número de linhas.
- **Testcontainers:** ferramenta que inicia dependências reais em containers durante testes de integração.
- **Distroless image:** imagem de container mínima, sem shell e ferramentas gerais de sistema, contendo apenas o runtime/artefatos necessários.
- **Worker:** processo que executa tarefas em segundo plano, frequentemente com fila, agendamento, tentativas e registro de estado.

### IA e qualidade

- **LLM (Large Language Model):** modelo de linguagem que gera ou transforma texto a partir de instruções e contexto.
- **Prompt:** instruções fornecidas ao modelo; em aplicações, também pode incluir contexto e formato esperado.
- **Saída estruturada:** resposta em formato definido, como JSON com schema, que a aplicação consegue validar antes de usar.
- **Harness de IA:** conjunto de contexto, instruções, ferramentas, limites e verificações que envolve o modelo para tornar uma tarefa mais controlável e avaliável.
- **Avaliação / eval:** teste sistemático de saídas do modelo contra exemplos e critérios definidos, incluindo casos difíceis e regressões.
- **Regressão:** comportamento correto anteriormente que deixa de funcionar após uma mudança; testes de regressão procuram detectar isso.
- **Prompt injection:** tentativa de conteúdo não confiável de alterar as instruções ou os limites de uma aplicação que usa modelo.
- **Schema:** descrição formal da estrutura e dos tipos de dados esperados numa entrada ou saída.
- **Latência:** tempo entre iniciar uma operação e receber seu resultado.
- **Fallback:** caminho alternativo usado quando o caminho principal falha ou não atende aos critérios.
- **SDD (Spec-Driven Development):** desenvolvimento guiado por especificações explícitas de comportamento, limites e critérios verificáveis.

### Produto e medição

- **Funil:** sequência de etapas instrumentadas usada para observar quantas pessoas avançam ou abandonam um fluxo.
- **Evento:** registro de uma ação ou mudança relevante, como iniciar, concluir ou falhar uma etapa.
- **Instrumentação:** implementação e validação dos eventos e propriedades enviados para análise/observabilidade.
- **Coorte:** grupo de usuários ou execuções definido por uma característica comum, usado para comparar comportamentos.
- **Métrica de vaidade:** número que parece positivo, mas não ajuda por si só a decidir se o produto resolveu o problema.
- **Audit event / evento de auditoria:** registro de uma ação ou decisão importante para permitir rastreabilidade posterior.
- **PII (Personally Identifiable Information):** informação que identifica ou pode ajudar a identificar uma pessoa.
- **False positive / falso positivo:** caso legítimo classificado incorretamente como suspeito, bloqueado ou inválido.
- **Baseline:** valor ou condição de referência usada para comparar uma mudança; sem baseline, não se deve alegar ganho medido.

## Comportamental e experiência

### 1. Conte uma decisão técnica difícil e o que você sacrificou.

**Resposta — Trust Center (experiência real):** “No Trust Center, precisávamos oferecer consentimento que realmente impedisse scripts de terceiros antes da escolha da pessoa. Um banner simples seria mais rápido, mas não garantiria o comportamento que o produto prometia. Eu ajudei a priorizar uma solução isolada e reutilizável: Web Components com Lit e Shadow DOM no navegador, além de serviços de borda da Cloudflare para configuração e persistência. Isso trouxe custo de implementação e tirou foco do Compass por um período. O critério foi confiança: em um produto de privacidade, mostrar um banner sem respeitar a escolha seria pior do que entregar menos rápido. Validávamos o bloqueio inspecionando a sessão no DevTools antes e depois das escolhas e verificando os eventos de auditoria. Eu não tenho um número agregado de falhas ou impacto para afirmar.”

### 2. Conte sobre uma funcionalidade cuja UX você validou com usuários.

**Resposta — Compass (experiência real):** “No Compass, o desafio era tornar o mapeamento de dados e os fluxos de LGPD compreensíveis para pessoas que não dominavam o assunto. Eu participava das entrevistas, às vezes conduzia, registrava observações e ajudei a criar personas a partir do que ouvíamos. Para um wizard, combinávamos sessões de validação com usuários e pessoas novas no produto, eventos e funis no PostHog e formulários de feedback no fim de fluxos. Um sinal que acompanhávamos era o tempo de conclusão do funil: se um passo novo ajudava sem alongar demais um fluxo simples, isso era evidência útil. Não vou dizer que houve uma redução percentual porque não tenho esse número documentado.”

### 3. Conte sobre um bug que você corrigiu de forma que evitasse repetição.

**Resposta — parâmetros posicionais (experiência real, detalhe limitado):** “Tivemos um bug em que parâmetros soltos eram passados na ordem errada. Ele apareceu por observabilidade e feedback de usuário. Corrigi o comportamento, acrescentei testes e ajudei a trocar a interface para receber uma estrutura tipada, tornando os argumentos mais explícitos. O resultado verificável é que o caso passou a ter cobertura e a chamada ficou menos propensa a trocar valores silenciosamente. Eu não tenho uma contagem de reincidência para atribuir à mudança.”

### 4. Dê um exemplo de algo que você liderou sem ser gestor.

**Resposta — coordenação e Trust Center (experiência real):** “Na fase crítica de um projeto, ajudei a reorganizar o fluxo de trabalho de um grupo de seis pessoas e coordenei diretamente quatro contribuintes. Meu papel era alinhar dependências e tornar o trabalho executável, não gerir carreira ou desempenho. No Trust Center, também assumi liderança de produto e frontend: ajudei a transformar a exigência de consentimento real em decisões de arquitetura, implementação e validação. Eu descreveria isso como liderança técnica/produto por contexto e responsabilidade, não como cargo de gestão.”

### 5. Conte sobre um desacordo com colegas.

**Resposta — molde a completar com fato confirmado antes de usar:** “Em [situação específica], eu e [papel da outra pessoa] discordávamos entre [opção A] e [opção B]. Eu propus explicitar o risco que cada opção resolvia, os critérios de aceitação e o custo para usuário/time. Fizemos [ação realmente ocorrida] e decidimos [decisão real]. O resultado foi [resultado observável].” O feedback da entrevista menciona divergência, mas não registra detalhes suficientes para preencher os colchetes. Não invente uma anedota: ensaie esse molde com um caso seu antes da entrevista.

### 6. Fale de uma falha sua e do que mudou depois.

**Resposta — bug de parâmetros (experiência real):** “Uma falha concreta foi deixar uma interface de função dependente de vários parâmetros posicionais. A ordem errada permitiu um comportamento incorreto. Quando o problema apareceu, corrigi o caso e tratei a causa de desenho: passei a preferir um objeto tipado para agrupar dados relacionados e deixei teste cobrindo o comportamento. Aprendi que teste e contrato explícito precisam reduzir a ambiguidade na chamada; não basta corrigir só a linha que manifestou o defeito.”

### 7. Como você lida com feedback sobre comunicação?

**Resposta — entrevista simulada com feedback real recebido:** “Recebi o feedback de que minhas respostas davam voltas antes de chegar ao ponto. Estou treinando começar pela conclusão e sustentar com uma situação e uma evidência. Por exemplo, em vez de narrar toda a história do Compass antes do ponto, começo dizendo: ‘Ajudei a tornar os fluxos de LGPD compreensíveis e acompanhávamos conclusão e tempo no PostHog’. Depois aprofundo se a pessoa pedir. Ainda estou praticando concisão; não trataria isso como algo já resolvido.”

### 8. Qual resultado você entregou sem ter uma métrica de negócio?

**Resposta:** “No Trust Center, consigo explicar resultado de comportamento e arquitetura, não um resultado financeiro. A solução isolava a UI, permitia configurar o consentimento e dava suporte ao bloqueio de scripts até uma escolha explícita; validávamos o comportamento no navegador e com eventos de auditoria. Não tenho um antes/depois consolidado de receita, conversão ou incidentes. Prefiro apresentar a evidência técnica que existe a criar uma métrica.”

### 9. Como você trabalha quando produto pede velocidade e engenharia vê risco?

**Resposta — Trust Center (experiência real):** “Eu torno o risco concreto e ligado ao requisito. No Trust Center, um banner simples economizaria tempo, mas poderia deixar scripts rodarem mesmo após rejeição. Mostramos o que precisava acontecer no navegador e discutimos o custo de uma solução que realmente controlasse carregamento e isolamento. A equipe priorizou a abordagem mais robusta, aceitando reduzir temporariamente o foco em outras entregas. Eu tento explicitar impacto e opções para a decisão ser de produto e engenharia, em vez de transformar preferência técnica em veto.”

### 10. Como você aprende uma stack que ainda não domina?

**Resposta — Go (experiência real):** “Quando comecei a pegar tarefas de backend em Go, primeiro li padrões já usados no repositório e segui o caminho de uma operação existente entre handler, regra e persistência. Pratiquei conceitos em uma automação separada, pedi revisão em pontos específicos e usei ferramentas de IA para explicar trechos e documentação; depois validei essas explicações contra o código e os testes. Isso me ajudou a contribuir em tarefas full-stack. Não significa que eu tenha anos de especialização em Go: minha experiência é de contribuição dentro do produto.”

### 11. Como reage quando a métrica não prova a hipótese?

**Resposta:** “Eu separo o que foi observado da interpretação. No Compass, funis e tempo de conclusão eram sinais, mas o tempo sozinho não prova que uma experiência ficou melhor. Eu cruzaria esse sinal com conclusão, feedback, erros e observação de uso, verificaria se o evento está instrumentado corretamente e compararia segmentos/contextos antes de decidir. Se ainda não houver evidência, chamaria a conclusão de hipótese e proporia o próximo teste. Não atribuo um resultado quantitativo que não acompanhamos.”

### 12. Como explica uma lacuna em requisito obrigatório?

**Resposta:** “Não usei [tecnologia] em produção, então não vou me apresentar como experiente nela. Minha experiência mais próxima é [exemplo específico], onde precisei [princípio ou problema transferível]. Para começar, eu estudaria o padrão já adotado pelo time, faria uma mudança pequena com teste e pediria revisão de alguém que conhece a stack. Se a vaga exige autonomia imediata em [tecnologia], prefiro deixar essa diferença clara.”

## Perguntas técnicas com resposta falada

## Frontend — atuação concreta

### 29. Conte sobre uma interface de produção em que você precisou entender o problema do usuário, não só implementar um layout.

**Resposta — Compass (experiência real):** “No Compass, eu trabalhava em fluxos de mapeamento de dados para pessoas que muitas vezes não dominavam LGPD. Meu trabalho começava entendendo a regra e onde a pessoa poderia se confundir. Eu participava de entrevistas e testes, ajudava a criar personas, implementava os fluxos em Angular/TypeScript e voltava aos usuários para validar. Também acompanhávamos eventos e funis no PostHog e coletávamos feedback ao fim de alguns wizards. O efeito que posso afirmar é que passamos a ter sinais de conclusão e tempo por fluxo para discutir mudanças. Não tenho uma métrica consolidada que prove aumento de conversão.”

### 30. Descreva uma decisão de arquitetura frontend sua e por que ela era necessária.

**Resposta — Trust Center (experiência real):** “A UI de consentimento precisava entrar em sites de clientes sem depender do framework de cada site e sem ser facilmente afetada pelo CSS hospedeiro. Trabalhei com Web Components usando Lit e Shadow DOM para encapsular a interface. Isso resolveu parte do acoplamento visual e nos deu um ponto de integração framework-agnostic. O limite é que Shadow DOM não isola JavaScript nem substitui testes de acessibilidade e compatibilidade. Por isso eu avaliaria foco, eventos, ordem de carregamento e navegadores, além da aparência.”

### 31. Como você decide onde fica o estado de uma tela Angular?

**Resposta — prática real mais critério técnico:** “Eu começo pelo ciclo de vida e por quem precisa ler ou alterar o estado. Estado transitório de formulário pode ficar no componente; estado compartilhado entre áreas precisa de um serviço/fonte única bem definida. Signals funcionam bem para estado síncrono e valores derivados; RxJS é útil para fluxos assíncronos, eventos, cancelamento e composição. Na MSPA, trabalhei com Angular, Signals e RxJS. Evito manter duas cópias sincronizadas sem necessidade e testo loading, erro, atualização e navegação entre entidades.”

### 32. Conte sobre um problema de compatibilidade entre sua UI e o ambiente onde ela roda.

**Resposta — Trust Center (experiência real):** “No Trust Center, o componente precisava rodar em sites que não controlávamos, então havia risco de estilos, dependências e ordem de scripts diferentes. Usamos Web Components e Shadow DOM para reduzir colisão de estilos e validávamos a integração em páginas reais. Para uma falha específica, eu verificaria o DOM, o waterfall de rede, erros de console e CSS computado no host. Não vou afirmar uma matriz de navegadores ou uma lista de incidentes que não está registrada.”

### 33. Como você investiga uma tela lenta sem começar reescrevendo o componente?

**Resposta — método aplicado à prática real:** “Eu reproduzo em condições controladas, olho Performance e Network no DevTools e separo tempo de servidor, download, parsing e renderização. Depois verifico renders repetidos, listas grandes, tarefas longas na thread principal, imagens e dependências. Faço uma mudança por vez e comparo o mesmo fluxo. Tenho experiência com performance/debugging frontend e entrega em produção, mas não atribuo um ganho percentual sem benchmark documentado.”

### 34. Dê um exemplo de melhoria frontend ligada a acessibilidade.

**Resposta — evidência de prática, sem projeto inventado:** “Acessibilidade faz parte do meu trabalho frontend, mas não tenho uma história única registrada com antes/depois e métrica. Numa entrevista, eu explicaria a prática com um caso que realmente toquei: qual componente, qual barreira encontrada, como validei teclado/leitor de tela e o que mudou. Como exemplo de abordagem, num diálogo de consentimento eu verificaria nome acessível, ordem e retorno de foco, operação por teclado e anúncio de erro; isso é um cenário de treino, não uma alegação de que implementei esse caso específico no Trust Center.”

## Backend — atuação concreta

### 35. Conte sobre uma contribuição sua em backend que mudou comportamento de produto.

**Resposta — MSPA (experiência real):** “Na MSPA, embora minha entrada fosse mais frontend, passei a contribuir também com serviços Go, APIs REST/internas, SQL/PostgreSQL e regras de negócio. Eu seguia uma operação existente no repositório, entendia o contrato e a persistência e implementava a mudança com testes e revisão. Isso me permitiu participar de entregas que atravessavam frontend e backend. A memória de carreira não registra um endpoint específico nem um resultado numérico; numa entrevista eu usaria uma tarefa concreta do repositório e explicaria exatamente a regra que alterei, sem inventar nome ou escopo.”

### 36. Como você estrutura uma regra de autorização para não depender do frontend?

**Resposta — evidência de projeto real:** “A autorização precisa ser decidida no servidor, perto da operação que lê ou modifica os dados. Verifico identidade, associação com o recurso e capacidade derivada do papel; não confio num botão escondido nem num role enviado pelo browser. Em Marca Racha, os testes de comportamento cobrem ownership, membership e capacidades derivadas de papel, além de estados de partida e convite. Eu usaria testes negativos para usuário sem vínculo e papel sem permissão, porque eles protegem a fronteira real.”

### 37. Conte sobre um fluxo assíncrono/backend que você precisou tornar confiável.

**Resposta — Marca Racha (experiência real):** “No Marca Racha, há notificações ligadas a convites e pedidos para entrar em partidas. O comportamento documentado inclui deduplicação de notificações e um worker agendado protegido com retries e backoff. O problema é que tarefas podem falhar ou ser repetidas, então o fluxo precisa preservar estado e não gerar notificações duplicadas. Eu consigo falar desse comportamento implementado; não afirmo volume de produção ou uma redução de falhas medida.”

### 38. Explique como você diagnosticaria uma divergência entre a resposta da API e o banco.

**Resposta:** “Eu capturaria o request e o identificador de correlação, confirmaria o tenant/usuário autenticado, seguiria a regra até a consulta e compararia o estado antes/depois da transação. Checaria cache, réplica, filtros de autorização e eventos assíncronos. Depois escreveria um teste que reproduz o estado incorreto e verificaria logs sem expor payload sensível. Em produção eu evitaria editar dado manualmente antes de entender a causa.”

### 39. Como você aprendeu Go o suficiente para contribuir em backend?

**Resposta — MSPA (experiência real):** “Eu comecei lendo o código existente e seguindo uma requisição pela arquitetura do repositório, em vez de aprender a linguagem de forma abstrata. Pratiquei conceitos numa automação separada, consultei documentação e pedi revisão em dúvidas específicas. Usei IA para explicar código e acelerar documentação, mas verificava a explicação no próprio código e nos testes. Assim consegui participar de tarefas full-stack. Minha experiência é contribuição em produto Go, não uma carreira longa de especialista na linguagem.”

### 40. Simulação: uma operação grava no PostgreSQL e publica um evento. Como lida com falha parcial?

**Resposta — simulação:** “Se gravar e publicar forem dois efeitos independentes, um pode concluir enquanto o outro falha. Eu consideraria uma outbox transacional: persistir a mudança e o evento na mesma transação local, publicar depois com retry e consumidor idempotente. Monitoraria idade da fila e falhas permanentes. Antes de escolher, perguntaria se a consistência imediata é requisito e qual broker já existe. É desenho de exercício; não estou dizendo que implementei outbox na MSPA.”

## Full-stack — atravessando camadas de verdade

### 41. Conte uma funcionalidade em que seu trabalho atravessou frontend, API e dados.

**Resposta — MSPA (experiência real):** “Na MSPA, meu escopo evoluiu de frontend para contribuições que podiam atravessar a UI, serviços Go, APIs internas e SQL/PostgreSQL. Eu começava pela regra de negócio e pelo comportamento visível, alinhava contrato entre UI e API, implementava a parte necessária nas camadas e validava os casos críticos com testes e debugging. O Trust Center é um exemplo de produto com UI embutida, configuração no Compass, serviços de borda e eventos de auditoria. Para não exagerar minha autoria, eu separaria a parte que implementei pessoalmente da arquitetura ou trabalho do time.”

### 42. No Marca Racha, como impediria que alguém entre numa partida privada sem aprovação?

**Resposta — projeto real com detalhe concreto:** “A partida pode ser pública ou privada, mas a decisão de admissão pertence ao organizador. O caminho de pedido para entrar não deve criar membership diretamente: cria um pedido pendente, valida estado e identidade no servidor, e só a ação autorizada do organizador efetiva a entrada. As notificações do pedido precisam ser deduplicadas. Eu também testaria corrida entre aprovação, cancelamento e partida cheia. O produto documenta pedidos de entrada, controle de admissão pelo organizador e notificações; apresentaria os detalhes de implementação que eu realmente toquei sem inventar uma API específica.”

### 43. Conte uma decisão que conectou UX e regra de negócio.

**Resposta — Marca Racha (experiência real):** “Na descoberta pública de partidas, a pessoa pode encontrar partidas por região e pedir para entrar, enquanto o organizador controla a admissão. A interface precisa explicar a diferença entre descobrir, pedir e estar confirmada. Uma decisão documentada foi remover a contagem de participantes dos cards públicos por privacidade. Isso mostra que a UI não exibe todo dado disponível: ela considera o contexto de exposição e o modelo de produto. Não atribuo a essa mudança uma métrica de conversão que não foi medida.”

### 44. Simulação: o frontend mostra “salvo”, mas o backend ainda está processando. Que contrato desenharia?

**Resposta — simulação:** “Eu distinguiria ‘pedido aceito’ de ‘processamento concluído’. A API poderia retornar um identificador e estado `pending`, e a UI mostrar progresso e consultar/receber atualização até estado terminal. Definiria timeout, retry seguro e tratamento de falha, sem exibir sucesso definitivo antes da confirmação. Se a operação for realmente síncrona e curta, manteria simples; não adicionaria fila por padrão. É exercício de design, não um fluxo que estou atribuindo a um projeto específico.”

### 45. Como você decide o que testar em cada camada de uma funcionalidade full-stack?

**Resposta:** “Na camada de domínio, testo transições e regras com casos válidos e inválidos. Na API, testo autenticação, autorização, validação e contrato. Na persistência/integridade, testo contra banco ou dependência real quando a query ou concorrência importam. Na UI, testo os estados e a jornada crítica; deixo poucos E2E para integração de ponta a ponta. Em Marca Racha há testes de comportamento para ownership, membership, convites, limites e notificações; na MSPA também trabalhei com testes automatizados e integração.”

## IA — produto, engenharia e avaliação

### 46. Diferencie seu trabalho integrando IA a um produto do seu uso de IA para desenvolver.

**Resposta — duas frentes reais:** “São trabalhos diferentes. Em produto, participei de capacidades generativas com Genkit, contexto/prompt, sanitização de entrada e respostas estruturadas; aí a preocupação é o comportamento que o usuário recebe e a validação da saída. No fluxo de engenharia, uso ferramentas como Codex, Claude e Cursor e desenhei harnesses com contexto e especificações estruturados, checks determinísticos, escopo controlado e atenção à qualidade e ao custo. Não digo que o modelo substitui revisão: eu verifico o resultado no código, nos testes e nas regras do produto.”

### 47. Conte um exemplo real de IA aplicada dentro de uma funcionalidade.

**Resposta — MSPA (experiência real, limite explícito):** “Na MSPA, integrei capacidades generativas usando Genkit. O trabalho incluía contexto/prompt, sanitização das entradas e resposta estruturada para a aplicação consumir. Essa estrutura ajuda a limitar o que entra e a tratar o resultado como dado validável, não texto livre confiável. A memória disponível não registra um caso de uso específico, métrica de acurácia ou resultado de negócio; por isso eu explicaria a funcionalidade concreta que toquei sem alegar ganho percentual.”

### 48. Como você evita que uma resposta de LLM inválida vire uma ação de produto?

**Resposta — experiência real mais desenho:** “Eu não trataria a resposta como autoridade. Validaria formato e schema, depois checaria invariantes de domínio e permissões no servidor. Se faltar campo ou houver valor inválido, retornaria erro controlado ou fallback; uma ação sensível exigiria revisão apropriada. Na minha experiência há respostas estruturadas e sanitização de entrada. Para uma ação específica, eu mostraria o validador e os testes reais, sem presumir que JSON válido significa semanticamente correto.”

### 49. O que havia no seu harness de IA e que problema ele resolvia?

**Resposta — experiência real:** “Eu estruturava contexto e especificações para limitar o escopo do agente, definia checks determinísticos para verificar partes da saída e incluía guardrails de qualidade e custo de modelo. O objetivo era tornar o fluxo mais previsível e revisável, principalmente quando a IA ajudava a entender código, explorar uma solução ou gerar uma mudança. Eu ainda fazia revisão humana e rodava as validações do projeto. Não tenho baseline medido para dizer que reduziu custo ou defeitos em uma porcentagem.”

### 50. Como mede se a IA ajudou sua produtividade sem confundir velocidade com qualidade?

**Resposta — proposta honesta:** “Eu mediria uma tarefa comparável do começo ao fim, incluindo tempo de revisão e retrabalho, e manteria qualidade como gate: testes, defeitos escapados, aderência à especificação e aprovação de revisão. Separaria uso de IA por tipo de tarefa e registraria custo/latência quando relevante. Na minha prática, uso checks determinísticos e guardrails de custo e qualidade; não tenho uma medição controlada de produtividade para alegar ganho percentual.”

### 51. Simulação: o agente propõe uma migração de banco destrutiva. O que seu harness deve fazer?

**Resposta — simulação:** “A especificação precisa declarar operações proibidas e preservar dados como invariante. O harness pode inspecionar o diff e bloquear comandos destrutivos sem plano de migração/backfill, executar checagens estáticas e testes, e pedir aprovação humana para operações de alto risco. Não deixaria o agente aplicar a mudança diretamente em produção. Registraria entrada, versão de instrução, diff e resultado dos checks com cuidado para não expor segredo.”

### 52. Quando você não usaria IA numa implementação?

**Resposta:** “Eu não usaria se a tarefa for mais simples e barata de resolver diretamente, se o contexto contiver dados que não podem ser enviados ao modelo ou se a saída não puder ser validada com segurança para o risco envolvido. Também evitaria deixar o modelo decidir autorização ou executar ação irreversível sem controles. A decisão é pelo problema, privacidade, custo e capacidade de verificar, não por usar IA em tudo.”

### 53. No Trust Center, como impedir um script de analytics de rodar antes do consentimento?

**Resposta — experiência real com aprofundamento:** “A decisão começa antes do banner: o script que controla consentimento precisa executar antes de scripts opcionais. Eu não deixaria tags de terceiros carregarem livremente e tentaria removê-las depois, porque isso não desfaz coleta que já ocorreu. A solução precisa controlar o carregamento, manter a escolha por categoria e liberar cada integração só após autorização. No Trust Center, contribuímos para esse fluxo com um componente Web Component isolado e serviços de borda. Validávamos com perfil limpo do navegador, inspecionando requests, cookies e storage antes da decisão, depois de aceitar e depois de rejeitar. Também conferíamos os eventos de auditoria. A ordem exata de tags e a integração variam conforme o site hospedeiro.”

### 54. Para que o Shadow DOM ajudava nesse produto? Quais limites ele traz?

**Resposta — experiência real + conhecimento técnico:** “A UI precisava ser incorporada em sites de clientes com estilos e frameworks diferentes. Web Components davam um contrato de integração independente do framework e o Shadow DOM isolava boa parte do CSS e da árvore interna. Isso reduz colisões, mas não é uma fronteira de segurança: JavaScript ainda pode interagir com APIs da página, há detalhes de eventos e foco que precisam ser tratados, e estilos externos/variáveis exigem uma estratégia deliberada. No Trust Center, escolhemos esse isolamento para tornar o componente mais previsível em sites hospedeiros, sem afirmar que Shadow DOM resolve segurança sozinho.”

### 55. Como você testa um banner de consentimento no navegador?

**Resposta — caso real:** “Eu começaria com perfil limpo: sem cookies, local storage ou session storage. Capturaria requests e estado antes de qualquer escolha; verificaria que o banner aparece e que nenhum script opcional executa. Depois aceitaria uma categoria e confirmaria que apenas os scripts correspondentes carregaram. Repetiria rejeitando e verificaria ausência de requests e persistência correta da escolha. Também testaria reload, mudança de preferência e falhas de rede, além de comparar eventos de auditoria com o comportamento observado. No nosso uso interno fazíamos inspeção com DevTools e snapshots; essa lista amplia o exercício para cobrir regressões.”

### 56. Como evitar que uma API aceite uma ação só porque o botão está escondido no frontend?

**Resposta — conhecimento aplicado a evidência:** “A UI pode esconder ações para orientar a pessoa, mas o servidor precisa autorizar cada operação. Eu validaria identidade, vínculo com o recurso e capacidade no ponto em que a ação altera ou lê os dados. Também evitaria confiar em role enviada pelo cliente: carregaria a associação confiável e aplicaria a regra na camada de serviço/repositório. Nos projetos do Master Career Document, há testes de propriedade, membership, capacidades derivadas do papel e transições de estado. Para uma rota concreta, eu escreveria testes negativos de usuário sem vínculo e papel sem permissão, além do caminho autorizado.”

### 57. No Compass, como instrumentar um wizard para saber onde as pessoas desistem?

**Resposta — experiência real:** “Eu definiria eventos por etapas com nomes estáveis: início, etapa concluída, validação com erro, retorno à etapa anterior e conclusão. Cada evento carregaria identificadores mínimos do fluxo/etapa e propriedades necessárias para segmentar, sem incluir respostas ou dados pessoais sensíveis. No PostHog, montaria funil de início até conclusão e observaria abandono e tempo por etapa; o formulário de feedback no final complementaria o número com contexto. A gente usou eventos, funis, tempo e formulários. Antes de interpretar, validaria que os eventos disparam uma vez, na transição correta, e respeitam privacidade.”

### 58. O tempo do funil aumentou depois de adicionar um passo. Isso significa que a UX piorou?

**Resposta:** “Não necessariamente. O passo pode acrescentar trabalho legítimo ou tornar uma decisão antes invisível. Eu separaria tempo por etapa, taxa de conclusão, erros, retornos, feedback e tipo de usuário; verificaria também mudanças de volume, instrumentação e comparação de coortes. Se um fluxo simples passou do limite que definimos, investigaria; se a etapa adiciona uma proteção necessária, avaliaria se o custo é aceitável e se há forma de explicá-la melhor. No Compass, usávamos tempo total e limites contextualizados como sinal; isso não é prova causal isolada.”

### 59. Como tipagem teria evitado o bug dos parâmetros posicionais?

**Resposta — experiência real:** “Com vários argumentos de mesmo tipo, trocar a ordem ainda compila e pode produzir um erro difícil de perceber na revisão. Um objeto nomeado como `{ accountId, eventType, occurredAt }` explicita o significado no call site, permite evoluir o contrato e dá um lugar para validação. Eu ainda testaria a regra de negócio; tipos não substituem testes nem validação de entrada. No caso real, o bug de ordem levou à refatoração para uma estrutura tipada e teste do comportamento.”

### 60. Como você investigaria um erro que só aparece em produção?

**Resposta — prática real com limite claro:** “Eu tentaria primeiro delimitar quem e qual fluxo foi afetado sem pedir dados pessoais desnecessários. Correlacionaria horário, versão, request/evento e dependências, reproduziria com os mesmos estados e verificaria logs/traces e alterações recentes. Formaria uma hipótese por camada e mudaria uma coisa de cada vez. Se houver risco contínuo, reduziria o impacto com rollback ou feature flag conforme o processo do time; depois cobriria o caso com teste e melhoraria o sinal que faltou. Minha experiência inclui debugging, observabilidade e produção, mas eu não afirmaria escala ou um processo formal de incident command que não está documentado.”

### 61. Como garantir idempotência num endpoint de convite que pode ser reenviado?

**Resposta — simulação de system design:** “Eu definiria a chave de idempotência e seu escopo, por exemplo usuário convidado + partida + operação, e faria a criação/consumo da vaga em transação. Repetir o mesmo pedido retornaria o estado já criado, sem duplicar convite nem notificação. Também precisaria haver restrição única no banco para fechar a corrida entre requests concorrentes; notificação sairia via outbox ou mecanismo equivalente para não enviar antes do commit. Eu testaria repetição sequencial, concorrente e retry após timeout. É exercício hipotético; meus projetos têm comportamento de convites, reutilização de convite pendente, limite atômico e deduplicação de notificações, mas não estou afirmando que implementei esse desenho exato de idempotency key/outbox.”

### 62. Como desenharia retry para uma integração externa sem duplicar efeitos?

**Resposta — simulação:** “Primeiro separaria erro transitório de erro permanente. Em falha transitória, aplicaria retry limitado com backoff exponencial e jitter; em falha permanente, encerraria e deixaria estado e motivo visíveis. Cada operação teria identidade estável e o receptor ou nosso banco impediria duplicação. Registraria tentativa, latência e resultado, com limite de idade e mecanismo de reprocessamento. Não faria retry cego em uma operação não idempotente. É uma resposta de desenho; não atribua a si uma implementação específica fora das evidências de retries/backoff do worker protegido documentado em Marca Racha.”

### 63. Como você avaliaria uma resposta de IA estruturada antes de liberar uma mudança?

**Resposta — experiência real em harnesses, proposta concreta:** “Eu separaria validade estrutural de qualidade semântica. Primeiro verificaria schema e campos obrigatórios; depois rodaria casos representativos, casos limite e entradas adversariais, comparando com critérios explícitos ou exemplos avaliados. Registraria falhas por categoria, latência e custo, e rodaria regressão quando contexto, prompt ou modelo mudar. Em uso com usuário, manteria validação de entrada e um fallback/revisão apropriada ao risco. No meu trabalho com harnesses, usei contexto e especificações estruturados, verificações determinísticas e limites de escopo, qualidade e custo. Não tenho uma métrica publicada de melhora de qualidade.”

### 64. Um teste de integração falha às vezes quando vários testes rodam juntos. Como investigar?

**Resposta — simulação com ligação à prática real:** “Eu verificaria estado compartilhado, dados que não são isolados, ordem implícita, recursos que não foram fechados e disputa por portas/filas. Tentaria repetir o teste isolado e em paralelo, registrando seed e logs; depois eliminaria dependência de ordem e daria namespace por teste. Para dependências reais, usaria fixtures/containers com ciclo de vida claro e esperaria readiness, não um sleep arbitrário. No meu contexto existem testes com Testcontainers para PostgreSQL, SpiceDB e Pub/Sub; esta falha específica é um exercício, não um incidente que estou atribuindo à minha experiência.”

### 65. Uma rota retorna dados corretos, mas de outro tenant. O que você verifica?

**Resposta — simulação de segurança:** “Eu trataria como incidente de autorização e conteria o acesso primeiro. Conferiria de onde vem o tenant confiável, se cada consulta inclui o escopo e se serviços/jobs também preservam esse contexto. Não aceitaria tenant ID do body como autorização. Criaria testes cruzados entre dois tenants para leitura, escrita, listagem, cache e tarefas assíncronas; verificaria logs para estimar exposição sem registrar payload sensível. Depois revisaria índices/chaves únicas com tenant no escopo e invalidação de cache. É exercício hipotético, não relato de vazamento ocorrido.”

### 66. Explique o caminho de uma requisição full-stack sua.

**Resposta — MSPA, escopo real:** “Na MSPA, meu trabalho podia começar numa regra/necessidade do produto, passar por UI em Angular/TypeScript ou React, chamar uma API interna, aplicar regra no serviço Go e persistir/consultar SQL ou PostgreSQL. Eu participava de implementação entre camadas, depuração, testes e entrega. Um exemplo de produto é o fluxo de consentimento: a UI embutida fala com serviços de borda e eventos de auditoria, enquanto a configuração é gerenciada pelo Compass. Para uma rota específica, eu explicaria o contrato e o código que toquei; não vou inventar nomes de endpoints nem afirmar que fui dono de todo o sistema.”

### 67. Como decide se uma validação deve ficar no cliente ou no servidor?

**Resposta:** “No cliente, valido cedo para orientar e reduzir ida e volta: formato, campos obrigatórios e feedback imediato. No servidor, repito qualquer regra que proteja integridade, autorização ou invariantes, porque o cliente pode ser alterado ou ignorado. Regras de negócio importantes deveriam ter uma representação clara e testes; se for possível compartilhar schema, ainda assim o servidor permanece autoridade. Em produtos com dados sensíveis, valido também limites, normalização e o que é registrado em logs.”

### 68. Como você reage se o entrevistador pressiona por números que não tem?

**Resposta:** “Eu digo exatamente o que consigo sustentar. Por exemplo: ‘Tínhamos mais de dez empresas usando Compass, e acompanhávamos conclusão e tempo do fluxo com funis; eu não tenho o valor antes/depois para afirmar uma redução’. Depois explico o critério de decisão ou o comportamento que verificávamos. Se a empresa precisa daquela métrica, posso dizer qual dado eu buscaria no sistema, mas não vou inventá-la.”

## Treino de formato

Para cada resposta, pratique três versões: 20 segundos com conclusão e evidência; 60 segundos com contexto, decisão, ação e resultado verificável; aprofundamento de 2 minutos com trade-offs e detalhes técnicos. Faça pausa depois da resposta principal para deixar espaço a perguntas de follow-up.
