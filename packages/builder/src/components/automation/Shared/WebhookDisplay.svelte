<script>
  import { notifier } from "builderStore/store/notifications"
  import { Input } from "@budibase/bbui"

  export let value

  function fullWebhookURL(uri) {
    return `http://localhost:4001/${uri}`
  }

  function copyToClipboard() {
    const dummy = document.createElement("textarea")
    document.body.appendChild(dummy)
    dummy.value = fullWebhookURL(value)
    dummy.select()
    document.execCommand("copy")
    document.body.removeChild(dummy)
    notifier.success(`URL copied to clipboard`)
  }
</script>

<div>
  <Input disabled="true" thin value={fullWebhookURL(value)} />
  <span on:click={() => copyToClipboard()}>
    <i class="ri-clipboard-line copy-icon" />
  </span>
</div>

<style>
  div {
    position: relative;
  }

  div :global(input:disabled) {
    color: var(--grey-7);
  }

  span {
    position: absolute;
    border: none;
    border-radius: 50%;
    height: 24px;
    width: 24px;
    background: white;
    right: var(--spacing-s);
    bottom: 9px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  span:hover {
    background-color: var(--grey-3);
  }
</style>
