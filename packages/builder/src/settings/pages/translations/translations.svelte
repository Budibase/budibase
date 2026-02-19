<script lang="ts">
  import {
    Layout,
    Body,
    Divider,
    Select,
    Search,
    Table,
    Button,
    notifications,
  } from "@budibase/bbui"
  import { licensing, translations } from "@/stores/portal"
  import type { TranslationOverrideMap } from "@/stores/portal/translations"
  import { onMount } from "svelte"
  import {
    UI_TRANSLATIONS,
    TRANSLATION_CATEGORY_LABELS,
    filterValidTranslationOverrides,
    type TranslationCategory,
  } from "@budibase/shared-core"
  import type { TranslationDetail } from "@budibase/types"
  import RouteActions from "@/settings/components/RouteActions.svelte"
  import LockedFeature from "@/pages/builder/_components/LockedFeature.svelte"
  import TranslationValueCell from "./_components/TranslationValueCell.svelte"

  const categoryLabels: Record<TranslationCategory, string> =
    TRANSLATION_CATEGORY_LABELS

  const categoryKeys = Object.keys(categoryLabels) as TranslationCategory[]

  const categoryOptions = [
    { label: "All", value: "all" },
    ...categoryKeys.map(value => ({
      label: categoryLabels[value],
      value,
    })),
  ]

  const translationTableSchema = {
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

  function normaliseOverrides(source: Record<string, string>) {
    const filtered = filterValidTranslationOverrides(source)
    return Object.keys(filtered)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = filtered[key]
          return acc
        },
        {} as Record<string, string>
      )
  }

  function signature(source: Record<string, string>) {
    return JSON.stringify(normaliseOverrides(source))
  }

  function categoryLabel(category: TranslationCategory) {
    return categoryLabels[category] ?? category
  }

  type TranslationDefinition = (typeof UI_TRANSLATIONS)[number]
  function matchesQuery(definition: TranslationDefinition, query: string) {
    if (!query) {
      return true
    }
    const q = query.toLowerCase()
    return (
      definition.name.toLowerCase().includes(q) ||
      definition.defaultValue.toLowerCase().includes(q) ||
      definition.key.toLowerCase().includes(q) ||
      definition.fullKey.toLowerCase().includes(q)
    )
  }

  let selectedCategory = "userMenu"
  let searchTerm = ""
  let overrides: TranslationOverrideMap = {}
  let lastSyncedSignature = signature(overrides)
  let saving = false
  $: hasPendingChanges = signature(overrides) !== lastSyncedSignature
  $: activeLocale = $translations.config.defaultLocale
  $: activeOverrides =
    $translations.config.locales[activeLocale]?.overrides ?? {}
  $: storeLoaded = $translations.loaded
  const refreshFromStore = ({ force = false }: { force?: boolean } = {}) => {
    const storeSignature = signature(activeOverrides)
    if (storeLoaded && (force || storeSignature !== lastSyncedSignature)) {
      overrides = { ...activeOverrides }
      lastSyncedSignature = storeSignature
    }
  }

  $: refreshFromStore()

  onMount(async () => {
    await translations.init({ force: true })
    refreshFromStore({ force: true })
  })

  $: filteredRows = UI_TRANSLATIONS.filter(definition => {
    const inCategory =
      selectedCategory === "all" || definition.category === selectedCategory
    return inCategory && matchesQuery(definition, searchTerm)
  })

  $: tableData = filteredRows.map(definition => ({
    key: definition.fullKey,
    shortKey: definition.key,
    name: definition.name,
    translation: overrides?.[definition.fullKey] ?? "",
    defaultValue: definition.defaultValue,
    category: definition.category,
    categoryLabel: categoryLabel(definition.category),
  }))

  const handleTranslationChange = (detail: { key: string; value: string }) => {
    const { key, value } = detail
    const trimmed = (value || "").trim()
    overrides = { ...overrides }
    if (!trimmed) {
      delete overrides[key]
    } else {
      overrides[key] = trimmed
    }
  }

  const saveOverrides = async () => {
    if (saving || !hasPendingChanges) {
      return
    }

    saving = true
    const payload = normaliseOverrides(overrides)
    const nextSignature = signature(payload)
    if (nextSignature === lastSyncedSignature) {
      saving = false
      return
    }
    try {
      await translations.saveLocaleOverrides(activeLocale, payload)
      await translations.init({ force: true })
      refreshFromStore({ force: true })
      lastSyncedSignature = nextSignature
      overrides = { ...payload }
      notifications.success("Translations saved successfully")
    } catch (error) {
      notifications.error("Failed to save translations")
      console.error(error)
    } finally {
      saving = false
    }
  }
  const onButtonClick = (event: CustomEvent<TranslationDetail>) => {
    handleTranslationChange(event.detail)
  }
</script>

<LockedFeature
  planType={"Enterprise"}
  description={"Define custom text for user-facing elements across every workspace."}
  enabled={$licensing.translationsEnabled}
  upgradeButtonClick={licensing.goToUpgradePage}
>
  <Layout noPadding>
    <div class="settings">
      <Body size="S">
        Define custom text for user-facing elements across all workspace apps in
        your Budibase installation. Blank fields fall back to Budibase defaults.
      </Body>
      <Divider noMargin />
      <div class="filters">
        <Select
          value={selectedCategory}
          options={categoryOptions}
          placeholder={false}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
          on:change={event => (selectedCategory = event.detail)}
        />
        <Search
          placeholder="Search translations"
          on:change={event => (searchTerm = (event.detail || "").trim())}
        />
      </div>
      <Table
        schema={translationTableSchema}
        data={tableData.map(row => ({
          ...row,
          category: row.categoryLabel,
        }))}
        allowEditColumns={false}
        allowEditRows={false}
        allowSelectRows={false}
        {customRenderers}
        placeholderText="No translations found"
        on:buttonclick={onButtonClick}
      />
      <div class="actions">
        <RouteActions>
          <Button
            cta
            on:click={saveOverrides}
            disabled={saving || !hasPendingChanges || !storeLoaded}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </RouteActions>
      </div>
    </div>
  </Layout>
</LockedFeature>

<style>
  .settings {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-m);
  }

  .filters :global(.spectrum-Form-item) {
    flex: 1 1 220px;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
  }
</style>
