import { getContainerRuntimeClient } from "testcontainers"

export default async function teardown() {
  const client = await getContainerRuntimeClient()

  // @ts-expect-error
  // eslint-disable-next-line no-undef
  const containerId = globalThis.__COUCHDB_CONTAINER_ID__
  const container = client.container.getById(containerId)
  await client.container.stop(container)
  await client.container.remove(container)
}
