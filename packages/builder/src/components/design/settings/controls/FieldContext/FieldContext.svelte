<script>
  import ExplanationModal from './ExplanationModal/index.svelte'
  import { warnings, errors } from "./validator";
  import { Column, Support, NotRequired, StringNumber } from "./lines"
  import subjects from './subjects';

  export let support = {}

  export let columnIcon
  export let columnType
  export let columnName
  export let explanationModal = false

  export let tableHref = () => {}

  export let schema

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
  {#if support?.warnings?.includes(warnings.stringAsNumber)}
    <StringNumber
      {setExplanationSubject}
    />
  {/if}
  {#if support?.warnings?.includes(warnings.notRequired)}
    <NotRequired
      {setExplanationSubject}
    />
  {/if}
</div>


{#if explanationModal}
  <ExplanationModal
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
