<script>
  import { getIcon } from "./icons"
  import CustomSVG from "components/common/CustomSVG.svelte"
  import { admin } from "stores/portal"

  export let integrationType
  export let schema
  export let size = "18"

  $: objectStoreUrl = $admin.cloud ? "https://cdn.budi.live" : ""
  $: pluginsUrl = `${objectStoreUrl}/plugins`
  $: iconInfo = getIcon(integrationType, schema)

  async function getSvgFromUrl(info) {
    const url = `${pluginsUrl}/${info.url}`
    const resp = await fetch(url, {
      headers: {
        pragma: "no-cache",
        "cache-control": "no-cache",
      },
    })
    let text = await resp.text()
    // explicitly only want to replace the first instance
    if (text.includes("height=")) {
      text = text.replace(/height="\d*"/, `height="${size}"`)
    }
    if (text.includes("width=")) {
      text = text.replace(/width="\d*"/, `width="${size}"`)
    }
    return text
  }
</script>

{#if iconInfo.icon}
  <svelte:component this={iconInfo.icon} height={size} width={size} />
{:else if iconInfo.url}
  {#await getSvgFromUrl(iconInfo) then retrievedSvg}
    <CustomSVG {size} svgHtml={retrievedSvg} />
  {/await}
{/if}
