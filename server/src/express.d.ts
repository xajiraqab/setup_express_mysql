import { Response } from "express"
import { IUser } from "./interfaces"
import { IDbTools } from "./db"

declare module "express" {
  interface Response {
    locals: {
      user?: IUser
      db?: IDbTools
    }
  }
}
