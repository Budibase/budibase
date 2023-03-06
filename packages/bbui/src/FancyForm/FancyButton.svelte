<script>
  import Icon from "../Icon/Icon.svelte"
  import FancyField from "./FancyField.svelte"

  export let icon
  export let disabled
</script>

<FancyField on:click clickable {disabled}>
  {#if icon}
    {#if icon.includes("/")}
      <img src={icon} alt="button" />
    {:else}
      <Icon name={icon} />
    {/if}
  {/if}
  <slot name="icon" />
  <div>
    <slot />
  </div>
</FancyField>

<style>
  img {
    width: 22px;
  }
  div {
    font-size: var(--font-size-l);
  }
</style>
