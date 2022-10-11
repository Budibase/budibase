<script>
  import { builderStore } from "stores"
  import { DNDPlaceholderID } from "constants"

  $: style = getStyle($builderStore.dndBounds)

  const getStyle = bounds => {
    if (!bounds) {
      return null
    }
    return `--height: ${bounds.height}px; --width: ${bounds.width}px;`
  }
</script>

{#if style}
  <div class="wrapper">
    <div class="placeholder" id={DNDPlaceholderID} {style} />
  </div>
{/if}

<style>
  .wrapper {
    overflow: hidden;
  }
  .placeholder {
    display: block;
    height: var(--height);
    width: var(--width);
    max-height: 100%;
    max-width: 100%;
    opacity: 0;
  }
</style>
