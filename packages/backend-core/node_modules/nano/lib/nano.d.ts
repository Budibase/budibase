/**
 * @file nano.d.ts
 *
 * Type definitions for nano 6.4
 *
 * Project: https://github.com/apache/couchdb-nano
 *
 * Definitions by: Tim Jacobi <https://github.com/timjacobi>
 *                 Kovács Vince <https://github.com/vincekovacs>
 *                 Glynn Bird <https://github.com/glynnbird>
 *                 Kyle Chine <https://github.com/kylechine>
 *                 Jean-Christophe Hoelt <https://github.com/j3k0>
 *
 * Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
 *
 * TypeScript Version: 2.3
 */

/// <reference types="node" />

import { EventEmitter } from "events";

/** nano entry function */
declare function nano(
  config: nano.Configuration | string
): nano.ServerScope;

declare namespace nano {
  /** RequestDefaults.auth options */
  interface RequestDefaultOptionsAuth {
    username: string,
    password: string
  }
  
  /** RequestDefaults options */
  interface RequestDefaultsOptions {
    timeout?: number;
    agent?: any;
    headers?: object;
    auth?: RequestDefaultOptionsAuth;
    jar?: boolean;
  }

  /** Nano configuration */
  interface Configuration {
    /** The URL of the CouchDB service, including username and password if required e.g.
     * http://username:password@hostname:port
     */
    url: string;
    /** For cookie authentication */
    cookie?: string;
    /** HTTP request options
     * @see README: {@link https://www.npmjs.com/package/nano#pool-size-and-open-sockets}
     */
    requestDefaults?: RequestDefaultsOptions;
    /** Logging function 
     * @see README: {@link https://www.npmjs.com/package/nano#logging}
     */
    log?(id: string, args: any): void;
    /** Set to false to prevent parsing of url 
     * @see README: {@link https://www.npmjs.com/package/nano#configuration}
     */
    parseUrl?: boolean;
  }

  type Callback<R> = (error: RequestError | null, response: R, headers?: any) => void;

