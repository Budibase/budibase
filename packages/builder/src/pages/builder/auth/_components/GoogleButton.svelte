<script>
  import { FancyButton } from "@budibase/bbui"
  import GoogleLogo from "assets/google-logo.png"
  import { auth, organisation } from "stores/portal"

  import { _ } from "../../../../../lang/i18n"
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
    {$_("pages.builder.auth._components.GoogleButton.login")}
  </FancyButton>
{/if}
