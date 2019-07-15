import {
  keys, isObject, has,
  clone, map, isNull, constant,
} from 'lodash';
import {
  typeFunctions, parsedFailed, 
  parsedSuccess, getDefaultExport,
} from './typeHelpers';
import { switchCase, defaultCase, $ } from '../common';

const objectFunctions = (definition, allTypes) => typeFunctions({
  default: constant(null),
  initialise: () => $(keys(definition), [
    map(() => {
      const defClone = clone(definition);
      for (const k in defClone) {
        defClone[k] = allTypes[k].getNew();
      }
      return defClone;
    }),
  ]),

});


const parseObject = (definition, allTypes) => (record) => {
  const defClone = clone(definition);
  for (const k in defClone) {
    const type = allTypes[defClone[k]];
    defClone[k] = has(record, k)
      ? type.safeParseValue(record[k])
      : type.getNew();
  }
  return parsedSuccess(defClone);
};


const objectTryParse = (definition, allTypes) => switchCase(
  [isNull, parsedSuccess],
  [isObject, parseObject(definition, allTypes)],
  [defaultCase, parsedFailed],
);

export default (typeName, definition, allTypes, defaultOptions, typeConstraints, sampleValue) => getDefaultExport(
  typeName,
  objectTryParse(definition, allTypes),
  objectFunctions(definition, allTypes),
  defaultOptions,
  typeConstraints,
  sampleValue,
  JSON.stringify,
);
