import { Request, Response } from "express"
import { IUser } from "../../../interfaces"
import schema_login from "./schema"
import Utils from "../../../utils"
import Tokens from "../../../utils/tokens"
import { IDbTools } from "../../../db"

export default async function login(req: Request, res: Response) {
  if (!Utils.validateSchema(res, schema_login, req.body)) return

  const body = req.body
  const db: IDbTools = res.locals.db!

  const user: IUser | null = await db.getUserByEmail(body.email)
  if (!user) {
    return Utils.sendError(res, "user with this email doesn't exist")
  }

  // check password
  const hashedPassword = Utils.getCryptoHash(body.email + body.password)
  if (hashedPassword !== user.password) {
    return Utils.sendError(res, "password is invalid")
  }

  // success
  const accessToken: string = Tokens.getAccessToken(user.id!)
  const refreshToken: string = Tokens.getRefreshToken(user.id!)

  return Utils.sendSuccess(res, {
    accessToken,
    refreshToken,
    user: { ...user, password: undefined },
  })
}
