// Mock Data

const mockClientID = "mockClientID"
const mockClientSecret = "mockClientSecret"

const mockEmail = "mock@budibase.com"
const mockAccessToken = "mockAccessToken"
const mockRefreshToken = "mockRefreshToken"

const mockProvider = "mockProvider"
const mockProviderType = "mockProviderType"

const mockProfile = {
  id: "mockId",
  name: {
    givenName: "mockGivenName",
    familyName: "mockFamilyName",
  },
  _json: {
    email: mockEmail,
  },
}

const buildOauth2 = (
  accessToken = mockAccessToken,
  refreshToken = mockRefreshToken
) => ({
  accessToken: accessToken,
  refreshToken: refreshToken,
})

const buildThirdPartyUser = (
  provider = mockProvider,
  providerType = mockProviderType,
  profile = mockProfile,
  email = mockEmail,
  oauth2 = buildOauth2()
) => ({
  provider: provider,
  providerType: providerType,
  userId: profile.id,
  profile: profile,
  email: email,
  oauth2: oauth2,
})

exports.data = {
  clientID: mockClientID,
  clientSecret: mockClientSecret,
  email: mockEmail,
  accessToken: mockAccessToken,
  refreshToken: mockRefreshToken,
  buildThirdPartyUser,
}
