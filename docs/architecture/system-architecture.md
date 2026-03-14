# System Architecture - SalesMaster Roleplay

**Status:** Brownfield Discovery - FASE 1
**Agente:** @architect (Aria)
**Data:** 2026-03-14
**Projeto:** Projeto-Flavio-Augusto (SalesMaster Roleplay)

---

## 1. Visao Geral do Sistema

**Proposito:** Aplicacao de treinamento de vendas em tempo real com IA, utilizando a metodologia de 7 passos de Flavio Augusto. O vendedor pratica com um "cliente" simulado por IA com feedback em tempo real.

**Plataforma:** Google AI Studio Application (Remix)
**Tipo:** SPA (Single Page Application) - Frontend-only, stateless

---

## 2. Stack Tecnologico

| Camada | Tecnologia | Versao |
|--------|-----------|--------|
| Framework | React | 19.0.0 |
| Build Tool | Vite | 6.2.0 |
| Linguagem | TypeScript | ~5.8.2 |
| CSS Framework | Tailwind CSS | 4.1.14 |
| Animacoes | motion (Framer Motion) | 12.23.24 |
| Icones | lucide-react | 0.546.0 |
| IA / Voz | @google/genai | 1.29.0 |
| Env | dotenv | 17.2.3 |

### Dependencias Nao Utilizadas

| Pacote | Versao | Status |
|--------|--------|--------|
| express | 4.21.2 | Instalado mas NAO utilizado |
| @types/express | 4.17.21 | Instalado mas NAO utilizado |

---

## 3. Estrutura de Pastas

```
src/
├── App.tsx          (521 linhas - componente principal monolitico)
├── main.tsx         (10 linhas - entry point React)
├── index.css        (1 linha - import Tailwind)
└── types.ts         (25 linhas - definicoes de tipos)
```

**Total:** 556 linhas de codigo fonte
**Componentes:** 3 (Onboarding, Dashboard, App)
**Arquivos de teste:** 0
**Routing:** Nenhum
**State Management:** useState local apenas

---

## 4. Arquitetura de Componentes

```
App.tsx (521 linhas)
├── Onboarding (linhas 9-74)
│   └── Formulario de produto (nome, descricao, preco)
│
├── Dashboard (linhas 76-161)
│   ├── Metodologia 7 Passos (step tracker)
│   ├── Probabilidade de Fechamento (gauge 0-100%)
│   ├── Indicadores de Performance (barras de progresso)
│   └── Feedback em Tempo Real (texto da IA)
│
└── App Principal (linhas 165-521)
    ├── Estado: product, isRecording, metrics, session
    ├── Refs: audioContext, processor, stream, audioQueue, isPlaying
    ├── startSession() - inicializa Gemini Live API
    ├── startAudioCapture() - captura microfone 16kHz
    ├── stopAudioCapture() - limpa recursos de audio
    ├── playNextInQueue() - playback em fila
    └── toggleRecording() - start/stop sessao
```

---

## 5. Integracoes Externas

### Google Gemini Live API

| Aspecto | Detalhe |
|---------|---------|
| Modelo | gemini-2.5-flash-native-audio-preview-09-2025 |
| Modalidade | Audio (voz nativa) |
| Voz | Zephyr (TTS) |
| Auth | API Key via env var (GEMINI_API_KEY) |
| Tools | update_metrics (function calling) |

**Fluxo:**
```
Usuario fala (mic 16kHz PCM) → Gemini Live API → Resposta em audio (24kHz PCM)
                                    ↓
                            Tool Call: update_metrics
                                    ↓
                            Dashboard atualizado em tempo real
```

### Web APIs do Browser
- Web Audio API (AudioContext, ScriptProcessorNode)
- getUserMedia() (acesso ao microfone)
- Base64 encoding/decoding para streaming de audio

---

## 6. Variaveis de Ambiente

| Variavel | Proposito | Obrigatoria |
|----------|----------|-------------|
| GEMINI_API_KEY | Chave da API Google Gemini | Sim |
| APP_URL | URL do servico (Cloud Run) | Nao |
| DISABLE_HMR | Desabilita HMR no AI Studio | Nao |

---

## 7. Configuracoes

### TypeScript (tsconfig.json)
- Target: ES2022
- Module: ESNext
- Path alias: `@/*` → `./`
- **SEM strict mode** (apenas skipLibCheck)

### Vite (vite.config.ts)
- Plugins: react, tailwindcss
- GEMINI_API_KEY exposta via process.env
- HMR controlavel via env var

---

## 8. Debitos Tecnicos Identificados

### CRITICOS

| ID | Debito | Impacto | Area |
|----|--------|---------|------|
| SYS-01 | App.tsx monolitico (521 linhas) | Manutencao impossivel, tudo em 1 arquivo | Arquitetura |
| SYS-02 | Zero testes | Nenhuma cobertura, regressoes inevitaveis | Qualidade |
| SYS-03 | TypeScript sem strict mode | Bugs de tipo nao detectados em compile time | Type Safety |
| SYS-04 | API Key exposta no client-side (process.env no build) | Chave da API visivel no bundle final | Seguranca |

### ALTOS

| ID | Debito | Impacto | Area |
|----|--------|---------|------|
| SYS-05 | useState<any> para session | Type safety comprometida | Type Safety |
| SYS-06 | Sem Error Boundary | Crash silencioso sem recovery | UX/Resiliencia |
| SYS-07 | audioQueue sem limite de tamanho | Memory leak em sessoes longas | Performance |
| SYS-08 | Sem sanitizacao de input do produto | Prompt injection possivel via nome/descricao | Seguranca |
| SYS-09 | Console.log em producao (4 ocorrencias) | Vazamento de info no console | Seguranca |
| SYS-10 | Sem loading states durante init da API | UX confusa, cliques multiplos possiveis | UX |

### MEDIOS

| ID | Debito | Impacto | Area |
|----|--------|---------|------|
| SYS-11 | Valores hardcoded (modelo, voz) | Dificil trocar configuracoes | Manutenibilidade |
| SYS-12 | Sem memoizacao (useMemo/useCallback) | Re-renders desnecessarios | Performance |
| SYS-13 | Express instalado mas nao usado | Dependencia morta, aumenta bundle | Dependencias |
| SYS-14 | Sem routing (SPA sem rotas) | Limitacao para expansao futura | Escalabilidade |
| SYS-15 | Sem cleanup adequado de refs no unmount | Possivel memory leak | Performance |

---

## 9. Padroes Identificados

### Positivos
- Mobile-first com Tailwind (breakpoints md: e lg:)
- Dark theme consistente (zinc-950, emerald-500)
- Animacoes suaves com motion library
- Tipo ProductInfo e SalesMetrics bem definidos

### Negativos
- Tudo em um arquivo (God Component anti-pattern)
- Prop drilling (metrics: App → Dashboard)
- Logica de audio misturada com logica de UI
- Sem separacao de concerns (hooks, services, utils)
- Sem padrao de error handling consistente

---

## 10. Recomendacoes Arquiteturais

1. **Decompor App.tsx** em hooks customizados:
   - `useGeminiLive()` - gerenciamento de sessao
   - `useAudioCapture()` - processamento de audio
   - `useAudioPlayback()` - reproducao de audio

2. **Ativar TypeScript strict** no tsconfig.json

3. **Implementar backend proxy** para proteger API key

4. **Adicionar testes** com Vitest + React Testing Library

5. **Implementar Error Boundaries** para recovery gracioso

6. **Extrair constantes** para arquivo de configuracao

---

*Documento gerado por @architect (Aria) durante Brownfield Discovery - FASE 1*
