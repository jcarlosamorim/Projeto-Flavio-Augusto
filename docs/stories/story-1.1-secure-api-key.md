# Story 1.1: Proteger API Key com Backend Proxy

**Status:** Draft
**Epic:** EPIC-TD-001
**Sprint:** 1
**Estimativa:** 10h
**Prioridade:** P0 (CRITICO)
**Debitos:** SYS-04, SYS-08

---

## Descricao

Como desenvolvedor, preciso proteger a chave da API do Google Gemini para que ela nao fique exposta no bundle do cliente, evitando abuso financeiro e acesso nao autorizado.

Atualmente, `GEMINI_API_KEY` e injetada via `process.env` no build do Vite, tornando-a visivel no codigo JavaScript final.

---

## Criterios de Aceitacao

- [ ] AC1: API Key NAO aparece no bundle final (verificar com `grep` no dist/)
- [ ] AC2: Backend proxy (edge function ou express minimal) recebe chamadas do client e repassa ao Gemini
- [ ] AC3: Input do usuario (nome, descricao, preco do produto) e sanitizado antes de enviar ao Gemini
- [ ] AC4: Rate limiting basico implementado no proxy (max 10 sessoes/hora/IP)
- [ ] AC5: Variavel de ambiente configurada apenas no servidor, nao no client

---

## Scope

### IN
- Criar backend proxy para API Gemini
- Mover API Key para server-side only
- Sanitizar inputs do produto
- Rate limiting basico

### OUT
- Autenticacao de usuarios
- Dashboard de monitoramento de uso
- Multiplas API keys

---

## Tasks

- [ ] Criar endpoint proxy (Vercel Edge Function, Cloudflare Worker ou Express)
- [ ] Configurar env var apenas no servidor
- [ ] Atualizar client para chamar proxy em vez da API diretamente
- [ ] Implementar sanitizacao de input (XSS, prompt injection)
- [ ] Adicionar rate limiting
- [ ] Verificar que bundle nao contem a key
- [ ] Documentar setup de deploy

---

## Definition of Done

- [ ] API Key invisivel no client
- [ ] Testes de integracao com proxy passando
- [ ] Rate limiting funcional
- [ ] Input sanitizado

---

## Dependencias

- Nenhuma (pode ser feita em paralelo com 1.2)

---

## File List

- [ ] `server/` ou `api/` - novo diretorio para proxy
- [ ] `src/App.tsx` - atualizar chamadas de API
- [ ] `vite.config.ts` - remover exposicao da env var
- [ ] `.env.example` - atualizar variaveis

---

*Story criada por @pm (Morgan) | Epic EPIC-TD-001*
