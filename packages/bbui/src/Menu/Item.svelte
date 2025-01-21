<script>
  import { createEventDispatcher, getContext } from "svelte"
  import Icon from "../Icon/Icon.svelte"

  const dispatch = createEventDispatcher()
  const actionMenu = getContext("actionMenu")

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
      actionMenu.hideAll()
    }
    dispatch("click")
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<li
  on:click={disabled ? null : onClick}
  class="spectrum-Menu-item"
  class:is-disabled={disabled}
  role="menuitem"
  tabindex="0"
>
  {#if icon}
    <div class="icon">
      <Icon name={icon} size="S" />
    </div>
  {/if}
  <span class="spectrum-Menu-itemLabel"><slot /></span>
  {#if keys?.length || $$slots.right}
    <div class="keys">
      <slot name="right" />
      {#each keys as key}
        <div class="key">
          {#if key.startsWith("!")}
            <Icon size="XS" name={key.split("!")[1]} />
          {:else}
            {key}
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</li>

<style>
  .icon {
    align-self: center;
    margin-right: var(--spacing-s);
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
    height: 16px;
    text-align: center;
    margin: -1px 0;
    display: grid;
    place-items: center;
  }
  .is-disabled .key {
    color: var(--spectrum-global-color-gray-600);
  }
</style>
