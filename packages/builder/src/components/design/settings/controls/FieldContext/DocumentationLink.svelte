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
  class="chip link"
>
  <Icon size="S" name={icon} />
  <span class="text">
    <slot>
      {text}
    </slot>
  </span>
</a>

<style>
  .chip {
    display: inline-flex;
    box-sizing: border-box;
    padding: 3px 6px;
    border-radius: 5px;
    vertical-align: sub;
    filter: brightness(100%);
    background-color: var(--grey-3);
    border: 1px solid var(--grey-3);
    overflow: hidden;
    flex-shrink: 0;
  }

  .chip:hover {
    filter: brightness(120%);
    transition: filter 300ms
  }

  .chip :global(svg) {
    color: inherit;
    margin-right: 5px;
  }

  .text {
    color: var(--ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .link {
    border-radius: 0;
    background-color: transparent;
    border: 1px solid red;
    border-width: 0 0 1px 0;
    box-sizing: border-box;
    border-color: var(--blue);
    color: white;
    padding-left: 0px;
    padding-right: 0px;
    transition: background-color 200ms;
  }

  .link:hover {
    cursor: pointer;
    background-color: #ffffff0a;
  }

  .link :global(svg) {
    margin-right: 3px;
    color: var(--blue);
  }
</style>
