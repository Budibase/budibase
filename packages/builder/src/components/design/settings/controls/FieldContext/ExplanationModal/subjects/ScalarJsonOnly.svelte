<script>
  import { Body } from "@budibase/bbui"
  import { Block, Subject, Section } from './components'

  export let schema
  export let columnName

  const maxScalarDescendantsToFind = 3;

  const getScalarDescendants = (schema) => {
    const newScalarDescendants = [];

    const getScalarDescendantFromSchema = (path, schema) => {
      if (newScalarDescendants.length >= maxScalarDescendantsToFind) {
        return;
      }

      if (["string", "number", "boolean"].includes(schema.type)) {
        newScalarDescendants.push(path.join("."))
      } else if (schema.type === "json") {
        Object.entries(schema.schema ?? {}).forEach(([childName, childSchema]) => 
        getScalarDescendantFromSchema([...path, childName], childSchema))
      }
    }

    Object.entries(schema?.schema ?? {}).forEach(([childName, childSchema]) => 
        getScalarDescendantFromSchema([columnName, childName], childSchema))

    return newScalarDescendants;
  }

  $: scalarDescendants = getScalarDescendants(schema)
</script>

<Subject heading="Using Scalar JSON Values">
  <Section>
    <Block>JSON objects</Block> can't be used here, but any <Block>number</Block>, <Block>string</Block> or <Block>boolean</Block> values nested within said object can be if they are otherwise compatible with the component. These scalar values can be selected from the same menu as this parent and take the form <Block>parent.child</Block>.
  </Section>

  {#if scalarDescendants.length > 0}
    <Section>
      Examples of scalar descendants of this object are:
      {#if scalarDescendants[0]}
        <Block>{scalarDescendants[0]}</Block>
      {/if}
      {#if scalarDescendants.length === 2}
        {" and "}
      {:else if scalarDescendants.length === 3}
        {", "}
      {/if}
      {#if scalarDescendants[1]}
        <Block>{scalarDescendants[1]}</Block>
      {/if}
      {#if scalarDescendants.length === 3}
        {" and "}
      {/if}
      {#if scalarDescendants[2]}
        <Block>{scalarDescendants[2]}</Block>
      {/if}
    </Section>
  {/if}
</Subject>
