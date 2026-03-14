# Frontend Specification - SalesMaster Roleplay

**Status:** Brownfield Discovery - FASE 3
**Agente:** @ux-design-expert (Uma)
**Data:** 2026-03-14

---

## 1. Componentes UI Existentes

### 1.1 Onboarding (Tela Inicial)

**Proposito:** Coletar informacoes do produto antes do roleplay

**Elementos:**
- Titulo: "SalesMaster Roleplay" com icone ShoppingBag
- Subtitulo: "Treine suas habilidades de venda..."
- Input: Nome do produto (text)
- Textarea: Descricao/beneficios do produto
- Input: Preco/condicoes (text)
- Botao: "Comecar Roleplay" (emerald, desabilitado ate preencher nome + descricao)

**Animacoes:**
- Fade-in + slide-up no mount (motion: opacity 0→1, y 20→0)

**Responsividade:**
- Layout centralizado, max-w-2xl
- Padding responsivo

### 1.2 Dashboard (Metricas em Tempo Real)

**Proposito:** Visualizar performance do vendedor durante o roleplay

**Secoes:**
1. **Metodologia 7 Passos** - Step tracker horizontal com indicadores visuais
   - 7 circulos numerados (1-7)
   - Step atual destacado em emerald
   - Steps completados com CheckCircle2

2. **Probabilidade de Fechamento** - Gauge circular (0-100%)
   - SVG circular com stroke animado
   - Porcentagem grande no centro

3. **Indicadores de Performance** - 4 barras de progresso
   - Rapport (0-100%)
   - Levantamento de Necessidades (0-100%)
   - Proposta de Valor (0-100%)
   - Contorno de Objecoes (0-100%)

4. **Feedback em Tempo Real** - Area de texto com feedback da IA
   - Icone MessageSquare
   - Texto atualizado a cada interacao

**Layout:** Grid responsivo
- Mobile: 1 coluna
- Tablet: 2 colunas
- Desktop: 3 colunas (steps span full)

### 1.3 Controles de Gravacao (dentro de App)

**Elementos:**
- Botao circular grande: Mic/MicOff
- Indicador pulsante quando gravando
- Texto contextual: "Fale naturalmente..." / "Simulacao Ativa"
- Botao "Nova Simulacao" (RotateCcw)

---

## 2. Design System / Tokens

### 2.1 Cores

| Token | Valor | Uso |
|-------|-------|-----|
| bg-primary | zinc-950 | Background principal |
| bg-card | zinc-900/50 | Cards e containers |
| border | zinc-800 | Bordas de cards e inputs |
| text-primary | zinc-100 | Texto principal |
| text-muted | zinc-400/500 | Texto secundario |
| accent | emerald-500 | Acoes, destaques, progresso |
| accent-bg | emerald-500/20 | Background de destaque |
| danger | red-500 | Botao de parar gravacao |
| warning | amber-500 | Indicadores medios |

**Observacao:** Nao ha design system formal. Cores aplicadas inline via Tailwind.

### 2.2 Tipografia

| Uso | Classes |
|-----|---------|
| Titulo principal | text-3xl font-bold tracking-tight |
| Subtitulo | text-zinc-400 |
| Label de secao | text-xs font-semibold tracking-wider uppercase |
| Valor numerico | text-2xl/3xl font-bold |
| Body text | text-sm |

**Fonte:** System sans-serif (font-sans default)

### 2.3 Espacamento

| Padrao | Valor |
|--------|-------|
| Gap entre cards | gap-4 a gap-8 |
| Padding de card | p-4 a p-6 |
| Padding de pagina | p-6 |
| Border radius | rounded-xl a rounded-2xl |

### 2.4 Componentes Reutilizaveis

**NAO EXISTEM.** Todos os elementos sao inline. Nao ha:
- Component library propria
- Design tokens centralizados
- Theme provider
- Variantes de componentes

---

## 3. Fluxos de Usuario

### Fluxo Principal
```
1. Abertura → Tela de Onboarding
2. Preenche nome + descricao do produto
3. Clica "Comecar Roleplay"
4. Dashboard aparece + botao de mic
5. Clica no mic → Inicia sessao com Gemini
6. Fala naturalmente → IA responde em audio
7. Dashboard atualiza metricas em tempo real
8. Clica stop → Encerra sessao
9. Pode clicar "Nova Simulacao" → Volta ao Onboarding
```

