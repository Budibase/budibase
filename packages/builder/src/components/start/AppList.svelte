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
    grid-template-columns: repeat(auto-fill, 380px);
    grid-gap: 20px 40px;
    justify-content: start;
  }

  .root {
    margin: 20px 80px;
  }

</style>
