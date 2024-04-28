import env from "dotenv"
env.config()

import express, { Request, Response, NextFunction } from "express"
import bodyParser from "body-parser"
import ApiRoutes from "./routes/api_routes"
import TestRoutes from "./routes/test_routes"
import UpdaterRoutes from "./routes/updater_routes"
import cors from "cors"

const app = express()
const port = process.env.PORT || 5000

app.get('/*', function (req: Request, res: Response, next: NextFunction) {
  if (req.headers && req.headers.host && req.headers.host.match(/^www/) !== null) {
    res.redirect('https://' + req.headers.host.replace(/^www\./, '') + req.url);
  } else {
    next();
  }
})

app.use(express.static("public"))
app.use(cors())
app.use(bodyParser.json({ limit: '10mb' }))

app.use("/update_on_cpanel", UpdaterRoutes)
app.use("/test", TestRoutes)
app.use("/api", ApiRoutes)

app.get("*", (req: Request, res: Response) => {
  res.locals.db?.release()
  res.sendFile(__dirname + "/public/index.html")
})

async function main() {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

main()
