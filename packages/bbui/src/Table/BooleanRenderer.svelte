<script lang="ts">
  import "@spectrum-css/checkbox/dist/index-vars.css"
  import Icon from "../Icon/Icon.svelte"

  export let value: boolean
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
    <Icon name="check" size="S" />
    <Icon name="minus" size="S" />
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
