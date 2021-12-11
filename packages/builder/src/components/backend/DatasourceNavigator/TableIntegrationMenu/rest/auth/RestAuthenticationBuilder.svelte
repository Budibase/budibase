<script>
  import { Table, Modal, Layout, ActionButton } from "@budibase/bbui"
  import AuthTypeRenderer from "./AuthTypeRenderer.svelte"
  import RestAuthenticationModal from "./RestAuthenticationModal.svelte"

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
      // TODO: Update with _id
      configs = configs.map(c => {
        // replace the current config with the new one
        if (c.name === currentConfig.name) {
          return config
        }
        return c
      })
    } else {
      configs.push(config)
      configs = [...configs]
    }
  }

  const onDelete = () => {
    // TODO: Update with _id
    configs = configs.filter(c => {
      return c.name !== currentConfig.name
    })
  }
</script>

<Modal bind:this={modal}>
  <RestAuthenticationModal {configs} {currentConfig} {onConfirm} {onDelete} />
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
    <ActionButton on:click={() => openConfigModal()} con="Add"
      >Add authentication</ActionButton
    >
  </div>
</Layout>
