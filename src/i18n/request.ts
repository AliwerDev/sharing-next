import {getRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers';
import {routing} from './routing';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  // Get locale from cookie 'NEXT_LOCALE' or use default
  let locale = cookieStore.get('NEXT_LOCALE')?.value || routing.defaultLocale;

  // Validate that the incoming locale is supported
  if (!routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
