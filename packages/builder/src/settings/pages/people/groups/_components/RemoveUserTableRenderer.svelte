<script>
  import { ActionButton, ProgressCircle } from "@budibase/bbui"
  import { getContext } from "svelte"
  import { auth } from "@/stores/portal/auth"
  import { sdk } from "@budibase/shared-core"

  export let value
  export let row

  const userContext = getContext("users")
  let removing = false

  const onClick = async e => {
    e.stopPropagation()
    if (removing) {
      return
    }
    removing = true
    try {
      await userContext.removeUser(value)
    } finally {
      removing = false
    }
  }
</script>

{#if !row?.__skeleton}
  {#if removing}
    <div class="spinner-wrap">
      <ProgressCircle size="S" />
    </div>
  {:else}
    <ActionButton
      disabled={!sdk.users.isAdmin($auth.user)}
      size="S"
      on:click={onClick}
    >
      Remove
    </ActionButton>
  {/if}
{/if}

<style>
  .spinner-wrap {
    width: 72px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
