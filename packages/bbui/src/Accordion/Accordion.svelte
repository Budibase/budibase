<script>
  import "@spectrum-css/accordion"

  export let itemName
  export let initialOpen
  export let header

  let isOpen

  function getOpenClass(isOpen) {
    if (isOpen === undefined) {
      isOpen = initialOpen
    }
    return isOpen ? "is-open" : ""
  }
</script>

<div class="spectrum-Accordion" role={itemName}>
  <div class="spectrum-Accordion-item {getOpenClass(isOpen)}">
    <h3 class="spectrum-Accordion-itemHeading">
      <button
        class="spectrum-Accordion-itemHeader"
        type="button"
        on:click={() => (isOpen = !isOpen)}
      >
        {header}
      </button>
      <svg
        class="spectrum-Icon spectrum-UIIcon-ChevronRight100 spectrum-Accordion-itemIndicator"
        focusable="false"
        aria-hidden="true"
      >
        <use xlink:href="#spectrum-css-icon-Chevron100" />
      </svg>
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
    font-weight: bold;
    font-size: 0.875rem;
  }
</style>
