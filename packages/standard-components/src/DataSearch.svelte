<script>
  export let _bb
  export let model

  let searchValue = ""

  function search() {
    const SEARCH_URL = 
    _bb.api.get(``);
  }

</script>

<div>
  <input type="text" bind:value={searchValue}>
  <button on:click={search}>Search</button>
</div>
