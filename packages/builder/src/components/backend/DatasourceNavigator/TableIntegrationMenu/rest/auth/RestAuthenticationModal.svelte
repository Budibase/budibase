<script>
  import { onMount } from "svelte"
  import {
    ModalContent,
    Layout,
    Select,
    Body,
    Input,
    EnvDropdown,
    Modal,
    notifications,
  } from "@budibase/bbui"
  import { AUTH_TYPE_LABELS, AUTH_TYPES } from "./authTypes"
  import BindableCombobox from "components/common/bindings/BindableCombobox.svelte"
  import {
    getAuthBindings,
    getEnvironmentBindings,
  } from "builderStore/dataBinding"
  import { environment, licensing, auth } from "stores/portal"
  import CreateEditVariableModal from "components/portal/environment/CreateEditVariableModal.svelte"
  import { _ } from "../../../../../../../lang/i18n"

  export let configs
  export let currentConfig
  export let onConfirm
  export let onRemove

  let form = {
    basic: {},
    bearer: {},
  }

  let errors = {
    basic: {},
    bearer: {},
  }

  let blurred = {
    basic: {},
    bearer: {},
  }

  let hasErrors = false
  let hasChanged = false

  let createVariableModal
  let formFieldkey

  onMount(async () => {
    try {
      await environment.loadVariables()
      if ($auth.user) {
        await licensing.init()
      }
    } catch (err) {
      console.error(err)
    }

    if (currentConfig) {
      deconstructConfig()
    }
  })

  /**
   * map the current config's data into the form by type
   */
  const deconstructConfig = () => {
    form.name = currentConfig.name
    form.type = currentConfig.type

    if (currentConfig.type === AUTH_TYPES.BASIC) {
      form.basic = {
        ...currentConfig.config,
      }
    } else if (currentConfig.type === AUTH_TYPES.BEARER) {
      form.bearer = {
        ...currentConfig.config,
      }
    }
  }

  /**
   * map the form into a new config to save by type
   */
  const constructConfig = () => {
    const newConfig = {
      name: form.name,
      type: form.type,
    }

    if (currentConfig) {
      newConfig._id = currentConfig._id
    }

    if (form.type === AUTH_TYPES.BASIC) {
      newConfig.config = {
        ...form.basic,
      }
    } else if (form.type === AUTH_TYPES.BEARER) {
      newConfig.config = {
        ...form.bearer,
      }
    }

    return newConfig
  }

  /**
   * compare the existing config with the new config to see if there are any changes
   */
  const checkChanged = () => {
    if (currentConfig) {
      hasChanged =
        JSON.stringify(currentConfig) !== JSON.stringify(constructConfig())
    } else {
      hasChanged = true
    }
  }

  const checkErrors = () => {
    hasErrors = false

    // NAME
    const nameError = () => {
      // Unique name
      if (form.name) {
        errors.name =
          // check for duplicate excluding the current config
          configs.find(
            c => c.name === form.name && c.name !== currentConfig?.name
          ) !== undefined
            ? $_(
                "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.Name_unique"
              )
            : null
      }
      // Name required
      else {
        errors.name = $_(
          "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.Name_required"
        )
      }
      return !!errors.name
    }

    // TYPE
    const typeError = () => {
      errors.type = form.type
        ? null
        : $_(
            "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.Type_required"
          )
      return !!errors.type
    }

    // BASIC AUTH
    const basicAuthErrors = () => {
      errors.basic.username = form.basic.username
        ? null
        : $_(
            "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.Username_required"
          )
      errors.basic.password = form.basic.password
        ? null
        : $_(
            "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.Password_required"
          )

      return !!(errors.basic.username || errors.basic.password || commonError)
    }

    // BEARER TOKEN
    const bearerTokenErrors = () => {
      errors.bearer.token = form.bearer.token
        ? null
        : $_(
            "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.Token_required"
          )
      return !!(errors.bearer.token || commonError)
    }

    const commonError = nameError() || typeError()
    if (form.type === AUTH_TYPES.BASIC) {
      hasErrors = basicAuthErrors() || commonError
    } else if (form.type === AUTH_TYPES.BEARER) {
      hasErrors = bearerTokenErrors() || commonError
    } else {
      hasErrors = !!commonError
    }
  }

  const save = async data => {
    try {
      await environment.createVariable(data)
      form.basic[formFieldkey] = `{{ env.${data.name} }}`
      createVariableModal.hide()
    } catch (err) {
      notifications.error(
        `${$_(
          "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.Failed_create"
        )} ${err.message}`
      )
    }
  }

  const onFieldChange = () => {
    checkErrors()
    checkChanged()
  }

  const onConfirmInternal = () => {
    onConfirm(constructConfig())
  }

  async function handleUpgradePanel() {
    await environment.upgradePanelOpened()
    $licensing.goToUpgradePage()
  }

  function showModal(key) {
    formFieldkey = key
    createVariableModal.show()
  }
