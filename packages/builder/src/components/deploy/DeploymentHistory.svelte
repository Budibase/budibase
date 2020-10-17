<script>
  import { Heading, Body } from "@budibase/bbui"

  const DATE_OPTIONS = {
    fullDate: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    timeOnly: {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    },
  }

  export let deployments
  export let appId

  const formatDate = (date, format) =>
    Intl.DateTimeFormat("en-GB", DATE_OPTIONS[format]).format(date)
</script>

<section class="deployment-history">
  <Heading black small style="margin-left: 20px;">Deployment History</Heading>
  {#if deployments.length > 0}
    <Body small grey>
      <a target="_blank" href={`https://${appId}.app.budi.live/${appId}`}>
        View Your Deployed App →
      </a>
    </Body>
  {/if}
  {#each deployments as deployment}
    <article class="deployment">
      <div class="deployment-info">
        <span class="deploy-date">
          {formatDate(deployment.updatedAt, 'fullDate')}
        </span>
        <span class="deploy-time">
          {formatDate(deployment.updatedAt, 'timeOnly')}
        </span>
      </div>
      <div class={`deployment-status ${deployment.status}`}>
        {deployment.status}
      </div>
    </article>
  {/each}
</section>

<style>
  section > .deployment:nth-child(odd) {
    background: var(--grey-1);
  }

  .deployment-history {
    position: absolute;
    right: 0;
    top: 0;
    height: 100vh;
    width: 400px;
    background: var(--white);
    overflow-y: scroll;
  }

  .deployment {
    padding: var(--spacing-l);
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .deployment-info {
    display: flex;
    flex-direction: column;
    margin-right: var(--spacing-s);
  }

  .deploy-date {
    font-size: var(--font-size-m);
  }

  .deploy-time {
    color: var(--grey-7);
    font-weight: 500;
    font-size: var(--font-size-s);
  }

  .deployment-status {
    font-size: var(--font-size-s);
    padding: var(--spacing-s);
    border-radius: var(--border-radius-s);
    font-weight: 500;
    text-transform: lowercase;
    width: 80px;
    text-align: center;
  }
  .deployment-status:first-letter {
    text-transform: uppercase;
  }

  a {
    color: var(--blue);
    font-weight: 500;
  }

  .SUCCESS {
    color: var(--green);
    background: var(--green-light);
  }

  .PENDING {
    color: var(--yellow);
    background: var(--yellow-light);
  }

  .FAILURE {
    color: var(--red);
    background: var(--red-light);
  }
</style>
