<script>
  import Button from "components/common/Button.svelte"
  export let apps

function myFunction() {
  var x = new Date(document.lastModified);
  document.getElementById("demo").innerHTML = x;
}
</script>

<div class="root">
  <div class="inner">
    <div>
      <div>
        <div class="app-section-title">Your Web Apps</div>
        {#each apps as app}
        <div class="apps-card">
            <h3 class="app-title">{app.name}</h3>
            <p class="app-desc">A minimalist CRM which removes the noise and allows you to focus on your business. </p>
            <div class="card-footer">
              <div class="modified-date">Last Edited - 25th May 2020</div>
              <a href={`/_builder/${app._id}`} class="app-button">Open Web App</a>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .root {
    margin: 40px 80px;
  }

  .app-section-title {
    font-size: 20px;
    color: var(--ink);
    font-weight: 700;
    margin-bottom: 20px;
  }

  .apps {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
  }
  .apps-card {
    background-color: var(--white);
    padding: 20px;
    max-width: 400px;
    max-height: 150px;
    border-radius: 5px;
    border: 1px solid var(--grey-dark);
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

  .modified-date {
    font-size: 14px;
    color: var(--ink-light);
  }

  .app-button {
    background-color: var(--white);
    color: var(--ink);
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
