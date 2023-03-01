<script>
  import { getContext, onMount } from "svelte"
  import { Utils } from "../../utils"
  import ScrollOverlay from "./ScrollOverlay.svelte"

  const { columns, selectedCellId, cellHeight, rows, bounds, scroll } =
    getContext("spreadsheet")

  const padding = 180

  let ref

  $: contentHeight = ($rows.length + 2) * cellHeight
  $: contentWidth = computeContentWidth($columns)
  $: scrollLeft = $scroll.left
  $: scrollTop = $scroll.top

  const computeContentWidth = columns => {
    if (!columns.length) {
      return 0
    }
    const last = columns[columns.length - 1]
    return last.left + last.width
  }

  const updateScrollStore = Utils.domDebounce((left, top) => {
    scroll.set({ left, top })
  })

  const handleScroll = e => {
    updateScrollStore(e.target.scrollLeft, e.target.scrollTop)
  }

  const handleWheel = e => {
    const step = cellHeight * 3
    const deltaY = e.deltaY < 0 ? -1 : 1
    const offset = deltaY * step
    let newScrollTop = scrollTop
    newScrollTop += offset
    newScrollTop = Math.max(0, newScrollTop)
    newScrollTop = Math.min(
      newScrollTop,
      $rows.length * cellHeight - $bounds.height
    )
    scroll.update(state => ({
      ...state,
      top: newScrollTop,
    }))
  }

  $: fakeOffsetY = -1 * (scrollTop % cellHeight)
  $: fakeOffsetX = -1 * scrollLeft

  onMount(() => {
    // Observe and record the height of the body
    const observer = new ResizeObserver(() => {
      bounds.set(ref.getBoundingClientRect())
    })
    observer.observe(ref)
    return () => {
      observer.disconnect()
    }
  })
</script>

<div
  bind:this={ref}
  class="sheet-body"
  class:horizontally-scrolled={scrollLeft > 0}
  on:click|self={() => ($selectedCellId = null)}
  on:wheel|passive={handleWheel}
>
  <div
    class="content"
    style="width:{contentWidth}px; --offset-y:{fakeOffsetY}px; --offset-x:{fakeOffsetX}px;"
  >
    <slot />
  </div>
  <ScrollOverlay />
</div>

<style>
  .sheet-body {
    display: block;
    position: relative;
    cursor: default;
    overflow: hidden;
    flex: 1 1 auto;
    height: 0;
  }
  .sheet-body::-webkit-scrollbar-track {
    background: transparent;
  }
  .content {
    min-width: 100%;
    min-height: 100%;
    background: var(--background-alt);
    transform: translate3d(var(--offset-x), var(--offset-y), 0);
    overflow: hidden;
  }

  /* Add shadow to sticky cells when horizontally scrolled */
  .horizontally-scrolled :global(.cell.sticky) {
    border-right-width: 1px;
  }
  .horizontally-scrolled :global(.cell.sticky:after) {
    content: " ";
    position: absolute;
    width: 10px;
    left: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.08), transparent);
  }
</style>
