<script>
  import {
    ActionButton,
    SideNavigation,
    SideNavigationItem as Item,
  } from "@budibase/bbui"
  export let links
</script>

<div class="overlay">
  <SideNavigation>
    {#each links as { text, url }}
      <!-- Needs logic to select current route -->
      <Item selected={false} href={url} on:click>{text}</Item>
    {/each}
  </SideNavigation>
  <div class="close">
    <ActionButton quiet icon="Close" on:click />
  </div>
</div>

<style>
  .overlay {
    background: white;
    position: absolute;
    inset: 0;
  }
  .close {
    position: absolute;
    top: var(--spacing-m);
    right: var(--spacing-m);
  }
</style>
