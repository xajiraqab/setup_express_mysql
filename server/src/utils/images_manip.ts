import path from "path"
import fs from "fs"

export function deleteImage(file_name: string | undefined) {
  if (!file_name) return
  const filePath = path.join("public/images/", file_name)
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err)
    }
  })
}
