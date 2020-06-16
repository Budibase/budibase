<script>
  import Button from "components/common/Button.svelte"
  export let name,
    description = `A minimalist CRM which removes the noise and allows you to focus
              on your business.`,
    _id
</script>

<div class="apps-card">
  <h3 class="app-title">{name}</h3>
  <p class="app-desc">{description}</p>
  <div class="card-footer">
    <a href={`/_builder/${_id}`} class="app-button">Open Web App</a>
  </div>
</div>

<style>
  .apps-card {
    background-color: var(--white);
    padding: 20px 20px 30px 20px;
    max-width: 400px;
    max-height: 150px;
    border-radius: 5px;
    border: 1px solid var(--grey-medium);
  }

  .app-button:hover {
    background-color: var(--grey-light);
    text-decoration: none;
  }

  .app-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
    text-transform: capitalize;
  }

  .app-desc {
    color: var(--ink-light);
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
    border: 1px var(--grey) solid;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s;
    box-sizing: border-box;
  }
</style>
