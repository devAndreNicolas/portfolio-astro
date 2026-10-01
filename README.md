# André Nicolas — portfolio e career kit

Este repositório mantém duas áreas separadas de propósito:

- `src/`: portfolio Astro público.
- `career/`: evidências profissionais, vagas, fontes LaTeX e análise de CV.

O portfolio e a biblioteca pública de PDFs estão em produção. A rota `/cv/` permite baixar os currículos canônicos e `/career/` mostra o painel operacional não indexado. Nenhuma delas é colocada na navegação ou no sitemap.

## Operação diária

Você não preenche formulários, JSONs, comandos ou uma fila por vaga. O harness do agente trata `career/applications/` como a entrada única e executa, em ordem, coleta, deduplicação, análise, priorização, atualização da memória profissional, otimização dos CVs e atualização do dashboard. O agente decide o CV-base e cria um derivado somente quando a vaga justifica; melhorias factuais e reutilizáveis entram nos CVs canônicos.

GitHub não participa dessa inteligência. Ele só compila fontes LaTeX já aprovadas em PDFs e os disponibiliza na rota `/cv/`.

Na prática, você só pode dizer **“rode a rotina de carreira”** (ou continuar a conversa normalmente quando estivermos tratando de vagas). Não precisa mencionar uma vaga, escolher um CV, criar arquivo ou preencher parâmetros. Eu leio o corpus existente, processo o que ainda não foi tratado e deixo `career/`, `/career/` e os CVs coerentes entre si.

O único ato externo que permanece seu é enviar a candidatura. Se houver informação que não possa ser inferida com segurança — disponibilidade, pretensão, autorização de trabalho ou uma experiência nova — eu agrupo as perguntas necessárias em vez de interromper o processo a cada vaga.

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
