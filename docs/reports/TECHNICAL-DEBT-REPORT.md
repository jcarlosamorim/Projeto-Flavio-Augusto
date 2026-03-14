# Relatorio de Debito Tecnico

**Projeto:** SalesMaster Roleplay
**Data:** 2026-03-14
**Versao:** 1.0
**Elaborado por:** @analyst (Alex)

---

## Executive Summary

### Situacao Atual

O SalesMaster Roleplay e uma aplicacao inovadora de treinamento de vendas com IA em tempo real, construida sobre a metodologia de 7 passos de Flavio Augusto. A tecnologia core (Google Gemini Live API com audio nativo) e impressionante e funcional.

Contudo, a aplicacao foi desenvolvida como um prototipo rapido, com todo o codigo em um unico arquivo de 521 linhas, sem testes, sem protecao de credenciais e sem tratamento de erros para o usuario. Isso significa que a aplicacao funciona para demonstracoes, mas apresenta riscos significativos para uso em producao.

A boa noticia: os debitos identificados sao todos resolviveis em 6-8 semanas, e a base tecnologica (React 19, Vite, Tailwind, Gemini) e moderna e solida. O investimento necessario e modesto comparado ao valor que a aplicacao pode gerar.

### Numeros Chave

| Metrica | Valor |
|---------|-------|
| Total de Debitos | 30 |
| Debitos Criticos | 7 |
| Debitos Altos | 10 |
| Esforco Total | 150-200 horas |
| Custo Estimado | R$ 22.500 - R$ 30.000 |
| Timeline | 6-8 semanas |

### Recomendacao

Investir na resolucao dos debitos tecnicos em 4 sprints de 2 semanas, priorizando seguranca (Sprint 1) e qualidade (Sprint 2). O custo de R$ 22.500-30.000 e significativamente menor que o risco de expor a chave da API (custo potencial: R$ 50.000+/mes em uso indevido) e a perda de usuarios por UX incompleta.

---

## Analise de Custos

### Custo de RESOLVER

| Categoria | Horas | Custo (R$ 150/h) |
|-----------|-------|-----------------|
| Seguranca + Fundacao (Sprint 1) | 40h | R$ 6.000 |
| Qualidade + UX Core (Sprint 2) | 45h | R$ 6.750 |
| Design System + Features (Sprint 3) | 40h | R$ 6.000 |
| Acessibilidade + Polish (Sprint 4) | 30h | R$ 4.500 |
| **TOTAL** | **155h** | **R$ 23.250** |

*Com buffer de contingencia (30%): R$ 30.000 / 200h*

### Custo de NAO RESOLVER (Risco Acumulado)

| Risco | Probabilidade | Impacto | Custo Potencial |
|-------|---------------|---------|-----------------|
| Abuso da API Key exposta | Alta (90%) | Critico | R$ 50.000+/mes |
| Perda de usuarios por UX incompleta | Alta (70%) | Alto | R$ 20.000/mes em churn |
| Processo por acessibilidade | Baixa (10%) | Alto | R$ 100.000+ |
| Bugs nao detectados (sem testes) | Alta (80%) | Medio | R$ 5.000/incidente |
| Velocidade dev reduzida (monolito) | Certa (100%) | Alto | R$ 3.000/mes overhead |

**Custo potencial de nao agir: R$ 75.000+ nos primeiros 3 meses**

---

## Impacto no Negocio

### Seguranca (URGENTE)
- **Problema:** A chave da API do Google Gemini esta visivel no codigo que chega ao browser do usuario. Qualquer pessoa pode inspecionar o codigo e usar a chave para fazer chamadas ilimitadas a API, gerando custos para o projeto.
- **Resolucao:** Implementar um servidor intermediario que protege a chave. Custo: R$ 1.500 (10h).
- **Impacto:** Eliminacao completa do risco de abuso financeiro.

