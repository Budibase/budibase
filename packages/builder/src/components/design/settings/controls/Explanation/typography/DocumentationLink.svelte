<script>
  import { Icon } from "@budibase/bbui"

  export let icon
  export let text
  export let href
  export let disabled = false
</script>

<a
  class:disabled
  tabindex="0"
  {href}
  rel="noopener noreferrer"
  target="_blank"
  class="link"
>
  <Icon size="XS" name={icon} />
  <span class="text">
    <slot>
      {text}
    </slot>
  </span>
</a>

<style>
  .text {
    color: var(--ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .link {
    display: inline-flex;
    box-sizing: border-box;
    padding: 1px 0 2px;
    filter: brightness(100%);
    align-items: center;

    overflow: hidden;
    flex-shrink: 0;
    border-radius: 0;
    border-bottom: 1px solid var(--blue);
    transition: filter 300ms;
    margin-right: 0px;
  }

  .link:hover {
    filter: brightness(120%);
  }

  .disabled {
    filter: brightness(100%);
    border-bottom: 1px solid var(--grey-6);
  }

  .link :global(svg) {
    margin-right: 3px;
    color: var(--blue);
  }

  .disabled :global(svg) {
    color: var(--grey-6);
  }
</style>
