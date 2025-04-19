import DatauriParser from "datauri/parser.js";
import path from "path";

const parser = new DatauriParser();

const getDataUri = (file) => {
  const extName = path.extname(file.originalname).toLowerCase();
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif"];

  if (!validExtensions.includes(extName)) {
    throw new Error("Invalid image file");
  }

  return parser.format(extName, file.buffer);
};

export default getDataUri;