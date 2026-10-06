# Full career pipeline control

Este arquivo é o contrato de execução entre André Nicolas e o agente. Marcar o gatilho abaixo autoriza uma rodada completa e autônoma. O agente não pode reduzir a rodada a executar scripts, atualizar scores ou validar o manifesto.

## Gatilho

- [ ] EXECUTAR ROTINA COMPLETA DE CARREIRA

Ao encontrar `[x]`, o agente deve executar todas as fases deste arquivo na mesma rodada. O checkbox só pode voltar para `[ ]` depois que os gates de conclusão forem atendidos e o resultado for registrado. Se houver bloqueio factual, o agente conclui tudo que for possível, mantém o gatilho marcado, registra o bloqueio e faz uma única lista consolidada de perguntas.

## Objetivo final obrigatório

Transformar todo o conhecimento existente no repositório em CVs canônicos factualmente sustentados, ATS-safe, claros para recrutadores e alinhados às vagas coletadas. Analisar e otimizar individualmente todos os CVs de `career/cvs/manifest.json`; criar ou registrar novas variantes quando o corpus demonstrar que nenhum CV atual representa bem um cargo relevante; exportar uma avaliação estruturada completa para o dashboard; deixar as fontes `.tex` prontas para o usuário revisar, fazer commit e push. No GitHub, a única responsabilidade é compilar os `.tex`, publicar os PDFs configurados no manifesto e disponibilizá-los em `/cv/`.

## Definições de score

- **Synergy:** cobertura ponderada das exigências reconhecidas de uma vaga por evidências reais. Não é probabilidade de aprovação e não deve ser elevada por keyword stuffing ou invenção.
- **CV readiness:** checklist controlável de qualidade do currículo. Cada CV precisa terminar em **100/100**: factual grounding, estrutura ATS, alinhamento ao cargo, qualidade do idioma, clareza para recrutador, integridade técnica da fonte e qualidade editorial comprovada pelo gate de conteúdo.
- Uma lacuna real da carreira reduz synergy e vira dado de mercado; ela não impede readiness 100 quando o CV a trata honestamente.

## Fontes obrigatórias — ler todas, sem amostragem

1. `AGENTS.md` e todas as skills de carreira em `.agents/skills/`.
2. `career/profile/master-career.md` e fontes de portfolio/projetos que sustentem ou contradigam claims.
3. `career/market/2026-positioning.md`, `career/ats/taxonomy.json`, `career/roles/catalog.json` e recomendações geradas.
4. Todos os arquivos válidos em `career/applications/`, o índice de coleta e todos os relatórios de análise.
5. Todos os `.tex`, includes, manifesto, schema, PDFs públicos existentes e auditorias de CV.
6. Configurações de plataformas/coleta, specs do sistema, outputs e histórico da última operação.
7. Estado atual do Git: preservar mudanças do usuário e não sobrescrever trabalho não relacionado.

## Rotina completa obrigatória

### 1. Inventário e preservação

- Registrar commit/base atual, arquivos modificados e todos os inputs disponíveis.
- Criar um `runId` e manter histórico sem apagar a última evidência útil.
- Ler o manifesto dinamicamente; nunca trabalhar com uma lista hard-coded de CVs.

### 2. Coleta e normalização de vagas

- Executar a coleta Brasil com os providers configurados, respeitando deduplicação e recência.
- Preservar descrições já coletadas; registrar rejeições, bloqueios e motivos.
- Executar análise determinística de todas as vagas, recomendações de cargos e buscas.
- Não tratar score alto com poucos requisitos reconhecidos como prova automática de boa vaga.

### 3. Reconciliação de memória e evidências

- Confrontar Master Career Document, portfolio, projetos, CVs e requisitos recorrentes.
- Adicionar ao Master Career Document somente fatos sustentados por fonte e evidence ID.
- Separar: claims comprovadas, temas de posicionamento, sinais de mercado e lacunas reais.
- Registrar conflitos e nunca completar experiência por inferência não comprovada.

### 4. Análise de mercado e personas

- Agrupar vagas por cargo, idioma, senioridade, stack, responsabilidades, produto e mercado.
- Identificar padrões recorrentes, requisitos obrigatórios, diferenciais e gaps.
- Gerar cargos recomendados e consultas de busca com score e base observável.
- Avaliar cada CV como ATS, recrutador generalista, recrutador técnico e hiring manager.

### 5. Otimização individual de todos os CVs

Para **cada ID do manifesto**, sem exceção:

