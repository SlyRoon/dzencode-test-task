import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

const LANGUAGES = [
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith("en") ? "en" : "ru";

  return (
    <div className="lang-switcher" role="group" aria-label="Language switcher">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          className={`lang-switcher__btn ${current === code ? "lang-switcher__btn--active" : ""}`}
          onClick={() => i18n.changeLanguage(code)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
