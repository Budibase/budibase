<script>
  import { _ } from "../../../../../../../lang/i18n"
  export let name = ""
  export let showData = false

  const rows = [
    {
      firstName: $_(
        "pages.builder.portal.apps.onboarding._components.ExampleApp.rows.1.firstName"
      ),
      lastName: $_(
        "pages.builder.portal.apps.onboarding._components.ExampleApp.rows.1.lastName"
      ),
      email: "julie.jimenez@example.com",
      address: $_(
        "pages.builder.portal.apps.onboarding._components.ExampleApp.rows.1.address"
      ),
      city: $_(
        "pages.builder.portal.apps.onboarding._components.ExampleApp.rows.1.city"
      ),
      postcode: "EE32 3SE",
      phone: "01754 13523",
    },
    {
      firstName: $_(
        "pages.builder.portal.apps.onboarding._components.ExampleApp.rows.2.firstName"
      ),
      lastName: $_(
        "pages.builder.portal.apps.onboarding._components.ExampleApp.rows.2.lastName"
      ),
      email: "mandy.clark@example.com",
      address: $_(
        "pages.builder.portal.apps.onboarding._components.ExampleApp.rows.2.address"
      ),
      city: $_(
        "pages.builder.portal.apps.onboarding._components.ExampleApp.rows.2.city"
      ),
      postcode: "GT81 7DG",
      phone: "016973 32814",
    },
    {
      firstName: $_(
        "pages.builder.portal.apps.onboarding._components.ExampleApp.rows.3.firstName"
      ),
      lastName: $_(
        "pages.builder.portal.apps.onboarding._components.ExampleApp.rows.3.lastName"
      ),
      email: "holly.carroll@example.com",
      address: $_(
        "pages.builder.portal.apps.onboarding._components.ExampleApp.rows.3.address"
      ),
      city: $_(
        "pages.builder.portal.apps.onboarding._components.ExampleApp.rows.3.city"
      ),
      postcode: "Y4 2LH",
      phone: "016977 73053",
    },
    {
      firstName: $_(
        "pages.builder.portal.apps.onboarding._components.ExampleApp.rows.4.firstName"
      ),
      lastName: $_(
        "pages.builder.portal.apps.onboarding._components.ExampleApp.rows.4.lastName"
      ),
      email: "francis.castro@example.com",
      address: $_(
        "pages.builder.portal.apps.onboarding._components.ExampleApp.rows.4.address"
      ),
      city: $_(
        "pages.builder.portal.apps.onboarding._components.ExampleApp.rows.4.city"
      ),
      postcode: "X12 6QA",
      phone: "017684 23551",
    },
  ]
</script>

