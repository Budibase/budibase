<script>
  import { themeStore } from "builderStore"
  import { Label, Toggle, Button, Slider } from "@budibase/bbui"

  let showAdvanced = false
</script>

<div class="content">
  <div>
    <Toggle thin text="Dark theme" bind:checked={$themeStore.darkMode} />
  </div>
  {#if $themeStore.darkMode && !showAdvanced}
    <div class="button">
      <Button text on:click={() => (showAdvanced = true)}>Customise</Button>
    </div>
  {/if}
  {#if $themeStore.darkMode && showAdvanced}
    <Slider
        label="Hue"
        bind:value={$themeStore.hue}
        min="0"
        max="360"
        showValue />
    <Slider
        label="Saturation"
        bind:value={$themeStore.saturation}
        min="0"
        max="100"
        showValue />
    <Slider
        label="Lightness"
        bind:value={$themeStore.lightness}
        min="0"
        max="32"
        showValue />
    <div class="button">
      <Button text on:click={themeStore.reset}>Reset</Button>
    </div>
  {/if}
</div>

<style>
  .content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
  }

  .button {
    align-self: flex-start;
  }
</style>