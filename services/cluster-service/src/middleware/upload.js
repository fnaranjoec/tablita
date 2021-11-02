import accessEnv from "#root/helpers/accessEnv";
import normalizeFileName from "#root/middleware/normalize";

const util = require("util");
const path = require("path");
const multer = require("multer");
const fileSize = 5 * 1024 * 1024;
const UPLOAD_PATH = accessEnv("UPLOAD_PATH", '/opt/app/uploads');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // const directoryPath = path.join(path.dirname(require.main.filename), "resources/static/assets/uploads/") ;
        // const directoryPath = "/opt/app/uploads" ;
        // cb(null, __basedir + "/resources/static/assets/uploads/");
        cb(null, UPLOAD_PATH);
    },
    filename: (req, file, cb) => {
        cb(null, normalizeFileName(file.originalname) );
    },
});

let uploadFile = multer({
    storage: storage,
    limits: {fileSize},
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
