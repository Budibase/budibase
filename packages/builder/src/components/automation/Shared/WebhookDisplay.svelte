<script>
  import { Input, Icon, notifications } from "@budibase/bbui"
  import { store, hostingStore } from "builderStore"

  export let value
  export let production = false

  $: appId = $store.appId
  $: appUrl = $hostingStore.appUrl

  function fullWebhookURL(uri) {
    if (production) {
      return `${appUrl}/${uri}`
    } else {
      return `${window.location.origin}/${uri}`
    }
  }

  function copyToClipboard() {
    const dummy = document.createElement("textarea")
    document.body.appendChild(dummy)
    dummy.value = fullWebhookURL(value)
    dummy.select()
    document.execCommand("copy")
    document.body.removeChild(dummy)
    notifications.success(`URL copied to clipboard`)
  }
</script>

<div>
  <Input readonly value={fullWebhookURL(value)} />
  <div class="icon" on:click={() => copyToClipboard()}>
    <Icon s name="Copy" />
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
