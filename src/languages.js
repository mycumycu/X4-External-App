import en from "./lang/en.json";
import ru from "./lang/ru.json";
import es from "./lang/es.json";

export const languages = {
  en: {
    name: "English",
    flag: "us.png",
    messages: en,
  },
  ru: {
    name: "Русский",
    flag: "ru.png",
    messages: ru,
  },
  es: {
    name: "Español",
    flag: "es.png",
    messages: es,
  },
};

export const defaultLocale = "en";
