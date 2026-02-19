const { getProperty, setProperty } = require("dot-prop-extra");

const DEFAULT_LANG = "es";
const FALLBACK_LANG = "en";

module.exports = function (type, thing, key, translations) {
  const defaultTranslations = getProperty(
    translations[DEFAULT_LANG],
    `${type}.${key}`,
  );
  const fallbackTranslations = getProperty(
    translations[FALLBACK_LANG],
    `${type}.${key}`,
  );

  // Merge translation keys: use default language first, fallback for missing keys
  const allTranslationKeys = new Set([
    ...Object.keys(fallbackTranslations || {}),
    ...Object.keys(defaultTranslations || {}),
  ]);

  // nested properties with filter syntax (like 'options[value="open"].label')
  for (const propPath of allTranslationKeys) {
    // Prefer default language, fall back to fallback language
    const translatedValue =
      defaultTranslations?.[propPath] ?? fallbackTranslations?.[propPath];

    if (translatedValue !== undefined) {
      setProperty(thing, propPath, translatedValue);
    }
  }
};
