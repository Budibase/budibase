<script>
  import { Button } from "@budibase/bbui"
  export let remove = false
</script>

<div class="container">
  <div class="content">
    <div class="img">
      <img src="https://picsum.photos/60/60" alt="zoom" />
    </div>
    <div class="body">
      <div class="title">Zoom</div>
      <div class="description">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit
      </div>
    </div>
  </div>
  <div class="footer">
    <Button wide error={remove} secondary={!remove} on:click>
      <span>{remove ? 'Remove' : 'Add'}</span>
    </Button>
  </div>
</div>

<style>
  .container {
    display: grid;
    padding: 12px;
    background: var(--light-grey);
    grid-gap: 20px;
  }
  span {
    font-size: 12px;
    font-weight: bold;
  }
  .content {
    display: grid;
    grid-gap: 12px;
    grid-template-columns: 60px auto;
  }
  .title {
    font-size: 14px;
    font-weight: bold;
  }
  .description {
    font-size: 12px;
  }
  .img {
    border-radius: 3px;
    overflow: hidden;
  }
  img {
    height: 60px;
    width: 60px;
  }
</style>
