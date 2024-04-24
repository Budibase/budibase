<script>
  import { Popover } from "@budibase/bbui"
  import { getContext } from "svelte"

  export let rand
  export let invertX
  export let open
  export let anchor

  const { rowHeight, scroll } = getContext("grid")

  let initialOffsetX = 0
  let initialOffsetY = 0

  $: updateInitialOffsets(open)
  $: offsetX = initialOffsetX - $scroll.left
  $: offsetY = initialOffsetY - ($scroll.top % $rowHeight)
  $: style = `transform: translateX(${offsetX}px) translateY(${offsetY}px);`
  $: markup = `<style>.grid-popover-container .spectrum-Popover { ${style} }</style>`

  const updateInitialOffsets = open => {
    if (!open) {
      return
    }
    initialOffsetX = $scroll.left
    initialOffsetY = $scroll.top % $rowHeight
  }
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html markup}
<Popover
  bind:open
  {anchor}
  align={invertX ? "right" : "left"}
  portalTarget="#grid-{rand} .grid-popover-container"
  offset={0}
>
  <slot />
</Popover>
