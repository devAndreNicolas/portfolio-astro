# Fundamentos técnicos Q&A

## Como você trabalha de ponta a ponta?

“Começo entendendo o problema, usuários, regras e critérios de aceitação. Depois separo o fluxo por camadas, defino contratos e permissões, implemento frontend e backend quando necessário, testo os comportamentos críticos e acompanho logs e feedback após a entrega.”

## Como pensa em autorização?

“Não trato autorização como apenas esconder um botão. A regra precisa ser aplicada no limite de dados e operações, com capacidades derivadas do papel, validação de associação e testes de comportamento. Essa abordagem aparece nos projetos com ownership, membership e transições de estado.”

## Como debuga produção?

“Primeiro preservo o impacto e reproduzo o contexto. Depois uso logs, status, rastreamento e sinais do cliente para localizar a camada, verifico a hipótese com o código e aplico uma correção pequena e testável. Por fim, adiciono um teste, alerta ou mudança de contrato para reduzir a repetição.”

## Como aprendeu Go?

“Go foi uma das tecnologias mais difíceis para mim porque exigiu adaptação a concorrência e arquitetura hexagonal. Estudei o código existente, pratiquei em uma automação, fiz perguntas pontuais e usei IA para entender padrões. O aprendizado só ficou confiável quando consegui aplicar e testar em uma tarefa real.”

## Como decide entre soluções?

“Defino primeiro o problema e os riscos. Comparo alternativas por correção, segurança, manutenção, custo operacional e experiência do usuário. Se a decisão depende de uma hipótese de produto, busco validação antes de investir em uma implementação maior.”

## Como fala sobre lacunas?

Use: “Tenho contato com conceitos próximos, mas não vou afirmar experiência de produção que não tenho. Minha experiência comprovada está em X; para Y, eu começaria entendendo os padrões do sistema, lendo a documentação e validando uma pequena entrega com o time.”
