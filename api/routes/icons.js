const express = require('express');
const router = express.Router();
const findIcon = require('../lib/getIcon')

const getIcon = async (req, res) => {
  const iconName = req.params.iconName;
  const iconsDir = path.join(mapeoConfigFolder, "icons");
  const iconPath = path.join(iconsDir, iconName);
  const { err, data } = await findIcon(iconPath)
  if (data) {
    res.send(svgData);
  } else {
    res.status(404).json(err);
  }
};

router.get('/:iconName', getIcon);

module.exports = router;