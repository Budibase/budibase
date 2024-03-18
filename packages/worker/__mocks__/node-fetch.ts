const fetch = jest.requireActual("node-fetch")

export default function mockFetch(url: any, opts: any): any {
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

mockFetch.Headers = fetch.Headers
