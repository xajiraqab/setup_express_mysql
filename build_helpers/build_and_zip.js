import fs from "fs"
import fse from "fs-extra"
import { execSync } from "child_process"
import archiver from "archiver"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const serverDir = `${__dirname}\\..\\server`
const clientDir = `${__dirname}\\..\\client`

buildServer()
buildClient()
makeZip()

function buildServer() {
  console.log("---- building server ----")

  fse.removeSync(`${serverDir}\\dist`)

  try {
    const output = execSync("cd ../server && npm run build")
    // console.log(output.toString())
  } catch (error) {
    console.error(`Command execution failed: ${error}`)
  }

  // fse.copySync(`${serverDir}\\.env`, `${serverDir}\\dist\\.env`, {
  //   overwrite: true,
  // })

  fse.copySync(
    `${serverDir}\\package.json`,
    `${serverDir}\\dist\\package.json`,
    {
      overwrite: true,
    }
  )

  fse.copySync(
    `${serverDir}\\src\\mail\\templates`,
    `${serverDir}\\dist\\mail\\templates`,
    { overwrite: true }
  )

  // fse.copySync(
  //   `${serverDir}\\public\\images`,
  //   `${serverDir}\\dist\\public\\images`,
  //   { overwrite: true }
  // )

  fse.mkdirSync(`${serverDir}\\dist\\public\\images\\users`, {
    recursive: true,
  })
  fse.mkdirSync(`${serverDir}\\dist\\public\\images\\products`, {
    recursive: true,
  })

  console.log("Done\n")
}

function buildClient() {
  console.log("---- building client ----")

  fse.removeSync(`${clientDir}\\build`)

  try {
    const output = execSync("cd ../client && npm run build")
    // console.log(output.toString())
  } catch (error) {
    console.error(`Command execution failed: ${error}`)
  }

  fse.copySync(`${clientDir}\\build`, `${serverDir}\\dist\\public`, {
    overwrite: true,
  })

  fse.removeSync(`${serverDir}\\dist\\public\\favicon.ico`)

  console.log("Done\n")
}

function makeZip() {
  console.log("---- making zip ----")

  const output = fs.createWriteStream("..\\build.zip")
  const archive = archiver("zip")

  output.on("close", function () {
    // fse.removeSync(`${serverDir}\\dist`)
  })

  archive.on("error", function (err) {
    console.log(err)
  })

  archive.pipe(output)
  archive.directory(`${serverDir}\\dist`, false)
  archive.finalize()

  console.log("***** Done *****")
}
