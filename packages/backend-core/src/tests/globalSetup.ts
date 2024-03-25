import { GenericContainer, Wait } from "testcontainers"

export default async function setup() {
  const container = await new GenericContainer("budibase/couchdb")
    .withExposedPorts(5984)
    .withEnvironment({
      COUCHDB_PASSWORD: "budibase",
      COUCHDB_USER: "budibase",
    })
    .withCopyFilesToContainer([
      {
        source: "./src/tests/test-couchdb.ini",
        target: "/opt/couchdb/etc/local.d/test-couchdb.ini",
      },
    ])
    .withWaitStrategy(
      Wait.forSuccessfulCommand(
        "curl http://budibase:budibase@localhost:5984/_up"
      ).withStartupTimeout(20000)
    )
    .start()

  // @ts-expect-error
  // eslint-disable-next-line no-undef
  globalThis.__COUCHDB_CONTAINER_ID__ = container.getId()
}
