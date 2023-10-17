import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class QLDBSession extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: QLDBSession.Types.ClientConfiguration)
  config: Config & QLDBSession.Types.ClientConfiguration;
  /**
   * Sends a command to an Amazon QLDB ledger.  Instead of interacting directly with this API, we recommend using the QLDB driver or the QLDB shell to execute data transactions on a ledger.   If you are working with an AWS SDK, use the QLDB driver. The driver provides a high-level abstraction layer above this QLDB Session data plane and manages SendCommand API calls for you. For information and a list of supported programming languages, see Getting started with the driver in the Amazon QLDB Developer Guide.   If you are working with the AWS Command Line Interface (AWS CLI), use the QLDB shell. The shell is a command line interface that uses the QLDB driver to interact with a ledger. For information, see Accessing Amazon QLDB using the QLDB shell.   
   */
  sendCommand(params: QLDBSession.Types.SendCommandRequest, callback?: (err: AWSError, data: QLDBSession.Types.SendCommandResult) => void): Request<QLDBSession.Types.SendCommandResult, AWSError>;
  /**
   * Sends a command to an Amazon QLDB ledger.  Instead of interacting directly with this API, we recommend using the QLDB driver or the QLDB shell to execute data transactions on a ledger.   If you are working with an AWS SDK, use the QLDB driver. The driver provides a high-level abstraction layer above this QLDB Session data plane and manages SendCommand API calls for you. For information and a list of supported programming languages, see Getting started with the driver in the Amazon QLDB Developer Guide.   If you are working with the AWS Command Line Interface (AWS CLI), use the QLDB shell. The shell is a command line interface that uses the QLDB driver to interact with a ledger. For information, see Accessing Amazon QLDB using the QLDB shell.   
   */
  sendCommand(callback?: (err: AWSError, data: QLDBSession.Types.SendCommandResult) => void): Request<QLDBSession.Types.SendCommandResult, AWSError>;
}
declare namespace QLDBSession {
  export interface AbortTransactionRequest {
  }
  export interface AbortTransactionResult {
    /**
     * Contains server-side performance information for the command.
     */
    TimingInformation?: TimingInformation;
  }
  export type CommitDigest = Buffer|Uint8Array|Blob|string;
  export interface CommitTransactionRequest {
    /**
     * Specifies the transaction ID of the transaction to commit.
     */
    TransactionId: TransactionId;
    /**
     * Specifies the commit digest for the transaction to commit. For every active transaction, the commit digest must be passed. QLDB validates CommitDigest and rejects the commit with an error if the digest computed on the client does not match the digest computed by QLDB. The purpose of the CommitDigest parameter is to ensure that QLDB commits a transaction if and only if the server has processed the exact set of statements sent by the client, in the same order that client sent them, and with no duplicates.
     */
    CommitDigest: CommitDigest;
  }
  export interface CommitTransactionResult {
    /**
     * The transaction ID of the committed transaction.
     */
    TransactionId?: TransactionId;
    /**
     * The commit digest of the committed transaction.
     */
    CommitDigest?: CommitDigest;
    /**
     * Contains server-side performance information for the command.
     */
    TimingInformation?: TimingInformation;
    /**
     * Contains metrics about the number of I/O requests that were consumed.
     */
    ConsumedIOs?: IOUsage;
  }
  export interface EndSessionRequest {
  }
  export interface EndSessionResult {
    /**
     * Contains server-side performance information for the command.
     */
    TimingInformation?: TimingInformation;
  }
  export interface ExecuteStatementRequest {
    /**
     * Specifies the transaction ID of the request.
     */
    TransactionId: TransactionId;
    /**
     * Specifies the statement of the request.
     */
    Statement: Statement;
    /**
     * Specifies the parameters for the parameterized statement in the request.
     */
    Parameters?: StatementParameters;
  }
  export interface ExecuteStatementResult {
    /**
     * Contains the details of the first fetched page.
     */
    FirstPage?: Page;
    /**
     * Contains server-side performance information for the command.
     */
    TimingInformation?: TimingInformation;
    /**
     * Contains metrics about the number of I/O requests that were consumed.
     */
    ConsumedIOs?: IOUsage;
  }
  export interface FetchPageRequest {
    /**
     * Specifies the transaction ID of the page to be fetched.
     */
    TransactionId: TransactionId;
    /**
     * Specifies the next page token of the page to be fetched.
     */
    NextPageToken: PageToken;
  }
  export interface FetchPageResult {
    /**
     * Contains details of the fetched page.
     */
    Page?: Page;
    /**
     * Contains server-side performance information for the command.
     */
    TimingInformation?: TimingInformation;
    /**
     * Contains metrics about the number of I/O requests that were consumed.
     */
    ConsumedIOs?: IOUsage;
  }
  export interface IOUsage {
    /**
     * The number of read I/O requests that the command made.
     */
    ReadIOs?: ReadIOs;
    /**
     * The number of write I/O requests that the command made.
     */
    WriteIOs?: WriteIOs;
  }
  export type IonBinary = Buffer|Uint8Array|Blob|string;
  export type IonText = string;
  export type LedgerName = string;
  export interface Page {
    /**
     * A structure that contains values in multiple encoding formats.
     */
    Values?: ValueHolders;
    /**
     * The token of the next page.
     */
    NextPageToken?: PageToken;
  }
  export type PageToken = string;
  export type ProcessingTimeMilliseconds = number;
  export type ReadIOs = number;
  export interface SendCommandRequest {
    /**
     * Specifies the session token for the current command. A session token is constant throughout the life of the session. To obtain a session token, run the StartSession command. This SessionToken is required for every subsequent command that is issued during the current session.
     */
    SessionToken?: SessionToken;
    /**
     * Command to start a new session. A session token is obtained as part of the response.
     */
    StartSession?: StartSessionRequest;
    /**
     * Command to start a new transaction.
     */
    StartTransaction?: StartTransactionRequest;
    /**
     * Command to end the current session.
     */
    EndSession?: EndSessionRequest;
    /**
     * Command to commit the specified transaction.
     */
    CommitTransaction?: CommitTransactionRequest;
    /**
     * Command to abort the current transaction.
     */
    AbortTransaction?: AbortTransactionRequest;
    /**
     * Command to execute a statement in the specified transaction.
     */
    ExecuteStatement?: ExecuteStatementRequest;
    /**
     * Command to fetch a page.
     */
    FetchPage?: FetchPageRequest;
  }
  export interface SendCommandResult {
    /**
     * Contains the details of the started session that includes a session token. This SessionToken is required for every subsequent command that is issued during the current session.
     */
    StartSession?: StartSessionResult;
    /**
     * Contains the details of the started transaction.
     */
    StartTransaction?: StartTransactionResult;
    /**
     * Contains the details of the ended session.
     */
    EndSession?: EndSessionResult;
    /**
     * Contains the details of the committed transaction.
     */
    CommitTransaction?: CommitTransactionResult;
    /**
     * Contains the details of the aborted transaction.
     */
    AbortTransaction?: AbortTransactionResult;
    /**
     * Contains the details of the executed statement.
     */
    ExecuteStatement?: ExecuteStatementResult;
    /**
     * Contains the details of the fetched page.
     */
    FetchPage?: FetchPageResult;
  }
  export type SessionToken = string;
  export interface StartSessionRequest {
    /**
     * The name of the ledger to start a new session against.
     */
    LedgerName: LedgerName;
  }
  export interface StartSessionResult {
    /**
     * Session token of the started session. This SessionToken is required for every subsequent command that is issued during the current session.
     */
    SessionToken?: SessionToken;
    /**
     * Contains server-side performance information for the command.
     */
    TimingInformation?: TimingInformation;
  }
  export interface StartTransactionRequest {
  }
  export interface StartTransactionResult {
    /**
     * The transaction ID of the started transaction.
     */
    TransactionId?: TransactionId;
    /**
     * Contains server-side performance information for the command.
     */
    TimingInformation?: TimingInformation;
  }
  export type Statement = string;
  export type StatementParameters = ValueHolder[];
  export interface TimingInformation {
    /**
     * The amount of time that QLDB spent on processing the command, measured in milliseconds.
     */
    ProcessingTimeMilliseconds?: ProcessingTimeMilliseconds;
  }
  export type TransactionId = string;
  export interface ValueHolder {
    /**
     * An Amazon Ion binary value contained in a ValueHolder structure.
     */
    IonBinary?: IonBinary;
    /**
     * An Amazon Ion plaintext value contained in a ValueHolder structure.
     */
    IonText?: IonText;
  }
  export type ValueHolders = ValueHolder[];
  export type WriteIOs = number;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-07-11"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the QLDBSession client.
   */
  export import Types = QLDBSession;
}
export = QLDBSession;
