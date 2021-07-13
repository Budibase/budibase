<script>
  import { ActionButton } from "@budibase/bbui"
  import OidcLogo from "assets/oidc-logo.png"
  import Auth0Logo from "assets/auth0-logo.png"
  import MicrosoftLogo from "assets/microsoft-logo.png"

  import { admin } from "stores/portal"

  export let oidcIcon
  export let oidcName
  let show = false

  let preDefinedIcons = {
    Oidc: OidcLogo,
    Auth0: Auth0Logo,
    Microsoft: MicrosoftLogo,
  }
  $: show = $admin.checklist?.oidc
</script>

{#if show}
  <ActionButton on:click={() => window.open("/api/admin/auth/oidc", "_blank")}>
    <div class="inner">
      <img
        src={!oidcIcon
          ? OidcLogo
          : preDefinedIcons[oidcIcon]
          ? preDefinedIcons[oidcIcon]
          : `/global/oidc_logos/${oidcIcon}`}
        alt="oidc icon"
      />
      <p>{`Sign in with ${oidcName || "OIDC"}`}</p>
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
