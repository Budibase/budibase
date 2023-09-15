<script>
  import RelationshipCell from "./RelationshipCell.svelte"
  import { TableNames } from "constants"
  // import { FieldSubtype } from "@budibase/types"

  const subtypeToTable = {
    ["user"]: TableNames.USERS,
  }

  const schema = {
    ...$$props.schema,
    tableId: subtypeToTable[$$props.schema.subtype],
  }
</script>

<RelationshipCell {...$$props} {schema} />
