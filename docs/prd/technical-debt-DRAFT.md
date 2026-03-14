# Technical Debt Assessment - DRAFT

**Status:** Para Revisao dos Especialistas
**Projeto:** SalesMaster Roleplay (Projeto-Flavio-Augusto)
**Data:** 2026-03-14
**Consolidado por:** @architect (Aria)

---

## 1. Debitos de Sistema

*Fonte: docs/architecture/system-architecture.md*

### CRITICOS

| ID | Debito | Impacto | Horas Est. |
|----|--------|---------|-----------|
| SYS-01 | App.tsx monolitico (521 linhas) | Manutencao impossivel, tudo em 1 arquivo | 8-12h |
| SYS-02 | Zero testes (0% cobertura) | Regressoes inevitaveis, deploy inseguro | 16-24h |
| SYS-03 | TypeScript sem strict mode | Bugs de tipo nao detectados em compile time | 4-6h |
| SYS-04 | API Key exposta no client-side | Chave Gemini visivel no bundle, risco de abuso | 8-12h |

### ALTOS

| ID | Debito | Impacto | Horas Est. |
|----|--------|---------|-----------|
| SYS-05 | useState<any> para session | Type safety comprometida, bugs em runtime | 2-3h |
| SYS-06 | Sem Error Boundary | Crash silencioso sem recovery | 3-4h |
| SYS-07 | audioQueue sem limite de tamanho | Memory leak em sessoes longas (>30min) | 2-3h |
| SYS-08 | Sem sanitizacao de input | Prompt injection via nome/descricao do produto | 3-4h |
| SYS-09 | Console.log em producao (4x) | Vazamento de info no console do browser | 1h |
| SYS-10 | Sem loading states no init da API | Cliques multiplos, sessoes duplicadas | 2-3h |

### MEDIOS

| ID | Debito | Impacto | Horas Est. |
|----|--------|---------|-----------|
| SYS-11 | Valores hardcoded (modelo, voz) | Dificil trocar config sem rebuild | 1-2h |
| SYS-12 | Sem memoizacao (useMemo/useCallback) | Re-renders desnecessarios | 2-3h |
| SYS-13 | Express instalado mas nao usado | Dependencia morta no bundle | 0.5h |
| SYS-14 | Sem routing (SPA sem rotas) | Limitacao para expansao | 4-6h |
| SYS-15 | Cleanup de refs incompleto | Possivel memory leak | 2-3h |

---

## 2. Debitos de Database

**NAO APLICAVEL** - Projeto nao possui banco de dados.

O sistema e stateless, baseado em sessoes de audio em tempo real com a API Gemini. Nao ha persistencia de dados, historico de sessoes ou autenticacao de usuarios.

---

## 3. Debitos de Frontend/UX

*Fonte: docs/frontend/frontend-spec.md*
> PENDENTE: Revisao do @ux-design-expert

### CRITICOS

| ID | Debito | Impacto | Horas Est. |
|----|--------|---------|-----------|
| UX-01 | Sem feedback de erro para usuario | Falha de API/mic = tela congelada | 4-6h |
| UX-02 | Sem loading states | Confusao durante conexao API | 3-4h |

### ALTOS

| ID | Debito | Impacto | Horas Est. |
|----|--------|---------|-----------|
| UX-03 | Zero acessibilidade (aria, roles, focus) | Exclusao de usuarios com deficiencia | 8-12h |
| UX-04 | Sem design system / component library | Inconsistencia visual, retrabalho | 12-16h |
| UX-05 | Sem tratamento de mic denied | Mic negado = nada acontece | 2-3h |
| UX-06 | Sem indicador "IA falando" vs "IA ouvindo" | Usuario nao sabe quando falar | 3-4h |

### MEDIOS

| ID | Debito | Impacto | Horas Est. |
|----|--------|---------|-----------|
| UX-07 | Sem historico de sessoes | Sem tracking de evolucao | 12-16h |
| UX-08 | Sem tela de resultados pos-sessao | Sem sumario da performance | 6-8h |
| UX-09 | Sem empty states | Areas em branco quando sem dados | 2-3h |
| UX-10 | Sem onboarding/tutorial | Primeiro uso confuso | 4-6h |
| UX-11 | Sem feedback visual "conectando" | Botao nao responde visualmente | 1-2h |

---

## 4. Matriz Preliminar de Priorizacao

| Prioridade | ID | Debito | Esforco | Impacto | ROI |
|-----------|-----|--------|---------|---------|-----|
| P0 | SYS-04 | API Key exposta | 8-12h | CRITICO (seguranca) | Alto |
| P0 | SYS-01 | App.tsx monolitico | 8-12h | CRITICO (manutencao) | Alto |
| P0 | SYS-02 | Zero testes | 16-24h | CRITICO (qualidade) | Alto |
| P1 | UX-01 | Sem feedback de erro | 4-6h | CRITICO (UX) | Alto |
| P1 | SYS-08 | Sem sanitizacao input | 3-4h | ALTO (seguranca) | Alto |
| P1 | SYS-03 | TS sem strict mode | 4-6h | CRITICO (type safety) | Medio |
| P1 | UX-02 | Sem loading states | 3-4h | CRITICO (UX) | Alto |
| P2 | SYS-06 | Sem Error Boundary | 3-4h | ALTO | Medio |
| P2 | UX-03 | Zero acessibilidade | 8-12h | ALTO (inclusao) | Medio |
| P2 | UX-06 | Sem indicador IA estado | 3-4h | ALTO (UX) | Alto |
| P2 | SYS-07 | audioQueue sem limite | 2-3h | ALTO (performance) | Alto |
| P3 | UX-04 | Sem design system | 12-16h | ALTO (longo prazo) | Baixo |
| P3 | SYS-12 | Sem memoizacao | 2-3h | MEDIO | Medio |
| P3 | UX-07 | Sem historico | 12-16h | MEDIO (feature) | Baixo |

---

## 5. Estimativa Geral

| Categoria | Debitos | Horas Min | Horas Max |
|-----------|---------|-----------|-----------|
| Sistema (CRITICO) | 4 | 36 | 54 |
| Sistema (ALTO) | 6 | 13 | 18 |
| Sistema (MEDIO) | 5 | 10 | 15 |
| Frontend/UX (CRITICO) | 2 | 7 | 10 |
| Frontend/UX (ALTO) | 4 | 25 | 35 |
| Frontend/UX (MEDIO) | 5 | 25 | 35 |
| **TOTAL** | **26** | **116** | **167** |

---

## 6. Perguntas para Especialistas

### Para @ux-design-expert:
1. A falta de design system justifica criar um completo ou apenas padronizar os componentes existentes?
2. Qual abordagem de acessibilidade priorizar: ARIA labels primeiro ou reestruturacao semantica completa?
3. O indicador de estado da IA (falando/ouvindo) deve ser visual, sonoro ou ambos?

### Para @data-engineer:
- N/A - Projeto sem banco de dados

---

*DRAFT consolidado por @architect (Aria) - Aguardando revisao dos especialistas*
