import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, BarChart3, ShoppingBag, MessageSquare, CheckCircle2, ArrowRight, Play, RotateCcw } from 'lucide-react';
import { ProductInfo, SalesMetrics, SALES_STEPS } from './types';
import { GoogleGenAI, Modality, LiveServerMessage, Type } from "@google/genai";

// --- Components ---

const Onboarding = ({ onComplete }: { onComplete: (info: ProductInfo) => void }) => {
  const [info, setInfo] = useState<ProductInfo>({ name: '', description: '', price: '' });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <ShoppingBag className="text-zinc-950 w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">SalesMaster Onboarding</h1>
        </div>

        <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
          Defina o produto que você irá vender. O Gemini simulará um cliente interessado com base nestas informações.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Nome do Produto</label>
            <input 
              type="text"
              value={info.name}
              onChange={e => setInfo({ ...info, name: e.target.value })}
              placeholder="Ex: Software de Gestão"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Descrição / Benefícios</label>
            <textarea 
              value={info.description}
              onChange={e => setInfo({ ...info, description: e.target.value })}
              placeholder="Descreva o que o produto faz e seus diferenciais..."
              rows={4}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Valor (R$)</label>
            <input 
              type="text"
              value={info.price}
              onChange={e => setInfo({ ...info, price: e.target.value })}
              placeholder="Ex: 299,00 / mês"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <button 
            onClick={() => onComplete(info)}
            disabled={!info.name || !info.description}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-zinc-950 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
          >
            Começar Roleplay
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ metrics }: { metrics: SalesMetrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Progress Steps */}
      <div className="col-span-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Metodologia 7 Passos (Flávio Augusto)
        </h3>
        <div className="flex flex-wrap gap-4 justify-between">
          {SALES_STEPS.map((step, idx) => (
            <div key={step} className="flex flex-col items-center gap-2 min-w-[100px]">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                metrics.currentStep > idx ? 'bg-emerald-500 text-zinc-950' : 
                metrics.currentStep === idx ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500 ring-4 ring-emerald-500/10' : 
                'bg-zinc-800 text-zinc-500'
              }`}>
                {idx + 1}
              </div>
              <span className={`text-[10px] font-medium text-center max-w-[80px] ${
                metrics.currentStep === idx ? 'text-emerald-500' : 'text-zinc-500'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Probability Gauge */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Probabilidade de Fechamento</h3>
        <div className="relative h-32 flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
            <circle 
              cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
              strokeDasharray={364}
              strokeDashoffset={364 - (364 * metrics.closingProbability) / 100}
              className="text-emerald-500 transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{metrics.closingProbability}%</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Indicadores de Performance</h3>
        {[
          { label: 'Rapport', value: metrics.rapport },
          { label: 'Levantamento', value: metrics.needsDiscovery },
          { label: 'Proposta de Valor', value: metrics.valueProposition },
          { label: 'Contorno de Objeções', value: metrics.objectionHandling },
        ].map(m => (
          <div key={m.label} className="space-y-1">
            <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider">
              <span className="text-zinc-400">{m.label}</span>
              <span className="text-emerald-500">{m.value}%</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${m.value}%` }}
                className="h-full bg-emerald-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Realtime Feedback */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Feedback em Tempo Real
        </h3>
        <div className="flex-1 text-sm text-zinc-300 italic leading-relaxed">
          {metrics.feedback || "Aguardando interação para gerar insights..."}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [metrics, setMetrics] = useState<SalesMetrics>({
    currentStep: 0,
    rapport: 0,
    needsDiscovery: 0,
    valueProposition: 0,
    objectionHandling: 0,
    closingProbability: 0,
    feedback: ""
  });

  const [session, setSession] = useState<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioQueue = useRef<Int16Array[]>([]);
  const isPlaying = useRef(false);

  // Initialize Gemini Live API
  const startSession = async () => {
    if (!product) return;

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
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          systemInstruction,
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } }
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
            console.log("Conectado ao Gemini Live");
            setIsRecording(true);
            startAudioCapture();
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output
            if (message.serverContent?.modelTurn?.parts) {
              for (const part of message.serverContent.modelTurn.parts) {
                if (part.inlineData?.data) {
                  const binaryString = atob(part.inlineData.data);
                  const bytes = new Uint8Array(binaryString.length);
                  for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                  }
                  audioQueue.current.push(new Int16Array(bytes.buffer));
                  if (!isPlaying.current) playNextInQueue();
                }
              }
            }

            // Handle Tool Calls (Dashboard Updates)
            if (message.toolCall) {
              for (const call of message.toolCall.functionCalls) {
                if (call.name === "update_metrics") {
                  setMetrics(prev => ({
                    ...prev,
                    ...call.args
                  }));
                  // Send response back to satisfy the API
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
              audioQueue.current = [];
              isPlaying.current = false;
            }
          },
          onclose: () => {
            setIsRecording(false);
            stopAudioCapture();
          },
          onerror: (err) => console.error("Erro na sessão:", err)
        }
      });

      setSession(conn);
    } catch (error) {
      console.error("Erro ao iniciar sessão:", error);
    }
  };

  const startAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        session?.sendRealtimeInput({
          media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
        });
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
    } catch (err) {
      console.error("Erro ao capturar áudio:", err);
    }
  };

  const stopAudioCapture = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    processorRef.current?.disconnect();
    audioContextRef.current?.close();
  };

  const playNextInQueue = async () => {
    if (audioQueue.current.length === 0) {
      isPlaying.current = false;
      return;
    }

    isPlaying.current = true;
    const pcmData = audioQueue.current.shift()!;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    }
    
    const floatData = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      floatData[i] = pcmData[i] / 0x7FFF;
    }

    const buffer = audioContextRef.current.createBuffer(1, floatData.length, 24000);
    buffer.getChannelData(0).set(floatData);
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.onended = playNextInQueue;
    source.start();
  };

  const toggleRecording = () => {
    if (isRecording) {
      session?.close();
      setIsRecording(false);
    } else {
      startSession();
    }
  };

  if (!product) {
    return <Onboarding onComplete={setProduct} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <BarChart3 className="text-zinc-950 w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">SalesMaster Roleplay</h1>
              <p className="text-zinc-500 text-sm">Venda: <span className="text-zinc-300 font-medium">{product.name}</span></p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                session?.close();
                setProduct(null);
                setMetrics({
                  currentStep: 0,
                  rapport: 0,
                  needsDiscovery: 0,
                  valueProposition: 0,
                  objectionHandling: 0,
                  closingProbability: 0,
                  feedback: ""
                });
              }}
              className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-zinc-100"
              title="Reiniciar Onboarding"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleRecording}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                isRecording 
                ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/20' 
                : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-5 h-5" />
                  Encerrar Sessão
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Iniciar Simulação
                </>
              )}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Dashboard Area */}
          <div className="lg:col-span-8 space-y-8">
            <Dashboard metrics={metrics} />
          </div>

          {/* Interaction Area */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
              <div className="relative">
                <AnimatePresence>
                  {isRecording && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                      className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl"
                    />
                  )}
                </AnimatePresence>
                <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                  isRecording ? 'border-emerald-500 bg-emerald-500/10 scale-110' : 'border-zinc-800 bg-zinc-950'
                }`}>
                  <Mic className={`w-12 h-12 ${isRecording ? 'text-emerald-500' : 'text-zinc-700'}`} />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold">{isRecording ? "Simulação Ativa" : "Pronto para Começar?"}</h2>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {isRecording 
                    ? "Fale naturalmente com o cliente. Ele está ouvindo e avaliando sua técnica." 
                    : "Clique no botão acima para iniciar a conversa com o cliente simulado."}
                </p>
              </div>

              {isRecording && (
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: [8, 24, 8] }}
                      transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                      className="w-1 bg-emerald-500 rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Quick Info */}
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Base de Conhecimento</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-zinc-400">Produto</span>
                  <span className="text-xs font-medium text-zinc-200">{product.name}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs text-zinc-400">Preço</span>
                  <span className="text-xs font-medium text-zinc-200">R$ {product.price}</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer Info */}
        <footer className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
          <div className="flex items-center gap-6">
            <span>Powered by Gemini 2.5 Flash</span>
            <span>Realtime Voice API</span>
          </div>
          <div>
            © 2026 SalesMaster Training
          </div>
        </footer>
      </div>
    </div>
  );
}
