<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import type { IconInfo } from "@/helpers/integrationIcons"

  export let icon: IconInfo | undefined
  export let size: "S" | "M" | "L" = "S"
  export let fallbackIcon: string | undefined = undefined

  $: sizeStr = size === "S" ? "16" : size === "M" ? "18" : "24"
</script>

{#if icon?.url}
  <img src={icon.url} alt="" width={sizeStr} height={sizeStr} />
{:else if icon?.icon}
  <svelte:component this={icon.icon} width={sizeStr} height={sizeStr} />
{:else if fallbackIcon}
  <Icon name={fallbackIcon} {size} />
{/if}
