<script lang="ts">
  import { setContext } from "svelte"

  interface FancyFieldApi {
    validate: () => boolean
  }

  let fields: Record<string, FancyFieldApi> = {}

  setContext("fancy-form", {
    registerField: (id: string, api: FancyFieldApi) => {
      fields = { ...fields, [id]: api }
    },
    unregisterField: (id: string) => {
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
