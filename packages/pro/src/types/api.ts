export interface Options {
  headers?: { [key: string]: string }
  body?: any
}

export enum Method {
  POST = "POST",
  GET = "GET",
  PATCH = "PATCH",
  DELETE = "DELETE",
  PUT = "PUT",
}
