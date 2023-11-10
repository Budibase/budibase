<script>
  export let name = ""

  const rows = [
    {
      firstName: "Julie",
      lastName: "Jimenez",
      email: "julie.jimenez@example.com",
      address: "4250 New Street",
      city: "Stevenage",
      postcode: "EE32 3SE",
      phone: "01754 13523",
    },
    {
      firstName: "Mandy",
      lastName: "Clark",
      email: "mandy.clark@example.com",
      address: "8632 North Street",
      city: "Hereford",
      postcode: "GT81 7DG",
      phone: "016973 32814",
    },
    {
      firstName: "Holly",
      lastName: "Carroll",
      email: "holly.carroll@example.com",
      address: "5976 Springfield Road",
      city: "Edinburgh",
      postcode: "Y4 2LH",
      phone: "016977 73053",
    },
    {
      firstName: "Francis",
      lastName: "Castro",
      email: "francis.castro@example.com",
      address: "3970 High Street",
      city: "Wells",
      postcode: "X12 6QA",
      phone: "017684 23551",
    },
  ]
</script>

<div tabindex="-1" class="exampleApp">
  <div class="page">
    <div class="header">
      <img alt="Budibase Logo" src={"/builder/bblogo.png"} />
      <h1>{name}</h1>
    </div>
    <div class="nav">Home</div>
    <table>
      <thead>
        <tr>
          <th>FIRST NAME</th>
          <th>LAST NAME</th>
          <th>EMAIL</th>
          <th>ADDRESS</th>
          <th>CITY</th>
          <th>POSTCODE</th>
          <th>PHONE</th>
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
    <div class="sidePanel">
      <h2>{rows[0].firstName}</h2>
      <div class="field">
        <label for="exampleLastName">lastName</label>
        <input
          id="exampleLastName"
          tabIndex="-1"
          readonly
          value={rows[0].lastName}
        />
      </div>

      <div class="field">
        <label for="exampleEmail">Email</label>
        <input id="exampleEmail" tabIndex="-1" readonly value={rows[0].email} />
      </div>

      <div class="field">
        <label for="exampleAddress">Address</label>
        <input
          id="exampleAddress"
          tabIndex="-1"
          readonly
          value={rows[0].address}
        />
      </div>

      <div class="field">
        <label for="exampleCity">City</label>
        <input id="exampleCity" tabIndex="-1" readonly value={rows[0].city} />
      </div>

      <div class="field">
        <label for="examplePostcode">Postcode</label>
        <input
          id="examplePostcode"
          tabIndex="-1"
          readonly
          value={rows[0].postcode}
        />
      </div>

      <div class="field">
        <label for="examplePhone">Phone</label>
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

  .sidePanel {
    position: absolute;
    width: 300px;
    background-color: var(--backgroundLight);
    box-shadow: 0px 4px 25px 0px #00000040;
    height: 100%;
    top: 0;
    right: -364px;
    padding: 42px 32px;
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
