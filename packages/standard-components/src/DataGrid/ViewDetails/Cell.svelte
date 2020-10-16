<script>
  import { createEventDispatcher } from "svelte"
  import { Icon, Button } from "@budibase/bbui"
  const dispatch = createEventDispatcher()

  export let url
  let link
</script>

<a href={url} bind:this={link} />
<Button small secondary on:click={() => link.click()}>View</Button>

<style>
  a {
    display: none;
  }
</style>
