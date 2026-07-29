import {
  AGENT_CONVERSATION_LOG_TYPE,
  FieldType,
  Table,
  TableSourceType,
} from "@budibase/types"
import { SQS_DATASOURCE_INTERNAL } from "@budibase/backend-core"

export function searchTable(): Table {
  return {
    type: "table",
    sourceType: TableSourceType.INTERNAL,
    name: AGENT_CONVERSATION_LOG_TYPE,
    sourceId: SQS_DATASOURCE_INTERNAL,
    primary: ["_id"],
    schema: {
      metadata: {
        name: "metadata",
        type: FieldType.JSON,
      },
    },
  }
}
