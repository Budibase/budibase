import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait } from "testcontainers"
import { testContainerUtils } from "@budibase/backend-core/tests"
import { startContainer } from "."
import { ELASTICSEARCH_IMAGE } from "./images"
import { ElasticsearchConfig } from "../../elasticsearch"

let ports: Promise<testContainerUtils.Port[]>

export async function getDatasource(): Promise<Datasource> {
  if (!ports) {
    ports = startContainer(
      new GenericContainer(ELASTICSEARCH_IMAGE)
        .withExposedPorts(9200)
        .withEnvironment({
          // We need to set the discovery type to single-node to avoid the
          // cluster waiting for other nodes to join before starting up.
          "discovery.type": "single-node",
          // We disable security to avoid having to do any auth against the
          // container, and to disable SSL. With SSL enabled it uses a self
          // signed certificate that we'd have to ignore anyway.
          "xpack.security.enabled": "false",
        })
        .withWaitStrategy(
          Wait.forHttp(
            // Single node clusters never reach status green, so we wait for
            // yellow instead.
            "/_cluster/health?wait_for_status=yellow&timeout=10s",
            9200
          ).withStartupTimeout(60000)
        )
        // We gave the container a tmpfs data directory. Without this, I found
        // that the default data directory was very small and the container
        // easily filled it up. This caused the cluster to go into a red status
        // and stop responding to requests.
        .withTmpFs({ "/usr/share/elasticsearch/data": "rw" })
    )
  }

  const port = (await ports).find(x => x.container === 9200)?.host
  if (!port) {
    throw new Error("Elasticsearch port not found")
  }

  const config: ElasticsearchConfig = {
    url: `http://127.0.0.1:${port}`,
  }

  return {
    type: "datasource",
    source: SourceName.ELASTICSEARCH,
    config,
  }
}