### Experiencia do Usuario
- **Problemas atuais:** 7 situacoes onde o usuario fica "perdido" (erro sem mensagem, tela travada, sem saber quando falar)
- **Apos resolucao:** Experiencia fluida com feedback claro em cada momento
- **Impacto estimado:** Reducao de 40-60% na taxa de abandono

### Qualidade do Codigo
- **Atualmente:** Todo codigo em 1 arquivo, sem testes, qualquer mudanca pode quebrar tudo
- **Apos resolucao:** Codigo organizado, 70%+ testado, mudancas seguras
- **Impacto:** Tempo para implementar novas features reduzido em 50-60%

### Acessibilidade
- **Atualmente:** Inacessivel para usuarios com deficiencia visual ou motora
- **Apos resolucao:** Conformidade WCAG 2.1 AA
- **Impacto:** Mercado expandido + conformidade legal

### Manutenibilidade
- **Tempo medio para novo feature atualmente:** 3-5 dias (risco alto de regressao)
- **Apos resolucao:** 1-2 dias (com testes garantindo estabilidade)
- **Impacto:** +60% velocidade de entrega de novas funcionalidades

---

## Timeline Recomendado

### Sprint 1: Seguranca + Fundacao (Semanas 1-2)
- Proteger chave da API (backend proxy)
- Reorganizar codigo (decomposicao)
- Ativar verificacao de tipos rigorosa
- Setup de pipeline automatizado
- **Custo:** R$ 6.000
- **ROI:** Imediato - elimina risco financeiro critico

### Sprint 2: Qualidade + UX Core (Semanas 3-4)
- Implementar testes automatizados (70%+ cobertura)
- Adicionar feedback de erro para usuario
- Indicadores de estado (carregando, IA falando, IA ouvindo)
- Tratamento de microfone negado
- **Custo:** R$ 6.750
- **ROI:** Reducao imediata de abandono de usuarios

### Sprint 3: Design System + Features (Semanas 5-6)
- Criar componentes reutilizaveis (Button, Card, Input)
- Tela de resultados apos sessao de roleplay
- Otimizacoes de performance
- Implementar navegacao entre paginas
- **Custo:** R$ 6.000
- **ROI:** Fundacao para crescimento sustentavel

### Sprint 4: Acessibilidade + Polish (Semanas 7-8)
- Acessibilidade completa (WCAG 2.1 AA)
- Estados vazios, onboarding, feedback tatil
- Modo claro/escuro (opcional)
- Historico de sessoes (se aprovado)
- **Custo:** R$ 4.500
- **ROI:** Mercado expandido, conformidade legal

---

## ROI da Resolucao

| Investimento | Retorno Esperado |
|--------------|------------------|
| R$ 23.250 (resolucao base) | R$ 75.000+ (riscos evitados em 3 meses) |
| 155 horas de desenvolvimento | +60% velocidade de entrega |
| 6-8 semanas de projeto | Produto sustentavel e escalavel |

**ROI Estimado: 3.2:1 em 3 meses**

Para cada R$ 1 investido na resolucao dos debitos, evita-se R$ 3,20 em riscos, retrabalho e perda de receita nos primeiros 3 meses.

---

## Proximos Passos

1. [ ] Aprovar investimento de R$ 23.250 - R$ 30.000
2. [ ] Alocar desenvolvedor(es) para 6-8 semanas
3. [ ] **URGENTE:** Resolver exposicao da API Key (SYS-04) - risco ativo
4. [ ] Iniciar Sprint 1 (Seguranca + Fundacao)
5. [ ] Revisar progresso a cada 2 semanas

---

## Anexos

- [Assessment Tecnico Completo](../prd/technical-debt-assessment.md)
- [Arquitetura do Sistema](../architecture/system-architecture.md)
- [Especificacao de Frontend](../frontend/frontend-spec.md)
- [Review Database](../reviews/db-specialist-review.md)
- [Review UX](../reviews/ux-specialist-review.md)
- [Review QA](../reviews/qa-review.md)

---

*Relatorio elaborado por @analyst (Alex) para awareness executivo*
*Dados validados por @architect, @ux-design-expert e @qa*
