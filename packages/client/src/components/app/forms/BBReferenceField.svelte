<script>
  import { sdk } from "@budibase/shared-core"
  import { FieldType } from "@budibase/types"
  import RelationshipField from "./RelationshipField.svelte"

  export let defaultValue
  export let type = FieldType.BB_REFERENCE

  function updateUserIDs(value) {
    if (Array.isArray(value)) {
      return value.map(val => sdk.users.getGlobalUserID(val))
    } else {
      return sdk.users.getGlobalUserID(value)
    }
  }

  function updateReferences(value) {
    if (sdk.users.containsUserID(value)) {
      return updateUserIDs(value)
    }
    return value
  }
</script>

<RelationshipField
  {...$$props}
  {type}
  datasourceType={"user"}
  primaryDisplay={"email"}
  defaultValue={updateReferences(defaultValue)}
/>
