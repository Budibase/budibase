import { features } from "@budibase/backend-core"
import { FeatureFlag } from "@budibase/types"
import nock from "nock"
import { withEnv } from "../../../environment"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import {
  catalogueVersion,
  mockCatalogue,
  repositoryUrl,
  templateEntry,
} from "../../../sdk/workspace/projects/tests/templateFixtures"

describe("Project template catalogue API", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  afterAll(() => config.end())

  const withProjectTemplatesEnabled = async <T>(f: () => Promise<T>) =>
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      {
        [FeatureFlag.PROJECTS]: true,
        [FeatureFlag.TEMPLATES]: true,
      },
      f
    )

  it.each([
    {
      name: "both feature flags are disabled",
      projects: false,
      templates: false,
    },
    { name: "only Projects is enabled", projects: true, templates: false },
    { name: "only Templates is enabled", projects: false, templates: true },
  ])("is unavailable when $name", async ({ projects, templates }) => {
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      {
        [FeatureFlag.PROJECTS]: projects,
        [FeatureFlag.TEMPLATES]: templates,
      },
      async () => {
        await config.api.project.fetchTemplates({ status: 404 })
      }
    )
  })

  it("returns the curated catalogue when enabled", async () => {
    const template = templateEntry()
    mockCatalogue()

    const response = await withProjectTemplatesEnabled(
      async () =>
        await withEnv({ PROJECT_TEMPLATE_REPOSITORY_URL: repositoryUrl }, () =>
          config.api.project.fetchTemplates()
        )
    )

    expect(response.catalogueVersion).toBe(catalogueVersion)
    expect(response.templates).toEqual([
      expect.objectContaining({
        key: template.key,
        name: template.name,
        packageVersion: template.artifact.packageVersion,
      }),
    ])
  })
})
