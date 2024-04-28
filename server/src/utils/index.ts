import { Response } from "express"
import Joi from "joi"
import crypto from "crypto"
import { deleteImage } from "./images_manip";
import path from "path"
import fs from "fs"
import { v4 as uuidv4 } from 'uuid';

function validateSchema(res: Response, schema: () => Joi.ObjectSchema<any>, data: any) {
  const { error }: { value: any; error: any } = schema().validate(data)

  if (error) {
    sendError(res, error.details[0].message, 422)
    return false
  }

  return true
}


function getCryptoHash(data: string) {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex")
}


function sendError(res: Response, message: string, status: number = 400) {
  if (res.locals.db) {
    res.locals.db.rollback()
    res.locals.db.release()
  }
  res.status(status).json({ message: message })
}


function sendSuccess(res: Response, data: any, status: number = 200) {
  if (res.locals.db) {
    res.locals.db.commit()
    res.locals.db.release()
  }
  const resp = typeof data === "string" ? { message: data } : data
  res.status(status).json(resp)
}


function sendRedirect(res: Response, url: string) {
  if (res.locals.db) {
    res.locals.db.rollback()
    res.locals.db.release()
  }
  res.redirect(url)
}

function getPublicPath() {
  if (process.env.NODE_ENV === "production") {
    return path.join(__dirname, "..", "public")
  } else {
    return path.join(__dirname, "..", "..", "public")
  }
}

function getRootFolder() {
  if (process.env.NODE_ENV === "production") {
    return path.join(__dirname, "..")
  } else {
    return path.join(__dirname, "..", "..")
  }
}

function saveImageFromBase64(folder_name: string, image: string): string {
  const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const fileName = `${uuidv4()}.png`

  const folderPath = path.join(Utils.getPublicPath(), "images", folder_name)
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
  }

  fs.writeFileSync(path.join(folderPath, fileName), buffer, { encoding: 'base64' });
  return fileName
}

function removeImage(folder_name: string, image: string): void {
  const filePath = path.join(Utils.getPublicPath(), "images", folder_name, image)
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath)
    }
    catch (error: any) { console.log(error) }
  }
}

const Utils = {
  sendSuccess,
  sendError,
  sendRedirect,
  validateSchema,
  getCryptoHash,
  deleteImage: deleteImage,
  getPublicPath,
  getRootFolder,
  saveImageFromBase64,
  removeImage
}


export default Utils
