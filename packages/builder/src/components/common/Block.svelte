<script>
  export let title
  export let icon

  export let primary
  export let secondary
  export let tertiary
</script>

<div on:click class:primary class:secondary class:tertiary>
  <i class={icon} />
  <span>{title}</span>
</div>

<style>
  div {
    height: 80px;
    border-radius: 5px;
    color: var(--ink);
    font-weight: 400;
    padding: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transition: 0.3s transform;
    background: var(--grey-1);
  }

  i {
    font-size: 24px;
    color: var(--grey-7);
  }

  span {
    font-size: 14px;
    text-align: center;
    margin-top: 8px;
    line-height: 1.25;
  }

  div:hover {
    cursor: pointer;
    background: var(--grey-2);
  }

  .primary {
    background: var(--ink);
    color: var(--white);
  }

  .secondary {
    background: var(--blue-light);
  }

  .tertiary {
    background: var(--white);
  }
</style>
