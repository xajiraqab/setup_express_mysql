import { Request, Response } from "express"
import schema_registration from "./schema"
import Utils from "../../../utils"
import { IDbTools } from "../../../db"
import { IDbResponse } from "../../../db/db_interfaces"

export default async function register(req: Request, res: Response) {
  if (!Utils.validateSchema(res, schema_registration, req.body!)) return

  const db: IDbTools = res.locals.db!
  const body = req.body
  const hashedPassword = Utils.getCryptoHash(body.email + body.password)

  if (await db.getUserByEmail(body.email)) {
    return Utils.sendError(res, "email already exists!")
  }

  const dbRes: IDbResponse = await db.insert("users", {
    email: body.email,
    password: hashedPassword,
  })

  if (dbRes.error) {
    return Utils.sendError(res, dbRes.error.message)
  }

  Utils.sendSuccess(res, { message: "user created successfully" })
}
