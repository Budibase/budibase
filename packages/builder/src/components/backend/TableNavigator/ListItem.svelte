<script>
  export let icon
  export let className
  export let title
  export let selected
  export let indented
</script>

<div class:indented class:selected on:click class={className}>
  <i class={icon} />
  <span>{title}</span>
  <slot />
</div>

<style>
  .indented {
    grid-template-columns: 46px 1fr 20px;
  }
  .indented i {
    justify-self: end;
  }

  div {
    padding: var(--spacing-s) var(--spacing-m);
    border-radius: var(--border-radius-m);
    display: grid;
    grid-template-columns: 20px 1fr 20px;
    align-items: center;
    transition: 0.3s background-color;
    color: var(--ink);
    font-weight: 400;
    font-size: 14px;
    margin-bottom: var(--spacing-xs);
    grid-gap: var(--spacing-s);
  }

  .selected {
    background-color: var(--grey-2);
  }

  div:hover {
    background-color: var(--grey-1);
    cursor: pointer;
  }

  i {
    color: var(--grey-7);
    font-size: 20px;
  }
</style>