</script>

<ModalContent
  title={currentConfig
    ? $_(
        "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.Update_Authentication"
      )
    : $_(
        "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.Add_Authentication"
      )}
  onConfirm={onConfirmInternal}
  confirmText={currentConfig
    ? $_(
        "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.Update"
      )
    : $_(
        "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.Add"
      )}
  disabled={hasErrors || !hasChanged}
  cancelText={$_(
    "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.Cancel"
  )}
  size="M"
  showSecondaryButton={!!currentConfig}
  secondaryButtonText={$_(
    "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.Remove"
  )}
  secondaryAction={onRemove}
  secondaryButtonWarning={true}
>
  <Layout gap="S">
    <Body size="S">
      {$_(
        "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.authorization"
      )}
    </Body>
    <Input
      label={$_(
        "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.Name"
      )}
      bind:value={form.name}
      on:change={onFieldChange}
      on:blur={() => (blurred.name = true)}
      error={blurred.name ? errors.name : null}
    />
    <Select
      label={$_(
        "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.Type"
      )}
      bind:value={form.type}
      on:change={onFieldChange}
      options={AUTH_TYPE_LABELS}
      on:blur={() => (blurred.type = true)}
      error={blurred.type ? errors.type : null}
    />
    {#if form.type === AUTH_TYPES.BASIC}
      <EnvDropdown
        label={$_(
          "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.Username"
        )}
        bind:value={form.basic.username}
        on:change={onFieldChange}
        on:blur={() => (blurred.basic.username = true)}
        error={blurred.basic.username ? errors.basic.username : null}
        showModal={() => showModal("configKey")}
        variables={$environment.variables}
        environmentVariablesEnabled={$licensing.environmentVariablesEnabled}
        {handleUpgradePanel}
      />
      <EnvDropdown
        label={$_(
          "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.Password"
        )}
        type="password"
        bind:value={form.basic.password}
        on:change={onFieldChange}
        on:blur={() => (blurred.basic.password = true)}
        error={blurred.basic.password ? errors.basic.password : null}
        showModal={() => showModal("configKey")}
        variables={$environment.variables}
        environmentVariablesEnabled={$licensing.environmentVariablesEnabled}
        {handleUpgradePanel}
      />
    {/if}
    {#if form.type === AUTH_TYPES.BEARER}
      <BindableCombobox
        label={$_(
          "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.RestAuthenicationModal.Token"
        )}
        value={form.bearer.token}
        bindings={[
          ...getAuthBindings(),
          ...($licensing.environmentVariablesEnabled
            ? getEnvironmentBindings()
            : []),
        ]}
        on:change={e => {
          form.bearer.token = e.detail
          onFieldChange()
        }}
        on:blur={() => {
          blurred.bearer.token = true
          onFieldChange()
        }}
        allowJS={false}
        placeholder="Token"
        appendBindingsAsOptions={true}
        drawerEnabled={false}
        error={blurred.bearer.token ? errors.bearer.token : null}
      />
    {/if}
  </Layout>
</ModalContent>

<Modal bind:this={createVariableModal}>
  <CreateEditVariableModal {save} />
</Modal>
