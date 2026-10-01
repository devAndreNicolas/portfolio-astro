# André Nicolas — portfolio e career kit

Este repositório mantém duas áreas separadas de propósito:

- `src/`: portfolio Astro público.
- `career/`: evidências profissionais, vagas, fontes LaTeX e análise de CV.

O portfolio e a biblioteca pública de PDFs estão em produção. A rota `/cv/` permite baixar os currículos canônicos e `/career/` mostra o painel operacional não indexado. Nenhuma delas é colocada na navegação ou no sitemap.

## Uso diário: o fluxo que você segue

Você não precisa instalar LaTeX nem rodar scripts locais para o caminho normal.

1. Encontre uma vaga interessante e me envie a URL, o texto ou diga para eu coletar vagas para um recorte específico (por padrão, Brasil).
2. Eu salvo/atualizo a descrição em `career/applications/`, faço a análise determinística de requisitos e confronto a vaga com as evidências verificadas em `career/profile/master-career.md`.
3. Crie uma solicitação estruturada a partir de [`career/tailoring-requests/_template.json`](career/tailoring-requests/_template.json), rode `pnpm tailoring:check`, faça commit e diga somente `processe a fila de tailoring` (ou o ID). A [fila de tailoring](career/tailoring-requests/README.md) define todos os campos e estados.
4. Eu escolho o CV-base, explico lacunas reais e preparo um CV derivado em `career/applications/<empresa>-<cargo>/`. Não sobrescrevo um CV canônico para atender uma única vaga.
5. Eu também atualizo os relatórios, o painel e, quando houver base factual, posso melhorar os CVs canônicos. Todo texto externo continua ancorado em evidência: não inventamos empregadores, datas, métricas, tecnologias ou resultados.
6. Você revisa o conteúdo, faz commit e envia para `main`. O GitHub Actions compila os CVs canônicos com XeLaTeX, copia os PDFs para `public/cv/` e realiza o commit de publicação. Depois, você baixa em `/cv/` e envia a candidatura manualmente.

Em outras palavras: **vagas, análise e tailoring são feitos comigo neste chat; compilação/publicação do PDF é automática no GitHub após push ou execução manual do workflow.** O envio de candidatura e qualquer informação que só você conhece continuam manuais.

## Rotina recomendada

- Diariamente ou algumas vezes por semana: traga as vagas novas ou peça uma coleta focada. Eu elimino duplicadas, vagas antigas e incompatibilidades evidentes antes da análise.
- Para cada vaga boa: peça a análise e o CV derivado antes de se candidatar.
- Semanalmente: veja `/career/` para acompanhar o corpus, compatibilidade baseada em evidência e cobertura por CV; veja `/cv/` para confirmar que os PDFs públicos publicados são os esperados.
- Quando ganhar nova experiência, resultado, projeto ou formação: me envie a fonte/descrição. Eu a registro primeiro no Master Career Document e só então ela pode ser usada nos próximos currículos.

## O que é automático e o que não é

| Etapa | Responsável |
| --- | --- |
| Coletar conteúdo público de vagas, normalizar e analisar requisitos | Eu, quando você solicita aqui |
| Escolher evidências e escrever/ajustar CV | Eu, com sua revisão quando necessário |
| Versionar arquivos e decidir quando publicar | Você, via commit/push |
| Compilar os CVs canônicos e publicar PDFs | GitHub Actions |
| Enviar a candidatura e responder informações do formulário | Você |

O score exibido é cobertura de requisitos que possuem evidência documentada. Ele ajuda a priorizar e melhorar o texto, mas não é uma garantia de aprovação por ATS ou recrutador.

## Publicar PDFs sem instalar LaTeX

Ao alterar `career/cvs/` e fazer push para `main`, o workflow **Publish public CV PDFs** compila todas as fontes canônicas com XeLaTeX e atualiza `public/cv/`. Também pode ser disparado por **Actions → Publish public CV PDFs → Run workflow**.

Configuração única no GitHub:

1. Em **Settings → Actions → General**, habilite *Read and write permissions* para workflows.
2. Em **Settings → Secrets and variables → Actions → Variables**, defina `SITE_URL` com o domínio de produção (também mantenha-o no `.env` local).

Se `main` tiver proteção, autorize o bot do GitHub Actions a enviar o commit de PDFs ou adapte o processo para abrir PR.

O workflow atual publica as entradas canônicas presentes em `career/cvs/manifest.json`. Quando fizermos o primeiro CV específico de vaga que você queira disponibilizar na web, eu adiciono uma entrada explícita no manifesto e a publicação correspondente; CVs específicos não devem ser expostos por acidente.

## Comandos úteis (opcionais)

```bash
pnpm install
pnpm dev
pnpm validate
pnpm cv:list
pnpm cv:check
pnpm applications:report -- <parte-do-nome-da-vaga>
pnpm tailoring:check
```

`pnpm validate` verifica CVs e constrói o site. A instalação local de `latexmk`/XeLaTeX ou Tectonic só é necessária se você quiser gerar e inspecionar um PDF antes do push; o CI não depende dela na sua máquina. Veja [docs/cv-toolchain.md](docs/cv-toolchain.md) para detalhes do compilador.

## Regras de integridade

- `career/cvs/manifest.json` é a fonte única dos IDs, fontes e local público dos CVs canônicos.
- O Master Career Document é privado do deploy Vercel e nunca deve conter segredos nem detalhes sensíveis de repositórios privados.
- Um CV ATS é de uma coluna, texto selecionável, seções convencionais e sem tabelas, gráficos, ícones sem texto ou keyword stuffing.
- Mudanças materiais em fluxo, dados ou interface pública ganham especificação em `specs/`.

## Desenvolvimento

```bash
pnpm install
pnpm dev
pnpm validate
```

As skills portáteis do projeto vivem em `.agents/skills/`: memória profissional, tailoring, QA de CV e SEO do portfolio. `AGENTS.md` contém as regras operacionais que agentes devem cumprir.
