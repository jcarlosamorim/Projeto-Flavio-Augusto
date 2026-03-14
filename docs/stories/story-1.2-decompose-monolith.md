# Story 1.2: Decompor App.tsx em Hooks e Componentes

**Status:** Done
**Epic:** EPIC-TD-001
**Sprint:** 1
**Estimativa:** 10h
**Prioridade:** P0 (CRITICO)
**Debitos:** SYS-01, SYS-05, SYS-15

---

## Descricao

Como desenvolvedor, preciso decompor o App.tsx monolitico (521 linhas, 3 componentes + toda logica) em arquivos separados com hooks customizados, para que o codigo seja manutenivel, testavel e escalavel.

---

## Criterios de Aceitacao

- [ ] AC1: Nenhum componente com mais de 150 linhas
- [ ] AC2: Hooks customizados extraidos: useGeminiLive, useAudioCapture, useAudioPlayback
- [ ] AC3: Componentes em arquivos separados: Onboarding, Dashboard, RecordingControls
- [ ] AC4: Tipos proprios para session (substituir useState<any>)
- [ ] AC5: Cleanup adequado de todos os refs no unmount
- [ ] AC6: Aplicacao funciona identicamente apos decomposicao (zero regressoes)

---

## Scope

### IN
- Extrair Onboarding para src/components/Onboarding.tsx
- Extrair Dashboard para src/components/Dashboard.tsx
- Extrair controles de gravacao para src/components/RecordingControls.tsx
- Criar src/hooks/useGeminiLive.ts
- Criar src/hooks/useAudioCapture.ts
- Criar src/hooks/useAudioPlayback.ts
- Tipar session corretamente
- Garantir cleanup de refs

### OUT
- Novas features
- Mudancas visuais
- Routing

---

## Tasks

- [x] Criar estrutura de pastas (components/, hooks/, types/)
- [x] Extrair tipos para src/types/ expandido
- [x] Extrair useAudioCapture hook
- [x] Extrair useAudioPlayback hook
- [x] Extrair useGeminiLive hook (gerencia sessao + tool calls)
- [x] Extrair Onboarding component
- [x] Extrair Dashboard component
- [x] Extrair RecordingControls component
- [x] Simplificar App.tsx para orquestrador
- [x] Tipar session (remover any)
- [x] Garantir cleanup no unmount
- [x] Testar manualmente que tudo funciona igual (build OK)

---

## Estrutura Alvo

```
src/
├── App.tsx                    (~50 linhas - orquestrador)
├── main.tsx
├── index.css
├── types/
│   ├── index.ts               (re-exports)
│   ├── product.ts             (ProductInfo)
│   ├── metrics.ts             (SalesMetrics, SALES_STEPS)
│   └── gemini.ts              (Session types)
├── hooks/
│   ├── useGeminiLive.ts       (sessao + tool calls)
│   ├── useAudioCapture.ts     (microfone 16kHz)
│   └── useAudioPlayback.ts    (fila de audio 24kHz)
└── components/
    ├── Onboarding.tsx         (formulario produto)
    ├── Dashboard.tsx          (metricas em tempo real)
    └── RecordingControls.tsx  (botao mic + status)
```

---

## Definition of Done

- [ ] App.tsx < 80 linhas
- [ ] Todos os componentes < 150 linhas
- [ ] Zero useState<any>
- [ ] Cleanup de refs implementado
- [ ] App funciona identicamente

---

## Dependencias

- Nenhuma (pode ser feita em paralelo com 1.1)
- **Bloqueia:** 1.3, 1.4, 1.5, 1.7, 1.8

---

*Story criada por @pm (Morgan) | Epic EPIC-TD-001*
