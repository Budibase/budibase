<script>
  import { getIntegrationIcon } from "@/helpers/integrationIcons"
  export let integrationType
  export let schema
  export let iconUrl = undefined
  export let size = "18"

  $: iconInfo = getIntegrationIcon(integrationType, schema, iconUrl)
</script>

{#if iconInfo.icon}
  <svelte:component this={iconInfo.icon} height={size} width={size} />
{:else if iconInfo.url}
  <img
    src={iconInfo.url}
    alt=""
    height={size}
    width={size}
    loading="lazy"
    decoding="async"
    draggable="false"
  />
{/if}