<div tabindex="-1" class="exampleApp">
  <div class="page">
    <div class="header">
      <img alt="Budibase Logo" src={"https://i.imgur.com/Xhdt1YP.png"} />
      <h1>{name}</h1>
    </div>
    <div class="nav">
      {$_("pages.builder.portal.apps.onboarding._components.ExampleApp.Home")}
    </div>
    <table class={`table ${showData ? "tableVisible" : ""}`}>
      <thead>
        <tr>
          <th
            >{$_(
              "pages.builder.portal.apps.onboarding._components.ExampleApp.FIRST_NAME"
            )}</th
          >
          <th
            >{$_(
              "pages.builder.portal.apps.onboarding._components.ExampleApp.LAST_NAME"
            )}</th
          >
          <th
            >{$_(
              "pages.builder.portal.apps.onboarding._components.ExampleApp.EMAIL"
            )}</th
          >
          <th
            >{$_(
              "pages.builder.portal.apps.onboarding._components.ExampleApp.ADDRESS"
            )}</th
          >
          <th
            >{$_(
              "pages.builder.portal.apps.onboarding._components.ExampleApp.CITY"
            )}</th
          >
          <th
            >{$_(
              "pages.builder.portal.apps.onboarding._components.ExampleApp.POSTCODE"
            )}</th
          >
          <th
            >{$_(
              "pages.builder.portal.apps.onboarding._components.ExampleApp.PHONE"
            )}</th
          >
        </tr>
      </thead>
      <tbody>
        {#each rows as row}
          <tr>
            {#each Object.values(row) as value}
              <td>{value}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
    <div class={`sidePanel ${showData ? "sidePanelVisible" : ""}`}>
      <h2>{rows[0].firstName}</h2>
      <div class="field">
        <label for="exampleLastName"
          >{$_(
            "pages.builder.portal.apps.onboarding._components.ExampleApp.lastName"
          )}</label
        >
        <input
          id="exampleLastName"
          tabIndex="-1"
          readonly
          value={rows[0].lastName}
        />
      </div>

      <div class="field">
        <label for="exampleEmail"
          >{$_(
            "pages.builder.portal.apps.onboarding._components.ExampleApp.Email"
          )}</label
        >
        <input id="exampleEmail" tabIndex="-1" readonly value={rows[0].email} />
      </div>

      <div class="field">
        <label for="exampleAddress"
          >{$_(
            "pages.builder.portal.apps.onboarding._components.ExampleApp.Address"
          )}</label
        >
        <input
          id="exampleAddress"
          tabIndex="-1"
          readonly
          value={rows[0].address}
        />
      </div>

      <div class="field">
        <label for="exampleCity"
          >{$_(
            "pages.builder.portal.apps.onboarding._components.ExampleApp.City"
          )}</label
        >
        <input id="exampleCity" tabIndex="-1" readonly value={rows[0].city} />
      </div>

      <div class="field">
        <label for="examplePostcode"
          >{$_(
            "pages.builder.portal.apps.onboarding._components.ExampleApp.Postcode"
          )}</label
        >
        <input
          id="examplePostcode"
          tabIndex="-1"
          readonly
          value={rows[0].postcode}
        />
      </div>

      <div class="field">
        <label for="examplePhone"
          >{$_(
            "pages.builder.portal.apps.onboarding._components.ExampleApp.Phone"
          )}</label
        >
        <input id="examplePhone" tabIndex="-1" readonly value={rows[0].phone} />
      </div>
    </div>
  </div>
</div>

<style>
  .exampleApp {
    box-sizing: border-box;
    height: 100vh;
    padding: 100px 0 100px 100px;
    --text: #191919;
    --lightText: #303030;
    --extraLightText: #646464;
    --backgroundLight: #ffffff;
    --background: #f5f5f5;
    --tableBorder: 1px solid #e6e6e6;
    pointer-events: none;
  }

  .page {
    overflow: hidden;
    position: relative;
    height: 100%;
    background-color: var(--background);
    color: var(--text);
  }

  .header {
    background-color: var(--backgroundLight);
    display: flex;
    padding: 32px 0 20px 32px;
    align-items: center;
  }

  .header img {
    height: 36px;
    margin-right: 20px;
  }

  .header h1 {
    margin: 0;
    font-weight: 600;
    font-size: 20px;
  }

  .nav {
    background-color: var(--backgroundLight);
    padding: 20px 0 20px 32px;
    font-weight: 600;
    font-size: 16px;
    border-bottom: 1px solid #d0d0d0;
  }

  table {
    margin: 32px;
    border: var(--tableBorder);
    border-collapse: collapse;
    min-width: 100%;
  }

  thead {
    border-bottom: var(--tableBorder);
  }

  thead th {
    font-family: "Source Sans Pro";
    color: var(--lightText);
    white-space: nowrap;
    padding: 12px;
    font-weight: 600;
    font-size: 12px;
    text-align: left;
    min-width: 70px;
  }

  tbody td {
    border-bottom: 1px solid #e6e6e6;
    background-color: var(--backgroundLight);
    padding: 12px;
    color: var(--extraLightText);
    text-align: left;
  }

  .table {
    opacity: 0;
  }

  .tableVisible {
    opacity: 1;
  }

  .sidePanel {
    position: absolute;
    width: 300px;
    background-color: var(--backgroundLight);
    box-shadow: 0px 4px 25px 0px #00000040;
    height: 100%;
    top: 0;
    right: -364px;
    padding: 42px 32px;
  }

  .sidePanelVisible {
    right: 0;
  }

  .sidePanel h2 {
    margin: 0;
    font-weight: 600;
    font-size: 22px;
    margin-bottom: 35px;
  }

  .field {
    display: flex;
    width: 100%;
    align-items: center;
    margin-bottom: 20px;
  }

  .field label {
    font-weight: 500;
    font-size: 12px;
    color: #b0b0b0;
    width: 65px;
  }

  .field input {
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    color: var(--lightText);
    padding: 7.5px 12px;
    font-size: 13px;
    flex-grow: 1;
  }
</style>
