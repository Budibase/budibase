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

  export let errors = []
  export let warnings = []

  const getDocLink = (columnType) => {
    if (columnType === "number") {
      return "https://docs.budibase.com/docs/number"
    }
    if (columnType === "string") {
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

</script>

<div
  class={`tooltipContents ${supportLevelClass}`}
>

  <div class="topLine">
    <div class="chip columnName">
      {columnName}
    </div>
    <span class="text"> is a </span>
    <a target=”_blank” href={docLink} class="chip link topLink">
      <Icon size="S" name={columnIcon} />
      <span class="text">{columnType} column</span>
    </a>
    <span class="period">.</span>
  </div>
  <div class="divider"></div>
  <div class={`line ${supportLevelClass}`}>
    <span class="bullet">•</span>
    <div class={`chip supportChip ${supportLevelClass}`}>
      <Icon size="S" tooltip={supportLevelIconTooltip} name={supportLevelIcon} />
      <span class="text">{supportLevelText}</span>
    </div>
    <span class="text">with</span>
    <div class="chip link">
      <Icon size="S" name={"GraphPie"} />
      <span class="text">Chart components</span>
    </div>
  </div>
  {#if warnings.includes("string number warning")}
    <div class={`line`}>
      <span class="bullet">•</span>
      <div class="chip link">
        <Icon size="S" name={"123"} />
        <span class="text">
        Non-numeric values 
        </span>
      </div>
      <span class="text">
        will not be displayed
      </span>
    </div>
  {/if}
  {#if warnings.includes("optional warning")}
    <div class={`line`}>
      <span class="bullet">•</span>
      <span class="text">No</span>
      <div class="chip link">
        <Icon size="S" name={"DataUnavailable"} />
        <span class="text">
          Required constraint
        </span>
      </div>
      <span class="text">
        so rows may be missing values
      </span>
    </div>
  {/if}

  <!--
  {#if errors.length > 0}
    {#each errors as datum}
      <p>{datum}</p>
    {/each}
  {:else if warnings.length > 0}
    {#each warnings as datum}
      <p>{datum}</p>
    {/each}
  {:else}
      <p>{supportLevelIconTooltip}</p>
  {/if}
  -->
</div>

<style>
  .chip {
    display: inline-flex;
    padding: 3px 6px;
    border-radius: 5px;
    vertical-align: sub;
    margin-right: 5px;
    filter: brightness(90%);
  }

  .chip:hover {
    filter: brightness(110%);
    transition: filter 300ms
  }

  .columnName {
    font-style: italic;
    background-color: var(--grey-3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
    display: block;
    min-width: 0;
    margin-right: 0;
  }

  .bullet {
    color: var(--grey-5);
    font-size: 17px;
    display: inline block;
    margin-right: 10px;
  }

  .topLink {
    flex-shrink: 0;
  }

  .divider {
    border-bottom: 1px solid var(--grey-4);
    margin: 12px 0 12px;
  }

  .tooltipContents {
    max-width: 400px;
    background-color: var(--background-alt);
    display: block;
    padding: 12px;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .topLine {
    display: flex;
    align-items: center;
  }

  .topLine > .text{
    flex-shrink: 0;
    margin: 0 5px;
  }

  .line {
    background-color: var(--background-alt);
    color: var(--ink);
    align-items: center;
    margin-bottom: 12px;
  }

  .line:last-child {
    margin-bottom: 0px;
  }

  .line > .text {
    display: inline;
    margin-right: 5px;
  }

  .link {
    background-color: var(--bb-indigo);
    color: white;
  }

  .link:hover {
    cursor: pointer;
  }

  .link :global(svg) {
    margin-right: 3px;
  }

  .supportChip {
    color: black;
  }

  .supportChip :global(svg) {
    margin-right: 5px;
  }

  .supportChip.supportLevelUnsupported {
    background-color: var(--red);
  }

  .supportChip.supportLevelPartialSupport {
    background-color: var(--yellow);
  }

  .supportChip.supportLevelSupported {
    background-color: var(--green);
  }
</style>
