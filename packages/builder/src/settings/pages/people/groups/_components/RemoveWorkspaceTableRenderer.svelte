<script>
  import { ActionButton, ProgressCircle } from "@budibase/bbui"
  import { getContext } from "svelte"

  export let value

  const groupAppsContext = getContext("groupApps")
  let removing = false

  const onClick = async e => {
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

<style>
  .spinner-wrap {
    width: 72px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
