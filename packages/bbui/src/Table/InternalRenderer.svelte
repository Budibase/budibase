<script>
  import Icon from "../Icon/Icon.svelte"
  import { copyToClipboard } from "../helpers"
  import { notifications } from "../Stores/notifications"

  import _ from "../../../builder/lang/i18n"

  export let value

  const onClick = async e => {
    e.stopPropagation()
    try {
      await copyToClipboard(value)
      notifications.success($_("bbui.src.Table.InternalRenderer.Copied"))
    } catch (error) {
      notifications.error($_("bbui.src.Table.InternalRenderer.Failed"))
      console.warn($_("bbui.src.Table.InternalRenderer.Failed_copy"), value)
    }
  }
</script>

<div on:click|stopPropagation={onClick}>
  <Icon size="S" name="Copy" />
</div>
