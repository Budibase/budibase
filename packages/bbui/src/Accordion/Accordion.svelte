<script>
  import "@spectrum-css/accordion"
  import Icon from "../Icon/Icon.svelte"

  export let itemName
  export let initialOpen
  export let header
  export let bold = true

  let isOpen = initialOpen

  function getOpenClass(isOpen) {
    return isOpen ? "is-open" : ""
  }
</script>

<div class="spectrum-Accordion" role={itemName}>
  <div class="spectrum-Accordion-item {getOpenClass(isOpen)}">
    <h3 class="spectrum-Accordion-itemHeading">
      <button
        class="spectrum-Accordion-itemHeader"
        type="button"
        style="--font-weight: {bold ? 'bold' : 'normal'}"
        on:click={() => (isOpen = !isOpen)}
      >
        {header}
      </button>
      <Icon
        name="caret-right"
        size="S"
      />
    </h3>
    <div class="spectrum-Accordion-itemContent" role={itemName}>
      <slot />
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
    font-weight: var(--font-weight);
    font-size: 0.875rem;
    min-height: auto;
  }
</style>
