# Technical Debt Assessment - FINAL

**Projeto:** SalesMaster Roleplay (Projeto-Flavio-Augusto)
**Data:** 2026-03-14
**Consolidado por:** @architect (Aria)
**Validado por:** @data-engineer (Dara), @ux-design-expert (Uma), @qa (Quinn)

---

## Executive Summary

- **Total de debitos:** 30 (26 originais + 4 adicionados pela revisao UX)
- **Criticos:** 7 | **Altos:** 10 | **Medios:** 11 | **Baixos:** 2
- **Esforco total estimado:** 150-200 horas (com overhead real)
- **Custo estimado:** R$ 22.500 - R$ 30.000 (base R$ 150/h)

---

## Inventario Completo de Debitos

### Sistema (validado por @architect)

| ID | Debito | Sev. | Horas | Prior. | Dependencia |
|----|--------|------|-------|--------|-------------|
| SYS-01 | App.tsx monolitico (521 linhas) - decomposicao em hooks e componentes | CRITICO | 10h | P0 | - |
| SYS-02 | Zero testes (0% cobertura) - implementar Vitest + RTL | CRITICO | 20h | P0 | SYS-01 |
| SYS-03 | TypeScript sem strict mode - ativar e corrigir erros | CRITICO | 5h | P1 | SYS-01 |
| SYS-04 | API Key exposta no client-side - implementar backend proxy | CRITICO | 10h | P0 | - |
| SYS-05 | useState<any> para session - tipar corretamente | ALTO | 2h | P1 | SYS-03 |
| SYS-06 | Sem Error Boundary - implementar com fallback UI | ALTO | 4h | P1 | SYS-01 |
| SYS-07 | audioQueue sem limite - implementar cap de tamanho | ALTO | 2h | P1 | SYS-01 |
| SYS-08 | Sem sanitizacao de input - proteger contra prompt injection | ALTO | 4h | P1 | SYS-04 |
| SYS-09 | Console.log em producao - remover ou usar logger | MEDIO | 1h | P2 | - |
| SYS-10 | Sem loading states no init - prevenir cliques multiplos | ALTO | 3h | P1 | SYS-01 |
| SYS-11 | Valores hardcoded (modelo, voz) - extrair para config | MEDIO | 2h | P2 | - |
| SYS-12 | Sem memoizacao (useMemo/useCallback) | MEDIO | 3h | P2 | SYS-01 |
| SYS-13 | Express instalado mas nao usado - remover | MEDIO | 0.5h | P3 | - |
| SYS-14 | Sem routing - implementar React Router | MEDIO | 5h | P3 | SYS-01 |
| SYS-15 | Cleanup de refs incompleto no unmount | MEDIO | 2h | P2 | SYS-01 |
| SYS-16 | Sem CI/CD pipeline (gap do QA) | ALTO | 8h | P1 | - |

### Frontend/UX (validado por @ux-design-expert, severidades ajustadas)

| ID | Debito | Sev. | Horas | Prior. | Dependencia |
|----|--------|------|-------|--------|-------------|
| UX-01 | Sem feedback de erro para usuario | CRITICO | 5h | P0 | SYS-01, SYS-06 |
| UX-02 | Sem loading states (UX) | CRITICO | 4h | P0 | SYS-01 |
| UX-03 | Zero acessibilidade (aria, roles, focus) | CRITICO | 10h | P1 | UX-04 |
| UX-04 | Sem design system / component library | ALTO | 14h | P2 | SYS-01 |
| UX-05 | Sem tratamento de mic denied | ALTO | 3h | P1 | UX-01 |
| UX-06 | Sem indicador "IA falando" vs "IA ouvindo" | CRITICO | 4h | P0 | SYS-01 |
| UX-07 | Sem historico de sessoes | MEDIO | 14h | P3 | - |
| UX-08 | Sem tela de resultados pos-sessao | ALTO | 7h | P2 | SYS-01 |
| UX-09 | Sem empty states | MEDIO | 3h | P3 | UX-04 |
| UX-10 | Sem onboarding/tutorial | MEDIO | 5h | P3 | UX-04 |
| UX-11 | Sem feedback "conectando" | ALTO | 2h | P1 | UX-02 |
| UX-12 | Sem feedback haptico/sonoro (novo) | MEDIO | 2h | P2 | - |
| UX-13 | Scroll mobile nao gerenciado (novo) | ALTO | 3h | P1 | - |
| UX-14 | Sem dark/light mode toggle (novo) | BAIXO | 4h | P4 | UX-04 |
| UX-15 | Animacao audio visualizer muito sutil (novo) | MEDIO | 2h | P2 | UX-06 |

---

## Plano de Resolucao

### Sprint 1: Seguranca + Fundacao (Semanas 1-2)
**Esforco:** ~40h | **Foco:** Eliminar riscos criticos

