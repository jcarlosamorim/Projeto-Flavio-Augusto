# UX Specialist Review

**Agente:** @ux-design-expert (Uma)
**Data:** 2026-03-14
**Revisando:** docs/prd/technical-debt-DRAFT.md (Secao Frontend/UX)

---

## Debitos Validados

| ID | Debito | Severidade Original | Severidade Ajustada | Horas | Prioridade | Notas |
|----|--------|---------------------|---------------------|-------|-----------|-------|
| UX-01 | Sem feedback de erro | CRITICO | **CRITICO** | 5h | P0 | Confirmado. Mic denied + API fail = app morta |
| UX-02 | Sem loading states | CRITICO | **CRITICO** | 4h | P0 | Confirmado. Init demora 2-5s, usuario clica multiplo |
| UX-03 | Zero acessibilidade | ALTO | **CRITICO** | 10h | P1 | **Elevado.** WCAG 2.1 AA e requisito legal em varios paises |
| UX-04 | Sem design system | ALTO | **ALTO** | 14h | P2 | Confirmado. Criar Button, Card, Input, Badge como base |
| UX-05 | Mic denied sem tratamento | ALTO | **ALTO** | 3h | P1 | Confirmado. Precisa de UI de fallback + instrucoes |
| UX-06 | Sem indicador IA estado | ALTO | **CRITICO** | 4h | P0 | **Elevado.** Core da UX - usuario PRECISA saber quando falar |
| UX-07 | Sem historico | MEDIO | **MEDIO** | 14h | P3 | Confirmado. Feature, nao debito critico |
| UX-08 | Sem tela de resultados | MEDIO | **ALTO** | 7h | P2 | **Elevado.** Sem sumario = experiencia incompleta |
| UX-09 | Sem empty states | MEDIO | **MEDIO** | 3h | P3 | Confirmado. Metricas zeradas = confuso |
| UX-10 | Sem onboarding/tutorial | MEDIO | **MEDIO** | 5h | P3 | Confirmado. Tooltip tour suficiente inicialmente |
| UX-11 | Sem feedback "conectando" | MEDIO | **ALTO** | 2h | P1 | **Elevado.** Conectado ao UX-02, quick win |

---

## Debitos Adicionados

| ID | Debito | Severidade | Horas | Prioridade | Justificativa |
|----|--------|-----------|-------|-----------|---------------|
| UX-12 | Sem feedback haptico/sonoro ao iniciar/parar gravacao | MEDIO | 2h | P2 | Usuarios mobile esperam feedback tatil |
| UX-13 | Scroll nao gerenciado no mobile (dashboard + controles) | ALTO | 3h | P1 | Em mobile, dashboard + mic ficam cortados |
| UX-14 | Sem dark/light mode toggle | BAIXO | 4h | P4 | Dark-only pode ser problema em ambientes claros |
| UX-15 | Animacao do audio visualizer muito sutil | MEDIO | 2h | P2 | Usuario precisa de feedback visual forte de que IA esta ouvindo |

---

## Respostas ao Architect

### 1. Design system completo ou padronizar existentes?

**Recomendacao: Padronizar primeiro, design system depois.**

Criar 5 componentes base reutilizaveis:
1. `Button` (primary, secondary, danger, ghost + disabled + loading)
2. `Card` (com header, body, footer opcionais)
3. `Input` (text, textarea + error state + label)
4. `Badge/Indicator` (status, step, metric)
5. `ProgressBar` (com label + animacao)

Isso resolve 80% da duplicacao com 14h de trabalho. Design system formal (tokens, theme provider, Storybook) pode vir depois quando houver mais componentes.

### 2. Acessibilidade: ARIA primeiro ou reestruturacao?

**Recomendacao: Abordagem hibrida em 2 fases.**

**Fase 1 (4h):** Quick wins sem reestruturacao
- Adicionar aria-labels em todos os botoes de icone
- Adicionar role="status" nas metricas que atualizam
- Focus ring visivel nos interativos
- aria-live="polite" no feedback da IA

**Fase 2 (6h):** Reestruturacao semantica
- Landmarks (nav, main, aside)
- Heading hierarchy correto (h1, h2, h3)
- Skip navigation
- Keyboard navigation completa

### 3. Indicador de estado da IA?

**Recomendacao: Visual primario + sonoro secundario.**

- **Visual:** Anel pulsante ao redor do botao de mic
  - Verde pulsando = IA ouvindo (seu turno de falar)
  - Azul animando = IA processando/falando
  - Cinza = inativo
- **Sonoro:** Tom suave (beep) ao trocar de turno (configuravel on/off)
- **NAO recomendo** apenas sonoro pois conflita com o audio da IA

---

## Recomendacoes de Design

### Ordem de Resolucao Sugerida (perspectiva UX)

1. **Sprint 1 - Critico (UX-01, UX-02, UX-06, UX-11):** 15h
   - Feedback de erro + loading states + indicador IA + feedback conectando
   - Impacto imediato na usabilidade core

2. **Sprint 2 - Acessibilidade + Mobile (UX-03 Fase 1, UX-05, UX-13):** 10h
   - ARIA labels + mic denied + scroll mobile
   - Inclusao + funcionalidade basica

3. **Sprint 3 - Componentes + Resultados (UX-04, UX-08):** 21h
   - Design system base + tela de resultados
   - Fundacao para evolucao

4. **Sprint 4 - Polish (UX-03 Fase 2, UX-09, UX-10, UX-12, UX-15):** 18h
   - Acessibilidade completa + empty states + onboarding + polish

**Total UX estimado: 64 horas**

---

*Review por @ux-design-expert (Uma) - Debitos validados com ajustes de severidade*