1. Ler fonte `.tex`, PDF anterior quando disponível, família de cargo, idioma e vagas relacionadas.
2. Montar tabela requisito → evidence IDs → claim permitida → localização proposta no CV.
3. Auditar toda claim atual; remover, corrigir ou qualificar qualquer claim sem sustentação.
4. Otimizar título, resumo, experiência, skills, projetos, formação e palavras-chave naturais para a família de cargo.
5. Priorizar resultados, escopo, ownership, produto, qualidade e stack comprovados; evitar boilerplate repetitivo.
6. Para cada experiência e projeto, escrever conteúdo específico com a lógica **contexto → ação → evidência/efeito** (STAR/CAR sem usar o rótulo no CV). Resultado só pode ser numérico quando houver evidência; caso contrário, explicitar escopo, decisão, salvaguarda ou comportamento implementado.
7. Layout compartilhado pode ser reutilizado, mas experiência, projetos, resumo e competências precisam ser específicos da família de cargo; um novo CV não pode ser apenas título e palavras-chave sobre um bloco genérico.
8. Manter uma coluna, headings convencionais, contatos literais, texto selecionável, datas consistentes, sem tabelas, gráficos, skill bars ou ícones sem texto.
9. Revisar português/inglês como texto profissional do contexto, preservando a credencial brasileira corretamente.
10. Executar `pnpm cv:content:check`; ele exige profundidade mínima, projetos detalhados e sinais de contexto/ação/evidência. Calcular readiness somente depois de passar esse gate; iterar até 100/100 ou registrar bloqueio factual explícito.
11. Registrar jobs usados, evidence IDs, alterações, gaps rejeitados e decisão no structured output.

### 6. Criação de novos CVs

- Comparar cargos recomendados com as famílias e idiomas existentes no manifesto.
- Criar um novo CV quando houver demanda recorrente e evidência suficiente para uma narrativa materialmente diferente.
- Se ainda não houver evidência suficiente, registrar como `planned`, com motivo, dados de demanda e evidências faltantes; não criar um PDF vazio ou duplicado.
- Todo novo CV aprovado entra no manifesto e passa pelos mesmos gates dos existentes.

### 7. Structured output obrigatório

Produzir/atualizar:

- `career/operations/agent-evaluation.json` — julgamento do agente para cada CV, conforme seu schema.
- `career/operations/report.json` — visão consolidada consumida pelo dashboard.
- `career/applications/analysis/index.json` — análise determinística completa.
- `career/roles/recommendations.json` — cargos e buscas recomendados.
- `src/data/career-dashboard.json` — snapshot público sanitizado.
- `career/operations/runs/<runId>.json` — histórico imutável da rodada.

O output deve incluir todos os CV IDs, readiness por dimensão, synergy agregada, vagas/fontes usadas, evidence IDs, mudanças realizadas, claims rejeitadas, gaps, novas variantes e validações. Não pode conter secrets nem conteúdo sensível de repositórios privados.

### 8. QA e gates finais

- Executar testes de aplicações e cargos.
- Executar `pnpm cv:check`, `pnpm cv:content:check`, `pnpm career:verify` e `pnpm validate`.
- Quando houver compilador local, compilar/verificar PDFs e extração de texto. Sem compilador local, registrar `pdfCompilation: pending-ci`, sem alegar verificação concluída.
- Confirmar que `/career/` consome o relatório consolidado e `/cv/` usa somente o manifesto.
- Confirmar que GitHub Actions continua restrito a compilação/publicação de PDFs.

## Condições para desmarcar o gatilho

- Todos os CVs do manifesto aparecem em `agent-evaluation.json`.
- Todos os CVs não bloqueados têm readiness 100/100.
- Todo bloqueio tem causa, impacto e pergunta factual consolidada.
- Novas variantes foram criadas ou registradas como planned com justificativa.
- Structured outputs e histórico da rodada foram escritos sem perda dos anteriores.
- Testes e validações foram executados e seus resultados registrados.
- `git diff` foi revisado; nenhuma alteração do usuário foi descartada.

## Estado da execução

- Status: `complete`
- Run ID: `2026-10-06-full-career-002`
- Início: `2026-10-06T15:08:00Z`
- Fim: `2026-10-06T15:14:00Z`
- Resultado: coleta Brasil não encontrou novas vagas oficiais; o corpus local de 40 vagas foi reanalisado. Full Stack Engineer (82), AI Product Engineer (81) e Software Engineer (81) permanecem as prioridades. Todas as 16 fontes canônicas foram verificadas como factualmente sustentadas, específicas ao cargo, ATS-safe e aprovadas no gate de conteúdo. Testes de vagas/cargos, relatório/dashboard, verificação da operação e build do site passaram. Compilação dos PDFs permanece `pending-ci` porque não há `latexmk` nem Tectonic localmente.