| # | Debito | Horas | Agente |
|---|--------|-------|--------|
| 1 | SYS-04: Backend proxy para API Key | 10h | @dev |
| 2 | SYS-01: Decompor App.tsx (hooks + componentes) | 10h | @dev |
| 3 | SYS-08: Sanitizacao de input | 4h | @dev |
| 4 | SYS-03: Ativar TypeScript strict | 5h | @dev |
| 5 | SYS-16: Setup CI/CD basico | 8h | @devops |
| 6 | SYS-09: Remover console.logs | 1h | @dev |
| 7 | SYS-13: Remover express nao usado | 0.5h | @dev |

**Entregavel:** Codebase seguro, decomposicao, pipeline basico

### Sprint 2: Qualidade + UX Core (Semanas 3-4)
**Esforco:** ~45h | **Foco:** Testes + UX essencial

| # | Debito | Horas | Agente |
|---|--------|-------|--------|
| 1 | SYS-02: Implementar testes (Vitest + RTL) | 20h | @dev |
| 2 | UX-01: Feedback de erro | 5h | @dev |
| 3 | UX-02 + UX-11: Loading states + feedback conectando | 6h | @dev |
| 4 | UX-06: Indicador estado da IA | 4h | @dev |
| 5 | SYS-06: Error Boundary | 4h | @dev |
| 6 | UX-05: Tratamento mic denied | 3h | @dev |
| 7 | UX-13: Scroll mobile | 3h | @dev |

**Entregavel:** 70%+ test coverage, UX funcional sem dead ends

### Sprint 3: Design System + Resultados (Semanas 5-6)
**Esforco:** ~40h | **Foco:** Componentizacao + features

| # | Debito | Horas | Agente |
|---|--------|-------|--------|
| 1 | UX-04: Design system base (Button, Card, Input, Badge, ProgressBar) | 14h | @dev |
| 2 | UX-08: Tela de resultados pos-sessao | 7h | @dev |
| 3 | SYS-05: Tipar session corretamente | 2h | @dev |
| 4 | SYS-07: Cap audioQueue | 2h | @dev |
| 5 | SYS-12: Memoizacao | 3h | @dev |
| 6 | SYS-15: Cleanup de refs | 2h | @dev |
| 7 | SYS-11: Extrair config | 2h | @dev |
| 8 | SYS-14: Implementar routing | 5h | @dev |
| 9 | UX-15: Melhorar audio visualizer | 2h | @dev |

**Entregavel:** Componentes reutilizaveis, app completa

### Sprint 4: Acessibilidade + Polish (Semanas 7-8)
**Esforco:** ~30h | **Foco:** Inclusao + refinamento

| # | Debito | Horas | Agente |
|---|--------|-------|--------|
| 1 | UX-03: Acessibilidade completa (2 fases) | 10h | @dev |
| 2 | UX-09: Empty states | 3h | @dev |
| 3 | UX-10: Onboarding/tutorial | 5h | @dev |
| 4 | UX-12: Feedback haptico/sonoro | 2h | @dev |
| 5 | UX-14: Dark/light mode | 4h | @dev |
| 6 | UX-07: Historico de sessoes (se aprovado) | 14h | @dev |

**Entregavel:** WCAG AA compliance, UX polida

---

## Riscos e Mitigacoes

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|---------------|---------|-----------|
| API Key abuse antes da Sprint 1 | Alta | Critico | Prioridade maxima, resolver em dias, nao semanas |
| Decomposicao introduz bugs | Media | Alto | Escrever testes DURANTE decomposicao |
| Web Audio API incompativel em browsers | Media | Medio | Feature detection + fallback message |
| Gemini API muda (preview model) | Media | Alto | Abstrair em service layer durante decomposicao |
| Estimativas subestimadas | Alta | Medio | Buffer de 20-30% ja incluido nas 150-200h |

---

## Criterios de Sucesso

| Metrica | Atual | Alvo Sprint 2 | Alvo Sprint 4 |
|---------|-------|---------------|---------------|
| Test coverage | 0% | >= 70% | >= 80% |
| TypeScript strict | OFF | ON, 0 errors | ON, 0 errors |
| Lighthouse Performance | N/A | >= 85 | >= 90 |
| Lighthouse Accessibility | N/A | >= 70 | >= 90 |
| WCAG 2.1 AA | 0% | Parcial | Completo |
| Componentes com files proprios | 1 (tudo em App.tsx) | >= 10 | >= 15 |
| Bundle size | N/A | Medido | < 200KB gzip |
| Debitos criticos | 7 | 0 | 0 |

---

*Assessment Final consolidado por @architect (Aria) com inputs validados de @data-engineer, @ux-design-expert e @qa*
