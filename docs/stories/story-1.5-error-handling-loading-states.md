# Story 1.5: Error Handling + Loading States + Indicador IA

**Status:** Done
**Epic:** EPIC-TD-001
**Sprint:** 2
**Estimativa:** 15h
**Prioridade:** P0-P1
**Debitos:** UX-01, UX-02, UX-06, UX-11, SYS-06, SYS-07, SYS-10

---

## Descricao

Como usuario, preciso de feedback visual claro em todos os momentos da interacao: quando o sistema esta conectando, quando a IA esta ouvindo, quando a IA esta falando, e quando algo da errado - para que eu nunca fique "perdido" na interface.

---

## Criterios de Aceitacao

- [x] AC1: Error Boundary implementado com UI de fallback amigavel
- [x] AC2: Erro de API exibido com mensagem clara + botao "Tentar novamente"
- [x] AC3: Loading spinner durante conexao com Gemini API
- [x] AC4: Botao de mic desabilitado durante conexao (previne cliques multiplos)
- [x] AC5: Indicador visual de estado: idle / conectando / IA ouvindo / IA falando / erro
- [x] AC6: audioQueue com limite de tamanho (cap de 100 chunks)
- [x] AC7: Feedback textual "Conectando..." no botao durante init

---

## Tasks

- [x] Criar ErrorBoundary component com fallback UI
- [x] Implementar state machine de conexao (idle → connecting → active → error)
- [x] Adicionar loading spinner durante startSession()
- [x] Desabilitar botao de mic durante conexao
- [x] Criar indicador visual de IA (ouvindo = verde pulsando, falando = azul animando)
- [x] Implementar cap no audioQueue (max 100 chunks)
- [x] Tratar erros de API com mensagem amigavel + retry
- [x] Tratar timeout de conexao
- [x] Testar todos os estados visualmente

---

## Definition of Done

- [x] Usuario nunca ve tela "morta" em nenhum cenario de erro
- [x] Indicador de estado da IA visivel e claro
- [x] audioQueue nao cresce indefinidamente
- [x] Testes cobrindo cenarios de erro

---

## Dependencias

- **Depende de:** 1.2 (hooks separados para gerenciar estados)

---

## File List

- `src/types.ts` - Adicionado type ConnectionState
- `src/hooks/useGeminiLive.ts` - State machine (idle/connecting/active/error), isSpeaking, error handling com try/catch
- `src/components/ErrorBoundary.tsx` - NOVO - Error boundary com fallback UI amigavel
- `src/components/RecordingControls.tsx` - Indicadores visuais por estado (cores, animacoes, labels)
- `src/App.tsx` - ErrorBoundary wrapper, banner de erro com retry, botao com estados visuais
- `src/components/__tests__/RecordingControls.test.tsx` - Testes atualizados para nova interface
- `src/components/__tests__/Onboarding.test.tsx` - Fix de tipos do mock
- `src/hooks/__tests__/useGeminiLive.test.ts` - Testes de error state, clearError, connectionState

---

*Story criada por @pm (Morgan) | Epic EPIC-TD-001*
