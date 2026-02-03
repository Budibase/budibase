import {
  AUDIT_LOG_TYPE,
  FieldType,
  Table,
  TableSourceType,
} from "@budibase/types"
import { SQS_DATASOURCE_INTERNAL } from "@budibase/backend-core"

export function searchTable(): Table {
  return {
    type: "table",
    sourceType: TableSourceType.INTERNAL,
    name: AUDIT_LOG_TYPE,
    sourceId: SQS_DATASOURCE_INTERNAL,
    primary: ["_id"],
    // schema isn't important
    schema: {
      metadata: {
        name: "metadata",
        type: FieldType.JSON,
      },
      fallback: {
        name: "fallback",
        type: FieldType.JSON,
      },
    },
  }
}
