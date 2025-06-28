import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = "font-medium rounded-lg transition-all focus:outline-none transform hover:scale-[1.03] active:scale-[0.98] flex items-center";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300 shadow-md hover:shadow-lg",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-300 shadow-sm hover:shadow-md",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-300 shadow-md hover:shadow-lg",
  };
  
  const sizeClasses = {
    sm: "py-1.5 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}