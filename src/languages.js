import en from './lang/en.json'
import ru from './lang/ru.json'

export const languages = {
    en: {
        name: 'English',
        flag: 'us.png',
        messages: en,
    },
    ru: {
        name: 'Русский',
        flag: 'ru.png',
        messages: ru,
    },
}

export const defaultLocale = 'en'
