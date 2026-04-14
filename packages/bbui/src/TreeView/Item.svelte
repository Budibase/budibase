<script lang="ts">
  import Icon from "../Icon/Icon.svelte"

  export let selected: boolean = false
  export let open: boolean = false
  export let href: string | null = null
  export let title: string
  export let icon: string | undefined
</script>

<li
  class:is-selected={selected}
  class:is-open={open}
  class="spectrum-TreeView-item"
>
  <div class="spectrum-TreeView-itemRow">
    <a on:click class="spectrum-TreeView-itemLink" {href}>
      {#if $$slots.default}
        <Icon name="caret-right" size="M" />
      {/if}
      {#if icon}
        <Icon name={icon} size="M" />
      {/if}
      <span class="spectrum-TreeView-itemLabel">{title}</span>
    </a>

    {#if $$slots.pre}
      <div class="spectrum-TreeView-itemPre">
        <slot name="pre" />
      </div>
    {/if}

    {#if $$slots.post}
      <div class="spectrum-TreeView-itemPost">
        <slot name="post" />
      </div>
    {/if}
  </div>
  {#if $$slots.default}
    <ul class="spectrum-TreeView">
      <slot />
    </ul>
  {/if}
</li>

<style>
  .spectrum-TreeView-itemRow {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .spectrum-TreeView-itemPre {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 6px;
  }

  .spectrum-TreeView-itemPost {
    padding-right: 8px;
    white-space: nowrap;
  }

  .spectrum-TreeView-itemPost :global(.spectrum-StatusLight) {
    margin: 0;
  }

  .spectrum-TreeView-itemPre :global(.spectrum-Checkbox) {
    margin: 0;
    min-height: 0;
  }
</style>
