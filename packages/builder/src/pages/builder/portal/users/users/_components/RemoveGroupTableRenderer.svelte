<script>
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"

  export let value

  const groupContext = getContext("groups")

  const onClick = e => {
    e.stopPropagation()
    groupContext.removeGroup(value)
  }
</script>

<ActionButton size="S" on:click={onClick}>Remove</ActionButton>
