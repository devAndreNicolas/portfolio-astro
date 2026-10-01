# Fila estruturada de tailoring

Cada arquivo `*.json` desta pasta é uma solicitação de currículo para uma vaga. Este é o contrato entre você e o agente: em vez de escrever um prompt livre, crie uma solicitação a partir de `_template.json`, preencha os campos e deixe `status` como `ready`.

## Seu fluxo

1. Garanta que a descrição da vaga exista em `career/applications/` (coletada ou salva manualmente).
2. Copie `_template.json` para um nome estável, por exemplo `acme-frontend-engineer-2026-10-01.json`.
3. Preencha `id`, `job.source`, idioma, CV-base e prioridades. Use `baseCv: "auto"` se quiser que o agente escolha.
4. Rode `pnpm tailoring:check`. Corrija qualquer erro e faça commit.
5. No chat, diga apenas: **processe a fila de tailoring** (ou informe o `id`).

O agente mudará o status e preencherá `result` ao concluir, pedir informação ou registrar a revisão. Um pedido `ready` nunca deve conter alegações novas; `priorities` define apenas o que deve receber destaque quando houver evidência.

## Estados

- `draft`: ainda está sendo preenchido; o agente não processa.
- `ready`: pronto para análise.
- `needs-input`: faltou uma informação material; responda às perguntas em `result.questions`, então volte para `ready`.
- `needs-review`: existe um CV derivado para sua aprovação.
- `completed`: revisão concluída e resultado registrado.

## Privacidade e publicação

O padrão é `delivery: "private"`: a fonte e o CV derivado ficam sob `career/` e não entram no deploy Vercel. Defina `public` somente quando você realmente quiser disponibilizar esse PDF; a publicação requer uma entrada explícita no manifesto e revisão do agente.
