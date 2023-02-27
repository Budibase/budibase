<script>
  import CopyInput from "@budibase/bbui/src/Input/CopyInput.svelte"

  export let value

  function fullWebhookURL(uri) {
    if (!uri) {
      return ""
    }

    return `${window.location.origin}/${uri}`
  }
</script>

<CopyInput value={fullWebhookURL(value)} />
