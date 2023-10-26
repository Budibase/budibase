<script>
  import Editor from "./QueryEditor.svelte"
  import FieldsBuilder from "./QueryFieldsBuilder.svelte"
  import {
    Label,
    Input,
    Select,
    Layout,
    Icon,
    Button,
    ActionButton,
  } from "@budibase/bbui"

  const QueryTypes = {
    SQL: "sql",
    JSON: "json",
    FIELDS: "fields",
  }

  export let query
  export let datasource
  export let schema
  export let editable = true
  export let height = 500
  export let noLabel = false

  let stepEditors = []

  $: urlDisplay =
    schema.urlDisplay &&
    `${datasource.config.url}${
      query.fields.path ? "/" + query.fields.path : ""
    }${query.fields.queryString ? "?" + query.fields.queryString : ""}`

  function updateQuery({ detail }) {
    query.fields[schema.type] = detail.value
  }

  function updateEditorsOnDelete(deleteIndex) {
    for (let i = deleteIndex; i < query.fields.steps?.length - 1; i++) {
      stepEditors[i].update(query.fields.steps[i + 1].value?.value)
    }
  }
  function updateEditorsOnSwap(actionIndex, targetIndex) {
    const target = query.fields.steps[targetIndex].value?.value
    stepEditors[targetIndex].update(
      query.fields.steps[actionIndex].value?.value
    )
    stepEditors[actionIndex].update(target)
  }

  function setEditorTemplate(fromKey, toKey, index) {
    const currentValue = query.fields.steps[index].value?.value
    if (
      !currentValue ||
      currentValue.toString().replace("\\s", "").length < 3 ||
      schema.steps.filter(step => step.key === fromKey)[0]?.template ===
        currentValue
    ) {
      query.fields.steps[index].value.value = schema.steps.filter(
        step => step.key === toKey
      )[0]?.template
      stepEditors[index].update(query.fields.steps[index].value.value)
    }
    query.fields.steps[index].key = toKey
  }

  $: shouldDisplayJsonBox =
    schema.type === QueryTypes.JSON &&
    query.fields.extra?.actionType !== "pipeline"
</script>

{#if schema}
  {#key query._id}
    {#if schema.type === QueryTypes.SQL}
      <Editor
        editorHeight={height}
        label={noLabel ? null : "Query"}
        mode="sql"
        on:change={updateQuery}
        readOnly={!editable}
        value={query.fields.sql}
        parameters={query.parameters}
      />
    {:else if shouldDisplayJsonBox}
      <Editor
        editorHeight={height}
        label={noLabel ? null : "Query"}
        mode="json"
        on:change={updateQuery}
        readOnly={!editable}
        value={query.fields.json}
        parameters={query.parameters}
      />
    {:else if schema.type === QueryTypes.FIELDS}
      <FieldsBuilder bind:fields={query.fields} {schema} {editable} />
      {#if schema.urlDisplay}
        <div class="url-row">
          <Label small>URL</Label>
          <Input thin outline disabled value={urlDisplay} />
        </div>
      {/if}
    {:else if query.fields.extra?.actionType === "pipeline"}
      <br />
      {#if !query.fields.steps?.length}
        <div class="controls">
          <Button
            disabled={!editable}
            secondary
            slot="buttons"
            on:click={() => {
              query.fields.steps = [
                {
                  key: "$match",
                  value: "{\n\t\n}",
                },
              ]
            }}>Add stage</Button
          >
        </div>
        <br />
      {:else}
        {#each query.fields.steps ?? [] as step, index}
          <div class="block">
            <div class="subblock">
              <div class="blockSection">
                <div class="block-options">
                  Stage {index + 1}
                  <div class="block-actions">
                    <div style="margin-right: 24px;">
                      {#if index > 0}
                        <ActionButton
                          quiet
                          disabled={!editable}
                          on:click={() => {
                            updateEditorsOnSwap(index, index - 1)
                            const target = query.fields.steps[index - 1].key
                            query.fields.steps[index - 1].key =
                              query.fields.steps[index].key
                            query.fields.steps[index].key = target
                          }}
                          icon="ChevronUp"
                        />
                      {/if}
                      {#if index < query.fields.steps.length - 1}
                        <ActionButton
                          quiet
                          disabled={!editable}
                          on:click={() => {
                            updateEditorsOnSwap(index, index + 1)
                            const target = query.fields.steps[index + 1].key
                            query.fields.steps[index + 1].key =
                              query.fields.steps[index].key
                            query.fields.steps[index].key = target
                          }}
                          icon="ChevronDown"
                        />
                      {/if}
                    </div>
                    <ActionButton
                      disabled={!editable}
                      on:click={() => {
                        updateEditorsOnDelete(index)
                        query.fields.steps.splice(index, 1)
                        query.fields.steps = [...query.fields.steps]
                      }}
                      icon="DeleteOutline"
                    />
                  </div>
                </div>
                <Layout noPadding gap="S">
                  <div class="fields">
                    <div class="block-field">
                      <Select
                        disabled={!editable}
                        value={step.key}
                        options={schema.steps.map(s => s.key)}
                        on:change={({ detail }) => {
                          setEditorTemplate(step.key, detail, index)
                        }}
                      />
                      <Editor
                        bind:this={stepEditors[index]}
                        editorHeight={height / 2}
                        readOnly={!editable}
                        mode="json"
                        value={typeof step.value === "string"
                          ? step.value
                          : step.value.value}
                        on:change={({ detail }) => {
                          query.fields.steps[index].value = detail
                        }}
                      />
                    </div>
                  </div>
                </Layout>
              </div>
            </div>
            <div class="separator" />
            {#if index === query.fields.steps.length - 1}
              <Icon
                disabled={!editable}
                hoverable
                name="AddCircle"
                size="S"
                readOnly={!editable}
                on:click={() => {
                  query.fields.steps = [
                    ...query.fields.steps,
                    {
                      key: "$match",
                      value: "{\n\t\n}",
                    },
                  ]
                }}
              />
              <br />
            {/if}
          </div>
        {/each}
      {/if}
    {/if}
  {/key}
{/if}

<style>
  .url-row {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
  .blockSection {
    padding: var(--spacing-xl);
  }
  .block {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: -6px;
  }
  .subblock {
    width: 480px;
    font-size: 16px;
    background-color: var(--background);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px 4px 4px 4px;
  }
  .block-options {
    justify-content: space-between;
    display: flex;
    align-items: center;
    padding-bottom: 24px;
  }
  .block-actions {
    justify-content: space-between;
    display: flex;
    align-items: right;
  }

  .fields {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-s);
  }
  .block-field {
    display: grid;
    grid-gap: 5px;
  }
  .separator {
    width: 1px;
    height: 25px;
    border-left: 1px dashed var(--grey-4);
    color: var(--grey-4);
    /* center horizontally */
    align-self: center;
  }
  .controls {
    display: flex;
    align-items: center;
    justify-content: right;
  }
</style>
