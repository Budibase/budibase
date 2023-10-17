import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class MigrationHubConfig extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: MigrationHubConfig.Types.ClientConfiguration)
  config: Config & MigrationHubConfig.Types.ClientConfiguration;
  /**
   * This API sets up the home region for the calling account only.
   */
  createHomeRegionControl(params: MigrationHubConfig.Types.CreateHomeRegionControlRequest, callback?: (err: AWSError, data: MigrationHubConfig.Types.CreateHomeRegionControlResult) => void): Request<MigrationHubConfig.Types.CreateHomeRegionControlResult, AWSError>;
  /**
   * This API sets up the home region for the calling account only.
   */
  createHomeRegionControl(callback?: (err: AWSError, data: MigrationHubConfig.Types.CreateHomeRegionControlResult) => void): Request<MigrationHubConfig.Types.CreateHomeRegionControlResult, AWSError>;
  /**
   * This API permits filtering on the ControlId and HomeRegion fields.
   */
  describeHomeRegionControls(params: MigrationHubConfig.Types.DescribeHomeRegionControlsRequest, callback?: (err: AWSError, data: MigrationHubConfig.Types.DescribeHomeRegionControlsResult) => void): Request<MigrationHubConfig.Types.DescribeHomeRegionControlsResult, AWSError>;
  /**
   * This API permits filtering on the ControlId and HomeRegion fields.
   */
  describeHomeRegionControls(callback?: (err: AWSError, data: MigrationHubConfig.Types.DescribeHomeRegionControlsResult) => void): Request<MigrationHubConfig.Types.DescribeHomeRegionControlsResult, AWSError>;
  /**
   * Returns the calling account’s home region, if configured. This API is used by other AWS services to determine the regional endpoint for calling AWS Application Discovery Service and Migration Hub. You must call GetHomeRegion at least once before you call any other AWS Application Discovery Service and AWS Migration Hub APIs, to obtain the account's Migration Hub home region.
   */
  getHomeRegion(params: MigrationHubConfig.Types.GetHomeRegionRequest, callback?: (err: AWSError, data: MigrationHubConfig.Types.GetHomeRegionResult) => void): Request<MigrationHubConfig.Types.GetHomeRegionResult, AWSError>;
  /**
   * Returns the calling account’s home region, if configured. This API is used by other AWS services to determine the regional endpoint for calling AWS Application Discovery Service and Migration Hub. You must call GetHomeRegion at least once before you call any other AWS Application Discovery Service and AWS Migration Hub APIs, to obtain the account's Migration Hub home region.
   */
  getHomeRegion(callback?: (err: AWSError, data: MigrationHubConfig.Types.GetHomeRegionResult) => void): Request<MigrationHubConfig.Types.GetHomeRegionResult, AWSError>;
}
declare namespace MigrationHubConfig {
  export type ControlId = string;
  export interface CreateHomeRegionControlRequest {
    /**
     * The name of the home region of the calling account.
     */
    HomeRegion: HomeRegion;
    /**
     * The account for which this command sets up a home region control. The Target is always of type ACCOUNT.
     */
    Target: Target;
    /**
     * Optional Boolean flag to indicate whether any effect should take place. It tests whether the caller has permission to make the call.
     */
    DryRun?: DryRun;
  }
  export interface CreateHomeRegionControlResult {
    /**
     * This object is the HomeRegionControl object that's returned by a successful call to CreateHomeRegionControl.
     */
    HomeRegionControl?: HomeRegionControl;
  }
  export type DescribeHomeRegionControlsMaxResults = number;
  export interface DescribeHomeRegionControlsRequest {
    /**
     * The ControlID is a unique identifier string of your HomeRegionControl object.
     */
    ControlId?: ControlId;
    /**
     * The name of the home region you'd like to view.
     */
    HomeRegion?: HomeRegion;
    /**
     * The target parameter specifies the identifier to which the home region is applied, which is always of type ACCOUNT. It applies the home region to the current ACCOUNT.
     */
    Target?: Target;
    /**
     * The maximum number of filtering results to display per page. 
     */
    MaxResults?: DescribeHomeRegionControlsMaxResults;
    /**
     * If a NextToken was returned by a previous call, more results are available. To retrieve the next page of results, make the call again using the returned token in NextToken.
     */
    NextToken?: Token;
  }
  export interface DescribeHomeRegionControlsResult {
    /**
     * An array that contains your HomeRegionControl objects.
     */
    HomeRegionControls?: HomeRegionControls;
    /**
     * If a NextToken was returned by a previous call, more results are available. To retrieve the next page of results, make the call again using the returned token in NextToken.
     */
    NextToken?: Token;
  }
  export type DryRun = boolean;
  export interface GetHomeRegionRequest {
  }
  export interface GetHomeRegionResult {
    /**
     * The name of the home region of the calling account.
     */
    HomeRegion?: HomeRegion;
  }
  export type HomeRegion = string;
  export interface HomeRegionControl {
    /**
     * A unique identifier that's generated for each home region control. It's always a string that begins with "hrc-" followed by 12 lowercase letters and numbers.
     */
    ControlId?: ControlId;
    /**
     * The AWS Region that's been set as home region. For example, "us-west-2" or "eu-central-1" are valid home regions.
     */
    HomeRegion?: HomeRegion;
    /**
     * The target parameter specifies the identifier to which the home region is applied, which is always an ACCOUNT. It applies the home region to the current ACCOUNT.
     */
    Target?: Target;
    /**
     * A timestamp representing the time when the customer called CreateHomeregionControl and set the home region for the account.
     */
    RequestedTime?: RequestedTime;
  }
  export type HomeRegionControls = HomeRegionControl[];
  export type RequestedTime = Date;
  export interface Target {
    /**
     * The target type is always an ACCOUNT.
     */
    Type: TargetType;
    /**
     * The TargetID is a 12-character identifier of the ACCOUNT for which the control was created. (This must be the current account.) 
     */
    Id?: TargetId;
  }
  export type TargetId = string;
  export type TargetType = "ACCOUNT"|string;
  export type Token = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-06-30"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the MigrationHubConfig client.
   */
  export import Types = MigrationHubConfig;
}
export = MigrationHubConfig;
