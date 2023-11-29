import jwt from "jsonwebtoken"

function getAccessToken(id: number) {
  return jwt.sign({ id }, process.env.JWT_SECRET || "", { expiresIn: "1d" })
}

function getRefreshToken(id: number) {
  return jwt.sign({ id }, process.env.JWT_SECRET || "", {
    expiresIn: "60d",
  })
}

function getClientActivationToken(client_id: number, user_id: number) {
  const expiresIn = `1y`
  const token: string = jwt.sign({ client_id, user_id }, process.env.JWT_SECRET || "", {
    expiresIn,
  })
  return token
}

const Tokens = {
  getAccessToken,
  getRefreshToken,
  getClientActivationToken,
}

export default Tokens
