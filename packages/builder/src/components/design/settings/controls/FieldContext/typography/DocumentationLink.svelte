<script>
  import { Icon } from "@budibase/bbui"

  export let icon
  export let text
  export let href
</script>

<a
  tabindex="0"
  {href}
  rel="noopener noreferrer"
  target="_blank"
  class="link"
>
  <Icon size="S" name={icon} />
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
    padding: 1px 0;
    filter: brightness(100%);

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

  .link :global(svg) {
    margin-right: 3px;
    color: var(--blue);
  }
</style>
