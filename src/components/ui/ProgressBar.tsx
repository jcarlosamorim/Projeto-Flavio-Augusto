import { motion } from 'motion/react';

interface ProgressBarProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressBar({ value, label, showPercentage = false, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`space-y-1 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider">
          {label && <span className="text-zinc-400">{label}</span>}
          {showPercentage && <span className="text-emerald-500">{clamped}%</span>}
        </div>
      )}
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full bg-emerald-500 rounded-full"
        />
      </div>
    </div>
  );
}
