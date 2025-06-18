<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import { isActive } from "@roxi/routify"

  export let text: string
  export let icon: string | undefined = undefined
  export let url: string | undefined = undefined
  export let collapsed = false
  export let forceActive: boolean | undefined = undefined

  $: active = forceActive ?? (url ? $isActive(url) : false)
</script>

<a class="link" class:active href={url} on:click class:collapsed tabindex="0">
  <div class="link_icon">
    {#if $$slots.icon}
      <slot name="icon" />
    {:else}
      <Icon name={icon} size="M" weight="fill" />
    {/if}
  </div>
  <div class="link_text">{text}</div>
</a>

<style>
  .link {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 30px;
    gap: 7px;
    padding: 0 calc(var(--nav-padding) / 2);
    color: var(--spectrum-global-color-gray-800);
    border-radius: 8px;
    border: 1px solid transparent;
    transition:
      background 130ms ease-out,
      border 130ms ease-out,
      color 130ms ease-out;
  }
  .link.active,
  .link:hover {
    color: var(--spectrum-global-color-gray-900);
    background: var(--spectrum-global-color-gray-200);
    border: 1px solid var(--spectrum-global-color-gray-300);
    cursor: pointer;
  }
  .link:active {
    background: var(--spectrum-global-color-gray-300);
  }

  .link_icon {
    flex: 0 0 20px;
    display: grid;
    place-items: center;
  }
  .link_text {
    font-size: 14px;
    font-weight: 475;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .link.collapsed .link_text {
    display: none;
  }
</style>
