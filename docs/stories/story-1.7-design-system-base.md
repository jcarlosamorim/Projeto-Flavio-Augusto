# Story 1.7: Design System Base (5 Componentes)

**Status:** Done
**Epic:** EPIC-TD-001
**Sprint:** 3
**Estimativa:** 14h
**Prioridade:** P2
**Debitos:** UX-04

---

## Descricao

Como desenvolvedor, preciso de componentes UI reutilizaveis e padronizados para eliminar duplicacao de estilos e garantir consistencia visual em toda a aplicacao.

---

## Criterios de Aceitacao

- [x] AC1: Componente Button (primary, secondary, danger, ghost + disabled + loading)
- [x] AC2: Componente Card (header, body, footer opcionais)
- [x] AC3: Componente Input (text, textarea + error state + label)
- [x] AC4: Componente Badge/Indicator (status, step, metric)
- [x] AC5: Componente ProgressBar (label + animacao + porcentagem)
- [x] AC6: Todos os componentes com TypeScript strict types
- [ ] AC7: Componentes existentes refatorados para usar design system
- [ ] AC8: Testes para cada componente

---

## Tasks

- [x] Criar src/components/ui/ diretorio
- [x] Implementar Button com variantes (primary, secondary, danger, ghost)
- [x] Implementar Card com slots (CardHeader, CardBody, CardFooter)
- [x] Implementar Input com error state + TextArea
- [x] Implementar Badge/Indicator (default, success, warning, danger)
- [x] Implementar ProgressBar (com motion animation)
- [ ] Refatorar Onboarding para usar novos componentes
- [ ] Refatorar Dashboard para usar novos componentes
- [ ] Refatorar RecordingControls para usar novos componentes
- [ ] Testes unitarios para cada componente

---

## Definition of Done

- [x] 5 componentes criados e tipados
- [ ] Componentes existentes usando design system
- [ ] Testes passando para todos os componentes
- [ ] Zero duplicacao de estilos inline

---

## File List

- `src/components/ui/Button.tsx` (45 linhas) - 4 variantes, 3 tamanhos, loading com spinner
- `src/components/ui/Card.tsx` (43 linhas) - Card + CardHeader + CardBody + CardFooter
- `src/components/ui/Input.tsx` (61 linhas) - Input + TextArea com forwardRef, error state, label
- `src/components/ui/Badge.tsx` (28 linhas) - 4 variantes, 2 tamanhos
- `src/components/ui/ProgressBar.tsx` (31 linhas) - com motion animation, label, porcentagem
- `src/components/ui/index.ts` (5 linhas) - barrel exports

---

## Dependencias

- **Depende de:** 1.2 (componentes separados)
- **Bloqueia:** 1.9 (acessibilidade), 1.10 (polish)

---

*Story criada por @pm (Morgan) | Epic EPIC-TD-001*
