<script>
  import { getContext } from "svelte"
  import BlockComponent from "../../BlockComponent.svelte"
  import Block from "../../Block.svelte"
  import { Heading, Layout } from "@budibase/bbui"
  import Placeholder from "../Placeholder.svelte"

  export let actionType
  export let dataSource
  export let size
  export let disabled
  export let fields
  export let labelPosition
  export let title
  export let showPrimaryButton
  export let primaryButtonOnClick
  export let primaryButtonText
  export let showSecondaryButton
  export let secondaryButtonOnClick
  export let secondaryButtonText

  const { styleable, fetchDatasourceSchema } = getContext("sdk")
  const component = getContext("component")
  const FieldTypeToComponentMap = {
    string: "stringfield",
    number: "numberfield",
    options: "optionsfield",
    array: "multifieldselect",
    boolean: "booleanfield",
    longform: "longformfield",
    datetime: "datetimefield",
    attachment: "attachmentfield",
    link: "relationshipfield",
    json: "jsonfield",
  }

  let schema
  $: fetchSchema(dataSource)

  const fetchSchema = async () => {
    schema = (await fetchDatasourceSchema(dataSource)) || {}
  }

  const getComponentForField = field => {
    if (!field || !schema?.[field]) {
      return null
    }
    const type = schema[field].type
    return FieldTypeToComponentMap[type]
  }
</script>

<Block>
  <div use:styleable={$component.styles}>
    {#if fields?.length}
      <BlockComponent
        type="form"
        props={{ actionType, dataSource, size, disabled }}
        context="form"
      >
        <Layout noPadding gap="M">
          <div class="title" class:with-text={!!title}>
            <Heading>{title || ""}</Heading>
            <div class="buttons">
              {#if showSecondaryButton}
                <BlockComponent
                  type="button"
                  props={{
                    text: secondaryButtonText,
                    onClick: secondaryButtonOnClick,
                    quiet: true,
                    type: "secondary",
                  }}
                />
              {/if}
              {#if showPrimaryButton}
                <BlockComponent
                  type="button"
                  props={{
                    text: primaryButtonText,
                    onClick: primaryButtonOnClick,
                    type: "cta",
                  }}
                />
              {/if}
            </div>
          </div>
          <BlockComponent type="fieldgroup" props={{ labelPosition }}>
            {#each fields as field}
              {#if getComponentForField(field)}
                <BlockComponent
                  type={getComponentForField(field)}
                  props={{
                    field,
                    label: field,
                    placeholder: field,
                    disabled,
                  }}
                />
              {/if}
            {/each}
          </BlockComponent>
        </Layout>
      </BlockComponent>
    {:else}
      <Placeholder
        text="Choose your schema and add some fields to your form to get started"
      />
    {/if}
  </div>
</Block>

<style>
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
    order: 2;
  }
  .title.with-text {
    order: 0;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>
