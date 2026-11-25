import { Datasource } from "@budibase/types"
import postgres from "../postgres"
import { DatabaseName, datasourceDescribe } from "./utils"
import { getTlsCa, TLS_HOSTNAME } from "./utils/postgres"

const descriptions = datasourceDescribe({ only: [DatabaseName.POSTGRES] })

if (descriptions.length) {
  describe.each(descriptions)(
    "Postgres integration over TLS ($dbName)",
    ({ config, dsProvider }) => {
      let rawDatasource: Datasource
      let ca: string

      beforeAll(async () => {
        rawDatasource = (await dsProvider()).rawDatasource!
        ca = await getTlsCa(rawDatasource)
      })

      afterAll(config.end)

      // The connector connects to the checked IP, so the certificate only
      // verifies if the hostname is still sent as the TLS server name.
      const tlsConfig = (caCert?: string) => {
        const { port, database, user, password, schema } = rawDatasource.config!
        return {
          host: TLS_HOSTNAME,
          port,
          database,
          user,
          password,
          schema,
          ssl: true,
          rejectUnauthorized: true,
          ca: caCert,
        }
      }

      it("verifies the server certificate against the hostname", async () => {
        const integration = new postgres.integration(tlsConfig(ca))

        const response = await integration.testConnection()

        expect(response).toEqual({ connected: true })
      })

      it("rejects a server certificate from an untrusted CA", async () => {
        const integration = new postgres.integration(tlsConfig())

        const response = await integration.testConnection()

        expect(response).toEqual({
          connected: false,
          error: "unable to verify the first certificate",
        })
      })
    }
  )
}
