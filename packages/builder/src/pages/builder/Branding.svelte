<script>
  import { organisation, auth, admin } from "stores/portal"
  import { onMount } from "svelte"

  let loaded = false
  let platformTitle = null

  $: platformTitleText = $organisation.platformTitle
  $: platformTitleText,
    (platformTitle =
      !$admin.isCloud && !$auth.user ? platformTitleText : "Budibase")

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

  {#if loaded && !$auth.user}
    <link
      rel="icon"
      href={$organisation.faviconUrl || "https://i.imgur.com/Xhdt1YP.png"}
    />
  {:else}
    <!-- A default must be set or the browser defaults to favicon.ico behaviour -->
    <link rel="icon" href={"https://i.imgur.com/Xhdt1YP.png"} />
  {/if}

  <!-- Primary Meta Tags -->
  <!-- <meta name="title" content={metaTitle} /> -->
  <!-- 
      metaTitle should match the title... 
      should title override metaTitle, if set??
    -->

  <!-- <meta name="description" content={metaDescription} /> -->

  <!-- Opengraph Meta Tags -->
  <!-- <meta property="og:site_name" content="Budibase" />
    <meta property="og:title" content="{title} - built with Budibase" />
    <meta property="og:description" content={metaDescription} />
    <meta property="og:type" content="website" />
    <meta property="og:image" content={metaImage} /> -->

  <!-- Twitter -->
  <!-- <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@budibase" />
    <meta name="twitter:image" content={metaImage} /> -->
  <!-- Consider adding this twitter:image:alt -->
  <!-- <meta name="twitter:title" content="{title} - built with Budibase" />
    <meta property="twitter:description" content={metaDescription} /> -->
</svelte:head>
