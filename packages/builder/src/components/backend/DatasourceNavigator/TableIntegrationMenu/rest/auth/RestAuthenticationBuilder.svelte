<script>
  import { Table, Modal, Layout, ActionButton } from "@budibase/bbui"
  import AuthTypeRenderer from "./AuthTypeRenderer.svelte"
  import RestAuthenticationModal from "./RestAuthenticationModal.svelte"
  import { Helpers } from "@budibase/bbui"

  export let configs = []

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
    if (currentConfig) {
      configs = configs.map(c => {
        // replace the current config with the new one
        if (c._id === currentConfig._id) {
          return config
        }
        return c
      })
    } else {
      config._id = Helpers.uuid()
      configs = [...configs, config]
    }
  }

  const onRemove = () => {
    configs = configs.filter(c => {
      return c._id !== currentConfig._id
    })
  }
</script>

<Modal bind:this={modal}>
  <RestAuthenticationModal {configs} {currentConfig} {onConfirm} {onRemove} />
</Modal>

<Layout gap="S" noPadding>
  {#if configs && configs.length > 0}
    <Table
      on:click={({ detail }) => openConfigModal(detail)}
      {schema}
      data={configs}
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
