<script>
  import RelationshipField from "./RelationshipField.svelte"
  import { sdk } from "@budibase/shared-core"

  export let defaultValue

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
  datasourceType={"user"}
  primaryDisplay={"email"}
  defaultValue={updateReferences(defaultValue)}
/>
