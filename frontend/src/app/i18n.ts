import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "../locales/en/translation.json";
import translationDE from "../locales/de/translation.json";

const resources = {
    en: {
        translation: translationEN,
    },
    de: {
        translation: translationDE,
    },
};

const languages = ["en", "de"];

i18n.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "de",
    interpolation: {
        escapeValue: false,
    },
    whitelist: languages,
    resources,
});

export default i18n;
