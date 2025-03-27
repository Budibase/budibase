<script lang="ts">
  import { API } from "@/api"
  import { datasources, tables } from "@/stores/builder"
  import { Modal, ModalContent, notifications, TextArea } from "@budibase/bbui"
  import { goto } from "@roxi/routify"

  let modal: Modal
  let prompt: string =
    "I need a ticketing system where employees can submit tickets. A ticket has a title, description, priority, status, and an assigned technician"
  let result: string

  export function show() {
    modal.show()
  }

  export async function generate() {
    result = ""
    try {
      const { response, createdTables } = await API.generateTables({ prompt })
      result = response ?? ""

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
    <TextArea label="Table Name" bind:value={prompt} />
    <TextArea label="Result" value={result} disabled minHeight={350} />
  </ModalContent>
</Modal>
