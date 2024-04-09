<script>
  import { ContextTooltip } from "@budibase/bbui"
  import { Column, Support, NotRequired, StringsAsNumbers } from './subjects'

  export let anchor
  export let schema
  export let subject = null
</script>


<ContextTooltip
  noAnimation
  visible={subject !== null}
  {anchor}
  offset={20}
>
  <div class="explanationModalContent">
    {#if subject === "column"}
      <Column {schema} />
    {:else if subject === "support"}
      <Support />
    {:else if subject === "stringsAndNumbers"}
      <StringsAsNumbers />
    {:else if subject === "required"}
      <NotRequired />
    {/if}
  </div>
</ContextTooltip>

<style>
  .explanationModalContent {
    max-width: 300px;
    padding: 16px 12px 6px;
  }
</style>
