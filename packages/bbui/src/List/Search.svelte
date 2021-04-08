<script>
  import Input from "../Form/Input.svelte"

  export let categories = [
    {
      name: "Customers List - Data Row",
      items: [
        { name: "Name", id: "chjaHICHc82h2" },
        { name: "Created", id: "chjaHICgr56Hc82h2" },
        { name: "Status", id: "chjaHICHc8646462h2" },
      ],
    },
    {
      name: "Home Screen Components",
      items: [{ name: "Title", id: "chjaHICHc82h2" }],
    },
  ]
</script>

<div class="container">
  <Input thin placeholder="Search" />
  {#each categories as { name, items }}
    <div class="title">{name}</div>
    <ul>
      {#each items as { name, id }}
        <li>{name}</li>
      {/each}
    </ul>
  {/each}
</div>

<style>
</style>
