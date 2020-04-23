<script>
  import Button from "components/common/Button.svelte"
  export let apps
</script>

<div class="root">
  <div class="inner">
    <img
      src="/_builder/assets/budibase-logo.png"
      class="logo"
      alt="budibase logo" />
    <div>
      <div>
        <h4 style="margin-bottom: 20px">Choose an Application</h4>
        {#each apps as app}
          <a href={`/_builder/${app._id}`} class="app-link">{app.name}</a>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .root {
    position: fixed;
    margin: 0 auto;
    text-align: center;
    top: 20%;
    /*color: #333333;
    background-color: #fdfdfd;*/
    width: 100%;
  }

  .inner {
    display: inline-block;
    margin: auto;
  }

  .logo {
    width: 300px;
    margin-bottom: 40px;
  }

  .root :global(.option) {
    width: 250px;
  }

  .app-link {
    margin-top: 10px;
    display: block;
  }
</style>
