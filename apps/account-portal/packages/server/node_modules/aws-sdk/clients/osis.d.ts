import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class OSIS extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: OSIS.Types.ClientConfiguration)
  config: Config & OSIS.Types.ClientConfiguration;
  /**
   * Creates an OpenSearch Ingestion pipeline. For more information, see Creating Amazon OpenSearch Ingestion pipelines.
   */
  createPipeline(params: OSIS.Types.CreatePipelineRequest, callback?: (err: AWSError, data: OSIS.Types.CreatePipelineResponse) => void): Request<OSIS.Types.CreatePipelineResponse, AWSError>;
  /**
   * Creates an OpenSearch Ingestion pipeline. For more information, see Creating Amazon OpenSearch Ingestion pipelines.
   */
  createPipeline(callback?: (err: AWSError, data: OSIS.Types.CreatePipelineResponse) => void): Request<OSIS.Types.CreatePipelineResponse, AWSError>;
  /**
   * Deletes an OpenSearch Ingestion pipeline. For more information, see Deleting Amazon OpenSearch Ingestion pipelines.
   */
  deletePipeline(params: OSIS.Types.DeletePipelineRequest, callback?: (err: AWSError, data: OSIS.Types.DeletePipelineResponse) => void): Request<OSIS.Types.DeletePipelineResponse, AWSError>;
  /**
   * Deletes an OpenSearch Ingestion pipeline. For more information, see Deleting Amazon OpenSearch Ingestion pipelines.
   */
  deletePipeline(callback?: (err: AWSError, data: OSIS.Types.DeletePipelineResponse) => void): Request<OSIS.Types.DeletePipelineResponse, AWSError>;
  /**
   * Retrieves information about an OpenSearch Ingestion pipeline.
   */
  getPipeline(params: OSIS.Types.GetPipelineRequest, callback?: (err: AWSError, data: OSIS.Types.GetPipelineResponse) => void): Request<OSIS.Types.GetPipelineResponse, AWSError>;
  /**
   * Retrieves information about an OpenSearch Ingestion pipeline.
   */
  getPipeline(callback?: (err: AWSError, data: OSIS.Types.GetPipelineResponse) => void): Request<OSIS.Types.GetPipelineResponse, AWSError>;
  /**
   * Retrieves information about a specific blueprint for OpenSearch Ingestion. Blueprints are templates for the configuration needed for a CreatePipeline request. For more information, see Using blueprints to create a pipeline.
   */
  getPipelineBlueprint(params: OSIS.Types.GetPipelineBlueprintRequest, callback?: (err: AWSError, data: OSIS.Types.GetPipelineBlueprintResponse) => void): Request<OSIS.Types.GetPipelineBlueprintResponse, AWSError>;
  /**
   * Retrieves information about a specific blueprint for OpenSearch Ingestion. Blueprints are templates for the configuration needed for a CreatePipeline request. For more information, see Using blueprints to create a pipeline.
   */
  getPipelineBlueprint(callback?: (err: AWSError, data: OSIS.Types.GetPipelineBlueprintResponse) => void): Request<OSIS.Types.GetPipelineBlueprintResponse, AWSError>;
  /**
   * Returns progress information for the current change happening on an OpenSearch Ingestion pipeline. Currently, this operation only returns information when a pipeline is being created. For more information, see Tracking the status of pipeline creation.
   */
  getPipelineChangeProgress(params: OSIS.Types.GetPipelineChangeProgressRequest, callback?: (err: AWSError, data: OSIS.Types.GetPipelineChangeProgressResponse) => void): Request<OSIS.Types.GetPipelineChangeProgressResponse, AWSError>;
  /**
   * Returns progress information for the current change happening on an OpenSearch Ingestion pipeline. Currently, this operation only returns information when a pipeline is being created. For more information, see Tracking the status of pipeline creation.
   */
  getPipelineChangeProgress(callback?: (err: AWSError, data: OSIS.Types.GetPipelineChangeProgressResponse) => void): Request<OSIS.Types.GetPipelineChangeProgressResponse, AWSError>;
  /**
   * Retrieves a list of all available blueprints for Data Prepper. For more information, see Using blueprints to create a pipeline.
   */
  listPipelineBlueprints(params: OSIS.Types.ListPipelineBlueprintsRequest, callback?: (err: AWSError, data: OSIS.Types.ListPipelineBlueprintsResponse) => void): Request<OSIS.Types.ListPipelineBlueprintsResponse, AWSError>;
  /**
   * Retrieves a list of all available blueprints for Data Prepper. For more information, see Using blueprints to create a pipeline.
   */
  listPipelineBlueprints(callback?: (err: AWSError, data: OSIS.Types.ListPipelineBlueprintsResponse) => void): Request<OSIS.Types.ListPipelineBlueprintsResponse, AWSError>;
  /**
   * Lists all OpenSearch Ingestion pipelines in the current Amazon Web Services account and Region. For more information, see Viewing Amazon OpenSearch Ingestion pipelines.
   */
  listPipelines(params: OSIS.Types.ListPipelinesRequest, callback?: (err: AWSError, data: OSIS.Types.ListPipelinesResponse) => void): Request<OSIS.Types.ListPipelinesResponse, AWSError>;
  /**
   * Lists all OpenSearch Ingestion pipelines in the current Amazon Web Services account and Region. For more information, see Viewing Amazon OpenSearch Ingestion pipelines.
   */
  listPipelines(callback?: (err: AWSError, data: OSIS.Types.ListPipelinesResponse) => void): Request<OSIS.Types.ListPipelinesResponse, AWSError>;
  /**
   * Lists all resource tags associated with an OpenSearch Ingestion pipeline. For more information, see Tagging Amazon OpenSearch Ingestion pipelines.
   */
  listTagsForResource(params: OSIS.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: OSIS.Types.ListTagsForResourceResponse) => void): Request<OSIS.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all resource tags associated with an OpenSearch Ingestion pipeline. For more information, see Tagging Amazon OpenSearch Ingestion pipelines.
   */
  listTagsForResource(callback?: (err: AWSError, data: OSIS.Types.ListTagsForResourceResponse) => void): Request<OSIS.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Starts an OpenSearch Ingestion pipeline. For more information, see Starting an OpenSearch Ingestion pipeline.
   */
  startPipeline(params: OSIS.Types.StartPipelineRequest, callback?: (err: AWSError, data: OSIS.Types.StartPipelineResponse) => void): Request<OSIS.Types.StartPipelineResponse, AWSError>;
  /**
   * Starts an OpenSearch Ingestion pipeline. For more information, see Starting an OpenSearch Ingestion pipeline.
   */
  startPipeline(callback?: (err: AWSError, data: OSIS.Types.StartPipelineResponse) => void): Request<OSIS.Types.StartPipelineResponse, AWSError>;
  /**
   * Stops an OpenSearch Ingestion pipeline. For more information, see Stopping an OpenSearch Ingestion pipeline.
   */
  stopPipeline(params: OSIS.Types.StopPipelineRequest, callback?: (err: AWSError, data: OSIS.Types.StopPipelineResponse) => void): Request<OSIS.Types.StopPipelineResponse, AWSError>;
  /**
   * Stops an OpenSearch Ingestion pipeline. For more information, see Stopping an OpenSearch Ingestion pipeline.
   */
  stopPipeline(callback?: (err: AWSError, data: OSIS.Types.StopPipelineResponse) => void): Request<OSIS.Types.StopPipelineResponse, AWSError>;
  /**
   * Tags an OpenSearch Ingestion pipeline. For more information, see Tagging Amazon OpenSearch Ingestion pipelines.
   */
  tagResource(params: OSIS.Types.TagResourceRequest, callback?: (err: AWSError, data: OSIS.Types.TagResourceResponse) => void): Request<OSIS.Types.TagResourceResponse, AWSError>;
  /**
   * Tags an OpenSearch Ingestion pipeline. For more information, see Tagging Amazon OpenSearch Ingestion pipelines.
   */
  tagResource(callback?: (err: AWSError, data: OSIS.Types.TagResourceResponse) => void): Request<OSIS.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from an OpenSearch Ingestion pipeline. For more information, see Tagging Amazon OpenSearch Ingestion pipelines.
   */
  untagResource(params: OSIS.Types.UntagResourceRequest, callback?: (err: AWSError, data: OSIS.Types.UntagResourceResponse) => void): Request<OSIS.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from an OpenSearch Ingestion pipeline. For more information, see Tagging Amazon OpenSearch Ingestion pipelines.
   */
  untagResource(callback?: (err: AWSError, data: OSIS.Types.UntagResourceResponse) => void): Request<OSIS.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates an OpenSearch Ingestion pipeline. For more information, see Updating Amazon OpenSearch Ingestion pipelines.
   */
  updatePipeline(params: OSIS.Types.UpdatePipelineRequest, callback?: (err: AWSError, data: OSIS.Types.UpdatePipelineResponse) => void): Request<OSIS.Types.UpdatePipelineResponse, AWSError>;
  /**
   * Updates an OpenSearch Ingestion pipeline. For more information, see Updating Amazon OpenSearch Ingestion pipelines.
   */
  updatePipeline(callback?: (err: AWSError, data: OSIS.Types.UpdatePipelineResponse) => void): Request<OSIS.Types.UpdatePipelineResponse, AWSError>;
  /**
   * Checks whether an OpenSearch Ingestion pipeline configuration is valid prior to creation. For more information, see Creating Amazon OpenSearch Ingestion pipelines.
   */
  validatePipeline(params: OSIS.Types.ValidatePipelineRequest, callback?: (err: AWSError, data: OSIS.Types.ValidatePipelineResponse) => void): Request<OSIS.Types.ValidatePipelineResponse, AWSError>;
  /**
   * Checks whether an OpenSearch Ingestion pipeline configuration is valid prior to creation. For more information, see Creating Amazon OpenSearch Ingestion pipelines.
   */
  validatePipeline(callback?: (err: AWSError, data: OSIS.Types.ValidatePipelineResponse) => void): Request<OSIS.Types.ValidatePipelineResponse, AWSError>;
}
declare namespace OSIS {
  export type Boolean = boolean;
  export interface ChangeProgressStage {
    /**
     * The name of the stage.
     */
    Name?: String;
    /**
     * The current status of the stage that the change is in.
     */
    Status?: ChangeProgressStageStatuses;
    /**
     * A description of the stage.
     */
    Description?: String;
    /**
     * The most recent updated timestamp of the stage.
     */
    LastUpdatedAt?: Timestamp;
  }
  export type ChangeProgressStageList = ChangeProgressStage[];
  export type ChangeProgressStageStatuses = "PENDING"|"IN_PROGRESS"|"COMPLETED"|"FAILED"|string;
  export interface ChangeProgressStatus {
    /**
     * The time at which the configuration change is made on the pipeline.
     */
    StartTime?: Timestamp;
    /**
     * The overall status of the pipeline configuration change.
     */
    Status?: ChangeProgressStatuses;
    /**
     * The total number of stages required for the pipeline configuration change.
     */
    TotalNumberOfStages?: Integer;
    /**
     * Information about the stages that the pipeline is going through to perform the configuration change.
     */
    ChangeProgressStages?: ChangeProgressStageList;
  }
  export type ChangeProgressStatusList = ChangeProgressStatus[];
  export type ChangeProgressStatuses = "PENDING"|"IN_PROGRESS"|"COMPLETED"|"FAILED"|string;
  export interface CloudWatchLogDestination {
    /**
     * The name of the CloudWatch Logs group to send pipeline logs to. You can specify an existing log group or create a new one. For example, /aws/OpenSearchService/IngestionService/my-pipeline.
     */
    LogGroup: LogGroup;
  }
  export interface CreatePipelineRequest {
    /**
     * The name of the OpenSearch Ingestion pipeline to create. Pipeline names are unique across the pipelines owned by an account within an Amazon Web Services Region.
     */
    PipelineName: PipelineName;
    /**
     * The minimum pipeline capacity, in Ingestion Compute Units (ICUs).
     */
    MinUnits: PipelineUnits;
    /**
     * The maximum pipeline capacity, in Ingestion Compute Units (ICUs).
     */
    MaxUnits: PipelineUnits;
    /**
     * The pipeline configuration in YAML format. The command accepts the pipeline configuration as a string or within a .yaml file. If you provide the configuration as a string, each new line must be escaped with \n.
     */
    PipelineConfigurationBody: PipelineConfigurationBody;
    /**
     * Key-value pairs to configure log publishing.
     */
    LogPublishingOptions?: LogPublishingOptions;
    /**
     * Container for the values required to configure VPC access for the pipeline. If you don't specify these values, OpenSearch Ingestion creates the pipeline with a public endpoint.
     */
    VpcOptions?: VpcOptions;
    /**
     * List of tags to add to the pipeline upon creation.
     */
    Tags?: TagList;
  }
  export interface CreatePipelineResponse {
    /**
     * Container for information about the created pipeline.
     */
    Pipeline?: Pipeline;
  }
  export interface DeletePipelineRequest {
    /**
     * The name of the pipeline to delete.
     */
    PipelineName: PipelineName;
  }
  export interface DeletePipelineResponse {
  }
  export interface GetPipelineBlueprintRequest {
    /**
     * The name of the blueprint to retrieve.
     */
    BlueprintName: String;
  }
  export interface GetPipelineBlueprintResponse {
    /**
     * The requested blueprint in YAML format.
     */
    Blueprint?: PipelineBlueprint;
  }
  export interface GetPipelineChangeProgressRequest {
    /**
     * The name of the pipeline.
     */
    PipelineName: PipelineName;
  }
  export interface GetPipelineChangeProgressResponse {
    /**
     * The current status of the change happening on the pipeline.
     */
    ChangeProgressStatuses?: ChangeProgressStatusList;
  }
  export interface GetPipelineRequest {
    /**
     * The name of the pipeline to get information about.
     */
    PipelineName: PipelineName;
  }
  export interface GetPipelineResponse {
    /**
     * Detailed information about the requested pipeline.
     */
    Pipeline?: Pipeline;
  }
  export type IngestEndpointUrlsList = String[];
  export type Integer = number;
  export interface ListPipelineBlueprintsRequest {
  }
  export interface ListPipelineBlueprintsResponse {
    /**
     * A list of available blueprints for Data Prepper.
     */
    Blueprints?: PipelineBlueprintsSummaryList;
  }
  export interface ListPipelinesRequest {
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results.
     */
    MaxResults?: MaxResults;
    /**
     * If your initial ListPipelines operation returns a nextToken, you can include the returned nextToken in subsequent ListPipelines operations, which returns results in the next page.
     */
    NextToken?: NextToken;
  }
  export interface ListPipelinesResponse {
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    NextToken?: NextToken;
    /**
     * A list of all existing Data Prepper pipelines.
     */
    Pipelines?: PipelineSummaryList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the pipeline to retrieve tags for.
     */
    Arn: PipelineArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A list of tags associated with the given pipeline.
     */
    Tags?: TagList;
  }
  export type LogGroup = string;
  export interface LogPublishingOptions {
    /**
     * Whether logs should be published.
     */
    IsLoggingEnabled?: Boolean;
    /**
     * The destination for OpenSearch Ingestion logs sent to Amazon CloudWatch Logs. This parameter is required if IsLoggingEnabled is set to true.
     */
    CloudWatchLogDestination?: CloudWatchLogDestination;
  }
  export type MaxResults = number;
  export type NextToken = string;
  export interface Pipeline {
    /**
     * The name of the pipeline.
     */
    PipelineName?: String;
    /**
     * The Amazon Resource Name (ARN) of the pipeline.
     */
    PipelineArn?: String;
    /**
     * The minimum pipeline capacity, in Ingestion Compute Units (ICUs).
     */
    MinUnits?: Integer;
    /**
     * The maximum pipeline capacity, in Ingestion Compute Units (ICUs).
     */
    MaxUnits?: Integer;
    /**
     * The current status of the pipeline.
     */
    Status?: PipelineStatus;
    /**
     * The reason for the current status of the pipeline.
     */
    StatusReason?: PipelineStatusReason;
    /**
     * The Data Prepper pipeline configuration in YAML format.
     */
    PipelineConfigurationBody?: String;
    /**
     * The date and time when the pipeline was created.
     */
    CreatedAt?: Timestamp;
    /**
     * The date and time when the pipeline was last updated.
     */
    LastUpdatedAt?: Timestamp;
    /**
     * The ingestion endpoints for the pipeline, which you can send data to.
     */
    IngestEndpointUrls?: IngestEndpointUrlsList;
    /**
     * Key-value pairs that represent log publishing settings.
     */
    LogPublishingOptions?: LogPublishingOptions;
    /**
     * The VPC interface endpoints that have access to the pipeline.
     */
    VpcEndpoints?: VpcEndpointsList;
  }
  export type PipelineArn = string;
  export interface PipelineBlueprint {
    /**
     * The name of the blueprint.
     */
    BlueprintName?: String;
    /**
     * The YAML configuration of the blueprint.
     */
    PipelineConfigurationBody?: String;
  }
  export interface PipelineBlueprintSummary {
    /**
     * The name of the blueprint.
     */
    BlueprintName?: String;
  }
  export type PipelineBlueprintsSummaryList = PipelineBlueprintSummary[];
  export type PipelineConfigurationBody = string;
  export type PipelineName = string;
  export type PipelineStatus = "CREATING"|"ACTIVE"|"UPDATING"|"DELETING"|"CREATE_FAILED"|"UPDATE_FAILED"|"STARTING"|"START_FAILED"|"STOPPING"|"STOPPED"|string;
  export interface PipelineStatusReason {
    /**
     * A description of why a pipeline has a certain status.
     */
    Description?: String;
  }
  export interface PipelineSummary {
    /**
     * The current status of the pipeline.
     */
    Status?: PipelineStatus;
    StatusReason?: PipelineStatusReason;
    /**
     * The name of the pipeline.
     */
    PipelineName?: PipelineName;
    /**
     * The Amazon Resource Name (ARN) of the pipeline.
     */
    PipelineArn?: PipelineArn;
    /**
     * The minimum pipeline capacity, in Ingestion Compute Units (ICUs).
     */
    MinUnits?: PipelineUnits;
    /**
     * The maximum pipeline capacity, in Ingestion Compute Units (ICUs).
     */
    MaxUnits?: PipelineUnits;
    /**
     * The date and time when the pipeline was created.
     */
    CreatedAt?: Timestamp;
    /**
     * The date and time when the pipeline was last updated.
     */
    LastUpdatedAt?: Timestamp;
  }
  export type PipelineSummaryList = PipelineSummary[];
  export type PipelineUnits = number;
  export type SecurityGroupId = string;
  export type SecurityGroupIds = SecurityGroupId[];
  export interface StartPipelineRequest {
    /**
     * The name of the pipeline to start.
     */
    PipelineName: PipelineName;
  }
  export interface StartPipelineResponse {
    Pipeline?: Pipeline;
  }
  export interface StopPipelineRequest {
    /**
     * The name of the pipeline to stop.
     */
    PipelineName: PipelineName;
  }
  export interface StopPipelineResponse {
    Pipeline?: Pipeline;
  }
  export type String = string;
  export type StringList = String[];
  export type SubnetId = string;
  export type SubnetIds = SubnetId[];
  export interface Tag {
    /**
     * The tag key. Tag keys must be unique for the pipeline to which they are attached.
     */
    Key: TagKey;
    /**
     * The value assigned to the corresponding tag key. Tag values can be null and don't have to be unique in a tag set. For example, you can have a key value pair in a tag set of project : Trinity and cost-center : Trinity 
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the pipeline to tag.
     */
    Arn: PipelineArn;
    /**
     * The list of key-value tags to add to the pipeline.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the pipeline to remove tags from.
     */
    Arn: PipelineArn;
    /**
     * The tag keys to remove.
     */
    TagKeys: StringList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdatePipelineRequest {
    /**
     * The name of the pipeline to update.
     */
    PipelineName: PipelineName;
    /**
     * The minimum pipeline capacity, in Ingestion Compute Units (ICUs).
     */
    MinUnits?: PipelineUnits;
    /**
     * The maximum pipeline capacity, in Ingestion Compute Units (ICUs)
     */
    MaxUnits?: PipelineUnits;
    /**
     * The pipeline configuration in YAML format. The command accepts the pipeline configuration as a string or within a .yaml file. If you provide the configuration as a string, each new line must be escaped with \n.
     */
    PipelineConfigurationBody?: PipelineConfigurationBody;
    /**
     * Key-value pairs to configure log publishing.
     */
    LogPublishingOptions?: LogPublishingOptions;
  }
  export interface UpdatePipelineResponse {
    /**
     * Container for information about the updated pipeline.
     */
    Pipeline?: Pipeline;
  }
  export interface ValidatePipelineRequest {
    /**
     * The pipeline configuration in YAML format. The command accepts the pipeline configuration as a string or within a .yaml file. If you provide the configuration as a string, each new line must be escaped with \n.
     */
    PipelineConfigurationBody: PipelineConfigurationBody;
  }
  export interface ValidatePipelineResponse {
    /**
     * A boolean indicating whether or not the pipeline configuration is valid.
     */
    isValid?: Boolean;
    /**
     * A list of errors if the configuration is invalid.
     */
    Errors?: ValidationMessageList;
  }
  export interface ValidationMessage {
    /**
     * The validation message.
     */
    Message?: String;
  }
  export type ValidationMessageList = ValidationMessage[];
  export interface VpcEndpoint {
    /**
     * The unique identifier of the endpoint.
     */
    VpcEndpointId?: String;
    /**
     * The ID for your VPC. Amazon Web Services PrivateLink generates this value when you create a VPC.
     */
    VpcId?: String;
    /**
     * Information about the VPC, including associated subnets and security groups.
     */
    VpcOptions?: VpcOptions;
  }
  export type VpcEndpointsList = VpcEndpoint[];
  export interface VpcOptions {
    /**
     * A list of subnet IDs associated with the VPC endpoint.
     */
    SubnetIds: SubnetIds;
    /**
     * A list of security groups associated with the VPC endpoint.
     */
    SecurityGroupIds?: SecurityGroupIds;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2022-01-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the OSIS client.
   */
  export import Types = OSIS;
}
export = OSIS;
