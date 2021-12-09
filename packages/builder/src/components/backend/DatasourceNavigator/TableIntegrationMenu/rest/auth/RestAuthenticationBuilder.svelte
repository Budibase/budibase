<script>
  import {
    Table,
    Modal,
    ModalContent,
    Layout,
    ActionButton,
    Select,
    Body,
    Input,
  } from "@budibase/bbui"
  import AuthTypeRenderer from "./AuthTypeRenderer.svelte"
  import { AUTH_TYPE_LABELS, AUTH_TYPES } from "./authTypes"

  export let authConfigs = []

  let modal
  let currentConfig
  let isNew = false

  const schema = {
    name: "",
    type: "",
  }

  const openConfigModal = config => {
    if (!config) {
      currentConfig = {
        config: {},
      }
      isNew = true
    } else {
      currentConfig = { ...config }
      isNew = false
    }
    modal.show()
  }

  const onConfirm = () => {
    if (isNew) {
      authConfigs.push(currentConfig)
    } else {
      authConfigs = authConfigs.map(c => {
        if (c.name === currentConfig.name) {
          return currentConfig
        }
        return c
      })
    }
  }

  const onCancel = () => {
    currentConfig = {}
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    title={isNew ? "Add Authentication" : "Update Authentication"}
    {onConfirm}
    {onCancel}
    confirmText={isNew ? "Add" : "Update"}
    cancelText="Cancel"
    size="M"
  >
    <Layout gap="S">
      <Body size="S">
        The authorization header will be automatically generated when you
        sendthe request.
      </Body>
      <Select
        label="Type"
        bind:value={currentConfig.type}
        options={AUTH_TYPE_LABELS}
        on:change={({ detail }) => (currentConfig.type = detail)}
      />
      {#if currentConfig.type === AUTH_TYPES.BASIC}
        <Input label="Username" bind:value={currentConfig.config.username} />
        <Input label="Password" bind:value={currentConfig.config.password} />
      {/if}
      {#if currentConfig.type === AUTH_TYPES.BEARER}
        <Input label="Token" bind:value={currentConfig.config.token} />
      {/if}
    </Layout>
  </ModalContent>
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
    <ActionButton on:click={() => openConfigModal()} con="Add"
      >Add authentication</ActionButton
    >
  </div>
</Layout>

<style>
</style>
