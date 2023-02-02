import fs from "fs"
module FetchMock {
  const fetch = jest.requireActual("node-fetch")

  const func = async (url: any, opts: any) => {
    if (url.includes("http://someconfigurl")) {
      return {
        ok: true,
        json: () => ({
          issuer: "test",
          authorization_endpoint: "http://localhost/auth",
          token_endpoint: "http://localhost/token",
          userinfo_endpoint: "http://localhost/userinfo",
        }),
      }
    }
    return fetch(url, opts)
  }

  func.Headers = fetch.Headers

  module.exports = func
}
