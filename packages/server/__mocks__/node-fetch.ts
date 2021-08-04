module FetchMock {
  const fetch = jest.requireActual("node-fetch")

  module.exports = async (url: any, opts: any) => {
    function json(body: any, status = 200) {
      return {
        status,
        headers: {
          get: () => {
            return ["application/json"]
          },
        },
        json: async () => {
          return body
        },
      }
    }

    if (url.includes("/api/admin")) {
      return json({
        email: "test@test.com",
        _id: "us_test@test.com",
        status: "active",
      })
    }
    // mocked data based on url
    else if (url.includes("api/apps")) {
      return json({
        app1: {
          url: "/app1",
        },
      })
    } else if (url.includes("test.com")) {
      return json({
        body: opts.body,
        url,
        method: opts.method,
      })
    } else if (url.includes("invalid.com")) {
      return json(
        {
          invalid: true,
        },
        404
      )
    } else if (url.includes("_search")) {
      return json({
        rows: [
          {
            doc: {
              _id: "test",
            },
          },
        ],
        bookmark: "test",
      })
    }
    return fetch(url, opts)
  }
}
