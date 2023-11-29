import { Request, Response } from "express"
import Utils from "../../../utils"

export async function userInfo(_: Request, res: Response) {
  Utils.sendSuccess(res, res.locals.user)
}
