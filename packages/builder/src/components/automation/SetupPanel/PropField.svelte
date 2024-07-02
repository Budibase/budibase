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
    <Label tooltip={labelTooltip}>{label}</Label>
  </div>
  <div class="prop-control">
    <slot />
  </div>
</div>

<style>
  .prop-field {
    display: grid;
    grid-template-columns: 1fr var(--comp-width);
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

  .prop-control {
    margin-left: var(--spacing-s);
  }

  .prop-field.fullWidth .prop-control {
    margin-left: 0px;
  }
</style>
