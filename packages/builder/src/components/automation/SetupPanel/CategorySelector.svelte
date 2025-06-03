<script lang="ts">
  import { ActionButton, Input, Icon } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { generate } from "shortid"

  const dispatch = createEventDispatcher()

  export let value: { category: string; id?: string }[] = []

  let categories: { category: string; id: string }[] = []

  $: {
    if (Array.isArray(value)) {
      categories = value.map(item => ({
        ...item,
        id: item.id || generate(),
      }))
    } else {
      categories = []
    }
  }

  function addCategory() {
    const newCategory = {
      id: generate(),
      category: "",
    }
    categories = [...categories, newCategory]
    updateValue()
  }

  function removeCategory(index: number) {
    categories.splice(index, 1)
    categories = [...categories]
    updateValue()
  }

  function updateCategory(index: number, newValue: string) {
    if (categories[index]) {
      categories[index].category = newValue
      categories = [...categories]
      updateValue()
    }
  }

  function updateValue() {
    const updatedValue = categories.map(({ id, ...rest }) => rest)
    dispatch("change", updatedValue)
  }
</script>

<div class="category-selector">
  <div class="categories-list">
    {#each categories as cat, index}
      <div class="category-item">
        <div class="category-row">
          <div class="input-group">
            <Input
              value={cat.category}
              on:blur={e => updateCategory(index, e.detail)}
              placeholder="Category name"
            />
          </div>
          <div class="remove-button">
            <Icon
              size="S"
              name="Close"
              hoverable
              on:click={() => removeCategory(index)}
            />
          </div>
        </div>
      </div>
    {/each}
  </div>

  <ActionButton on:click={addCategory} icon="Add" quiet={false}>
    Add category
  </ActionButton>
</div>

<style>
  .category-selector {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .categories-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    margin-bottom: var(--spacing-m);
  }

  .category-item {
    background-color: var(--background-light);
    border-radius: var(--border-radius-s);
    padding-right: var(--spacing-m);
    border: 1px solid var(--border);
  }

  .category-row {
    display: flex;
    align-items: flex-end;
    gap: var(--spacing-l);
  }

  .input-group {
    flex: 1;
  }

  .remove-button {
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    cursor: pointer;
  }
</style>
