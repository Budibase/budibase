<script lang="ts">
  import Icon from "../../Icon/Icon.svelte"
  import type { ResolvedIcon } from "../../types/Picker"

  export let icon: ResolvedIcon | null = null
  export let useOptionIconImage: boolean = false
  export let defaultColour: string = "var(--spectrum-global-color-gray-600)"
</script>

{#if icon}
  {#if icon.type === "component"}
    <svelte:component this={icon.component} {...icon.props} />
  {:else if useOptionIconImage}
    <img class="icon-dims" src={icon.value} alt="icon" />
  {:else}
    <Icon size="M" color={defaultColour} name={icon.value} />
  {/if}
{/if}

<style>
  .icon-dims {
    height: 15px;
    width: auto;
  }
</style>
