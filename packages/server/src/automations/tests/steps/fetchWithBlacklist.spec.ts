import nock from "nock"
import { fetchWithBlacklist } from "../../steps/utils"

describe("fetchWithBlacklist redirects", () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it("strips sensitive headers on cross-origin redirects", async () => {
    nock("http://8.8.8.8")
      .post("/start")
      .reply(302, undefined, { location: "http://1.1.1.1/target" })

    nock("http://1.1.1.1", {
      badheaders: ["authorization", "cookie", "cookie2", "proxy-authorization"],
    })
      .get("/target")
      .reply(200, { ok: true })

    const response = await fetchWithBlacklist("http://8.8.8.8/start", {
      method: "POST",
      headers: {
        Authorization: "Bearer secret",
        Cookie: "session=abc123",
        "Proxy-Authorization": "Basic test",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: 1 }),
    })

    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual({ ok: true })
    expect(nock.isDone()).toEqual(true)
  })

  it("preserves sensitive headers on same-origin redirects", async () => {
    nock("http://8.8.8.8")
      .post("/start")
      .reply(302, undefined, { location: "/target" })

    nock("http://8.8.8.8")
      .matchHeader("authorization", "Bearer secret")
      .get("/target")
      .reply(200, { ok: true })

    const response = await fetchWithBlacklist("http://8.8.8.8/start", {
      method: "POST",
      headers: {
        Authorization: "Bearer secret",
      },
      body: JSON.stringify({ value: 1 }),
    })

    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual({ ok: true })
    expect(nock.isDone()).toEqual(true)
  })

  it("does not follow non-redirect 3xx statuses", async () => {
    nock("http://8.8.8.8")
      .get("/start")
      .reply(304, { ok: true }, { location: "http://1.1.1.1/target" })

    const response = await fetchWithBlacklist("http://8.8.8.8/start")

    expect(response.status).toEqual(304)
    expect(nock.isDone()).toEqual(true)
  })
})
