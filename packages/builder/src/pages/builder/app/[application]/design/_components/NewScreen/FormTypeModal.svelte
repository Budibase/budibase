<script>
  import { ModalContent, Layout, Body, Icon } from "@budibase/bbui"

  let type = null

  export let onCancel = () => {}
  export let onConfirm = () => {}
</script>

<span>
  <ModalContent
    title="Select form type"
    confirmText="Done"
    cancelText="Back"
    onConfirm={() => onConfirm(type)}
    {onCancel}
    disabled={!type}
    size="L"
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <Layout noPadding gap="S">
      <div
        class="form-type"
        class:selected={type === "Create"}
        on:click={() => (type = "Create")}
      >
        <div class="form-type-wrap">
          <div class="form-type-content">
            <Body noPadding>Create a new row</Body>
            <Body size="S">
              For capturing and storing new data from your users
            </Body>
          </div>
          {#if type === "Create"}
            <span class="form-type-check">
              <Icon size="S" name="CheckmarkCircle" />
            </span>
          {/if}
        </div>
      </div>
      <div
        class="form-type"
        class:selected={type === "Update"}
        on:click={() => (type = "Update")}
      >
        <div class="form-type-wrap">
          <div class="form-type-content">
            <Body noPadding>Update an existing row</Body>
            <Body size="S">For viewing and updating existing data</Body>
          </div>
          {#if type === "Update"}
            <span class="form-type-check">
              <Icon size="S" name="CheckmarkCircle" />
            </span>
          {/if}
        </div>
      </div>
      <div
        class="form-type"
        class:selected={type === "View"}
        on:click={() => (type = "View")}
      >
        <div class="form-type-wrap">
          <div class="form-type-content">
            <Body noPadding>View an existing row</Body>
            <Body size="S">For a read only view of your data</Body>
          </div>
          {#if type === "View"}
            <span class="form-type-check">
              <Icon size="S" name="CheckmarkCircle" />
            </span>
          {/if}
        </div>
      </div>
    </Layout>
  </ModalContent>
</span>

<style>
  .form-type {
    cursor: pointer;
    gap: var(--spacing-s);
    padding: var(--spacing-m) var(--spacing-xl);
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
  .form-type-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .form-type :global(p:nth-child(2)) {
    color: var(--grey-6);
  }
  .form-type-check {
    margin-left: auto;
  }
  .form-type-check :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-green-600);
  }
  .form-type-content {
    gap: var(--spacing-s);
    display: flex;
    flex-direction: column;
  }
</style>
