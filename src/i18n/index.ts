import i18n from "i18next";
import translationFr from "./translations/fr.json";
import translationEn from "./translations/en.json";
import { initReactI18next } from "react-i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";

i18n.use(initReactI18next).use(I18nextBrowserLanguageDetector).init({
	fallbackLng: ["fr"],
	interpolation: {
		escapeValue: false
	},
	resources: {
		fr: {
			translation: translationFr
		},
		en: {
			translation: translationEn
		}
	}
});

export default i18n;