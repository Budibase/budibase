<script>
  import { setContext } from "svelte"

  let fields = {}

  setContext("fancy-form", {
    registerField: (id, api) => {
      fields = { ...fields, [id]: api }
    },
    unregisterField: id => {
      delete fields[id]
      fields = fields
    },
  })

  export const validate = () => {
    let valid = true
    Object.values(fields).forEach(api => {
      if (!api.validate()) {
        valid = false
      }
    })
    return valid
  }
</script>

<div class="fancy-form">
  <slot />
</div>

<style>
  .fancy-form :global(.fancy-field:not(:first-of-type)) {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .fancy-form :global(.fancy-field:not(:last-of-type)) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
</style>
