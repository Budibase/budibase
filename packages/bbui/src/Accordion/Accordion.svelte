<script>
  import "@spectrum-css/accordion"
  import Layout from "../Layout/Layout.svelte"
  import Input from "../Form/Input.svelte"
  import Label from "../Label/Label.svelte"

  export let configKey
  export let openAccordionItems
  export let displayNameFn
  export let fieldGroupKeys
  export let schema
  export let config
</script>

<div class="spectrum-Accordion" role={configKey}>
  <div class="spectrum-Accordion-item {openAccordionItems[configKey]}">
    <h3 class="spectrum-Accordion-itemHeading">
      <button
        class="spectrum-Accordion-itemHeader"
        type="button"
        on:click={() =>
          (openAccordionItems[configKey] =
            openAccordionItems[configKey] !== "is-open" ? "is-open" : "")}
      >
        {displayNameFn(configKey)}
      </button>
      <svg
        class="spectrum-Icon spectrum-UIIcon-ChevronRight100 spectrum-Accordion-itemIndicator"
        focusable="false"
        aria-hidden="true"
      >
        <use xlink:href="#spectrum-css-icon-Chevron100" />
      </svg>
    </h3>
    <div class="spectrum-Accordion-itemContent" role={configKey}>
      <Layout gap="S">
        {#each fieldGroupKeys as fieldKey}
          <div class="form-row">
            <Label>{displayNameFn(configKey, fieldKey)}</Label>
            <Input
              type={schema[configKey]["fields"][fieldKey]?.type}
              on:change
              bind:value={config[fieldKey]}
            />
          </div>
        {/each}
      </Layout>
    </div>
  </div>
</div>

<style>
  .spectrum-Accordion {
    margin-left: -20px;
  }
  .spectrum-Accordion-item {
    border: none;
  }
  .spectrum-Accordion-itemContent {
    width: 97%;
    padding-left: 30px;
  }
  .spectrum-Accordion-itemHeader {
    text-transform: none;
    font-weight: bold;
    font-size: 0.875rem;
  }
</style>
