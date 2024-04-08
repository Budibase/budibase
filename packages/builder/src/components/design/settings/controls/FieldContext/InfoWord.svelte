<script>
  import { Icon } from "@budibase/bbui"
  export let icon = ""
  export let color = "initial"
  export let text = ""
</script>

<div
  role="tooltip"
  class="chip"
  style:color={color}
  style:border-color={color}
  on:mouseenter
  on:mouseleave
  >
  <Icon size="S" name={icon} />
  <span class="text">
    <slot>
      {text}
    </slot>
  </span>
</div>

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
    flex-shrink: 0;
  }
</style>
