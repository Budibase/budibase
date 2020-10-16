<script>
  import { Button } from "@budibase/bbui"
  export let url
  let link
</script>

<a href={url} bind:this={link} />
<Button small translucent on:click={() => link.click()}>View</Button>

<style>
  a {
    display: none;
  }
</style>
