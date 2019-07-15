import {
  map, reduce, filter,
  isEmpty, flatten, each,
} from 'lodash/fp';
import { compileExpression } from '@nx-js/compiler-util';
import _ from 'lodash';
import { getExactNodeForPath } from '../templateApi/hierarchy';
import { validateFieldParse, validateTypeConstraints } from '../types';
import { $, isNothing, isNonEmptyString } from '../common';
import { _getContext } from './getContext';

const fieldParseError = (fieldName, value) => ({
  fields: [fieldName],
  message: `Could not parse field ${fieldName}:${value}`,
});

const validateAllFieldParse = (record, recordNode) => $(recordNode.fields, [
  map(f => ({ name: f.name, parseResult: validateFieldParse(f, record) })),
  reduce((errors, f) => {
    if (f.parseResult.success) return errors;
    errors.push(
      fieldParseError(f.name, f.parseResult.value),
    );
    return errors;
  }, []),
]);

const validateAllTypeConstraints = async (record, recordNode, context) => {
  const errors = [];
  for (const field of recordNode.fields) {
    $(await validateTypeConstraints(field, record, context), [
      filter(isNonEmptyString),
      map(m => ({ message: m, fields: [field.name] })),
      each(e => errors.push(e)),
    ]);
  }
  return errors;
};

const runRecordValidationRules = (record, recordNode) => {
  const runValidationRule = (rule) => {
    const isValid = compileExpression(rule.expressionWhenValid);
    const expressionContext = { record, _ };
    return (isValid(expressionContext)
      ? { valid: true }
      : ({
        valid: false,
        fields: rule.invalidFields,
        message: rule.messageWhenInvalid,
      }));
  };

  return $(recordNode.validationRules, [
    map(runValidationRule),
    flatten,
    filter(r => r.valid === false),
    map(r => ({ fields: r.fields, message: r.message })),
  ]);
};

export const validate = app => async (record, context) => {
  context = isNothing(context)
    ? _getContext(app, record.key)
    : context;

  const recordNode = getExactNodeForPath(app.hierarchy)(record.key);
  const fieldParseFails = validateAllFieldParse(record, recordNode);

  // non parsing would cause further issues - exit here
  if (!isEmpty(fieldParseFails)) { return ({ isValid: false, errors: fieldParseFails }); }

  const recordValidationRuleFails = runRecordValidationRules(record, recordNode);
  const typeContraintFails = await validateAllTypeConstraints(record, recordNode, context);

  if (isEmpty(fieldParseFails)
       && isEmpty(recordValidationRuleFails)
       && isEmpty(typeContraintFails)) {
    return ({ isValid: true, errors: [] });
  }

  return ({
    isValid: false,
    errors: _.union(fieldParseFails, typeContraintFails, recordValidationRuleFails),
  });
};
