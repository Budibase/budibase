<script>
  import { Icon, Detail } from "@budibase/bbui"

  export let title = ""
  export let actionIcon
  export let action

  $: actionDefined = typeof action === "function"
</script>

<div class="dash-card">
  <div class="dash-card-header" class:active={actionDefined} on:click={action}>
    <span class="dash-card-title">
      <Detail size="M">{title}</Detail>
    </span>
    <span class="dash-card-action">
      {#if actionDefined}
        <Icon name={actionIcon || "ChevronRight"} />
      {/if}
    </span>
  </div>
  <div class="dash-card-body">
    <slot />
  </div>
</div>

<style>
  .dash-card {
    background: var(--spectrum-alias-background-color-primary);
    border-radius: var(--border-radius-s);
    min-height: 170px;
  }
  .dash-card-header {
    padding: var(--spacing-xl) var(--spectrum-global-dimension-static-size-400);
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
    display: flex;
    justify-content: space-between;
    transition: background-color 130ms ease-out;
  }
  .dash-card-body {
    padding: var(--spacing-xl) calc(var(--spacing-xl) * 2);
  }
  .dash-card-title :global(.spectrum-Detail) {
    color: var(
      --spectrum-sidenav-heading-text-color,
      var(--spectrum-global-color-gray-700)
    );
    display: inline-block;
  }
  .dash-card-header.active:hover {
    background-color: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }
</style>
