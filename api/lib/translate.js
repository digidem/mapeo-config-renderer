const { getProperty, setProperty } = require("dot-prop-extra");

const FALLBACK_LANG = "en";

/**
 * Translates properties of an object using the provided translations
 * @param {string} type - The type of item being translated ('category' or 'field')
 * @param {object} thing - The object to translate (mutated in place)
 * @param {string} key - The key of the item in translations
 * @param {object} translations - The translations object containing all languages
 * @param {string} [lang] - The target language code (defaults to FALLBACK_LANG)
 */
module.exports = function (
  type,
  thing,
  key,
  translations,
  lang = FALLBACK_LANG,
) {
  // Collect all translation keys from both target and fallback languages
  // to ensure we translate all properties even if some are missing in the target language
  const targetTranslations = getProperty(translations[lang], `${type}.${key}`);
  const fallbackTranslations =
    lang !== FALLBACK_LANG
      ? getProperty(translations[FALLBACK_LANG], `${type}.${key}`)
      : null;

  // Merge translation keys: use target language first, fallback for missing keys
  const allTranslationKeys = new Set([
    ...Object.keys(fallbackTranslations || {}),
    ...Object.keys(targetTranslations || {}),
  ]);

  // Iterate over all translation keys and apply them using setProperty
  // This handles both simple properties (like "label") and
  // nested properties with filter syntax (like 'options[value="open"].label')
  for (const propPath of allTranslationKeys) {
    // Prefer target language, fall back to fallback language
    const translatedValue =
      targetTranslations?.[propPath] ?? fallbackTranslations?.[propPath];

    if (translatedValue !== undefined) {
      setProperty(thing, propPath, translatedValue);
    }
  }
};
