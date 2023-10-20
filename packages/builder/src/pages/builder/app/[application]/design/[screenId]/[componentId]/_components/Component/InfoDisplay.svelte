<script>
  import { Icon } from "@budibase/bbui"

  export let title
  export let body
  export let icon = "HelpOutline"
</script>

<div class="info" class:noTitle={!title}>
  {#if title}
    <div class="title">
      <Icon name={icon} />
      {title || ""}
    </div>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html body}
  {:else}
    <span class="icon">
      <Icon name={icon} />
    </span>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html body}
  {/if}
</div>

<style>
  .title {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: var(--spacing-m);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-s);
  }
  .title,
  .icon {
    color: var(--spectrum-global-color-gray-600);
  }
  .info {
    padding: var(--spacing-m) var(--spacing-l) var(--spacing-l) var(--spacing-l);
    background-color: var(--background-alt);
    border-radius: var(--border-radius-s);
    font-size: 13px;
  }
  .noTitle {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }
  .info :global(a) {
    color: inherit;
    transition: color 130ms ease-out;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .info :global(a:hover) {
    color: var(--spectrum-global-color-gray-900);
  }
  .info :global(a) {
    text-decoration: underline;
  }
</style>
