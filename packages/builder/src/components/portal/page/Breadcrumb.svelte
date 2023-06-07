<script>
  import { Icon } from "@budibase/bbui"

  export let url
  export let text
</script>

<div>
  <a href={url}>
    {text}
  </a>
  <Icon name="ChevronRight" />
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
  div :global(.spectrum-Icon),
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
