import fsp from "fs/promises"
import nock from "nock"
import { Readable } from "stream"
import { withEnv } from "../../../../environment"
import { downloadProjectTemplate } from "../templateArtifacts"

import { mockCatalogue, repositoryUrl, templateEntry } from "./templateFixtures"

const templateKey = "project/support"
const artifactPath = "/artifacts/project/support/1.0.0/project.tar.gz"

const download = async () =>
  await withEnv({ PROJECT_TEMPLATE_REPOSITORY_URL: repositoryUrl }, () =>
    downloadProjectTemplate(templateKey)
  )

describe("Project template artifacts", () => {
  afterEach(() => {
    jest.restoreAllMocks()
    nock.cleanAll()
  })

  it("downloads an artifact with the approved size and checksum", async () => {
    const artifact = Buffer.from("artifact")
    mockCatalogue([templateEntry({ artifact })])
    nock(repositoryUrl)
      .get(artifactPath)
      .reply(200, artifact, { "Content-Length": artifact.length.toString() })

    const downloaded = await download()

    try {
      expect(await fsp.readFile(downloaded.path)).toEqual(artifact)
      expect(downloaded.template.key).toBe(templateKey)
    } finally {
      await fsp.rm(downloaded.path, { force: true })
    }
  })

  it("rejects an artifact redirect", async () => {
    const artifact = Buffer.from("artifact")
    mockCatalogue([templateEntry({ artifact })])
    nock(repositoryUrl).get(artifactPath).reply(302, undefined, {
      Location: "https://redirect.example.com/project.tar.gz",
    })
    const redirectedRequest = nock("https://redirect.example.com")
      .get("/project.tar.gz")
      .reply(200, artifact)

    await expect(download()).rejects.toMatchObject({
      status: 502,
      message: "Project template repository is unavailable.",
    })
    expect(redirectedRequest.isDone()).toBe(false)
  })

  it("rejects a mismatched content length before streaming", async () => {
    const artifact = Buffer.from("artifact")
    mockCatalogue([templateEntry({ artifact })])
    nock(repositoryUrl)
      .get(artifactPath)
      .reply(200, artifact, { "Content-Length": "1" })

    await expect(download()).rejects.toMatchObject({
      status: 502,
      message: "Project template artifact size does not match.",
    })
  })

  it("stops streaming when an artifact exceeds its declared size", async () => {
    const approvedArtifact = Buffer.from("small")
    mockCatalogue([templateEntry({ artifact: approvedArtifact })])
    const oversizedArtifact = Readable.from(Buffer.from("larger than approved"))
    nock(repositoryUrl).get(artifactPath).reply(200, oversizedArtifact)

    await expect(download()).rejects.toMatchObject({
      status: 502,
      message: "Project template artifact size does not match.",
    })
  })

  it("rejects a mismatched checksum", async () => {
    const artifact = Buffer.from("artifact")
    mockCatalogue([templateEntry({ artifact, sha256: "0".repeat(64) })])
    nock(repositoryUrl).get(artifactPath).reply(200, artifact)

    await expect(download()).rejects.toMatchObject({
      status: 502,
      message: "Project template artifact checksum does not match.",
    })
  })

  it("normalizes response stream failures", async () => {
    const artifact = Buffer.from("artifact")
    mockCatalogue([templateEntry({ artifact })])
    nock(repositoryUrl).get(artifactPath).replyWithError("socket reset")

    await expect(download()).rejects.toMatchObject({
      status: 502,
      message: "Project template repository is unavailable.",
    })
  })

  it("preserves a controlled error when cleanup fails", async () => {
    const artifact = Buffer.from("artifact")
    mockCatalogue([templateEntry({ artifact })])
    nock(repositoryUrl)
      .get(artifactPath)
      .reply(200, artifact, { "Content-Length": "1" })
    jest.spyOn(fsp, "rm").mockRejectedValueOnce(new Error("cleanup failed"))

    await expect(download()).rejects.toMatchObject({
      status: 502,
      message: "Project template artifact size does not match.",
    })
  })
})
