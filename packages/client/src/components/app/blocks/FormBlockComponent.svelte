<script>
  import BlockComponent from "components/BlockComponent.svelte"

  export let field
  export let schema
  export let order

  const FieldTypeToComponentMap = {
    string: "stringfield",
    number: "numberfield",
    bigint: "bigintfield",
    options: "optionsfield",
    array: "multifieldselect",
    boolean: "booleanfield",
    longform: "longformfield",
    datetime: "datetimefield",
    attachment: "attachmentfield",
    link: "relationshipfield",
    json: "jsonfield",
    barcodeqr: "codescanner",
    bb_reference: "bbreferencefield",
  }

  const getComponentForField = field => {
    const fieldSchemaName = field.field || field.name
    if (!fieldSchemaName || !schema?.[fieldSchemaName]) {
      return null
    }
    const type = schema[fieldSchemaName].type
    return FieldTypeToComponentMap[type]
  }

  const getPropsForField = field => {
    let fieldProps = field._component
      ? {
          ...field,
        }
      : {
          field: field.name,
          label: field.name,
          placeholder: field.name,
          _instanceName: field.name,
        }
    return fieldProps
  }
</script>

{#if getComponentForField(field) && field.active}
  <BlockComponent
    type={getComponentForField(field)}
    props={getPropsForField(field)}
    {order}
    interactive
    name={field?.field}
  />
{/if}
