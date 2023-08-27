const fs = require('fs').promises;
const path = require('path');

module.exports = async (iconPath) => {
    try {
        const stats = await fs.stat(iconPath);
        if (stats.isFile() && path.extname(iconPath) === ".svg") {
            const svgData = await fs.readFile(iconPath, "utf-8");
            return svgData
        } else {
            return { error: "Icon not found." }
        }
    } catch (err) {
        return { error: "Icon not found." }
    }
}