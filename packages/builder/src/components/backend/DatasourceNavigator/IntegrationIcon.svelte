<script>
  import { getIcon } from "./icons"
  import CustomSVG from "@/components/common/CustomSVG.svelte"

  export let integrationType
  export let schema
  export let iconUrl = undefined
  export let size = "18"

  $: iconInfo = getIcon(integrationType, schema, iconUrl)

  async function getSvgFromUrl(info) {
    const url = `${info.url}`
    const resp = await fetch(url, {
      headers: {
        ["pragma"]: "no-cache",
        ["cache-control"]: "no-cache",
      },
    })
    return resp.text()
  }

  function isSvgUrl(url) {
    return url?.toLowerCase().endsWith(".svg")
  }
</script>

{#if iconInfo.icon}
  <svelte:component this={iconInfo.icon} height={size} width={size} />
{:else if iconInfo.url}
  {#if isSvgUrl(iconInfo.url)}
    {#await getSvgFromUrl(iconInfo) then retrievedSvg}
      <CustomSVG {size} svgHtml={retrievedSvg} />
    {/await}
  {:else}
    <img src={iconInfo.url} alt="" width={size} height={size} />
  {/if}
{/if}
