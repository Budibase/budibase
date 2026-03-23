import * as signing from "../signing"

// generated from the valid private key
// contents: { license: true }
const VALID_SIGNED_LICENSE =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJsaWNlbnNlIjp0cnVlfQ.Kfoky8s2GNvWD30c-cpgGtlnIgpPFyR-VtSSihsuVIGMUkMnhXrcc10rVyaZ0Mc41Aezxyw4C_LA3InGriN_hzJTVCixM5_GF-cZRYsvcDlgw6myVpR5pP5vyze26Z5tKKnysQSSVfLYZVDopayllylZ_QSCARjatotiEWkF59p_QohFwqqvJjri1fSWj2f_EEOWTqYsmd0ObHoYXfRVYqTjV536ZYstfjqKvistjtn9bgAmQS0jq1elxv1BACaS7Cy-yU1kuZS54pjnVvazvw4Q9dUtYO0qj6GgR7ARgRGcQFrzPYkXjFbomTnsNckqQ-v-2N_12YZc9djgKELQGQ"

// generated with an invalid private key
const INVALID_SIGNED_LICENSE =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJsaWNlbnNlIjp0cnVlfQ.V6SQ0HAfQr0cI5uG88z2SlKSPvERzGl_qX0FQiXRL1RzoP12MVT01Sbs11yJU7tf28Br8bruw4Z6KY5V7jkn2xLrCwow5icGRB2yFxi9WGF3a2JG2iKhr0luY7jBk89fgYo0nCJ_2PcaHIkOuED8MHNpTmZ5umkuYQZtf1NO-3Gee27wHdhT8cZ54i_2Y0o-0TfQzYG7BWgCchLCVBSFoLfbSUMYdoGVzeNUFW2j2r7oDYAY0zXgG_mApgCkbdx7usgkVOc6NA0u0j_UDnzLYY5SQbR7M8ZCvyqdxWyQnQhvlkhxP9iwtXK667Jj7AEtGHI0xzBvzNI3vLzHp7eq4Q"

describe("signing", () => {
  it("signs valid license", () => {
    const license = signing.verifyLicenseToken(VALID_SIGNED_LICENSE)
    expect(license).toEqual({ license: true })
  })

  it("signs invalid license", () => {
    expect(() => signing.verifyLicenseToken(INVALID_SIGNED_LICENSE)).toThrow(
      new Error("invalid signature")
    )
  })
})
