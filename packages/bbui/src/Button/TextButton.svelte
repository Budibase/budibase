<script>
  export let active = false,
    text = false,
    small = false,
    medium = false,
    large = false,
    blue = false,
    green = false,
    yellow = false,
    purple = false,
    red = false,
    orange = false,
    disabled = false,
    href = false
</script>

{#if href}
  <a
    {href}
    class:active
    class:small
    class:medium
    class:large
    class:text
    class:blue
    class:green
    class:yellow
    class:purple
    class:red
    class:orange><slot /></a>
{:else}
  <button
    class:active
    class:small
    class:medium
    class:large
    class:text
    class:blue
    class:green
    class:yellow
    class:purple
    class:red
    class:orange
    {disabled}
    on:click|preventDefault>
    <slot />
  </button>
{/if}

<style>
  button,
  a {
    font-family: var(--font-sans);
    cursor: pointer;
    font-weight: 600;
    box-sizing: border-box;
    overflow: hidden;
    transition: all 0.08s ease 0s;
    display: inline-flex;
    align-items: center;
    text-rendering: optimizeLegibility;
    text-decoration: none;
    outline: none;
    -webkit-box-align: center;
    user-select: none;
    margin: 0;
    padding: 0;
  }

  .text {
    background-color: transparent;
    color: var(--grey-7);
    border: none;
    font-weight: 500;
  }
  button.text:hover:not([disabled]) {
    color: var(--ink);
  }
  button.text:active:not([disabled]) {
    color: var(--blue);
  }
  button.text.active:not([disabled]) {
    color: var(--blue);
  }
  button.text:disabled {
    cursor: not-allowed;
    color: var(--grey-4);
  }

  .blue {
    color: var(--blue);
  }

  .green {
    color: var(--green);
  }

  .red {
    color: var(--red);
  }

  .purple {
    color: var(--purple);
  }

  .yellow {
    color: var(--yellow);
  }

  .orange {
    color: var(--orange);
  }

  .small {
    font-size: var(--font-size-xs);
    margin: 0;
  }

  .medium {
    font-size: var(--font-size-s);
    margin: 0;
  }

  .large {
    font-size: var(--font-size-m);
    margin: 0;
  }
</style>
