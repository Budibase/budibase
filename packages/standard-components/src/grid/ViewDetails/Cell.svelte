<script>
  import { linkable } from "@budibase/component-sdk"
  import { Button } from "@budibase/bbui"

  export let url
  let link
</script>

<a href={url} bind:this={link} use:linkable />
<Button small translucent on:click={() => link.click()}>View</Button>

<style>
  a {
    display: none;
  }
</style>
