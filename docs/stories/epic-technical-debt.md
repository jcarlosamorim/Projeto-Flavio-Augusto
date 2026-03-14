# Epic: Resolucao de Debitos Tecnicos - SalesMaster Roleplay

**Epic ID:** EPIC-TD-001
**Status:** Draft
**Data:** 2026-03-14
**Owner:** @pm (Morgan)

---

## Objetivo

Transformar o SalesMaster Roleplay de prototipo funcional em aplicacao production-ready, resolvendo 30 debitos tecnicos identificados no Brownfield Discovery, garantindo seguranca, qualidade, acessibilidade e manutenibilidade.

---

## Escopo

### IN Scope
- Resolucao de todos os 30 debitos tecnicos identificados
- Seguranca da API Key (backend proxy)
- Decomposicao do monolito (App.tsx → hooks + componentes)
- Testes automatizados (>= 70% cobertura)
- TypeScript strict mode
- Design system base (5 componentes)
- Acessibilidade WCAG 2.1 AA
- CI/CD pipeline basico
- Loading states, error handling, indicadores de estado

### OUT of Scope
- Novas features de produto (alem das ja planejadas como debito)
- Backend complexo (apenas proxy para API Key)
- Autenticacao de usuarios
- Deploy em producao
- Integracao com outros servicos

---

## Criterios de Sucesso

| Metrica | Alvo |
|---------|------|
| Debitos criticos resolvidos | 7/7 (100%) |
| Test coverage | >= 70% |
| Lighthouse Performance | >= 90 |
| Lighthouse Accessibility | >= 90 |
| WCAG 2.1 AA | Completo |
| TypeScript strict | ON, 0 errors |

---

## Timeline

| Sprint | Semanas | Foco | Stories |
|--------|---------|------|---------|
| Sprint 1 | 1-2 | Seguranca + Fundacao | 1.1, 1.2, 1.3 |
| Sprint 2 | 3-4 | Qualidade + UX Core | 1.4, 1.5, 1.6 |
| Sprint 3 | 5-6 | Design System + Features | 1.7, 1.8 |
| Sprint 4 | 7-8 | Acessibilidade + Polish | 1.9, 1.10 |

---

## Budget

- **Estimativa:** R$ 23.250 - R$ 30.000
- **Horas:** 155-200h
- **Base:** R$ 150/h

---

## Stories

| ID | Titulo | Sprint | Horas | Prior. |
|----|--------|--------|-------|--------|
| 1.1 | Proteger API Key com backend proxy | 1 | 10h | P0 |
| 1.2 | Decompor App.tsx em hooks e componentes | 1 | 10h | P0 |
| 1.3 | Ativar TypeScript strict + Setup CI/CD | 1 | 14h | P0-P1 |
| 1.4 | Implementar testes automatizados | 2 | 20h | P0 |
| 1.5 | Error handling + loading states + indicador IA | 2 | 15h | P0-P1 |
| 1.6 | Tratamento de mic denied + scroll mobile | 2 | 6h | P1 |
| 1.7 | Design system base (5 componentes) | 3 | 14h | P2 |
| 1.8 | Tela de resultados + otimizacoes | 3 | 21h | P2 |
| 1.9 | Acessibilidade WCAG 2.1 AA | 4 | 10h | P1 |
| 1.10 | Polish: empty states, onboarding, historico | 4 | 30h | P3 |

---

## Dependencias

```
1.1 (API Key) ──────────────────────────────────→ independente
1.2 (Decomposicao) ────────────────────────────→ independente
1.3 (Strict + CI/CD) ──────────────────────────→ depende de 1.2
1.4 (Testes) ──────────────────────────────────→ depende de 1.2
1.5 (Error/Loading/IA state) ──────────────────→ depende de 1.2
1.6 (Mic denied + mobile) ────────────────────→ depende de 1.5
1.7 (Design System) ──────────────────────────→ depende de 1.2
1.8 (Resultados + otimizacoes) ────────────────→ depende de 1.2, 1.3
1.9 (Acessibilidade) ─────────────────────────→ depende de 1.7
1.10 (Polish) ────────────────────────────────→ depende de 1.7, 1.9
```

---

## Riscos

| Risco | Mitigacao |
|-------|-----------|
| API Key abusada antes de Sprint 1 | Prioridade maxima, resolver em dias |
| Decomposicao introduz bugs | Testes durante decomposicao |
| Modelo Gemini (preview) muda | Abstrair em service layer |
| Estimativas subestimadas | Buffer 30% incluido |

---

*Epic criado por @pm (Morgan) baseado no Technical Debt Assessment*
