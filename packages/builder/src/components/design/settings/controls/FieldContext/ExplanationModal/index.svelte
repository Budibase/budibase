<script>
  import { ContextTooltip } from "@budibase/bbui"
  import { Column, Support, NotRequired, StringsAsNumbers } from './subjects'
  import subjects from '../subjects'

  export let anchor
  export let schema
  export let subject = subjects.none
</script>


<ContextTooltip
  noAnimation
  visible={subject !== subjects.none}
  {anchor}
  offset={20}
>
  <div class="explanationModalContent">
    {#if subject === subjects.column}
      <Column {schema} />
    {:else if subject === subjects.support}
      <Support />
    {:else if subject === subjects.stringsAsNumbers}
      <StringsAsNumbers />
    {:else if subject === subjects.notRequired}
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
