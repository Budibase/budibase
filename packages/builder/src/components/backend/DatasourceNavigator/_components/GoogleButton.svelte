<script>
  import { ActionButton } from "@budibase/bbui"
  import GoogleLogo from "assets/google-logo.png"
  import { store } from "builderStore"
  import { auth } from "stores/portal"

  export let preAuthStep
  export let datasource

  $: tenantId = $auth.tenantId
</script>

<ActionButton
  on:click={async () => {
    let ds = datasource
    if (!ds) {
      ds = await preAuthStep()
    }
    window.open(
      `/api/global/auth/${tenantId}/datasource/google?datasourceId=${ds._id}&appId=${$store.appId}`,
      "_blank"
    )
  }}
>
  <div class="inner">
    <img src={GoogleLogo} alt="google icon" />
    <p>Sign in with Google</p>
  </div>
</ActionButton>

<style>
  .inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-top: var(--spacing-xs);
    padding-bottom: var(--spacing-xs);
  }
  .inner img {
    width: 18px;
    margin: 3px 10px 3px 3px;
  }
  .inner p {
    margin: 0;
  }
</style>
