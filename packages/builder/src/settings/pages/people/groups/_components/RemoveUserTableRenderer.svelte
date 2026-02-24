<script>
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"
  import { auth } from "@/stores/portal/auth"
  import { sdk } from "@budibase/shared-core"

  export let value
  export let row

  const userContext = getContext("users")

  const onClick = e => {
    e.stopPropagation()
    userContext.removeUser(value)
  }
</script>

{#if !row?.__skeleton}
  <ActionButton
    disabled={!sdk.users.isAdmin($auth.user)}
    size="S"
    on:click={onClick}
  >
    Remove
  </ActionButton>
{/if}
