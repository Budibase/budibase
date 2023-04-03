import { encrypt, decrypt, SecretOption, getSecret } from "../encryption"
jest.mock("../../environment", () => ({
  API_ENCRYPTION_KEY: "mock-api-encryption-key",
  ENCRYPTION_KEY: "mock-encryption-key",
}))
describe("encryption", () => {
  const plaintext = "budibase"
  const apiEncrypted = encrypt(plaintext, SecretOption.API)
  const encryptionEncrypted = encrypt(plaintext, SecretOption.ENCRYPTION)

  it("should encrypt and decrypt a string using API encryption key", () => {
    const decrypted = decrypt(apiEncrypted, SecretOption.API)
    expect(decrypted).toEqual(plaintext)
  })

  it("should encrypt and decrypt a string using encryption key", () => {
    const decrypted = decrypt(encryptionEncrypted, SecretOption.ENCRYPTION)
    expect(decrypted).toEqual(plaintext)
  })

  it("should throw an error if encryption key is not set", () => {
    expect(() => getSecret(SecretOption.ENCRYPTION)).toThrow(
      'Secret "ENCRYPTION_KEY" has not been set in environment.'
    )
  })

  it("should throw an error if API encryption key is not set", () => {
    expect(() => getSecret(SecretOption.API)).toThrow(
      'Secret "API_ENCRYPTION_KEY" has not been set in environment.'
    )
  })
})
