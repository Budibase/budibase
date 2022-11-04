<script>
  import Icon from "../Icon/Icon.svelte"
  import { Helpers } from "@budibase/frontend-core"
  import { notifications } from "../Stores/notifications"

  export let value

  const onClick = async e => {
    e.stopPropagation()
    try {
      await Helpers.copyToClipboard(value)
      notifications.success("Copied to clipboard")
    } catch (error) {
      notifications.error(
        "Failed to copy to clipboard. Check the dev console for the value."
      )
      console.warn("Failed to copy the value", value)
    }
  }
</script>

<div on:click|stopPropagation={onClick}>
  <Icon size="S" name="Copy" />
</div>
