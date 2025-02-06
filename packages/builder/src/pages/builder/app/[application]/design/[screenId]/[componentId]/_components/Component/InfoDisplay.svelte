<script>
  import { Icon } from "@budibase/bbui"

  export let title
  export let body
  export let icon = "HelpOutline"
  export let quiet = false
  export let warning = false
  export let error = false
</script>

<div class="info" class:noTitle={!title} class:warning class:error class:quiet>
  {#if title}
    <div class="title">
      <Icon name={icon} />
      {title || ""}
    </div>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html body}
  {:else}
    <span class="icon">
      <Icon size="S" name={icon} />
    </span>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html body}
  {/if}
</div>

<style>
  .info {
    padding: var(--spacing-m) var(--spacing-l);
    background-color: var(--spectrum-global-color-gray-200);
    border-radius: var(--border-radius-s);
    font-size: 13px;
  }
  .warning {
    background: rgba(255, 200, 0, 0.2);
  }
  .error {
    background: rgba(255, 0, 0, 0.2);
  }
  .noTitle {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }
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
    color: var(--spectrum-global-color-gray-700);
  }
  .quiet {
    background: none;
    color: var(--spectrum-global-color-gray-700);
    padding: 0;
  }
  .noTitle {
    display: flex;
    align-items: center;
    gap: var(--spacing-l);
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
