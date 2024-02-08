<script>
  import FieldConfiguration from "./FieldConfiguration.svelte"
</script>

<FieldConfiguration {...$$props} on:change customSchema />