  /** An error triggered by nano */
  interface RequestError extends Error {
    /** An error code. */
    error?: string; // 'not_found', 'file_exists'
    /** Human readable reason for the error. */
    reason?: string; // 'missing', 'The database could not be created, the file already exists.';
    /** Was the problem at the socket or couch level */
    scope?: 'couch'  | 'socket';
    /** Status code returned by the server */
    statusCode?: number; // 404;
    /** Request sent to Couch */
    request?: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      headers?: { [key: string]: string | number };
      uri?: string; // 'http://couchhost:5984/db/tsp2',
      qs?: any; // { revs_info: true }
    };
    /** Response headers */
    headers?: { [key: string]: string | number };
    /** Error identifier */
    errid?: 'non_200' | 'request'; // string; // 'non_200'
    description?: string;
  }

  /** Server scope */
  interface ServerScope {
    /**
     * An object containing the nano configurations.
     * @see README: {@link https://www.npmjs.com/package/nano#nanoconfig}
     */
    readonly config: ServerConfig;
    db: DatabaseScope;
    /**
     * Returns a database object that allows you to perform operations against that database.
     * @see README: {@link https://www.npmjs.com/package/nano#nanousename}
     */
    use<D>(db: string): DocumentScope<D>;
    /**
     * Returns a database object that allows you to perform operations against that database.
     * @see README: {@link https://www.npmjs.com/package/nano#nanoscopename}
     */
    scope<D>(db: string): DocumentScope<D>;
    /** 
     * Initiates a custom request
     * @see README: {@link https://www.npmjs.com/package/nano#nanorequestopts-callback}
     **/
    request(opts: RequestOptions | string, callback?: Callback<any>): Promise<any>;
    /** 
     * Initiates a custom request
     * @see README: {@link https://www.npmjs.com/package/nano#nanorequestopts-callback}
     **/
    relax(opts: RequestOptions | string, callback?: Callback<any>): Promise<any>;
    /** 
     * Initiates a custom request
     * @see README: {@link https://www.npmjs.com/package/nano#nanorequestopts-callback}
     **/
    dinosaur(opts: RequestOptions | string, callback?: Callback<any>): Promise<any>;
    /** 
     * Initiates new session for specified user credentials by providing Cookie value.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/authn.html#cookie-authentication} */
    auth(username: string, userpass: string, callback?: Callback<DatabaseAuthResponse>): Promise<DatabaseAuthResponse>;
    /** 
     * Returns information about the authenticated user, including a User Context Object, the authentication method and database that were used, and a list of configured authentication handlers on the server.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/authn.html#get--_session} */
    session(callback?: Callback<DatabaseSessionResponse>): Promise<DatabaseSessionResponse>;
    /** 
     * Returns a list of all database events in the CouchDB instance.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/common.html#get--_db_updates} */
    updates(callback?: Callback<DatabaseUpdatesResponse>): Promise<DatabaseUpdatesResponse>;
    /**
     * Returns a list of all database events in the CouchDB instance.
     *  @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/common.html#get--_db_updates} */
    updates(params: UpdatesParams, callback?: Callback<DatabaseUpdatesResponse>): Promise<DatabaseUpdatesResponse>;
    /**
     * Requests one or more Universally Unique Identifiers (UUIDs) from the CouchDB instance.
     * @see Docs: {@link https://docs.couchdb.org/en/stable/api/server/common.html#uuids}
     */
    uuids(num?: number, callback?: Callback<any>): Promise<UUIDObject>;
    /** 
    * Accessing the root of a CouchDB instance returns meta information about the instance.
    * @see Docs: {@link https://docs.couchdb.org/en/stable/api/server/common.html#api-server-root} */
    info(callback?: Callback<InfoResponse>): Promise<InfoResponse>;
  }

  interface UUIDObject {
    uuids: string[];
  }

  /** 
   * Response to CouchDB root API call - cluster information.
   * @see Docs: {@link https://docs.couchdb.org/en/stable/api/server/common.html#api-server-root} */
  interface InfoResponse {
    couchdb: string;
    version: string;
    git_sha: string;
    uuid: string;
    features: string[];
    vendor: { name: string }
  }

  /** 
   * Database creation options
   * @see Docs: {@link https://docs.couchdb.org/en/stable/api/database/common.html#put--db} */
  interface DatabaseCreateParams {
    n?: number;
    partitioned?: boolean;
    q?: number;
  }

  /** Database scope */
  interface DatabaseScope {
    replication: {
        enable(source: string, target: string, opts0: object, callback0?: Callback<DatabaseCreateResponse>): Promise<DatabaseCreateResponse>;
        disable(id:string, rev: string, opts0: object, callback0?: Callback<DatabaseCreateResponse>): Promise<DatabaseCreateResponse>;
        query(id: string, opts0: object, callback0?: Callback<DatabaseGetResponse>): Promise<DatabaseGetResponse>;
    };
    /** 
     * Create database.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/common.html#put--db} */
    create(name: string, params?: DatabaseCreateParams, callback?: Callback<DatabaseCreateResponse>): Promise<DatabaseCreateResponse>;
    /** Get database information.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/common.html#get--db} */
    get(name: string, callback?: Callback<DatabaseGetResponse>): Promise<DatabaseGetResponse>;
    /** Delete database.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/common.html#delete--db} */
    destroy(name: string, callback?: Callback<OkResponse>): Promise<OkResponse>;
    /** List databases. 
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/common.html#get--_all_dbs} */
    list(callback?: Callback<string[]>): Promise<string[]>;
    /** List databases as a stream.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/common.html#get--_all_dbs} */
    listAsStream(): NodeJS.ReadStream;
    /** Use a specific database.
     * @see README: {@link https://www.npmjs.com/package/nano#nanousename} */
    use<D>(db: string): DocumentScope<D>;
    /** Request compaction on a database.
     * @see Docs: {@link https://docs.couchdb.org/en/stable/api/database/compact.html} */
    compact(name: string, callback?: Callback<OkResponse>): Promise<OkResponse>;
    /** Request compaction of a database's view indexes.
     * @see Docs: {@link https://docs.couchdb.org/en/stable/api/database/compact.html} */
    compact(name: string, designname: string, callback?: Callback<OkResponse>): Promise<OkResponse>;
    /** Request a replication operation. 
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/common.html#post--_replicate} */
    replicate<D>(
      source: string | DocumentScope<D>,
      target: string | DocumentScope<D>,
      callback?: Callback<DatabaseReplicateResponse>
    ): Promise<DatabaseReplicateResponse>;
    /** Reqiest a replication 
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/common.html#post--_replicate} */
    replicate<D>(
      source: string | DocumentScope<D>,
      target: string | DocumentScope<D>,
      options: DatabaseReplicateOptions,
      callback?: Callback<DatabaseReplicateResponse>
    ): Promise<DatabaseReplicateResponse>;
    /** Return sorted list of changes to a database.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/changes.html#get--db-_changes} */
    changes(name: string, callback?: Callback<DatabaseChangesResponse>): Promise<DatabaseChangesResponse>;
    /**  Return sorted list of changes to a database with options.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/compact.html#post--db-_compact} */
    changes(name: string, params: DatabaseChangesParams, callback?: Callback<DatabaseChangesResponse>): Promise<DatabaseChangesResponse>;
    /**  Return sorted list of changes to a database as a stream.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/changes.html#get--db-_changes} */
    changesAsStream(name: string): NodeJS.ReadStream;
    /**  Return sorted list of changes to a database with options as a stream.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/compact.html#post--db-_compact} */
    changesAsStream(name: string, params: DatabaseChangesParams): NodeJS.ReadStream;
    /** Return a list of all database events.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/common.html#get--_db_updates} */
    updates(callback?: Callback<DatabaseUpdatesResponse>): Promise<DatabaseUpdatesResponse>;
    /** Return a list of all database event with options
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/common.html#get--_db_updates} */
    updates(params: UpdatesParams, callback?: Callback<DatabaseUpdatesResponse>): Promise<DatabaseUpdatesResponse>;
  }

  /** ChangesReader options */
  interface ChangesReaderOptions {
    /** number of changes per API call */
    batchSize?: number;
    /** whether to get a faster changes feed by supplying 'seq_interval'   */
    fastChanges?: boolean;
    /** where to begin the changes feed: 0, now or a sequence token */
    since?: string | number;
    /** whether to return document bodies too */
    includeDocs?: boolean;
    /** number of milliseconds when the longpoll request will timeout */
    timeout?: number;
    /** whether to require a callback before performing the next request (get/start only) */
    wait?: boolean;
    /** additional query string parameters */
    qs?: object;
    /** a MangoSelector defining the slice of the changes feed to return */
    selector?: MangoSelector;
  }

  /** ChangesReader functions */
  interface ChangesReaderScope {
    /** fetch changes forever */
    start(opts: ChangesReaderOptions): EventEmitter;
    /** fetch changes and stop when an empty batch is received */
    get(opts: ChangesReaderOptions): EventEmitter;
    /** spool the change in one long feed, instead of batches */
    spool(opts: ChangesReaderOptions): EventEmitter;
    /** stop consuming the changes feed */
    stop(): void;
    /** pause consuming the changes feed */
    pause(): void;
    /** resume consuming the changes feed */
    resume(): void;
  }

  /** Documents scope */
  interface DocumentScope<D> {
    /**
     * An object containing the nano configurations.
     * @see README: {@link https://www.npmjs.com/package/nano#nanoconfig} */
    readonly config: ServerConfig;
    /** Get database info
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/common.html#get--db} */
    info(callback?: Callback<DatabaseGetResponse>): Promise<DatabaseGetResponse>;
    /** Request a replication opertation with this datbase as the target.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/common.html#post--_replicate} */
    replicate<D>(
      target: string | DocumentScope<D>,
      callback?: Callback<DatabaseReplicateResponse>
    ): Promise<DatabaseReplicateResponse>;
    /** Request a replication opertation with this datbase as the target with options.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/common.html#post--_replicate} */
    replicate(
      target: string | DocumentScope<D>,
      options: any,
      callback?: Callback<DatabaseReplicateResponse>
    ): Promise<DatabaseReplicateResponse>;
    /** Request compaction on this database.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/compact.html#post--db-_compact} */
    compact(callback?: Callback<OkResponse>): Promise<OkResponse>;
    /** Return sorted list of changes to this database.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/changes.html#get--db-_changes} */
    changes(callback?: Callback<DatabaseChangesResponse>): Promise<DatabaseChangesResponse>;
    /** Return sorted list of changes to this database with options.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/changes.html#get--db-_changes} */
    changes(params: DatabaseChangesParams, callback?: Callback<DatabaseChangesResponse>): Promise<DatabaseChangesResponse>;
    /**  Changes feed follower. 
     * @see README: {@link https://www.npmjs.com/package/nano#reading-changes-feed} */
    changesReader: ChangesReaderScope;
    /** Initiates new session for specified user credentials by providing Cookie value.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/authn.html#cookie-authentication} */
    auth(username: string, userpass: string, callback?: Callback<DatabaseAuthResponse>): Promise<DatabaseAuthResponse>;
    /** Returns information about the authenticated user, including a User Context Object, the authentication method and database that were used, and a list of configured authentication handlers on the server.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/authn.html#get--_session} */
    session(callback?: Callback<DatabaseSessionResponse>): Promise<DatabaseSessionResponse>;
    /** Insert a document into this database.
     * @see POST Docs: {@link http://docs.couchdb.org/en/latest/api/database/common.html#post--db}
     * @see PUT Docs: {@link http://docs.couchdb.org/en/latest/api/document/common.html#put--db-docid} */
    insert(document: ViewDocument<D> | D & MaybeDocument, callback?: Callback<DocumentInsertResponse>): Promise<DocumentInsertResponse>;
    /** 
     * Insert a document into this database with options.
     * @see POST Docs: {@link http://docs.couchdb.org/en/latest/api/database/common.html#post--db}
     * @see PUT Docs: {@link http://docs.couchdb.org/en/latest/api/document/common.html#put--db-docid} */
    insert(
      document: ViewDocument<D> | D & MaybeDocument,
      params: DocumentInsertParams | string | null,
      callback?: Callback<DocumentInsertResponse>
    ): Promise<DocumentInsertResponse>;
    /** Fetch a document from this database.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/document/common.html#get--db-docid} */
    get(docname: string, callback?: Callback<DocumentGetResponse & D>): Promise<DocumentGetResponse & D>;
    /** Fetch a document from this database with options.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/document/common.html#get--db-docid} */
    get(docname: string, params?: DocumentGetParams, callback?: Callback<DocumentGetResponse & D>): Promise<DocumentGetResponse & D>;
    /** Fetch document meta data, useful for fetching a document's current revision.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/document/common.html#head--db-docid} */
    head(docname: string, callback?: Callback<DocumentHeadResponseHeaders>): Promise<DocumentHeadResponseHeaders>;
    /** Delete a document from this database.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/document/common.html#delete--db-docid} */
    destroy(docname: string, rev: string, callback?: Callback<DocumentDestroyResponse>): Promise<DocumentDestroyResponse>;
    /** Bulk insert/update/delete multiple documents in this database.
     * @see Docs: {@link https://docs.couchdb.org/en/stable/api/database/bulk-api.html#db-bulk-docs} */
    bulk(docs: BulkModifyDocsWrapper, callback?: Callback<DocumentBulkResponse[]>): Promise<DocumentBulkResponse[]>;
    /** Bulk insert/update/delete multiple documents in this database, with options.
     * @see Docs: {@link https://docs.couchdb.org/en/stable/api/database/bulk-api.html#db-bulk-docs} */
    bulk(docs: BulkModifyDocsWrapper, params: any, callback?: Callback<DocumentInsertResponse[]>): Promise<DocumentInsertResponse[]>;
    /** List documents from this database.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/bulk-api.html#get--db-_all_docs} */
    list(callback?: Callback<DocumentListResponse<D>>): Promise<DocumentListResponse<D>>;
    /** List documents from this database with options.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/bulk-api.html#get--db-_all_docs} */
    list(params: DocumentListParams, callback?: Callback<DocumentListResponse<D>>): Promise<DocumentListResponse<D>>;
    /** List document from this database as a stream.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/bulk-api.html#get--db-_all_docs} */
    listAsStream(): NodeJS.ReadStream;
    /** List document from this database as a stream with options.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/bulk-api.html#get--db-_all_docs} */
    listAsStream(params: DocumentListParams): NodeJS.ReadStream;
    /** Fetch a list of documents by _id.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/bulk-api.html#post--db-_all_docs} */
    fetch(docnames: BulkFetchDocsWrapper, callback?: Callback<DocumentFetchResponse<D>>): Promise<DocumentFetchResponse<D>>;
    /** Fetch a list of documents by _id with options.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/bulk-api.html#post--db-_all_docs} */
    fetch(
      docnames: BulkFetchDocsWrapper,
      params: DocumentFetchParams,
      callback?: Callback<DocumentFetchResponse<D>>
    ): Promise<DocumentFetchResponse<D>>;
    /** Fetch revisions of a list of document _ids.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/bulk-api.html#post--db-_all_docs} */
    fetchRevs(docnames: BulkFetchDocsWrapper, callback?: Callback<DocumentFetchRevsResponse<D>>): Promise<DocumentFetchRevsResponse<D>>;
    /** Fetch revisions of a list of document _ids with options.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/bulk-api.html#post--db-_all_docs} */
    fetchRevs(
      docnames: BulkFetchDocsWrapper,
      params: DocumentFetchParams,
      callback?: Callback<DocumentFetchRevsResponse<D>>
    ): Promise<DocumentFetchRevsResponse<D>>;
    /** Create a Mango index.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/find.html#db-index} */
    createIndex(indexDef: CreateIndexRequest,
                callback?:  Callback<CreateIndexResponse>
    ): Promise<CreateIndexResponse>;
    /** Multipart HTTP functions */
    multipart: Multipart<D>;
    /** Attachment functions */
    attachment: Attachment;
    /** Apply a show function to a document.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/ddoc/render.html#get--db-_design-ddoc-_show-func} */
    show(
      designname: string,
      showname: string,
      doc_id: string,
      callback?: Callback<any>
    ): Promise<any>;
    /** Apply a show function to a document.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/ddoc/render.html#get--db-_design-ddoc-_show-func} */
    show(
      designname: string,
      showname: string,
      doc_id: string,
      params: any,
      callback?: Callback<any>
    ): Promise<any>;
    /** Executes an update function on the server side for the supplied document id.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/ddoc/render.html#put--db-_design-ddoc-_update-func-docid} */
    atomic<R>(
      designname: string,
      updatename: string,
      docname: string,
      callback?: Callback<R>
    ): Promise<R>;
    /** Executes an update function on the server side for the supplied document id with body.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/ddoc/render.html#put--db-_design-ddoc-_update-func-docid} */
    atomic<R>(
      designname: string,
      updatename: string,
      docname: string,
      body: any,
      callback?: Callback<R>
    ): Promise<R>;
    /** Executes an update function on the server side for the supplied document id.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/ddoc/render.html#put--db-_design-ddoc-_update-func-docid} */
    updateWithHandler(
      designname: string,
      updatename: string,
      docname: string,
      callback?: Callback<OkResponse>
    ): Promise<OkResponse>;
    /** Executes an update function on the server side for the supplied document id with body.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/ddoc/render.html#put--db-_design-ddoc-_update-func-docid} */
    updateWithHandler(
      designname: string,
      updatename: string,
      docname: string,
      body: any,
      callback?: Callback<OkResponse>
    ): Promise<OkResponse>;
    /** Executes a search request against the named index.
     * @see Docs: {@link https://docs.couchdb.org/en/latest/api/ddoc/search.html#db-design-design-doc-search-index-name} */
    search<V>(
      designname: string,
      searchname: string,
      params: DocumentSearchParams,
      callback?: Callback<DocumentSearchResponse<V>>
    ): Promise<DocumentSearchResponse<V>>;
    /** Executes a search request against the named index as a stream.
     * @see Docs: {@link https://docs.couchdb.org/en/latest/api/ddoc/search.html#db-design-design-doc-search-index-name} */
    searchAsStream<V>(
      designname: string,
      searchname: string,
      params: DocumentSearchParams
    ): NodeJS.ReadStream;
    /** Low-level wrapper that executes a view from a Design Document.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/ddoc/views.html#get--db-_design-ddoc-_view-view} */
    baseView<V>(
      designname: string,
      viewname: string,
      meta: any,
      params?: any,
      callback?: Callback<any>
    ): Promise<any>;
    /** Executes a view from a Design Document.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/ddoc/views.html#get--db-_design-ddoc-_view-view} */
    view<V>(
      designname: string,
      viewname: string,
      callback?: Callback<DocumentViewResponse<V,D>>
    ): Promise<DocumentViewResponse<V,D>>;
    /**  Executes a view from a Design Document, with options.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/ddoc/views.html#get--db-_design-ddoc-_view-view} */
    view<V>(
      designname: string,
      viewname: string,
      params: DocumentViewParams,
      callback?: Callback<DocumentViewResponse<V,D>>
    ): Promise<DocumentViewResponse<V,D>>;
    /** Executes a view from a Design Document as a stream
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/ddoc/views.html#get--db-_design-ddoc-_view-view} */
    viewAsStream<V>(
      designname: string,
      viewname: string
    ): NodeJS.ReadStream;
    /** Executes a view from a Design Document, with options as a stream
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/ddoc/views.html#get--db-_design-ddoc-_view-view} */
    viewAsStream<V>(
      designname: string,
      viewname: string,
      params: DocumentViewParams
    ): NodeJS.ReadStream;
    /** Applies a list function to a view.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/ddoc/render.html#db-design-design-doc-list-list-name-view-name} */
    viewWithList(
      designname: string,
      viewname: string,
      listname: string,
      callback?: Callback<any>
    ): Promise<any>;
    /** Applies a list function to a view with options.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/ddoc/render.html#db-design-design-doc-list-list-name-view-name} */
    viewWithList(
      designname: string,
      viewname: string,
      listname: string,
      params: DocumentViewParams,
      callback?: Callback<any>
    ): Promise<any>;
    /** Applies a list function to a view as a stream.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/ddoc/render.html#db-design-design-doc-list-list-name-view-name} */
    viewWithListAsStream(
        designname: string,
        viewname: string,
        listname: string,
        callback?: Callback<any>
    ): NodeJS.ReadStream;
    /** Applies a list function to a view with options as a stream.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/ddoc/render.html#db-design-design-doc-list-list-name-view-name} */
    viewWithListAsStream(
        designname: string,
        viewname: string,
        listname: string,
        params: DocumentViewParams,
        callback?: Callback<any>
    ): NodeJS.ReadStream;
    /** Run Mango query.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/find.html#db-find} */
    find(query: MangoQuery, callback?: Callback<MangoResponse<D>>): Promise <MangoResponse<D>>;
    /** Server scope */
    server: ServerScope;
    /** Fetch information about a single partition in this database.
     * @see Docs: {@link https://docs.couchdb.org/en/latest/api/partitioned-dbs.html#db-partition-partition} */
    partitionInfo(partitionKey: string, callback?: Callback<PartitionInfoResponse>): Promise <PartitionInfoResponse>;
    /** List documents in a single partition in this database.
     * @see Docs: {@link https://docs.couchdb.org/en/latest/api/partitioned-dbs.html#db-partition-partition-all-docs} */
    partitionedList(partitionKey: string, params?: DocumentFetchParams, callback?: Callback<DocumentListResponse<D>>): Promise<DocumentListResponse<D>>;
    /** List documents in a single partition in this database as a stream.
     * @see Docs: {@link https://docs.couchdb.org/en/latest/api/partitioned-dbs.html#db-partition-partition-all-docs} */
    partitionedListAsStream(partitionKey: string, params?: DocumentFetchParams): NodeJS.ReadStream;
    /** Run Mango query a single partition in this database.
     * @see Docs: {@link https://docs.couchdb.org/en/latest/api/partitioned-dbs.html#db-partition-partition-id-find} */
    partitionedFind(partitionKey: string, query: MangoQuery, callback?: Callback<MangoResponse<D>>): Promise <MangoResponse<D>>;
    /** Run Mango query a single partition in this database, as a stream.
     * @see Docs: {@link https://docs.couchdb.org/en/latest/api/partitioned-dbs.html#db-partition-partition-id-find} */
    partitionedFindAsStream(partitionKey: string, query: MangoQuery): NodeJS.ReadStream;
    /** Run a full-text search in a single partition in this database. */
    partitionedSearch<V>(
      partitionKey: string,
      designname: string,
      searchname: string,
      params: DocumentSearchParams,
      callback?: Callback<DocumentSearchResponse<V>>
    ): Promise<DocumentSearchResponse<V>>;
    /** Run a full-text search in a single partition in this database, as a stream. */
    partitionedSearchAsStream(
      partitionKey: string,
      designname: string,
      searchname: string,
      params: DocumentSearchParams
    ): NodeJS.ReadStream;
    /** Executes the specified view function in a single partition from the specified design document.
     * @see Docs: {@link https://docs.couchdb.org/en/latest/api/partitioned-dbs.html#db-partition-partition-design-design-doc-view-view-name} */
    partitionedView<V>(
      partitionKey: string,
      designname: string,
      viewname: string,
      params: DocumentViewParams,
      callback?: Callback<DocumentViewResponse<V,D>>
    ): Promise<DocumentViewResponse<V,D>>;
    /** Executes the specified view function in a single partition from the specified design document, as a stream
     * @see Docs: {@link https://docs.couchdb.org/en/latest/api/partitioned-dbs.html#db-partition-partition-design-design-doc-view-view-name} */
    partitionedViewAsStream<V>(
      partitionKey: string,
      designname: string,
      viewname: string,
      params: DocumentViewParams
    ): NodeJS.ReadStream;
  }

  /** attachment data */
  interface AttachmentData {
    name: string;
    data: any;
    content_type: any;
  }

  /** Multi-part HTTP functions */
  interface Multipart<D> {
    /** Create doc with multiple attachments using mutlipart HTTP request.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/document/common.html#creating-multiple-attachments} */
    insert(doc: D, attachments: AttachmentData[], callback?: Callback<DocumentInsertResponse>): Promise<DocumentInsertResponse>;
    /** Create doc with multiple attachments using mutlipart HTTP request with options.
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/document/common.html#creating-multiple-attachments} */
    insert(doc: D, attachments: AttachmentData[], params: any, callback?: Callback<DocumentInsertResponse>): Promise<DocumentInsertResponse>;
    /** Fetch document and its attachments as a multipart HTTP request. 
     * @see Docs: {@link https://docs.couchdb.org/en/latest/api/document/common.html#efficient-multiple-attachments-retrieving} */
    get(docname: string, callback?: Callback<any>): Promise<any>;
    /** Fetch document and its attachments as a multipart HTTP request with options.
     * @see Docs: {@link https://docs.couchdb.org/en/latest/api/document/common.html#efficient-multiple-attachments-retrieving} */
     get(docname: string, params: any, callback?: Callback<any>): Promise<any>;
  }

  /** Attachment functions */
  interface Attachment {
    /** Insert an attachment.
     * @see Docs: {@link https://docs.couchdb.org/en/latest/api/document/attachments.html#put--db-docid-attname} */
    insert(
      docname: string,
      attname: string,
      att: any,
      contenttype: string,
      callback?: Callback<DocumentInsertResponse>
    ): Promise<DocumentInsertResponse>;
    /** Insert an attachment with options.
     * @see Docs: {@link https://docs.couchdb.org/en/latest/api/document/attachments.html#put--db-docid-attname} */
    insert(
      docname: string,
      attname: string,
      att: any,
      contenttype: string,
      params: any,
      callback?: Callback<DocumentInsertResponse>
    ): Promise<DocumentInsertResponse>;
    /** Get an attachment.
     * @see Docs: {@link https://docs.couchdb.org/en/latest/api/document/attachments.html#get--db-docid-attname} */
    get(docname: string, attname: string, callback?: Callback<Buffer>): Promise<Buffer>;
    /** Get an attachment as a stream.
     * @see Docs: {@link https://docs.couchdb.org/en/latest/api/document/attachments.html#get--db-docid-attname} */
    getAsStream(docname: string, attname: string): NodeJS.ReadStream;
    /** Get an attachment with options.
     * @see Docs: {@link https://docs.couchdb.org/en/latest/api/document/attachments.html#get--db-docid-attname} */
    get(
      docname: string,
      attname: string,
      params: any,
      callback?: Callback<Buffer>
    ): Promise<Buffer>;
    /** Delete an attachment.
     * @see Docs: {@link https://docs.couchdb.org/en/latest/api/document/attachments.html#delete--db-docid-attname} */
    destroy(docname: string, attname: string, callback?: Callback<any>): Promise<any>;
    /** Delete an attachment with options.
     * @see Docs: {@link https://docs.couchdb.org/en/latest/api/document/attachments.html#delete--db-docid-attname} */
    destroy(
      docname: string,
      attname: string,
      params: any,
      callback?: Callback<any>
    ): Promise<any>;
  }

  /** Server configuration */
  interface ServerConfig {
    url: string;
    db: string;
  }

  /** Custom request options 
   * @see README: {@link https://www.npmjs.com/package/nano#nanorequestopts-callback}*/
  interface RequestOptions {
    db?: string;
    method?: string;
    path?: string;
    doc?: string;
    att?: string;
    qs?: any;
    content_type?: string;
    headers?: any;
    body?: any;
    encoding?: string;
    multipart?: any[];
  }

  /** Global changes feed paramters.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/common.html#get--_db_updates} */
  interface UpdatesParams {
    feed: "longpoll" | "continuous" | "eventsource";
    timeout: number;
    heartbeat: boolean;
    since: string;
  }

  interface BulkModifyDocsWrapper {
    docs: any[];
  }

  interface BulkFetchDocsWrapper {
    keys: string[];
  }

  // -------------------------------------
  // Document
  // -------------------------------------

  interface MaybeIdentifiedDocument {
    _id?: string;
  }

  interface IdentifiedDocument {
    _id: string;
  }

  interface MaybeRevisionedDocument {
    _rev?: string;
  }

  interface RevisionedDocument {
    _rev: string;
  }

  interface MaybeDocument extends MaybeIdentifiedDocument, MaybeRevisionedDocument {
  }

  interface Document extends IdentifiedDocument, RevisionedDocument {
  }

  // -------------------------------------
  // View
  // -------------------------------------

  type DocumentInfer<D> = (doc: D & Document) => void
  interface View<D> {
    map?: string | DocumentInfer<D>;
    reduce?: string | DocumentInfer<D>

  }

  interface ViewDocument<D> extends IdentifiedDocument {
    views: {
      [name: string]: View<D>
    };
  }

  // -------------------------------------
  // Database scope request and response
  // -------------------------------------

  /** Database creation options
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/common.html#put--db} */
  interface DatabaseCreateResponse {
    /** Operation status. Available in case of success */
    ok?: boolean;

    /** Error type. Available if response code is 4xx */
    error?: string;

    /** Error description. Available if response code is 4xx */
    reason?: string;
  }

  /** Database information response.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/common.html#get--db} */
  interface DatabaseGetResponse {
    /** Set to true if the database compaction routine is operating on this database. */
    compact_running: boolean;

    /** The name of the database. */
    db_name: string;

    /** The version of the physical format used for the data when it is stored on disk. */
    disk_format_version: number;

    /** The number of bytes of live data inside the database file. */
    data_size: number;

    /** The length of the database file on disk. Views indexes are not included in the calculation. */
    disk_size: number;

    /** A count of the documents in the specified database. */
    doc_count: number;

    /** Number of deleted documents */
    doc_del_count: number;

    /** Timestamp of when the database was opened, expressed in microseconds since the epoch. */
    instance_start_time: string;

    /** The number of purge operations on the database. */
    purge_seq: number;

    sizes: {
      /** The size of live data inside the database, in bytes. */
      active: number;

      /** The uncompressed size of database contents in bytes. */
      external: number;

      /** The size of the database file on disk in bytes. Views indexes */
      file: number;
    };

    /** The current number of updates to the database. */
    update_seq: number;
  }

  /** OK response
   * @see Delete docs: {@link http://docs.couchdb.org/en/latest/api/database/common.html#delete--db}
   * @see Compaction docs: {@link http://docs.couchdb.org/en/latest/api/database/compact.html#post--db-_compact} */
  interface OkResponse {
    /** Operation status */
    ok: boolean;
  }

  /** Database _replicate options.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/common.html#post--_replicate} */
  interface DatabaseReplicateOptions {
    /** Cancels the replication */
    cancel?: boolean;

    /** Configure the replication to be continuous */
    continuous?: boolean;

    /** Creates the target database. Required administrator’s privileges on target server. */
    create_target?: boolean;

    /** Array of document IDs to be synchronized */
    doc_ids?: string[];

    /** The name of a filter function. */
    filter?: string;

    /** Address of a proxy server through which replication should occur (protocol can be “http” or “socks5”) */
    proxy?: string;

    /** Source database name or URL */
    source?: string;

    /** Target database name or URL */
    target?: string;
  }

  /** Database replication history.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/common.html#post--_replicate} */
  interface DatabaseReplicationHistoryItem {
    /** Number of document write failures */
    doc_write_failures: number;

    /** Number of documents read */
    docs_read: number;

    /** Number of documents written to target */
    docs_written: number;

    /** Last sequence number in changes stream */
    end_last_seq: number;

    /** Date/Time replication operation completed in RFC 2822 format */
    end_time: string;

    /** Number of missing documents checked */
    missing_checked: number;

    /** Number of missing documents found */
    missing_found: number;

    /** Last recorded sequence number */
    recorded_seq: number;

    /** Session ID for this replication operation */
    session_id: string;

    /** First sequence number in changes stream */
    start_last_seq: number;

    /** Date/Time replication operation started in RFC 2822 format */
    start_time: string;
  }

  /** Database _replicate response.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/common.html#post--_replicate} */
  interface DatabaseReplicateResponse {
    /** Replication history */
    history: DatabaseReplicationHistoryItem[];

    /** Replication status */
    ok: boolean;

    /** Replication protocol version */
    replication_id_version: number;

    /** Unique session ID */
    session_id: string;

    /** Last sequence number read from source database */
    source_last_seq: number;
  }

  /** Database _changes parameters.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/changes.html#get--db-_changes} */
  interface DatabaseChangesParams {
    /** List of document IDs to filter the changes feed as valid JSON array.
     *
     * Used with _doc_ids filter. Since length of URL is limited, it is better to use POST /{db}/_changes instead. */
    doc_ids?: string[];

    /** Includes conflicts information in response.
     *
     * Ignored if `include_docs` isn’t true.
     *
     * @default false */
    conflicts?: boolean;

    /** Return the change results in descending sequence order (most recent change first).
     *
     * @default false */
    descending?: boolean;

    /** Polling mode.
     *
     * - `"normal"` Specifies Normal Polling Mode. All past changes are returned immediately. Default.
     * - `"longpoll"` Specifies Long Polling Mode. Waits until at least one change has occurred, sends the change, then
     *   closes the connection. Most commonly used in conjunction with since=now, to wait for the next change.
     * - `"continuous"` Sets Continuous Mode. Sends a line of JSON per event. Keeps the socket open until timeout.
     * - `"eventsource"` Sets Event Source Mode. Works the same as Continuous Mode, but sends the events in EventSource
     *   format.
     *
     * @detault "normal" */
    feed?: "normal" | "longpoll" | "continuous" | "eventsource";

    /** Reference to a filter function from a design document.
     * 
     * The filter function will filter whole stream emitting only filtered events. See the section Change Notifications
     * in the book CouchDB The Definitive Guide for more information. */
    filter?: string;

    /** Period in milliseconds after which an empty line is sent in the results.
     * 
     * Only applicable for longpoll, continuous, and eventsource feeds. Overrides any timeout to keep the feed alive
     * indefinitely. May be true to use default value.
     *
     * @default 60000 */
    heartbeat?: number;

    /** Include the associated document with each result.
     *
     * If there are conflicts, only the winning revision is returned.
     *
     * @default false */
    include_docs?: boolean;

    /** Include the Base64-encoded content of attachments in the documents that are included if include_docs is true.
     *
     * Ignored if include_docs isn’t true.
     *
     * @default false */
    attachments?: boolean;

    /** Include encoding information in attachment stubs.
     * 
     * Only used if include_docs is true and the particular attachment is compressed. Ignored if include_docs isn’t
     * true.
     *
     * @default false */
    att_encoding_info?: boolean;

    /** Limit number of result rows to the specified value.
     *
     * Note that using 0 here has the same effect as 1. */
    limit?: number;

    /** Start the results from the change immediately after the given update sequence.
     *
     * Can be valid update sequence or now value.
     *
     * @default 0 */
    since?: string | number;

    /** Specifies how many revisions are returned in the changes array.
     * 
     * The default, `"main_only"`, will only return the current “winning” revision; `"all_docs"` will return all leaf
     * revisions (including conflicts and deleted former conflicts).
     *
     * @default "main_only" */
    style?: string;

    /** Maximum period in milliseconds to wait for a change before the response is sent, even if there are no results.
     *
     * Only applicable for longpoll or continuous feeds. Default value is specified by httpd/changes_timeout
     * configuration option. Note that 60000 value is also the default maximum timeout to prevent undetected dead
     * connections. */
    timeout?: number;

    /** Allows to use view functions as filters.
     *
     * Documents counted as “passed” for view filter in case if map function emits at least one record for them.
     *
     * @see Docs: {@link https://docs.couchdb.org/en/stable/api/database/changes.html#changes-filter-view|_view} for more info. */
    view?: string;
  }

  /** Database change item.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/changes.html#get--db-_changes} */
  interface DatabaseChangesResultItem {
    /** List of document’s leaves with single field rev. */
    changes: Array<{ rev: string }>;

    /** Document ID. */
    id: string;

    /** Update sequence. */
    seq: any;

    /** true if the document is deleted. */
    deleted: boolean;
  }

  /** Database _changes response.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/changes.html#get--db-_changes} */
  interface DatabaseChangesResponse {
    /** Last change update sequence */
    last_seq: any;

    /** Count of remaining items in the feed */
    pending: number;

    /** Changes made to a database */
    results: DatabaseChangesResultItem[];
  }

  /** Database authentication response.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/authn.html#cookie-authentication} */
  interface DatabaseAuthResponse {
    /** Operation status */
    ok: boolean;

    /** Username */
    name: string;

    /** List of user roles */
    roles: string[];
  }

  /** Database _session response.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/authn.html#get--_session} */
  interface DatabaseSessionResponse {
    /** Operation status */
    ok: boolean;

    /** User context for the current user */
    userCtx: any;

    /** Server authentication configuration */
    info: any;
  }

  /** Database global changes result item.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/common.html#get--_db_updates} */
  interface DatabaseUpdatesResultItem {
    /** Database name. */
    db_name: string;

    /** A database event is one of created, updated, deleted. */
    type: string;

    /** Update sequence of the event. */
    seq: any;
  }

  /** Global changes response.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/server/common.html#get--_db_updates} */
  interface DatabaseUpdatesResponse {
    /** An array of database events.
     *
     * For longpoll and continuous modes, the entire response is the contents of the results array. */
    results: DatabaseUpdatesResultItem[];

    /** The last sequence ID reported. */
    last_seq: string;
  }

  // -------------------------------------
  // Document scope request and response
  // -------------------------------------

  /** Bulk API per-document response. */
  interface DocumentResponseRowMeta {
    id: string;
    key: string;
    value: {
      rev: string;
    };
    error?: string;
  }

  /** Bulk API per-document response with document body. */
  interface DocumentResponseRow<D> extends DocumentResponseRowMeta {
    doc?: D & Document;
  }

  /** Bulk API response.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/bulk-api.html#post--db-_bulk_docs} */
  interface DocumentBulkResponse {
    /** Document ID. Available in all cases */
    id: string;

    /** New document revision token. Available if document has saved without errors. */
    rev?: string;

    /** Error type. Available if response code is 4xx */
    error?: string;

    /** Error reason. Available if response code is 4xx */
    reason?: string;
  }

  /** Document insert parameters.
   * @see POST docs: {@link http://docs.couchdb.org/en/latest/api/database/common.html#post--db}
   * @see PUT docs: {@link http://docs.couchdb.org/en/latest/api/document/common.html#put--db-docid} */
  interface DocumentInsertParams {
    /** Document ID */
    docName?: string;
    
    /** Document’s revision if updating an existing document. Alternative to If-Match header or document key. */
    rev?: string;

    /** Stores document in batch mode. */
    batch?: "ok";

    /** Prevents insertion of a conflicting document.
     * 
     * If false, a well-formed `_rev` must be included in the document. `new_edits=false` is used by the replicator to
     * insert documents into the target database even if that leads to the creation of conflicts.
     *
     * @default true */
    new_edits?: boolean;
  }

  /** Document insert response: 
   * @see POST docs: {@link http://docs.couchdb.org/en/latest/api/database/common.html#post--db}
   * @see PUT docs: {@link http://docs.couchdb.org/en/latest/api/document/common.html#put--db-docid} */
  interface DocumentInsertResponse {
    /** Document ID */
    id: string;

    /** Operation status */
    ok: boolean;

    /** Revision MVCC token */
    rev: string;
  }

  /** Document delete response.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/document/common.html#delete--db-docid} */
  interface DocumentDestroyResponse {
    /** Document ID */
    id: string;

    /** Operation status */
    ok: boolean;

    /** Revision MVCC token */
    rev: string;
  }

  /** Document get parameters.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/document/common.html#get--db-docid} */
  interface DocumentGetParams {
    /** Includes attachments bodies in response.
     *
     * @default false */
    attachments?: boolean;

    /** Includes encoding information in attachment stubs if the particular attachment is compressed.
     *
     * @default false */
    att_encoding_info?: boolean;

    /** Includes attachments only since specified revisions.
     *
     * Doesn’t includes attachments for specified revisions. */
    atts_since?: any[];

    /** Includes information about conflicts in document.
     *
     * @default false */
    conflicts?: boolean;

    /** Includes information about deleted conflicted revisions.
     *
     * @default false */
    deleted_conflicts?: boolean;

    /** Forces retrieving latest “leaf” revision, no matter what rev was requested.
     *
     * @default false */
    latest?: boolean;

    /** Includes last update sequence for the document.
     *
     * @default false */
    local_seq?: boolean;

    /** Acts same as specifying all conflicts, deleted_conflicts and revs_info query parameters.
     *
     * @default false */
    meta?: boolean;

    /** Retrieves documents of specified leaf revisions.
     *
     * Additionally, it accepts value as all to return all leaf revisions. */
    open_revs?: any[];

    /** Retrieves document of specified revision. */
    rev?: string;

    /** Includes list of all known document revisions. */
    revs?: boolean;

    /** Includes detailed information for all known document revisions.
     *
     * @default false */
    revs_info?: boolean;
  }

  /** Document get response: 
   * @see docs: {@link http://docs.couchdb.org/en/latest/api/document/common.html#get--db-docid} */
  interface DocumentGetResponse {
    /** Document ID. */
    _id: string;

    /** Revision MVCC token. */
    _rev: string;

    /** Deletion flag. Available if document was removed. */
    _deleted?: boolean;

    /** Attachment’s stubs. Available if document has any attachments. */
    _attachments?: any;

    /** List of conflicted revisions. Available if requested with conflicts=true query parameter. */
    _conflicts?: any[];

    /** List of deleted conflicted revisions. Available if requested with deleted_conflicts=true query parameter. */
    _deleted_conflicts?: any[];

    /** Document’s update sequence in current database. Available if requested with local_seq=true query parameter. */
    _local_seq?: string;

    /** List of objects with information about local revisions and their status.
     *
     * Available if requested with open_revs query parameter. */
    _revs_info?: any[];

    /** List of local revision tokens without.
     *
     * Available if requested with revs=true query parameter. */
    _revisions?: any;
  }

  /** Document head response headers:
   * @see docs: {@link https://docs.couchdb.org/en/latest/api/document/common.html#head--db-docid} */
  interface DocumentHeadResponseHeaders {
    /** Double quoted document’s revision token. */
    etag: string;
  }

  /** _all_docs parameters
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/bulk-api.html#get--db-_all_docs} */
  interface DocumentListParams {
    /** Includes conflicts information in response.
     *
     * Ignored if include_docs isn’t true.
     *
     * @default false */
    conflicts?: boolean;

    /** Return the documents in descending by key order.
     *
     * @default false */
    descending?: boolean;

    /** Stop returning records when the specified key is reached. */
    endkey?: string;

    /** Stop returning records when the specified key is reached.
     *
     * end_key is an alias for endkey */
    end_key?: string;

    /** Stop returning records when the specified document ID is reached. */
    end_key_doc_id?: string;

    /** Include the full content of the documents in the return.
     *
     * @default false */
    include_docs?: boolean;

    /** Specifies whether the specified end key should be included in the result.
     *
     * @default true */
    inclusive_end?: boolean;

    /** Return only documents that match the specified key. */
    key?: string;

    /** Return only documents that match the specified keys. */
    keys?: string | string[];

    /** Limit the number of the returned documents to the specified number. */
    limit?: number;

    /** Skip this number of records before starting to return the results.
     *
     * @default 0 */
    skip?: number;

    /** Allow the results from a stale view to be used.
     *
     * Using a stale view wont trigger a rebuild of all views within the encompassing design doc.
     *
     * Supported values: "ok" and "update_after". */
    stale?: string;

    /** Return records starting with the specified key. */
    startkey?: string;

    /** Return records starting with the specified key.
     *
     * start_key is an alias for startkey */
    start_key?: string;

    /** Return records starting with the specified document ID. */
    start_key_doc_id?: string;

    /** Response includes an update_seq value indicating which sequence id of the underlying database the view reflects.
     *
     * @default false */
    update_seq?: boolean;
  }

  /** _all_docs response.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/bulk-api.html#get--db-_all_docs} */
  interface DocumentListResponse<D> {
    /** Offset where the document list started. */
    offset: number;

    /** Array of view row objects.
     *
     * By default the information returned contains only the document ID and revision. */
    rows: Array<DocumentResponseRow<D>>;

    /** Number of documents in the database/view.
     *
     * Note that this is not the number of rows returned in the actual query.  */
    total_rows: number;

    /** Current update sequence for the database. */
    update_seq?: number;
  }

  /** Fetch with POST _all_docs parameters.
   * @see Docs: {@link https://docs.couchdb.org/en/latest/api/database/bulk-api.html#post--db-_all_docs} */
  interface DocumentFetchParams {
    conflicts?: boolean;
    descending?: boolean;
    end_key?: string;
    end_key_doc_id?: string;
    include_docs?: boolean;
    inclusive_end?: boolean;
    key?: string;
    keys?: string | string[]; 
    limit?: number;
    skip?: number;
    stale?: string;
    start_key?: string;
    start_key_doc_id?: string;
    update_seq?: boolean;
  }

  /** Document fetch error */
  interface DocumentLookupFailure {
    key: string;
    error: string;
  }

  /** Fetch with POST _all_docs response
   * @see Docs: {@link https://docs.couchdb.org/en/latest/api/database/bulk-api.html#post--db-_all_docs} */
  interface DocumentFetchResponse<D> {
    offset: number;
    rows: Array<DocumentResponseRow<D> | DocumentLookupFailure>;
    total_rows: number;
    update_seq?: number;
  }

  /** Fetch revisions response
   * @see Docs: {@link https://docs.couchdb.org/en/latest/api/database/bulk-api.html#post--db-_all_docs} */
  interface DocumentFetchRevsResponse<D> {
    offset: number;
    rows: Array<DocumentResponseRow<D> | DocumentLookupFailure>;
    total_rows: number;
    update_seq?: number;
  }

  /** Search response
   * @see Docs: {@link https://docs.couchdb.org/en/latest/ddocs/search.html#queries} */
  interface DocumentSearchResponse<V> {

    /**  Array of search results */
    rows: Array<{
      id: string;
      order: number[];
      fields: object;
      key: string;
      doc?: V;
    }>;

    /** Number of documents in the search resykts */
    total_rows: number;

    /** token which if supplied to a subsequent search will return the next page of results. */
    bookmark: string;

    /** facet counts */
    counts?: object;

    /** facet range results */
    ranges?: object;

    highlights?: object;

  }


  /** Partitioned database info response.
   * @see Docs: {@link https://docs.couchdb.org/en/latest/partitioned-dbs/index.html} */
  interface PartitionInfoResponse {
    /** Database name */
    db_name:  string;

    /** Partition sizes */
    sizes: {
      active: number;
      external: number;
    }

    /** Partition name */
    partition: string;

    /** Document count */
    doc_count: number;

    /** Deleted document count */
    doc_del_count: number;
  }

  /** Document search parameters: 
   * @see Docs: {@link https://docs.couchdb.org/en/latest/ddocs/search.html#queries} */
  interface DocumentSearchParams {
    /** A bookmark that was received from a previous search. Used for pagination. */
    bookmark?: string;

    /** An array of field names for which facet counts are requested. */
    counts?: string[];

    /** Filters the result set using key value pairs supplied to the drilldown parameter. */
    drilldown?: string[];

    /** The name of a string field to group results by. */
    group_field?: string;

    /** The maximum group count when used in conjunction with group_field. */
    group_limit?: number;

    /** Defines the order of the groups in a search when used with group_field. */
    group_sort?: string | string[];

    /** Which fields are to be highlighted. */
    highlight_fields?: string[];

    /** String used before a highlighted word.
     *
     * @default <em> */
    highlight_pre_tag?: string;

    /** String used after a highlighted word.
     *
     * @default </em> */
    highlight_post_tag?: string;

    /** The number of gradments that are returned in highlights.
     *
     * @default 1 */
    highlight_number?: number;

    /** The number of characters in each fragment for highlight.
     *
     * @default 100 */
    highlight_size?: number;

    /** Include the full document bodies in the response.
     *
     * @default false */
    include_docs?: boolean;

    /** An array of fields to include in the search results */
    include_fields?: string[];

    /** The maximum number of returned documents.
     *
     * Positive integer up to 200. */
    limit?: number;

    /** Alias of 'query'.
     *
     * One of q or query must be present. */
    q?: string;

    /** The Lucene query to perform.
     *
     * One of q or query must be present. */
    query?: string;

    /** Defines ranges for faceted numeric search fields. */
    ranges?: object;

    /** Specifies the sort order of the results. */
    sort?: string | string[];

    /** Do not wait for the index to finish building to return results. */
    stale?: boolean;
  }

  /** View query parameters.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/ddoc/views.html#get--db-_design-ddoc-_view-view} */
  interface DocumentViewParams {
    /** Includes conflicts information in response.
     *
     * Ignored if include_docs isn’t true.
     *
     * @default false */
    conflicts?: boolean;

    /** Return the documents in descending by key order.
     *
     * @default false */
    descending?: boolean;

    /** Stop returning records when the specified key is reached. */
    endkey?: any;

    /** Alias for endkey param. */
    end_key?: any;

    /** Stop returning records when the specified document ID is reached.
     *
     * Requires endkey to be specified for this to have any effect. */
    endkey_docid?: string;

    /** Alias for endkey_docid param. */
    end_key_doc_id?: string;

    /** Group the results using the reduce function to a group or single row.
     *
     * @default false */
    group?: boolean;

    /** Specify the group level to be used. */
    group_level?: number;

    /** Include the associated document with each row.
     *
     * @default false */
    include_docs?: boolean;

    /** Include the Base64-encoded content of attachments in the documents that are included if include_docs is true.
     *
     * Ignored if include_docs isn’t true.
     *
     * @default false */
    attachments?: boolean;

    /** Include encoding information in attachment stubs.
     *
     * Only if include_docs is true and the particular attachment is compressed.
     *
     * Ignored if include_docs isn’t true.
     *
     * @default false */
    att_encoding_info?: boolean;

    /** Specifies whether the specified end key should be included in the result.
     *
     * @default true */
    inclusive_end?: boolean;

    /** Return only documents that match the specified key. */
    key?: any;

    /** Return only documents where the key matches one of the keys specified in the array. */
    keys?: any[];

    /** Limit the number of the returned documents to the specified number. */
    limit?: number;

    /** Use the reduction function.
     *
     * @default true */
    reduce?: boolean;

    /** Skip this number of records before starting to return the results.
     *
     * @default 0 */
    skip?: number;

    /** Sort returned rows.
     * 
     * Setting this to false offers a performance boost. The total_rows and offset fields are not available when this is
     * set to false.
     *
     * @default true */
    sorted?: boolean;

    /** Whether or not the view results should be returned from a stable set of shards.
     *
     * @default false */
    stable?: boolean;

    /** Allow the results from a stale view to be used.
     * 
     * Supported values: ok, update_after and false.
     * 
     * - ok is equivalent to stable=true&update=false.  
     * - update_after is equivalent to stable=true&update=lazy.
     * - false is equivalent to stable=false&update=true.
     */
    stale?: string;

    /** Return records starting with the specified key. */
    startkey?: any;

    /** Alias for startkey param */
    start_key?: any;

    /** Return records starting with the specified document ID.
     *
     * Requires startkey to be specified for this to have any effect. */
    startkey_docid?: string;

    /** Alias for startkey_docid param */
    start_key_doc_id?: string;

    /**  Whether or not the view in question should be updated prior to responding to the user.
     *
     * Supported values: true, false, lazy.
     *
     * @default true */
    update?: string;

    /** Response includes an update_seq value indicating which sequence id of the database the view reflects.
     *
     * @default false */
    update_seq?: boolean;
  }

  /** View response.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/ddoc/views.html#get--db-_design-ddoc-_view-view} */
  interface DocumentViewResponse<V,D> {
    /** Offset where the document list started. */
    offset: number;

    /** Array of view row objects.
     *
     * By default the information returned contains only the document ID and revision. */
    rows: Array<{
      id: string;
      key: string;
      value: V;
      doc?: D & Document;
    }>;

    /** Number of documents in the database/view. */
    total_rows: number;

    /** Current update sequence for the database */
    update_seq?: any;
  }


  type MangoValue = number | string | Date | boolean | object | null;
  type MangoOperator = '$lt' | '$lte' | '$eq' | '$ne' | '$gte' | '$gt' |
                    '$exists' | '$type' |
                    '$in' | '$nin' | '$size' | '$mod' | '$regex' |
                    '$or' | '$and' | '$nor' | '$not' | '$all' | '$allMatch' | '$elemMatch';
  /** Mango selector syntax.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/find.html#selector-syntax} */
  type MangoSelector = {
    [K in MangoOperator | string]: MangoSelector| MangoSelector[] | MangoValue | MangoValue[];
  }

  /** Mango sort syntax
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/find.html#sort-syntax} */
  type SortOrder = string | string[] | { [key: string]: 'asc' | 'desc' };

  /** Mango query syntax.
   * @see Docs: {@link https://docs.couchdb.org/en/latest/api/database/find.html#db-find}  */
  interface MangoQuery {
    /** JSON object describing criteria used to select documents. */
    selector: MangoSelector;

    /** Maximum number of results returned. @default 25 */
    limit?: number;

    /** Skip the first 'n' results, where 'n' is the value specified. */
    skip?: number;

    /** JSON array following sort syntax. */
    sort?: SortOrder[];

    /** JSON array specifying which fields of each object should be returned.
     * 
     * If it is omitted, the entire object is returned.
     *
     * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/find.html#filtering-fields} */
    fields?: string[];

    /* Instruct a query to use a specific index.
     *
     * Specified either as "<design_document>" or ["<design_document>", "<index_name>"]. */
    use_index?: string | [string, string];

    /** Read quorum needed for the result.
     *
     * @default 1 */
    r?: number;

    /** A string that enables you to specify which page of results you require.
     *
     * Used for paging through result sets. */
    bookmark?: string;

    /** Whether to update the index prior to returning the result.
     *
     * @default true */
    update?: boolean;

    /** Whether or not the view results should be returned from a “stable” set of shards. */
    stable?: boolean;

    /** Combination of update = false and stable = true options.
     *
     * Possible options: "ok", false (default). */
    stale?: 'ok' | false;

    /** Include execution statistics in the query response.
     *
     * Optional, default: false. */
    execution_stats?: boolean;
  }

  /** Mango response.
   * @see Docs: {@link https://docs.couchdb.org/en/latest/api/database/find.html#db-find}  */
  interface MangoResponse<D> {
    /** Array of documents matching the search.
     * 
     * In each matching document, the fields specified in the fields part of the request body are listed, along with
     * their values. */
    docs: (D & {_id: string, _rev:string})[];

    /** A string that enables you to specify which page of results you require.
     *
     * Used for paging through result sets. */
    bookmark?: string;

    /** Execution warnings */
    warning?: string;

    /** Basic execution statistics for a specific request. */
    execution_stats?: MangoExecutionStats;
  }

  /** Mango execution stats.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/find.html#execution-statistics} */
  interface MangoExecutionStats {
    /** Number of index keys examined. Currently always 0. */
    total_keys_examined: number;

    /** Number of documents fetched from the database / index.
     *
     * Equivalent to using include_docs = true in a view. */
    total_docs_examined: number;

    /** Number of documents fetched from the database using an out-of-band document fetch.
     *
     * This is only non-zero when read quorum > 1 is specified in the query parameters. */
    total_quorum_docs_examined: number;

    /** Number of results returned from the query. */
    results_returned: number;

    /** Total execution time in milliseconds as measured by the database. */
    execution_time_ms: number;
  }

  /** Mango create index parameters.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/find.html#db-index} */
  interface CreateIndexRequest{
    /** JSON object describing the index to create */
    index: {
      /** Array of field names following the sort syntax. */
      fields: SortOrder[],

      /** A selector to apply to documents at indexing time, creating a partial index. */
      partial_filter_selector?: MangoSelector
    },

    /** Name of the design document in which the index will be created. */
    ddoc?: string

    /** Name of the index. If no name is provided, a name will be generated automatically. */
    name?: string,

    /** Can be "json" or "text".
     *
     * @default "json" */
    type?: 'json' | 'text',

    /** This field sets whether the created index will be a partitioned or global index. */
    partitioned?: boolean
  }

  /** Mango create index response.
   * @see Docs: {@link http://docs.couchdb.org/en/latest/api/database/find.html#db-index} */
  interface CreateIndexResponse {
    /** Flag to show whether the index was created or one already exists.
     *
     * Can be “created” or “exists”. */
    result: string,

    /** Id of the design document the index was created in. */
    id: string,

    /** Name of the index created. */
    name: string
  }
}

export = nano;
