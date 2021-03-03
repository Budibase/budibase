<script>
  import { Label, DropdownMenu } from "@budibase/bbui"
  import ThemeEditor from "./ThemeEditor.svelte"

  let anchor
  let popover
</script>

<div class="topnavitemright" on:click={popover.show} bind:this={anchor}>
  <i class="ri-paint-fill" />
</div>
<div class="dropdown">
  <DropdownMenu bind:this={popover} {anchor} align="right">
    <div class="content">
      <Label extraSmall grey>Theme</Label>
      <ThemeEditor />
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
  }
</style>
