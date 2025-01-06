<script>
  import { API } from "@/api"
  import clientVersions from "./clientVersions.json"
  import { appStore } from "@/stores/builder"
  import { Select } from "@budibase/bbui"

  export let revertableVersion
  $: appId = $appStore.appId

  const handleChange = e => {
    const value = e.detail
    if (value == null) return

    API.setRevertableVersion(appId, value)
  }
</script>

<div class="select">
  <Select
    autoWidth
    value={revertableVersion}
    options={clientVersions}
    on:change={handleChange}
    footer={"Older versions of the Budibase client can be acquired using `yarn get-past-client-version x.x.x`. This toggle is only available in dev mode."}
  />
</div>

<style>
  .select {
    width: 120px;
    display: inline-block;
  }
</style>
