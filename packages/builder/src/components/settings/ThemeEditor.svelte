<script>
  import { themeStore } from "builderStore"
  import { Label, DropdownMenu, Toggle, Button, Slider } from "@budibase/bbui"

  let anchor
  let popover
  let showAdvanced = false
</script>

<div class="topnavitemright" on:click={popover.show} bind:this={anchor}>
  <i class="ri-paint-fill" />
</div>
<div class="dropdown">
  <DropdownMenu bind:this={popover} {anchor} align="right">
    <div class="content">
      <div>
        <Label extraSmall grey>Theme</Label>
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
  </DropdownMenu>
</div>

<style>
  .dropdown {
    z-index: 2;
  }

  i {
    font-size: 18px;
    color: var(--grey-7);
  }
  .topnavitemright {
    cursor: pointer;
    color: var(--grey-7);
    margin: 0 12px 0 0;
    font-weight: 500;
    font-size: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 24px;
    width: 24px;
  }
  .topnavitemright:hover i {
    color: var(--ink);
  }

  .content {
    padding: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
  }

  h5 {
    margin: 0;
    font-weight: 500;
  }

  .button {
    align-self: flex-start;
  }
</style>
