<script>
  import { Accordion } from "@budibase/bbui"

  export let bold
  export let initialOpen
  export let label
</script>

<Accordion header={label || ""} {bold} {initialOpen}>
  <slot />
</Accordion>
