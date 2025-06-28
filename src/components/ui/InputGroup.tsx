import { InputHTMLAttributes, ReactNode } from 'react';

interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: 'text' | 'password';
  button?: ReactNode;
  fullWidth?: boolean;
}

export default function InputGroup({
  label,
  type = 'text',
  button,
  fullWidth = false,
  className = '',
  ...props
}: InputGroupProps) {
  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''} input-focus transition-all`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="flex gap-2 transition-all">
        <input
          type={type}
          className={`flex-1 border border-gray-300 rounded-lg p-2.5 focus:outline-none transition-all ${className}`}
          {...props}
        />
        {button}
      </div>
    </div>
  );
}