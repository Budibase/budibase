import {
  compare,
  decrypt,
  decryptFile,
  encrypt,
  encryptFile,
  getSecret,
  SecretOption,
} from "../encryption"
import env, { withEnv } from "../../environment"
import fsp from "fs/promises"
import { tmpdir } from "os"
import { join } from "path"

describe("encryption", () => {
  it("should throw an error if API encryption key is not set", () => {
    const jwt = getSecret(SecretOption.API)
    expect(jwt).toBe(env.JWT_SECRET?.export().toString())
  })

  it("should throw an error if encryption key is not set", () => {
    expect(() => getSecret(SecretOption.ENCRYPTION)).toThrow(
      'Secret "ENCRYPTION_KEY" has not been set in environment.'
    )
  })

  it("should encrypt and decrypt a string using API encryption key", () => {
    withEnv({ API_ENCRYPTION_KEY: "api_secret" }, () => {
      const plaintext = "budibase"
      const apiEncrypted = encrypt(plaintext, SecretOption.API)
      const decrypted = decrypt(apiEncrypted, SecretOption.API)
      expect(decrypted).toEqual(plaintext)
    })
  })

  it("should encrypt and decrypt a string using encryption key", () => {
    withEnv({ ENCRYPTION_KEY: "normal_secret" }, () => {
      const plaintext = "budibase"
      const encryptionEncrypted = encrypt(plaintext, SecretOption.ENCRYPTION)
      const decrypted = decrypt(encryptionEncrypted, SecretOption.ENCRYPTION)
      expect(decrypted).toEqual(plaintext)
    })
  })

  it("should compare plaintext against encrypted values", () => {
    withEnv({ API_ENCRYPTION_KEY: "api_secret" }, () => {
      const plaintext = "budibase"
      const encrypted = encrypt(plaintext, SecretOption.API)
      expect(compare(plaintext, encrypted, SecretOption.API)).toBe(true)
      expect(compare("not-budibase", encrypted, SecretOption.API)).toBe(false)
    })
  })
})

describe("file decryption", () => {
  let dir: string
  const content = "a".repeat(128 * 1024)
  const password = "example-password"

  beforeEach(async () => {
    dir = await fsp.mkdtemp(join(tmpdir(), "file-decryption-"))
    await fsp.writeFile(join(dir, "source"), content)
    await encryptFile({ dir, filename: "source" }, password)
  })

  afterEach(async () => {
    await fsp.rm(dir, { recursive: true, force: true })
  })

  it.each([undefined, content.length])(
    "decrypts a file within its output budget (%s)",
    async maxOutputBytes => {
      const output = join(dir, "output")
      await decryptFile(join(dir, "source.enc"), output, password, {
        maxOutputBytes,
      })

      expect(await fsp.readFile(output, "utf8")).toEqual(content)
    }
  )

  it("stops decompression before writing beyond the output budget", async () => {
    const output = join(dir, "output")
    const maxOutputBytes = 32 * 1024

    await expect(
      decryptFile(join(dir, "source.enc"), output, password, {
        maxOutputBytes,
      })
    ).rejects.toThrow("Decrypted file exceeds the size limit")

    expect((await fsp.stat(output)).size).toBeLessThanOrEqual(maxOutputBytes)
  })
})
