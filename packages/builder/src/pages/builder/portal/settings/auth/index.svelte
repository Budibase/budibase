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
  import { organisation, admin, licensing } from "@/stores/portal"
  import Scim from "./scim.svelte"
  import Google from "./google.svelte"

  const ConfigTypes = {
    OIDC: "oidc",
  }

  const HasSpacesRegex = /[\\"\s]/

  $: enforcedSSO = $organisation.isSSOEnforced

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
  const providers = { google, oidc }

  // control the state of the save button depending on whether form has changed
  let originalOidcDoc
  let oidcSaveButtonDisabled
  $: {
    // delete the callback url which is never saved to the oidc
    // config doc, to ensure an accurate comparison
    delete providers.oidc?.config.configs[0].callbackURL

    isEqual(providers.oidc?.config, originalOidcDoc?.config)
      ? (oidcSaveButtonDisabled = true)
      : (oidcSaveButtonDisabled = false)
  }

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
      originalOidcDoc = cloneDeep(oidcDoc)
      providers.oidc = oidcDoc
    }
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading size="M">Authentication</Heading>
    <Body>Add additional authentication methods from the options below</Body>
  </Layout>
  <Divider />
  <Layout noPadding gap="XS">
    <Heading size="S">Single Sign-On URL</Heading>
    <Body size="S">
      Use the following link to access your configured identity provider.
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
          <Heading size="S">Enforce Single Sign-On</Heading>
        </div>
        {#if !$licensing.enforceableSSO}
          <Tags>
            <Tag icon="LockClosed">Enterprise plan</Tag>
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
    <Divider />
    <Layout gap="XS" noPadding>
      <Heading size="S">
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
        To customize your login button, fill out the fields below.
      </Body>
      <div class="form-row">
        <Label size="L">Name</Label>
        <Input bind:value={providers.oidc.config.configs[0].name} />
      </div>
      <div class="form-row">
        <Label size="L">Icon</Label>
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
        <Label size="L">Activated</Label>
        <Toggle
          text=""
          bind:value={providers.oidc.config.configs[0].activated}
        />
      </div>
    </Layout>

    <Layout gap="XS" noPadding>
      <div class="provider-title">
        <Heading size="S">Authentication scopes</Heading>
        <Button
          secondary
          size="S"
          on:click={() => {
            providers.oidc.config.configs[0]["scopes"] = [...defaultScopes]
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
                scopesFields[0].error =
                  "Auth scopes cannot contain spaces, double quotes or backslashes"
                return
              } else if (scopes.indexOf(update) > -1) {
                scopesFields[0].error = "Auth scope already exists"
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
        Save
      </Button>
    </div>
  {/if}
  {#if $licensing.scimEnabled}
    <Divider />
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
</style>
