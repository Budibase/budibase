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
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { API } from "api"
  import { organisation, admin } from "stores/portal"
  import { Helpers } from "@budibase/bbui"

  const ConfigTypes = {
    Google: "google",
    OIDC: "oidc",
  }

  const HasSpacesRegex = /[\\"\s]/

  // Some older google configs contain a manually specified value - retain the functionality to edit the field
  // When there is no value or we are in the cloud - prohibit editing the field, must use platform url to change
  $: googleCallbackUrl = undefined
  $: googleCallbackReadonly = $admin.cloud || !googleCallbackUrl

  // Indicate to user that callback is based on platform url
  // If there is an existing value, indicate that it may be removed to return to default behaviour
  $: googleCallbackTooltip = googleCallbackReadonly
    ? "Vist the organisation page to update the platform URL"
    : "Leave blank to use the default callback URL"

  $: GoogleConfigFields = {
    Google: [
      { name: "clientID", label: "Client ID" },
      { name: "clientSecret", label: "Client secret" },
      {
        name: "callbackURL",
        label: "Callback URL",
        readonly: googleCallbackReadonly,
        tooltip: googleCallbackTooltip,
        placeholder: $organisation.googleCallbackUrl,
      },
    ],
  }

  $: OIDCConfigFields = {
    Oidc: [
      { name: "configUrl", label: "Config URL" },
      { name: "clientID", label: "Client ID" },
      { name: "clientSecret", label: "Client Secret" },
      {
        name: "callbackURL",
        readonly: true,
        tooltip: "Vist the organisation page to update the platform URL",
        label: "Callback URL",
        placeholder: $organisation.oidcCallbackUrl,
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
  let originalGoogleDoc
  let originalOidcDoc
  let googleSaveButtonDisabled
  let oidcSaveButtonDisabled
  $: {
    isEqual(providers.google?.config, originalGoogleDoc?.config)
      ? (googleSaveButtonDisabled = true)
      : (googleSaveButtonDisabled = false)
    isEqual(providers.oidc?.config, originalOidcDoc?.config)
      ? (oidcSaveButtonDisabled = true)
      : (oidcSaveButtonDisabled = false)
  }

  // Create a flag so that it will only try to save completed forms
  $: partialGoogle =
    providers.google?.config?.clientID || providers.google?.config?.clientSecret
  $: partialOidc =
    providers.oidc?.config?.configs[0].configUrl ||
    providers.oidc?.config?.configs[0].clientID ||
    providers.oidc?.config?.configs[0].clientSecret
  $: googleComplete =
    providers.google?.config?.clientID && providers.google?.config?.clientSecret
  $: oidcComplete =
    providers.oidc?.config?.configs[0].configUrl &&
    providers.oidc?.config?.configs[0].clientID &&
    providers.oidc?.config?.configs[0].clientSecret

  const onFileSelected = e => {
    let fileName = e.target.files[0].name
    image = e.target.files[0]
    providers.oidc.config.configs[0].logo = fileName
    iconDropdownOptions.unshift({ label: fileName, value: fileName })
  }

  async function save(docs) {
    let calls = []
    // Only if the user has provided an image, upload it
    if (image) {
      let data = new FormData()
      data.append("file", image)
      calls.push(
        API.uploadOIDCLogo({
          name: image.name,
          data,
        })
      )
    }
    docs.forEach(element => {
      // Delete unsupported fields
      delete element.createdAt
      delete element.updatedAt

      if (element.type === ConfigTypes.OIDC) {
        // Add a UUID here so each config is distinguishable when it arrives at the login page
        for (let config of element.config.configs) {
          if (!config.uuid) {
            config.uuid = Helpers.uuid()
          }
          // Callback urls shouldn't be included
          delete config.callbackURL
        }
        if (partialOidc) {
          if (!oidcComplete) {
            notifications.error(
              `Please fill in all required ${ConfigTypes.OIDC} fields`
            )
          } else {
            calls.push(API.saveConfig(element))
            // Turn the save button grey when clicked
            oidcSaveButtonDisabled = true
            originalOidcDoc = cloneDeep(providers.oidc)
          }
        }
      }
      if (element.type === ConfigTypes.Google) {
        if (partialGoogle) {
          if (!googleComplete) {
            notifications.error(
              `Please fill in all required ${ConfigTypes.Google} fields`
            )
          } else {
            calls.push(API.saveConfig(element))
            googleSaveButtonDisabled = true
            originalGoogleDoc = cloneDeep(providers.google)
          }
        }
      }
    })
    if (calls.length) {
      Promise.all(calls)
        .then(data => {
          data.forEach(res => {
            providers[res.type]._rev = res._rev
            providers[res.type]._id = res._id
          })
          notifications.success(`Settings saved`)
        })
        .catch(() => {
          notifications.error("Failed to update auth settings")
        })
    }
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

  onMount(async () => {
    try {
      await organisation.init()
    } catch (error) {
      notifications.error("Error getting org config")
    }

    // Fetch Google config
    let googleDoc
    try {
      googleDoc = await API.getConfig(ConfigTypes.Google)
    } catch (error) {
      notifications.error("Error fetching Google OAuth config")
    }
    if (!googleDoc?._id) {
      providers.google = {
        type: ConfigTypes.Google,
        config: { activated: true },
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
      notifications.error("Error fetching OIDC logos")
    }
    if (oidcLogos?.config) {
      const logoKeys = Object.keys(oidcLogos.config)
      logoKeys.map(logoKey => {
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
        config: { configs: [{ activated: true, scopes: defaultScopes }] },
      }
    } else {
      originalOidcDoc = cloneDeep(oidcDoc)
      providers.oidc = oidcDoc
    }
  })
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading size="M">Authentication</Heading>
    <Body>
      Every budibase app comes with basic authentication (email/password)
      included. You can add additional authentication methods from the options
      below.
    </Body>
  </Layout>
  {#if providers.google}
    <Divider />
    <Layout gap="XS" noPadding>
      <Heading size="S">
        <div class="provider-title">
          <GoogleLogo />
          <span>Google</span>
          <Button
            disabled={googleSaveButtonDisabled}
            size="s"
            cta
            on:click={() => save([providers.google])}
          >
            Save
          </Button>
        </div>
      </Heading>
      <Body size="S">
        To allow users to authenticate using their Google accounts, fill out the
        fields below.
      </Body>
    </Layout>
    <Layout gap="XS" noPadding>
      {#each GoogleConfigFields.Google as field}
        <div class="form-row">
          <Label size="L" tooltip={field.tooltip}>{field.label}</Label>
          <Input
            bind:value={providers.google.config[field.name]}
            readonly={field.readonly}
            placeholder={field.placeholder}
          />
        </div>
      {/each}
      <div class="form-row">
        <Label size="L">Activated</Label>
        <Toggle text="" bind:value={providers.google.config.activated} />
      </div>
    </Layout>
  {/if}
  {#if providers.oidc}
    <Divider />
    <Layout gap="XS" noPadding>
      <Heading size="S">
        <div class="provider-title">
          <OidcLogo />
          <span>OpenID Connect</span>
          <Button
            disabled={oidcSaveButtonDisabled}
            size="s"
            cta
            on:click={() => save([providers.oidc])}
            dataCy={"oidc-save"}
          >
            Save
          </Button>
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
          <Input
            bind:value={providers.oidc.config.configs[0][field.name]}
            readonly={field.readonly}
            placeholder={field.placeholder}
            dataCy={field.name}
          />
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
          dataCy={"oidc-active"}
          text=""
          bind:value={providers.oidc.config.configs[0].activated}
        />
      </div>
    </Layout>
    <span class="advanced-config">
      <Layout gap="XS" noPadding>
        <Heading size="XS">
          <div class="auth-scopes">
            <div>Advanced</div>
            <Button
              secondary
              newStyles
              size="S"
              on:click={() => {
                providers.oidc.config.configs[0]["scopes"] = [...defaultScopes]
              }}
              dataCy={"restore-oidc-default-scopes"}
            >
              Restore Defaults
            </Button>
          </div>
        </Heading>
        <Body size="S">
          Changes to your authentication scopes will only take effect when you
          next log in. Please refer to your vendor documentation before
          modification.
        </Body>

        <div class="auth-form">
          <span class="add-new">
            <Label size="L">{"Auth Scopes"}</Label>
            <Input
              dataCy={"new-scope-input"}
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
          </span>
          <div class="tag-wrap">
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
        </div>
      </Layout>
    </span>
  {/if}
</Layout>

<style>
  .auth-scopes {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .advanced-config :global(.spectrum-Tags-item) {
    margin-left: 0px;
    margin-top: var(--spacing-m);
    margin-right: var(--spacing-m);
  }

  .auth-form > * {
    display: grid;
    grid-gap: var(--spacing-l);
    grid-template-columns: 100px 1fr;
  }

  .advanced-config .auth-form .tag-wrap {
    padding: 0px 5px 5px 0px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 100px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }

  input[type="file"] {
    display: none;
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
</style>
