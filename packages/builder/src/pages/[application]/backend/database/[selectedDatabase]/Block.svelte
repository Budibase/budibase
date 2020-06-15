<script>
  export let title
  export let icon

  export let primary
  export let secondary
  export let tertiary
</script>

<!-- TODO: Move to bbui -->
<div on:click class:primary class:secondary class:tertiary>
  <i class={icon} />
  <span>{title}</span>
</div>

<style>
  div {
    width: 120px;
    height: 90px;
    border-radius: 3px;
    color: var(--ink);
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  
  span {
    font-size: 16px;
  }

  div:hover {
    cursor: pointer;
  }

  .primary {
    background: var(--ink);
    color: var(--white);
  }

  .secondary {
    background: var(--secondary);
  }

  .tertiary {
    background: var(--white);
  }
</style>
