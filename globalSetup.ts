import { GenericContainer, Wait } from "testcontainers"

export default async function setup() {
  await new GenericContainer("budibase/couchdb")
    .withExposedPorts(5984)
    .withEnvironment({
      COUCHDB_PASSWORD: "budibase",
      COUCHDB_USER: "budibase",
    })
    .withCopyContentToContainer([
      {
        content: `
          [log]
          level = warn
        `,
        target: "/opt/couchdb/etc/local.d/test-couchdb.ini",
      },
    ])
    .withWaitStrategy(
      Wait.forSuccessfulCommand(
        "curl http://budibase:budibase@localhost:5984/_up"
      ).withStartupTimeout(20000)
    )
    .start()
}
