import { createContext, useContext, useState, ReactNode } from 'react';

interface HelpContextType {
  helpContent: string;
  setHelpContent: (content: string) => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export function HelpProvider({ children }: { children: ReactNode }) {
  const [helpContent, setHelpContent] = useState<string>('');
  
  return (
    <HelpContext.Provider value={{ helpContent, setHelpContent }}>
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