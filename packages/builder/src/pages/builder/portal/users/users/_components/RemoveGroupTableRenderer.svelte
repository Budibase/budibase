<script>
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"
  import { auth } from "stores/portal"

  export let value

  const groupContext = getContext("groups")

  const onClick = e => {
    e.stopPropagation()
    groupContext.removeGroup(value)
  }
</script>

<ActionButton disabled={!$auth.isAdmin} size="S" on:click={onClick}>
  Remove
</ActionButton>
