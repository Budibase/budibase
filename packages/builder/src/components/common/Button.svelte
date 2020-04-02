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
    background-color: var(--primary100);
    border-color: var(--primary100);
    color: var(--white);
  }

  .primary:hover {
    background-color: var(--primary75);
    border-color: var(--primary75);
  }

  .primary:active {
    background-color: var(--primarydark);
    border-color: var(--primarydark);
  }

  .primary-outline {
    background-color: var(--white);
    border-color: var(--primary100);
    color: var(--primary100);
  }

  .primary-outline:hover {
    background-color: var(--primary10);
  }

  .primary-outline:pressed {
    background-color: var(--primary25);
  }

  /* ---- secondary ----*/

  .secondary {
    background-color: var(--secondary100);
    border-color: var(--secondary100);
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
    border-color: var(--secondary100);
    color: var(--secondary100);
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
    background-color: var(--deletion100);
    border-color: var(--deletion100);
    color: var(--white);
  }

  .deletion:hover {
    background-color: var(--deletion75);
    border-color: var(--deletion75);
  }

  .deletion:pressed {
    background-color: var(--deletiondark);
    border-color: var(--deletiondark);
  }

  .deletion-outline {
    background-color: var(--white);
    border-color: var(--deletion100);
    color: var(--deletion100);
  }

  .deletion-outline:hover {
    background-color: var(--deletion10);
  }

  .deletion-outline:pressed {
    background-color: var(--deletion25);
  }
</style>
