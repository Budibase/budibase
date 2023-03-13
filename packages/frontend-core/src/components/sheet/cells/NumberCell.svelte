<script>
  import TextCell from "./TextCell.svelte"

  export let api
</script>

<TextCell bind:api {...$$props} type="number" />
