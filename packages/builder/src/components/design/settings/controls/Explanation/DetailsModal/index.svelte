<script>
  import { ContextTooltip } from "@budibase/bbui"
  import {
    StringsAsDates,
    NumbersAsDates,
    ScalarJsonOnly,
    Column,
    Support,
    NotRequired,
    StringsAsNumbers,
    DatesAsNumbers,
  } from "./subjects"
  import subjects from "../subjects"

  export let anchor
  export let schema
  export let columnName
  export let subject = subjects.none
</script>

<ContextTooltip visible={subject !== subjects.none} {anchor} offset={20}>
  <div class="explanationModalContent">
    {#if subject === subjects.column}
      <Column {columnName} {schema} />
    {:else if subject === subjects.support}
      <Support />
    {:else if subject === subjects.stringsAsNumbers}
      <StringsAsNumbers />
    {:else if subject === subjects.notRequired}
      <NotRequired />
    {:else if subject === subjects.datesAsNumbers}
      <DatesAsNumbers />
    {:else if subject === subjects.scalarJsonOnly}
      <ScalarJsonOnly {columnName} {schema} />
    {:else if subject === subjects.numbersAsDates}
      <NumbersAsDates {columnName} />
    {:else if subject === subjects.stringsAsDates}
      <StringsAsDates {columnName} />
    {/if}
  </div>
</ContextTooltip>

<style>
  .explanationModalContent {
    max-width: 300px;
    padding: 16px 12px 2px;
  }
</style>
