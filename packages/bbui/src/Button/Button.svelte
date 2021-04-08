<script>
  export let primary = false,
    secondary = false,
    blue = false,
    disabled = false,
    translucent = false,
    text = false,
    red = false,
    yellow = false,
    orange = false,
    green = false,
    purple = false,
    small = false,
    medium = false,
    wide = false,
    large = false,
    href = false
</script>

{#if href}
  <a
    {href}
    class:primary
    class:secondary
    class:translucent
    class:blue
    class:red
    class:yellow
    class:orange
    class:green
    class:purple
    class:small
    class:medium
    class:wide
    class:large
    class:text
    {disabled}>
    <slot />
  </a>
{:else}
  <button
    class:primary
    class:secondary
    class:translucent
    class:blue
    class:red
    class:yellow
    class:orange
    class:green
    class:purple
    class:small
    class:medium
    class:wide
    class:large
    class:text
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
    border-radius: var(--border-radius-s);
    color: white;
    padding: var(--spacing-s) var(--spacing-l);
    transition: all 0.2s ease 0s;
    display: inline-flex;
    text-rendering: optimizeLegibility;
    text-decoration: none;
    min-width: auto;
    outline: none;
    font-feature-settings: "case" 1, "rlig" 1, "calt" 0;
    -webkit-box-align: center;
    user-select: none;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    margin: 0;
    border-width: 2px;
    border-style: solid;
    border-color: transparent;
  }

  .primary {
    color: var(--background);
    border-color: var(--ink);
    background-color: var(--ink);
  }
  button.primary:hover:not([disabled]) {
    background-color: var(--background);
    color: var(--ink);
  }
  .secondary {
    border-color: var(--grey-4);
    background-color: var(--background);
    color: var(--grey-8);
    font-weight: 500;
  }
  button.secondary:hover:not([disabled]) {
    background-color: var(--grey-2);
    color: var(--ink);
  }
  .translucent {
    border-color: rgba(0, 0, 0, 0.1);
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--grey-6);
    font-weight: 500;
  }
  button.translucent:hover:not([disabled]) {
    background-color: var(--grey-2);
    color: var(--ink);
  }
  .blue {
    background-color: var(--blue);
    border-color: var(--blue);
  }
  button.blue:hover:not([disabled]) {
    background-color: var(--blue-light);
    color: var(--blue);
  }
  .red {
    border-color: var(--red);
    background-color: var(--red);
    color: white;
  }
  button.red:hover:not([disabled]) {
    background-color: var(--red-light);
    color: var(--red);
  }
  .yellow {
    border-color: var(--yellow);
    background-color: var(--yellow);
    color: white;
  }
  button.yellow:hover:not([disabled]) {
    background-color: var(--yellow-light);
    color: var(--yellow);
  }
  .orange {
    border-color: var(--orange);
    background-color: var(--orange);
    color: white;
  }
  button.orange:hover:not([disabled]) {
    background-color: var(--orange-light);
    color: var(--orange);
  }
  .green {
    border-color: var(--green);
    background-color: var(--green);
    color: white;
  }
  button.green:hover:not([disabled]) {
    background-color: var(--green-light);
    color: var(--green);
  }
  .purple {
    border-color: var(--purple);
    background-color: var(--purple);
    color: white;
  }
  button.purple:hover:not([disabled]) {
    background-color: var(--purple-light);
    color: var(--purple);
  }
  .text {
    background-color: transparent;
    color: var(--grey-7);
    border: none;
    padding: 0;
    font-weight: 500;
  }
  button.text:hover:not([disabled]) {
    color: var(--ink);
  }
  button.text:active:not([disabled]) {
    color: var(--blue);
  }

  .small {
    font-size: var(--font-size-xs);
    padding: var(--spacing-xs) var(--spacing-m);
  }

  .medium {
    font-size: var(--font-size-m);
    padding: var(--spacing-s) var(--spacing-l);
  }

  .large {
    font-size: var(--font-size-l);
    padding: var(--spacing-m) var(--layout-l);
  }
  .wide {
    width: 100%;
    display: flex;
  }

  button:disabled {
    background-color: var(--grey-4);
    cursor: not-allowed;
    border-color: var(--grey-4);
    color: var(--grey-5);
  }
</style>
