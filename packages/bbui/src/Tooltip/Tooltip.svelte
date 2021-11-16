<script>
  import "@spectrum-css/tooltip/dist/index-vars.css"

  export let direction = "top"
  export let text = ""
  export let textWrapping = false
</script>

<!-- Showing / Hiding a text wrapped tooltip should be handled outside the component -->
{#if textWrapping}
  <span class="spectrum-Tooltip spectrum-Tooltip--{direction} is-open">
    <span class="spectrum-Tooltip-label">{text}</span>
    <span class="spectrum-Tooltip-tip" />
  </span>
{:else}
  <!-- The default show on hover tooltip does not support text wrapping -->
  <span class="u-tooltip-showOnHover tooltip">
    <slot />
    <div class={`spectrum-Tooltip spectrum-Tooltip--${direction}`}>
      <span class="spectrum-Tooltip-label">{text}</span>
      <span class="spectrum-Tooltip-tip" />
    </div>
  </span>
{/if}
