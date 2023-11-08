import multer from "multer";
import { __dirname } from "../../app.js";
import path from "path";

// Define los destinos para guardar los archivos según su tipo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "";

    switch (file.fieldname) {
      case "profile":
        // uploadPath = `${__dirname}/public/uploads/profiles`;
        uploadPath = path.join(__dirname, "public", "uploads", "profiles");
        break;
      case "product":
        uploadPath = path.join(__dirname, "public", "uploads", "products");
        break;
      case "document":
      case "identification":
      case "addresscomp":
      case "countcomp":
        uploadPath = path.join(__dirname, "public", "uploads", "documents");
        break;
      default:
        uploadPath = path.join(__dirname, "public", "uploads");
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timesTamp = Date.now();
    const newFileName =
      file.fieldname + "-" + timesTamp + "-" + file.originalname;
    cb(null, newFileName);
  },
});

const upload = multer({ storage });

export default upload;