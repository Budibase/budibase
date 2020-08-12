<script>
  import api from "builderStore/api"

  import { store } from "builderStore"
  import fetchBindableProperties from "builderStore/fetchBindableProperties"
  export let value = "Something is wrong"

  async function getBindableProperties() {
    const modelResponse = await api.get(`/api/models/`)
    const models = await modelResponse.json()

    const result = fetchBindableProperties({
      componentInstanceId: $store.currentComponentInfo._id,
      components: $store.components,
      screen: $store.currentPreviewItem,
      models: [],
    })

    console.log("Result: ", result)
  }
</script>

<div class="container">{value}</div>
<button on:click={getBindableProperties}>Get stuff!</button>
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
</ul>

<style>
  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
    padding: var(--spacing-s) 0;
  }
  li {
    display: flex;
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    color: var(--ink);
    padding: var(--spacing-s) var(--spacing-m);
    margin: auto 0px;
    align-items: center;
    cursor: pointer;
  }
</style>
