import { capitalize } from 'lodash';

export const messages = {
  jsonPrimitivesOnly: Symbol("column-info-json-primitives-only"),
  stringAsNumber: Symbol("column-info-string-as-number"),
  chartDatetime: Symbol("column-info-chart-datetime"),
  notRequired: Symbol("column-info-not-required"),
  contextError: Symbol("column-info-context-error"),
}

export const support = {
  unsupported: Symbol("column-info-unsupported"),
  partialSupport: Symbol("column-info-partialSupport"),
  supported: Symbol("column-info-supported")
}


const getSupport = (type, columnInfo) => {
  if (!columnInfo?.typeSupport) {
    return support.supported
  }

  if (columnInfo?.typeSupport?.supported?.find(mapping => mapping === type || mapping?.type === type)) {
    return support.supported;
  }

  if (columnInfo?.typeSupport?.partialSupport?.find(mapping => mapping === type || mapping?.type === type)) {
    return support.partialSupport;
  }

  return support.unsupported
}

const getSupportMessage = (type, columnInfo) => {
  if (!columnInfo?.typeSupport) {
    return null
  }

  const supported = columnInfo?.typeSupport?.supported?.find(mapping => mapping?.type === type)
  if (supported) {
    return messages[supported?.message]
  }

  const partialSupport = columnInfo?.typeSupport?.partialSupport?.find(mapping => mapping?.type === type)
  if (partialSupport) {
    return messages[partialSupport?.message]
  }

  const unsupported = columnInfo?.typeSupport?.unsupported?.find(mapping => mapping?.type === type)
  if (unsupported) {
    return messages[unsupported?.message]
  }

  return null
}

export const getColumnInfoMessagesAndSupport = (fieldSchema, columnInfo) => {

  try {
    const columnInfoMessagesAndSupport = {
      support: getSupport(fieldSchema.type, columnInfo),
      messages: [getSupportMessage(fieldSchema.type, columnInfo)],
    }

    const isRequired = fieldSchema?.constraints?.presence?.allowEmpty === false
    if (!isRequired) {
      columnInfoMessagesAndSupport.messages.push(messages.notRequired);
    }

    return columnInfoMessagesAndSupport;
  } catch (e) {
    return {
      support: support.partialSupport,
      messages: [messages.contextError]
    }
  }
}
