<script>
  export let item
</script>

<div class="item-item" on:click>
  <div class="item-icon">
    <i class={item.icon} />
  </div>
  <div class="item-text">
    <div class="item-name">{item.name}</div>
    <div class="item-description">
      <p>{item.description}</p>
    </div>
  </div>
</div>

<style>
  .item-item {
    display: flex;
    flex-direction: row;
    padding: 10px 0px 8px 10px;
    align-items: center;
    cursor: pointer;
  }

  .item-item:hover {
    background: #fbfbfb;
    border-radius: 5px;
  }

  .item-icon {
    flex: 0 0 40px;
    background: #f1f4fc;
    height: 40px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .item-text {
    display: flex;
    padding-left: 16px;
    padding-top: 8px;
    flex-direction: column;
  }

  .item-name {
    font-size: 14px;
    font-weight: 500;
  }

  .item-description {
    font-size: 12px;
    color: #808192;
  }

  p {
    line-height: 15px;
  }

  i {
    font-size: 24px;
    color: #808192;
  }
</style>
