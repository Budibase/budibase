<script>
  import { Icon, Body } from "@budibase/bbui"
</script>

<a target="_blank" href="https://github.com/Budibase/budibase/discussions">
  <div class="inner hoverable">
    <div class="hidden hoverable">
      <Body size="S">Need help? Go to our forums</Body>
    </div>
    <Icon name="Help" size="XXL" />
  </div>
</a>

<style>
  .inner {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .inner :global(*) {
    pointer-events: all;
    transition: color var(--spectrum-global-animation-duration-100, 130ms);
  }
  .inner:hover :global(*) {
    color: var(--spectrum-alias-icon-color-selected-hover);
    cursor: pointer;
  }
  a {
    color: inherit;
    position: absolute;
    bottom: var(--spacing-m);
    right: var(--spacing-m);
    border-radius: 55%;
  }
  .hidden {
    display: none;
  }
  .inner:hover .hidden {
    display: block;
  }
</style>
