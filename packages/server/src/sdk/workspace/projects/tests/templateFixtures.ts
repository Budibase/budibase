import type { ProjectTemplateStatus } from "@budibase/types"
import { createHash } from "crypto"
import nock from "nock"

export const repositoryUrl = "https://example.com"
export const catalogueVersion = "2026-08-27.1"

export const templateEntry = ({
  key = "project/support",
  name = key,
  status = "active",
  packageVersion = 1,
  requiredFeatures = ["projects"],
  minBudibaseVersion = "0.0.0",
  artifact = Buffer.from("artifact"),
  sha256 = createHash("sha256").update(new Uint8Array(artifact)).digest("hex"),
}: {
  key?: string
  name?: string
  status?: ProjectTemplateStatus
  packageVersion?: number
  requiredFeatures?: string[]
  minBudibaseVersion?: string
  artifact?: Buffer
  sha256?: string
} = {}) => ({
  key,
  slug: key.replace("project/", ""),
  version: "1.0.0",
  name,
  description: `${name} template`,
  category: "Operations",
  status,
  owner: "solutions-engineering",
  compatibility: {
    minBudibaseVersion,
    maxBudibaseVersionExclusive: "9999.0.0",
    requiredFeatures,
  },
  ...(status === "deprecated"
    ? { deprecation: { message: `${name} is deprecated.` } }
    : {}),
  artifact: {
    packageVersion,
    sizeBytes: artifact.length,
    sha256,
  },
})

export const mockCatalogue = (
  templates: ReturnType<typeof templateEntry>[] = [templateEntry()]
) => {
  const catalogue = Buffer.from(
    JSON.stringify({
      schemaVersion: 1,
      catalogueVersion,
      publishedAt: "2026-08-27T12:00:00.000Z",
      templates,
    })
  )
  const sha256 = createHash("sha256")
    .update(new Uint8Array(catalogue))
    .digest("hex")

  nock(repositoryUrl)
    .get("/catalogue/project/v1/current.json")
    .reply(200, { schemaVersion: 1, catalogueVersion, sha256 })
    .get(`/catalogue/project/v1/releases/${catalogueVersion}.json`)
    .reply(200, catalogue)
}
