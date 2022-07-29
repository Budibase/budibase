<script>
  import { createEventDispatcher, getContext } from "svelte"

  const dispatch = createEventDispatcher()
  const actionMenu = getContext("actionMenu")

  export let dataCy
  export let icon = undefined
  export let disabled = undefined
  export let noClose = false
  export let keyBind = undefined

  const onClick = () => {
    if (actionMenu && !noClose) {
      actionMenu.hide()
    }
    dispatch("click")
  }
</script>

<li
  data-cy={dataCy}
  on:click|preventDefault={disabled ? null : onClick}
  class="spectrum-Menu-item"
  class:is-disabled={disabled}
  role="menuitem"
  tabindex="0"
>
  {#if icon}
    <svg
      class="spectrum-Icon spectrum-Icon--sizeS spectrum-Menu-itemIcon"
      focusable="false"
      aria-hidden="true"
      aria-label={icon}
    >
      <use xlink:href="#spectrum-icon-18-{icon}" />
    </svg>
  {/if}
  <span class="spectrum-Menu-itemLabel"><slot /></span>
  {#if keyBind}
    <div class="keyBind">
      {keyBind}
    </div>
  {/if}
</li>

<style>
  .spectrum-Menu-itemIcon {
    align-self: center;
  }
  .keyBind {
    margin-left: var(--spacing-xl);
    color: var(--spectrum-global-color-gray-600);
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 600;
  }
</style>
