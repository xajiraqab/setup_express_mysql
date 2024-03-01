import express, { Request, Response, NextFunction } from "express"
import multer from "multer"
import fs from "fs"
import fse, { mkdirSync } from "fs-extra"
import path from "path"
import extract from "extract-zip"
import Utils from "../utils"

const UpdaterRoutes = express.Router()

const rootDir = path.dirname(__dirname)
const uploadDir = path.join(rootDir, "update")

// SET STORAGE
const upload = multer({
  storage: multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, uploadDir)
    },
    filename: function (_req, file, cb) {
      cb(null, file.originalname)
    },
  }),
})

UpdaterRoutes.post(
  "/",
  (_req: Request, _res: Response, next: NextFunction) => {
    try {
      fs.rmSync(uploadDir, { recursive: true })
    } catch {}

    fs.mkdirSync(uploadDir)

    next()
  },

  upload.single("file"),

  async (req: Request, res: Response) => {
    const file = req.file

    if (!file) {
      Utils.sendError(res, "Please upload a file")
      return
    }

    // assets-ის წაშლა
    const extensionsToRemove = [".js", ".css"]
    const directoryPath = path.join(rootDir, "public", "assets")
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err)
        return
      }

      files.forEach((file) => {
        const filePath = path.join(directoryPath, file)
        const fileExtension = path.extname(filePath)

        if (extensionsToRemove.includes(fileExtension)) {
          try {
            fs.unlinkSync(filePath)
          } catch (error) {
            console.log(error)
          }
        }
      })
    })

    // unzip
    await extract(path.join(uploadDir, "Build.zip"), { dir: uploadDir })

    fs.rmSync(uploadDir + "/Build.zip", { force: true, recursive: true })

    if (process.env.NODE_ENV === "production") {
      fse.copySync(uploadDir, path.join(rootDir), { overwrite: true })
    } else {
      try {
        mkdirSync(path.join(rootDir, "jax"))
      } catch {}

      fse.copySync(uploadDir, path.join(rootDir, "jax"), { overwrite: true })
    }

    Utils.sendSuccess(res, "** Updated successfully **")
  }
)

export default UpdaterRoutes
