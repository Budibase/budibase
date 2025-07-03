<script lang="ts">
  import { sdk } from "@budibase/shared-core"
  import { FieldType, type Row } from "@budibase/types"
  import RelationshipField from "./RelationshipField.svelte"
  import { onMount } from "svelte"
  import { builderStore } from "@/stores/builder"

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

  // Default to false
  $: ({ appUsersOnly = false } = $$props as any)
</script>

<!-- Trigger a re-render when changing the appUsersOnly but only in the builder -->
{#key $builderStore.inBuilder ? `active-${appUsersOnly}` : "inactive"}
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
{/key}
