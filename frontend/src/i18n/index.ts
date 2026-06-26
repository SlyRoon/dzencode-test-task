import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.json';
import en from './locales/en.json';

export const LANGUAGE_STORAGE_KEY = 'app_lang';

const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'ru';

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: savedLanguage,
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
  returnObjects: true,
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  document.documentElement.lang = lng;
});

document.documentElement.lang = savedLanguage;

export default i18n;
