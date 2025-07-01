import { createContext, useContext, useState, ReactNode } from 'react';

interface HelpContextType {
  helpContent: string | ReactNode; // Changed to support JSX
  setHelpContent: (content: string | ReactNode) => void;
  setStyledHelpContent: (lines: {text: string, className?: string}[]) => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export function HelpProvider({ children }: { children: ReactNode }) {
  const [helpContent, setHelpContent] = useState<string | ReactNode>('');
  
  // New method to set styled content
  const setStyledHelpContent = (lines: {text: string, className?: string}[]) => {
    const content = (
      <div className="space-y-2">
        {lines.map((line, index) => (
          <p key={index} className={line.className || 'text-gray-700'}>
            {line.text}
          </p>
        ))}
      </div>
    );
    setHelpContent(content);
  };
  
  return (
    <HelpContext.Provider value={{ helpContent, setHelpContent, setStyledHelpContent }}>
      {children}
    </HelpContext.Provider>
  );
}

export function useHelp() {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
}