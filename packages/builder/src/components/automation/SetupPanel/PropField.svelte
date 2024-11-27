<script>
  import { Label } from "@budibase/bbui"

  export let label
  export let labelTooltip
  export let fullWidth = false
  export let componentWidth = 320
</script>

<div
  class="prop-field"
  class:fullWidth
  style={`--comp-width: ${componentWidth}px;`}
>
  <div class="prop-label" title={label}>
    <Label size="L" tooltip={labelTooltip}>{label}</Label>
  </div>
  <div>
    <slot />
  </div>
</div>

<style>
  .prop-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .prop-field.fullWidth {
    grid-template-columns: 1fr;
  }

  .prop-field.fullWidth .prop-label {
    margin-bottom: var(--spacing-s);
  }

  .prop-label {
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .prop-label :global(> div) {
    width: 100%;
  }

  .prop-label :global(> div > label) {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
