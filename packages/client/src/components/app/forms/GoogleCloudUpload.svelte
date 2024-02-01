<script>
  import StoreUpload from "./StoreUpload.svelte"

  export let datasourceId
  export let bucket
  export let key
  export let field
  export let label
  export let disabled = false
  export let validation
  export let onChange
</script>

<StoreUpload
  {datasourceId}
  {bucket}
  {key}
  {field}
  {label}
  {disabled}
  {validation}
  {onChange}
  storeFieldType={"googlecloudupload"}
/>
