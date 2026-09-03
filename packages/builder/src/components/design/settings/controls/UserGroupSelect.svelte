<script lang="ts">
  import { Multiselect } from "@budibase/bbui"
  import type { UserGroup } from "@budibase/types"
  import { groups } from "@/stores/portal"

  export let value: string[] = []
  export let placeholder: string | undefined = undefined
  export let onChange: ((value: string[]) => void) | undefined = undefined

  $: options = $groups.filter(
    (group): group is UserGroup & { _id: string } => !!group._id
  )
</script>

<Multiselect
  bind:value
  {options}
  getOptionLabel={group => group.name}
  getOptionValue={group => group._id}
  {placeholder}
  autocomplete
  on:change={event => onChange?.(event.detail)}
/>
