import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { IUser } from "../../../interfaces"
import schema_refreshToken from "./schema"
import Utils from "../../../utils"
import { IDbTools } from "../../../db"
import Tokens from "../../../utils/tokens"

export default async function refreshToken(req: Request, res: Response) {
  try {
    if (!Utils.validateSchema(res, schema_refreshToken, req.body!)) return

    const body = req.body
    const data: any = jwt.verify(body.token, process.env.JWT_SECRET || "")
    const db: IDbTools = res.locals.db!

    const user: IUser | null = await db.getUserById(data.id)
    if (!user) throw new Error("invalid token")

    // success
    const accessToken: string = Tokens.getAccessToken(user.id!)
    Utils.sendSuccess(res, { accessToken, user })
  } catch (error: any) {
    Utils.sendError(res, error.message, 401)
  }
}
