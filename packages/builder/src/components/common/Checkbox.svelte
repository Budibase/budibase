<script>
  export let checked = false
  export let label = ""
</script>

{label}
<input class="uk-checkbox" type="checkbox" bind:checked on:change />

<style>
  input {
    margin-right: 7px;
  }
</style>
