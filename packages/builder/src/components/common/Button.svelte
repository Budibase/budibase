<script>
  export let color = "primary"
  export let className = ""
  export let style = ""
  export let groupPosition = ""
  export let grouped = false

  $: borderClass = grouped ? "" : "border-normal"
</script>

<button
  class="{color}
  {className}
  {borderClass}
  {grouped ? 'grouped' : ''}"
  {style}
  on:click>
  <slot />
</button>

<style>
  .border-normal {
    border-radius: var(--borderradiusall);
  }
  .border-left {
    border-radius: var(--borderradius) 0 0 var(--borderradius);
  }
  .border-right {
    border-radius: 0 var(--borderradius) var(--borderradius) 0;
  }
  .border-middle {
    border-radius: 0;
  }

  button {
    border-style: solid;
    padding: 7.5px 15px;
    cursor: pointer;
    margin: 5px;
    border-radius: 5px;
  }

  /* ---- PRIMARY ----*/
  .primary {
    background-color: var(--blue);
    border-color: var(--blue);
    color: var(--white);
  }

  .primary:hover {
    background-color: var(--blue);
    border-color: var(--blue);
  }

  .primary:active {
    background-color: var(--primarydark);
    border-color: var(--primarydark);
  }

  .primary-outline {
    background-color: var(--white);
    border-color: var(--blue);
    color: var(--blue);
  }

  .primary-outline:hover {
    background-color: var(--primary10);
  }

  .primary-outline:pressed {
    background-color: var(--primary25);
  }

  /* ---- secondary ----*/

  .secondary {
    background-color: var(--ink);
    border-color: var(--ink);
    color: var(--white);
  }

  .secondary:hover {
    background-color: var(--secondary75);
    border-color: var(--secondary75);
  }

  .secondary:pressed {
    background-color: var(--secondarydark);
    border-color: var(--secondarydark);
  }

  .secondary-outline {
    background-color: var(--white);
    border-color: var(--ink);
    color: var(--ink);
  }

  .secondary-outline:hover {
    background-color: var(--secondary10);
  }

  .secondary-outline:pressed {
    background-color: var(--secondary25);
  }

  /* ---- success ----*/
  .success {
    background-color: var(--success100);
    border-color: var(--success100);
    color: var(--white);
  }

  .success:hover {
    background-color: var(--success75);
    border-color: var(--success75);
  }

  .success:pressed {
    background-color: var(--successdark);
    border-color: var(--successdark);
  }

  .success-outline {
    background-color: var(--white);
    border-color: var(--success100);
    color: var(--success100);
  }

  .success-outline:hover {
    background-color: var(--success10);
  }

  .success-outline:pressed {
    background-color: var(--success25);
  }

  /* ---- deletion ----*/
  .deletion {
    background-color: var(--red);
    border-color: var(--red);
    color: var(--white);
  }

  .deletion:hover {
    background-color: var(--red-light);
    border-color: var(--red);
    color: var(--red);
  }

  .deletion:pressed {
    background-color: var(--red-dark);
    border-color: var(--red-dark);
    color: var(--white);
  }

  .deletion-outline {
    background-color: var(--white);
    border-color: var(--red);
    color: var(--red);
  }

  .deletion-outline:hover {
    background-color: var(--red-light);
    color: var(--red);
  }

  .deletion-outline:pressed {
    background-color: var(--red-dark);
    color: var(--white);
  }
</style>
