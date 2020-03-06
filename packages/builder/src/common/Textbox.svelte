<script>
  export let text = ""
  export let label = ""
  export let width = "medium"
  export let size = "small"
  export let margin = true
  export let infoText = ""
  export let hasError = false
  export let disabled = false
</script>

  <form class="uk-form-stacked">
    <div class="uk-form-row form">
      <label class="label" for="">{label}</label>
        <input
          class="budibase__input"
          class:uk-form-danger={hasError}
          on:change
          bind:value={text}
          {disabled} />
      {#if infoText}
        <div class="info-text">{infoText}</div>
      {/if}
      </div>
    </form>

<style>
  .info-text {
    font-size: 0.7rem;
    color: var(--secondary50);
  }

  .form {
    display: flex;
    flex-direction: column;
    margin-bottom: 40px;
  }

</style>
