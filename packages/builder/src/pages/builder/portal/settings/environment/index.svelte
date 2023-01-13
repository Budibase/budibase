<script>
  import {
    Layout,
    Heading,
    Body,
    Button,
    Divider,
    Modal,
    Table,
  } from "@budibase/bbui"
  import { environment } from "stores/portal"
  import { onMount } from "svelte"
  import CreateEditVariableModal from "./_components/CreateEditVariableModal.svelte"
  import EditVariableColumn from "./_components/EditVariableColumn.svelte"

  let modal

  const schema = {
    name: {
      width: "2fr",
    },
    edit: {
      width: "auto",
      borderLeft: true,
      displayName: "",
    },
  }

  const customRenderers = [{ column: "edit", component: EditVariableColumn }]

  onMount(async () => {
    await environment.loadVariables()
  })

  const save = data => {
    environment.createVariable(data)
    modal.hide()
  }
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading size="M">Envrironment Variables</Heading>
    <Body
      >Add and manage environment variable for development and production</Body
    >
  </Layout>
  <Divider size="S" />
  <Layout noPadding>
    <Table
      {schema}
      data={$environment}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      {customRenderers}
    />
  </Layout>
  <div>
    <Button on:click={modal.show} cta>Add Variable</Button>
  </div>
</Layout>

<Modal bind:this={modal}>
  <CreateEditVariableModal {save} />
</Modal>

<style>
</style>
