import { buildIndex } from './buildIndex';
import { listItems } from './listItems';
import { aggregates } from './aggregates';

export const getIndexApi = app => ({
  listItems: listItems(app),
  buildIndex: buildIndex(app),
  aggregates: aggregates(app),
});

export default getIndexApi;
