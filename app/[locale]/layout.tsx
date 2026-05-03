import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages();

  // Determine text direction
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className="scroll-smooth">
      <body className={`min-h-screen ${dir === 'rtl' ? 'font-arabic' : 'font-sans'}`}>
        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col min-h-screen">
            <Navigation locale={locale} />
            <main className="flex-1">
              {children}
            </main>
            <Footer locale={locale} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
