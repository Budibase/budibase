<script>
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"

  export let value

  const userContext = getContext("users")

  const onClick = e => {
    e.stopPropagation()
    userContext.removeUser(value)
  }
</script>

<ActionButton size="S" on:click={onClick}>Remove</ActionButton>
