import { derived } from 'svelte/store';
import { dictionary, locale, _ } from 'svelte-i18n';

const MESSAGE_FILE_URL_TEMPLATE = '../lang/{locale}.json';

let cachedLocale;

function setupI18n({ withLocale: _locale } = { withLocale: 'ru' }) {
    const messsagesFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace('{locale}', _locale);
    console.log(messsagesFileUrl)
    return fetch(messsagesFileUrl)
        .then(response => response.json())
        .then((messages) => {
            dictionary.set({ [_locale]: messages });
            console.log( messages )
            cachedLocale = _locale;

            locale.set(_locale);
        });
}

function formatDate(date, options) {
    return new Intl.DateTimeFormat(cachedLocale, options)
        .format(new Date(date));
}

const isLocaleLoaded = derived(locale, $locale => typeof $locale === 'string');

const dir = derived(locale, $locale => $locale === 'en' ? 'ltr' : 'ltr');

export { _, locale, dir, setupI18n, formatDate, isLocaleLoaded };