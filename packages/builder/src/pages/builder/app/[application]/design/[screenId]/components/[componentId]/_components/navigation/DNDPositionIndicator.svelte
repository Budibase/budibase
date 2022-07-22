<script>
  import { DropPosition } from "./dndStore"
  import { fade } from "svelte/transition"

  export let component
  export let position

  let x
  let y
  let width
  let height

  $: calculatePosition(component)

  const calculatePosition = component => {
    // Get root li element
    const el = document.getElementById(`component-${component?._id}`)
    // Get inner nav item content element
    const child = el?.children[0]?.children[0]
    if (!el) {
      return
    }
    x = child.offsetLeft
    y = child.offsetTop
    width = child.clientWidth
    height = child.clientHeight
  }
</script>

{#if component && position}
  <div
    in:fade={{ duration: 130 }}
    class:above={position === DropPosition.ABOVE}
    class:below={position === DropPosition.BELOW}
    class:inside={position === DropPosition.INSIDE}
    class="indicator"
    style="--x:{x}px; --y:{y}px; --width:{width}px; --height:{height}px"
  />
{/if}

<style>
  .indicator {
    height: 2px;
    background: var(--spectrum-global-color-static-green-500);
    z-index: 999;
    position: absolute;
    left: calc(var(--x) + 18px);
    top: var(--y);
    width: calc(100% - var(--x) - 18px);
    border-radius: 4px;
    pointer-events: none;
  }
  .indicator.above {
  }
  .indicator.below {
    margin-top: 32px;
  }
  .indicator.inside {
    background: transparent;
    border: 2px solid var(--spectrum-global-color-static-green-500);
    pointer-events: none;
    width: calc(var(--width) - 34px);
    height: calc(var(--height) - 9px);
    left: calc(var(--x) + 13px);
    top: calc(var(--y) + 2px);
  }
</style>
