<script>
  import {
    Layout,
    Button,
    Helpers,
    Icon,
    notifications,
    Select,
    PillInput,
    Toggle,
    TextArea,
    Input,
    Divider,
  } from "@budibase/bbui"
  import { PASSWORD_REPLACEMENT } from "@budibase/types"
  import { AppStatus } from "@/constants"
  import { appsStore } from "@/stores/portal/apps"
  import { appStore, workspaceAppStore } from "@/stores/builder"
  import { licensing } from "@/stores/portal/licensing"
  import LockedFeature from "@/pages/builder/_components/LockedFeature.svelte"
  import { onMount } from "svelte"

  let selectedApp

  $: allowedOrigins = $appStore.embedAllowedOrigins || []

  const updateAllowedOrigins = async origins => {
    try {
      await appStore.updateApp({ embedAllowedOrigins: origins })
      notifications.success("Allowed domains updated")
    } catch (error) {
      notifications.error("Error updating allowed domains")
    }
  }

  const algorithmOptions = [
    { label: "ES256 (public key)", value: "ES256" },
    { label: "RS256 (public key)", value: "RS256" },
    { label: "HS256 (shared secret)", value: "HS256" },
  ]

  let ssoEnabled = false
  let ssoAlgorithm = "ES256"
  let ssoKey = ""
  let ssoIssuer = ""
  let ssoEmailClaim = ""
  // whether a key is already stored (server returns it masked)
  let ssoKeySet = false
  // the algorithm the stored key was created for
  let originalAlgorithm = "ES256"

  onMount(() => {
    const config = $appStore.embedSSO
    if (config) {
      ssoEnabled = config.enabled
      ssoAlgorithm = config.algorithm || "ES256"
      originalAlgorithm = ssoAlgorithm
      ssoIssuer = config.issuer || ""
      ssoEmailClaim = config.emailClaim || ""
      ssoKeySet = !!config.key
    }
  })

  $: isSecretAlgorithm = ssoAlgorithm === "HS256"
  // the stored key is tied to its algorithm, so it can only be reused while the
  // algorithm is unchanged - otherwise a new key must be entered
  $: canReuseStoredKey = ssoKeySet && ssoAlgorithm === originalAlgorithm

  const onSSOToggle = () => {
    if (!$licensing.embedAuthEnabled) {
      return
    }
    // persist immediately when disabling; enabling reveals the fields and waits
    // for an explicit save once a key has been provided
    if (!ssoEnabled) {
      saveSSO()
    }
  }

  const saveSSO = async () => {
    if (!$licensing.embedAuthEnabled) {
      return
    }
    if (ssoEnabled && !ssoKey && !canReuseStoredKey) {
      notifications.error(
        "Please provide a verification key for the selected algorithm"
      )
      return
    }
    try {
      const config = {
        enabled: ssoEnabled,
        algorithm: ssoAlgorithm,
        key: ssoKey || (canReuseStoredKey ? PASSWORD_REPLACEMENT : ""),
        issuer: ssoIssuer || undefined,
        emailClaim: ssoEmailClaim || undefined,
      }
      await appStore.updateApp({ embedSSO: config })
      originalAlgorithm = ssoAlgorithm
      if (ssoKey) {
        ssoKeySet = true
        ssoKey = ""
      }
      notifications.success("Embed SSO settings updated")
    } catch (error) {
      notifications.error("Error updating embed SSO settings")
    }
  }

  $: filteredApps = $appsStore.apps.filter(app => app.devId == $appStore.appId)
  $: workspace = filteredApps.length ? filteredApps[0] : {}
  $: workspaceBaseUrl = `${window.origin}/embed${workspace?.url}`
  $: workspaceUrl =
    !selectedApp || selectedApp?.isDefault
      ? workspaceBaseUrl
      : `${workspaceBaseUrl}${selectedApp.url}`
  $: appDeployed = workspace?.status === AppStatus.DEPLOYED
  $: defaultApp = $workspaceAppStore.workspaceApps.find(a => a.isDefault)
  $: embedTitle = selectedApp?.name || workspace?.name || ""

  $: embed = `<iframe title="${embedTitle}" width="800" height="600" frameborder="0" allow="clipboard-write;camera;geolocation;fullscreen" src="${workspaceUrl}"> </iframe>`
</script>

