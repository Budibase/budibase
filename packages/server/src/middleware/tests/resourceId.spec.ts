import { Ctx } from "@budibase/types"
import {
  paramResource,
  paramSubResource,
  bodyResource,
  bodySubResource,
  ResourceIdGetter,
} from "../resourceId"

describe("resourceId middleware", () => {
  it("calls next() when there is no request object to parse", () => {
    const ctx = { request: {} } as Ctx
    let called = false
    paramResource("main")(ctx, () => {
      called = true
    })

    expect(called).toBe(true)
    expect(ctx.resourceId).toBeUndefined()
  })

  it("generates a resourceId middleware for context query parameters", () => {
    const ctx = { request: {}, params: { main: "test" } } as unknown as Ctx
    let called = false
    paramResource("main")(ctx, () => {
      called = true
    })

    expect(called).toBe(true)
    expect(ctx.resourceId).toEqual("test")
  })

  it("generates a resourceId middleware for context query sub parameters", () => {
    const ctx = {
      request: {},
      params: { main: "main", sub: "test" },
    } as unknown as Ctx
    let called = false
    paramSubResource("main", "sub")(ctx, () => {
      called = true
    })

    expect(called).toBe(true)
    expect(ctx.resourceId).toEqual("main")
    expect(ctx.subResourceId).toEqual("test")
  })

  it("generates a resourceId middleware for context request body", () => {
    const ctx = { request: {}, body: { main: "main" } } as unknown as Ctx
    let called = false
    bodyResource("main")(ctx, () => {
      called = true
    })

    expect(called).toBe(true)
    expect(ctx.resourceId).toEqual("main")
  })

  it("generates a resourceId middleware for context request body sub fields", () => {
    const ctx = {
      request: {},
      body: { main: "main", sub: "test" },
    } as unknown as Ctx
    let called = false
    bodySubResource("main", "sub")(ctx, () => {
      called = true
    })

    expect(called).toBe(true)
    expect(ctx.resourceId).toEqual("main")
    expect(ctx.subResourceId).toEqual("test")
  })

  it("parses resourceIds correctly for custom middlewares", () => {
    const middleware = new ResourceIdGetter("body")
      .mainResource("custom")
      .subResource("customSub")
      .build()

    const ctx = {
      request: {},
      body: { custom: "test", customSub: "subTest" },
    } as unknown as Ctx
    let called = false
    middleware(ctx, () => {
      called = true
    })

    expect(called).toBe(true)
    expect(ctx.resourceId).toEqual("test")
    expect(ctx.subResourceId).toEqual("subTest")
  })
})
