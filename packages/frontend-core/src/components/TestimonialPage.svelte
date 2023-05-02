<script>
  import SplitPage from "./SplitPage.svelte"
  import { Layout } from "@budibase/bbui"
  import Bulgaria from "../../assets/bulgaria.png"
  import Covanta from "../../assets/covanta.png"
  import Schnellecke from "../../assets/schnellecke.png"
  import { _ } from "../../../builder/lang/i18n"

  export let enabled = true

  const testimonials = [
    {
      text: $_("frontend-core.src.components.TestimonialPage.Budibase"),
      name: $_("frontend-core.src.components.TestimonialPage.Charles_Link"),
      role: $_("frontend-core.src.components.TestimonialPage.Senior_Director"),
      image: Covanta,
      imageSize: 105,
    },
    {
      text: $_("frontend-core.src.components.TestimonialPage.Budibase_mission"),
      name: $_(
        "frontend-core.src.components.TestimonialPage.Bozhidar_Bozhanov"
      ),
      role: $_(
        "frontend-core.src.components.TestimonialPage.Government_Bulgaria"
      ),
      image: Bulgaria,
      imageSize: 49,
    },
    {
      text: $_("frontend-core.src.components.TestimonialPage.Centralization"),
      name: $_("frontend-core.src.components.TestimonialPage.Davide_Lenzarini"),
      role: $_("frontend-core.src.components.TestimonialPage.IT_manager"),
      image: Schnellecke,
      imageSize: 141,
    },
  ]
  const testimonial = testimonials[Math.floor(Math.random() * 3)]
</script>

<SplitPage>
  <slot />
  <div class:wrapper={enabled} slot="right">
    {#if enabled}
      <div class="testimonial">
        <Layout noPadding gap="S">
          <img
            width={testimonial.imageSize}
            alt="a-happy-budibase-user"
            src={testimonial.image}
          />
          <div class="text">
            "{testimonial.text}"
          </div>
          <div class="author">
            <div class="name">{testimonial.name}</div>
            <div class="company">{testimonial.role}</div>
          </div>
        </Layout>
      </div>
    {/if}
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
    width: 380px;
    padding: 40px;
  }
  .text {
    font-size: var(--font-size-l);
    font-style: italic;
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
