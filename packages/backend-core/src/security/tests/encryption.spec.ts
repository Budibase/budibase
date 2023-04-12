import environment from "../../environment"
import { encrypt, decrypt, SecretOption, getSecret } from "../encryption"

jest.mock("../../environment", () => ({
  isDev: jest.fn(() => "production"),
}))

describe("encryption", () => {
  it("should encrypt and decrypt a string using API encryption key", () => {
    environment.API_ENCRYPTION_KEY = "mock-api-key"
    environment.ENCRYPTION_KEY = "encryption-key"
    const plaintext = "budibase"
    const apiEncrypted = encrypt(plaintext, SecretOption.API)
    const encryptionEncrypted = encrypt(plaintext, SecretOption.ENCRYPTION)
    const decrypted = decrypt(apiEncrypted, SecretOption.API)
    expect(decrypted).toEqual(plaintext)
  })

  it("should encrypt and decrypt a string using encryption key", () => {
    environment.API_ENCRYPTION_KEY = "mock-api-key"
    environment.ENCRYPTION_KEY = "encryption-key"
    const plaintext = "budibase"
    const apiEncrypted = encrypt(plaintext, SecretOption.API)
    const encryptionEncrypted = encrypt(plaintext, SecretOption.ENCRYPTION)
    const decrypted = decrypt(encryptionEncrypted, SecretOption.ENCRYPTION)
    expect(decrypted).toEqual(plaintext)
  })

  it("should throw an error if API encryption key is not set", () => {
    environment.API_ENCRYPTION_KEY = ""
    environment.ENCRYPTION_KEY = ""
    expect(() => getSecret(SecretOption.API)).toThrow(
      'Secret "API_ENCRYPTION_KEY" has not been set in environment.'
    )
  })
  it("should throw an error if encryption key is not set", () => {
    environment.API_ENCRYPTION_KEY = ""
    environment.ENCRYPTION_KEY = ""
    expect(() => getSecret(SecretOption.ENCRYPTION)).toThrow(
      'Secret "ENCRYPTION_KEY" has not been set in environment.'
    )
  })
})
