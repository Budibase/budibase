<script>
  import { themeStore } from "builderStore"
  import { Label, DropdownMenu, Toggle, Button } from "@budibase/bbui"

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
        <div>
          <Label extraSmall grey>Hue</Label>
          <input type="range" bind:value={$themeStore.hue} min="0" max="360" />
        </div>
        <div>
          <Label extraSmall grey>Saturation</Label>
          <input
            type="range"
            bind:value={$themeStore.saturation}
            min="0"
            max="100" />
        </div>
        <div>
          <Label extraSmall grey>Lightness</Label>
          <input
            type="range"
            bind:value={$themeStore.lightness}
            min="0"
            max="32" />
        </div>
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

  input[type="range"] {
    width: 100%;
    margin: 0;
    background-color: transparent;
    -webkit-appearance: none;
  }
  input[type="range"]:focus {
    outline: none;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    background: var(--grey-4);
    border-radius: 9px;
    width: 100%;
    height: 18px;
    cursor: pointer;
    padding: 0 2px;
  }
  input[type="range"]::-webkit-slider-thumb {
    width: 14px;
    height: 14px;
    background: white;
    border-radius: 100%;
    cursor: pointer;
    -webkit-appearance: none;
    border: none;
    margin-top: 2px;
  }
  input[type="range"]::-moz-range-track {
    background: var(--grey-4);
    border-radius: 9px;
    width: 100%;
    height: 18px;
    cursor: pointer;
    padding: 0 2px;
  }
  input[type="range"]::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background: white;
    border-radius: 100%;
    cursor: pointer;
    border: none;
  }
</style>
