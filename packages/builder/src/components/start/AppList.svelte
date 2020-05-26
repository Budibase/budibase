<script>
  import AppCard from "./AppCard.svelte"
  export let apps

  function myFunction() {
    var x = new Date(document.lastModified)
    document.getElementById("demo").innerHTML = x
  }
</script>

<div class="root">
  <div class="inner">
    <div>
      <div>
        <div class="app-section-title">Your Web Apps</div>
          <div class="apps">
            {#each apps as app}
              <AppCard {...app} />
            {/each}
          </div>
      </div>
    </div>
  </div>
</div>

<style>
  .apps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400, 1fr));
    gap: 85px;
  }
  .root {
    margin: 40px 80px;
  }

  .app-section-title {
    font-size: 20px;
    color: var(--ink);
    font-weight: 700;
    margin-bottom: 20px;
  }
</style>
