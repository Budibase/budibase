import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ConnectCampaigns extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ConnectCampaigns.Types.ClientConfiguration)
  config: Config & ConnectCampaigns.Types.ClientConfiguration;
  /**
   * Creates a campaign for the specified Amazon Connect account. This API is idempotent.
   */
  createCampaign(params: ConnectCampaigns.Types.CreateCampaignRequest, callback?: (err: AWSError, data: ConnectCampaigns.Types.CreateCampaignResponse) => void): Request<ConnectCampaigns.Types.CreateCampaignResponse, AWSError>;
  /**
   * Creates a campaign for the specified Amazon Connect account. This API is idempotent.
   */
  createCampaign(callback?: (err: AWSError, data: ConnectCampaigns.Types.CreateCampaignResponse) => void): Request<ConnectCampaigns.Types.CreateCampaignResponse, AWSError>;
  /**
   * Deletes a campaign from the specified Amazon Connect account.
   */
  deleteCampaign(params: ConnectCampaigns.Types.DeleteCampaignRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a campaign from the specified Amazon Connect account.
   */
  deleteCampaign(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a connect instance config from the specified AWS account.
   */
  deleteConnectInstanceConfig(params: ConnectCampaigns.Types.DeleteConnectInstanceConfigRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a connect instance config from the specified AWS account.
   */
  deleteConnectInstanceConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete the Connect Campaigns onboarding job for the specified Amazon Connect instance.
   */
  deleteInstanceOnboardingJob(params: ConnectCampaigns.Types.DeleteInstanceOnboardingJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete the Connect Campaigns onboarding job for the specified Amazon Connect instance.
   */
  deleteInstanceOnboardingJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Describes the specific campaign.
   */
  describeCampaign(params: ConnectCampaigns.Types.DescribeCampaignRequest, callback?: (err: AWSError, data: ConnectCampaigns.Types.DescribeCampaignResponse) => void): Request<ConnectCampaigns.Types.DescribeCampaignResponse, AWSError>;
  /**
   * Describes the specific campaign.
   */
  describeCampaign(callback?: (err: AWSError, data: ConnectCampaigns.Types.DescribeCampaignResponse) => void): Request<ConnectCampaigns.Types.DescribeCampaignResponse, AWSError>;
  /**
   * Get state of a campaign for the specified Amazon Connect account.
   */
  getCampaignState(params: ConnectCampaigns.Types.GetCampaignStateRequest, callback?: (err: AWSError, data: ConnectCampaigns.Types.GetCampaignStateResponse) => void): Request<ConnectCampaigns.Types.GetCampaignStateResponse, AWSError>;
  /**
   * Get state of a campaign for the specified Amazon Connect account.
   */
  getCampaignState(callback?: (err: AWSError, data: ConnectCampaigns.Types.GetCampaignStateResponse) => void): Request<ConnectCampaigns.Types.GetCampaignStateResponse, AWSError>;
  /**
   * Get state of campaigns for the specified Amazon Connect account.
   */
  getCampaignStateBatch(params: ConnectCampaigns.Types.GetCampaignStateBatchRequest, callback?: (err: AWSError, data: ConnectCampaigns.Types.GetCampaignStateBatchResponse) => void): Request<ConnectCampaigns.Types.GetCampaignStateBatchResponse, AWSError>;
  /**
   * Get state of campaigns for the specified Amazon Connect account.
   */
  getCampaignStateBatch(callback?: (err: AWSError, data: ConnectCampaigns.Types.GetCampaignStateBatchResponse) => void): Request<ConnectCampaigns.Types.GetCampaignStateBatchResponse, AWSError>;
  /**
   * Get the specific Connect instance config.
   */
  getConnectInstanceConfig(params: ConnectCampaigns.Types.GetConnectInstanceConfigRequest, callback?: (err: AWSError, data: ConnectCampaigns.Types.GetConnectInstanceConfigResponse) => void): Request<ConnectCampaigns.Types.GetConnectInstanceConfigResponse, AWSError>;
  /**
   * Get the specific Connect instance config.
   */
  getConnectInstanceConfig(callback?: (err: AWSError, data: ConnectCampaigns.Types.GetConnectInstanceConfigResponse) => void): Request<ConnectCampaigns.Types.GetConnectInstanceConfigResponse, AWSError>;
  /**
   * Get the specific instance onboarding job status.
   */
  getInstanceOnboardingJobStatus(params: ConnectCampaigns.Types.GetInstanceOnboardingJobStatusRequest, callback?: (err: AWSError, data: ConnectCampaigns.Types.GetInstanceOnboardingJobStatusResponse) => void): Request<ConnectCampaigns.Types.GetInstanceOnboardingJobStatusResponse, AWSError>;
  /**
   * Get the specific instance onboarding job status.
   */
  getInstanceOnboardingJobStatus(callback?: (err: AWSError, data: ConnectCampaigns.Types.GetInstanceOnboardingJobStatusResponse) => void): Request<ConnectCampaigns.Types.GetInstanceOnboardingJobStatusResponse, AWSError>;
  /**
   * Provides summary information about the campaigns under the specified Amazon Connect account.
   */
  listCampaigns(params: ConnectCampaigns.Types.ListCampaignsRequest, callback?: (err: AWSError, data: ConnectCampaigns.Types.ListCampaignsResponse) => void): Request<ConnectCampaigns.Types.ListCampaignsResponse, AWSError>;
  /**
   * Provides summary information about the campaigns under the specified Amazon Connect account.
   */
  listCampaigns(callback?: (err: AWSError, data: ConnectCampaigns.Types.ListCampaignsResponse) => void): Request<ConnectCampaigns.Types.ListCampaignsResponse, AWSError>;
  /**
   * List tags for a resource.
   */
  listTagsForResource(params: ConnectCampaigns.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: ConnectCampaigns.Types.ListTagsForResourceResponse) => void): Request<ConnectCampaigns.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * List tags for a resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: ConnectCampaigns.Types.ListTagsForResourceResponse) => void): Request<ConnectCampaigns.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Pauses a campaign for the specified Amazon Connect account.
   */
  pauseCampaign(params: ConnectCampaigns.Types.PauseCampaignRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Pauses a campaign for the specified Amazon Connect account.
   */
  pauseCampaign(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates dials requests for the specified campaign Amazon Connect account. This API is idempotent.
   */
  putDialRequestBatch(params: ConnectCampaigns.Types.PutDialRequestBatchRequest, callback?: (err: AWSError, data: ConnectCampaigns.Types.PutDialRequestBatchResponse) => void): Request<ConnectCampaigns.Types.PutDialRequestBatchResponse, AWSError>;
  /**
   * Creates dials requests for the specified campaign Amazon Connect account. This API is idempotent.
   */
  putDialRequestBatch(callback?: (err: AWSError, data: ConnectCampaigns.Types.PutDialRequestBatchResponse) => void): Request<ConnectCampaigns.Types.PutDialRequestBatchResponse, AWSError>;
  /**
   * Stops a campaign for the specified Amazon Connect account.
   */
  resumeCampaign(params: ConnectCampaigns.Types.ResumeCampaignRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a campaign for the specified Amazon Connect account.
   */
  resumeCampaign(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Starts a campaign for the specified Amazon Connect account.
   */
  startCampaign(params: ConnectCampaigns.Types.StartCampaignRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Starts a campaign for the specified Amazon Connect account.
   */
  startCampaign(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Onboard the specific Amazon Connect instance to Connect Campaigns.
   */
  startInstanceOnboardingJob(params: ConnectCampaigns.Types.StartInstanceOnboardingJobRequest, callback?: (err: AWSError, data: ConnectCampaigns.Types.StartInstanceOnboardingJobResponse) => void): Request<ConnectCampaigns.Types.StartInstanceOnboardingJobResponse, AWSError>;
  /**
   * Onboard the specific Amazon Connect instance to Connect Campaigns.
   */
  startInstanceOnboardingJob(callback?: (err: AWSError, data: ConnectCampaigns.Types.StartInstanceOnboardingJobResponse) => void): Request<ConnectCampaigns.Types.StartInstanceOnboardingJobResponse, AWSError>;
  /**
   * Stops a campaign for the specified Amazon Connect account.
   */
  stopCampaign(params: ConnectCampaigns.Types.StopCampaignRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a campaign for the specified Amazon Connect account.
   */
  stopCampaign(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Tag a resource.
   */
  tagResource(params: ConnectCampaigns.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Tag a resource.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Untag a resource.
   */
  untagResource(params: ConnectCampaigns.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Untag a resource.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the dialer config of a campaign. This API is idempotent.
   */
  updateCampaignDialerConfig(params: ConnectCampaigns.Types.UpdateCampaignDialerConfigRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the dialer config of a campaign. This API is idempotent.
   */
  updateCampaignDialerConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the name of a campaign. This API is idempotent.
   */
  updateCampaignName(params: ConnectCampaigns.Types.UpdateCampaignNameRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the name of a campaign. This API is idempotent.
   */
  updateCampaignName(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the outbound call config of a campaign. This API is idempotent.
   */
  updateCampaignOutboundCallConfig(params: ConnectCampaigns.Types.UpdateCampaignOutboundCallConfigRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the outbound call config of a campaign. This API is idempotent.
   */
  updateCampaignOutboundCallConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace ConnectCampaigns {
  export interface AgentlessDialerConfig {
    dialingCapacity?: DialingCapacity;
  }
  export interface AnswerMachineDetectionConfig {
    /**
     * Enable or disable answering machine detection
     */
    enableAnswerMachineDetection: Boolean;
  }
  export type Arn = string;
  export type AttributeName = string;
  export type AttributeValue = string;
  export type Attributes = {[key: string]: AttributeValue};
  export type BandwidthAllocation = number;
  export type Boolean = boolean;
  export interface Campaign {
    id: CampaignId;
    arn: CampaignArn;
    name: CampaignName;
    connectInstanceId: InstanceId;
    dialerConfig: DialerConfig;
    outboundCallConfig: OutboundCallConfig;
    tags?: TagMap;
  }
  export type CampaignArn = string;
  export interface CampaignFilters {
    instanceIdFilter?: InstanceIdFilter;
  }
  export type CampaignId = string;
  export type CampaignName = string;
  export type CampaignState = "Initialized"|"Running"|"Paused"|"Stopped"|"Failed"|string;
  export interface CampaignSummary {
    id: CampaignId;
    arn: CampaignArn;
    name: CampaignName;
    connectInstanceId: InstanceId;
  }
  export type CampaignSummaryList = CampaignSummary[];
  export type ClientToken = string;
  export type ContactFlowId = string;
  export interface CreateCampaignRequest {
    name: CampaignName;
    connectInstanceId: InstanceId;
    dialerConfig: DialerConfig;
    outboundCallConfig: OutboundCallConfig;
    tags?: TagMap;
  }
  export interface CreateCampaignResponse {
    id?: CampaignId;
    arn?: CampaignArn;
    tags?: TagMap;
  }
  export interface DeleteCampaignRequest {
    id: CampaignId;
  }
  export interface DeleteConnectInstanceConfigRequest {
    connectInstanceId: InstanceId;
  }
  export interface DeleteInstanceOnboardingJobRequest {
    connectInstanceId: InstanceId;
  }
  export interface DescribeCampaignRequest {
    id: CampaignId;
  }
  export interface DescribeCampaignResponse {
    campaign?: Campaign;
  }
  export type DestinationPhoneNumber = string;
  export interface DialRequest {
    clientToken: ClientToken;
    phoneNumber: DestinationPhoneNumber;
    expirationTime: TimeStamp;
    attributes: Attributes;
  }
  export type DialRequestId = string;
  export type DialRequestList = DialRequest[];
  export interface DialerConfig {
    progressiveDialerConfig?: ProgressiveDialerConfig;
    predictiveDialerConfig?: PredictiveDialerConfig;
    agentlessDialerConfig?: AgentlessDialerConfig;
  }
  export type DialingCapacity = number;
  export type Enabled = boolean;
  export interface EncryptionConfig {
    enabled: Enabled;
    encryptionType?: EncryptionType;
    keyArn?: EncryptionKey;
  }
  export type EncryptionKey = string;
  export type EncryptionType = "KMS"|string;
  export interface FailedCampaignStateResponse {
    campaignId?: CampaignId;
    failureCode?: GetCampaignStateBatchFailureCode;
  }
  export type FailedCampaignStateResponseList = FailedCampaignStateResponse[];
  export interface FailedRequest {
    clientToken?: ClientToken;
    id?: DialRequestId;
    failureCode?: FailureCode;
  }
  export type FailedRequestList = FailedRequest[];
  export type FailureCode = "InvalidInput"|"RequestThrottled"|"UnknownError"|string;
  export type GetCampaignStateBatchFailureCode = "ResourceNotFound"|"UnknownError"|string;
  export interface GetCampaignStateBatchRequest {
    campaignIds: GetCampaignStateBatchRequestCampaignIdsList;
  }
  export type GetCampaignStateBatchRequestCampaignIdsList = CampaignId[];
  export interface GetCampaignStateBatchResponse {
    successfulRequests?: SuccessfulCampaignStateResponseList;
    failedRequests?: FailedCampaignStateResponseList;
  }
  export interface GetCampaignStateRequest {
    id: CampaignId;
  }
  export interface GetCampaignStateResponse {
    state?: CampaignState;
  }
  export interface GetConnectInstanceConfigRequest {
    connectInstanceId: InstanceId;
  }
  export interface GetConnectInstanceConfigResponse {
    connectInstanceConfig?: InstanceConfig;
  }
  export interface GetInstanceOnboardingJobStatusRequest {
    connectInstanceId: InstanceId;
  }
  export interface GetInstanceOnboardingJobStatusResponse {
    connectInstanceOnboardingJobStatus?: InstanceOnboardingJobStatus;
  }
  export interface InstanceConfig {
    connectInstanceId: InstanceId;
    serviceLinkedRoleArn: ServiceLinkedRoleArn;
    encryptionConfig: EncryptionConfig;
  }
  export type InstanceId = string;
  export interface InstanceIdFilter {
    value: InstanceId;
    operator: InstanceIdFilterOperator;
  }
  export type InstanceIdFilterOperator = "Eq"|string;
  export type InstanceOnboardingJobFailureCode = "EVENT_BRIDGE_ACCESS_DENIED"|"EVENT_BRIDGE_MANAGED_RULE_LIMIT_EXCEEDED"|"IAM_ACCESS_DENIED"|"KMS_ACCESS_DENIED"|"KMS_KEY_NOT_FOUND"|"INTERNAL_FAILURE"|string;
  export interface InstanceOnboardingJobStatus {
    connectInstanceId: InstanceId;
    status: InstanceOnboardingJobStatusCode;
    failureCode?: InstanceOnboardingJobFailureCode;
  }
  export type InstanceOnboardingJobStatusCode = "IN_PROGRESS"|"SUCCEEDED"|"FAILED"|string;
  export interface ListCampaignsRequest {
    maxResults?: MaxResults;
    nextToken?: NextToken;
    filters?: CampaignFilters;
  }
  export interface ListCampaignsResponse {
    nextToken?: NextToken;
    campaignSummaryList?: CampaignSummaryList;
  }
  export interface ListTagsForResourceRequest {
    arn: Arn;
  }
  export interface ListTagsForResourceResponse {
    tags?: TagMap;
  }
  export type MaxResults = number;
  export type NextToken = string;
  export interface OutboundCallConfig {
    connectContactFlowId: ContactFlowId;
    connectSourcePhoneNumber?: SourcePhoneNumber;
    connectQueueId?: QueueId;
    answerMachineDetectionConfig?: AnswerMachineDetectionConfig;
  }
  export interface PauseCampaignRequest {
    id: CampaignId;
  }
  export interface PredictiveDialerConfig {
    bandwidthAllocation: BandwidthAllocation;
    dialingCapacity?: DialingCapacity;
  }
  export interface ProgressiveDialerConfig {
    bandwidthAllocation: BandwidthAllocation;
    dialingCapacity?: DialingCapacity;
  }
  export interface PutDialRequestBatchRequest {
    id: CampaignId;
    dialRequests: DialRequestList;
  }
  export interface PutDialRequestBatchResponse {
    successfulRequests?: SuccessfulRequestList;
    failedRequests?: FailedRequestList;
  }
  export type QueueId = string;
  export interface ResumeCampaignRequest {
    id: CampaignId;
  }
  export type ServiceLinkedRoleArn = string;
  export type SourcePhoneNumber = string;
  export interface StartCampaignRequest {
    id: CampaignId;
  }
  export interface StartInstanceOnboardingJobRequest {
    connectInstanceId: InstanceId;
    encryptionConfig: EncryptionConfig;
  }
  export interface StartInstanceOnboardingJobResponse {
    connectInstanceOnboardingJobStatus?: InstanceOnboardingJobStatus;
  }
  export interface StopCampaignRequest {
    id: CampaignId;
  }
  export interface SuccessfulCampaignStateResponse {
    campaignId?: CampaignId;
    state?: CampaignState;
  }
  export type SuccessfulCampaignStateResponseList = SuccessfulCampaignStateResponse[];
  export interface SuccessfulRequest {
    clientToken?: ClientToken;
    id?: DialRequestId;
  }
  export type SuccessfulRequestList = SuccessfulRequest[];
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    arn: Arn;
    tags: TagMap;
  }
  export type TagValue = string;
  export type TimeStamp = Date;
  export interface UntagResourceRequest {
    arn: Arn;
    tagKeys: TagKeyList;
  }
  export interface UpdateCampaignDialerConfigRequest {
    id: CampaignId;
    dialerConfig: DialerConfig;
  }
  export interface UpdateCampaignNameRequest {
    id: CampaignId;
    name: CampaignName;
  }
  export interface UpdateCampaignOutboundCallConfigRequest {
    id: CampaignId;
    connectContactFlowId?: ContactFlowId;
    connectSourcePhoneNumber?: SourcePhoneNumber;
    answerMachineDetectionConfig?: AnswerMachineDetectionConfig;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-01-30"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ConnectCampaigns client.
   */
  export import Types = ConnectCampaigns;
}
export = ConnectCampaigns;
