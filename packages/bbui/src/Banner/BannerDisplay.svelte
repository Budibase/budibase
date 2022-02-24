<script>
  import "@spectrum-css/toast/dist/index-vars.css"
  import Portal from "svelte-portal"
  import { banner } from "../Stores/banner"
  import Banner from "./Banner.svelte"
  import { fly } from "svelte/transition"
</script>

<Portal target=".modal-container">
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
    position: fixed;
    top: 20px;
    left: 0;
    right: 0;
    margin: 0 auto;
    padding: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    pointer-events: none;
    gap: 10px;
  }
</style>
