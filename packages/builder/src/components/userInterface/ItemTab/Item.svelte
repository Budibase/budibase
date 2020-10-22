<script>
  export let item
</script>

<div data-cy={item.name} class="item-item" on:click>
  <div class="item-icon"><i class={item.icon} /></div>
  <div class="item-text">
    <div class="item-name">{item.name}</div>
  </div>
</div>

<style>
  .item-item {
    display: flex;
    flex-direction: row;
    cursor: pointer;
    justify-content: flex-start;
    align-items: center;
    border-radius: 5px;
    color: var(--grey-7);
  }

  .item-item:hover {
    color: var(--ink);
  }

  .item-icon {
    border-radius: 3px;
    display: flex;
  }

  .item-text {
    display: flex;
    flex-direction: column;
  }

  .item-name {
    font-size: var(--font-size-xs);
    font-weight: 500;
    text-align: center;
  }

  i {
    font-size: 16px;
    margin-right: 8px;
  }
</style>
