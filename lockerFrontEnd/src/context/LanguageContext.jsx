import { createContext, useContext, useState } from 'react';

// 1. Crea il contesto
const LanguageContext = createContext();

// 2. Crea il provider
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('it'); // 'it' di default

  const toggleLang = () => {
    setLang(prev => (prev === 'it' ? 'en' : 'it'));
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 3. Hook per usare il contesto nei componenti
export function useLanguage() {
  return useContext(LanguageContext);
}
