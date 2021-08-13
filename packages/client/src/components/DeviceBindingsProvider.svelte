<script>
  import Provider from "./Provider.svelte"
  import { onMount } from "svelte"

  const tabletBreakpoint = 768
  const desktopBreakpoint = 1280

  let screenWidth = window.innerWidth
  const resizeObserver = new ResizeObserver(entries => {
    if (entries?.[0]) {
      screenWidth = entries[0].contentRect?.width
    }
  })
  $: mobile = screenWidth && screenWidth < tabletBreakpoint
  $: tablet =
    screenWidth &&
    screenWidth >= tabletBreakpoint &&
    screenWidth < desktopBreakpoint
  $: data = { mobile, tablet }

  onMount(() => {
    const doc = document.documentElement
    resizeObserver.observe(doc)

    return () => {
      resizeObserver.unobserve(doc)
    }
  })
</script>

<Provider key="device" {data}>
  <slot />
</Provider>
