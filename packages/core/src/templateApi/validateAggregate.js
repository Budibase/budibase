import { flatten, map, isEmpty } from 'lodash/fp';
import { compileCode } from '@nx-js/compiler-util';
import {
  isNonEmptyString, 
  executesWithoutException, $, 
} from '../common';
import { applyRuleSet, makerule } from '../common/validationCommon';

const aggregateRules = [
  makerule('name', 'choose a name for the aggregate',
    a => isNonEmptyString(a.name)),
  makerule('aggregatedValue', 'aggregatedValue does not compile',
    a => isEmpty(a.aggregatedValue)
            || executesWithoutException(
              () => compileCode(a.aggregatedValue),
            )),
];

export const validateAggregate = aggregate => applyRuleSet(aggregateRules)(aggregate);

export const validateAllAggregates = all => $(all, [
  map(validateAggregate),
  flatten,
]);
