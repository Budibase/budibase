<script>
  import { level } from "./ComponentTree.svelte"

  export let componentId
  export let dndStore

  const indicatorX = (level + 2) * 14
  let indicatorY = 0
</script>

{#if $dndStore.dragging && $dndStore.valid}
  {#if $dndStore?.target?._id === componentId}
    <div
      class:above={$dndStore.dropPosition === DropPosition.ABOVE}
      class:below={$dndStore.dropPosition === DropPosition.BELOW}
      class:inside={$dndStore.dropPosition === DropPosition.INSIDE}
      class="drop-item"
      style="--indicatorX: {indicatorX}px; --indicatorY:{indicatorY}px;"
    />
  {/if}
{/if}
]

<style>
  .drop-item {
    height: 2px;
    background: var(--spectrum-global-color-static-green-500);
    z-index: 999;
    position: absolute;
    left: var(--indicatorX);
    width: calc(100% - var(--indicatorX));
    border-radius: 4px;
    pointer-events: none;
  }
  .drop-item.above {
  }
  .drop-item.below {
    margin-top: 32px;
  }
  .drop-item.inside {
    background: transparent;
    border: 2px solid var(--spectrum-global-color-static-green-500);
    height: 29px;
    pointer-events: none;
    width: calc(100% - var(--indicatorX) - 4px);
  }
</style>
