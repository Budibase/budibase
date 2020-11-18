<script>
  import { Button } from "@budibase/bbui"

  export let url
  export let SDK

  const { linkable } = SDK

  let link
</script>

<a href={url} bind:this={link} use:linkable />
<Button small translucent on:click={() => link.click()}>View</Button>

<style>
  a {
    display: none;
  }
</style>
