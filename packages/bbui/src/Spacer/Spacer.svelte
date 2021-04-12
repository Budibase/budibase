<script>
  export let extraSmall = false
  export let small = false
  export let medium = false
  export let large = false
  export let extraLarge = false
</script>

<spacer
  class:extraSmall
  class:small
  class:medium
  class:large
  class:extraLarge />

<style>
  spacer {
    display: block;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .extraSmall {
    height: var(--spacing-xs);
    width: var(--spacing-xs);
  }

  .small {
    height: var(--spacing-s);
    width: var(--spacing-s);
  }

  .medium {
    height: var(--spacing-m);
    width: var(--spacing-m);
  }

  .large {
    height: var(--spacing-l);
    width: var(--spacing-l);
  }

  .extraLarge {
    height: var(--spacing-xl);
    width: var(--spacing-xl);
  }
</style>
