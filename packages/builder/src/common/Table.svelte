<script>
  export let data = []
  export let headers = []
</script>

<table class="uk-table">
  <thead>
    <tr>
      <th>Edit</th>
      {#each headers as header}
        <th>{header}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each data as row}
      <tr>
        <td>
          <div class="uk-inline">
            <i class="ri-more-line" />
            <div uk-dropdown="mode: click">
              <ul class="uk-nav uk-dropdown-nav">
                <li>
                  <div>View</div>
                </li>
                <li>
                  <div>Edit</div>
                </li>
                <li>
                  <div on:click={() => (deleteRecordModal = true)}>Delete</div>
                </li>
                <li>
                  <div>Duplicate</div>
                </li>
              </ul>
            </div>
          </div>
        </td>
        {#each headers as header}
          <td>{row[header]}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
