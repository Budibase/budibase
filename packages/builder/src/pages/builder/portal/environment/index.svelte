<script>
  import {
    Layout,
    Heading,
    Body,
    Button,
    Select,
    Divider,
    Modal,
    ModalContent,
    Search,
    Page,
    Table,
    Input,
    Checkbox,
  } from "@budibase/bbui"
  import { envVars } from "stores/portal"
  import { onMount } from "svelte"
  import EditVariableModal from "./_components/editVariableModal.svelte"

  let modal

  let useProductionValue = true

  let developmentValue
  let productionValue
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

  const customRenderers = [{ column: "edit", component: EditVariableModal }]

  onMount(async () => {
    await envVars.load()
  })
</script>

<Page narrow>
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
        data={$envVars}
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
</Page>

<Modal bind:this={modal}>
  <ModalContent title="Add new environment variable">
    <Input label="Name" value="" />

    <div>
      <Heading size="XS">Production</Heading>
      <Input type="password" label="Value" bind:value={productionValue} />
    </div>
    <div>
      <Heading size="XS">Development</Heading>
      <Input
        type="password"
        disabled={useProductionValue}
        label="Value"
        bind:value={developmentValue}
      />
      <Checkbox
        on:change={() => {
          developmentValue = productionValue
        }}
        bind:value={useProductionValue}
        text="Use production value"
      />
    </div>
  </ModalContent>
</Modal>

<style>
</style>
