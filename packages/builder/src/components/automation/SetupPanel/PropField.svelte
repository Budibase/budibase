<script>
  import { Label } from "@budibase/bbui"

  export let label
  export let fullWidth = false
</script>

<div class="prop-field" class:fullWidth>
  <div class="prop-label">
    <Label>{label}</Label>
  </div>
  <div class="prop-control">
    <slot />
  </div>
</div>

<style>
  .prop-field {
    display: grid;
    grid-template-columns: 1fr 320px;
  }

  .prop-field.fullWidth {
    grid-template-columns: 1fr;
  }

  .prop-label {
    display: flex;
    align-items: center;
  }
</style>
