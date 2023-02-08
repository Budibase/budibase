<script>
  import { notifications, FancyButton } from "@budibase/bbui"
  import OidcLogo from "assets/oidc-logo.png"
  import Auth0Logo from "assets/auth0-logo.png"
  import MicrosoftLogo from "assets/microsoft-logo.png"
  import OktaLogo from "assets/okta-logo.png"
  import OneLoginLogo from "assets/onelogin-logo.png"

  import { oidc, organisation, auth } from "stores/portal"
  import { onMount } from "svelte"

  $: show = $organisation.oidc

  let preDefinedIcons = {
    Oidc: OidcLogo,
    Auth0: Auth0Logo,
    Microsoft: MicrosoftLogo,
    Okta: OktaLogo,
    OneLogin: OneLoginLogo,
  }

  onMount(async () => {
    try {
      await oidc.init()
    } catch (error) {
      notifications.error("Error getting OIDC config")
    }
  })

  $: src = !$oidc.logo
    ? OidcLogo
    : preDefinedIcons[$oidc.logo] || `/global/logos_oidc/${$oidc.logo}`
</script>

{#if show}
  <FancyButton
    icon={src}
    on:click={() =>
      window.open(
        `/api/global/auth/${$auth.tenantId}/oidc/configs/${$oidc.uuid}`,
        "_blank"
      )}
  >
    {`Log in with ${$oidc.name || "OIDC"}`}
  </FancyButton>
{/if}
