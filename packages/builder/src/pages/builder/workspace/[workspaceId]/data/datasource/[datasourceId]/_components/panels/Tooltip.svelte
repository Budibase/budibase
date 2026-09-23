<script>
  import { ActionButton } from "@budibase/bbui"

  export let title = ""
  export let href = null
  export let showLabel = true

  const ariaLabel = title || "More info"
</script>

<ActionButton
  quiet
  icon="question"
  aria-label={ariaLabel}
  on:click={() => window.open(href, "_blank")}
>
  {#if showLabel}
    {title}
  {/if}
</ActionButton>
