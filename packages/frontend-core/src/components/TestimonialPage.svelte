<script>
  import SplitPage from "./SplitPage.svelte"
  import { Layout, Body } from "@budibase/bbui"
</script>

<SplitPage>
  <slot />
  <div class="wrapper" slot="right">
    <div class="testimonial">
      <Layout noPadding gap="S">
        <div class="text">
          "Here is an example of how Budibase changed my life for the better and
          now all I do is eat, sleep, build apps, repeat."
        </div>
        <div class="user">
          <img
            src="https://icon-library.com/images/male-user-icon/male-user-icon-24.jpg"
          />
          <div class="author">
            <div class="name">No-code Enthusiast</div>
            <div class="company">Bedroom TLD</div>
          </div>
        </div>
      </Layout>
    </div>
  </div>
</SplitPage>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }
  .testimonial {
    width: 280px;
    padding: 40px;
  }
  .text {
    font-size: var(--font-size-l);
    font-style: italic;
  }
  img {
    width: 40px;
  }
  .user {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-s);
  }
  .name {
    font-weight: bold;
    color: var(--spectrum-global-color-gray-900);
    font-size: var(--font-size-l);
  }
  .company {
    color: var(--spectrum-global-color-gray-700);
  }
</style>
