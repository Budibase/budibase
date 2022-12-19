<script>
  import { Layout, Select, Body } from "@budibase/bbui"
  import { componentStore } from "stores/index.js"
  import DevToolsStat from "./DevToolsStat.svelte"

  const ReadableBindingMap = {
    user: "Current user",
    state: "State",
    url: "URL",
    device: "Device",
    rowSelection: "Selected rows",
  }

  let category

  $: selectedInstance = $componentStore.selectedComponentInstance
  $: context = selectedInstance?.getDataContext()
  $: bindingCategories = getContextProviders(context)
  $: bindings = Object.entries(context?.[category] || {})

  const getContextProviders = context => {
    const filteredContext = { ...context }

    // Remove some keys from context
    delete filteredContext.key
    delete filteredContext.closestComponentId
    delete filteredContext.user_RefreshDataSource

    // Keep track of encountered IDs so we can find actions
    let actions = []
    let encounteredCategories = []

    // Create readable bindings
    let categories = []
    Object.keys(filteredContext)
      .sort()
      .forEach(category => {
        let isAction = false
        for (let cat of encounteredCategories) {
          if (category.startsWith(`${cat}_`)) {
            isAction = true
            break
          }
        }
        if (isAction) {
          actions.push(category)
          return
        }

        // Mark category as encountered so we can find any matching actions
        encounteredCategories.push(category)

        // Map any static categories to pretty names
        if (ReadableBindingMap[category]) {
          categories.push({
            label: ReadableBindingMap[category],
            value: category,
          })
        } else {
          const component = componentStore.actions.getComponentById(category)
          if (component) {
            categories.push({
              label: component._instanceName,
              value: category,
            })
          } else {
            // Check if its a block
            if (category.includes("-")) {
              const split = category.split("-")
              const potentialId = split[0]
              const component =
                componentStore.actions.getComponentById(potentialId)
              if (component) {
                categories.push({
                  label: `${component._instanceName} (${split[1]})`,
                  value: category,
                })
                return
              }
            }

            // Otherwise we don't know
            categories.push({
              label: "Unknown - " + category,
              value: category,
            })
          }
        }
      })

    return categories
  }
</script>

<Layout noPadding gap="S">
  <Body size="S">
    Choose a category to see the value of all its available bindings.
  </Body>
  <Select bind:value={category} label="Category" options={bindingCategories} />
  {#if bindings?.length}
    <Layout noPadding gap="XS">
      {#each bindings as binding}
        <DevToolsStat
          copyable
          label={binding[0]}
          value={JSON.stringify(binding[1])}
        />
      {/each}
    </Layout>
  {:else if category}
    <Body size="XS">There aren't any bindings available in this category.</Body>
  {/if}
</Layout>
