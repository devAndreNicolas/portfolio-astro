# CVs para novas famílias de cargo

## Objetivo

Adicionar variantes brasileiras para Analista de Sistemas, Analista de Desenvolvimento de Sistemas e Desenvolvedor de Software, derivadas dos CVs canônicos atuais e adaptadas a requisitos observados em anúncios de vagas.

## Regras de conteúdo

- Cada variante terá resumo, competências e ênfase de projetos próprios; não será apenas uma troca de título.
- Manter toda afirmação profissional sustentada por `career/profile/master-career.md` e suas evidências.
- Não afirmar UML, BPMN, ITIL/COBIT, CRM, Oracle/PL-SQL/JPA ou ferramentas de suporte administrativo sem evidência específica.
- Preservar cargo de emprego real (Frontend Engineer), indicando o escopo de contribuição full-stack quando relevante.
- Não importar senioridade do título dos anúncios pesquisados.
- A pesquisa de mercado registra exemplos e variação entre vagas, não uma lista universal de requisitos.

## Publicação e ATS

- Registrar cada ID, fonte `.tex`, idioma e saída em `career/cvs/manifest.json`.
- PDFs públicos devem permanecer em coluna única, com texto selecionável e headings convencionais.
- `/cv/` permanece dirigido pelo manifesto; nenhuma rota ou filename é codificado manualmente.
- Executar `pnpm cv:check` após a edição de fontes/manifesto e verificar a construção conforme o skill `cv-qa`.

## Critérios de aceite

- As três variantes usam evidências distintas e coerentes com os cargos-alvo.
- Nenhuma lacuna vira competência afirmada para aumentar score ATS.
- O inventário do manifesto continua válido e os PDFs têm caminhos públicos exclusivos.
- O relatório de pesquisa apresenta fontes, data e limites de interpretação.

## Extensão posterior

Suporte N2, suporte a sistemas, suporte técnico, assistente administrativo e auxiliar administrativo só recebem CV próprio após classificar requisitos por subperfil e confirmar as tarefas/ferramentas já executadas. Competências desenvolvidas depois podem entrar como projetos ou treinamento claramente identificados.
