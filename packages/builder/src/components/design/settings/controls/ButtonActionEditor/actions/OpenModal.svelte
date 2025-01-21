<script>
  import { Select, Label } from "@budibase/bbui"
  import { selectedScreen } from "@/stores/builder"
  import { findAllMatchingComponents } from "@/helpers/components"

  export let parameters

  $: modalOptions = getModalOptions($selectedScreen)

  const getModalOptions = screen => {
    const modalComponents = findAllMatchingComponents(screen.props, component =>
      component._component.endsWith("/modal")
    )
    return modalComponents.map(modal => ({
      label: modal._instanceName,
      value: modal._id,
    }))
  }
</script>

<div class="root">
  <Label small>Modal</Label>
  <Select bind:value={parameters.id} options={modalOptions} />
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 60px 1fr;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;
  }
</style>
