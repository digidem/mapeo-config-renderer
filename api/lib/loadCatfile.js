const path_ = require("path");
const log = require("../lib/log");

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/tmp";

function createCatFileLoader() {
  let cache = {};
  return async function loadCatFile(path = "default") {
    if (cache[path] !== undefined) {
      log(`catfile at ${path} already loaded, returning cached version`);
      return cache[path];
    }
    log("loading catfile on path", path);
    const filepath =
      path == "default"
        ? path_.join(__dirname, "..", "..", "default.comapeocat")
        : `${UPLOAD_DIR}/${path}.comapeocat`;
    const { Reader } = await import("comapeocat");
    const reader = new Reader(filepath);
    const categories = await reader.categories();
    const categorySelection = await reader.categorySelection();
    const fields = await reader.fields();
    const metadata = await reader.metadata();
    const translations = {};
    for await (const { lang, translations: tr } of reader.translations()) {
      translations[lang] = tr;
    }
    const obj = {
      reader,
      categories,
      categorySelection,
      fields,
      metadata,
      translations,
    };
    cache[path] = obj;
    return obj;
  };
}

module.exports = createCatFileLoader;
