export default ({ records }) =>
  records.map(r => ({
    name: `Save ${r.name} Button`,
    props: buttonProps(r),
  }))

const buttonProps = record => ({
  _component: "@budibase/standard-components/button",
  _children: [
    {
      _component: "@budibase/standard-components/text",
      text: `Save ${record.name}`,
    },
  ],
  onClick: [
    {
      "##eventHandlerType": "Save Record",
      parameters: {
        statePath: `${record.name}`,
      },
    },
  ],
})
