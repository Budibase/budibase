<script>
  import { RelationshipTypes } from "constants/backend"
  import {
    Button,
    Input,
    ModalContent,
    Select,
    Detail,
    Body,
  } from "@budibase/bbui"
  import { tables } from "stores/backend"
  import { uuid } from "builderStore/uuid"
  import { writable } from "svelte/store"
  import { _ as t } from "svelte-i18n"

  export let save
  export let datasource
  export let plusTables = []
  export let fromRelationship = {}
  export let toRelationship = {}
  export let close

  let originalFromName = fromRelationship.name,
    originalToName = toRelationship.name

  function inSchema(table, prop, ogName) {
    if (!table || !prop || prop === ogName) {
      return false
    }
    const keys = Object.keys(table.schema).map(key => key.toLowerCase())
    return keys.indexOf(prop.toLowerCase()) !== -1
  }

  const touched = writable({})

  function checkForErrors(
    fromTable,
    toTable,
    throughTable,
    fromRelate,
    toRelate
  ) {
    const isMany =
      fromRelate.relationshipType === RelationshipTypes.MANY_TO_MANY
    const tableNotSet = $t("please-specify-a-table")
    const errors = {}
    if ($touched.from && !fromTable) {
      errors.from = tableNotSet
    }
    if ($touched.to && !toTable) {
      errors.to = tableNotSet
    }
    if ($touched.through && isMany && !fromRelate.through) {
      errors.through = tableNotSet
    }
    if ($touched.foreign && !isMany && !fromRelate.fieldName) {
      errors.foreign = $t("please-pick-the-foreign-key")
    }
    const colNotSet = $t("please-specify-a-column-name")
    if ($touched.fromCol && !fromRelate.name) {
      errors.fromCol = colNotSet
    }
    if ($touched.toCol && !toRelate.name) {
      errors.toCol = colNotSet
    }
    // currently don't support relationships back onto the table itself, needs to relate out
    const tableError = $t("from-to-through-tables-must-be-different")
    if (fromTable && (fromTable === toTable || fromTable === throughTable)) {
      errors.from = tableError
    }
    if (toTable && (toTable === fromTable || toTable === throughTable)) {
      errors.to = tableError
    }
    if (
      throughTable &&
      (throughTable === fromTable || throughTable === toTable)
    ) {
      errors.through = tableError
    }
    const colError = $t("column-name-cannot-be-an-existing-column")
    if (inSchema(fromTable, fromRelate.name, originalFromName)) {
      errors.fromCol = colError
    }
    if (inSchema(toTable, toRelate.name, originalToName)) {
      errors.toCol = colError
    }
    return errors
  }

  $: tableOptions = plusTables.map(table => ({
    label: table.name,
    value: table._id,
  }))
  $: fromTable = plusTables.find(table => table._id === toRelationship?.tableId)
  $: toTable = plusTables.find(table => table._id === fromRelationship?.tableId)
  $: through = plusTables.find(table => table._id === fromRelationship?.through)
  $: errors = checkForErrors(
    fromTable,
    toTable,
    through,
    fromRelationship,
    toRelationship
  )
  $: valid =
    Object.keys(errors).length === 0 && Object.keys($touched).length !== 0
  $: linkTable = through || toTable
  $: relationshipTypes = [
    {
      label: $t("many"),
      value: RelationshipTypes.MANY_TO_MANY,
    },
    {
      label: $t("one"),
      value: RelationshipTypes.MANY_TO_ONE,
    },
  ]
  $: updateRelationshipType(fromRelationship?.relationshipType)

  function updateRelationshipType(fromType) {
    if (fromType === RelationshipTypes.MANY_TO_MANY) {
      toRelationship.relationshipType = RelationshipTypes.MANY_TO_MANY
    } else {
      toRelationship.relationshipType = RelationshipTypes.MANY_TO_ONE
    }
  }

  function buildRelationships() {
    // if any to many only need to check from
    const manyToMany =
      fromRelationship.relationshipType === RelationshipTypes.MANY_TO_MANY
    // main is simply used to know this is the side the user configured it from
    const id = uuid()
    if (!manyToMany) {
      delete fromRelationship.through
      delete toRelationship.through
    }
    let relateFrom = {
      ...fromRelationship,
      type: "link",
      main: true,
      _id: id,
    }
    let relateTo = {
      ...toRelationship,
      type: "link",
      _id: id,
    }

    // [0] is because we don't support composite keys for relationships right now
    if (manyToMany) {
      relateFrom = {
        ...relateFrom,
        through: through._id,
        fieldName: toTable.primary[0],
      }
      relateTo = {
        ...relateTo,
        through: through._id,
        fieldName: fromTable.primary[0],
      }
    } else {
      // the relateFrom.fieldName should remain the same, as it is the foreignKey in the other
      // table, this is due to the way that budibase represents relationships, the fieldName in a
      // link column schema is the column linked to (FK in this case). The foreignKey column is
      // essentially what is linked to in the from table, this is unique to SQL as this isn't a feature
      // of Budibase internal tables.
      // Essentially this means the fieldName is what we are linking to in the other table, and the
      // foreignKey is what is linking out of the current table.
      relateFrom = {
        ...relateFrom,
        foreignKey: fromTable.primary[0],
      }
      relateTo = {
        ...relateTo,
        relationshipType: RelationshipTypes.ONE_TO_MANY,
        foreignKey: relateFrom.fieldName,
        fieldName: fromTable.primary[0],
      }
    }

    fromRelationship = relateFrom
    toRelationship = relateTo
  }

  // save the relationship on to the datasource
  async function saveRelationship() {
    buildRelationships()
    // source of relationship
    datasource.entities[fromTable.name].schema[fromRelationship.name] =
      fromRelationship
    // save other side of relationship in the other schema
    datasource.entities[toTable.name].schema[toRelationship.name] =
      toRelationship

    // If relationship has been renamed
    if (originalFromName !== fromRelationship.name) {
      delete datasource.entities[fromTable.name].schema[originalFromName]
    }
    if (originalToName !== toRelationship.name) {
      delete datasource.entities[toTable.name].schema[originalToName]
    }

    // store the original names so it won't cause an error
    originalToName = toRelationship.name
    originalFromName = fromRelationship.name
    await save()
    await tables.fetch()
  }

  async function deleteRelationship() {
    delete datasource.entities[fromTable.name].schema[fromRelationship.name]
    delete datasource.entities[toTable.name].schema[toRelationship.name]
    await save()
    await tables.fetch()
    close()
  }
