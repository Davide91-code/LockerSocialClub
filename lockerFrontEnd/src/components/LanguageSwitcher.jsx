import { useLanguage } from '../context/LanguageContext';
import i18n from '../i18n';

export default function LanguageSwitcher() {
  const { lang, changeLanguage } = useLanguage();

  const languages = [
    { code: 'it', label: '🇮🇹 Italiano' },
    { code: 'en', label: '🇬🇧 English' },
    { code: 'es', label: '🇪🇸 Español' }
  ];

  return (
    <div>
      {languages.map(langOption => (
        <button
          key={langOption.code}
          onClick={() => changeLanguage(langOption.code)}
          disabled={lang === langOption.code}
        >
          {langOption.label}
        </button>
      ))}
    </div>
  );
}
