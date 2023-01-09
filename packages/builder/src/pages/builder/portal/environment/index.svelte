<script>
  import {
    Layout,
    Heading,
    Body,
    Button,
    Select,
    Divider,
    Modal,
    Search,
  } from "@budibase/bbui"

  import { onMount } from "svelte"

  onMount(async () => {
    await envVars.load()
  })
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading size="M">Envrironment Variables</Heading>
    <Body
      >Add and manage environment variable for development and production</Body
    >
  </Layout>
  <Divider size="S" />
  <Layout noPadding>
    {#each $envVars as envVar}
      <Layout gap="XS" noPadding>
        <Heading size="S">{envVar}</Heading>
      </Layout>
      <Divider size="S" />
    {/each}
  </Layout>
</Layout>

<style>
</style>
