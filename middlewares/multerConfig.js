const multer = require("multer");

const imageStorage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
});

const excelStorage = multer.memoryStorage();

const excelFileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only Excel files are allowed"), false);
  }
};

const uploadExcel = multer({
  storage: excelStorage,
  fileFilter: excelFileFilter,
});

module.exports = { uploadImage, uploadExcel };
