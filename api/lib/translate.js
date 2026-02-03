const { getProperty } = require("dot-prop-extra");

const DEFAULT_LANG = "es";

module.exports = function (type, thing, key, translations) {
  for (let prop of Object.keys(thing)) {
    const translatedProp = getProperty(
      translations[DEFAULT_LANG],
      `${type}.${key}.${prop}`,
    );
    if (translatedProp !== undefined) {
      thing[prop] = translatedProp;
    }
  }
};
