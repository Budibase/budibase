import {
  isString, isObjectLike,
  isNull, has, isEmpty,
} from 'lodash';
import {
  typeFunctions, makerule,
  parsedSuccess, getDefaultExport,
  parsedFailed,
} from './typeHelpers';
import {
  switchCase, defaultCase,
  isNonEmptyString, isArrayOfString,
} from '../common';

const referenceNothing = () => ({ key: '' });

const referenceFunctions = typeFunctions({
  default: referenceNothing,
});

const hasStringValue = (ob, path) => has(ob, path)
    && isString(ob[path]);

const isObjectWithKey = v => isObjectLike(v)
    && hasStringValue(v, 'key');

const referenceTryParse = v => switchCase(
  [isObjectWithKey, parsedSuccess],
  [isNull, () => parsedSuccess(referenceNothing())],
  [defaultCase, parsedFailed],
)(v);

const options = {
  indexNodeKey: {
    defaultValue: null,
    isValid: isNonEmptyString,
    requirementDescription: 'must be a non-empty string',
    parse: s => s,
  },
  displayValue: {
    defaultValue: '',
    isValid: isNonEmptyString,
    requirementDescription: 'must be a non-empty string',
    parse: s => s,
  },
  reverseIndexNodeKeys: {
    defaultValue: null,
    isValid: v => isArrayOfString(v) && v.length > 0,
    requirementDescription: 'must be a non-empty array of strings',
    parse: s => s,
  },
};

const isEmptyString = s => isString(s) && isEmpty(s);

const ensureReferenceExists = async (val, opts, context) => isEmptyString(val.key)
    || await context.referenceExists(opts, val.key);

const typeConstraints = [
  makerule(
    ensureReferenceExists,
    (val, opts) => `"${val[opts.displayValue]}" does not exist in options list (key: ${val.key})`,
  ),
];

export default getDefaultExport(
  'reference',
  referenceTryParse,
  referenceFunctions,
  options,
  typeConstraints,
  { key: 'key', value: 'value' },
  JSON.stringify,
);
