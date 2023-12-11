import React, { createContext, useState, ReactNode, useContext } from "react";

// Definir la interfaz para las opciones de keywords
interface KeywordsContextData {
  keywords: string[];
  updateKeywords: (newKeywords: string[]) => void;
}

// Crear el contexto de keywords
export const KeywordsContext = createContext<KeywordsContextData | undefined>(undefined);

// Definir las propiedades del componente de contexto de keywords
interface KeywordsContextComponentProps {
  children: ReactNode;
}

// Crear el componente de contexto de keywords
const KeywordsContextComponent: React.FC<KeywordsContextComponentProps> = ({ children }) => {
  const [keywords, setKeywords] = useState<string[]>([]);

  const updateKeywords = (newKeywords: string[]) => {
    setKeywords(newKeywords);
  };

  const data: KeywordsContextData = {
    keywords,
    updateKeywords,
  };

  return <KeywordsContext.Provider value={data}>{children}</KeywordsContext.Provider>;
};

// Crear el hook personalizado para acceder al contexto de keywords
export const useKeywordsContext = () => {
  const context = useContext(KeywordsContext);
  if (!context) {
    throw new Error("useKeywordsContext must be used within a KeywordsContextProvider");
  }
  return context;
};

export default KeywordsContextComponent;
