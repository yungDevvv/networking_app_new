import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

const SUPPORTED_LOCALES = ['fi', 'en'];
const DEFAULT_LOCALE = 'fi';

export default getRequestConfig(async ({ request }) => {
  const cookie = await cookies();
  const cookieLocale = cookie.get('locale')?.value;

  const locale = SUPPORTED_LOCALES.includes(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});