<script lang="ts">
  import { Icon } from "@budibase/bbui"

  export let url: string | undefined = undefined
  export let text: string | undefined = undefined
  export let onClick: Function | undefined = undefined
</script>

<div class="crumb">
  {#if typeof onClick !== "function"}
    <a href={url}>
      {text}
    </a>
  {:else}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span on:click={e => onClick(e)}>
      {text}
    </span>
  {/if}
  <Icon name="caret-right" />
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    color: var(--spectrum-global-color-gray-700);
    gap: var(--spacing-m);
    font-size: 16px;
    font-weight: 600;
  }
  .crumb > span,
  div :global(i),
  a {
    color: inherit;
    transition: color 130ms ease-out;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .crumb > span:hover,
  a:hover {
    color: var(--spectrum-global-color-gray-900);
  }

  .crumb > span:hover {
    cursor: pointer;
  }
</style>
