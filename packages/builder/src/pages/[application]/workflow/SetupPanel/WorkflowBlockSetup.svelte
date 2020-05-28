<script>
  export let workflowBlock
  $: workflowArgs = Object.keys(workflowBlock.args)
</script>

<label class="uk-form-label">{workflowBlock.heading}: {workflowBlock.heading}</label>
{#each workflowArgs as workflowArg}
  <div class="uk-margin">
    <label class="uk-form-label">Name</label>
    <div class="uk-form-controls">
      <input
        type="text"
        class="budibase__input"
        bind:value={workflowBlock.args[workflowArg]} />
    </div>
  </div>
{/each}
