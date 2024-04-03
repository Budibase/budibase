import { GenericContainer, Wait } from "testcontainers"
import path from "path"
import lockfile from "proper-lockfile"

export default async function setup() {
  const lockPath = path.resolve(__dirname, "globalSetup.ts")
  if (process.env.REUSE_CONTAINERS) {
    // If you run multiple tests at the same time, it's possible for the CouchDB
    // shared container to get started multiple times despite having an
    // identical reuse hash. To avoid that, we do a filesystem-based lock so
    // that only one globalSetup.ts is running at a time.
    lockfile.lockSync(lockPath)
  }

  try {
    let couchdb = new GenericContainer("budibase/couchdb")
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

    if (process.env.REUSE_CONTAINERS) {
      couchdb = couchdb.withReuse()
    }

    await couchdb.start()
  } finally {
    if (process.env.REUSE_CONTAINERS) {
      lockfile.unlockSync(lockPath)
    }
  }
}
