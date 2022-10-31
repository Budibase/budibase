<script>
  import Block from "components/Block.svelte"
  import BlockComponent from "components/BlockComponent.svelte"
  import { makePropSafe as safe } from "@budibase/string-templates"
  import { generate } from "shortid"

  export let dataSource
  export let detailsHeading

  export let cardTitle
  export let cardSubtitle
  export let cardDescription
  export let cardImageURL

  const stateKey = generate()

  let listDataProviderId
  let listRepeaterId

  let selectedCardDataProviderId
  let selectedCardRepeaterId
</script>

<Block>
  <!-- seems like eject is unable to create two top-level components -->
  <BlockComponent
    type="container"
    props={{
      direction: "row",
    }}
    styles={{
      normal: {
        width: "100%",
        height: "600px",
      },
    }}
  >
    <BlockComponent
      type="dataprovider"
      bind:id={listDataProviderId}
      props={{
        dataSource,
        paginate: true,
        limit: 10,
      }}
      order={0}
      styles={{
        normal: {
          "flex-basis": "fit-content",
          flex: "1",
          "max-width": "400px",
          overflow: "scroll",
        },
      }}
    >
      <BlockComponent
        type="repeater"
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
      type="dataprovider"
      bind:id={selectedCardDataProviderId}
      props={{
        dataSource,
        conditions: [],
        filter: [
          {
            id: generate(),
            field: "1:_id",
            operator: "equal",
            value: `{{ [state].[${stateKey}] }}`,
            valueType: "Binding",
            type: "string",
            noValue: false,
          },
        ],
        limit: 1,
      }}
      order={1}
      styles={{
        normal: {
          flex: "1",
        },
      }}
    >
      <BlockComponent
        type="repeater"
        bind:id={selectedCardRepeaterId}
        props={{
          dataProvider: `{{ literal ${safe(selectedCardDataProviderId)} }}`,
          direction: "column",
          gap: "S",
          noRowsMessage: "No data",
        }}
        styles={{
          normal: {
            "margin-left": "10px",
            overflow: "auto",
            border: "1px solid rgb(225, 225, 225)",
            "border-radius": "4px",
          },
        }}
      >
        <BlockComponent
          type="rowdetails"
          props={{
            repeater: `{{ literal ${safe(selectedCardRepeaterId)} }}`,
            noDataMessage: "No data",
            heading: detailsHeading,
          }}
        />
      </BlockComponent>
    </BlockComponent>
  </BlockComponent>
</Block>
