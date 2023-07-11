const multer = require("multer");
const path = require('path')

const filefilter = (req, res, cb) => {
  if (
    res.mimetype == "image/png" || "image/jpg" || "image/jpeg" || 'image/pdf'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only .pdf, .png, .jpg and .jpeg .webp format allowed!"));
  }
};

const productUpload = multer.diskStorage({
  destination: "./Images",
  filename:(req, res, cb) => {
    return cb(null,`${res.fieldname}_${Date.now()}${path.extname(res.originalname)}`);
  },
});

const productImage = multer({
  storage: productUpload,
  fileFilter: filefilter,
  limits: { fileSize: 52428800 }
});

module.exports = {
  product: productImage,
};