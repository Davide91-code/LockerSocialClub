import { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

// Crea il contesto
const LanguageContext = createContext();

// Provider
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('it');

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  const changeLanguage = (newLang) => {
    setLang(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 👉 QUESTA PARTE SERVE!
export function useLanguage() {
  return useContext(LanguageContext);
}