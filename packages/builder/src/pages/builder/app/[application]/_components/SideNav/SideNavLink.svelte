<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import { isActive } from "@roxi/routify"

  export let text: string
  export let icon: string | undefined = undefined
  export let url: string | undefined = undefined
  export let collapsed = false
  export let target: string | undefined = undefined
  export let forceActive: boolean | undefined = undefined

  $: active = forceActive ?? (url ? $isActive(url) : false)
</script>

<a
  class="link"
  class:active
  href={url}
  {target}
  on:click
  class:collapsed
  tabindex="0"
>
  <div class="link_icon">
    {#if $$slots.icon}
      <slot name="icon" />
    {:else}
      <Icon
        name={icon}
        size="M"
        weight="regular"
        color="var(--spectrum-global-color-gray-800)"
      />
    {/if}
  </div>
  <div class="link_text">{text}</div>
  {#if $$slots.actions}
    <div class="actions">
      <slot name="actions" />
    </div>
  {/if}
</a>

<style>
  .actions {
    display: none;
  }
  .link:hover .actions {
    display: block;
  }
  .link {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 28px;
    gap: 5px;
    padding: 0 calc(var(--nav-padding) / 2);
    color: var(--spectrum-global-color-gray-900);
    border-radius: 9px;
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
    background: var(--spectrum-global-color-gray-200);
  }

  .link_icon {
    flex: 0 0 20px;
    display: grid;
    place-items: center;
  }
  .link_text {
    font-family: Inter;
    letter-spacing: -0.02em;
    font-weight: 500;
    line-height: 20px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
  .link.collapsed .link_text {
    display: none;
  }
</style>
