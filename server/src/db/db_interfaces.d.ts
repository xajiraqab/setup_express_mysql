export interface IDbResponseError {
  message: string
}

export interface IDbResponse {
  id?: number
  list?: any[]
  error?: IDbResponseError
}
