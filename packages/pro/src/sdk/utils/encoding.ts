export function objectToBase64(object: any) {
  const json = JSON.stringify(object)
  return Buffer.from(json).toString("base64")
}

export function base64ToObject(base64String: string) {
  const jsonString = Buffer.from(base64String, "base64").toString()
  return JSON.parse(jsonString)
}
