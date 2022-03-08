<script>
  import "@spectrum-css/toast/dist/index-vars.css"
  import Portal from "svelte-portal"
  import { banner } from "../Stores/banner"
  import Banner from "./Banner.svelte"
  import { fly } from "svelte/transition"
</script>

<Portal target=".banner-container">
  <div class="banner">
    {#if $banner.message}
      <div transition:fly={{ y: -30 }}>
        <Banner
          type={$banner.type}
          extraButtonText={$banner.extraButtonText}
          extraButtonAction={$banner.extraButtonAction}
          on:change={$banner.onChange}
        >
          {$banner.message}
        </Banner>
      </div>
    {/if}
  </div>
</Portal>

<style>
  .banner {
    pointer-events: none;
    width: 100%;
  }
</style>
