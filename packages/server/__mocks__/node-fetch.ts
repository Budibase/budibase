module FetchMock {
  const fetch = jest.requireActual("node-fetch")
  let failCount = 0

  module.exports = async (url: any, opts: any) => {
    function json(body: any, status = 200) {
      return {
        status,
        headers: {
          raw: () => {
            return { "content-type": ["application/json"] }
          },
          get: () => {
            return ["application/json"]
          },
        },
        json: async () => {
          //x-www-form-encoded body is a URLSearchParams
          //The call to stringify it leaves it blank
          if (body?.opts?.body instanceof URLSearchParams) {
            const paramArray = Array.from(body.opts.body.entries())
            body.opts.body = paramArray.reduce((acc: any, pair: any) => {
              acc[pair[0]] = pair[1]
              return acc
            }, {})
          }
          return body
        },
      }
    }

    if (url.includes("/api/global")) {
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
      const body = opts.body
      const parts = body.split("tableId:")
      let tableId
      if (parts && parts[1]) {
        tableId = parts[1].split('"')[0]
      }
      return json({
        rows: [
          {
            doc: {
              _id: "test",
              tableId: tableId,
              query: opts.body,
            },
          },
        ],
        bookmark: "test",
      })
    } else if (url.includes("google.com")) {
      return json({
        url,
        opts,
        value:
          '<!doctype html><html itemscope="" itemtype="http://schema.org/WebPage" lang="en-GB"></html>',
      })
    } else if (url.includes("failonce.com")) {
      failCount++
      if (failCount === 1) {
        return json({ message: "error" }, 500)
      } else {
        return json({
          fails: failCount - 1,
          url,
          opts,
        })
      }
    }
    return fetch(url, opts)
  }
}
