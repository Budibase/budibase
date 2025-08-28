<script>
  import { ActionButton } from "@budibase/bbui"

  export let title = ""
  export let href = null
</script>

<ActionButton
  quiet
  icon="question"
  on:click={() => window.open(href, "_blank")}
>
  {title}
</ActionButton>
