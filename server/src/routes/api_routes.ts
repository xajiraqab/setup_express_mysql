import express, { Request, Response } from "express"
import MiddleWares from "../middlewares/exports"
import Utils from "../utils"
import C_Auth from "../controlers/auth/exports"

const ApiRoutes = express.Router()

ApiRoutes.use(MiddleWares.checkUser)

ApiRoutes.get("/ping", async (_req: Request, res: Response) => {
  Utils.sendSuccess(res, "pong")
})

// Auth
ApiRoutes.post("/login", C_Auth.login)
ApiRoutes.post("/register", C_Auth.register)
ApiRoutes.get("/userInfo", MiddleWares.authRequired, C_Auth.userInfo)
ApiRoutes.post("/refreshToken", C_Auth.refreshToken)

export default ApiRoutes
