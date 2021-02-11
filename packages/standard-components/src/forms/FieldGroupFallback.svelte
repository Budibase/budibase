<script>
  import { getContext } from "svelte"

  const fieldGroupContext = getContext("fieldGroup")
  const labelPosition = fieldGroupContext?.labelPosition || "above"
</script>

{#if fieldGroupContext}
  <slot />
{:else}
  <div class="spectrum-Form--labelsAbove">
    <slot />
  </div>
{/if}
