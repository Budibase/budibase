<script>
import { ActionButton } from "@budibase/bbui"
import { sdk } from "@budibase/shared-core"
import { auth } from "stores/portal"
import { getContext } from "svelte"

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
