<script>
  import { getContext } from "svelte"

  const { reorderPlaceholder } = getContext("spreadsheet")

  $: style = getStyle($reorderPlaceholder)

  const getStyle = state => {
    return (
      `--x:${state.x}px;` +
      `--width:${state.width}px;` +
      `--height:${state.height}px;`
    )
  }
</script>

{#if $reorderPlaceholder.x != null}
  <div {style} />
{/if}

<style>
  div {
    height: min(calc(100% - 36px), var(--height));
    width: var(--width);
    left: var(--x);
    position: absolute;
    top: 36px;
    background: var(--spectrum-global-color-blue-400);
    opacity: 0.2;
    z-index: 7;
  }
</style>
