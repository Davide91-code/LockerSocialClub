import { useState } from 'react';

export default function LanguageSwitcher() {
  const [lang, setLang] = useState('it'); 
  const toggleLang = () => {
    setLang(prevLang => (prevLang === 'it' ? 'en' : 'it'));
  };

  return (
    <button onClick={toggleLang}>
      {lang === 'it' ? '🇮🇹 Italiano' : '🇬🇧 English'}
    </button>
  );
}
