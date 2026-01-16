import { promisify } from "util"
import zlib from "zlib"

const gzip = promisify(zlib.gzip)
const gunzip = promisify(zlib.gunzip)

export const GZIP_PREFIX = "gzip:"

export const gzipToBase64 = async (input: string): Promise<string> => {
  const compressed = await gzip(input)
  return `${GZIP_PREFIX}${compressed.toString("base64")}`
}

export const gunzipFromBase64 = async (input: string): Promise<string> => {
  const payload = input.startsWith(GZIP_PREFIX)
    ? input.slice(GZIP_PREFIX.length)
    : input
  const payloadBuffer = Buffer.from(payload, "base64")
  const inflated = await gunzip(new Uint8Array(payloadBuffer))
  return inflated.toString("utf8")
}
