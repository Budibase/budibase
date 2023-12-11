import crypto from "crypto"
import fs from "fs"
import zlib from "zlib"
import env from "../environment"
import { join } from "path"

const ALGO = "aes-256-ctr"
const SEPARATOR = "-"
const ITERATIONS = 10000
const STRETCH_LENGTH = 32

const SALT_LENGTH = 16
const IV_LENGTH = 16

export enum SecretOption {
  API = "api",
  ENCRYPTION = "encryption",
}

export function getSecret(secretOption: SecretOption): string {
  let secret, secretName
  switch (secretOption) {
    case SecretOption.ENCRYPTION:
      secret = env.ENCRYPTION_KEY
      secretName = "ENCRYPTION_KEY"
      break
    case SecretOption.API:
    default:
      secret = env.API_ENCRYPTION_KEY
      secretName = "API_ENCRYPTION_KEY"
      break
  }
  if (!secret) {
    throw new Error(`Secret "${secretName}" has not been set in environment.`)
  }
  return secret
}

function stretchString(secret: string, salt: Buffer) {
  return crypto.pbkdf2Sync(secret, salt, ITERATIONS, STRETCH_LENGTH, "sha512")
}

export function encrypt(
  input: string,
  secretOption: SecretOption = SecretOption.API
) {
  const salt = crypto.randomBytes(SALT_LENGTH)
  const stretched = stretchString(getSecret(secretOption), salt)
  const cipher = crypto.createCipheriv(ALGO, stretched, salt)
  const base = cipher.update(input)
  const final = cipher.final()
  const encrypted = Buffer.concat([base, final]).toString("hex")
  return `${salt.toString("hex")}${SEPARATOR}${encrypted}`
}

export function decrypt(
  input: string,
  secretOption: SecretOption = SecretOption.API
) {
  const [salt, encrypted] = input.split(SEPARATOR)
  const saltBuffer = Buffer.from(salt, "hex")
  const stretched = stretchString(getSecret(secretOption), saltBuffer)
  const decipher = crypto.createDecipheriv(ALGO, stretched, saltBuffer)
  const base = decipher.update(Buffer.from(encrypted, "hex"))
  const final = decipher.final()
  return Buffer.concat([base, final]).toString()
}

export async function encryptFile(
  { dir, filename }: { dir: string; filename: string },
  secret: string
) {
  const outputFileName = `${filename}.enc`

  const filePath = join(dir, filename)
  if (fs.lstatSync(filePath).isDirectory()) {
    throw new Error("Unable to encrypt directory")
  }
  const inputFile = fs.createReadStream(filePath)
  const outputFile = fs.createWriteStream(join(dir, outputFileName))

  const salt = crypto.randomBytes(SALT_LENGTH)
  const iv = crypto.randomBytes(IV_LENGTH)
  const stretched = stretchString(secret, salt)
  const cipher = crypto.createCipheriv(ALGO, stretched, iv)

  outputFile.write(salt)
  outputFile.write(iv)

  inputFile.pipe(zlib.createGzip()).pipe(cipher).pipe(outputFile)

  return new Promise<{ filename: string; dir: string }>(r => {
    outputFile.on("finish", () => {
      r({
        filename: outputFileName,
        dir,
      })
    })
  })
}

async function getSaltAndIV(path: string) {
  const fileStream = fs.createReadStream(path)

  const salt = await readBytes(fileStream, SALT_LENGTH)
  const iv = await readBytes(fileStream, IV_LENGTH)
  fileStream.close()
  return { salt, iv }
}

export async function decryptFile(
  inputPath: string,
  outputPath: string,
  secret: string
) {
  if (fs.lstatSync(inputPath).isDirectory()) {
    throw new Error("Unable to encrypt directory")
  }
  const { salt, iv } = await getSaltAndIV(inputPath)
  const inputFile = fs.createReadStream(inputPath, {
    start: SALT_LENGTH + IV_LENGTH,
  })

  const outputFile = fs.createWriteStream(outputPath)

  const stretched = stretchString(secret, salt)
  const decipher = crypto.createDecipheriv(ALGO, stretched, iv)

  const unzip = zlib.createGunzip()

  inputFile.pipe(decipher).pipe(unzip).pipe(outputFile)

  return new Promise<void>((res, rej) => {
    outputFile.on("finish", () => {
      outputFile.close()
      res()
    })

    inputFile.on("error", e => {
      outputFile.close()
      rej(e)
    })

    decipher.on("error", e => {
      outputFile.close()
      rej(e)
    })

    unzip.on("error", e => {
      outputFile.close()
      rej(e)
    })

    outputFile.on("error", e => {
      outputFile.close()
      rej(e)
    })
  })
}

function readBytes(stream: fs.ReadStream, length: number) {
  return new Promise<Buffer>((resolve, reject) => {
    let bytesRead = 0
    const data: Buffer[] = []

    stream.on("readable", () => {
      let chunk

      while ((chunk = stream.read(length - bytesRead)) !== null) {
        data.push(chunk)
        bytesRead += chunk.length
      }

      resolve(Buffer.concat(data))
    })

    stream.on("end", () => {
      reject(new Error("Insufficient data in the stream."))
    })

    stream.on("error", error => {
      reject(error)
    })
  })
}
