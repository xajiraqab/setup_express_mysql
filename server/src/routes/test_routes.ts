import express, { Request, Response } from "express"
import MiddleWares from "../middlewares/exports"
import { IDbTools } from "../db"
import Utils from "../utils"

const TestRoutes = express.Router()

TestRoutes.use(MiddleWares.checkUser)

TestRoutes.get("/db", async (_req: Request, res: Response) => {
  const db: IDbTools = res.locals.db!
  Utils.sendSuccess(res, await db.select("select * from users limit :limit", { limit: 100 }))
})

export default TestRoutes
