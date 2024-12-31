<script>
  import { organisation, auth } from "@/stores/portal"
  import { onMount } from "svelte"

  let loaded = false

  $: platformTitleText = $organisation.platformTitle
  $: platformTitle =
    !$auth.user && platformTitleText ? platformTitleText : "Budibase"

  $: faviconUrl = $organisation.faviconUrl || "/builder/bblogo.png"

  onMount(async () => {
    await organisation.init()
    loaded = true
  })
</script>

<!--
  In order to update the org elements, an update will have to be made to clear them.
-->

<svelte:head>
  <title>{platformTitle}</title>

  {#if loaded && !$auth.user && faviconUrl}
    <link rel="icon" href={faviconUrl} />
  {:else}
    <!-- A default must be set or the browser defaults to favicon.ico behaviour -->
    <link rel="icon" href={"/builder/bblogo.png"} />
  {/if}
</svelte:head>
