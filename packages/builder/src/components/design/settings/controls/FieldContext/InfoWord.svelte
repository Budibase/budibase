<script>
  import { Icon } from "@budibase/bbui"

  export let icon = null
  export let color = null
  export let text
  export let href = null
</script>


{#if href !== null}
  <a
    tabindex="0"
    {href}
    rel="noopener noreferrer"
    target="_blank"
    class="chip"
    style:color={color}
    style:border-color={color}
    on:mouseenter
    on:mouseleave
  >
    {#if icon}
      <Icon size="S" name={icon} />
    {/if}
    <span class="text">
      <slot>
        {text}
      </slot>
    </span>
  </a>
{:else}
  <div
    role="tooltip"
    class="chip"
    style:color={color}
    style:border-color={color}
    on:mouseenter
    on:mouseleave
  >
    {#if icon}
      <Icon size="S" name={icon} />
    {/if}
    <span class="text">
      <slot>
        {text}
      </slot>
    </span>
  </div>
{/if}

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
</style>
