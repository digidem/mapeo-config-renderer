const log = require("../lib/log");
const multer = require("multer");
const fs = require("fs/promises");

const hashFile = require("../lib/hashFile.js");

/**
  @param {Express} app
  */
function post(app) {
  const storage = multer.diskStorage({
    destination: "/tmp",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (!file.originalname.endsWith(".comapeocat")) {
        return cb(new Error("Only .comapeocat files allowed"));
      }
      cb(null, true);
    },
  });

  app.post("/upload", upload.single("categories"), async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }
    const id = await hashFile(req.file.path);
    const newPath = `/tmp/${id}.comapeocat`;
    await fs.rename(req.file.path, newPath);
    log("new file path", newPath);
    res.redirect(`/#/catfile/${id}`);
  });
}
module.exports = post;
