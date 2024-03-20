import * as jwt from "jsonwebtoken"

const mockOAuth2 = {
  getOAuthAccessToken: (code: string, p: any, cb: any) => {
    const err = null
    const accessToken = "access_token"
    const refreshToken = "refresh_token"

    const exp = new Date()
    exp.setDate(exp.getDate() + 1)

    const iat = new Date()
    iat.setDate(iat.getDate() - 1)

    const claims = {
      iss: "test",
      sub: "sub",
      aud: "clientId",
      exp: exp.getTime() / 1000,
      iat: iat.getTime() / 1000,
      email: "oauth@example.com",
    }

    const idToken = jwt.sign(claims, "secret")

    const params = {
      id_token: idToken,
    }
    return cb(err, accessToken, refreshToken, params)
  },
  _request: (
    method: string,
    url: string,
    headers: any,
    postBody: any,
    accessToken: string,
    cb: any
  ) => {
    const err = null
    const body = {
      sub: "sub",
      user_id: "userId",
      name: "OAuth",
      family_name: "2",
      given_name: "OAuth",
      middle_name: "",
    }
    const res = {}
    return cb(err, JSON.stringify(body), res)
  },
}

const oauth = {
  OAuth2: jest.fn(() => mockOAuth2),
}

export = oauth
