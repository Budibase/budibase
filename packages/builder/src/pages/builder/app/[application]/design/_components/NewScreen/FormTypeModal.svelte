<script>
  import { ModalContent, Layout, Body, Label } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  export let onCancel = () => {}
  export let onConfirm = () => {}
  export let type

  const dispatch = createEventDispatcher()
</script>

<span>
  <ModalContent
    title="Select form type"
    confirmText="Done"
    cancelText="Back"
    {onConfirm}
    {onCancel}
    disabled={!type}
    size="L"
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <Layout noPadding gap="S">
      <div
        class="form-type"
        class:selected={type === "Create"}
        on:click={() => {
          dispatch("select", "Create")
        }}
      >
        <Body noPadding>Create a new row</Body>
        <Body size="S">For capturing and storing new data from your users</Body>
      </div>
      <div
        class="form-type"
        class:selected={type === "Update"}
        on:click={() => {
          dispatch("select", "Update")
        }}
      >
        <Body noPadding>Update an existing row</Body>
        <Body size="S">For viewing and updating existing data</Body>
      </div>
      <div
        class="form-type"
        class:selected={type === "View"}
        on:click={() => {
          dispatch("select", "View")
        }}
      >
        <Body noPadding>View an existing row</Body>
        <Body size="S">For a read only view of your data</Body>
      </div>
    </Layout>
  </ModalContent>
</span>

<style>
  .form-type {
    cursor: pointer;
    gap: var(--spacing-s);
    padding: var(--spacing-m) var(--spacing-xl);
    /* padding: 10px 16px technically correct*/
    background: var(--spectrum-alias-background-color-secondary);
    transition: 0.3s all;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
  }
  .selected,
  .form-type:hover {
    background: var(--spectrum-alias-background-color-tertiary);
  }
  .form-type :global(p:nth-child(2)) {
    color: var(--grey-6);
  }
</style>
