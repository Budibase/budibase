<script>
  export let logoUrl
  export let logoLinkUrl
  export let openLogoLinkInNewTab
  export let hideLogo = false
  export let title
  export let isInternal
  export let getSanitizedUrl
  export let linkable
  export let logoHeight
</script>

{#if !hideLogo}
  {#if logoLinkUrl && isInternal(logoLinkUrl) && !openLogoLinkInNewTab}
    <a href={getSanitizedUrl(logoLinkUrl, openLogoLinkInNewTab)} use:linkable>
      <img
        src={logoUrl || "/builder/bblogo.png"}
        alt={title}
        style={logoHeight ? `height:${logoHeight}px` : ""}
      />
    </a>
  {:else if logoLinkUrl}
    <a
      target={openLogoLinkInNewTab ? "_blank" : "_self"}
      href={getSanitizedUrl(logoLinkUrl, openLogoLinkInNewTab)}
    >
      <img
        src={logoUrl || "/builder/bblogo.png"}
        alt={title}
        style={logoHeight ? `height:${logoHeight}px` : ""}
      />
    </a>
  {:else}
    <img
      src={logoUrl || "/builder/bblogo.png"}
      alt={title}
      style={logoHeight ? `height:${logoHeight}px` : ""}
    />
  {/if}
{/if}
