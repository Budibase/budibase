<script>
  import GoogleLogo from "./_logos/Google.svelte"
  import OidcLogo from "./_logos/OIDC.svelte"
  import MicrosoftLogo from "assets/microsoft-logo.png"
  import Auth0Logo from "assets/auth0-logo.png"
  import OktaLogo from "assets/okta-logo.png"
  import OneLoginLogo from "assets/onelogin-logo.png"
  import OidcLogoPng from "assets/oidc-logo.png"
  import { isEqual, cloneDeep } from "lodash/fp"
  import {
    Button,
    Heading,
    Divider,
    Label,
    notifications,
    Layout,
    Input,
    Body,
    Select,
    Toggle,
    Tag,
    Tags,
    Icon,
    Helpers,
    Link,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { API } from "api"
  import { organisation, admin, licensing } from "stores/portal"
  import { _ } from "../../../../../../lang/i18n"

  const ConfigTypes = {
    Google: "google",
    OIDC: "oidc",
  }

  const HasSpacesRegex = /[\\"\s]/

  $: enforcedSSO = $organisation.isSSOEnforced

  // Some older google configs contain a manually specified value - retain the functionality to edit the field
  // When there is no value or we are in the cloud - prohibit editing the field, must use platform url to change
  $: googleCallbackUrl = undefined
  $: googleCallbackReadonly = $admin.cloud || !googleCallbackUrl

  // Indicate to user that callback is based on platform url
  // If there is an existing value, indicate that it may be removed to return to default behaviour
  $: googleCallbackTooltip = $admin.cloud
    ? null
    : googleCallbackReadonly
    ? $_("pages.builder.portal.settings.auth.index.Visit_organisation")
    : $_("pages.builder.portal.settings.auth.index.Leave_blank")
  $: googleSheetsCallbackUrl = `${$organisation.platformUrl}/api/global/auth/datasource/google/callback`

  $: GoogleConfigFields = {
    Google: [
      {
        name: "clientID",
        label: $_("pages.builder.portal.settings.auth.index.Client_ID"),
      },
      {
        name: "clientSecret",
        label: $_("pages.builder.portal.settings.auth.index.Client_secret"),
      },
      {
        name: "callbackURL",
        label: $_("pages.builder.portal.settings.auth.index.Callback_URL"),
        readonly: googleCallbackReadonly,
        tooltip: googleCallbackTooltip,
        placeholder: $organisation.googleCallbackUrl,
        copyButton: true,
      },
      {
        name: "sheetsURL",
        label: $_("pages.builder.portal.settings.auth.index.Sheets_URL"),
        readonly: googleCallbackReadonly,
        tooltip: googleCallbackTooltip,
        placeholder: googleSheetsCallbackUrl,
        copyButton: true,
      },
    ],
  }

  $: OIDCConfigFields = {
    Oidc: [
      {
        name: "configUrl",
        label: $_("pages.builder.portal.settings.auth.index.Config_URL"),
      },
      {
        name: "clientID",
        label: $_("pages.builder.portal.settings.auth.index.Client_ID"),
      },
      {
        name: "clientSecret",
        label: $_("pages.builder.portal.settings.auth.index.Client_secret"),
      },
      {
        name: "callbackURL",
        readonly: true,
        tooltip: $admin.cloud
          ? null
          : $_("pages.builder.portal.settings.auth.index.Vist_organisation"),
        label: $_("pages.builder.portal.settings.auth.index.Callback_URL"),
        placeholder: $organisation.oidcCallbackUrl,
        copyButton: true,
      },
    ],
  }

  let iconDropdownOptions = [
    {
      label: "Microsoft",
      value: "Microsoft",
      icon: MicrosoftLogo,
    },
    {
      label: "Okta",
      value: "Okta",
      icon: OktaLogo,
    },
    {
      label: "OneLogin",
      value: "OneLogin",
      icon: OneLoginLogo,
    },
    {
      label: "Auth0",
      value: "Auth0",
      icon: Auth0Logo,
    },
    {
      label: "OIDC",
      value: "Oidc",
      icon: OidcLogoPng,
    },
    {
      label: $_("pages.builder.portal.settings.auth.index.Upload_own"),
      value: "Upload",
    },
  ]

  let fileinput
  let image

  let google
  let oidc
  const providers = { google, oidc }

  // control the state of the save button depending on whether form has changed
  let originalGoogleDoc
  let originalOidcDoc
  let googleSaveButtonDisabled
  let oidcSaveButtonDisabled
  $: {
    isEqual(providers.google?.config, originalGoogleDoc?.config)
      ? (googleSaveButtonDisabled = true)
      : (googleSaveButtonDisabled = false)

    // delete the callback url which is never saved to the oidc
    // config doc, to ensure an accurate comparison
    delete providers.oidc?.config.configs[0].callbackURL

    isEqual(providers.oidc?.config, originalOidcDoc?.config)
      ? (oidcSaveButtonDisabled = true)
      : (oidcSaveButtonDisabled = false)
  }

  $: googleComplete = !!(
    providers.google?.config?.clientID && providers.google?.config?.clientSecret
  )

  $: oidcComplete = !!(
    providers.oidc?.config?.configs[0].configUrl &&
    providers.oidc?.config?.configs[0].clientID &&
    providers.oidc?.config?.configs[0].clientSecret
  )

  const onFileSelected = e => {
    let fileName = e.target.files[0].name
    image = e.target.files[0]
    providers.oidc.config.configs[0].logo = fileName
    iconDropdownOptions.unshift({ label: fileName, value: fileName })
  }

  async function toggleIsSSOEnforced() {
    const value = $organisation.isSSOEnforced
    try {
      await organisation.save({ isSSOEnforced: !value })
    } catch (e) {
      notifications.error(e.message)
    }
  }

  async function saveConfig(config) {
    // Delete unsupported fields
    delete config.createdAt
    delete config.updatedAt
    return API.saveConfig(config)
  }

  async function saveOIDCLogo() {
    if (image) {
      let data = new FormData()
      data.append("file", image)
      await API.uploadOIDCLogo({
        name: image.name,
        data,
      })
    }
  }

  async function saveOIDC() {
    if (!oidcComplete) {
      notifications.error(
        `${$_("pages.builder.portal.settings.auth.index.Please_required")} ${
          ConfigTypes.OIDC
        } ${$_("pages.builder.portal.settings.auth.index.fields")}`
      )
      return
    }

    const oidc = providers.oidc

    // Add a UUID here so each config is distinguishable when it arrives at the login page
    for (let config of oidc.config.configs) {
      if (!config.uuid) {
        config.uuid = Helpers.uuid()
      }
      // Callback urls shouldn't be included
      delete config.callbackURL
    }

    try {
      const res = await saveConfig(oidc)
      providers[res.type]._rev = res._rev
      providers[res.type]._id = res._id
      await saveOIDCLogo()
      notifications.success(
        `${$_("pages.builder.portal.settings.auth.index.Settings_saved")}`
      )
    } catch (e) {
      notifications.error(e.message)
      return
    }

    // Turn the save button grey when clicked
    oidcSaveButtonDisabled = true
    originalOidcDoc = cloneDeep(providers.oidc)
  }

  async function saveGoogle() {
    if (!googleComplete) {
      notifications.error(
        `${$_("pages.builder.portal.settings.auth.index.Please_required")} ${
          ConfigTypes.Google
        } ${$_("pages.builder.portal.settings.auth.index.fields")}`
      )
      return
    }

    const google = providers.google

    try {
      const res = await saveConfig(google)
      providers[res.type]._rev = res._rev
      providers[res.type]._id = res._id
      notifications.success(
        `${$_("pages.builder.portal.settings.auth.index.Settings_saved")}`
      )
    } catch (e) {
      notifications.error(e.message)
      return
    }

    googleSaveButtonDisabled = true
    originalGoogleDoc = cloneDeep(providers.google)
  }

  let defaultScopes = ["profile", "email", "offline_access"]

  const refreshScopes = idx => {
    providers.oidc.config.configs[idx]["scopes"] =
      providers.oidc.config.configs[idx]["scopes"]
  }

  let scopesFields = [
    {
      editing: true,
      inputText: null,
      error: null,
    },
  ]

  const copyToClipboard = async value => {
    await Helpers.copyToClipboard(value)
    notifications.success($_("pages.builder.portal.settings.auth.index.Copied"))
  }

  onMount(async () => {
    try {
      await organisation.init()
    } catch (error) {
      notifications.error(
        $_("pages.builder.portal.settings.auth.index.Error_config")
      )
    }

    // Fetch Google config
    let googleDoc
    try {
      googleDoc = await API.getConfig(ConfigTypes.Google)
    } catch (error) {
      notifications.error(
        $_("pages.builder.portal.settings.auth.index.Error_fetching")
      )
    }
    if (!googleDoc?._id) {
      providers.google = {
        type: ConfigTypes.Google,
        config: { activated: false },
      }
      originalGoogleDoc = cloneDeep(googleDoc)
    } else {
      // Default activated to true for older configs
      if (googleDoc.config.activated === undefined) {
        googleDoc.config.activated = true
      }
      originalGoogleDoc = cloneDeep(googleDoc)
      providers.google = googleDoc
    }
    googleCallbackUrl = providers?.google?.config?.callbackURL

    // Get the list of user uploaded logos and push it to the dropdown options.
    // This needs to be done before the config call so they're available when
    // the dropdown renders.
    let oidcLogos
    try {
      oidcLogos = await API.getOIDCLogos()
    } catch (error) {
      notifications.error(
        $_("pages.builder.portal.settings.auth.index.Error_OIDC")
      )
    }
    if (oidcLogos?.config) {
      const logoKeys = Object.keys(oidcLogos.config)
      logoKeys
        // don't include the etag entry in the logo config
        .filter(key => !key.toLowerCase().includes("etag"))
        .map(logoKey => {
          const logoUrl = oidcLogos.config[logoKey]
          iconDropdownOptions.unshift({
            label: logoKey,
            value: logoKey,
            icon: logoUrl,
          })
        })
    }

    // Fetch OIDC config
    let oidcDoc
    try {
      oidcDoc = await API.getConfig(ConfigTypes.OIDC)
    } catch (error) {
      notifications.error(
        $_("pages.builder.portal.settings.auth.index.Error_fetching_OIDC")
      )
    }
    if (!oidcDoc?._id) {
      providers.oidc = {
        type: ConfigTypes.OIDC,
        config: { configs: [{ activated: false, scopes: defaultScopes }] },
      }
    } else {
      originalOidcDoc = cloneDeep(oidcDoc)
      providers.oidc = oidcDoc
    }
  })
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading size="M"
      >{$_("pages.builder.portal.settings.auth.index.Authentication")}</Heading
    >
    <Body>{$_("pages.builder.portal.settings.auth.index.Add_options")}</Body>
  </Layout>
  <Divider />
  <Layout noPadding gap="XS">
    <Heading size="S"
      >{$_("pages.builder.portal.settings.auth.index.Single_URL")}</Heading
    >
    <Body size="S">
      {$_("pages.builder.portal.settings.auth.index.Use_link")}
    </Body>
    <Body size="S">
      <div class="sso-link">
        <Link href={$organisation.platformUrl} target="_blank"
          >{$organisation.platformUrl}</Link
        >
        <div class="sso-link-icon">
          <Icon size="XS" name="LinkOutLight" />
        </div>
      </div>
    </Body>
  </Layout>
  <Divider />
  <Layout noPadding gap="XS">
    <div class="provider-title">
      <div class="enforce-sso-heading-container">
        <div class="enforce-sso-title">
          <Heading size="S"
            >{$_(
              "pages.builder.portal.settings.auth.index.Enforce_Single"
            )}</Heading
          >
        </div>
        {#if !$licensing.enforceableSSO}
          <Tags>
            <Tag icon="LockClosed"
              >{$_(
                "pages.builder.portal.settings.auth.index.Enterprise_plan"
              )}</Tag
            >
          </Tags>
        {/if}
      </div>
      {#if $licensing.enforceableSSO}
        <Toggle on:change={toggleIsSSOEnforced} bind:value={enforcedSSO} />
      {/if}
    </div>
    <Body size="S">
      {$_("pages.builder.portal.settings.auth.index.Require_SSO")}
      <Link
        size="M"
        href={"https://docs.budibase.com/docs/authentication-and-sso"}
        >{$_("pages.builder.portal.settings.auth.index.documentation")}</Link
      >
      {$_("pages.builder.portal.settings.auth.index.feature")}
    </Body>
  </Layout>
  {#if providers.google}
    <Divider />
    <Layout gap="XS" noPadding>
      <Heading size="S">
        <div class="provider-title">
          <GoogleLogo />
          <span>Google</span>
        </div>
      </Heading>
      <Body size="S">
        {$_("pages.builder.portal.settings.auth.index.users_authenticate")}
        <Link size="M" href={"https://docs.budibase.com/docs/sso-with-google"}
          >{$_("pages.builder.portal.settings.auth.index.documentation")}</Link
        >
        {$_("pages.builder.portal.settings.auth.index.for_information")}
      </Body>
    </Layout>
    <Layout gap="XS" noPadding>
      {#each GoogleConfigFields.Google as field}
        <div class="form-row">
          <Label size="L" tooltip={field.tooltip}>{field.label}</Label>
          <div class="inputContainer">
            <div class="input">
              <Input
                bind:value={providers.google.config[field.name]}
                readonly={field.readonly}
                placeholder={field.placeholder}
              />
            </div>
            {#if field.copyButton}
              <div
                class="copy"
                on:click={() => copyToClipboard(field.placeholder)}
              >
                <Icon size="S" name="Copy" />
              </div>
            {/if}
          </div>
        </div>
      {/each}
      <div class="form-row">
        <Label size="L"
          >{$_("pages.builder.portal.settings.auth.index.Activated")}</Label
        >
        <Toggle text="" bind:value={providers.google.config.activated} />
      </div>
    </Layout>
    <div>
      <Button
        disabled={googleSaveButtonDisabled}
        cta
        on:click={() => saveGoogle()}
      >
        {$_("pages.builder.portal.settings.auth.index.Save")}
      </Button>
    </div>
  {/if}
  {#if providers.oidc}
    <Divider />
    <Layout gap="XS" noPadding>
      <Heading size="S">
        <div class="provider-title">
          <OidcLogo />
          <span
            >{$_(
              "pages.builder.portal.settings.auth.index.OpenID_Connect"
            )}</span
          >
        </div>
      </Heading>
      <Body size="S">
        {$_("pages.builder.portal.settings.auth.index.users_authenticate_OIDC")}
      </Body>
    </Layout>
    <Layout gap="XS" noPadding>
      {#each OIDCConfigFields.Oidc as field}
        <div class="form-row">
          <Label size="L" tooltip={field.tooltip}>{field.label}</Label>
          <div class="inputContainer">
            <div class="input">
              <Input
                bind:value={providers.oidc.config.configs[0][field.name]}
                readonly={field.readonly}
                placeholder={field.placeholder}
              />
            </div>
            {#if field.copyButton}
              <div
                class="copy"
                on:click={() => copyToClipboard(field.placeholder)}
              >
                <Icon size="S" name="Copy" />
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </Layout>
    <Layout gap="XS" noPadding>
      <Body size="S">
        {$_("pages.builder.portal.settings.auth.index.customize_login")}
      </Body>
      <div class="form-row">
        <Label size="L"
          >{$_("pages.builder.portal.settings.auth.index.Name")}</Label
        >
        <Input bind:value={providers.oidc.config.configs[0].name} />
      </div>
      <div class="form-row">
        <Label size="L"
          >{$_("pages.builder.portal.settings.auth.index.Icon")}</Label
        >
        <Select
          label=""
          bind:value={providers.oidc.config.configs[0].logo}
          useOptionIconImage
          options={iconDropdownOptions}
          on:change={e => e.detail === "Upload" && fileinput.click()}
        />
      </div>
      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        on:change={e => onFileSelected(e)}
        bind:this={fileinput}
      />
      <div class="form-row">
        <Label size="L"
          >{$_("pages.builder.portal.settings.auth.index.Activated")}</Label
        >
        <Toggle
          text=""
          bind:value={providers.oidc.config.configs[0].activated}
        />
      </div>
    </Layout>

    <Layout gap="XS" noPadding>
      <div class="provider-title">
        <Heading size="S"
          >{$_(
            "pages.builder.portal.settings.auth.index.Authentication_scopes"
          )}</Heading
        >
        <Button
          secondary
          size="S"
          on:click={() => {
            providers.oidc.config.configs[0]["scopes"] = [...defaultScopes]
          }}
        >
          {$_("pages.builder.portal.settings.auth.index.Restore_Defaults")}
        </Button>
      </div>
      <Body size="S">
        {$_("pages.builder.portal.settings.auth.index.Changes_authentication")}
      </Body>
    </Layout>

    <Layout gap="XS" noPadding>
      <div class="form-row">
        <Label size="L"
          >{$_("pages.builder.portal.settings.auth.index.Auth_Scopes")}</Label
        >
        <Input
          error={scopesFields[0].error}
          placeholder={"New Scope"}
          bind:value={scopesFields[0].inputText}
          on:keyup={e => {
            if (!scopesFields[0].inputText) {
              scopesFields[0].error = null
            }
            if (
              e.key === "Enter" ||
              e.keyCode === 13 ||
              e.code == "Space" ||
              e.keyCode == 32
            ) {
              let scopes = providers.oidc.config.configs[0]["scopes"]
                ? providers.oidc.config.configs[0]["scopes"]
                : [...defaultScopes]

              let update = scopesFields[0].inputText.trim()

              if (HasSpacesRegex.test(update)) {
                scopesFields[0].error = $_(
                  "pages.builder.portal.settings.auth.index.Auth_scopes"
                )
                return
              } else if (scopes.indexOf(update) > -1) {
                scopesFields[0].error = $_(
                  "pages.builder.portal.settings.auth.index.Auth_exists"
                )
                return
              } else if (!update.length) {
                scopesFields[0].inputText = null
                scopesFields[0].error = null
                return
              } else {
                scopesFields[0].error = null
                scopes.push(update)
                providers.oidc.config.configs[0]["scopes"] = scopes
                scopesFields[0].inputText = null
              }
            }
          }}
        />
      </div>
      <div class="form-row">
        <span />
        <Tags>
          <Tag closable={false}>openid</Tag>
          {#each providers.oidc.config.configs[0]["scopes"] || [...defaultScopes] as tag, idx}
            <Tag
              closable={scopesFields[0].editing}
              on:click={() => {
                let idxScopes = providers.oidc.config.configs[0]["scopes"]
                if (idxScopes.length == 1) {
                  idxScopes.pop()
                } else {
                  idxScopes.splice(idx, 1)
                  refreshScopes(0)
                }
              }}
            >
              {tag}
            </Tag>
          {/each}
        </Tags>
      </div>
    </Layout>
    <div>
      <Button disabled={oidcSaveButtonDisabled} cta on:click={() => saveOIDC()}>
        {$_("pages.builder.portal.settings.auth.index.Save")}
      </Button>
    </div>
  {/if}
</Layout>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 120px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }

  input[type="file"] {
    display: none;
  }
  .sso-link-icon {
    padding-top: 4px;
    margin-left: 3px;
  }
  .sso-link {
    margin-top: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .enforce-sso-title {
    margin-right: 10px;
  }
  .enforce-sso-heading-container {
    display: flex;
    flex-direction: row;
    align-items: start;
  }
  .provider-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }
  .provider-title span {
    flex: 1 1 auto;
  }
  .inputContainer {
    display: flex;
    flex-direction: row;
  }
  .input {
    flex: 1;
  }
  .copy {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
</style>
