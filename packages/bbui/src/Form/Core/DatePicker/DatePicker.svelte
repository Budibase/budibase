<script>
  import FlatpickrDatePicker from "./FlatpickrDatePicker.svelte"
  import SpectrumDatePicker from "./SpectrumDatePicker.svelte"

  export let api
</script>

<svelte:component
  this={$$props.range ? FlatpickrDatePicker : SpectrumDatePicker}
  {...$$props}
  on:change
  on:open
  on:close
  bind:api
/>
