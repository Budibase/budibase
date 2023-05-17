<script>
  import { Layout } from "@budibase/bbui"
  import Bulgaria from "../../assets/bulgaria.png"
  import Covanta from "../../assets/covanta.png"
  import Schnellecke from "../../assets/schnellecke.png"

  const testimonials = [
    {
      text: "Budibase was the only solution that checked all the boxes for Covanta. Covanta expects to realize $3.2MM in savings due to the elimination of redundant data entry.",
      name: "Charles Link",
      role: "Senior Director, Data and Analytics",
      image: Covanta,
      imageSize: 105,
    },
    {
      text: "Budibase was mission-critical for us and went a long way in preventing what could have become a humanitarian crisis here in Bulgaria.",
      name: "Bozhidar Bozhanov",
      role: "Government of Bulgaria",
      image: Bulgaria,
      imageSize: 49,
    },
    {
      text: "Centralization of authentication, quick turnaround time for requests, integration with different database systems has given it the edge and it’s now used daily for internal development for those apps that you know you need but don’t feel value in losing days of development to reinvent the wheel.",
      name: "Davide Lenzarini",
      role: "IT manager",
      image: Schnellecke,
      imageSize: 141,
    },
  ]
  const testimonial = testimonials[Math.floor(Math.random() * 3)]
</script>

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

<style>
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
