<script>
  import Icon from "../Icon/Icon.svelte"
  import { notifications } from "../Stores/notifications"
  export let value

  const onClick = e => {
    e.stopPropagation()
    copyToClipboard(value)
  }

  const copyToClipboard = value => {
    return new Promise(res => {
      if (navigator.clipboard && window.isSecureContext) {
        // Try using the clipboard API first
        navigator.clipboard.writeText(value).then(res)
      } else {
        // Fall back to the textarea hack
        let textArea = document.createElement("textarea")
        textArea.value = value
        textArea.style.position = "fixed"
        textArea.style.left = "-9999px"
        textArea.style.top = "-9999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand("copy")
        textArea.remove()
        res()
      }
    })
      .then(() => {
        notifications.success("Copied to clipboard")
      })
      .catch(() => {
        notifications.error(
          "Failed to copy to clipboard. Check the dev console for the value."
        )
        console.warn("Failed to copy the value", value)
      })
  }
</script>

<div on:click|stopPropagation={onClick}>
  <Icon size="S" name="Copy" />
</div>
