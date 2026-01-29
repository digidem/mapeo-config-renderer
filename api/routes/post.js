const log = require("../lib/log");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs/promises");

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
    const id = crypto.randomUUID();
    const newPath = `/tmp/${id}.comapeocat`;
    await fs.rename(req.file.path, newPath);
    log("new file path", req.file.path);
    res.redirect(`http://localhost:3000/catfile/${id}`);
  });
}
module.exports = post;
