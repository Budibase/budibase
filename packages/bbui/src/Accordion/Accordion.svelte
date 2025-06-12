<script lang="ts">
  import "@spectrum-css/accordion"

  export let itemName: string | undefined = undefined
  export let initialOpen: boolean = false
  export let header: string | undefined
  export let headerSize: "S" | "M" | "L" = "S"
  export let bold: boolean = true
  export let noPadding: boolean = false

  let isOpen = initialOpen

  export function open() {
    isOpen = true
  }

  export function close() {
    isOpen = false
  }

  function headerSizeClass(size: "S" | "M" | "L") {
    return size === "S"
      ? "spectrum-Accordion-itemHeaderS"
      : size === "M"
        ? "spectrum-Accordion-itemHeaderM"
        : "spectrum-Accordion-itemHeaderL"
  }
</script>

<div class="spectrum-Accordion" role={itemName}>
  <div class="spectrum-Accordion-item" class:is-open={isOpen}>
    <h3
      class="spectrum-Accordion-itemHeading"
      style={noPadding ? "margin-bottom: -10px;" : ""}
    >
      <button
        class={`spectrum-Accordion-itemHeader ${headerSizeClass(headerSize)}`}
        type="button"
        style="--font-weight: {bold ? 'bold' : 'normal'}"
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
    <div
      class="spectrum-Accordion-itemContent"
      role={itemName}
      style={noPadding
        ? "padding-left: 20px; padding-bottom: 0;"
        : "padding-left: 30px;"}
    >
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
  }
  .spectrum-Accordion-itemHeader {
    text-transform: none;
    font-weight: var(--font-weight);
    min-height: auto;
  }
  .spectrum-Accordion-itemHeaderS {
    font-size: 0.875rem;
  }
  .spectrum-Accordion-itemHeaderM {
    font-size: 1.2rem;
    font-weight: 500;
  }
  .spectrum-Accordion-itemHeaderL {
    font-size: 1.5rem;
  }
</style>
