const fs = require('fs').promises;
const path = require('path');

module.exports = async (fieldsDir) => {
    const files = await fs.readdir(fieldsDir);
    console.log(files)
    const fields = await Promise.all(files.map(async (file) => {
      if (path.extname(file) === '.json') {
        const filePath = path.join(fieldsDir, file);
        const rawData = await fs.readFile(filePath, "utf-8");
        return JSON.parse(rawData);
      }
      return null;
    }));
    const filteredFields = fields.filter(field => field !== null);
    return filteredFields
}