<script>
  import { Button, Icon, Body } from "@budibase/bbui"
  import { goto } from "@roxi/routify"

  export let group

  let { icon, color, name, userCount, appCount } = group
</script>

<div class="title">
  <div class="name" style="display: flex; margin-left: var(--spacing-xl)">
    <div style="background: {color};" class="circle">
      <div>
        <Icon size="M" name={icon} />
      </div>
    </div>
    <div class="name" data-cy="app-name-link"><Body size="S">{name}</Body></div>
  </div>
</div>
<div class="desktop tableElement">
  <Icon name="User" />
  <div style="margin-left: var(--spacing-l">
    {parseInt(userCount)} user{parseInt(userCount) === 1 ? "" : "s"}
  </div>
</div>
<div class="desktop tableElement">
  <Icon name="WebPage" />

  <div style="margin-left: var(--spacing-l">
    {parseInt(appCount)} app{parseInt(appCount) === 1 ? "" : "s"}
  </div>
</div>
<div>
  <div class="app-row-actions">
    <div>
      <Button on:click={() => $goto(`./${group._id}`)} size="S" cta
        >Manage</Button
      >
    </div>
  </div>
</div>

<style>
  .app-row-actions {
    display: flex;
    float: right;
    margin-right: var(--spacing-xl);
  }
  .name {
    grid-gap: var(--spacing-xl);
    grid-template-columns: 75px 75px;
    align-items: center;
  }
  .circle {
    border-radius: 50%;
    height: 30px;
    color: white;
    font-weight: bold;
    display: inline-block;
    font-size: 1.2em;
    width: 30px;
  }

  .tableElement {
    display: flex;
  }

  .circle > div {
    padding: calc(1.5 * var(--spacing-xs)) var(--spacing-xs);
  }
  .name {
    text-decoration: none;
    overflow: hidden;
  }
  .name :global(.spectrum-Heading) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: calc(1.5 * var(--spacing-xl));
  }
  .title :global(h1:hover) {
    color: var(--spectrum-global-color-blue-600);
    cursor: pointer;
    transition: color 130ms ease;
  }

  @media (max-width: 640px) {
    .desktop {
      display: none !important;
    }
  }
</style>
