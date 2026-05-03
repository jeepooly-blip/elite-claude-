import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Don't use locale prefix for default locale
  localePrefix: 'always',
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en|fr|nl|de|da|es|zh|ru|hi|pt)/:path*'],
};
