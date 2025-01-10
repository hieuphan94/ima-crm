export default function LanguageSelector({ selectedLang, onSelect }) {
  const languages = [
    { code: 'fr', flag: '/images/flags/fr.png' },
    { code: 'en', flag: '/images/flags/en.png' },
    { code: 'de', flag: '/images/flags/de.png' },
  ];

  return (
    <div className="flex gap-1.5">
      {languages.map((lang) => (
        <div
          key={lang.code}
          className={`w-6 h-4 relative cursor-pointer ${
            selectedLang === lang.code ? 'bg-blue-100' : 'hover:opacity-80'
          }`}
          onClick={() => onSelect(lang.code)}
        >
          <Image src={lang.flag} alt={lang.code} width={24} height={24} />
        </div>
      ))}
    </div>
  );
}
