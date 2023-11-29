import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { IUser } from "../interfaces"
import { getDbTools } from "../db"
import Utils from "../utils"

export async function checkUser(req: Request, res: Response, next: NextFunction) {
  res.locals.db = await getDbTools()
  res.locals.db.beginTransaction() // ეს შეიძლება წასაშლელი იყოს, ახლა ყველა მოთხოვნაზე იწყება ტრანზაქცია და Utils.sendSuccess კომიტდება, თუარადა როლბექდება

  const authorizationHeader = req.headers["authorization"]
  if (!authorizationHeader) {
    next()
    return
  }

  const token = authorizationHeader.split(" ")[1]
  try {
    const data: any = jwt.verify(token, process.env.JWT_SECRET || "")
    const user: IUser | null = await res.locals.db.getUserById(data.id)
    if (!user) {
      throw new Error("user not found")
    }
    res.locals.user = user

    next()
  } catch (error) {
    console.log(error)
    Utils.sendError(res, "invalid access token")
  }
}

export async function authRequired(_: Request, res: Response, next: NextFunction) {
  if (!res.locals.user) Utils.sendError(res, "Authentication Required", 407)
  else next()
}
