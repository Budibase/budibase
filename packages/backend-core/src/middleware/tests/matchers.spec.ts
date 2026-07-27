import * as matchers from "../matchers"
import { structures } from "../../../tests"

describe("matchers", () => {
  it("matches by path and method", () => {
    const pattern = [
      {
        route: "/api/tests",
        method: "POST",
      },
    ]
    const ctx = structures.koa.newContext()
    ctx.path = "/api/tests"
    ctx.request.url = "/api/tests"
    ctx.request.method = "POST"

    const built = matchers.buildMatcherRegex(pattern)

    expect(!!matchers.matches(ctx, built)).toBe(true)
  })

  it("wildcards path", () => {
    const pattern = [
      {
        route: "/api/tests",
        method: "POST",
      },
    ]
    const ctx = structures.koa.newContext()
    ctx.path = "/api/tests/id/something/else"
    ctx.request.url = "/api/tests/id/something/else"
    ctx.request.method = "POST"

    const built = matchers.buildMatcherRegex(pattern)

    expect(!!matchers.matches(ctx, built)).toBe(true)
  })

  it("doesn't match later in the path", () => {
    const pattern = [
      {
        route: "/api/tests",
        method: "POST",
      },
    ]
    const ctx = structures.koa.newContext()
    ctx.path = "/foo/api/tests"
    ctx.request.url = "/foo/api/tests"
    ctx.request.method = "POST"

    const built = matchers.buildMatcherRegex(pattern)

    expect(!!matchers.matches(ctx, built)).toBe(false)
  })

  it("ignores query strings when matching", () => {
    const pattern = [
      {
        route: "/api/system/status",
        method: "GET",
      },
    ]
    const ctx = structures.koa.newContext()
    ctx.path = "/api/global/users/search"
    ctx.request.url = "/api/global/users/search?x=/api/system/status"
    ctx.request.method = "GET"

    const built = matchers.buildMatcherRegex(pattern)

    expect(!!matchers.matches(ctx, built)).toBe(false)
  })

  it("matches with param", () => {
    const pattern = [
      {
        route: "/api/tests/:testId",
        method: "GET",
      },
    ]
    const ctx = structures.koa.newContext()
    ctx.path = "/api/tests/id"
    ctx.request.url = "/api/tests/id"
    ctx.request.method = "GET"

    const built = matchers.buildMatcherRegex(pattern)

    expect(!!matchers.matches(ctx, built)).toBe(true)
  })

  it("doesn't match by path", () => {
    const pattern = [
      {
        route: "/api/tests",
        method: "POST",
      },
    ]
    const ctx = structures.koa.newContext()
    ctx.path = "/api/unknown"
    ctx.request.url = "/api/unknown"
    ctx.request.method = "POST"

    const built = matchers.buildMatcherRegex(pattern)

    expect(!!matchers.matches(ctx, built)).toBe(false)
  })

  it("doesn't match by method", () => {
    const pattern = [
      {
        route: "/api/tests",
        method: "POST",
      },
    ]
    const ctx = structures.koa.newContext()
    ctx.path = "/api/tests"
    ctx.request.url = "/api/tests"
    ctx.request.method = "GET"

    const built = matchers.buildMatcherRegex(pattern)

    expect(!!matchers.matches(ctx, built)).toBe(false)
  })

  it("matches by path and wildcard method", () => {
    const pattern = [
      {
        route: "/api/tests",
        method: "ALL",
      },
    ]
    const ctx = structures.koa.newContext()
    ctx.path = "/api/tests"
    ctx.request.url = "/api/tests"
    ctx.request.method = "GET"

    const built = matchers.buildMatcherRegex(pattern)

    expect(!!matchers.matches(ctx, built)).toBe(true)
  })
})
