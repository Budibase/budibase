<script lang="ts">
  import { ActionButton, ProgressCircle } from "@budibase/bbui"
  import { getContext } from "svelte"
  import { auth } from "@/stores/portal/auth"
  import { sdk } from "@budibase/shared-core"

  interface Props {
    value: string
    row?: { __skeleton?: boolean }
  }

  interface UserContext {
    removeUser: (userId: string) => Promise<void>
  }

  let { value, row }: Props = $props()

  const userContext = getContext<UserContext>("users")
  let removing = $state(false)

  const onClick = async (e: MouseEvent) => {
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
