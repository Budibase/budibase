<script lang="ts">
  import "@spectrum-css/accordion"
  import Icon from "../Icon/Icon.svelte"

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
        <Icon name={isOpen ? "caret-down" : "caret-right"} size="S" />
        {header}
      </button>
    </h3>
    <div
      class="spectrum-Accordion-itemContent"
      role={itemName}
      style={noPadding
        ? "padding-left: 0; padding-bottom: 0;"
        : "padding-left: 30px;"}
    >
      <slot />
    </div>
  </div>
</div>

<style>
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
    display: flex;
    gap: var(--spacing-m);
    padding-left: 0;
  }
  .spectrum-Accordion-itemHeader:hover {
    background-color: transparent;
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
