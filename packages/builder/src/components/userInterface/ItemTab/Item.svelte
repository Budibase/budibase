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
    flex-direction: column;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    background-color: var(--grey-1);
    border-radius: 5px;
    width: 120px;
    height: 80px;
    color: var(--grey-7);
  }

  .item-item:hover {
    background: var(--grey-2);
    transition: all 0.3s;
  }

  .item-icon {
    border-radius: 3px;
    display: flex;
  }

  .item-text {
    display: flex;
    flex-direction: column;
    margin-top: 5px;
  }

  .item-name {
    font-size: 12px;
    font-weight: 500;
    text-align: center;
  }

  i {
    font-size: 24px;
  }
</style>
