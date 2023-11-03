<script>
  import FlatpickrDatePicker from "./FlatpickrDatePicker.svelte"
  import SpectrumDatePicker from "./SpectrumDatePicker.svelte"
</script>

<svelte:component
  this={$$props.range ? FlatpickrDatePicker : SpectrumDatePicker}
  {...$$props}
  on:change
/>
