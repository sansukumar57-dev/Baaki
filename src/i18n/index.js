import en from './en.js';
import hi from './hi.js';
import mr from './mr.js';

export const translations = { en, hi, mr };

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' }
];

export function getTranslation(lang = 'en') {
  return translations[lang] || translations.en;
}
