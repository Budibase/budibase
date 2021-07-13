// Mock Data

const mockClientID = "mockClientID"
const mockClientSecret = "mockClientSecret"

const mockEmail = "mock@budibase.com"
const mockAccessToken = "mockAccessToken"
const mockRefreshToken = "mockRefreshToken"

const buildOauth2 = (
  accessToken = mockAccessToken,
  refreshToken = mockRefreshToken
) => ({
  accessToken: accessToken,
  refreshToken: refreshToken,
})

const buildThirdPartyUser = (
  provider,
  providerType,
  profile,
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
