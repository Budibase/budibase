<script>
  import "@spectrum-css/checkbox/dist/index-vars.css"

  export let value
</script>

<label
  class="spectrum-Checkbox spectrum-Checkbox--sizeM spectrum-Checkbox--emphasized"
>
  <input
    type="checkbox"
    class="spectrum-Checkbox-input"
    id="checkbox-1"
    disabled
    checked={!!value}
  />
  <span class="spectrum-Checkbox-box">
    <svg
      class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Checkbox-checkmark"
      focusable="false"
      aria-hidden="true"
    >
      <use xlink:href="#spectrum-css-icon-Checkmark100" />
    </svg>
    <svg
      class="spectrum-Icon spectrum-UIIcon-Dash100 spectrum-Checkbox-partialCheckmark"
      focusable="false"
      aria-hidden="true"
    >
      <use xlink:href="#spectrum-css-icon-Dash100" />
    </svg>
  </span>
</label>

<style>
  .spectrum-Checkbox {
    min-height: 0;
  }
  .spectrum-Checkbox-box {
    margin: 0;
  }
</style>
