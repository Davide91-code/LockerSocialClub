import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button onClick={toggleLang}>
      {lang === 'it' ? '🇮🇹 Italiano' : '🇬🇧 English'}
    </button>
  );
}
