import fetch from "node-fetch"
import { FormData } from "formdata-node"
import { fileFromPath } from "formdata-node/file-from-path"
import https from "https"

const formData = new FormData()
const file = "../Build.zip"

formData.set("file", await fileFromPath(file))

// Disable certificate validation
const agent = new https.Agent({
    rejectUnauthorized: false,
  });


fetch("https://test.ge/update_on_cpanel", {
  method: "POST",
  body: formData,
  agent
})
  .then((res) => res.text())
  .then((text) => {
    console.log(text)
  })
  .catch((err) => {
    console.log(err)
  })
