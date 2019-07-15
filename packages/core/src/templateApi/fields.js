import {
  some, map, filter, keys, includes,
  countBy, flatten,
} from 'lodash/fp';
import {
  isSomething, $,
  isNonEmptyString,
  isNothingOrEmpty,
  isNothing,
} from '../common';
import { all, getDefaultOptions } from '../types';
import { applyRuleSet, makerule } from '../common/validationCommon';
import { BadRequestError } from '../common/errors';

export const fieldErrors = {
  AddFieldValidationFailed: 'Add field validation: ',
};

export const allowedTypes = () => keys(all);

export const getNewField = type => ({
  name: '', // how field is referenced internally
  type,
  typeOptions: getDefaultOptions(type),
  label: '', // how field is displayed
  getInitialValue: 'default', // function that gets value when initially created
  getUndefinedValue: 'default', // function that gets value when field undefined on record
});

const fieldRules = allFields => [
  makerule('name', 'field name is not set',
    f => isNonEmptyString(f.name)),
  makerule('type', 'field type is not set',
    f => isNonEmptyString(f.type)),
  makerule('label', 'field label is not set',
    f => isNonEmptyString(f.label)),
  makerule('getInitialValue', 'getInitialValue function is not set',
    f => isNonEmptyString(f.getInitialValue)),
  makerule('getUndefinedValue', 'getUndefinedValue function is not set',
    f => isNonEmptyString(f.getUndefinedValue)),
  makerule('name', 'field name is duplicated',
    f => isNothingOrEmpty(f.name)
             || countBy('name')(allFields)[f.name] === 1),
  makerule('type', 'type is unknown',
    f => isNothingOrEmpty(f.type)
             || some(t => f.type === t)(allowedTypes())),
];

const typeOptionsRules = (field) => {
  const type = all[field.type];
  if (isNothing(type)) return [];

  const def = optName => type.optionDefinitions[optName];

  return $(field.typeOptions, [
    keys,
    filter(o => isSomething(def(o))
                    && isSomething(def(o).isValid)),
    map(o => makerule(
      `typeOptions.${o}`,
      `${def(o).requirementDescription}`,
      field => def(o).isValid(field.typeOptions[o]),
    )),
  ]);
};

export const validateField = allFields => (field) => {
  const everySingleField = includes(field)(allFields) ? allFields : [...allFields, field];
  return applyRuleSet([...fieldRules(everySingleField), ...typeOptionsRules(field)])(field);
};

export const validateAllFields = recordNode => $(recordNode.fields, [
  map(validateField(recordNode.fields)),
  flatten,
]);

export const addField = (recordTemplate, field) => {
  if (isNothingOrEmpty(field.label)) {
    field.label = field.name;
  }
  const validationMessages = validateField([...recordTemplate.fields, field])(field);
  if (validationMessages.length > 0) {
    const errors = map(m => m.error)(validationMessages);
    throw new BadRequestError(`${fieldErrors.AddFieldValidationFailed} ${errors.join(', ')}`);
  }
  recordTemplate.fields.push(field);
};
