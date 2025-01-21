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
    class="infoWord"
    style:color
    style:border-color={color}
    on:mouseenter
    on:mouseleave
  >
    {#if icon}
      <Icon size="XS" name={icon} />
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
    class="infoWord"
    style:color
    style:border-color={color}
    on:mouseenter
    on:mouseleave
  >
    {#if icon}
      <Icon size="XS" name={icon} />
    {/if}
    <span class="text">
      <slot>
        {text}
      </slot>
    </span>
  </div>
{/if}

<style>
  .infoWord {
    display: inline-flex;
    box-sizing: border-box;
    padding: 1px 0 2px;
    filter: brightness(100%);
    overflow: hidden;
    transition: filter 300ms;
    align-items: center;
    border-bottom: 1px solid var(--grey-6);
  }

  .infoWord:hover {
    filter: brightness(120%);
  }

  .infoWord :global(svg) {
    color: inherit;
    margin-right: 4px;
  }

  .text {
    color: var(--ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
