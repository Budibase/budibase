<script>
  import SplitPage from "./SplitPage.svelte"
  import Testimonial from "./Testimonial.svelte"

  export let enabled = true
</script>

<SplitPage>
  <slot />
  <div class:wrapper={enabled} slot="right">
    {#if enabled}
      <Testimonial />
    {/if}
  </div>
</SplitPage>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }
</style>
