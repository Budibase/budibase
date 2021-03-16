const fetch = jest.requireActual("node-fetch")

module.exports = async url , opts=> {
  // mocked data based on url
  if (url.includes("api/apps")) {
    return {
      json: async () => {
        return {
          app1: {
            url: "/app1",
          },
        }
      },
    }
  }
  return fetch(url, opts)
}
