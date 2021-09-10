<script>
  import Provider from "./Provider.svelte"
  import { onMount } from "svelte"

  let width = window.innerWidth
  let height = window.innerHeight
  const tabletBreakpoint = 768
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
    const doc = document.getElementById("app-root")
    resizeObserver.observe(doc)

    return () => {
      resizeObserver.unobserve(doc)
    }
  })
</script>

<Provider key="device" {data}>
  <slot />
</Provider>
