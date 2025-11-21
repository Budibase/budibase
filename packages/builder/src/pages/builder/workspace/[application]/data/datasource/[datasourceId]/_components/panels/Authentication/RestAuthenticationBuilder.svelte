<script>
  import { Table, Modal, Layout, ActionButton, Helpers } from "@budibase/bbui"
  import AuthTypeRenderer from "./AuthTypeRenderer.svelte"
  import RestAuthenticationModal from "./RestAuthenticationModal.svelte"
  import { createEventDispatcher } from "svelte"

  export let authConfigs = []

  $: normalizedAuthConfigs = authConfigs ?? []

  const dispatch = createEventDispatcher()
  let currentConfig = null
  let modal

  const schema = {
    name: "",
    type: "",
  }

  const openConfigModal = config => {
    currentConfig = config
    modal.show()
  }

  const onConfirm = config => {
    let newAuthConfigs

    if (currentConfig) {
      newAuthConfigs = normalizedAuthConfigs.map(c => {
        // replace the current config with the new one
        if (c._id === currentConfig._id) {
          return config
        }
        return c
      })
    } else {
      config._id = Helpers.uuid()
      newAuthConfigs = [...normalizedAuthConfigs, config]
    }

    dispatch("change", newAuthConfigs)
  }

  const onRemove = () => {
    const newAuthConfigs = normalizedAuthConfigs.filter(c => {
      return c._id !== currentConfig._id
    })

    dispatch("change", newAuthConfigs)
  }
</script>

<Modal bind:this={modal}>
  <RestAuthenticationModal
    configs={normalizedAuthConfigs}
    {currentConfig}
    {onConfirm}
    {onRemove}
  />
</Modal>

<Layout gap="S" noPadding>
  {#if normalizedAuthConfigs && normalizedAuthConfigs.length > 0}
    <Table
      on:click={({ detail }) => openConfigModal(detail)}
      {schema}
      data={normalizedAuthConfigs}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      customRenderers={[{ column: "type", component: AuthTypeRenderer }]}
    />
  {/if}
  <div>
    <ActionButton on:click={() => openConfigModal()} icon="plus"
      >Add authentication</ActionButton
    >
  </div>
</Layout>
