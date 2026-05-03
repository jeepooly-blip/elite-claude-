import { getRequestConfig } from 'next-intl/server';

// Only enable languages we have translations for
export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // Fallback to English if locale not supported
  const validLocale = locales.includes(locale as Locale) ? locale : 'en';

  try {
    return {
      messages: (await import(`./messages/${validLocale}.json`)).default,
    };
  } catch (error) {
    // Fallback to English if translation file missing
    return {
      messages: (await import(`./messages/en.json`)).default,
    };
  }
});
