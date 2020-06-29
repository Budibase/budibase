<script>
  import Integration from "../Integration.svelte"
</script>

<div class="container">
  <div class="title">Your Integrations</div>
  <div class="integrations">
    <Integration remove />
    <Integration remove />
    <Integration remove />
    <Integration remove />
  </div>
  <div class="apps">Recommended apps</div>
  <div class="integrations">
    <Integration />
    <Integration />
    <Integration />
    <Integration />
  </div>
</div>

<style>
  .container {
    display: grid;
    grid-gap: 16px;
  }
  .integrations {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }
  .title {
    font-size: 18px;
    font-weight: bold;
  }
  .apps {
    font-size: 14px;
    font-weight: bold;
  }
  .background {
    border-radius: 5px;
    background-color: var(--light-grey);
    padding: 12px 12px 18px 12px;
  }
</style>
