import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Settings } from 'lucide-react';
import { ProductInfo, ConnectionState } from '../types';

interface RecordingControlsProps {
  connectionState: ConnectionState;
  isSpeaking: boolean;
  isMicDenied: boolean;
  product: ProductInfo;
}

function getIndicator(connectionState: ConnectionState, isSpeaking: boolean) {
  if (connectionState === 'connecting') return { glow: 'bg-amber-500/20', text: 'text-amber-500', label: 'Conectando...' };
  if (connectionState === 'error') return { glow: 'bg-red-500/20', text: 'text-red-500', label: 'Erro na conexão' };
  if (connectionState === 'active' && isSpeaking) return { glow: 'bg-blue-500/20', text: 'text-blue-500', label: 'IA Falando...' };
  if (connectionState === 'active') return { glow: 'bg-emerald-500/20', text: 'text-emerald-500', label: 'IA Ouvindo' };
  return { glow: '', text: 'text-zinc-700', label: 'Pronto para Começar?' };
}

function MicDeniedCard() {
  return (
    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
          <MicOff className="w-5 h-5 text-red-400" />
        </div>
        <h3 className="text-sm font-bold text-red-400">Microfone Bloqueado</h3>
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed">
        O acesso ao microfone foi negado. Para usar o roleplay de vendas, habilite o microfone:
      </p>
      <ol className="text-xs text-zinc-500 space-y-2 list-decimal list-inside">
        <li>Clique no ícone de <Settings className="w-3 h-3 inline" /> cadeado na barra de endereço</li>
        <li>Encontre <span className="text-zinc-300">Microfone</span> e altere para <span className="text-emerald-400">Permitir</span></li>
        <li>Recarregue a página e tente novamente</li>
      </ol>
    </div>
  );
}

export function RecordingControls({ connectionState, isSpeaking, isMicDenied, product }: RecordingControlsProps) {
  const isActive = connectionState === 'active';
  const isConnecting = connectionState === 'connecting';
  const ind = getIndicator(connectionState, isSpeaking);

  return (
    <aside aria-label="Controles de gravação" className="lg:col-span-4 space-y-6">
      {isMicDenied ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px] lg:min-h-[400px]">
          <div className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-red-500 bg-red-500/10">
            <MicOff className="w-12 h-12 text-red-500" />
          </div>
          <div className="space-y-2" role="alert">
            <h2 className="text-xl font-bold">Microfone Necessário</h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Permita o acesso ao microfone para iniciar o roleplay de vendas.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 lg:p-8 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px] lg:min-h-[400px]">
          <div className="relative">
            <AnimatePresence>
              {(isActive || isConnecting) && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: isConnecting ? 0.8 : 1.5, repeatType: "reverse" }}
                  className={`absolute inset-0 ${ind.glow} rounded-full blur-2xl`}
                />
              )}
            </AnimatePresence>
            <div className={`w-24 h-24 lg:w-32 lg:h-32 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
              isActive ? `border-emerald-500 ${ind.glow.replace('/20', '/10')} scale-110`
              : isConnecting ? 'border-amber-500 bg-amber-500/10 scale-105'
              : connectionState === 'error' ? 'border-red-500 bg-red-500/10'
              : 'border-zinc-800 bg-zinc-950'
            }`}>
              {isConnecting ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <Mic className="w-10 h-10 lg:w-12 lg:h-12 text-amber-500" />
                </motion.div>
              ) : (
                <Mic className={`w-10 h-10 lg:w-12 lg:h-12 ${ind.text}`} />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg lg:text-xl font-bold">{isActive ? 'Simulação Ativa' : ind.label}</h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              {isActive
                ? (isSpeaking ? 'A IA está respondendo. Aguarde para falar.' : 'Fale naturalmente com o cliente. Ele está ouvindo.')
                : isConnecting ? 'Estabelecendo conexão com a IA...'
                : connectionState === 'error' ? 'Não foi possível conectar. Tente novamente.'
                : 'Clique no botão acima para iniciar a conversa com o cliente simulado.'}
            </p>
          </div>

          {isActive && (
            <div className="flex items-center gap-2" role="status" aria-live="polite">
              <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-blue-500' : 'bg-emerald-500'} animate-pulse`} aria-hidden="true" />
              <span className={`text-xs font-medium ${isSpeaking ? 'text-blue-400' : 'text-emerald-400'}`}>
                {ind.label}
              </span>
            </div>
          )}

          {isActive && !isSpeaking && (
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
      )}

      {isMicDenied && <MicDeniedCard />}

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
    </aside>
  );
}
