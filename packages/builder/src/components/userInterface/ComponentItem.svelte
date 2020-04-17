<script>
  export let icon = ""
  export let name = ""
  export let description = ""
</script>

<div class="component-item">
  <div class="component-icon">
    <i class={icon} />
  </div>
  <div class="component-text">
    <div class="component-name">{name}</div>
    <div class="component-description">
      <p>{description}</p>
    </div>
  </div>
</div>

<style>
  .component-item {
    display: flex;
    flex-direction: row;
    padding: 10px 0px 8px 10px;
    align-items: center;
    cursor: pointer;
  }

  .component-item:hover {
    background: #f5f5f5;
    /* background: #fbfbfb; */
    border-radius: 5px;
  }

  .component-icon {
    flex: 0 0 40px;
    /* background: #efe9e9; */
    background: #f1f4fc;
    height: 40px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .component-text {
    display: flex;
    padding-left: 16px;
    padding-top: 8px;
    flex-direction: column;
  }

  .component-name {
    font-size: 14px;
    font-weight: 500;
  }

  .component-description {
    font-size: 12px;
    color: #808192;
  }

  p {
    line-height: 15px;
  }

  i {
    font-size: 28px;
    /* color: #808192; */
  }
</style>
