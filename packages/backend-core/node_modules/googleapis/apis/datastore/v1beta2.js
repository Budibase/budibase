/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* jshint maxlen: false */

'use strict';

var createAPIRequest = require('../../lib/apirequest');
var utils = require('../../lib/utils');

/**
 * Google Cloud Datastore API
 *
 * Stores and queries data in Google Cloud Datastore.
 *
 * @example
 * var google = require('googleapis');
 * var datastore = google.datastore('v1beta2');
 *
 * @namespace datastore
 * @type {Function}
 * @version v1beta2
 * @variation v1beta2
 * @param {object=} options Options for Datastore
 */
function Datastore(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.datasets = {

    /**
     * datastore.datasets.allocateIds
     *
     * @desc Allocate IDs for incomplete keys (useful for referencing an entity before it is inserted).
     *
     * @alias datastore.datasets.allocateIds
     * @memberOf! datastore(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datasetId Identifies the dataset.
     * @param {datastore(v1beta2).AllocateIdsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    allocateIds: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/datastore/v1beta2/datasets/{datasetId}/allocateIds',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['datasetId'],
        pathParams: ['datasetId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * datastore.datasets.beginTransaction
     *
     * @desc Begin a new transaction.
     *
     * @alias datastore.datasets.beginTransaction
     * @memberOf! datastore(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datasetId Identifies the dataset.
     * @param {datastore(v1beta2).BeginTransactionRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    beginTransaction: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/datastore/v1beta2/datasets/{datasetId}/beginTransaction',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['datasetId'],
        pathParams: ['datasetId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * datastore.datasets.commit
     *
     * @desc Commit a transaction, optionally creating, deleting or modifying some entities.
     *
     * @alias datastore.datasets.commit
     * @memberOf! datastore(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datasetId Identifies the dataset.
     * @param {datastore(v1beta2).CommitRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    commit: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/datastore/v1beta2/datasets/{datasetId}/commit',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['datasetId'],
        pathParams: ['datasetId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * datastore.datasets.lookup
     *
     * @desc Look up some entities by key.
     *
     * @alias datastore.datasets.lookup
     * @memberOf! datastore(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datasetId Identifies the dataset.
     * @param {datastore(v1beta2).LookupRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    lookup: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/datastore/v1beta2/datasets/{datasetId}/lookup',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['datasetId'],
        pathParams: ['datasetId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * datastore.datasets.rollback
     *
     * @desc Roll back a transaction.
     *
     * @alias datastore.datasets.rollback
     * @memberOf! datastore(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datasetId Identifies the dataset.
     * @param {datastore(v1beta2).RollbackRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    rollback: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/datastore/v1beta2/datasets/{datasetId}/rollback',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['datasetId'],
        pathParams: ['datasetId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * datastore.datasets.runQuery
     *
     * @desc Query for entities.
     *
     * @alias datastore.datasets.runQuery
     * @memberOf! datastore(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datasetId Identifies the dataset.
     * @param {datastore(v1beta2).RunQueryRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    runQuery: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/datastore/v1beta2/datasets/{datasetId}/runQuery',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['datasetId'],
        pathParams: ['datasetId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef AllocateIdsRequest
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {datastore(v1beta2).Key[]} keys A list of keys with incomplete key paths to allocate IDs for. No key may be reserved/read-only.
 */
/**
 * @typedef AllocateIdsResponse
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {datastore(v1beta2).ResponseHeader} header 
 * @property {datastore(v1beta2).Key[]} keys The keys specified in the request (in the same order), each with its key path completed with a newly allocated ID.
 */
/**
 * @typedef BeginTransactionRequest
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {string} isolationLevel The transaction isolation level. Either snapshot or serializable. The default isolation level is snapshot isolation, which means that another transaction may not concurrently modify the data that is modified by this transaction. Optionally, a transaction can request to be made serializable which means that another transaction cannot concurrently modify the data that is read or modified by this transaction.
 */
/**
 * @typedef BeginTransactionResponse
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {datastore(v1beta2).ResponseHeader} header 
 * @property {string} transaction The transaction identifier (always present).
 */
/**
 * @typedef CommitRequest
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {boolean} ignoreReadOnly 
 * @property {string} mode The type of commit to perform. Either TRANSACTIONAL or NON_TRANSACTIONAL.
 * @property {datastore(v1beta2).Mutation} mutation The mutation to perform. Optional.
 * @property {string} transaction The transaction identifier, returned by a call to beginTransaction. Must be set when mode is TRANSACTIONAL.
 */
/**
 * @typedef CommitResponse
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {datastore(v1beta2).ResponseHeader} header 
 * @property {datastore(v1beta2).MutationResult} mutationResult The result of performing the mutation (if any).
 */
/**
 * @typedef CompositeFilter
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {datastore(v1beta2).Filter[]} filters The list of filters to combine. Must contain at least one filter.
 * @property {string} operator The operator for combining multiple filters. Only &quot;and&quot; is currently supported.
 */
/**
 * @typedef Entity
 * @memberOf! datastore(v1beta2)
 * @type object
* @property {datastore(v1beta2).Key} key The entity&#39;s key.

An entity must have a key, unless otherwise documented (for example, an entity in Value.entityValue may have no key). An entity&#39;s kind is its key&#39;s path&#39;s last element&#39;s kind, or null if it has no key.
* @property {object} properties The entity&#39;s properties.
*/
/**
 * @typedef EntityResult
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {datastore(v1beta2).Entity} entity The resulting entity.
 */
/**
 * @typedef Filter
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {datastore(v1beta2).CompositeFilter} compositeFilter A composite filter.
 * @property {datastore(v1beta2).PropertyFilter} propertyFilter A filter on a property.
 */
/**
 * @typedef GqlQuery
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {boolean} allowLiteral When false, the query string must not contain a literal.
 * @property {datastore(v1beta2).GqlQueryArg[]} nameArgs A named argument must set field GqlQueryArg.name. No two named arguments may have the same name. For each non-reserved named binding site in the query string, there must be a named argument with that name, but not necessarily the inverse.
 * @property {datastore(v1beta2).GqlQueryArg[]} numberArgs Numbered binding site @1 references the first numbered argument, effectively using 1-based indexing, rather than the usual 0. A numbered argument must NOT set field GqlQueryArg.name. For each binding site numbered i in query_string, there must be an ith numbered argument. The inverse must also be true.
 * @property {string} queryString The query string.
 */
/**
 * @typedef GqlQueryArg
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {string} cursor 
 * @property {string} name Must match regex &quot;[A-Za-z_$][A-Za-z_$0-9]*&quot;. Must not match regex &quot;__.*__&quot;. Must not be &quot;&quot;.
 * @property {datastore(v1beta2).Value} value 
 */
/**
 * @typedef Key
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {datastore(v1beta2).PartitionId} partitionId Entities are partitioned into subsets, currently identified by a dataset (usually implicitly specified by the project) and namespace ID. Queries are scoped to a single partition.
 * @property {datastore(v1beta2).KeyPathElement[]} path The entity path. An entity path consists of one or more elements composed of a kind and a string or numerical identifier, which identify entities. The first element identifies a root entity, the second element identifies a child of the root entity, the third element a child of the second entity, and so forth. The entities identified by all prefixes of the path are called the element&#39;s ancestors. An entity path is always fully complete: ALL of the entity&#39;s ancestors are required to be in the path along with the entity identifier itself. The only exception is that in some documented cases, the identifier in the last path element (for the entity) itself may be omitted. A path can never be empty. The path can have at most 100 elements.
 */
/**
 * @typedef KeyPathElement
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {string} id The ID of the entity. Never equal to zero. Values less than zero are discouraged and will not be supported in the future.
 * @property {string} kind The kind of the entity. A kind matching regex &quot;__.*__&quot; is reserved/read-only. A kind must not contain more than 500 characters. Cannot be &quot;&quot;.
 * @property {string} name The name of the entity. A name matching regex &quot;__.*__&quot; is reserved/read-only. A name must not be more than 500 characters. Cannot be &quot;&quot;.
 */
/**
 * @typedef KindExpression
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {string} name The name of the kind.
 */
/**
 * @typedef LookupRequest
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {datastore(v1beta2).Key[]} keys Keys of entities to look up from the datastore.
 * @property {datastore(v1beta2).ReadOptions} readOptions Options for this lookup request. Optional.
 */
/**
 * @typedef LookupResponse
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {datastore(v1beta2).Key[]} deferred A list of keys that were not looked up due to resource constraints.
 * @property {datastore(v1beta2).EntityResult[]} found Entities found.
 * @property {datastore(v1beta2).ResponseHeader} header 
 * @property {datastore(v1beta2).EntityResult[]} missing Entities not found, with only the key populated.
 */
/**
 * @typedef Mutation
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {datastore(v1beta2).Key[]} delete Keys of entities to delete. Each key must have a complete key path and must not be reserved/read-only.
 * @property {boolean} force Ignore a user specified read-only period. Optional.
 * @property {datastore(v1beta2).Entity[]} insert Entities to insert. Each inserted entity&#39;s key must have a complete path and must not be reserved/read-only.
 * @property {datastore(v1beta2).Entity[]} insertAutoId Insert entities with a newly allocated ID. Each inserted entity&#39;s key must omit the final identifier in its path and must not be reserved/read-only.
 * @property {datastore(v1beta2).Entity[]} update Entities to update. Each updated entity&#39;s key must have a complete path and must not be reserved/read-only.
 * @property {datastore(v1beta2).Entity[]} upsert Entities to upsert. Each upserted entity&#39;s key must have a complete path and must not be reserved/read-only.
 */
/**
 * @typedef MutationResult
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {integer} indexUpdates Number of index writes.
 * @property {datastore(v1beta2).Key[]} insertAutoIdKeys Keys for insertAutoId entities. One per entity from the request, in the same order.
 */
/**
 * @typedef PartitionId
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {string} datasetId The dataset ID.
 * @property {string} namespace The namespace.
 */
/**
 * @typedef Property
 * @memberOf! datastore(v1beta2)
 * @type object
* @property {string} blobKeyValue A blob key value.
* @property {string} blobValue A blob value. May be a maximum of 1,000,000 bytes. When indexed is true, may have at most 500 bytes.
* @property {boolean} booleanValue A boolean value.
* @property {string} dateTimeValue A timestamp value.
* @property {number} doubleValue A double value.
* @property {datastore(v1beta2).Entity} entityValue An entity value. May have no key. May have a key with an incomplete key path. May have a reserved/read-only key.
* @property {boolean} indexed If the value should be indexed.

The indexed property may be set for a null value. When indexed is true, stringValue is limited to 500 characters and the blob value is limited to 500 bytes. Input values by default have indexed set to true; however, you can explicitly set indexed to true if you want. (An output value never has indexed explicitly set to true.) If a value is itself an entity, it cannot have indexed set to true.
* @property {string} integerValue An integer value.
* @property {datastore(v1beta2).Key} keyValue A key value.
* @property {datastore(v1beta2).Value[]} listValue A list value. Cannot contain another list value. A Value instance that sets field list_value must not set field meaning or field indexed.
* @property {integer} meaning The meaning field is reserved and should not be used.
* @property {string} stringValue A UTF-8 encoded string value. When indexed is true, may have at most 500 characters.
*/
/**
 * @typedef PropertyExpression
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {string} aggregationFunction The aggregation function to apply to the property. Optional. Can only be used when grouping by at least one property. Must then be set on all properties in the projection that are not being grouped by. Aggregation functions: first selects the first result as determined by the query&#39;s order.
 * @property {datastore(v1beta2).PropertyReference} property The property to project.
 */
/**
 * @typedef PropertyFilter
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {string} operator The operator to filter by. One of lessThan, lessThanOrEqual, greaterThan, greaterThanOrEqual, equal, or hasAncestor.
 * @property {datastore(v1beta2).PropertyReference} property The property to filter by.
 * @property {datastore(v1beta2).Value} value The value to compare the property to.
 */
/**
 * @typedef PropertyOrder
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {string} direction The direction to order by. One of ascending or descending. Optional, defaults to ascending.
 * @property {datastore(v1beta2).PropertyReference} property The property to order by.
 */
/**
 * @typedef PropertyReference
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {string} name The name of the property.
 */
/**
 * @typedef Query
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {string} endCursor An ending point for the query results. Optional. Query cursors are returned in query result batches.
 * @property {datastore(v1beta2).Filter} filter The filter to apply (optional).
 * @property {datastore(v1beta2).PropertyReference[]} groupBy The properties to group by (if empty, no grouping is applied to the result set).
 * @property {datastore(v1beta2).KindExpression[]} kinds The kinds to query (if empty, returns entities from all kinds).
 * @property {integer} limit The maximum number of results to return. Applies after all other constraints. Optional.
 * @property {integer} offset The number of results to skip. Applies before limit, but after all other constraints (optional, defaults to 0).
 * @property {datastore(v1beta2).PropertyOrder[]} order The order to apply to the query results (if empty, order is unspecified).
 * @property {datastore(v1beta2).PropertyExpression[]} projection The projection to return. If not set the entire entity is returned.
 * @property {string} startCursor A starting point for the query results. Optional. Query cursors are returned in query result batches.
 */
/**
 * @typedef QueryResultBatch
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {string} endCursor A cursor that points to the position after the last result in the batch. May be absent. TODO(arfuller): Once all plans produce cursors update documentation here.
 * @property {string} entityResultType The result type for every entity in entityResults. full for full entities, projection for entities with only projected properties, keyOnly for entities with only a key.
 * @property {datastore(v1beta2).EntityResult[]} entityResults The results for this batch.
 * @property {string} moreResults The state of the query after the current batch. One of notFinished, moreResultsAfterLimit, noMoreResults.
 * @property {integer} skippedResults The number of results skipped because of Query.offset.
 */
/**
 * @typedef ReadOptions
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {string} readConsistency The read consistency to use. One of default, strong, or eventual. Cannot be set when transaction is set. Lookup and ancestor queries default to strong, global queries default to eventual and cannot be set to strong. Optional. Default is default.
 * @property {string} transaction The transaction to use. Optional.
 */
/**
 * @typedef ResponseHeader
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;datastore#responseHeader&quot;.
 */
/**
 * @typedef RollbackRequest
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {string} transaction The transaction identifier, returned by a call to beginTransaction.
 */
/**
 * @typedef RollbackResponse
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {datastore(v1beta2).ResponseHeader} header 
 */
/**
 * @typedef RunQueryRequest
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {datastore(v1beta2).GqlQuery} gqlQuery The GQL query to run. Either this field or field query must be set, but not both.
 * @property {datastore(v1beta2).PartitionId} partitionId Entities are partitioned into subsets, identified by a dataset (usually implicitly specified by the project) and namespace ID. Queries are scoped to a single partition. This partition ID is normalized with the standard default context partition ID, but all other partition IDs in RunQueryRequest are normalized with this partition ID as the context partition ID.
 * @property {datastore(v1beta2).Query} query The query to run. Either this field or field gql_query must be set, but not both.
 * @property {datastore(v1beta2).ReadOptions} readOptions The options for this query.
 */
/**
 * @typedef RunQueryResponse
 * @memberOf! datastore(v1beta2)
 * @type object
 * @property {datastore(v1beta2).QueryResultBatch} batch A batch of query results (always present).
 * @property {datastore(v1beta2).ResponseHeader} header 
 */
/**
 * @typedef Value
 * @memberOf! datastore(v1beta2)
 * @type object
* @property {string} blobKeyValue A blob key value.
* @property {string} blobValue A blob value. May be a maximum of 1,000,000 bytes. When indexed is true, may have at most 500 bytes.
* @property {boolean} booleanValue A boolean value.
* @property {string} dateTimeValue A timestamp value.
* @property {number} doubleValue A double value.
* @property {datastore(v1beta2).Entity} entityValue An entity value. May have no key. May have a key with an incomplete key path. May have a reserved/read-only key.
* @property {boolean} indexed If the value should be indexed.

The indexed property may be set for a null value. When indexed is true, stringValue is limited to 500 characters and the blob value is limited to 500 bytes. Input values by default have indexed set to true; however, you can explicitly set indexed to true if you want. (An output value never has indexed explicitly set to true.) If a value is itself an entity, it cannot have indexed set to true.
* @property {string} integerValue An integer value.
* @property {datastore(v1beta2).Key} keyValue A key value.
* @property {datastore(v1beta2).Value[]} listValue A list value. Cannot contain another list value. A Value instance that sets field list_value must not set field meaning or field indexed.
* @property {integer} meaning The meaning field is reserved and should not be used.
* @property {string} stringValue A UTF-8 encoded string value. When indexed is true, may have at most 500 characters.
*/
module.exports = Datastore;
