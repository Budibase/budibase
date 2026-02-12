<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import { isActive } from "@roxi/routify"

  $isActive

  export let text: string
  export let icon: string | undefined = undefined
  export let url: string | undefined = undefined
  export let collapsed = false
  export let target: string | undefined = undefined
  export let forceActive: boolean | undefined = undefined
  export let iconColor: string = ""

  $: active = forceActive ?? (url ? $isActive(url) : false)
  $: computedIconColor =
    iconColor ||
    (active
      ? "var(--spectrum-global-color-gray-900)"
      : "var(--spectrum-global-color-gray-600)")
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
    <slot name="icon" />
    {#if icon}
      <Icon name={icon} size="M" weight="regular" color={computedIconColor} />
    {/if}
  </div>
  <div class="link_content">
    <div class="link_text" style={iconColor ? `color: ${iconColor};` : ""}>
      {text}
    </div>
    {#if $$slots.right}
      <div class="right">
        <slot name="right" />
      </div>
    {/if}
  </div>

  {#if $$slots.actions}
    <div class="actions">
      <slot name="actions" />
    </div>
  {/if}
</a>

<style>
  .actions {
    display: none;
    gap: 4px;
    align-items: center;
    justify-content: flex-end;
  }
  .link:hover .actions {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    justify-content: flex-end;
  }
  .link {
    --side-nav-link-icon-width: 20px;
    --side-nav-link-inline-padding: max(
      0px,
      calc(
        (
            var(--nav-collapsed-width, 48px) - var(--nav-padding, 12px) -
              var(--side-nav-link-icon-width)
          ) /
          2
      )
    );
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 2px;
    height: 28px;
    gap: 8px;
    padding: 0 var(--side-nav-link-inline-padding);
    color: var(--spectrum-global-color-gray-700);
    border-radius: 9px;
    border: none;
    transition:
      background 130ms ease-out,
      color 130ms ease-out;
  }
  .link.active,
  .link:hover {
    color: var(--spectrum-global-color-gray-900);
    background: var(--spectrum-global-color-gray-200);
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  .link:hover .link_icon :global(i) {
    color: var(--spectrum-global-color-gray-900);
  }

  .link:active {
    background: var(--spectrum-global-color-gray-200);
  }

  .link_icon {
    flex: 0 0 var(--side-nav-link-icon-width);
    display: grid;
    place-items: center;
  }
  .link_icon :global(i) {
    font-size: 18px;
    width: 18px;
    height: 18px;
  }
  .link_text {
    font-family: Inter;
    letter-spacing: -0.02em;
    font-weight: 400;
    line-height: 20px;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    flex: 1;
  }

  .link .link_content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
    opacity: 1;
    visibility: visible;
    transition:
      opacity 160ms ease-out,
      max-width 160ms ease-out,
      visibility 0ms linear 0ms;
  }
  .link.collapsed {
    gap: 0;
  }
  .link.collapsed .link_content {
    flex: 0 1 auto;
    max-width: 0;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition:
      opacity 120ms ease-out,
      max-width 120ms ease-out,
      visibility 0ms linear 120ms;
  }

  @media (prefers-reduced-motion: reduce) {
    .link,
    .link .link_content,
    .link.collapsed .link_content {
      transition: none;
    }
  }
</style>
