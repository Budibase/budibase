<script>
  import { Label, DropdownMenu, Toggle, Button } from "@budibase/bbui"

  let anchor
  let popover
  let dark = false
  let hue = 208
  let saturation = 9
  let lightness = 16
  let showAdvanced = false

  function setCSSVariable(prop, value) {
    document.documentElement.style.setProperty(prop, value)
  }

  function reset() {
    hue = 208
    saturation = 9
    lightness = 16
  }

  $: document.documentElement.classList[dark ? "add" : "remove"]("dark")
  $: setCSSVariable("--theme-hue", Math.round(hue))
  $: setCSSVariable("--theme-saturation", `${Math.round(saturation)}%`)
  $: setCSSVariable("--theme-brightness", `${Math.round(lightness)}%`)
</script>

<div class="topnavitemright" on:click={popover.show} bind:this={anchor}>
  <i class="ri-paint-fill" />
</div>
<div class="dropdown">
  <DropdownMenu bind:this={popover} {anchor} align="right">
    <div class="content">
      <div>
        <Label extraSmall grey>Theme</Label>
        <Toggle thin text="Dark theme" bind:checked={dark} />
      </div>
      {#if dark && !showAdvanced}
        <div class="button">
          <Button text on:click={() => (showAdvanced = true)}>Customise</Button>
        </div>
      {/if}
      {#if dark && showAdvanced}
        <div>
          <Label extraSmall grey>Hue</Label>
          <input type="range" bind:value={hue} min="0" max="360" />
        </div>
        <div>
          <Label extraSmall grey>Saturation</Label>
          <input type="range" bind:value={saturation} min="0" max="100" />
        </div>
        <div>
          <Label extraSmall grey>Lightness</Label>
          <input type="range" bind:value={lightness} min="0" max="32" />
        </div>
        <div class="button">
          <Button text on:click={reset}>Reset</Button>
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
