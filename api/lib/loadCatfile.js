async function loadCatfile(path = "default") {
  const filepath =
    path == "default" ? "./default.comapeocat" : `/tmp/${path}.comapeocat`;
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
  return {
    reader,
    categories,
    categorySelection,
    fields,
    metadata,
    translations,
  };
}

module.exports = loadCatfile;
