import { SSOProviderType } from "@budibase/types"
import { stripSensitiveUserFields } from "./sensitiveUserFields"

describe("stripSensitiveUserFields", () => {
  it("removes persisted SSO identities", () => {
    const user = {
      email: "user@example.com",
      ssoIdentities: [
        {
          provider: "https://issuer.example.com",
          providerType: SSOProviderType.OIDC,
          userId: "subject",
        },
      ],
    }

    expect(stripSensitiveUserFields(user)).toEqual({
      email: "user@example.com",
    })
  })
})
