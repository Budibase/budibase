<script>
  import DetailsModal from "./DetailsModal/index.svelte"
  import {
    messages as messageConstants,
    getExplanationMessagesAndSupport,
    getExplanationWithPresets,
  } from "./explanation"
  import {
    StringAsDate,
    NumberAsDate,
    Column,
    Support,
    NotRequired,
    StringAsNumber,
    JSONPrimitivesOnly,
    DateAsNumber,
  } from "./lines"
  import subjects from "./subjects"
  import { appStore } from "@/stores/builder"

  export let tableHref = () => {}
  export let schema
  export let name
  export let explanation
  export let componentName

  $: explanationWithPresets = getExplanationWithPresets(
    explanation,
    $appStore.typeSupportPresets
  )
  let support
  let messages = []

  $: {
    const explanationMessagesAndSupport = getExplanationMessagesAndSupport(
      schema,
      explanationWithPresets
    )
    support = explanationMessagesAndSupport.support
    messages = explanationMessagesAndSupport.messages
  }

  let root = null

  let detailsModalSubject = subjects.none

  const setExplanationSubject = option => {
    detailsModalSubject = option
    root = root
  }
</script>

<div bind:this={root} class="tooltipContents">
  <Column {name} {schema} {tableHref} {setExplanationSubject} />
  <Support {componentName} {support} {setExplanationSubject} />
  {#if messages.includes(messageConstants.stringAsNumber)}
    <StringAsNumber {setExplanationSubject} />
  {/if}
  {#if messages.includes(messageConstants.notRequired)}
    <NotRequired {setExplanationSubject} />
  {/if}
  {#if messages.includes(messageConstants.jsonPrimitivesOnly)}
    <JSONPrimitivesOnly {setExplanationSubject} />
  {/if}
  {#if messages.includes(messageConstants.dateAsNumber)}
    <DateAsNumber {setExplanationSubject} />
  {/if}
  {#if messages.includes(messageConstants.numberAsDate)}
    <NumberAsDate {setExplanationSubject} />
  {/if}
  {#if messages.includes(messageConstants.stringAsDate)}
    <StringAsDate {setExplanationSubject} />
  {/if}
</div>

{#if detailsModalSubject !== subjects.none}
  <DetailsModal
    columnName={name}
    anchor={root}
    {schema}
    subject={detailsModalSubject}
  />
{/if}

<style>
  .tooltipContents {
    max-width: 450px;
    display: block;
    padding: 20px 16px 10px;
    border-radius: 5px;
    box-sizing: border-box;
  }
</style>
