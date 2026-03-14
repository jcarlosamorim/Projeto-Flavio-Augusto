import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { ProductInfo } from '../types';

export function Onboarding({ onComplete }: { onComplete: (info: ProductInfo) => void }) {
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

        <form onSubmit={e => { e.preventDefault(); if (info.name && info.description) onComplete(info); }} className="space-y-6">
          <div>
            <label htmlFor="product-name" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Nome do Produto</label>
            <input
              id="product-name"
              type="text"
              required
              value={info.name}
              onChange={e => setInfo({ ...info, name: e.target.value })}
              placeholder="Ex: Software de Gestão"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="product-description" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Descrição / Benefícios</label>
            <textarea
              id="product-description"
              required
              value={info.description}
              onChange={e => setInfo({ ...info, description: e.target.value })}
              placeholder="Descreva o que o produto faz e seus diferenciais..."
              rows={4}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2 transition-colors resize-none"
            />
          </div>
          <div>
            <label htmlFor="product-price" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Valor (R$)</label>
            <input
              id="product-price"
              type="text"
              value={info.price}
              onChange={e => setInfo({ ...info, price: e.target.value })}
              placeholder="Ex: 299,00 / mês"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={!info.name || !info.description}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-zinc-950 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
          >
            Começar Roleplay
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
