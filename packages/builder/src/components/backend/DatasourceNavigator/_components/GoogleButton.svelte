<script>
  import GoogleLogo from "assets/google-logo.png"
  import { store } from "builderStore"
  import { auth } from "stores/portal"

  export let preAuthStep
  export let datasource
  export let disabled
  export let samePage

  $: tenantId = $auth.tenantId
</script>

<button
  class:disabled
  {disabled}
  on:click={async () => {
    let ds = datasource
    let appId = $store.appId
    if (!ds) {
      const resp = await preAuthStep()
      if (resp.datasource && resp.appId) {
        ds = resp.datasource
        appId = resp.appId
      } else {
        ds = resp
      }
    }
    const url = `/api/global/auth/${tenantId}/datasource/google?datasourceId=${ds._id}&appId=${appId}`
    if (samePage) {
      window.location = url
    } else {
      window.open(url, "_blank")
    }
  }}
>
  <img src={GoogleLogo} alt="google icon" />
  <p>Sign in with Google</p>
</button>

<style>
  .disabled {
    opacity: 0.5;
  }

  button {
    width: 195px;
    height: 40px;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: 500;
    background: #4285f4;
    color: #ffffff;
    border: none;
    cursor: pointer;
    padding: 2px;
    border-radius: 2px;
  }

  img {
    border-radius: 2px;
    width: 18px;
    margin-right: 11px;
    background: #ffffff;
    padding: 10px;
  }
</style>
