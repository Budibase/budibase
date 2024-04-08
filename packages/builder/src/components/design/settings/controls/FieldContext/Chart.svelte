<script>
  import { Icon, Heading, Multiselect, ContextTooltip } from "@budibase/bbui"
  import { getDatasourceForProvider, getSchemaForDatasource } from "dataBinding"
  import { selectedScreen } from "stores/builder"
  import { createEventDispatcher } from "svelte"
  import Property from './Property.svelte'
  import InfoWord from './InfoWord.svelte'
  import DocumentationLink from './DocumentationLink.svelte'
  import ExplanationModal from './ExplanationModal/index.svelte'

  export let supportLevelClass = ''
  export let supportLevelIconColor = ""
  export let supportLevelIcon = ""
  export let supportLevelIconTooltip = ""
  export let supportLevelText = ""

  export let columnIcon
  export let columnType
  export let columnName
  export let explanationModal = false

  export let errors = []
  export let warnings = []
  export let tableHref = () => {}

  export let schema

  let root = null;

  const getDocLink = (columnType) => {
    if (columnType === "Number") {
      return "https://docs.budibase.com/docs/number"
    }
    if (columnType === "Text") {
      return "https://docs.budibase.com/docs/text"
    }
    if (columnType === "Attachment") {
      return "https://docs.budibase.com/docs/attachments"
    }
    if (columnType === "Multi-select") {
      return "https://docs.budibase.com/docs/multi-select"
    }
    if (columnType === "JSON") {
      return "https://docs.budibase.com/docs/json"
    }
    if (columnType === "Date/Time") {
      return "https://docs.budibase.com/docs/datetime"
    }
    if (columnType === "User") {
      return "https://docs.budibase.com/docs/user"
    }

    return ""
  }

  $: docLink = getDocLink(columnType);

  let explanationModalSubject = null

  const handleMouseenter = (option, idx) => {
    explanationModalSubject = option;
    root = root
  }

  const handleMouseleave = (option) => {
    explanationModalSubject = null;
  }

</script>

<div
  bind:this={root}
  class={`tooltipContents ${supportLevelClass}`}
>

  <div class="line">
    <span class="bullet">•</span>
    <InfoWord
      on:mouseenter={() => handleMouseenter("column")}
      on:mouseleave={() => handleMouseleave("column")}
      href={tableHref}
      text={columnName}
    />
    <span class="space" />
    <span class="text"> is a </span>
    <span class="space" />
    <DocumentationLink
      href={docLink}
      icon={columnIcon}
      text={`${columnType} column`}
    />
    <span class="period">.</span>
  </div>
  <div class={`line ${supportLevelClass}`}>
    <span class="bullet">•</span>
    <InfoWord
      on:mouseenter={() => handleMouseenter("support")}
      on:mouseleave={() => handleMouseleave("support")}
      icon={supportLevelIcon}
      color={supportLevelIconColor}
      text={supportLevelText}
    />
    <span class="space" />
    <span class="text">with</span>
    <span class="space" />
    <DocumentationLink
      href="https://docs.budibase.com/docs/chart"
      icon="GraphPie"
      text="Chart components"
    />
    <span class="period">.</span>
  </div>
  {#if warnings.includes("string number warning")}
    <div class={`line`}>
      <span class="bullet">•</span>
      <span class="text">Any</span>
    <span class="space" />
    <InfoWord
      on:mouseenter={() => handleMouseenter("stringsAndNumbers")}
      on:mouseleave={() => handleMouseleave("stringsAndNumbers")}
      text="non-number-values"
    />
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
    <InfoWord
      on:mouseenter={() => handleMouseenter("required")}
      on:mouseleave={() => handleMouseleave("required")}
      text="required"
    />
    <span class="space" />
    <DocumentationLink
      icon="DataUnavailable"
      href="https://docs.budibase.com/docs/budibasedb#constraints"
      text="Constraint"
    />
      <span class="comma">,</span>
      <span class="text">
        so values may be missing
      </span>
      <span class="period">.</span>
    </div>
  {/if}
</div>

<ExplanationModal
  anchor={root}
  {schema}
  subject={explanationModalSubject}
/>

<style>
  .text {
    flex-shrink: 0;
  }

  .tooltipContents {
    max-width: 450px;
    background-color: var(--background-alt);
    display: block;
    padding: 20px 16px;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .bullet {
    color: var(--grey-6);
    font-size: 17px;
    display: inline block;
    margin-right: 10px;
  }

  .period {
    color: var(--grey-6);
    font-size: 20px;
    display: inline block;
    margin-left: 3px;
  }

  .comma {
    margin-left: 2px;
    color: var(--grey-6);
    font-size: 17px;
    display: inline block;
    margin-right: 5px;
  }

  .semiColon {
    color: var(--grey-5);
    font-size: 16px;
    display: inline block;
  }

  .space {
    margin-right: 5px;
  }

  .line {
    background-color: var(--background-alt);
    color: var(--ink);
    align-items: center;
    display: flex;

    margin-bottom: 10px;
  }

  .line:last-child {
    margin-bottom: 0px;
  }
</style>
