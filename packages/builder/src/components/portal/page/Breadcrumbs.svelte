<div>
  <slot />
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
  }

  div :global(> *:last-child .spectrum-Icon) {
    display: none;
  }
  div :global(> *:last-child) {
    color: var(--spectrum-global-color-gray-900);
    flex: 1 1 auto;
    width: 0;
  }
</style>
