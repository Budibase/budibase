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
          "discovery.type": "single-node",
          "xpack.security.enabled": "false",
        })
        .withWaitStrategy(
          Wait.forHttp(
            "/_cluster/health?wait_for_status=yellow&timeout=10s",
            9200
          ).withStartupTimeout(60000)
        )
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
