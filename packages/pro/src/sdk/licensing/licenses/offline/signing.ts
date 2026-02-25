import jwt from "jsonwebtoken"
import { OfflineLicense } from "@budibase/types"

const PUBLIC_KEY =
  "-----BEGIN PUBLIC KEY-----\n" +
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvz3jePLCFBXZ19c8Dpkv\n" +
  "XtSgOhKFOcvQdo/LV0KJRUzQWDPWuO4ILtBtnqhjtIzZH4CH0qCYBet5L6Qr4CM1\n" +
  "l2HXiAD1Q2rlHNW9wDaYyKb1F5f+v4RyqCAyzlkwRdksmkLeECTboojNnmRCrE3C\n" +
  "8suunQP5bEScqEY2kclqzSf8e6xqMzPUg3mL/pNa1iEv7TuLbU9nJfgR36l0WmZY\n" +
  "94fWnSaT8OSXSqcxsaByf06gfS3HAoTJNc7eqz1Hf9fUORQGPUAnFK8cT3SfdA36\n" +
  "d/o3ZWE1TTj1zYwlCLN5qRKr3hU8nC3xEYNEbkB9SfTRaOq9Q7P8WmfLkoCPm3pR\n" +
  "mwIDAQAB\n" +
  "-----END PUBLIC KEY-----\n"

export function verifyLicenseToken(token: string): OfflineLicense {
  return jwt.verify(token, PUBLIC_KEY, {
    algorithms: ["RS256"],
  }) as OfflineLicense
}

export function sign(
  privateKey: string | Buffer,
  license: OfflineLicense
): string {
  return jwt.sign(license, privateKey, {
    encoding: "utf-8",
    algorithm: "RS256",
  })
}
