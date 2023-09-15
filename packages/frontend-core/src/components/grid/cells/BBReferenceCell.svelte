<script>
  import RelationshipCell from "./RelationshipCell.svelte"
  import { FieldSubtype } from "@budibase/types"
  import { TableNames } from "../../../constants"

  const subtypeToTable = {
    [FieldSubtype.USER]: TableNames.USERS,
  }

  const schema = {
    ...$$props.schema,
    tableId: subtypeToTable[$$props.schema.subtype],
  }
</script>

<RelationshipCell {...$$props} {schema} />
