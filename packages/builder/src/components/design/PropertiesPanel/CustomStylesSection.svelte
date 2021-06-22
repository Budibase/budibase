<script>
  import { TextArea, DetailSummary } from "@budibase/bbui"
  import { store } from "builderStore"

  export let componentInstance
  export let openSection

  function onChange(css) {
    store.actions.components.updateCustomStyle(css)
  }
</script>

<DetailSummary
  name={`Custom Styles${componentInstance?._styles?.custom ? " *" : ""}`}
  on:open
  show={openSection === "custom"}
>
  <div class="custom-styles">
    <TextArea
      value={componentInstance?._styles?.custom}
      on:change={event => onChange(event.detail)}
      placeholder="Enter some CSS..."
    />
  </div>
</DetailSummary>

<style>
  .custom-styles :global(textarea) {
    font-family: monospace;
    min-height: 120px;
    font-size: var(--font-size-xs);
  }
</style>
