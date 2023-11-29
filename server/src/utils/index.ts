import { Response } from "express"
import Joi from "joi"
import crypto from "crypto"
import { deleteImage } from "./images_manip";


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


const Utils = {
  sendSuccess,
  sendError,
  sendRedirect,
  validateSchema,
  getCryptoHash,
  deleteImage: deleteImage
}


export default Utils