</script>

<ModalContent
  cancelText={$t("cancel")}
  title={$t("create-relationship")}
  confirmText={$t("save")}
  onConfirm={saveRelationship}
  disabled={!valid}
>
  <Select
    label={$t("relationship-type")}
    options={relationshipTypes}
    bind:value={fromRelationship.relationshipType}
  />
  <div class="headings">
    <Detail>{$t("tables")}</Detail>
  </div>
  <Select
    label={$t("select-from-table")}
    options={tableOptions}
    on:change={() => ($touched.from = true)}
    bind:error={errors.from}
    bind:value={toRelationship.tableId}
  />
  <Select
    label={$t("select-to-table")}
    options={tableOptions}
    on:change={() => ($touched.to = true)}
    bind:error={errors.to}
    bind:value={fromRelationship.tableId}
  />
  {#if fromRelationship?.relationshipType === RelationshipTypes.MANY_TO_MANY}
    <Select
      label={$t("through")}
      options={tableOptions}
      on:change={() => ($touched.through = true)}
      bind:error={errors.through}
      bind:value={fromRelationship.through}
    />
  {:else if fromRelationship?.relationshipType && toTable}
    <Select
      label={$t("foreign-key") + ` (${toTable?.name})`}
      options={Object.keys(toTable?.schema).filter(
        field => toTable?.primary.indexOf(field) === -1
      )}
      on:change={() => ($touched.foreign = true)}
      bind:error={errors.foreign}
      bind:value={fromRelationship.fieldName}
    />
  {/if}
  <div class="headings">
    <Detail>{$t("column-names")}</Detail>
  </div>
  <Body>
    {$t(
      "budibase-manages-sql-relationships-as-a-new-column-in-the-table-please-provide-a-name-for-these-columns"
    )}
  </Body>
  <Input
    on:blur={() => ($touched.fromCol = true)}
    bind:error={errors.fromCol}
    label={$t("from-table-column")}
    bind:value={fromRelationship.name}
  />
  <Input
    on:blur={() => ($touched.toCol = true)}
    bind:error={errors.toCol}
    label={$t("to-table-column")}
    bind:value={toRelationship.name}
  />
  <div slot="footer">
    {#if originalFromName != null}
      <Button warning text on:click={deleteRelationship}>{$t("delete")}</Button>
    {/if}
  </div>
</ModalContent>

<style>
  .headings {
    margin-top: var(--spacing-s);
  }
</style>
