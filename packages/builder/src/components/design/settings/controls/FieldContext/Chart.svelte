<script>
  import { Icon, Heading, Multiselect, ContextTooltip } from "@budibase/bbui"
  import { getDatasourceForProvider, getSchemaForDatasource } from "dataBinding"
  import { selectedScreen } from "stores/builder"
  import { createEventDispatcher } from "svelte"

  export let supportLevelClass = ''
  export let supportLevelIcon = ""
  export let supportLevelIconTooltip = ""
  export let supportLevelText = ""

  export let columnIcon
  export let columnType
  export let columnName
  export let sidecar = false

  export let errors = []
  export let warnings = []

  let root = null;

  const getDocLink = (columnType) => {
    if (columnType === "Number") {
      return "https://docs.budibase.com/docs/number"
    }
    if (columnType === "Text") {
      return "https://docs.budibase.com/docs/text"
    }
    if (columnType === "attachment") {
      return "https://docs.budibase.com/docs/attachments"
    }
    if (columnType === "array") {
      return "https://docs.budibase.com/docs/multi-select"
    }

    return ""
  }

  $: docLink = getDocLink(columnType);

  let sidecarSubject = null

  const handleMouseenter = (option, idx) => {
    sidecarSubject = option;
    root = root
  }

  const handleMouseleave = (option) => {
    sidecarSubject = null;
  }

</script>

<div
  bind:this={root}
  class={`tooltipContents ${supportLevelClass}`}
