import crypto from "crypto"
import fs from "fs"
import zlib from "zlib"
import env from "../environment"
import { join } from "path"
import { PassThrough, Readable } from "stream"

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

  encryptStream(inputFile, secret).pipe(outputFile)

  return new Promise<{ filename: string; dir: string }>((resolve, reject) => {
    outputFile.on("finish", () => {
      resolve({
        filename: outputFileName,
        dir,
      })
    })
    const cleanupReject = (error: Error) => {
      inputFile.close()
      outputFile.close()
      reject(error)
    }
    outputFile.on("error", cleanupReject)
    inputFile.on("error", cleanupReject)
  })
}

export function encryptStream(inputStream: Readable, secret: string): Readable {
  const salt = crypto.randomBytes(SALT_LENGTH)
  const iv = crypto.randomBytes(IV_LENGTH)
  const stretched = stretchString(secret, salt)
  const cipher = crypto.createCipheriv(ALGO, stretched, iv)
  const gzip = zlib.createGzip()

  const outputStream = new PassThrough()
  outputStream.write(salt)
  outputStream.write(iv)

  // Set up error propagation
  inputStream.on("error", err => {
    gzip.destroy(err)
    if (!outputStream.destroyed) {
      outputStream.destroy(err)
    }
  })
  gzip.on("error", err => {
    cipher.destroy(err)
    if (!outputStream.destroyed) {
      outputStream.destroy(err)
    }
  })
  cipher.on("error", err => {
    if (!outputStream.destroyed) {
      outputStream.destroy(err)
    }
  })

  inputStream.pipe(gzip).pipe(cipher).pipe(outputStream)

  return outputStream
}

export async function decryptStream(
  inputStream: Readable,
  secret: string
): Promise<Readable> {
  const outputStream = new PassThrough()

  let headerBuffer = Buffer.alloc(0)
  let headerExtracted = false
  let decipher: crypto.Decipher | null = null
  let gunzip: zlib.Gunzip | null = null

  const setupDecryption = (salt: Buffer, iv: Buffer) => {
    const stretched = stretchString(secret, salt)
    decipher = crypto.createDecipheriv(ALGO, stretched, iv)
    gunzip = zlib.createGunzip()

    // Set up error propagation
    inputStream.on("error", err => {
      decipher!.destroy(err)
      if (!outputStream.destroyed) {
        outputStream.destroy(err)
      }
    })
    decipher.on("error", err => {
      gunzip!.destroy(err)
      if (!outputStream.destroyed) {
        outputStream.destroy(err)
      }
    })
    gunzip.on("error", err => {
      if (!outputStream.destroyed) {
        outputStream.destroy(err)
      }
    })

    // Pipe decipher -> gunzip -> output
    decipher.pipe(gunzip).pipe(outputStream)
  }

  inputStream.on("data", chunk => {
    if (!headerExtracted) {
      headerBuffer = Buffer.concat([headerBuffer, chunk])
      
      if (headerBuffer.length >= SALT_LENGTH + IV_LENGTH) {
        const salt = headerBuffer.slice(0, SALT_LENGTH)
        const iv = headerBuffer.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
        const remainingData = headerBuffer.slice(SALT_LENGTH + IV_LENGTH)
        
        setupDecryption(salt, iv)
        headerExtracted = true
        
        if (remainingData.length > 0) {
          decipher!.write(remainingData)
        }
      }
    } else {
      decipher!.write(chunk)
    }
  })

  inputStream.on("end", () => {
    if (decipher) {
      decipher.end()
    } else {
      outputStream.destroy(new Error("Stream ended before header could be extracted"))
    }
  })

  return outputStream
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
