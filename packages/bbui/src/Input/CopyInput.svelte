<script>
  import Input from "../Form/Input.svelte"
  import Icon from "../Icon/Icon.svelte"
  import { notifications } from "../Stores/notifications"

  export let label = null
  export let value

  const copyToClipboard = val => {
    const dummy = document.createElement("textarea")
    document.body.appendChild(dummy)
    dummy.value = val
    dummy.select()
    document.execCommand("copy")
    document.body.removeChild(dummy)
    notifications.success(`Copied to clipboard`)
  }
</script>

<div>
  <Input readonly {value} {label} />
  <div class="icon" on:click={() => copyToClipboard(value)}>
    <Icon size="S" name="Copy" />
  </div>
</div>

<style>
  div {
    position: relative;
  }

  .icon {
    right: 1px;
    bottom: 1px;
    position: absolute;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    border-left: 1px solid var(--spectrum-alias-border-color);
    border-top-right-radius: var(--spectrum-alias-border-radius-regular);
    border-bottom-right-radius: var(--spectrum-alias-border-radius-regular);
    width: 31px;
    color: var(--spectrum-alias-text-color);
    background-color: var(--spectrum-global-color-gray-75);
    transition: background-color
        var(--spectrum-global-animation-duration-100, 130ms),
      box-shadow var(--spectrum-global-animation-duration-100, 130ms),
      border-color var(--spectrum-global-animation-duration-100, 130ms);
    height: calc(var(--spectrum-alias-item-height-m) - 2px);
  }
  .icon:hover {
    cursor: pointer;
    color: var(--spectrum-alias-text-color-hover);
    background-color: var(--spectrum-global-color-gray-50);
    border-color: var(--spectrum-alias-border-color-hover);
  }
</style>
