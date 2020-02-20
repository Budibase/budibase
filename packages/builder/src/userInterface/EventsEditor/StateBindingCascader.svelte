<script>
  import IconButton from "../../common/IconButton.svelte"
  import PlusButton from "../../common/PlusButton.svelte"
  import Select from "../../common/Select.svelte"
  import Input from "../../common/Input.svelte"
  import StateBindingControl from "../StateBindingControl.svelte"
  import { find, map, keys, reduce, keyBy } from "lodash/fp"
  import { pipe, userWithFullAccess } from "../../common/core"
  import {
    EVENT_TYPE_MEMBER_NAME,
    allHandlers,
  } from "../../common/eventHandlers"
  import { store } from "../../builderStore"

  export let parameter
</script>

<div class="handler-option">
  <span>{parameter.name}</span>
  <Input on:change value={parameter.value} />
</div>

<style>
  .handler-option {
    display: flex;
    flex-direction: column;
  }

  span {
    font-size: 12px;
    margin-bottom: 5px;
  }
</style>
