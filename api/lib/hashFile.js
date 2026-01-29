const crypto = require("crypto");
const fs = require("fs/promises");

async function hashFile(path) {
  const data = await fs.readFile(path);
  const hash = crypto.createHash("sha256").update(data).digest("base64url");
  return hash.slice(0, 12);
}

module.exports = hashFile;
