<script lang="ts">
  import {
    Layout,
    Heading,
    Body,
    Divider,
    Select,
    Search,
    Table,
  } from "@budibase/bbui"
  import { appStore } from "@/stores/builder"
  import { API } from "@/api"
  import { onDestroy } from "svelte"
  import TranslationValueCell from "./_components/TranslationValueCell.svelte"

  const schema = {
    name: {
      width: "minmax(240px, 3fr)",
    },
    translation: {
      width: "minmax(320px, 4fr)",
    },
    category: {
      width: "minmax(160px, 1.5fr)",
    },
  }

  const customRenderers = [
    { column: "translation", component: TranslationValueCell },
  ]

  let selectedCategory = "userMenu"
  let searchTerm = ""
</script>

<Layout noPadding>
  <div class="settings">
    <div class="heading">
      <Heading size="S">Workspace translations</Heading>
    </div>
    <Body size="S">
      Update the text shown across your workspace. Leave fields blank to use the
      Budibase defaults.
    </Body>
    <Divider noMargin />
    <div class="filters">
      <Select
        value={selectedCategory}
        placeholder={false}
        on:change={event => (selectedCategory = event.detail)}
      />
      <Search
        placeholder="Search translations"
        on:change={event => (searchTerm = (event.detail || "").trim())}
      />
    </div>
    <Table
      {schema}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      {customRenderers}
      placeholderText="No translations found"
    />
  </div>
</Layout>

<style>
  .settings {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-m);
  }

  .filters :global(.spectrum-Form-item) {
    flex: 1 1 220px;
  }
</style>
