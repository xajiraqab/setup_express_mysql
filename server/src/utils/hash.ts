import crypto from "crypto"

const decrypt = (password: string) => {
  const initVector = process.env.HASH_IV!
  const securityKey = process.env.HASH_KEY!

  const decipher = crypto.createDecipheriv("aes-256-cbc", securityKey, initVector)
  let decryptedPassword = decipher.update(password, "hex", "utf-8")
  decryptedPassword += decipher.final("utf-8")
  return decryptedPassword
}

const encrypt = (password: string) => {
  const initVector = process.env.HASH_IV!
  const securityKey = process.env.HASH_KEY!

  const cipher = crypto.createCipheriv("aes-256-cbc", securityKey, initVector)
  let encrypted = cipher.update(password, "utf-8", "hex")
  encrypted += cipher.final("hex")
  return encrypted
}

const Hash = {
  decrypt,
  encrypt,
}

export default Hash
