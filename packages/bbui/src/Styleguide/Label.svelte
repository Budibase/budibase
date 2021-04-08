<script>
  export let forAttr = "",
    extraSmall = false,
    small = false,
    medium = false,
    large = false,
    extraLarge = false,
    white = false,
    grey = false,
    black = false
</script>

<label
  class="bb-label"
  class:extraSmall
  class:small
  class:medium
  class:large
  class:extraLarge
  class:white
  class:grey
  class:black
  for={forAttr}>
  <slot />
</label>

<style>
  .bb-label {
    font-family: var(--font-sans);
    font-weight: 500;
    text-rendering: var(--text-render);
    color: var(--ink);
    font-size: var(--font-size-s);
    margin-bottom: var(--spacing-s);
    display: block;
  }

  .extraSmall {
    font-size: var(--font-size-xs);
  }

  .small {
    font-size: var(--font-size-s);
  }

  .medium {
    font-size: var(--font-size-m);
  }

  .large {
    font-size: var(--font-size-l);
  }

  .extraLarge {
    font-size: var(--font-size-xl);
  }

  .white {
    color: white;
  }

  .grey {
    color: var(--grey-6);
  }

  .black {
    color: var(--ink);
  }
</style>
