<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import type { IconInfo } from "@/helpers/integrationIcons"

  export let icon: IconInfo | undefined
  export let size = 16
  export let fallbackIcon: string | undefined = undefined

  let fallbackSize: "S" | "M" = "S"
  $: fallbackSize = size <= 16 ? "S" : "M"
  $: sizeStr = String(size)
</script>

{#if icon?.url}
  <img src={icon.url} alt="" width={size} height={size} />
{:else if icon?.icon}
  <svelte:component this={icon.icon} width={sizeStr} height={sizeStr} />
{:else if fallbackIcon}
  <Icon name={fallbackIcon} size={fallbackSize} />
{/if}
