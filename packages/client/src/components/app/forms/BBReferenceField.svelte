<script lang="ts">
  import { sdk } from "@budibase/shared-core"
  import { FieldType, type Row } from "@budibase/types"
  import RelationshipField from "./RelationshipField.svelte"

  export let defaultValue: string
  export let type = FieldType.BB_REFERENCE
  export let multi: boolean | undefined = undefined
  export let defaultRows: Row[] | undefined = []

  function updateUserIDs(value: string | string[]) {
    if (Array.isArray(value)) {
      return value.map(val => sdk.users.getGlobalUserID(val)!)
    } else {
      return sdk.users.getGlobalUserID(value)
    }
  }

  function updateReferences(value: string) {
    if (sdk.users.containsUserID(value)) {
      return updateUserIDs(value)
    }
    return value
  }

  $: updatedDefaultValue = updateReferences(defaultValue)

  // This cannot be typed, as svelte does not provide typed inheritance
  $: allProps = $$props as any
</script>

<RelationshipField
  {...allProps}
  {type}
  datasourceType={"user"}
  primaryDisplay={"email"}
  defaultValue={updatedDefaultValue}
  {defaultRows}
  {multi}
  on:rows
/>
