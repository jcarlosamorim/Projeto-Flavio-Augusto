import { useState, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { BarChart3, Loader2, MicOff, Play, RotateCcw, X } from 'lucide-react';
import { ProductInfo } from './types';
import { useGeminiLive } from './hooks/useGeminiLive';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { RecordingControls } from './components/RecordingControls';
import { ResultsScreen } from './components/ResultsScreen';

function SessionView() {
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const { connectionState, isSpeaking, error, metrics, connect, disconnect, resetMetrics, clearError } = useGeminiLive();

  const isConnecting = connectionState === 'connecting';
  const isActive = connectionState === 'active';
  const isMicDenied = error === 'MIC_DENIED';

  const handleEndSession = useCallback(() => {
    disconnect();
    navigate('/results', { state: { metrics } });
  }, [disconnect, navigate, metrics]);

  const toggleRecording = useCallback(() => {
    if (isActive) {
      handleEndSession();
    } else if (product && !isConnecting) {
      connect(product);
    }
  }, [isActive, isConnecting, product, connect, handleEndSession]);

  const handleReset = useCallback(() => {
    disconnect();
    setProduct(null);
    resetMetrics();
  }, [disconnect, resetMetrics]);

  const handleRetry = useCallback(() => {
    if (product) connect(product);
  }, [product, connect]);

  if (!product) {
    return <Onboarding onComplete={setProduct} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-8 pb-24 lg:pb-8">
      <a href="#main-content" className="skip-nav">Pular para o conteúdo principal</a>
      <div className="max-w-6xl mx-auto space-y-8">
        {error && !isMicDenied && (
          <div role="alert" className="flex items-center justify-between gap-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-sm text-red-400">{error}</p>
            <div className="flex items-center gap-2">
              <button onClick={handleRetry} className="text-xs font-bold text-red-400 hover:text-red-300 underline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2 rounded">
                Tentar novamente
              </button>
              <button onClick={clearError} aria-label="Fechar mensagem de erro" className="text-red-400 hover:text-red-300 focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6 lg:pb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <BarChart3 className="text-zinc-950 w-6 h-6 lg:w-7 lg:h-7" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight">SalesMaster Roleplay</h1>
              <p className="text-zinc-500 text-sm">Venda: <span className="text-zinc-300 font-medium">{product.name}</span></p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={handleReset}
              aria-label="Reiniciar sessão"
              className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={toggleRecording}
              disabled={isConnecting || isMicDenied}
              aria-label={isConnecting ? 'Conectando ao servidor' : isActive ? 'Encerrar sessão de simulação' : 'Iniciar simulação de vendas'}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all shadow-lg focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2 ${
                isConnecting
                ? 'bg-amber-500 text-zinc-950 shadow-amber-500/20 cursor-wait'
                : isActive
                ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/20'
                : isMicDenied
                ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed shadow-none'
                : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20'
              }`}
            >
              {isConnecting ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Conectando...</>
              ) : isActive ? (
                <><MicOff className="w-5 h-5" />Encerrar Sessao</>
              ) : (
                <><Play className="w-5 h-5 fill-current" />Iniciar Simulacao</>
              )}
            </button>
          </div>
        </header>

        <main id="main-content" className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            <Dashboard metrics={metrics} />
          </div>
          <RecordingControls connectionState={connectionState} isSpeaking={isSpeaking} isMicDenied={isMicDenied} product={product} />
        </main>

        <footer className="pt-6 lg:pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
          <div className="flex items-center gap-6">
            <span>Powered by Gemini 2.5 Flash</span>
            <span>Realtime Voice API</span>
          </div>
          <div>&copy; 2026 SalesMaster Training</div>
        </footer>
      </div>

      {/* Mobile sticky action bar */}
      <nav aria-label="Ações rápidas" className="fixed bottom-0 left-0 right-0 lg:hidden bg-zinc-950/95 backdrop-blur-sm border-t border-zinc-800 p-4 flex items-center gap-3">
        <button
          onClick={handleReset}
          aria-label="Reiniciar sessão"
          className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={toggleRecording}
          disabled={isConnecting || isMicDenied}
          aria-label={isConnecting ? 'Conectando ao servidor' : isActive ? 'Encerrar sessão' : 'Iniciar simulação'}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-bold transition-all focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2 ${
            isConnecting
            ? 'bg-amber-500 text-zinc-950 cursor-wait'
            : isActive
            ? 'bg-red-500 text-white'
            : isMicDenied
            ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
            : 'bg-emerald-500 text-zinc-950'
          }`}
        >
          {isConnecting ? (
            <><Loader2 className="w-5 h-5 animate-spin" />Conectando...</>
          ) : isActive ? (
            <><MicOff className="w-5 h-5" />Encerrar</>
          ) : (
            <><Play className="w-5 h-5 fill-current" />Iniciar</>
          )}
        </button>
      </nav>
    </div>
  );
}

function OnboardingRoute() {
  const navigate = useNavigate();

  const handleComplete = useCallback((product: ProductInfo) => {
    navigate('/session', { state: { product } });
  }, [navigate]);

  return <Onboarding onComplete={handleComplete} />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingRoute />} />
      <Route path="/session" element={<SessionView />} />
      <Route path="/results" element={<ResultsScreen />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}
