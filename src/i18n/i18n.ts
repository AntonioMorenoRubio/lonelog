import en from "./en";
import es from "./es";

const locales: Record<string, any> = {
	en,
	es,
};

let currentLocale = "en";

export function setLocale(locale: string) {
	if (locales[locale]) {
		currentLocale = locale;
	}
}

export function t(key: string): string {
	const parts = key.split(".");
	let res = locales[currentLocale] || locales["en"];
	
	for (const part of parts) {
		res = res[part];
		if (!res) {
			// Fallback to English if key missing in current locale
			let fallback = locales["en"];
			for (const fp of parts) {
				fallback = fallback[fp];
				if (!fallback) return key;
			}
			return fallback;
		}
	}
	
	return res as string;
}
