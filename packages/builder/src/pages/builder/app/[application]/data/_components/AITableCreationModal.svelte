<script lang="ts">
  import { API } from "@/api"
  import { datasources, tables } from "@/stores/builder"
  import {
    Modal,
    ModalContent,
    notifications,
    TextArea,
    Toggle,
  } from "@budibase/bbui"
  import type { GenerateTablesRequest } from "@budibase/types"
  import { goto } from "@roxi/routify"

  let modal: Modal

  let modalData: GenerateTablesRequest = {
    prompt: "",
    addData: true,
  }

  export function show() {
    modal.show()
  }

  export async function generate() {
    try {
      const { createdTables } = await API.generateTables(modalData)

      const [tableToRedirect] = createdTables.sort((a, b) =>
        a.name.localeCompare(b.name)
      )

      notifications.success(`Tables created successfully.`)
      await datasources.fetch()
      await tables.fetch()
      $goto(`./table/${tableToRedirect.id}`)
    } catch (e: any) {
      notifications.error(e.message)
    }
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    title="AI generation"
    size="XL"
    confirmText="Generate"
    onConfirm={generate}
    showCancelButton={false}
  >
    <TextArea label="Prompt" bind:value={modalData.prompt} />
    <Toggle label="Add data" bind:value={modalData.addData} />
  </ModalContent>
</Modal>
