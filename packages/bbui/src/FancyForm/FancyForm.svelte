<script>
  import { setContext } from "svelte"

  export let noMaxWidth
  export let compact

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

  const styles = () => {
    let styleString = ""
    styleString += `--fancy-field-max-width: ${noMaxWidth ? "auto" : "400px"}`
    styleString += `; --fancy-field-height: ${compact ? "36px" : "64px"}`
    styleString += `; --fancy-field-padding: ${compact ? "8px" : "16px"}`
    return styleString
  }
</script>

<div class="fancy-form" style={styles()}>
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
