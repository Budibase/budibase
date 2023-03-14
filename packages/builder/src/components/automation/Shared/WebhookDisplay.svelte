<script>
  import { CopyInput } from "@budibase/bbui"

  export let value

  function fullWebhookURL(uri) {
    if (!uri) {
      return ""
    }

    return `${window.location.origin}/${uri}`
  }
</script>

<CopyInput value={fullWebhookURL(value)} />
