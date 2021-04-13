<script>
  import "@spectrum-css/checkbox/dist/index-vars.css"
  import "@spectrum-css/actionbutton/dist/index-vars.css"

  export let selected
  export let onToggleSelection
  export let onEdit
  export let allowSelectRows = false
  export let allowEditRows = false
</script>

{#if allowSelectRows}
  <label
    class="spectrum-Checkbox spectrum-Checkbox--sizeM spectrum-Checkbox--emphasized">
    <input
      type="checkbox"
      class="spectrum-Checkbox-input"
      id="checkbox-1"
      bind:checked={selected} />
    <span class="spectrum-Checkbox-box">
      <svg
        class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Checkbox-checkmark"
        focusable="false"
        aria-hidden="true">
        <use xlink:href="#spectrum-css-icon-Checkmark100" />
      </svg>
      <svg
        class="spectrum-Icon spectrum-UIIcon-Dash100 spectrum-Checkbox-partialCheckmark"
        focusable="false"
        aria-hidden="true">
        <use xlink:href="#spectrum-css-icon-Dash100" />
      </svg>
    </span>
  </label>
{/if}
{#if allowEditRows}
  <button
    class="spectrum-ActionButton spectrum-ActionButton--sizeS"
    on:click={onEdit}>
    <span class="spectrum-ActionButton-label">Edit</span>
  </button>
{/if}

<style>
  label {
    margin-right: 5px;
  }
</style>
