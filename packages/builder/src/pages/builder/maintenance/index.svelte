<script>
  import { MaintenanceType } from "@budibase/types"
  import { admin } from "stores/portal"
  import BudibaseLogo from "../portal/_components/BudibaseLogo.svelte"
</script>

<div class="main">
  <div class="content">
    <div class="hero">
      <BudibaseLogo />
    </div>
    <div>
      {#each $admin.maintenance as maintenance}
        {#if maintenance.type === MaintenanceType.SQS_MISSING}
          <h1 class="title">Please upgrade your Budibase installation</h1>
          <p>
            We've detected that the version of Budibase you're using depends on
            a more recent version of the CouchDB database than what you have
            installed.
          </p>
          <p>
            To resolve this, you can either rollback to a previous version of
            Budibase, or follow the migration guide to update to a later version
            of CouchDB.
          </p>
          <div class="buttons">
            <a class="button" href="https://docs.budibase.com"
              >Migration guide</a
            >
          </div>
        {/if}
      {/each}
    </div>
  </div>
</div>

<style>
  :root {
    --spectrum-global-color-gray-600: rgb(144, 144, 144);
    --spectrum-global-color-gray-900: rgb(255, 255, 255);
    --spectrum-global-color-gray-800: rgb(227, 227, 227);
    --bb-indigo: #6e56ff;
    --bb-indigo-light: #9f8fff;
  }

  a {
    color: #e7e7e7;
    font-family: "Roboto", sans-serif;
    border: none;
    font-size: 15px;
    border-radius: 15px;
    padding: 8px 22px;
  }
  a:hover {
    cursor: pointer;
  }
  .main {
    font-size: 1.5em;
    max-width: 700px;
    margin: auto;
    height: 100vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 1em;
  }
  .title {
    font-weight: 400;
    color: var(--spectrum-global-color-gray-900);
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 15px;
  }
  .button {
    background-color: var(--bb-indigo);
  }
  .button:hover {
    background-color: var(--bb-indigo-light);
  }
  .hero {
    height: 60px;
    margin: 10px 40px 10px 0;
  }
  .content {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: center;
    gap: 1em;
  }
  h1 {
    margin-bottom: 10px;
  }

  @media only screen and (max-width: 600px) {
    .content {
      flex-direction: column;
      align-items: flex-start;
    }
    .main {
      height: auto;
    }
  }
</style>
