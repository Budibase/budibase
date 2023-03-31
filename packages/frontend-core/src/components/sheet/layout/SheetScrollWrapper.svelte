<script>
  import { getContext } from "svelte"

  const {
    rowHeight,
    scroll,
    visibleColumns,
    renderedColumns,
    selectedCellId,
    wheel,
  } = getContext("sheet")

  export let scrollVertically = true
  export let scrollHorizontally = true
  export let wheelInteractive = true

  $: hiddenWidths = calculateHiddenWidths($renderedColumns)
  $: style = generateStyle($scroll, $rowHeight, hiddenWidths)

  const generateStyle = (scroll, rowHeight, hiddenWidths) => {
    const offsetX = scrollHorizontally ? -1 * scroll.left + hiddenWidths : 0
    const offsetY = scrollVertically ? -1 * (scroll.top % rowHeight) : 0
    return `transform: translate3d(${offsetX}px, ${offsetY}px, 0);`
  }

  // Calculates with total width of all columns currently not rendered
  const calculateHiddenWidths = renderedColumns => {
    const idx = $visibleColumns.findIndex(
      col => col.name === renderedColumns[0]?.name
    )
    let width = 0
    if (idx > 0) {
      for (let i = 0; i < idx; i++) {
        width += $visibleColumns[i].width
      }
    }
    return width
  }
</script>

<div
  class="outer"
  on:wheel={wheelInteractive ? wheel.actions.handleWheel : null}
  on:click|self={() => ($selectedCellId = null)}
>
  <div {style}>
    <slot />
  </div>
</div>

<style>
  .outer {
    min-width: 100%;
    min-height: 100%;
  }
</style>
