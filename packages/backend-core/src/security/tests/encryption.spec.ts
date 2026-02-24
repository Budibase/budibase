import { encrypt, decrypt, SecretOption, getSecret } from "../encryption"
import env from "../../environment"

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
    env._set("API_ENCRYPTION_KEY", "api_secret")
    const plaintext = "budibase"
    const apiEncrypted = encrypt(plaintext, SecretOption.API)
    const decrypted = decrypt(apiEncrypted, SecretOption.API)
    expect(decrypted).toEqual(plaintext)
  })

  it("should encrypt and decrypt a string using encryption key", () => {
    env._set("ENCRYPTION_KEY", "normal_secret")
    const plaintext = "budibase"
    const encryptionEncrypted = encrypt(plaintext, SecretOption.ENCRYPTION)
    const decrypted = decrypt(encryptionEncrypted, SecretOption.ENCRYPTION)
    expect(decrypted).toEqual(plaintext)
  })
})
