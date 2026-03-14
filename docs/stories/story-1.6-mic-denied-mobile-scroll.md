# Story 1.6: Tratamento de Mic Denied + Scroll Mobile

**Status:** Done
**Epic:** EPIC-TD-001
**Sprint:** 2
**Estimativa:** 6h
**Prioridade:** P1
**Debitos:** UX-05, UX-13

---

## Descricao

Como usuario mobile, preciso que a interface funcione corretamente no meu dispositivo (scroll, layout) e que, se eu negar permissao de microfone, receba instrucoes claras de como resolver.

---

## Criterios de Aceitacao

- [x] AC1: Quando mic denied, exibir UI de fallback com instrucoes para habilitar nas configuracoes
- [x] AC2: Dashboard + controles de gravacao nao ficam cortados em mobile
- [x] AC3: Scroll suave entre dashboard e area de gravacao em telas pequenas
- [x] AC4: Botao de mic sempre visivel (sticky ou fixed) em mobile

---

## Tasks

- [x] Detectar PermissionDeniedError e exibir UI com instrucoes
- [x] Ajustar layout mobile para scroll adequado
- [x] Implementar botao de mic sticky/fixed em mobile
- [x] Testar em viewports 375px, 390px, 414px

---

## Definition of Done

- [x] Mic denied mostra instrucoes claras
- [x] Layout mobile sem conteudo cortado
- [x] Testado em 3 viewports mobile

---

## File List

- `src/hooks/useGeminiLive.ts` - Pre-check de mic permission antes de conectar ao Gemini, error MIC_DENIED
- `src/components/RecordingControls.tsx` - UI de mic denied com instrucoes passo-a-passo, tamanhos responsivos
- `src/App.tsx` - Bottom bar sticky mobile (lg:hidden), pb-24 para scroll, botoes responsivos
- `src/components/__tests__/RecordingControls.test.tsx` - Teste de mic denied state
- `src/hooks/__tests__/useGeminiLive.test.ts` - Teste de MIC_DENIED error + mock getUserMedia

---

## Dependencias

- **Depende de:** 1.5 (error handling framework)

---

*Story criada por @pm (Morgan) | Epic EPIC-TD-001*
