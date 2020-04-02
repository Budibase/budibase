<script>
  export let onSelect = () => {}

  let options = [
    {
      name: "state",
      description: "Front-end client state.",
    },
    {
      name: "context",
      description: "The component context object.",
    },
    {
      name: "event",
      description: "DOM event handler arguments.",
    },
  ]
</script>

<ul class="options">
  {#each options as option}
    <li on:click={() => onSelect(`${option.name}.`)}>
      <span class="name">{option.name}</span>
      <span class="description">{option.description}</span>
    </li>
  {/each}
</ul>

<style>
  .options {
    width: 172px;
    margin: 0;
    position: absolute;
    top: 35px;
    padding: 10px;
    z-index: 1;
    background: rgba(249, 249, 249, 1);
    min-height: 50px;
    border-radius: 2px;
  }

  .description {
    font-size: 0.8em;
  }

  .name {
    color: rgba(22, 48, 87, 0.6);
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 5px;
    display: block;
  }

  .name:hover {
    cursor: pointer;
    font-weight: 800;
  }

  li {
    list-style-type: none;
  }
</style>
