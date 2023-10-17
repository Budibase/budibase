import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ManagedBlockchainQuery extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ManagedBlockchainQuery.Types.ClientConfiguration)
  config: Config & ManagedBlockchainQuery.Types.ClientConfiguration;
  /**
   * Gets the token balance for a batch of tokens by using the GetTokenBalance action for every token in the request.  Only the native tokens BTC,ETH, and the ERC-20, ERC-721, and ERC 1155 token standards are supported. 
   */
  batchGetTokenBalance(params: ManagedBlockchainQuery.Types.BatchGetTokenBalanceInput, callback?: (err: AWSError, data: ManagedBlockchainQuery.Types.BatchGetTokenBalanceOutput) => void): Request<ManagedBlockchainQuery.Types.BatchGetTokenBalanceOutput, AWSError>;
  /**
   * Gets the token balance for a batch of tokens by using the GetTokenBalance action for every token in the request.  Only the native tokens BTC,ETH, and the ERC-20, ERC-721, and ERC 1155 token standards are supported. 
   */
  batchGetTokenBalance(callback?: (err: AWSError, data: ManagedBlockchainQuery.Types.BatchGetTokenBalanceOutput) => void): Request<ManagedBlockchainQuery.Types.BatchGetTokenBalanceOutput, AWSError>;
  /**
   * Gets the balance of a specific token, including native tokens, for a given address (wallet or contract) on the blockchain.  Only the native tokens BTC,ETH, and the ERC-20, ERC-721, and ERC 1155 token standards are supported. 
   */
  getTokenBalance(params: ManagedBlockchainQuery.Types.GetTokenBalanceInput, callback?: (err: AWSError, data: ManagedBlockchainQuery.Types.GetTokenBalanceOutput) => void): Request<ManagedBlockchainQuery.Types.GetTokenBalanceOutput, AWSError>;
  /**
   * Gets the balance of a specific token, including native tokens, for a given address (wallet or contract) on the blockchain.  Only the native tokens BTC,ETH, and the ERC-20, ERC-721, and ERC 1155 token standards are supported. 
   */
  getTokenBalance(callback?: (err: AWSError, data: ManagedBlockchainQuery.Types.GetTokenBalanceOutput) => void): Request<ManagedBlockchainQuery.Types.GetTokenBalanceOutput, AWSError>;
  /**
   * Get the details of a transaction.
   */
  getTransaction(params: ManagedBlockchainQuery.Types.GetTransactionInput, callback?: (err: AWSError, data: ManagedBlockchainQuery.Types.GetTransactionOutput) => void): Request<ManagedBlockchainQuery.Types.GetTransactionOutput, AWSError>;
  /**
   * Get the details of a transaction.
   */
  getTransaction(callback?: (err: AWSError, data: ManagedBlockchainQuery.Types.GetTransactionOutput) => void): Request<ManagedBlockchainQuery.Types.GetTransactionOutput, AWSError>;
  /**
   * This action returns the following for a given a blockchain network:   Lists all token balances owned by an address (either a contact address or a wallet address).   Lists all token balances for all tokens created by a contract.   Lists all token balances for a given token.    You must always specify the network property of the tokenFilter when using this operation. 
   */
  listTokenBalances(params: ManagedBlockchainQuery.Types.ListTokenBalancesInput, callback?: (err: AWSError, data: ManagedBlockchainQuery.Types.ListTokenBalancesOutput) => void): Request<ManagedBlockchainQuery.Types.ListTokenBalancesOutput, AWSError>;
  /**
   * This action returns the following for a given a blockchain network:   Lists all token balances owned by an address (either a contact address or a wallet address).   Lists all token balances for all tokens created by a contract.   Lists all token balances for a given token.    You must always specify the network property of the tokenFilter when using this operation. 
   */
  listTokenBalances(callback?: (err: AWSError, data: ManagedBlockchainQuery.Types.ListTokenBalancesOutput) => void): Request<ManagedBlockchainQuery.Types.ListTokenBalancesOutput, AWSError>;
  /**
   * An array of TransactionEvent objects. Each object contains details about the transaction event.
   */
  listTransactionEvents(params: ManagedBlockchainQuery.Types.ListTransactionEventsInput, callback?: (err: AWSError, data: ManagedBlockchainQuery.Types.ListTransactionEventsOutput) => void): Request<ManagedBlockchainQuery.Types.ListTransactionEventsOutput, AWSError>;
  /**
   * An array of TransactionEvent objects. Each object contains details about the transaction event.
   */
  listTransactionEvents(callback?: (err: AWSError, data: ManagedBlockchainQuery.Types.ListTransactionEventsOutput) => void): Request<ManagedBlockchainQuery.Types.ListTransactionEventsOutput, AWSError>;
  /**
   * Lists all of the transactions on a given wallet address or to a specific contract.
   */
  listTransactions(params: ManagedBlockchainQuery.Types.ListTransactionsInput, callback?: (err: AWSError, data: ManagedBlockchainQuery.Types.ListTransactionsOutput) => void): Request<ManagedBlockchainQuery.Types.ListTransactionsOutput, AWSError>;
  /**
   * Lists all of the transactions on a given wallet address or to a specific contract.
   */
  listTransactions(callback?: (err: AWSError, data: ManagedBlockchainQuery.Types.ListTransactionsOutput) => void): Request<ManagedBlockchainQuery.Types.ListTransactionsOutput, AWSError>;
}
declare namespace ManagedBlockchainQuery {
  export interface BatchGetTokenBalanceErrorItem {
    tokenIdentifier?: TokenIdentifier;
    ownerIdentifier?: OwnerIdentifier;
    atBlockchainInstant?: BlockchainInstant;
    /**
     * The error code associated with the error.
     */
    errorCode: String;
    /**
     * The message associated with the error.
     */
    errorMessage: String;
    /**
     * The type of error.
     */
    errorType: ErrorType;
  }
  export type BatchGetTokenBalanceErrors = BatchGetTokenBalanceErrorItem[];
  export interface BatchGetTokenBalanceInput {
    /**
     * An array of GetTokenBalanceInput objects whose balance is being requested.
     */
    getTokenBalanceInputs?: GetTokenBalanceInputList;
  }
  export interface BatchGetTokenBalanceInputItem {
    tokenIdentifier: TokenIdentifier;
    ownerIdentifier: OwnerIdentifier;
    atBlockchainInstant?: BlockchainInstant;
  }
  export interface BatchGetTokenBalanceOutput {
    /**
     * An array of BatchGetTokenBalanceOutputItem objects returned by the response.
     */
    tokenBalances: BatchGetTokenBalanceOutputList;
    /**
     * An array of BatchGetTokenBalanceErrorItem objects returned from the request.
     */
    errors: BatchGetTokenBalanceErrors;
  }
  export interface BatchGetTokenBalanceOutputItem {
    ownerIdentifier?: OwnerIdentifier;
    tokenIdentifier?: TokenIdentifier;
    /**
     * The container for the token balance.
     */
    balance: String;
    atBlockchainInstant: BlockchainInstant;
    lastUpdatedTime?: BlockchainInstant;
  }
  export type BatchGetTokenBalanceOutputList = BatchGetTokenBalanceOutputItem[];
  export type BlockHash = string;
  export interface BlockchainInstant {
    /**
     * The container of the Timestamp of the blockchain instant.  This timestamp will only be recorded up to the second. 
     */
    time?: Timestamp;
  }
  export type ChainAddress = string;
  export type ErrorType = "VALIDATION_EXCEPTION"|"RESOURCE_NOT_FOUND_EXCEPTION"|string;
  export interface GetTokenBalanceInput {
    /**
     * The container for the identifier for the token, including the unique token ID and its blockchain network.
     */
    tokenIdentifier: TokenIdentifier;
    /**
     * The container for the identifier for the owner.
     */
    ownerIdentifier: OwnerIdentifier;
    /**
     * The time for when the TokenBalance is requested or the current time if a time is not provided in the request.  This time will only be recorded up to the second. 
     */
    atBlockchainInstant?: BlockchainInstant;
  }
  export type GetTokenBalanceInputList = BatchGetTokenBalanceInputItem[];
  export interface GetTokenBalanceOutput {
    ownerIdentifier?: OwnerIdentifier;
    tokenIdentifier?: TokenIdentifier;
    /**
     * The container for the token balance.
     */
    balance: String;
    atBlockchainInstant: BlockchainInstant;
    lastUpdatedTime?: BlockchainInstant;
  }
  export interface GetTransactionInput {
    /**
     * The hash of the transaction. It is generated whenever a transaction is verified and added to the blockchain.
     */
    transactionHash: QueryTransactionHash;
    /**
     * The blockchain network where the transaction occurred.
     */
    network: QueryNetwork;
  }
  export interface GetTransactionOutput {
    /**
     * Contains the details of the transaction.
     */
    transaction: Transaction;
  }
  export type Integer = number;
  export interface ListTokenBalancesInput {
    /**
     * The contract or wallet address on the blockchain network by which to filter the request. You must specify the address property of the ownerFilter when listing balances of tokens owned by the address.
     */
    ownerFilter?: OwnerFilter;
    /**
     * The contract address or a token identifier on the blockchain network by which to filter the request. You must specify the contractAddress property of this container when listing tokens minted by a contract.  You must always specify the network property of this container when using this operation. 
     */
    tokenFilter: TokenFilter;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of token balances to return.
     */
    maxResults?: ListTokenBalancesInputMaxResultsInteger;
  }
  export type ListTokenBalancesInputMaxResultsInteger = number;
  export interface ListTokenBalancesOutput {
    /**
     * An array of TokenBalance objects. Each object contains details about the token balance.
     */
    tokenBalances: TokenBalanceList;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    nextToken?: NextToken;
  }
  export interface ListTransactionEventsInput {
    /**
     * The hash of the transaction. It is generated whenever a transaction is verified and added to the blockchain.
     */
    transactionHash: QueryTransactionHash;
    /**
     * The blockchain network where the transaction events occurred.
     */
    network: QueryNetwork;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of transaction events to list.  Even if additional results can be retrieved, the request can return less results than maxResults or an empty array of results. To retrieve the next set of results, make another request with the returned nextToken value. The value of nextToken is null when there are no more results to return 
     */
    maxResults?: ListTransactionEventsInputMaxResultsInteger;
  }
  export type ListTransactionEventsInputMaxResultsInteger = number;
  export interface ListTransactionEventsOutput {
    /**
     * An array of TransactionEvent objects. Each object contains details about the transaction events.
     */
    events: TransactionEventList;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    nextToken?: NextToken;
  }
  export interface ListTransactionsInput {
    /**
     * The address (either a contract or wallet), whose transactions are being requested.
     */
    address: ChainAddress;
    /**
     * The blockchain network where the transactions occurred.
     */
    network: QueryNetwork;
    fromBlockchainInstant?: BlockchainInstant;
    toBlockchainInstant?: BlockchainInstant;
    /**
     * Sorts items in an ascending order if the first page starts at fromTime. Sorts items in a descending order if the first page starts at toTime.
     */
    sort?: ListTransactionsSort;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of transactions to list.  Even if additional results can be retrieved, the request can return less results than maxResults or an empty array of results. To retrieve the next set of results, make another request with the returned nextToken value. The value of nextToken is null when there are no more results to return 
     */
    maxResults?: ListTransactionsInputMaxResultsInteger;
  }
  export type ListTransactionsInputMaxResultsInteger = number;
  export interface ListTransactionsOutput {
    /**
     * The array of transactions returned by the request.
     */
    transactions: TransactionOutputList;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    nextToken?: NextToken;
  }
  export interface ListTransactionsSort {
    /**
     * Defaults to the value TRANSACTION_TIMESTAMP.
     */
    sortBy?: ListTransactionsSortBy;
    /**
     * The container for the sort order for ListTransactions. The SortOrder field only accepts the values ASCENDING and DESCENDING. Not providing SortOrder will default to ASCENDING.
     */
    sortOrder?: SortOrder;
  }
  export type ListTransactionsSortBy = "TRANSACTION_TIMESTAMP"|string;
  export type Long = number;
  export type NextToken = string;
  export interface OwnerFilter {
    /**
     * The contract or wallet address.
     */
    address: ChainAddress;
  }
  export interface OwnerIdentifier {
    /**
     * The contract or wallet address for the owner.
     */
    address: ChainAddress;
  }
  export type QueryNetwork = "ETHEREUM_MAINNET"|"BITCOIN_MAINNET"|string;
  export type QueryTokenId = string;
  export type QueryTransactionEventType = "ERC20_TRANSFER"|"ERC20_MINT"|"ERC20_BURN"|"ERC20_DEPOSIT"|"ERC20_WITHDRAWAL"|"ERC721_TRANSFER"|"ERC1155_TRANSFER"|"BITCOIN_VIN"|"BITCOIN_VOUT"|"INTERNAL_ETH_TRANSFER"|"ETH_TRANSFER"|string;
  export type QueryTransactionHash = string;
  export type QueryTransactionStatus = "FINAL"|"FAILED"|string;
  export type SortOrder = "ASCENDING"|"DESCENDING"|string;
  export type String = string;
  export type Timestamp = Date;
  export interface TokenBalance {
    /**
     * The container for the identifier of the owner.
     */
    ownerIdentifier?: OwnerIdentifier;
    /**
     * The identifier for the token, including the unique token ID and its blockchain network.
     */
    tokenIdentifier?: TokenIdentifier;
    /**
     * The container of the token balance.
     */
    balance: String;
    /**
     * The time for when the TokenBalance is requested or the current time if a time is not provided in the request.  This time will only be recorded up to the second. 
     */
    atBlockchainInstant: BlockchainInstant;
    /**
     * The timestamp of the last transaction at which the balance for the token in the wallet was updated.
     */
    lastUpdatedTime?: BlockchainInstant;
  }
  export type TokenBalanceList = TokenBalance[];
  export interface TokenFilter {
    /**
     * The blockchain network of the token.
     */
    network: QueryNetwork;
    /**
     * This is the address of the contract.
     */
    contractAddress?: ChainAddress;
    /**
     * The unique identifier of the token.
     */
    tokenId?: QueryTokenId;
  }
  export interface TokenIdentifier {
    /**
     * The blockchain network of the token.
     */
    network: QueryNetwork;
    /**
     * This is the token's contract address.
     */
    contractAddress?: ChainAddress;
    /**
     * The unique identifier of the token.
     */
    tokenId?: QueryTokenId;
  }
  export interface Transaction {
    /**
     * The blockchain network where the transaction occured.
     */
    network: QueryNetwork;
    /**
     * The block hash is a unique identifier for a block. It is a fixed-size string that is calculated by using the information in the block. The block hash is used to verify the integrity of the data in the block.
     */
    blockHash?: BlockHash;
    /**
     * The hash of the transaction. It is generated whenever a transaction is verified and added to the blockchain.
     */
    transactionHash: QueryTransactionHash;
    /**
     * The block number in which the transaction is recorded.
     */
    blockNumber?: String;
    /**
     * The Timestamp of the transaction. 
     */
    transactionTimestamp: Timestamp;
    /**
     * The index of the transaction within a blockchain.
     */
    transactionIndex: Long;
    /**
     * The number of transactions in the block.
     */
    numberOfTransactions: Long;
    /**
     * The status of the transaction.
     */
    status: QueryTransactionStatus;
    /**
     * The identifier of the transaction. It is generated whenever a transaction is verified and added to the blockchain.
     */
    to: ChainAddress;
    /**
     * The initiator of the transaction. It is either in the form a public key or a contract address.
     */
    from?: ChainAddress;
    /**
     * The blockchain address for the contract.
     */
    contractAddress?: ChainAddress;
    /**
     * The amount of gas used for the transaction.
     */
    gasUsed?: String;
    /**
     * The amount of gas used up to the specified point in the block.
     */
    cumulativeGasUsed?: String;
    /**
     * The effective gas price.
     */
    effectiveGasPrice?: String;
    /**
     * The signature of the transaction. The Z coordinate of a point V.
     */
    signatureV?: Integer;
    /**
     * The signature of the transaction. The X coordinate of a point R.
     */
    signatureR?: String;
    /**
     * The signature of the transaction. The Y coordinate of a point S.
     */
    signatureS?: String;
    /**
     * The transaction fee.
     */
    transactionFee?: String;
    /**
     * The unique identifier of the transaction. It is generated whenever a transaction is verified and added to the blockchain.
     */
    transactionId?: String;
  }
  export interface TransactionEvent {
    /**
     * The blockchain network where the transaction occurred.
     */
    network: QueryNetwork;
    /**
     * The hash of the transaction. It is generated whenever a transaction is verified and added to the blockchain.
     */
    transactionHash: QueryTransactionHash;
    /**
     * The type of transaction event.
     */
    eventType: QueryTransactionEventType;
    /**
     * The wallet address initiating the transaction. It can either be a public key or a contract.
     */
    from?: ChainAddress;
    /**
     * The wallet address receiving the transaction. It can either be a public key or a contract.
     */
    to?: ChainAddress;
    /**
     * The value that was transacted.
     */
    value?: String;
    /**
     * The blockchain address. for the contract
     */
    contractAddress?: ChainAddress;
    /**
     * The unique identifier for the token involved in the transaction.
     */
    tokenId?: QueryTokenId;
    /**
     * The unique identifier of the transaction. It is generated whenever a transaction is verified and added to the blockchain.
     */
    transactionId?: String;
    /**
     * The position of the vout in the transaction output list.
     */
    voutIndex?: Integer;
  }
  export type TransactionEventList = TransactionEvent[];
  export interface TransactionOutputItem {
    /**
     * The hash of the transaction. It is generated whenever a transaction is verified and added to the blockchain.
     */
    transactionHash: QueryTransactionHash;
    /**
     * The blockchain network where the transaction occurred.
     */
    network: QueryNetwork;
    /**
     * The time when the transaction occurred.
     */
    transactionTimestamp: Timestamp;
  }
  export type TransactionOutputList = TransactionOutputItem[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2023-05-04"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ManagedBlockchainQuery client.
   */
  export import Types = ManagedBlockchainQuery;
}
export = ManagedBlockchainQuery;
