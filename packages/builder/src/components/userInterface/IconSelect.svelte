<script>
  import { DropdownMenu, Button } from "@budibase/bbui"
  import { onMount } from "svelte"

  // import options from "standard-components/IconNew/icons.js"

  let buttonAnchor, dropdown

  onMount(() => {})

  function open() {}
</script>

<div bind:this={buttonAnchor}>
  <button on:click={() => alert`eyeooooo`}>Show</button>
</div>
<DropdownMenu bind:this={dropdown} anchor={buttonAnchor}>
  <div class="container">
    <h1>Hii there</h1>
  </div>
</DropdownMenu>

<style>
  .container {
    width: 500px;
    height: 350px;
    border: 2px solid red;
  }
</style>
