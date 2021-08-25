<script>
  import { getContext } from "svelte"

  const fieldGroupContext = getContext("field-group")
</script>

{#if fieldGroupContext}
  <slot />
{:else}
  <div class="spectrum-Form--labelsAbove">
    <slot />
  </div>
{/if}
