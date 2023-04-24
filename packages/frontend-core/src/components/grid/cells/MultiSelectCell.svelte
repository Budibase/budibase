<script>
  import OptionsCell from "./OptionsCell.svelte"

  export let api
</script>

<OptionsCell bind:api {...$$props} multi />
