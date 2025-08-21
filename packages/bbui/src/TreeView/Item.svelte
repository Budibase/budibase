<script lang="ts">
  import Icon from "../Icon/Icon.svelte"

  export let selected: boolean = false
  export let open: boolean = false
  export let href: string | null = null
  export let title: string
  export let icon: string | undefined
</script>

<li
  class:is-selected={selected}
  class:is-open={open}
  class="spectrum-TreeView-item"
>
  <a on:click class="spectrum-TreeView-itemLink" {href}>
    {#if $$slots.default}
      <Icon name="caret-right" size="M" />
    {/if}
    {#if icon}
      <Icon name={icon} size="M" />
    {/if}
    <span class="spectrum-TreeView-itemLabel">{title}</span>
  </a>
  {#if $$slots.default}
    <ul class="spectrum-TreeView">
      <slot />
    </ul>
  {/if}
</li>

<style>
</style>
