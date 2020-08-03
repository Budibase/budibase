<script>
  import Button from "components/common/Button.svelte"
  export let name, _id
</script>

<div class="apps-card">
  <h3 class="app-title">{name}</h3>
  <div class="card-footer">
    <a href={`/_builder/${_id}`} class="app-button">Open {name}</a>
  </div>
</div>

<style>
  .apps-card {
    background-color: var(--white);
    padding: 20px 20px 20px 20px;
    max-width: 400px;
    max-height: 150px;
    border-radius: 5px;
    border: 1px solid var(--grey-4);
    font-family: Inter;
  }

  .app-button:hover {
    background-color: var(--grey-1);
    text-decoration: none;
  }

  .app-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--ink);
    text-transform: capitalize;
  }

  .app-desc {
    color: var(--grey-7);
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-footer {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
  }

  .app-button {
    align-items: center;
    display: flex;
    background-color: var(--white);
    color: var(--ink);
    width: 100%;
    justify-content: center;
    padding: 12px 20px;
    border-radius: 5px;
    border: 1px var(--grey-2) solid;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s;
    box-sizing: border-box;
  }
</style>
