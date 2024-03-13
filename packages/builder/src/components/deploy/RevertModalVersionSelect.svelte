<script>
  import { API } from "api"
  import clientVersions from "./clientVersions.json"
  import { appStore } from "stores/builder"

  export let revertableVersion
  $: appId = $appStore.appId

  const handleChange = (e) => {
    const value = e.target.value;
    if (value == null) return;

    API.setRevertableVersion(appId, value);
  }

  $: unselectedClientVersions = clientVersions.filter(version => version !== revertableVersion);
</script>

<select on:change={handleChange}>
  <option value={revertableVersion}>{revertableVersion ?? "select version"}</option>
  {#each unselectedClientVersions as version}
    <option value={version}>{version}</option>
  {/each}
</select>
