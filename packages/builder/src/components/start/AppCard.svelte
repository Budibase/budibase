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
    padding: var(--spacing-xl);
    max-width: 300px;
    max-height: 150px;
    border-radius: var(--border-radius-m);
    border: var(--border-dark);
  }

  .app-button:hover {
    background-color: var(--white);
    color: var(--black);
    text-decoration: none;
  }

  .app-title {
    font-size: var(--font-size-l);
    font-weight: 600;
    color: var(--ink);
    text-transform: capitalize;
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
    background-color: var(--ink);
    color: var(--white);
    border: 1.5px var(--ink) solid;
    width: 100%;
    justify-content: center;
    padding: 8px 16px;
    border-radius: var(--border-radius-s);
    font-size: var(--font-size-xs);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    box-sizing: border-box;
    font-family: var(--font-sans);
  }
</style>
