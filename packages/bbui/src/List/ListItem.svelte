<script>
  import Body from "../Typography/Body.svelte"
  import IconAvatar from "../Icon/IconAvatar.svelte"
  import Label from "../Label/Label.svelte"
  import Avatar from "../Avatar/Avatar.svelte"

  export let icon = null
  export let iconBackground = null
  export let iconColor = null
  export let avatar = false
  export let title = null
  export let subtitle = null
  export let hoverable = false

  $: initials = avatar ? title?.[0] : null
</script>

<div class="list-item" class:hoverable on:click>
  <div class="left">
    {#if icon}
      <IconAvatar {icon} color={iconColor} background={iconBackground} />
    {/if}
    {#if avatar}
      <Avatar {initials} />
    {/if}
    {#if title}
      <Body>{title}</Body>
    {/if}
    {#if subtitle}
      <Label>{subtitle}</Label>
    {/if}
  </div>
  {#if $$slots.default}
    <div class="right">
      <slot />
    </div>
  {/if}
</div>

<style>
  .list-item {
    padding: 0 16px;
    height: 56px;
    background: var(--spectrum-global-color-gray-50);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: 1px solid var(--spectrum-global-color-gray-300);
    transition: background 130ms ease-out;
    gap: var(--spacing-m);
  }
  .list-item:not(:first-child) {
    border-top: none;
  }
  .list-item:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .list-item:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .hoverable:hover {
    cursor: pointer;
    background: var(--spectrum-global-color-gray-75);
  }
  .left,
  .right {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-xl);
  }
  .left {
    width: 0;
    flex: 1 1 auto;
  }
  .right {
    flex: 0 0 auto;
  }
  .list-item :global(.spectrum-Icon),
  .list-item :global(.spectrum-Avatar) {
    flex: 0 0 auto;
  }
  .list-item :global(.spectrum-Body) {
    color: var(--spectrum-global-color-gray-900);
  }
  .list-item :global(.spectrum-Body) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
