<script>
  import { FancyButton } from "@budibase/bbui"
  import GoogleLogo from "assets/google-logo.png"
  import { auth, organisation } from "stores/portal"

  let show

  $: tenantId = $auth.tenantId
  $: show = true //$organisation.google
</script>

{#if show}
  <FancyButton
    on:click={() => {
      window.open(`/api/global/auth/${tenantId}/google`, "_blank")
    }}
    icon={GoogleLogo}
  >
    Log in with Google
  </FancyButton>
  <FancyButton
    disabled
    on:click={() => {
      window.open(`/api/global/auth/${tenantId}/google`, "_blank")
    }}
    icon={GoogleLogo}
  >
    Log in with Google
  </FancyButton>
{/if}
