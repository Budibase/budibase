<script>
  import Provider from "./Provider.svelte"
  import { onMount, onDestroy } from "svelte"

  let width = window.innerWidth
  let height = window.innerHeight
  const tabletBreakpoint = 720
  const desktopBreakpoint = 1280
  const resizeObserver = new ResizeObserver(entries => {
    if (entries?.[0]) {
      width = entries[0].contentRect?.width
      height = entries[0].contentRect?.height
    }
  })

  $: data = {
    mobile: width && width < tabletBreakpoint,
    tablet: width && width >= tabletBreakpoint && width < desktopBreakpoint,
    width,
    height,
  }

  onMount(() => {
    resizeObserver.observe(document.getElementById("clip-root"))
  })

  onDestroy(() => {
    resizeObserver.unobserve(document.getElementById("clip-root"))
  })
</script>

<Provider key="device" {data}>
  <slot />
</Provider>
