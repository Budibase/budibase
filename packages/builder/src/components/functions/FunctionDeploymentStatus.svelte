<script lang="ts">
  import { StatusLight } from "@budibase/bbui"
  import {
    FunctionDeploymentState,
    deploymentStateLabel,
    resolveDeploymentState,
    type FunctionPublishState,
  } from "@/helpers/functionsGate"

  export let publishState: FunctionPublishState

  $: state = resolveDeploymentState(publishState)
  $: label = deploymentStateLabel(state)
</script>

<StatusLight
  size="M"
  neutral={state === FunctionDeploymentState.NotPublished}
  positive={state === FunctionDeploymentState.Published}
  notice={state === FunctionDeploymentState.UnpublishedChanges}
>
  {label}
</StatusLight>
