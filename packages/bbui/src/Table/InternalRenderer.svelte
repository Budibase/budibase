<script>
  import Icon from "../Icon/Icon.svelte"
  import { copyToClipboard } from "../helpers"
  import { notifications } from "../Stores/notifications"

  export let value

  const onClick = async e => {
    e.stopPropagation()
    try {
      await copyToClipboard(value)
      notifications.success("Copied to clipboard")
    } catch (error) {
      notifications.error(
        "Failed to copy to clipboard. Check the dev console for the value."
      )
      console.warn("Failed to copy the value", value)
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click|stopPropagation={onClick}>
  <Icon size="S" name="Copy" />
</div>
