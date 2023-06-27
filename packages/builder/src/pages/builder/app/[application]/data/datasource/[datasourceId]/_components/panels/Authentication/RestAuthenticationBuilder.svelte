<script>
  import { Table, Modal, Layout, ActionButton } from "@budibase/bbui"
  import AuthTypeRenderer from "./AuthTypeRenderer.svelte"
  import RestAuthenticationModal from "./RestAuthenticationModal.svelte"
  import { Helpers } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  export let authConfigs = []

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
      newAuthConfigs = authConfigs.map(c => {
        // replace the current config with the new one
        if (c._id === currentConfig._id) {
          return config
        }
        return c
      })
    } else {
      config._id = Helpers.uuid()
      newAuthConfigs = [...authConfigs, config]
    }

    dispatch("change", newAuthConfigs)
  }

  const onRemove = () => {
    const newAuthConfigs = authConfigs.filter(c => {
      return c._id !== currentConfig._id
    })

    dispatch("change", newAuthConfigs)
  }
</script>

<Modal bind:this={modal}>
  <RestAuthenticationModal
    configs={authConfigs}
    {currentConfig}
    {onConfirm}
    {onRemove}
  />
</Modal>

<Layout gap="S" noPadding>
  {#if authConfigs && authConfigs.length > 0}
    <Table
      on:click={({ detail }) => openConfigModal(detail)}
      {schema}
      data={authConfigs}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      customRenderers={[{ column: "type", component: AuthTypeRenderer }]}
    />
  {/if}
  <div>
    <ActionButton on:click={() => openConfigModal()} icon="Add"
      >Add authentication</ActionButton
    >
  </div>
</Layout>
