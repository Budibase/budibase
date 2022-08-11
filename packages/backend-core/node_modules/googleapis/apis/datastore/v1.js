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
 * Accesses the schemaless NoSQL database to provide fully managed, robust, scalable storage for your application.

 *
 * @example
 * var google = require('googleapis');
 * var datastore = google.datastore('v1');
 *
 * @namespace datastore
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Datastore
 */
function Datastore(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.projects = {

    /**
     * datastore.projects.runQuery
     *
     * @desc Queries for entities.
     *
     * @alias datastore.projects.runQuery
     * @memberOf! datastore(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectId The ID of the project against which to make the request.
     * @param {datastore(v1).RunQueryRequest} params.resource Request body data
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
          url: 'https://datastore.googleapis.com/v1/projects/{projectId}:runQuery',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectId'],
        pathParams: ['projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * datastore.projects.beginTransaction
     *
     * @desc Begins a new transaction.
     *
     * @alias datastore.projects.beginTransaction
     * @memberOf! datastore(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectId The ID of the project against which to make the request.
     * @param {datastore(v1).BeginTransactionRequest} params.resource Request body data
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
          url: 'https://datastore.googleapis.com/v1/projects/{projectId}:beginTransaction',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectId'],
        pathParams: ['projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * datastore.projects.allocateIds
     *
     * @desc Allocates IDs for the given keys, which is useful for referencing an entity before it is inserted.
     *
     * @alias datastore.projects.allocateIds
     * @memberOf! datastore(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectId The ID of the project against which to make the request.
     * @param {datastore(v1).AllocateIdsRequest} params.resource Request body data
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
          url: 'https://datastore.googleapis.com/v1/projects/{projectId}:allocateIds',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectId'],
        pathParams: ['projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * datastore.projects.lookup
     *
     * @desc Looks up entities by key.
     *
     * @alias datastore.projects.lookup
     * @memberOf! datastore(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectId The ID of the project against which to make the request.
     * @param {datastore(v1).LookupRequest} params.resource Request body data
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
          url: 'https://datastore.googleapis.com/v1/projects/{projectId}:lookup',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectId'],
        pathParams: ['projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * datastore.projects.commit
     *
     * @desc Commits a transaction, optionally creating, deleting or modifying some entities.
     *
     * @alias datastore.projects.commit
     * @memberOf! datastore(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectId The ID of the project against which to make the request.
     * @param {datastore(v1).CommitRequest} params.resource Request body data
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
          url: 'https://datastore.googleapis.com/v1/projects/{projectId}:commit',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectId'],
        pathParams: ['projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * datastore.projects.rollback
     *
     * @desc Rolls back a transaction.
     *
     * @alias datastore.projects.rollback
     * @memberOf! datastore(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectId The ID of the project against which to make the request.
     * @param {datastore(v1).RollbackRequest} params.resource Request body data
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
          url: 'https://datastore.googleapis.com/v1/projects/{projectId}:rollback',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectId'],
        pathParams: ['projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Value
 * @memberOf! datastore(v1)
 * @type object
* @property {string} stringValue A UTF-8 encoded string value.
When `exclude_from_indexes` is false (it is indexed) , may have at most 1500 bytes.
Otherwise, may be set to at least 1,000,000 bytes.
* @property {datastore(v1).ArrayValue} arrayValue An array value.
Cannot contain another array value.
A `Value` instance that sets field `array_value` must not set fields
`meaning` or `exclude_from_indexes`.
* @property {datastore(v1).Entity} entityValue An entity value.

- May have no key.
- May have a key with an incomplete key path.
- May have a reserved/read-only key.
* @property {integer} meaning The `meaning` field should only be populated for backwards compatibility.
* @property {string} integerValue An integer value.
* @property {number} doubleValue A double value.
* @property {string} blobValue A blob value.
May have at most 1,000,000 bytes.
When `exclude_from_indexes` is false, may have at most 1500 bytes.
In JSON requests, must be base64-encoded.
* @property {datastore(v1).LatLng} geoPointValue A geo point value representing a point on the surface of Earth.
* @property {string} nullValue A null value.
* @property {boolean} booleanValue A boolean value.
* @property {datastore(v1).Key} keyValue A key value.
* @property {boolean} excludeFromIndexes If the value should be excluded from all indexes including those defined
explicitly.
* @property {string} timestampValue A timestamp value.
When stored in the Datastore, precise only to microseconds;
any additional precision is rounded down.
*/
/**
 * @typedef ReadOptions
 * @memberOf! datastore(v1)
 * @type object
* @property {string} transaction The identifier of the transaction in which to read. A
transaction identifier is returned by a call to
Datastore.BeginTransaction.
* @property {string} readConsistency The non-transactional read consistency to use.
Cannot be set to `STRONG` for global queries.
*/
/**
 * @typedef PropertyOrder
 * @memberOf! datastore(v1)
 * @type object
 * @property {string} direction The direction to order by. Defaults to `ASCENDING`.
 * @property {datastore(v1).PropertyReference} property The property to order by.
 */
/**
 * @typedef CommitRequest
 * @memberOf! datastore(v1)
 * @type object
* @property {string} transaction The identifier of the transaction associated with the commit. A
transaction identifier is returned by a call to
Datastore.BeginTransaction.
* @property {string} mode The type of commit to perform. Defaults to `TRANSACTIONAL`.
* @property {datastore(v1).Mutation[]} mutations The mutations to perform.

When mode is `TRANSACTIONAL`, mutations affecting a single entity are
applied in order. The following sequences of mutations affecting a single
entity are not permitted in a single `Commit` request:

- `insert` followed by `insert`
- `update` followed by `insert`
- `upsert` followed by `insert`
- `delete` followed by `update`

When mode is `NON_TRANSACTIONAL`, no two mutations may affect a single
entity.
*/
/**
 * @typedef Query
 * @memberOf! datastore(v1)
 * @type object
* @property {integer} limit The maximum number of results to return. Applies after all other
constraints. Optional.
Unspecified is interpreted as no limit.
Must be &gt;= 0 if specified.
* @property {datastore(v1).Filter} filter The filter to apply.
* @property {string} endCursor An ending point for the query results. Query cursors are
returned in query result batches and
[can only be used to limit the same query](https://cloud.google.com/datastore/docs/concepts/queries#cursors_limits_and_offsets).
* @property {datastore(v1).PropertyReference[]} distinctOn The properties to make distinct. The query results will contain the first
result for each distinct combination of values for the given properties
(if empty, all results are returned).
* @property {integer} offset The number of results to skip. Applies before limit, but after all other
constraints. Optional. Must be &gt;= 0 if specified.
* @property {datastore(v1).Projection[]} projection The projection to return. Defaults to returning all properties.
* @property {datastore(v1).PropertyOrder[]} order The order to apply to the query results (if empty, order is unspecified).
* @property {string} startCursor A starting point for the query results. Query cursors are
returned in query result batches and
[can only be used to continue the same query](https://cloud.google.com/datastore/docs/concepts/queries#cursors_limits_and_offsets).
* @property {datastore(v1).KindExpression[]} kind The kinds to query (if empty, returns entities of all kinds).
Currently at most 1 kind may be specified.
*/
/**
 * @typedef RollbackRequest
 * @memberOf! datastore(v1)
 * @type object
* @property {string} transaction The transaction identifier, returned by a call to
Datastore.BeginTransaction.
*/
/**
 * @typedef EntityResult
 * @memberOf! datastore(v1)
 * @type object
* @property {string} cursor A cursor that points to the position after the result entity.
Set only when the `EntityResult` is part of a `QueryResultBatch` message.
* @property {datastore(v1).Entity} entity The resulting entity.
* @property {string} version The version of the entity, a strictly positive number that monotonically
increases with changes to the entity.

This field is set for `FULL` entity
results.

For missing entities in `LookupResponse`, this
is the version of the snapshot that was used to look up the entity, and it
is always set except for eventually consistent reads.
*/
/**
 * @typedef GqlQueryParameter
 * @memberOf! datastore(v1)
 * @type object
* @property {datastore(v1).Value} value A value parameter.
* @property {string} cursor A query cursor. Query cursors are returned in query
result batches.
*/
/**
 * @typedef ArrayValue
 * @memberOf! datastore(v1)
 * @type object
* @property {datastore(v1).Value[]} values Values in the array.
The order of this array may not be preserved if it contains a mix of
indexed and unindexed values.
*/
/**
 * @typedef Filter
 * @memberOf! datastore(v1)
 * @type object
 * @property {datastore(v1).PropertyFilter} propertyFilter A filter on a property.
 * @property {datastore(v1).CompositeFilter} compositeFilter A composite filter.
 */
/**
 * @typedef BeginTransactionResponse
 * @memberOf! datastore(v1)
 * @type object
 * @property {string} transaction The transaction identifier (always present).
 */
/**
 * @typedef PartitionId
 * @memberOf! datastore(v1)
 * @type object
 * @property {string} namespaceId If not empty, the ID of the namespace to which the entities belong.
 * @property {string} projectId The ID of the project to which the entities belong.
 */
/**
 * @typedef QueryResultBatch
 * @memberOf! datastore(v1)
 * @type object
* @property {string} snapshotVersion The version number of the snapshot this batch was returned from.
This applies to the range of results from the query&#39;s `start_cursor` (or
the beginning of the query if no cursor was given) to this batch&#39;s
`end_cursor` (not the query&#39;s `end_cursor`).

In a single transaction, subsequent query result batches for the same query
can have a greater snapshot version number. Each batch&#39;s snapshot version
is valid for all preceding batches.
The value will be zero for eventually consistent queries.
* @property {string} endCursor A cursor that points to the position after the last result in the batch.
* @property {string} skippedCursor A cursor that points to the position after the last skipped result.
Will be set when `skipped_results` != 0.
* @property {string} entityResultType The result type for every entity in `entity_results`.
* @property {string} moreResults The state of the query after the current batch.
* @property {datastore(v1).EntityResult[]} entityResults The results for this batch.
* @property {integer} skippedResults The number of results skipped, typically because of an offset.
*/
/**
 * @typedef AllocateIdsRequest
 * @memberOf! datastore(v1)
 * @type object
* @property {datastore(v1).Key[]} keys A list of keys with incomplete key paths for which to allocate IDs.
No key may be reserved/read-only.
*/
/**
 * @typedef KindExpression
 * @memberOf! datastore(v1)
 * @type object
 * @property {string} name The name of the kind.
 */
/**
 * @typedef PropertyFilter
 * @memberOf! datastore(v1)
 * @type object
 * @property {datastore(v1).Value} value The value to compare the property to.
 * @property {string} op The operator to filter by.
 * @property {datastore(v1).PropertyReference} property The property to filter by.
 */
/**
 * @typedef PathElement
 * @memberOf! datastore(v1)
 * @type object
* @property {string} kind The kind of the entity.
A kind matching regex `__.*__` is reserved/read-only.
A kind must not contain more than 1500 bytes when UTF-8 encoded.
Cannot be `&quot;&quot;`.
* @property {string} id The auto-allocated ID of the entity.
Never equal to zero. Values less than zero are discouraged and may not
be supported in the future.
* @property {string} name The name of the entity.
A name matching regex `__.*__` is reserved/read-only.
A name must not be more than 1500 bytes when UTF-8 encoded.
Cannot be `&quot;&quot;`.
*/
/**
 * @typedef RollbackResponse
 * @memberOf! datastore(v1)
 * @type object
 */
/**
 * @typedef PropertyReference
 * @memberOf! datastore(v1)
 * @type object
* @property {string} name The name of the property.
If name includes &quot;.&quot;s, it may be interpreted as a property name path.
*/
/**
 * @typedef Projection
 * @memberOf! datastore(v1)
 * @type object
 * @property {datastore(v1).PropertyReference} property The property to project.
 */
/**
 * @typedef MutationResult
 * @memberOf! datastore(v1)
 * @type object
* @property {boolean} conflictDetected Whether a conflict was detected for this mutation. Always false when a
conflict detection strategy field is not set in the mutation.
* @property {datastore(v1).Key} key The automatically allocated key.
Set only when the mutation allocated a key.
* @property {string} version The version of the entity on the server after processing the mutation. If
the mutation doesn&#39;t change anything on the server, then the version will
be the version of the current entity or, if no entity is present, a version
that is strictly greater than the version of any previous entity and less
than the version of any possible future entity.
*/
/**
 * @typedef AllocateIdsResponse
 * @memberOf! datastore(v1)
 * @type object
* @property {datastore(v1).Key[]} keys The keys specified in the request (in the same order), each with
its key path completed with a newly allocated ID.
*/
/**
 * @typedef LookupResponse
 * @memberOf! datastore(v1)
 * @type object
* @property {datastore(v1).EntityResult[]} found Entities found as `ResultType.FULL` entities. The order of results in this
field is undefined and has no relation to the order of the keys in the
input.
* @property {datastore(v1).EntityResult[]} missing Entities not found as `ResultType.KEY_ONLY` entities. The order of results
in this field is undefined and has no relation to the order of the keys
in the input.
* @property {datastore(v1).Key[]} deferred A list of keys that were not looked up due to resource constraints. The
order of results in this field is undefined and has no relation to the
order of the keys in the input.
*/
/**
 * @typedef BeginTransactionRequest
 * @memberOf! datastore(v1)
 * @type object
 */
/**
 * @typedef Key
 * @memberOf! datastore(v1)
 * @type object
* @property {datastore(v1).PartitionId} partitionId Entities are partitioned into subsets, currently identified by a project
ID and namespace ID.
Queries are scoped to a single partition.
* @property {datastore(v1).PathElement[]} path The entity path.
An entity path consists of one or more elements composed of a kind and a
string or numerical identifier, which identify entities. The first
element identifies a _root entity_, the second element identifies
a _child_ of the root entity, the third element identifies a child of the
second entity, and so forth. The entities identified by all prefixes of
the path are called the element&#39;s _ancestors_.

An entity path is always fully complete: *all* of the entity&#39;s ancestors
are required to be in the path along with the entity identifier itself.
The only exception is that in some documented cases, the identifier in the
last path element (for the entity) itself may be omitted. For example,
the last path element of the key of `Mutation.insert` may have no
identifier.

A path can never be empty, and a path can have at most 100 elements.
*/
/**
 * @typedef RunQueryResponse
 * @memberOf! datastore(v1)
 * @type object
 * @property {datastore(v1).QueryResultBatch} batch A batch of query results (always present).
 * @property {datastore(v1).Query} query The parsed form of the `GqlQuery` from the request, if it was set.
 */
/**
 * @typedef Entity
 * @memberOf! datastore(v1)
 * @type object
* @property {object} properties The entity&#39;s properties.
The map&#39;s keys are property names.
A property name matching regex `__.*__` is reserved.
A reserved property name is forbidden in certain documented contexts.
The name must not contain more than 500 characters.
The name cannot be `&quot;&quot;`.
* @property {datastore(v1).Key} key The entity&#39;s key.

An entity must have a key, unless otherwise documented (for example,
an entity in `Value.entity_value` may have no key).
An entity&#39;s kind is its key path&#39;s last element&#39;s kind,
or null if it has no key.
*/
/**
 * @typedef GqlQuery
 * @memberOf! datastore(v1)
 * @type object
* @property {string} queryString A string of the format described
[here](https://cloud.google.com/datastore/docs/apis/gql/gql_reference).
* @property {object} namedBindings For each non-reserved named binding site in the query string, there must be
a named parameter with that name, but not necessarily the inverse.

Key must match regex `A-Za-z_$*`, must not match regex
`__.*__`, and must not be `&quot;&quot;`.
* @property {boolean} allowLiterals When false, the query string must not contain any literals and instead must
bind all values. For example,
`SELECT * FROM Kind WHERE a = &#39;string literal&#39;` is not allowed, while
`SELECT * FROM Kind WHERE a = @value` is.
* @property {datastore(v1).GqlQueryParameter[]} positionalBindings Numbered binding site @1 references the first numbered parameter,
effectively using 1-based indexing, rather than the usual 0.

For each binding site numbered i in `query_string`, there must be an i-th
numbered parameter. The inverse must also be true.
*/
/**
 * @typedef Mutation
 * @memberOf! datastore(v1)
 * @type object
* @property {datastore(v1).Entity} insert The entity to insert. The entity must not already exist.
The entity key&#39;s final path element may be incomplete.
* @property {datastore(v1).Entity} update The entity to update. The entity must already exist.
Must have a complete key path.
* @property {string} baseVersion The version of the entity that this mutation is being applied to. If this
does not match the current version on the server, the mutation conflicts.
* @property {datastore(v1).Entity} upsert The entity to upsert. The entity may or may not already exist.
The entity key&#39;s final path element may be incomplete.
* @property {datastore(v1).Key} delete The key of the entity to delete. The entity may or may not already exist.
Must have a complete key path and must not be reserved/read-only.
*/
/**
 * @typedef CommitResponse
 * @memberOf! datastore(v1)
 * @type object
* @property {datastore(v1).MutationResult[]} mutationResults The result of performing the mutations.
The i-th mutation result corresponds to the i-th mutation in the request.
* @property {integer} indexUpdates The number of index entries updated during the commit, or zero if none were
updated.
*/
/**
 * @typedef RunQueryRequest
 * @memberOf! datastore(v1)
 * @type object
* @property {datastore(v1).PartitionId} partitionId Entities are partitioned into subsets, identified by a partition ID.
Queries are scoped to a single partition.
This partition ID is normalized with the standard default context
partition ID.
* @property {datastore(v1).GqlQuery} gqlQuery The GQL query to run.
* @property {datastore(v1).ReadOptions} readOptions The options for this query.
* @property {datastore(v1).Query} query The query to run.
*/
/**
 * @typedef LookupRequest
 * @memberOf! datastore(v1)
 * @type object
 * @property {datastore(v1).ReadOptions} readOptions The options for this lookup request.
 * @property {datastore(v1).Key[]} keys Keys of entities to look up.
 */
/**
 * @typedef LatLng
 * @memberOf! datastore(v1)
 * @type object
 * @property {number} latitude The latitude in degrees. It must be in the range [-90.0, +90.0].
 * @property {number} longitude The longitude in degrees. It must be in the range [-180.0, +180.0].
 */
/**
 * @typedef CompositeFilter
 * @memberOf! datastore(v1)
 * @type object
* @property {string} op The operator for combining multiple filters.
* @property {datastore(v1).Filter[]} filters The list of filters to combine.
Must contain at least one filter.
*/
module.exports = Datastore;
