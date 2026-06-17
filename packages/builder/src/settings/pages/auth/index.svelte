<script>
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
  import { API } from "@/api"
  import { organisation } from "@/stores/portal/organisation"
  import { admin } from "@/stores/portal/admin"
  import { licensing } from "@/stores/portal/licensing"
  import { PKCEMethod } from "@budibase/types"
  import Scim from "./scim.svelte"
  import Google from "./google.svelte"

  const ConfigTypes = {
    OIDC: "oidc",
  }
  const HasSpacesRegex = /[\\"\s]/
  const pkceOptions = [
    { label: "S256 (recommended)", value: PKCEMethod.S256 },
    { label: "Plain", value: PKCEMethod.PLAIN },
  ]
  let defaultScopes = ["profile", "email", "offline_access"]
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
      label: "Upload your own",
      value: "Upload",
    },
  ]

  let fileinput
  let image
  let google
  let oidc
  let providers = { google, oidc }

  // control the state of the save button depending on whether form has changed
  let originalOidcDoc
  let oidcSaveButtonDisabled

  let scopesFields = [
    {
      editing: true,
      inputText: null,
      error: null,
    },
  ]
  $: enforcedSSO = $organisation.isSSOEnforced

  $: oidcConfig = providers?.oidc?.config?.configs?.[0]

  $: OIDCConfigFields = {
    Oidc: [
      { name: "configUrl", label: "Config URL" },
      { name: "clientID", label: "Client ID" },
      { name: "clientSecret", label: "Client Secret" },
      {
        name: "callbackURL",
        readonly: true,
        tooltip: $admin.cloud
          ? null
          : "Vist the organisation page to update the platform URL",
        label: "Callback URL",
        placeholder: $organisation.oidcCallbackUrl,
        copyButton: true,
      },
    ],
  }

  $: {
    const current = normaliseOidcConfig({ configs: [oidcConfig] })
    const original = normaliseOidcConfig({
      configs: [originalOidcDoc?.config?.configs?.[0]],
    })
    oidcSaveButtonDisabled = isEqual(current, original)
  }

  $: oidcComplete = !!(
    oidcConfig?.configUrl &&
    oidcConfig?.clientID &&
    oidcConfig?.clientSecret
  )

  const onFileSelected = e => {
    let fileName = e.target.files[0].name
    image = e.target.files[0]
    providers.oidc.config.configs[0].logo = fileName
    providers = providers
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
      await API.uploadOIDCLogo(image.name, data)
    }
  }

  async function saveOIDC() {
    if (!oidcComplete) {
      notifications.error(
        `Please fill in all required ${ConfigTypes.OIDC} fields`
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
      notifications.success(`Settings saved`)
    } catch (e) {
      notifications.error(e.message)
      return
    }

    // Turn the save button grey when clicked
    oidcSaveButtonDisabled = true
    originalOidcDoc = cloneDeep(providers.oidc)
  }

  const RENDER_INJECTED_FIELDS = ["callbackURL", "pkce"]

  const normaliseOidcConfig = config => {
    if (!config?.configs) return config
    return {
      ...config,
      configs: config.configs.map(c =>
        c
          ? Object.fromEntries(
              Object.entries(c).filter(
                ([k, v]) =>
                  !RENDER_INJECTED_FIELDS.includes(k) ||
                  (v !== undefined && v !== null)
              )
            )
          : c
      ),
    }
  }

  const setOidcScopes = scopes => {
    providers.oidc.config.configs[0].scopes = scopes
    providers = providers
  }

  const onScopeKeyup = e => {
    const field = scopesFields[0]
    if (!field.inputText) {
      field.error = null
    }

    if (e.key !== "Enter" && e.keyCode !== 13) {
      return
    }

    const update = field.inputText?.trim() ?? ""
    const scopes = oidcConfig.scopes ?? [...defaultScopes]

    if (!update.length) {
      field.inputText = null
      field.error = null
    } else if (HasSpacesRegex.test(update)) {
      field.error =
        "Auth scopes cannot contain spaces, double quotes or backslashes"
    } else if (scopes.indexOf(update) > -1) {
      field.error = "Auth scope already exists"
    } else {
      scopesFields[0] = { ...field, error: null, inputText: null }
      setOidcScopes([...scopes, update])
    }
  }

  const copyToClipboard = async value => {
    await Helpers.copyToClipboard(value)
    notifications.success("Copied")
  }

  onMount(async () => {
    try {
      await organisation.init()
    } catch (error) {
      notifications.error("Error getting org config")
    }

    // Get the list of user uploaded logos and push it to the dropdown options.
    // This needs to be done before the config call so they're available when
    // the dropdown renders.
    let oidcLogos
    try {
      oidcLogos = await API.getOIDCLogos()
    } catch (error) {
      notifications.error("Error fetching OIDC logos")
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
      notifications.error("Error fetching OIDC config")
    }
    if (!oidcDoc?._id) {
      providers.oidc = {
        type: ConfigTypes.OIDC,
        config: { configs: [{ activated: false, scopes: defaultScopes }] },
      }
    } else {
      if (!oidcDoc.config.configs[0].scopes) {
        oidcDoc.config.configs[0].scopes = [...defaultScopes]
      }
      providers.oidc = oidcDoc
    }
    originalOidcDoc = cloneDeep(providers.oidc)
    delete originalOidcDoc?.config?.configs[0]?.callbackURL
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<Layout noPadding gap="S">
  <Layout noPadding gap="XS">
    <Heading size="XS">Single Sign-On URL</Heading>
    <Body size="S">
      Use the following link to access your configured identity provider.
    </Body>
    <Body size="S">
      <div class="sso-link">
        <Link href={$organisation.platformUrl} target="_blank"
          >{$organisation.platformUrl}</Link
        >
        <div class="sso-link-icon">
          <Icon size="XS" name="arrow-square-out" />
        </div>
      </div>
    </Body>
  </Layout>
  <Divider noMargin />
  <Layout noPadding gap="XS">
    <div class="provider-title">
      <div class="enforce-sso-heading-container">
        <div class="enforce-sso-title">
          <Heading size="XS">Enforce Single Sign-On</Heading>
        </div>
        {#if !$licensing.enforceableSSO}
          <Tags>
            <Tag icon="lock">Enterprise plan</Tag>
          </Tags>
        {/if}
      </div>
      {#if $licensing.enforceableSSO}
        <Toggle on:change={toggleIsSSOEnforced} bind:value={enforcedSSO} />
      {/if}
    </div>
    <Body size="S">
      Require SSO authentication for all users. It is recommended to read the
      help <Link
        size="M"
        href={"https://docs.budibase.com/docs/authentication-and-sso"}
        >documentation</Link
      > before enabling this feature.
    </Body>
  </Layout>
  <Google />
  {#if providers.oidc}
    <Divider noMargin />
    <Layout gap="XS" noPadding>
      <Heading size="XS">
        <div class="provider-title">
          <OidcLogo />
          <span>OpenID Connect</span>
        </div>
      </Heading>
      <Body size="S">
        To allow users to authenticate using OIDC, fill out the fields below.
      </Body>
    </Layout>
    <Layout gap="XS" noPadding>
      {#each OIDCConfigFields.Oidc as field}
        <div class="form-row">
          <Label size="L" tooltip={field.tooltip}>{field.label}</Label>
          <div class="inputContainer">
            <div class="input">
              <Input
                bind:value={oidcConfig[field.name]}
                readonly={field.readonly}
                placeholder={field.placeholder}
              />
            </div>
            {#if field.copyButton}
              <div
                class="copy"
                on:click={() => copyToClipboard(field.placeholder)}
              >
                <Icon size="S" name="copy" />
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </Layout>
    <Layout gap="XS" noPadding>
      <Body size="S">
        To customize your login button, fill out the fields below.
      </Body>
      <div class="form-row">
        <Label size="L">Name</Label>
        <Input bind:value={oidcConfig.name} />
      </div>
      <div class="form-row">
        <Label size="L">Icon</Label>
        <Select
          label=""
          bind:value={oidcConfig.logo}
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
        <div class="lock">
          <Label size="L">PKCE Method</Label>
          {#if !$licensing.pkceOidcEnabled}
            <Icon name="lock" size="S" />
          {/if}
        </div>
        {#if $licensing.pkceOidcEnabled}
          <Select
            placeholder="None"
            bind:value={oidcConfig.pkce}
            options={pkceOptions}
          />
        {:else}
          <Body size="XS">
            PKCE support is only available on enterprise licenses.
          </Body>
        {/if}
      </div>
      <div class="form-row">
        <Label size="L">Activated</Label>
        <Toggle text="" bind:value={oidcConfig.activated} />
      </div>
    </Layout>

    <Layout gap="XS" noPadding>
      <div class="provider-title">
        <Heading size="XS">Authentication scopes</Heading>
        <Button
          secondary
          size="S"
          on:click={() => {
            setOidcScopes([...defaultScopes])
          }}
        >
          Restore Defaults
        </Button>
      </div>
      <Body size="S">
        Changes to your authentication scopes will only take effect when you
        next log in.
      </Body>
    </Layout>

    <Layout gap="XS" noPadding>
      <div class="form-row">
        <Label size="L">Auth Scopes</Label>
        <Input
          error={scopesFields[0].error}
          placeholder={"New Scope"}
          bind:value={scopesFields[0].inputText}
          on:keyup={onScopeKeyup}
        />
      </div>
      <div class="form-row">
        <span></span>
        <Tags>
          <Tag closable={false}>openid</Tag>
          {#each oidcConfig.scopes || [...defaultScopes] as tag, idx}
            <Tag
              closable={scopesFields[0].editing}
              on:remove={() => {
                setOidcScopes(oidcConfig.scopes.filter((_, i) => i !== idx))
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
        Save
      </Button>
    </div>
  {/if}
  {#if $licensing.scimEnabled}
    <Divider noMargin />
    <Scim />
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
  .lock {
    display: flex;
    gap: var(--spacing-s);
  }
</style>
