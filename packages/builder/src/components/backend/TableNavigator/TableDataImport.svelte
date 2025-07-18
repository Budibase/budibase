<script lang="ts">
  import { Select, Icon, Layout } from "@budibase/bbui"
  import { FIELDS } from "@/constants/backend"
  import { canBeDisplayColumn } from "@budibase/frontend-core"
  import { createEventDispatcher } from "svelte"
  import type { FieldSubType, Row, UIFieldSchema } from "@budibase/types"

  export let rows: Row[] = []
  export let schema: Record<string, UIFieldSchema> = {}
  export let displayColumn: string | null = null
  export let validation: Record<string, boolean> | undefined = undefined
  export let errors: Record<string, string> | undefined = undefined

  const dispatch = createEventDispatcher()

  const typeOptions = {
    [FIELDS.STRING.type]: {
      label: "Text",
      value: FIELDS.STRING.type,
      config: {
        type: FIELDS.STRING.type,
        constraints: FIELDS.STRING.constraints,
      },
    },
    [FIELDS.NUMBER.type]: {
      label: "Number",
      value: FIELDS.NUMBER.type,
      config: {
        type: FIELDS.NUMBER.type,
        constraints: FIELDS.NUMBER.constraints,
      },
    },
    [FIELDS.DATETIME.type]: {
      label: "Date",
      value: FIELDS.DATETIME.type,
      config: {
        type: FIELDS.DATETIME.type,
        constraints: FIELDS.DATETIME.constraints,
      },
    },
    [FIELDS.OPTIONS.type]: {
      label: "Single select",
      value: FIELDS.OPTIONS.type,
      config: {
        type: FIELDS.OPTIONS.type,
        constraints: FIELDS.OPTIONS.constraints,
      },
    },
    [FIELDS.ARRAY.type]: {
      label: "Multi select",
      value: FIELDS.ARRAY.type,
      config: {
        type: FIELDS.ARRAY.type,
        constraints: FIELDS.ARRAY.constraints,
      },
    },
    [FIELDS.BARCODEQR.type]: {
      label: "Barcode/QR",
      value: FIELDS.BARCODEQR.type,
      config: {
        type: FIELDS.BARCODEQR.type,
        constraints: FIELDS.BARCODEQR.constraints,
      },
    },
    [FIELDS.LONGFORM.type]: {
      label: "Long Form Text",
      value: FIELDS.LONGFORM.type,
      config: {
        type: FIELDS.LONGFORM.type,
        constraints: FIELDS.LONGFORM.constraints,
      },
    },
    [FIELDS.USER.type]: {
      label: "User",
      value: FIELDS.USER.type,
      config: {
        type: FIELDS.USER.type,
        subtype: FIELDS.USER.subtype,
        constraints: FIELDS.USER.constraints,
      },
    },
    [FIELDS.USERS.type]: {
      label: "Users",
      value: FIELDS.USERS.type,
      config: {
        type: FIELDS.USERS.type,
        subtype: FIELDS.USERS.subtype,
        constraints: FIELDS.USERS.constraints,
      },
    },
  }

  let displayColumnOptions: string[] | undefined = undefined

  $: selectedColumnTypes = Object.entries(schema).reduce(
    (acc, [colName, fieldConfig]) => ({
      ...acc,
      [colName]: fieldConfig.type,
    }),
    {} as Record<string, string>
  )

  $: processDisplayColumnOptions(schema, validation)

  const processDisplayColumnOptions = (
    schema: Record<string, UIFieldSchema>,
    validation?: Record<string, boolean>
  ) => {
    if (!schema || !validation) return []

    displayColumnOptions = Object.keys(schema || {}).filter(column => {
      return validation[column] && canBeDisplayColumn(schema[column])
    })
  }

  const handleChange = (name: string, e: CustomEvent) => {
    const { config } = typeOptions[e.detail]
    const update = { ...schema }
    update[name].type = config.type
    if (config.subtype) update[name].subtype = config.subtype as FieldSubType
    update[name].constraints = config.constraints
    dispatch("update", {
      schema: update,
    })
  }

  const deleteColumn = (name: string) => {
    const update = { ...schema }
    delete update[name]
    dispatch("update", {
      schema: update,
    })
  }
</script>

<Layout noPadding gap="S">
  {#if rows.length > 0 && validation}
    <div>
      {#each Object.entries(schema) as [name, column]}
        <div class="field">
          <span>{column.name}</span>
          <Select
            value={selectedColumnTypes[column.name]}
            on:change={e => handleChange(name, e)}
            options={Object.values(typeOptions)}
            placeholder={false}
            getOptionLabel={option => option.label}
            getOptionValue={option => option.value}
          />
          <span
            class={validation[column.name]
              ? "fieldStatusSuccess"
              : "fieldStatusFailure"}
          >
            {#if validation[column.name]}
              Success
            {:else}
              Failure
              {#if errors?.[column.name]}
                <Icon name="question" tooltip={errors?.[column.name]} />
              {/if}
            {/if}
          </span>
          <Icon
            size="S"
            name="x"
            hoverable
            on:click={() => deleteColumn(column.name)}
          />
        </div>
      {/each}
    </div>
    <Select
      label="Display Column"
      value={displayColumn}
      on:change={e => {
        dispatch("update", {
          displayColumn: e.detail,
        })
      }}
      options={displayColumnOptions}
      sort
    />
  {/if}
</Layout>

<style>
  .field {
    display: grid;
    grid-template-columns: 2fr 2fr 1fr auto;
    margin-top: var(--spacing-m);
    align-items: center;
    grid-gap: var(--spacing-m);
    font-size: var(--spectrum-global-dimension-font-size-75);
  }

  .fieldStatusSuccess {
    color: var(--green);
    justify-self: center;
    font-weight: 600;
  }
  .fieldStatusFailure {
    color: var(--red);
    justify-self: center;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .fieldStatusFailure :global(i) {
    width: 12px;
  }
</style>
