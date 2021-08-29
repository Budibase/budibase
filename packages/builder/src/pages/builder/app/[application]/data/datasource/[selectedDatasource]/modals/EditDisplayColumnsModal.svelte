<script>
  import { ModalContent, Select, Body } from "@budibase/bbui"
  import { tables } from "stores/backend"
  import { _ as t } from "svelte-i18n"

  export let datasource
  export let plusTables
  export let save

  async function saveDisplayColumns() {
    // be explicit about copying over
    for (let table of plusTables) {
      datasource.entities[table.name].primaryDisplay = table.primaryDisplay
    }
    save()
    await tables.fetch()
  }

  function getColumnOptions(table) {
    if (!table || !table.schema) {
      return []
    }
    return Object.entries(table.schema)
      .filter(field => field[1].type !== "link")
      .map(([fieldName]) => fieldName)
  }
</script>

<ModalContent
  title={ $t('edit-display-columns') }
  confirmText={ $t('save') }
  onConfirm={saveDisplayColumns}
>
  <Body
    >{ $t('select-the-columns-that-will-be-shown-when-displaying-relationships') }</Body
  >
  {#each plusTables as table}
    <Select
      label={table.name}
      options={getColumnOptions(table)}
      bind:value={table.primaryDisplay}
    />
  {/each}
</ModalContent>
