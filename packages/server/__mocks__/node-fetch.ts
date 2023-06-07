// @ts-ignore
import fs from "fs"
module FetchMock {
  // @ts-ignore
  const fetch = jest.requireActual("node-fetch")
  let failCount = 0
  let mockSearch = false

  const func = async (url: any, opts: any) => {
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
      const user = {
        email: "test@test.com",
        _id: "us_test@test.com",
        status: "active",
        roles: {},
        builder: {
          global: false,
        },
        admin: {
          global: false,
        },
      }
      return url.endsWith("/users") && opts.method === "GET"
        ? json([user])
        : json(user)
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
    } else if (mockSearch && url.includes("_search")) {
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
    } else if (
      url === "https://api.github.com/repos/my-repo/budibase-comment-box"
    ) {
      return Promise.resolve({
        json: () => {
          return {
            name: "budibase-comment-box",
            releases_url:
              "https://api.github.com/repos/my-repo/budibase-comment-box{/id}",
          }
        },
      })
    } else if (
      url === "https://api.github.com/repos/my-repo/budibase-comment-box/latest"
    ) {
      return Promise.resolve({
        json: () => {
          return {
            assets: [
              {
                content_type: "application/gzip",
                browser_download_url:
                  "https://github.com/my-repo/budibase-comment-box/releases/download/v1.0.2/comment-box-1.0.2.tar.gz",
              },
            ],
          }
        },
      })
    } else if (
      url ===
      "https://github.com/my-repo/budibase-comment-box/releases/download/v1.0.2/comment-box-1.0.2.tar.gz"
    ) {
      return Promise.resolve({
        body: fs.createReadStream(
          "src/api/routes/tests/data/comment-box-1.0.2.tar.gz"
        ),
        ok: true,
      })
    } else if (url === "https://www.npmjs.com/package/budibase-component") {
      return Promise.resolve({
        status: 200,
        json: () => {
          return {
            name: "budibase-component",
            "dist-tags": {
              latest: "1.0.0",
            },
            versions: {
              "1.0.0": {
                dist: {
                  tarball:
                    "https://registry.npmjs.org/budibase-component/-/budibase-component-1.0.2.tgz",
                },
              },
            },
          }
        },
      })
    } else if (
      url ===
      "https://registry.npmjs.org/budibase-component/-/budibase-component-1.0.2.tgz"
    ) {
      return Promise.resolve({
        body: fs.createReadStream(
          "src/api/routes/tests/data/budibase-component-1.0.2.tgz"
        ),
        ok: true,
      })
    } else if (
      url === "https://www.someurl.com/comment-box/comment-box-1.0.2.tar.gz"
    ) {
      return Promise.resolve({
        body: fs.createReadStream(
          "src/api/routes/tests/data/comment-box-1.0.2.tar.gz"
        ),
        ok: true,
      })
    } else if (url === "https://www.googleapis.com/oauth2/v4/token") {
      // any valid response
      return json({})
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

  func.Headers = fetch.Headers

  func.mockSearch = () => {
    mockSearch = true
  }

  module.exports = func
}