### Fluxos Ausentes
- Sem historico de sessoes anteriores
- Sem tela de resultados pos-sessao
- Sem onboarding tutorial
- Sem configuracoes de usuario
- Sem tela de erro dedicada

---

## 4. Responsividade

| Breakpoint | Layout |
|-----------|--------|
| Mobile (<768px) | 1 coluna, cards empilhados |
| Tablet (md: 768px+) | 2 colunas para indicadores |
| Desktop (lg: 1024px+) | 3 colunas, layout otimizado |

**Abordagem:** Mobile-first com Tailwind breakpoints
**Qualidade:** Basica - funcional mas sem otimizacao fina

---

## 5. Acessibilidade (a11y)

### Problemas Identificados

| ID | Problema | Severidade | WCAG |
|----|----------|-----------|------|
| A11Y-01 | Sem aria-labels nos botoes de icone | Alta | 1.1.1 |
| A11Y-02 | Sem alt text em icones SVG | Media | 1.1.1 |
| A11Y-03 | Contraste insuficiente em botao desabilitado | Media | 1.4.3 |
| A11Y-04 | Sem focus ring visivel customizado | Media | 2.4.7 |
| A11Y-05 | Sem skip navigation | Baixa | 2.4.1 |
| A11Y-06 | Sem anuncio de mudancas de estado para screen readers | Alta | 4.1.3 |
| A11Y-07 | Metricas do dashboard nao acessiveis por teclado | Media | 2.1.1 |

---

## 6. Performance Percebida

### Pontos Positivos
- Animacoes suaves com motion library
- Transicoes de estado visiveis

### Problemas
| ID | Problema | Impacto |
|----|----------|---------|
| PERF-01 | Sem loading spinner durante conexao com Gemini | Confuso para usuario |
| PERF-02 | Sem skeleton screens | Tela em branco durante carregamento |
| PERF-03 | Sem feedback visual de "processando audio" | Usuario nao sabe se IA ouviu |
| PERF-04 | Re-renders excessivos no Dashboard | Possivel jank em devices fracos |

---

## 7. Consistencia Visual

### Positivo
- Dark theme consistente (zinc-950 bg)
- Accent color uniforme (emerald-500)
- Bordas e border-radius padronizados
- Espacamento geralmente consistente

### Problemas
| ID | Problema | Descricao |
|----|----------|-----------|
| UI-01 | Sem design system formal | Tudo inline, facil divergir |
| UI-02 | Sem componentes reutilizaveis (Button, Card, Input) | Duplicacao de estilos |
| UI-03 | Inconsistencia em font-weight | Mistura de bold/semibold/medium |
| UI-04 | Sem tratamento de estados de erro visuais | Inputs sem error state |
| UI-05 | Sem empty states | Feedback vazio = area em branco |

---

## 8. Debitos de Frontend/UX Identificados

### CRITICOS

| ID | Debito | Area |
|----|--------|------|
| UX-01 | Sem feedback de erro para usuario (API fail, mic deny) | Error Handling |
| UX-02 | Sem loading states (conexao API, inicio de sessao) | Performance UX |

### ALTOS

| ID | Debito | Area |
|----|--------|------|
| UX-03 | Zero acessibilidade (aria-labels, roles, focus) | a11y |
| UX-04 | Sem design system / component library | Manutenibilidade |
| UX-05 | Sem tratamento de permissao de microfone negada | Error UX |
| UX-06 | Sem indicador visual de "IA falando" vs "IA ouvindo" | Feedback UX |

### MEDIOS

| ID | Debito | Area |
|----|--------|------|
| UX-07 | Sem historico de sessoes | Feature gap |
| UX-08 | Sem tela de resultados pos-sessao | Feature gap |
| UX-09 | Sem empty states para metricas zeradas | Visual |
| UX-10 | Sem onboarding/tutorial para primeiro uso | UX |
| UX-11 | Botao de gravacao sem confirmacao visual de "conectando" | Feedback |

---

*Documento gerado por @ux-design-expert (Uma) durante Brownfield Discovery - FASE 3*
