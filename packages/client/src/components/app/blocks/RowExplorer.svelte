<script>
  import Block from "components/Block.svelte"
  import BlockComponent from "components/BlockComponent.svelte"
  import { makePropSafe as safe } from "@budibase/string-templates"
  import { generate } from "shortid"

  export let dataSource
  export let height

  export let cardTitle
  export let cardSubtitle
  export let cardDescription
  export let cardImageURL
  export let cardSearchField

  export let detailFields
  export let detailTitle

  const stateKey = generate()

  let listDataProviderId
  let listRepeaterId
</script>

<Block>
  <BlockComponent
    type="container"
    props={{
      direction: "row",
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
            id: generate(),
            field: cardSearchField,
            operator: "fuzzy",
            type: "string",
            value: `{{ [state].[${stateKey}-search] }}`,
            valueType: "Binding",
            noValue: false,
          },
        ],
      }}
      styles={{
        custom: `
          flex: 3;
          overflow: scroll;
          {{#if (and [state].[${stateKey}] [device].[mobile]) }}
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
                  value: "{{ [eventContext].[value] }}",
                },
                "##eventHandlerType": "Update State",
                id: generate(),
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
          noRowsMessage: "No data",
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
                  value: `{{ [${listRepeaterId}].[_id] }}`,
                },
                "##eventHandlerType": "Update State",
                id: generate(),
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
          {{#if (or [state].[${stateKey}] [device].[mobile]) }}
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
          {{#if (isFalsey [state].[${stateKey}]) }}
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
              id: generate(),
            },
          ],
        }}
        styles={{
          custom: `
            align-self: flex-end;
            margin-bottom: 5px;
            {{#if (not [device].[mobile]) }}
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
          rowId: `{{ [state].[${stateKey}] }}`,
          fields: detailFields,
          title: detailTitle,
        }}
      />
    </BlockComponent>
  </BlockComponent>
</Block>
