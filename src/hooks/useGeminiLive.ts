import { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, Session, Type } from '@google/genai';
import { ProductInfo, SalesMetrics, ConnectionState } from '../types';
import { GEMINI_MODEL, GEMINI_VOICE, DEFAULT_METRICS } from '../config';
import { useAudioCapture } from './useAudioCapture';
import { useAudioPlayback } from './useAudioPlayback';

export function useGeminiLive() {
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<SalesMetrics>({ ...DEFAULT_METRICS });
  const connectionRef = useRef<Session | null>(null);

  const { startCapture, stopCapture } = useAudioCapture();
  const { enqueue, clearQueue } = useAudioPlayback();

  const connect = useCallback(async (product: ProductInfo) => {
    setConnectionState('connecting');
    setError(null);

    // Pre-check mic permission before connecting to Gemini
    try {
      const testStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      testStream.getTracks().forEach((t: MediaStreamTrack) => t.stop());
    } catch (err) {
      const isDenied = err instanceof DOMException &&
        (err.name === 'NotAllowedError' || err.name === 'NotFoundError');
      setConnectionState('error');
      setError(isDenied ? 'MIC_DENIED' : 'Erro ao acessar o microfone');
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const systemInstruction = `
        Você é um cliente simulado em um roleplay de vendas.
        O produto que está sendo vendido é: ${product.name}.
        Descrição do produto: ${product.description}.
        Preço: ${product.price}.

        Sua personalidade: Você é um empresário ocupado, mas interessado em soluções que tragam ROI. Você é educado, mas fará objeções realistas.

        OBJETIVO DO ROLEPLAY: Avaliar o vendedor nos 7 passos de Flávio Augusto:
        1. Preparação (O vendedor deve demonstrar que conhece o produto)
        2. Abordagem (Como ele inicia a conversa)
        3. Levantamento de Necessidades (Ele faz perguntas abertas?)
        4. Proposta de Valor (Ele conecta o produto às minhas dores?)
        5. Negociação (Como ele lida com preço/condições)
        6. Fechamento (Ele pede a venda?)
        7. Pós-Venda (Ele menciona o acompanhamento?)

        FERRAMENTA CRÍTICA: Você DEVE usar a função 'update_metrics' após cada fala do usuário para atualizar o dashboard.
        Não diga as métricas em voz alta, apenas use a ferramenta.
        Seja um cliente realista. Não facilite demais.
      `;

      const conn = await ai.live.connect({
        model: GEMINI_MODEL,
        config: {
          systemInstruction,
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: GEMINI_VOICE } }
          },
          tools: [{
            functionDeclarations: [{
              name: "update_metrics",
              description: "Atualiza as métricas de vendas no dashboard visual.",
              parameters: {
                type: Type.OBJECT,
                properties: {
                  currentStep: { type: Type.NUMBER, description: "Índice do passo atual (0-6)" },
                  rapport: { type: Type.NUMBER, description: "Nível de conexão (0-100)" },
                  needsDiscovery: { type: Type.NUMBER, description: "Qualidade do levantamento (0-100)" },
                  valueProposition: { type: Type.NUMBER, description: "Qualidade da proposta (0-100)" },
                  objectionHandling: { type: Type.NUMBER, description: "Eficácia no contorno de objeções (0-100)" },
                  closingProbability: { type: Type.NUMBER, description: "Probabilidade de fechar negócio (0-100)" },
                  feedback: { type: Type.STRING, description: "Feedback curto e direto sobre a última fala" }
                },
                required: ["currentStep", "rapport", "closingProbability", "feedback"]
              }
            }]
          }]
        },
        callbacks: {
          onopen: () => {
            setConnectionState('active');
            startCapture((base64Data: string) => {
              connectionRef.current?.sendRealtimeInput({
                media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
              });
            });
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts) {
              for (const part of message.serverContent.modelTurn.parts) {
                if (part.inlineData?.data) {
                  setIsSpeaking(true);
                  const binaryString = atob(part.inlineData.data);
                  const bytes = new Uint8Array(binaryString.length);
                  for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                  }
                  enqueue(new Int16Array(bytes.buffer));
                }
              }
            }

            if (message.serverContent?.turnComplete) {
              setIsSpeaking(false);
            }

            if (message.toolCall?.functionCalls) {
              for (const call of message.toolCall.functionCalls) {
                if (call.name === "update_metrics") {
                  setMetrics((prev: SalesMetrics) => ({ ...prev, ...call.args }));
                  conn.sendToolResponse({
                    functionResponses: [{
                      id: call.id,
                      response: { result: "Dashboard atualizado com sucesso" }
                    }]
                  });
                }
              }
            }

            if (message.serverContent?.interrupted) {
              setIsSpeaking(false);
              clearQueue();
            }
          },
          onclose: () => {
            setConnectionState('idle');
            setIsSpeaking(false);
            stopCapture();
          },
          onerror: (e: ErrorEvent) => {
            setConnectionState('error');
            setIsSpeaking(false);
            setError(e.message || 'Erro na conexão com a IA');
            stopCapture();
          }
        }
      });

      connectionRef.current = conn;
    } catch (err) {
      setConnectionState('error');
      setError(err instanceof Error ? err.message : 'Falha ao conectar com a Gemini API');
    }
  }, [startCapture, stopCapture, enqueue, clearQueue]);

  const disconnect = useCallback(() => {
    connectionRef.current?.close();
    connectionRef.current = null;
    setConnectionState('idle');
    setIsSpeaking(false);
    stopCapture();
  }, [stopCapture]);

  const resetMetrics = useCallback(() => {
    setMetrics({ ...DEFAULT_METRICS });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setConnectionState('idle');
  }, []);

  return {
    connectionState,
    isSpeaking,
    error,
    metrics,
    connect,
    disconnect,
    resetMetrics,
    clearError,
  };
}
