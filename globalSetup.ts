import { GenericContainer, Wait } from "testcontainers"
import path from "path"
import lockfile from "proper-lockfile"

export default async function setup() {
  const lockPath = path.resolve(__dirname, "globalSetup.ts")
  // If you run multiple tests at the same time, it's possible for the CouchDB
  // shared container to get started multiple times despite having an
  // identical reuse hash. To avoid that, we do a filesystem-based lock so
  // that only one globalSetup.ts is running at a time.
  lockfile.lockSync(lockPath)

  try {
    let couchdb = new GenericContainer("budibase/couchdb:v3.2.1-sqs")
      .withExposedPorts(5984, 4984)
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
      .withReuse()
      .withWaitStrategy(
        Wait.forSuccessfulCommand(
          "curl http://budibase:budibase@localhost:5984/_up"
        ).withStartupTimeout(20000)
      )

    await couchdb.start()
  } finally {
    lockfile.unlockSync(lockPath)
  }
}
