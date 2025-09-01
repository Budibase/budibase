<script lang="ts">
  import type { BannerType } from "@/constants/banners"
  import { bannerStore } from "@/stores/portal"
  import { Icon } from "@budibase/bbui"
  import { slide } from "svelte/transition"

  export let title: string
  export let linkTitle: string | undefined = undefined
  export let linkHref: string = "#"
  export let image: string
  export let color: string
  export let key: BannerType

  const closeBanner = () => {
    bannerStore.closeBanner(key)
  }

  $: displayBanner = bannerStore.shouldDisplayBanner(key)
</script>

{#if $displayBanner}
  <div class="hero-wrapper" transition:slide={{ duration: 300 }}>
    <div class="hero" style="--color:{color};">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="close-button" on:click={closeBanner}>
        <Icon name="x" size="S" />
      </div>

      <div class="text">
        <h1>{title}</h1>
        <p><slot /></p>
        {#if linkTitle}
          <a href={linkHref} class="button" target="_blank">
            <Icon name="book-open-text" size="L" weight="bold" color="white"
            ></Icon>
            {linkTitle}
          </a>
        {/if}
      </div>
      <img src={image} alt="hero" />
    </div>
  </div>
{/if}

<style>
  .hero-wrapper {
    margin: 12px 12px 0 12px;
    border-radius: 22px;
    border: 1px dashed var(--spectrum-global-color-gray-300);
    padding: 4px;
    background-color: var(--spectrum-global-color-gray-200);
  }
  .hero {
    background: var(--color);
    border-radius: 20px;
    padding: 0px 0px 0px 48px;
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
    position: relative;
  }
  .text {
    display: flex;
    flex-direction: column;
    gap: 32px;
    max-width: 520px;
    min-width: 260px;
    margin-right: 48px;
  }
  h1 {
    font-size: 28px;
    line-height: 1.1;
    margin: 0;
    font-weight: 600;
    color: white;
    font-family: Inter;
  }
  p {
    margin: 0;
    font-size: 16px;
    color: white;
    line-height: 1.35;
    font-family: Inter;
  }
  a {
    font-size: 16px;
    color: white;
    font-family: Inter;
  }
  img {
    border-radius: 0 20px 20px 0;
    max-height: 400px;
    min-height: 240px;
    background-position: cover;
  }
  .button {
    background-color: rgba(250, 250, 250, 0.1);
    border: none;
    padding: 8px 14px;
    border-radius: 20px;
    font-size: 16px;
    color: white;
    font-weight: 500;
    font-family: Inter;
    display: inline-flex;
    width: fit-content;
    gap: 6px;
    align-items: center;
    transition: 100ms background-color ease-in;
  }
  .button:hover {
    background-color: rgba(250, 250, 250, 0.2);
  }
  .close-button {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: rgba(255, 255, 255);
    opacity: 0.5;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
  }
  .close-button:hover {
    opacity: 0.75;
  }
</style>
