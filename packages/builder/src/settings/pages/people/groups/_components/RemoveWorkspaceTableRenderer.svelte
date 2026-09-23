<script lang="ts">
  import { ActionButton, ProgressCircle } from "@budibase/bbui"
  import { getContext } from "svelte"

  interface Props {
    value: string
    row?: { __skeleton?: boolean }
  }

  interface GroupAppsContext {
    removeApp: (workspaceId: string) => Promise<void>
    getReadonly?: () => boolean
  }

  let { value, row }: Props = $props()

  const groupAppsContext = getContext<GroupAppsContext>("groupApps")
  let removing = $state(false)

  const onClick = async (e: MouseEvent) => {
    e.stopPropagation()
    if (removing) {
      return
    }
    removing = true
    try {
      await groupAppsContext.removeApp(value)
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
      disabled={groupAppsContext.getReadonly?.()}
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
