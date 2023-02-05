<script>
  import { FancyButton } from "@budibase/bbui"
  import GoogleLogo from "assets/google-logo.png"
  import { auth, organisation } from "stores/portal"

  let show

  $: tenantId = $auth.tenantId
  $: show = $organisation.google
</script>

{#if show}
  <FancyButton
    icon={GoogleLogo}
    on:click={() =>
      window.open(`/api/global/auth/${tenantId}/google`, "_blank")}
  >
    Log in with Google
  </FancyButton>
{/if}
