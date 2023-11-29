import env from "dotenv"
env.config()

import express, { Request, Response } from "express"
import bodyParser from "body-parser"
import ApiRoutes from "./routes/api_routes"
import TestRoutes from "./routes/test_routes"
import UpdaterRoutes from "./routes/updater_routes"

const app = express()
const port = process.env.PORT || 5000

app.use(express.static("public"))
app.use(bodyParser.json())

app.use("/update_on_cpanel", UpdaterRoutes)
app.use("/test", TestRoutes)
app.use("/api", ApiRoutes)

app.get("*", (req: Request, res: Response) => {
  res.locals.db?.release()
  res.sendFile(__dirname + "/public/index.html")
})

;(async () => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
})()
