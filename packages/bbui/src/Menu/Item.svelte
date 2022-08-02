<script>
  import { createEventDispatcher, getContext } from "svelte"

  const dispatch = createEventDispatcher()
  const actionMenu = getContext("actionMenu")

  export let dataCy
  export let icon = undefined
  export let disabled = undefined
  export let noClose = false
  export let keyBind = undefined

  $: keys = getKeys(keyBind)

  const getKeys = keyBind => {
    let keys = keyBind?.split("+") || []
    for (let i = 0; i < keys.length; i++) {
      if (
        keys[i].toLowerCase() === "ctrl" &&
        navigator.platform.startsWith("Mac")
      ) {
        keys[i] = "⌘"
      }
    }
    return keys
  }

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
  {#if keys?.length}
    <div class="keys">
      {#each keys as key}
        <div class="key">
          {key}
        </div>
      {/each}
    </div>
  {/if}
</li>

<style>
  .spectrum-Menu-itemIcon {
    align-self: center;
  }
  .keys {
    margin-left: 30px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 4px;
  }
  .key {
    color: var(--spectrum-global-color-gray-900);
    padding: 2px 4px;
    font-size: 12px;
    font-weight: 600;
    background-color: var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    min-width: 12px;
    text-align: center;
    margin: -1px 0;
  }
  .is-disabled .key {
    color: var(--spectrum-global-color-gray-600);
  }
</style>
