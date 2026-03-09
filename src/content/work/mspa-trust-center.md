---
title: MSPA Trust Center
publishDate: 2026-03-09
description: |
  Infraestrutura de transparência global. Engine de consentimento agnóstica baseada em Web Components e processamento distribuído em Edge Computing (KV, D1, Workers).
tags:
  - Lit
  - Web Components
  - Edge Computing
  - Cloudflare D1
  - Cloudflare KV
---

## Visão Geral

O **Trust Center** é a camada de interface pública entre as empresas e os titulares de dados. O desafio era criar uma solução que fosse, simultaneamente, **extremamente leve** para não afetar o SEO dos clientes e **tecnologicamente agnóstica**, permitindo a integração em qualquer ecossistema web (React, Vue, WordPress ou HTML puro) sem conflitos de dependências ou overhead de performance.

## Engenharia de Componentes Agnósticos (Lit)

Diferente de soluções presas a frameworks pesados, projetei o Trust Center como uma biblioteca de **Web Components**:
* **Zero Framework Overlap:** Desenvolvi a engine utilizando **Lit** e **Shadow DOM**, garantindo que o componente seja injetável em qualquer site sem sofrer interferência do CSS ou JS hospedeiro.
* **Engine de Bloqueio:** Implementei um sistema de interceptação de scripts de terceiros que atua diretamente no navegador, garantindo conformidade rigorosa com a LGPD com um bundle final de tamanho mínimo.

## Arquitetura de Borda (Edge Computing)

Para atingir latência próxima de zero e alta disponibilidade global, projetei a infraestrutura utilizando a stack serverless da Cloudflare:
* **Cloudflare KV (Key-Value):** Utilizado para armazenamento de alta velocidade de leitura das configurações de conformidade. Isso permite que a engine decida quais scripts bloquear em milissegundos, antes mesmo do carregamento da página.
* **Cloudflare D1 & Durable Objects:** Implementados para gerenciar estados de consentimento transacionais e persistência SQL na borda, reduzindo drasticamente a latência de resposta e otimizando o custo de processamento de dados massivos.
* **Cloudflare Workers:** Toda a lógica de roteamento e aplicação de políticas de privacidade ocorre diretamente no ponto de presença (PoP) mais próximo do usuário.

## Integração com o Ecossistema Compass

Embora o componente de interface seja agnóstico para o cliente final, ele é alimentado por uma inteligência de gestão robusta:
* **Sincronização de Dados:** O Trust Center comunica-se de forma transparente com o painel administrativo do **Compass** (construído em **Angular 18+**), onde as políticas configuradas pelos gestores são propagadas para a borda.
* **Arquitetura Desacoplada:** Esta separação permitiu que o painel de gestão fosse denso e complexo, enquanto o componente de face pública permanecesse focado em performance crítica e isolamento técnico.

## Destaques Técnicos
* **Interface:** Lit (Web Components), TypeScript, Shadow DOM.
* **Infra:** Cloudflare Workers, KV, D1, Durable Objects.
* **Performance:** Foco em latência sub-100ms e impacto mínimo em Core Web Vitals.

## Impacto
O Trust Center tornou-se uma solução de "Privacidade como Serviço" escalável. A natureza agnóstica permitiu uma adoção rápida por clientes com diferentes stacks, enquanto a arquitetura em Edge garantiu que a conformidade técnica não custasse a performance do site final.