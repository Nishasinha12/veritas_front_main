import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// ✅ locales are in the same folder as i18n.js
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import zh from './locales/zh.json';
import hi from './locales/hi.json';

export const languageResources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  zh: { translation: zh },
  hi: { translation: hi },
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en', // default
  fallbackLng: 'en',
  resources: languageResources,
  interpolation: { escapeValue: false },
});

export default i18next;
