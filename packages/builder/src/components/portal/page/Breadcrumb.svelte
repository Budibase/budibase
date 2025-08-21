<script lang="ts">
  import { Icon } from "@budibase/bbui"

  export let url: string | undefined = undefined
  export let text: string | undefined = undefined
</script>

<div>
  <a href={url}>
    {text}
  </a>
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
  div :global(i),
  a {
    color: inherit;
    transition: color 130ms ease-out;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  a:hover {
    color: var(--spectrum-global-color-gray-900);
  }
</style>
