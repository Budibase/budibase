<script>
  import {
    ExampleSection,
    ExampleLine,
    Block,
    Subject,
    Section,
  } from "./components"

  export let schema
  export let columnName

  const maxScalarDescendantsToFind = 3

  const getScalarDescendants = schema => {
    const newScalarDescendants = []

    const getScalarDescendantFromSchema = (path, schema) => {
      if (newScalarDescendants.length >= maxScalarDescendantsToFind) {
        return
      }

      if (["string", "number", "boolean"].includes(schema.type)) {
        newScalarDescendants.push({ name: path.join("."), type: schema.type })
      } else if (schema.type === "json") {
        Object.entries(schema.schema ?? {}).forEach(
          ([childName, childSchema]) =>
            getScalarDescendantFromSchema([...path, childName], childSchema)
        )
      }
    }

    Object.entries(schema?.schema ?? {}).forEach(([childName, childSchema]) =>
      getScalarDescendantFromSchema([columnName, childName], childSchema)
    )

    return newScalarDescendants
  }

  $: scalarDescendants = getScalarDescendants(schema)
</script>

<Subject heading="Using Scalar JSON Values">
  <Section>
    <Block>JSON objects</Block> can't be used here, but any <Block>number</Block
    >, <Block>string</Block> or <Block>boolean</Block> values nested within said
    object can be if they are otherwise compatible with the input. These scalar values
    can be selected from the same menu as this parent and take the form <Block
      >parent.child</Block
    >.
  </Section>

  {#if scalarDescendants.length > 0}
    <ExampleSection heading="Examples scalar descendants of this object:">
      {#each scalarDescendants as descendant}
        <ExampleLine>
          <Block truncate>{descendant.name}</Block><span class="separator"
            >-</span
          ><Block truncate noShrink>{descendant.type}</Block>
        </ExampleLine>
      {/each}
    </ExampleSection>
  {/if}
</Subject>

<style>
  .separator {
    margin: 0 4px;
    flex-shrink: 0;
  }
</style>
