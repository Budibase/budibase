<script>
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"
  import { auth } from "@/stores/portal"
  import { sdk } from "@budibase/shared-core"

  export let value

  const userContext = getContext("users")

  const onClick = e => {
    e.stopPropagation()
    userContext.removeUser(value)
  }
</script>

<ActionButton
  disabled={!sdk.users.isAdmin($auth.user)}
  size="S"
  on:click={onClick}
>
  Remove
</ActionButton>
