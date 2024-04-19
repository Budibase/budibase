<script>
  import ExplanationModal from './ExplanationModal/index.svelte'
  import { messages as messageConstants, getColumnInfoMessagesAndSupport, getExplanationWithPresets } from "./columnInfo";
  import { Column, Support, NotRequired, StringNumber, JSONPrimitivesOnly, DateAsNumber } from "./lines"
  import subjects from './subjects';
  import {
    componentStore,
  } from "stores/builder"

  export let explanation
  export let columnIcon
  export let columnType
  export let columnName
  export let explanationModal = false

  export let tableHref = () => {}

  export let schema

  $: explanationWithPresets = getExplanationWithPresets(explanation, $componentStore.typeSupportPresets)
  let support
  let messages = []

  $: {
    const columnInfoMessagesAndSupport = getColumnInfoMessagesAndSupport(schema, explanationWithPresets)
    support = columnInfoMessagesAndSupport.support
    messages = columnInfoMessagesAndSupport.messages
  }

  let root = null;

  let explanationModalSubject = subjects.none

  const setExplanationSubject = (option) => {
    explanationModalSubject = option;
    root = root
  }
</script>

<div
  bind:this={root}
  class="tooltipContents"
>
  <Column
    {columnName}
    {columnIcon}
    {columnType}
    {tableHref}
    {setExplanationSubject}
  />
  <Support
    {support}
    {setExplanationSubject}
  />
  {#if messages.includes(messageConstants.stringAsNumber)}
    <StringNumber
      {setExplanationSubject}
    />
  {/if}
  {#if messages.includes(messageConstants.notRequired)}
    <NotRequired
      {setExplanationSubject}
    />
  {/if}
  {#if messages.includes(messageConstants.jsonPrimitivesOnly)}
    <JSONPrimitivesOnly
      {setExplanationSubject}
    />
  {/if}
  {#if messages.includes(messageConstants.dateAsNumber)}
    <DateAsNumber
      {setExplanationSubject}
    />
  {/if}
</div>


{#if explanationModal}
  <ExplanationModal
    {columnName}
    anchor={root}
    {schema}
    subject={explanationModalSubject}
  />
{/if}

<style>
  .tooltipContents {
    max-width: 450px;
    background-color: var(--background-alt);
    display: block;
    padding: 20px 16px 10px;
    border-radius: 5px;
    box-sizing: border-box;
  }
</style>