<Layout noPadding>
  <div class="embed-app-select">
    <span>
      Select a workspace app below if you wish to target a specific app:
    </span>
    <Select
      placeholder={!$workspaceAppStore.workspaceApps.length
        ? "No workspace apps"
        : false}
      options={$workspaceAppStore.workspaceApps}
      getOptionLabel={a => a.name}
      getOptionValue={a => a}
      value={selectedApp || defaultApp}
      on:change={e => (selectedApp = e.detail)}
      disabled={!$workspaceAppStore.workspaceApps.length}
    />
  </div>
  <div class="embed-body">
    <div class="embed-code">{embed}</div>
    {#if appDeployed}
      <div>
        <Button
          cta
          disabled={!appDeployed}
          on:click={async () => {
            await Helpers.copyToClipboard(embed)
            notifications.success("Copied")
          }}
        >
          Copy code
        </Button>
      </div>
    {:else}
      <div class="embed-info">
        <Icon size="S" name="info" /> Embeds will only work with a published app
      </div>
    {/if}
  </div>
  <div class="embed-domains">
    <PillInput
      label="Allowed domains"
      value={allowedOrigins}
      placeholder="https://example.com"
      on:change={e => updateAllowedOrigins(e.detail)}
    />
  </div>

  <Divider />

  <LockedFeature
    title={"Authenticated iframe embeds"}
    planType={"Enterprise"}
    description={"Authenticate embedded users by passing a signed token on the embed URL."}
    enabled={$licensing.embedAuthEnabled}
    upgradeButtonClick={async () => {
      licensing.goToUpgradePage()
    }}
    showContentWhenDisabled
  >
    <div class="embed-sso">
      <div class="embed-sso-heading">
        <span class="embed-sso-title">Authenticate embedded users</span>
        <span class="embed-sso-description">
          Let the host site sign in users by passing a signed token (e.g. the
          <code>?jwt=</code> parameter) on the embed URL. The token's email is mapped
          to an existing Budibase user.
        </span>
      </div>
      <Toggle
        text="Enable"
        bind:value={ssoEnabled}
        on:change={onSSOToggle}
        disabled={!$licensing.embedAuthEnabled}
      />
      {#if ssoEnabled}
        <Select
          label="Verification algorithm"
          options={algorithmOptions}
          bind:value={ssoAlgorithm}
          getOptionLabel={o => o.label}
          getOptionValue={o => o.value}
          disabled={!$licensing.embedAuthEnabled}
        />
        <TextArea
          label={isSecretAlgorithm ? "Shared secret" : "Public key (PEM)"}
          bind:value={ssoKey}
          placeholder={canReuseStoredKey
            ? "A key is set — enter a new value to replace it"
            : isSecretAlgorithm
              ? "Shared HMAC secret"
              : "-----BEGIN PUBLIC KEY-----"}
          helpText={ssoKeySet && !canReuseStoredKey
            ? `Enter a new key for ${ssoAlgorithm} — the stored key cannot be reused after changing the algorithm.`
            : "Used to verify the signature of the incoming token."}
          error={ssoKeySet && !canReuseStoredKey
            ? "A new key is required for the selected algorithm"
            : undefined}
          disabled={!$licensing.embedAuthEnabled}
        />
        <Input
          label="Issuer (optional)"
          bind:value={ssoIssuer}
          placeholder="https://nextcloud.example.com"
          helpText="If set, the token's 'iss' claim must match this value."
          disabled={!$licensing.embedAuthEnabled}
        />
        <Input
          label="Email claim"
          bind:value={ssoEmailClaim}
          placeholder="email"
          helpText="Path to the email in the token payload. Use 'userdata.email' for Nextcloud. Defaults to 'email'."
          disabled={!$licensing.embedAuthEnabled}
        />
        <div>
          <Button
            cta
            on:click={saveSSO}
            disabled={!$licensing.embedAuthEnabled}
          >
            Save
          </Button>
        </div>
      {/if}
    </div>
  </LockedFeature>
</Layout>

<style>
  .embed-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .embed-body {
    display: flex;
    flex-direction: column;
    gap: var(--spectrum-alias-grid-gutter-small);
  }
  .embed-code {
    display: flex;
    align-items: center;
    background-color: var(
      --spectrum-textfield-m-background-color,
      var(--spectrum-global-color-gray-50)
    );
    border-radius: var(--border-radius-s);
    padding: var(--spacing-xl);
  }
  .embed-app-select {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    width: fit-content;
  }
  .embed-domains {
    max-width: 480px;
  }
  .embed-sso {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    max-width: 480px;
  }
  .embed-sso-heading {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  .embed-sso-title {
    font-weight: 600;
  }
  .embed-sso-description {
    color: var(--spectrum-global-color-gray-700);
    font-size: var(--font-size-s);
  }
</style>
