import { ReactNode } from 'react';

interface StatusBoxProps {
  children: ReactNode;
  className?: string;
}

export default function StatusBox({ children, className = '' }: StatusBoxProps) {
  return (
    <div className={`p-4 bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
      <h3 className="font-bold text-gray-800 mb-1">Status:</h3>
      <p className="text-gray-700">{children}</p>
    </div>
  );
}