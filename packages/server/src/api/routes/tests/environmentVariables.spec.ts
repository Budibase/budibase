import { structures } from "./utilities"
import { mocks } from "@budibase/backend-core/tests"
import { setEnv } from "@budibase/backend-core"
import { Datasource, Environment } from "@budibase/types"
import { environmentVariables } from "@budibase/pro"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import {
  DatabaseName,
  datasourceDescribe,
} from "../../../integrations/tests/utils"

const describes = datasourceDescribe({ only: [DatabaseName.POSTGRES] })

if (describes.length > 0) {
  describe.each(describes)("/api/env/variables", ({ dsProvider }) => {
    const config = new TestConfiguration()

    let rawDatasource: Datasource
    let restoreEnv: () => void

    beforeAll(async () => {
      await config.init()
      config.user = await config.globalUser({
        ...config.getUser(),
        admin: { global: true },
      })
      restoreEnv = setEnv({ ENCRYPTION_KEY: "budibase" })
      mocks.licenses.useEnvironmentVariables()

      const ds = await dsProvider()
      rawDatasource = ds.rawDatasource!
    })

    afterAll(() => {
      restoreEnv()
    })

    beforeEach(async () => {
      const { variables } = await config.api.environment.fetch()
      for (const variable of variables) {
        await config.api.environment.destroy(variable)
      }

      await config.api.environment.create({
        name: "test",
        production: rawDatasource.config!.password,
        development: rawDatasource.config!.password,
      })
    })

    it("should be able check the status of env var API", async () => {
      const { encryptionKeyAvailable } = await config.api.environment.status()
      expect(encryptionKeyAvailable).toEqual(true)
    })

    it("should be able to fetch the 'test' variable name", async () => {
      const { variables } = await config.api.environment.fetch()
      expect(variables.length).toEqual(1)
      expect(variables[0]).toEqual("test")
    })

    it("should be able to update the environment variable 'test'", async () => {
      await config.api.environment.update("test", {
        production: "test1",
        development: "test1",
      })
    })

    it("rejects a workspace-scoped builder changing tenant variables", async () => {
      const scopedBuilder = await config.globalUser({
        builder: { apps: [config.getProdWorkspaceId()] },
        admin: { global: false },
      })

      await config.withUser(scopedBuilder, async () => {
        await config.api.environment.create(
          { name: "other", production: "attacker", development: "attacker" },
          { status: 403 }
        )
        await config.api.environment.update(
          "test",
          { production: "attacker", development: "attacker" },
          { status: 403 }
        )
        await config.api.environment.destroy("test", { status: 403 })
      })

      const values = await config.doInTenant(() =>
        environmentVariables.fetchValues(Environment.PRODUCTION)
      )
      expect(values).toEqual({ test: rawDatasource.config!.password })
    })

    it("should be able to delete the environment variable 'test'", async () => {
      await config.api.environment.destroy("test")
    })

    it("should create a datasource (using the environment variable) and query", async () => {
      const datasource = await config.api.datasource.create({
        ...structures.basicDatasource().datasource,
        config: {
          ...rawDatasource.config,
          password: "{{ env.test }}",
        },
      })

      const query = await config.api.query.save({
        ...structures.basicQuery(datasource._id!),
        fields: { sql: "SELECT 1" },
      })
      expect(query._id).toBeDefined()
    })

    it("should run a query preview and check the mocked results", async () => {
      const datasource = await config.api.datasource.create({
        ...structures.basicDatasource().datasource,
        config: {
          ...rawDatasource.config,
          password: "{{ env.test }}",
        },
      })

      const query = await config.api.query.save({
        ...structures.basicQuery(datasource._id!),
        fields: { sql: "SELECT 1 as id" },
      })

      const { rows } = await config.api.query.preview({
        ...query,
        queryId: query._id!,
      })

      expect(rows).toEqual([{ id: 1 }])
    })
  })
}
