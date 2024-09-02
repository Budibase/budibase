<script>
  import Provider from "./Provider.svelte"
  import { onMount } from "svelte"

  let data = {}

  function extractDomainFromUrl(url) {
    const { hostname } = new URL(url)
    const parts = hostname.split(".")
    const tld = parts.slice(-2).join(".")
    return tld
  }

  function handleMessage(event) {
    if (event.data?.type !== "bb-parent-window-event") {
      return
    }

    // Validate the event origin to ensure it's coming from a trusted source
    // Allow different subdomains but must match TLD
    const appOrigin = extractDomainFromUrl(window.location.origin)
    const eventOrigin = extractDomainFromUrl(event.origin)

    if (appOrigin === eventOrigin) {
      data = event.data
    } else {
      console.error(
        `Embedded budibase app domain ${appOrigin} does not match origin of event ${eventOrigin}.
        Top level domains must match`
      )
    }
  }

  onMount(() => {
    window.addEventListener("message", handleMessage)

    return () => window.removeEventListener("message", handleMessage)
  })
</script>

<Provider key="embed" {data}>
  <slot />
</Provider>
