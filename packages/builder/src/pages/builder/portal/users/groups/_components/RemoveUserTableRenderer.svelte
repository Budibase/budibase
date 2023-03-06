<script>
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"
  import { auth } from "stores/portal"

  export let value

  const userContext = getContext("users")

  const onClick = e => {
    e.stopPropagation()
    userContext.removeUser(value)
  }
</script>

<ActionButton disabled={!$auth.isAdmin} size="S" on:click={onClick}>
  Remove
</ActionButton>
