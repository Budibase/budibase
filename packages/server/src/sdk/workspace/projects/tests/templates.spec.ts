import type { FetchProjectTemplatesResponse } from "@budibase/types"
import nock from "nock"
import { PassThrough, Writable } from "stream"
import { pipeline } from "stream/promises"
import { withEnv } from "../../../../environment"
import {
  fetchProjectTemplates,
  readProjectTemplateRepositoryPath,
  resolveProjectTemplate,
} from "../templates"

import {
  catalogueVersion,
  mockCatalogue,
  repositoryUrl,
  templateEntry,
} from "./templateFixtures"

const fetchTemplates = async (): Promise<FetchProjectTemplatesResponse> =>
  await withEnv(
    { PROJECT_TEMPLATE_REPOSITORY_URL: repositoryUrl },
    fetchProjectTemplates
  )

const resolveTemplate = async (key: string) =>
  await withEnv({ PROJECT_TEMPLATE_REPOSITORY_URL: repositoryUrl }, () =>
    resolveProjectTemplate(key)
  )

describe("Project template catalogue", () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it("returns compatible templates until they are withdrawn", async () => {
    const zulu = templateEntry({ key: "project/zulu", name: "Zulu" })
    const alpha = templateEntry({ key: "project/alpha", name: "Alpha" })
    const deprecated = templateEntry({
      key: "project/deprecated",
      status: "deprecated",
    })
    const withdrawn = templateEntry({
      key: "project/withdrawn",
      status: "withdrawn",
    })
    mockCatalogue([zulu, withdrawn, deprecated, alpha])

    const result = await fetchTemplates()

    expect(result.catalogueVersion).toBe(catalogueVersion)
    expect(result.templates.map(template => template.key)).toEqual([
      alpha.key,
      deprecated.key,
      zulu.key,
    ])
  })

  it("filters future package formats and unsupported features per entry", async () => {
    const supported = templateEntry({ key: "project/supported" })
    mockCatalogue([
      supported,
      templateEntry({ key: "project/future", packageVersion: 2 }),
      templateEntry({
        key: "project/unknown-feature",
        requiredFeatures: ["projects", "future_feature"],
      }),
    ])

    const result = await fetchTemplates()

    expect(result.templates.map(template => template.key)).toEqual([
      supported.key,
    ])
  })

  it("rejects a direct intent for an incompatible entry", async () => {
    const future = templateEntry({
      key: "project/future",
      packageVersion: 2,
    })
    mockCatalogue([future])

    await expect(resolveTemplate(future.key)).rejects.toMatchObject({
      status: 409,
      message: `Project template '${future.key}' is not compatible with this Budibase version.`,
    })
  })

  it("resolves deprecated direct intents until they are withdrawn", async () => {
    const deprecated = templateEntry({
      key: "project/deprecated",
      name: "Deprecated",
      status: "deprecated",
    })
    mockCatalogue([deprecated])

    const result = await resolveTemplate(deprecated.key)

    expect(result.template.key).toBe(deprecated.key)
    expect(result.template.deprecation).toEqual(deprecated.deprecation)
  })

  it("does not follow repository redirects", async () => {
    nock(repositoryUrl)
      .get("/catalogue/project/v1/current.json")
      .reply(302, undefined, {
        Location: "https://redirect.example.com/current.json",
      })
    const redirectedRequest = nock("https://redirect.example.com")
      .get("/current.json")
      .reply(200, {})

    await expect(fetchTemplates()).rejects.toMatchObject({
      status: 502,
      message: "Project template repository is unavailable.",
    })
    expect(redirectedRequest.isDone()).toBe(false)
  })

  it("rejects insecure non-loopback repositories", async () => {
    await expect(
      withEnv(
        { PROJECT_TEMPLATE_REPOSITORY_URL: "http://example.com" },
        fetchProjectTemplates
      )
    ).rejects.toMatchObject({
      status: 500,
      message: "Project template repository is invalid.",
    })
  })

  it("times out stalled repository bodies", async () => {
    const stalledBody = new PassThrough()
    nock(repositoryUrl).get("/stalled").reply(200, stalledBody)

    try {
      await expect(
        withEnv({ PROJECT_TEMPLATE_REPOSITORY_URL: repositoryUrl }, () =>
          readProjectTemplateRepositoryPath({
            path: "stalled",
            read: async response => {
              await pipeline(
                response.body,
                new Writable({
                  write(_chunk, _encoding, callback) {
                    callback()
                  },
                })
              )
            },
            timeoutMs: 25,
          })
        )
      ).rejects.toMatchObject({
        status: 502,
        message: "Project template repository is unavailable.",
      })
    } finally {
      stalledBody.destroy()
    }
  })

  it("rejects a catalogue that does not match its pointer checksum", async () => {
    const catalogue = Buffer.from(
      JSON.stringify({
        schemaVersion: 1,
        catalogueVersion,
        publishedAt: "2026-08-27T12:00:00.000Z",
        templates: [templateEntry({ key: "project/support" })],
      })
    )
    nock(repositoryUrl)
      .get("/catalogue/project/v1/current.json")
      .reply(200, {
        schemaVersion: 1,
        catalogueVersion,
        sha256: "0".repeat(64),
      })
      .get(`/catalogue/project/v1/releases/${catalogueVersion}.json`)
      .reply(200, catalogue)

    await expect(fetchTemplates()).rejects.toMatchObject({
      status: 502,
      message: "Project template catalogue checksum does not match.",
    })
  })

  it("rejects an oversized catalogue pointer", async () => {
    nock(repositoryUrl)
      .get("/catalogue/project/v1/current.json")
      .reply(200, "x".repeat(4097))

    await expect(fetchTemplates()).rejects.toMatchObject({
      status: 502,
      message: "Project template response is too large.",
    })
  })

  it("rejects malformed catalogue entries", async () => {
    const malformed = templateEntry({ key: "project/valid" })
    malformed.slug = "different"
    mockCatalogue([malformed])

    await expect(fetchTemplates()).rejects.toMatchObject({
      status: 502,
      message: "Project template catalogue is invalid.",
    })
  })
})
