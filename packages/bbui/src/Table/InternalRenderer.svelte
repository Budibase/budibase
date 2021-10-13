<script>
  import Icon from "../Icon/Icon.svelte"
  import { notifications } from "../Stores/notifications"
  export let value

  const onClick = e => {
    e.stopPropagation()
    copyToClipboard(value)
  }

  function copyToClipboard(value) {
    navigator.clipboard.writeText(value).then(() => {
      notifications.success("Copied")
    })
  }
</script>

<div on:click|stopPropagation={onClick}>
  <Icon size="S" name="Copy" />
</div>

<style>
  div {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 150px;
  }
</style>
