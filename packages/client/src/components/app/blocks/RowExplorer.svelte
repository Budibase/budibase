<script>
  import Block from "components/Block.svelte"
  import BlockComponent from "components/BlockComponent.svelte"
  import { makePropSafe as safe } from "@budibase/string-templates"
  import { generate } from "shortid"
  import { get } from "svelte/store"
  import { getContext } from "svelte"

  export let dataSource
  export let height
  export let cardTitle
  export let cardSubtitle
  export let cardDescription
  export let cardImageURL
  export let cardSearchField
  export let detailFields
  export let detailTitle
  export let noRowsMessage
  export let autoRefresh

  const stateKey = generate()
  const context = getContext("context")
  const { generateGoldenSample } = getContext("sdk")

  let listDataProviderId
  let listRepeaterId

  // Provide additional data context for live binding eval
  export const getAdditionalDataContext = () => {
    const rows = get(context)[listDataProviderId]?.rows || []
    const goldenRow = generateGoldenSample(rows)
    return {
      [listRepeaterId]: goldenRow,
    }
  }
</script>

<Block>
  <BlockComponent
    type="container"
    props={{
      direction: "row",
      gap: "M",
    }}
    styles={{
      custom: `
        height: ${height} !important;
      `,
    }}
  >
    <BlockComponent
      type="dataprovider"
      order={0}
      bind:id={listDataProviderId}
      props={{
        dataSource,
        paginate: true,
        limit: 10,
        filter: [
          {
            id: 0,
            field: cardSearchField,
            operator: "fuzzy",
            type: "string",
            value: `{{ ${safe("state")}.${safe(stateKey + "-search")} }}`,
            valueType: "Binding",
            noValue: false,
          },
        ],
        autoRefresh,
      }}
      styles={{
        custom: `
          flex: 3;
          overflow: scroll;
          {{#if (and ${safe("state")}.${safe(stateKey)} ${safe(
          "device"
        )}.${safe("mobile")}) }}
            display: none;
          {{/if}}
        `,
      }}
    >
      <BlockComponent
        type="form"
        order={0}
        styles={{
          normal: {
            "margin-bottom": "12px",
          },
        }}
      >
        <BlockComponent
          type="stringfield"
          props={{
            placeholder: "Search...",
            field: `${stateKey}-search`,
            onChange: [
              {
                parameters: {
                  key: `${stateKey}-search`,
                  type: "set",
                  persist: null,
                  value: `{{ ${safe("eventContext")}.${safe("value")} }}`,
                },
                "##eventHandlerType": "Update State",
                id: 0,
              },
            ],
          }}
        />
      </BlockComponent>
      <BlockComponent
        type="repeater"
        order={1}
        bind:id={listRepeaterId}
        context="repeater"
        props={{
          dataProvider: `{{ literal ${safe(listDataProviderId)} }}`,
          direction: "column",
          gap: "S",
          noRowsMessage: noRowsMessage || "No data",
        }}
      >
        <BlockComponent
          type="spectrumcard"
          props={{
            title: cardTitle,
            subtitle: cardSubtitle,
            description: cardDescription,
            imageURL: cardImageURL,
            horizontal: true,
            buttonOnClick: [
              {
                parameters: {
                  key: stateKey,
                  type: "set",
                  persist: null,
                  value: `{{ ${safe(listRepeaterId)}.${safe("_id")} }}`,
                },
                "##eventHandlerType": "Update State",
                id: 0,
              },
            ],
          }}
          styles={{
            normal: {
              width: "auto",
            },
          }}
        />
      </BlockComponent>
    </BlockComponent>
    <BlockComponent
      type="container"
      order={1}
      props={{
        hAlign: "center",
        vAlign: "middle",
        size: "grow",
        direction: "column",
      }}
      styles={{
        custom: `
          padding: 20px;
          background-color: var(--spectrum-global-color-gray-50));
          border: 1px solid var(--spectrum-global-color-gray-300);
          border-radius: 4px;
          flex: 4;
          {{#if (or ${safe("state")}.${safe(stateKey)} ${safe("device")}.${safe(
          "mobile"
        )}) }}
            display: none;
          {{/if}}
          `,
      }}
    >
      <BlockComponent
        type="icon"
        order={0}
        props={{
          icon: "ri-list-check-2",
          size: "ri-2x",
          color: "var(--spectrum-global-color-gray-700)",
        }}
        styles={{
          normal: {
            "margin-bottom": "12px",
          },
        }}
      />
      <BlockComponent
        type="text"
        order={1}
        props={{
          text: "Select a row to view its fields",
          color: "var(--spectrum-global-color-gray-700)",
        }}
      />
    </BlockComponent>
    <BlockComponent
      type="container"
      order={2}
      props={{
        hAlign: "center",
        vAlign: "top",
        size: "grow",
        direction: "column",
      }}
      styles={{
        custom: `
          background-color: var(--spectrum-global-color-gray-50));
          border: 1px solid var(--spectrum-global-color-gray-300);
          border-radius: 4px;
          padding: 20px;
          overflow-y: scroll;
          flex: 4;
          {{#if (isFalsey ${safe("state")}.${safe(stateKey)}) }}
            display: none;
          {{/if}}
          `,
      }}
    >
      <BlockComponent
        type="button"
        order={0}
        props={{
          text: "← Back",
          onClick: [
            {
              parameters: {
                key: stateKey,
                type: "set",
                persist: null,
                value: "",
              },
              "##eventHandlerType": "Update State",
              id: 0,
            },
          ],
        }}
        styles={{
          custom: `
            align-self: flex-end;
            margin-bottom: 16px;
            {{#if (not ${safe("device")}.${safe("mobile")}) }}
              display: none;
            {{/if}}
            `,
        }}
      />
      <BlockComponent
        type="formblock"
        order={1}
        props={{
          showSaveButton: true,
          dataSource,
          actionType: "Update",
          rowId: `{{ ${safe("state")}.${safe(stateKey)} }}`,
          fields: detailFields,
          title: detailTitle,
        }}
      />
    </BlockComponent>
  </BlockComponent>
</Block>
