<script>
  export let logoUrl
  export let logoLinkUrl
  export let openLogoLinkInNewTab
  export let hideLogo = false
  export let title
  export let isInternal
  export let getSanitizedUrl
  export let linkable
</script>

{#if !hideLogo}
  {#if logoLinkUrl && isInternal(logoLinkUrl) && !openLogoLinkInNewTab}
    <a href={getSanitizedUrl(logoLinkUrl, openLogoLinkInNewTab)} use:linkable>
      <img src={logoUrl || "/builder/bblogo.png"} alt={title} />
    </a>
  {:else if logoLinkUrl}
    <a
      target={openLogoLinkInNewTab ? "_blank" : "_self"}
      href={getSanitizedUrl(logoLinkUrl, openLogoLinkInNewTab)}
    >
      <img src={logoUrl || "/builder/bblogo.png"} alt={title} />
    </a>
  {:else}
    <img src={logoUrl || "/builder/bblogo.png"} alt={title} />
  {/if}
{/if}

<style>
  img {
    height: var(--logoHeight);
  }
</style>
