<script>
  import { ActionButton } from "@budibase/bbui"
  import OidcLogo from "assets/oidc-logo.png"
  import Auth0Logo from "assets/auth0-logo.png"
  import MicrosoftLogo from "assets/microsoft-logo.png"
  import OktaLogo from "assets/okta-logo.png"
  import OneLoginLogo from "assets/onelogin-logo.png"

  import { oidc, organisation } from "stores/portal"
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
    await oidc.init()
  })

  $: src = !$oidc.logo
    ? OidcLogo
    : preDefinedIcons[$oidc.logo] || `/global/logos_oidc/${$oidc.logo}`
</script>

{#if show}
  <ActionButton
    on:click={() =>
      window.open(`/api/admin/auth/oidc/configs/${$oidc.uuid}`, "_blank")}
  >
    <div class="inner">
      <img {src} alt="oidc icon" />
      <p>{`Sign in with ${$oidc.name || "OIDC"}`}</p>
    </div>
  </ActionButton>
{/if}

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
