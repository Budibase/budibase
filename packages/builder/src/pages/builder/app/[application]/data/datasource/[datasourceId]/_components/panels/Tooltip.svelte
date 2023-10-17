<script>
  import { ActionButton } from "@budibase/bbui"

  export let title = ""
  export let href = null
</script>

<ActionButton quiet icon="Help" on:click={() => window.open(href, "_blank")}>
  {title}
</ActionButton>