>

  <div class="line topLine">
    <span class="bullet">•</span>
    <div
      on:mouseenter={() => handleMouseenter("column")}
      on:mouseleave={() => handleMouseleave("column")}
      class="chip columnName"
    >
      <span>
      {columnName}
      </span>
    </div>
    <span class="space" />
    <span class="text"> is a </span>
    <span class="space" />
    <a target="_blank" rel="noopener noreferrer" href={docLink} class="chip link topLink">
      <Icon size="S" name={columnIcon} />
      <span class="text">{columnType} column</span>
    </a>
    <span class="period">.</span>
  </div>
  <div class={`line ${supportLevelClass}`}>
    <span class="bullet">•</span>
    <div 
      class={`chip supportChip ${supportLevelClass}`}
      on:mouseenter={() => handleMouseenter("support")}
      on:mouseleave={() => handleMouseleave("support")}
      >
      <Icon size="S" tooltip={supportLevelIconTooltip} name={supportLevelIcon} />
      <span class="text">{supportLevelText}</span>
    </div>
    <span class="space" />
    <span class="text">with</span>
    <span class="space" />
    <a target="_blank" rel="noopener noreferrer" href={"https://docs.budibase.com/docs/chart"} class="chip link topLink">
      <Icon size="S" name={"GraphPie"} />
      <span class="text">Chart components</span>
    </a>
    <span class="period">.</span>
  </div>
  {#if warnings.includes("string number warning")}
    <div class={`line`}>
      <span class="bullet">•</span>
      <span class="text">Any</span>
    <span class="space" />
    <div 
      class="chip info"
      on:mouseenter={() => handleMouseenter("stringsAndNumbers")}
      on:mouseleave={() => handleMouseleave("stringsAndNumbers")}
      >
        <span class="text">
        non-number values
        </span>
      </div>
    <span class="space" />
      <span class="text">
        will be ignored
      </span>
      <span class="period">.</span>
    </div>
  {/if}
  {#if warnings.includes("optional warning")}
    <div class={`line`}>
      <span class="bullet">•</span>
      <span class="text">No</span>
    <span class="space" />
      <div 
        class="chip info"
        on:mouseenter={() => handleMouseenter("required")}
        on:mouseleave={() => handleMouseleave("required")}
        >
          <span class="text">
            required
          </span>
        </div>
    <span class="space" />
      <a target="_blank" rel="noopener noreferrer" href={"https://docs.budibase.com/docs/budibasedb#constraints"} class="chip link topLink">
        <Icon size="S" name={"DataUnavailable"} />
        <span class="text">
          Constraint
        </span></a><span class="comma">,</span>
      <span class="text">
        so values may be missing
      </span>
      <span class="period">.</span>
    </div>
  {/if}
</div>

{#if sidecar}
  <ContextTooltip
    arbitrary="foo"
    visible={sidecarSubject !== null}
    anchor={root}
    offset={20}
  >
  <div class="sidecarContent">
    {#if sidecarSubject === "column"}
    {:else if sidecarSubject === "support"}
        <span class="heading">Data/Component Compatibility</span>
        <div class="divider" />
        <div class="section">
          <div
            class={`chip supportChip supportLevelSupported`}
            >
            <Icon size="S" name={"CheckmarkCircle"} />
            <span class="text">Compatible</span>
          </div>
          <span class="body">Fully compatible with the component as long as the data is present.</span>
        </div>
        <div class="section">
          <div
            class={`chip supportChip supportLevelPartialSupport`}
            >
            <Icon size="S" name={"AlertCheck"} />
            <span class="text">Partially compatible</span>
          </div>
          <span class="body">Potentionally compatible with the component, but beware of other caveats mentioned in the context tooltip.</span>
        </div>
        <div class="section">
          <div
            class={`chip supportChip supportLevelUnsupported`}
            >
            <Icon size="S" name={"Alert"} />
            <span class="text">Not compatible</span>
          </div>
          <span class="body">Imcompatible with the component.</span>
        </div>


    {:else if sidecarSubject === "stringsAndNumbers"}
      <span class="heading">Text as Numbers</span>
      <div class="divider" />
      <div class="section">
        Text can be used in place of numbers in certain scenarios, but care needs to be taken to ensure that non-numerical values aren't also present, otherwise they may be parsed incorrectly and lead to unexpected behavior.
      </div>
    {:else if sidecarSubject === "required"}
      <span class="heading">'Required' Constraint</span>
      <div class="divider" />
      <div class="section">
        <span class="body">A 'required' contraint can be applied to columns to ensure a value is always present. If a column doesn't have this constraint, then rows may be missing values.</span>
      </div>
    {/if}
  </div>
  </ContextTooltip>
{/if}

<style>
  .sidecarContent {
    max-width: 300px;
    padding: 16px 12px 18px;
  }

  .heading {
    font-weight: 600;
  }

  .section {
    margin-bottom: 16px;
  }
  .section:last-child {
    margin-bottom: 16px;
  }

  .section .body {
    display: block;
    margin-top: 5px;
  }

  /* BETWEEN STUFF */
  /* BETWEEN STUFF */
  /* BETWEEN STUFF */

  .tooltipContents {
    max-width: 450px;
    background-color: var(--background-alt);
    display: block;
    padding: 20px 16px;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .chip {
    box-sizing: border-box;
    display: inline-flex;
    padding: 3px 6px;
    border-radius: 5px;
    vertical-align: sub;
    filter: brightness(100%);
  }

  .chip:hover {
    filter: brightness(120%);
    transition: filter 300ms
  }

  .chip :global(svg) {
    color:  var(--grey-6);
  }

  .columnName {
    vertical-align: baseline;
    background-color: var(--grey-3);
    display: block;
    font-style: italic;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
    flex-grow: 0;
    flex-shrink: 1;
    min-width: 0;
  }

  .bullet {
    color: var(--grey-5);
    font-size: 17px;
    display: inline block;
    margin-right: 10px;
  }

  .period {
    color: var(--grey-5);
    font-size: 20px;
    display: inline block;
  }

  .comma {
    color: var(--grey-5);
    font-size: 20px;
    display: inline block;
    margin-right: 4px;
  }

  .semiColon {
    color: var(--grey-5);
    font-size: 16px;
    display: inline block;
  }

  .space {
    margin-right: 5px;
  }

  .divider {
    border-bottom: 1px solid var(--grey-4);
    margin: 12px 0 12px;
  }


  .topLine {
    display: flex;
    align-items: center;
  }

  .topLine .space {
    margin-right: 7px;
    flex-shrink: 0;
  }

  .topLine .text {
    flex-shrink: 0;
  }

  .topLine .period {
    flex-shrink: 0;
  }

  .topLine .bullet {
    flex-shrink: 0;
  }

  .topLink {
    flex-shrink: 0;
    margin-right: 2px;
  }

  .line {
    background-color: var(--background-alt);
    color: var(--ink);
    align-items: center;
    margin-bottom: 10px;
  }

  .line:last-child {
    margin-bottom: 0px;
  }

  .line > .text {
    display: inline;
  }

  .link {
    border-radius: 0;
    background-color: transparent;
    border: 1px solid red;
    border-width: 0 0 1px 0;
    box-sizing: border-box;
    border-color: var(--blue);
    color: white;
    padding-left: 0px;
    padding-right: 0px;
    transition: background-color 200ms;
  }

  .link:hover {
    cursor: pointer;
    background-color: #ffffff0a;
  }

  .info {

    vertical-align: baseline;
    background-color: var(--grey-3);
    color: white;
  }

  .info :global(svg) {
    margin-right: 3px;
  }


  .link :global(svg) {
    margin-right: 3px;
    color: var(--blue);
  }

  .supportChip {
    background-color: var(--grey-3);
    color: var(--ink);
    border: 1px solid red;
    box-sizing: border-box;
  }

  .supportChip :global(svg) {
    margin-right: 5px;
  }

  .supportChip.supportLevelUnsupported {
    border-color: var(--red);
  }

  .supportChip.supportLevelUnsupported :global(svg) {
    color: var(--red);
  }

  .supportChip.supportLevelPartialSupport {
    border-color: var(--yellow);
  }

  .supportChip.supportLevelPartialSupport :global(svg) {
    color: var(--yellow);
  }

  .supportChip.supportLevelSupported {
    border-color: var(--green);
  }

  .supportChip.supportLevelSupported :global(svg) {
    color: var(--green);
  }
</style>
