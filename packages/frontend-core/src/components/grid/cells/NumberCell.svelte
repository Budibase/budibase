<script>
  import TextCell from "./TextCell.svelte"

  export let api
</script>

<TextCell {...$$props} bind:api type="number" />
