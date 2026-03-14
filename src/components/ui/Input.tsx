import React from 'react';

const base = 'w-full bg-zinc-950 border rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 transition-colors focus:outline-none';
const states = {
  default: 'border-zinc-800 focus:border-emerald-500',
  error: 'border-red-500 focus:border-red-400',
  disabled: 'border-zinc-800 opacity-50 cursor-not-allowed',
};

function getState(error?: string, disabled?: boolean) {
  if (disabled) return states.disabled;
  return error ? states.error : states.default;
}

function Label({ label, htmlFor }: { label?: string; htmlFor?: string }) {
  if (!label) return null;
  return <label htmlFor={htmlFor} className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">{label}</label>;
}

function Err({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="mt-1.5 text-xs text-red-400">{error}</p>;
}

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, disabled, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div>
        <Label label={label} htmlFor={inputId} />
        <input ref={ref} id={inputId} disabled={disabled} className={`${base} ${getState(error, disabled)} ${className}`} {...props} />
        <Err error={error} />
      </div>
    );
  },
);
Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, disabled, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div>
        <Label label={label} htmlFor={inputId} />
        <textarea ref={ref} id={inputId} disabled={disabled} className={`${base} ${getState(error, disabled)} resize-none ${className}`} {...props} />
        <Err error={error} />
      </div>
    );
  },
);
TextArea.displayName = 'TextArea';
