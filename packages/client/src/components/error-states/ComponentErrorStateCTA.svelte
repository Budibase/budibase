<script lang="ts">
  import { getContext } from "svelte"
  import type { UIComponentError } from "@budibase/types"

  export let error: UIComponentError | undefined

  const component = getContext("component")
  const { builderStore } = getContext("sdk")
</script>

{#if error}
  {#if error.errorType === "setting"}
    <span>-</span>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span
      class="spectrum-Link"
      on:click={() => {
        builderStore.actions.highlightSetting(error.key)
      }}
    >
      Show me
    </span>
  {:else if error.errorType === "ancestor-setting"}
    <span>-</span>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span
      class="spectrum-Link"
      on:click={() => {
        builderStore.actions.addParentComponent(
          $component.id,
          error.ancestor.fullType
        )
      }}
    >
      Add {error.ancestor.name}
    </span>
  {/if}
{/if}
