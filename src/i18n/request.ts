import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as 'it' | 'en')) {
    locale = routing.defaultLocale
  }

  const l = locale as 'it' | 'en'

  // Ogni modulo importa le proprie traduzioni dal proprio locales/
  const [configurator] = await Promise.all([
    import(`@/modules/configurator/locales/${l}`).then((m) => m.default),
    // Aggiungere qui i nuovi moduli:
    // import(`@/modules/scene/locales/${l}`).then((m) => m.default),
  ])

  return {
    locale,
    messages: {
      configurator,
    },
  }
})
