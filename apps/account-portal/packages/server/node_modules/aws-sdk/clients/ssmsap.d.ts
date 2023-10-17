import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class SsmSap extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: SsmSap.Types.ClientConfiguration)
  config: Config & SsmSap.Types.ClientConfiguration;
  /**
   * Removes permissions associated with the target database.
   */
  deleteResourcePermission(params: SsmSap.Types.DeleteResourcePermissionInput, callback?: (err: AWSError, data: SsmSap.Types.DeleteResourcePermissionOutput) => void): Request<SsmSap.Types.DeleteResourcePermissionOutput, AWSError>;
  /**
   * Removes permissions associated with the target database.
   */
  deleteResourcePermission(callback?: (err: AWSError, data: SsmSap.Types.DeleteResourcePermissionOutput) => void): Request<SsmSap.Types.DeleteResourcePermissionOutput, AWSError>;
  /**
   * Deregister an SAP application with AWS Systems Manager for SAP. This action does not aﬀect the existing setup of your SAP workloads on Amazon EC2.
   */
  deregisterApplication(params: SsmSap.Types.DeregisterApplicationInput, callback?: (err: AWSError, data: SsmSap.Types.DeregisterApplicationOutput) => void): Request<SsmSap.Types.DeregisterApplicationOutput, AWSError>;
  /**
   * Deregister an SAP application with AWS Systems Manager for SAP. This action does not aﬀect the existing setup of your SAP workloads on Amazon EC2.
   */
  deregisterApplication(callback?: (err: AWSError, data: SsmSap.Types.DeregisterApplicationOutput) => void): Request<SsmSap.Types.DeregisterApplicationOutput, AWSError>;
  /**
   * Gets an application registered with AWS Systems Manager for SAP. It also returns the components of the application.
   */
  getApplication(params: SsmSap.Types.GetApplicationInput, callback?: (err: AWSError, data: SsmSap.Types.GetApplicationOutput) => void): Request<SsmSap.Types.GetApplicationOutput, AWSError>;
  /**
   * Gets an application registered with AWS Systems Manager for SAP. It also returns the components of the application.
   */
  getApplication(callback?: (err: AWSError, data: SsmSap.Types.GetApplicationOutput) => void): Request<SsmSap.Types.GetApplicationOutput, AWSError>;
  /**
   * Gets the component of an application registered with AWS Systems Manager for SAP.
   */
  getComponent(params: SsmSap.Types.GetComponentInput, callback?: (err: AWSError, data: SsmSap.Types.GetComponentOutput) => void): Request<SsmSap.Types.GetComponentOutput, AWSError>;
  /**
   * Gets the component of an application registered with AWS Systems Manager for SAP.
   */
  getComponent(callback?: (err: AWSError, data: SsmSap.Types.GetComponentOutput) => void): Request<SsmSap.Types.GetComponentOutput, AWSError>;
  /**
   * Gets the SAP HANA database of an application registered with AWS Systems Manager for SAP.
   */
  getDatabase(params: SsmSap.Types.GetDatabaseInput, callback?: (err: AWSError, data: SsmSap.Types.GetDatabaseOutput) => void): Request<SsmSap.Types.GetDatabaseOutput, AWSError>;
  /**
   * Gets the SAP HANA database of an application registered with AWS Systems Manager for SAP.
   */
  getDatabase(callback?: (err: AWSError, data: SsmSap.Types.GetDatabaseOutput) => void): Request<SsmSap.Types.GetDatabaseOutput, AWSError>;
  /**
   * Gets the details of an operation by specifying the operation ID.
   */
  getOperation(params: SsmSap.Types.GetOperationInput, callback?: (err: AWSError, data: SsmSap.Types.GetOperationOutput) => void): Request<SsmSap.Types.GetOperationOutput, AWSError>;
  /**
   * Gets the details of an operation by specifying the operation ID.
   */
  getOperation(callback?: (err: AWSError, data: SsmSap.Types.GetOperationOutput) => void): Request<SsmSap.Types.GetOperationOutput, AWSError>;
  /**
   * Gets permissions associated with the target database.
   */
  getResourcePermission(params: SsmSap.Types.GetResourcePermissionInput, callback?: (err: AWSError, data: SsmSap.Types.GetResourcePermissionOutput) => void): Request<SsmSap.Types.GetResourcePermissionOutput, AWSError>;
  /**
   * Gets permissions associated with the target database.
   */
  getResourcePermission(callback?: (err: AWSError, data: SsmSap.Types.GetResourcePermissionOutput) => void): Request<SsmSap.Types.GetResourcePermissionOutput, AWSError>;
  /**
   * Lists all the applications registered with AWS Systems Manager for SAP.
   */
  listApplications(params: SsmSap.Types.ListApplicationsInput, callback?: (err: AWSError, data: SsmSap.Types.ListApplicationsOutput) => void): Request<SsmSap.Types.ListApplicationsOutput, AWSError>;
  /**
   * Lists all the applications registered with AWS Systems Manager for SAP.
   */
  listApplications(callback?: (err: AWSError, data: SsmSap.Types.ListApplicationsOutput) => void): Request<SsmSap.Types.ListApplicationsOutput, AWSError>;
  /**
   * Lists all the components registered with AWS Systems Manager for SAP.
   */
  listComponents(params: SsmSap.Types.ListComponentsInput, callback?: (err: AWSError, data: SsmSap.Types.ListComponentsOutput) => void): Request<SsmSap.Types.ListComponentsOutput, AWSError>;
  /**
   * Lists all the components registered with AWS Systems Manager for SAP.
   */
  listComponents(callback?: (err: AWSError, data: SsmSap.Types.ListComponentsOutput) => void): Request<SsmSap.Types.ListComponentsOutput, AWSError>;
  /**
   * Lists the SAP HANA databases of an application registered with AWS Systems Manager for SAP.
   */
  listDatabases(params: SsmSap.Types.ListDatabasesInput, callback?: (err: AWSError, data: SsmSap.Types.ListDatabasesOutput) => void): Request<SsmSap.Types.ListDatabasesOutput, AWSError>;
  /**
   * Lists the SAP HANA databases of an application registered with AWS Systems Manager for SAP.
   */
  listDatabases(callback?: (err: AWSError, data: SsmSap.Types.ListDatabasesOutput) => void): Request<SsmSap.Types.ListDatabasesOutput, AWSError>;
  /**
   * Lists the operations performed by AWS Systems Manager for SAP.
   */
  listOperations(params: SsmSap.Types.ListOperationsInput, callback?: (err: AWSError, data: SsmSap.Types.ListOperationsOutput) => void): Request<SsmSap.Types.ListOperationsOutput, AWSError>;
  /**
   * Lists the operations performed by AWS Systems Manager for SAP.
   */
  listOperations(callback?: (err: AWSError, data: SsmSap.Types.ListOperationsOutput) => void): Request<SsmSap.Types.ListOperationsOutput, AWSError>;
  /**
   * Lists all tags on an SAP HANA application and/or database registered with AWS Systems Manager for SAP.
   */
  listTagsForResource(params: SsmSap.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: SsmSap.Types.ListTagsForResourceResponse) => void): Request<SsmSap.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all tags on an SAP HANA application and/or database registered with AWS Systems Manager for SAP.
   */
  listTagsForResource(callback?: (err: AWSError, data: SsmSap.Types.ListTagsForResourceResponse) => void): Request<SsmSap.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Adds permissions to the target database.
   */
  putResourcePermission(params: SsmSap.Types.PutResourcePermissionInput, callback?: (err: AWSError, data: SsmSap.Types.PutResourcePermissionOutput) => void): Request<SsmSap.Types.PutResourcePermissionOutput, AWSError>;
  /**
   * Adds permissions to the target database.
   */
  putResourcePermission(callback?: (err: AWSError, data: SsmSap.Types.PutResourcePermissionOutput) => void): Request<SsmSap.Types.PutResourcePermissionOutput, AWSError>;
  /**
   * Register an SAP application with AWS Systems Manager for SAP. You must meet the following requirements before registering.  The SAP application you want to register with AWS Systems Manager for SAP is running on Amazon EC2. AWS Systems Manager Agent must be setup on an Amazon EC2 instance along with the required IAM permissions. Amazon EC2 instance(s) must have access to the secrets created in AWS Secrets Manager to manage SAP applications and components.
   */
  registerApplication(params: SsmSap.Types.RegisterApplicationInput, callback?: (err: AWSError, data: SsmSap.Types.RegisterApplicationOutput) => void): Request<SsmSap.Types.RegisterApplicationOutput, AWSError>;
  /**
   * Register an SAP application with AWS Systems Manager for SAP. You must meet the following requirements before registering.  The SAP application you want to register with AWS Systems Manager for SAP is running on Amazon EC2. AWS Systems Manager Agent must be setup on an Amazon EC2 instance along with the required IAM permissions. Amazon EC2 instance(s) must have access to the secrets created in AWS Secrets Manager to manage SAP applications and components.
   */
  registerApplication(callback?: (err: AWSError, data: SsmSap.Types.RegisterApplicationOutput) => void): Request<SsmSap.Types.RegisterApplicationOutput, AWSError>;
  /**
   * Refreshes a registered application.
   */
  startApplicationRefresh(params: SsmSap.Types.StartApplicationRefreshInput, callback?: (err: AWSError, data: SsmSap.Types.StartApplicationRefreshOutput) => void): Request<SsmSap.Types.StartApplicationRefreshOutput, AWSError>;
  /**
   * Refreshes a registered application.
   */
  startApplicationRefresh(callback?: (err: AWSError, data: SsmSap.Types.StartApplicationRefreshOutput) => void): Request<SsmSap.Types.StartApplicationRefreshOutput, AWSError>;
  /**
   * Creates tag for a resource by specifying the ARN.
   */
  tagResource(params: SsmSap.Types.TagResourceRequest, callback?: (err: AWSError, data: SsmSap.Types.TagResourceResponse) => void): Request<SsmSap.Types.TagResourceResponse, AWSError>;
  /**
   * Creates tag for a resource by specifying the ARN.
   */
  tagResource(callback?: (err: AWSError, data: SsmSap.Types.TagResourceResponse) => void): Request<SsmSap.Types.TagResourceResponse, AWSError>;
  /**
   * Delete the tags for a resource.
   */
  untagResource(params: SsmSap.Types.UntagResourceRequest, callback?: (err: AWSError, data: SsmSap.Types.UntagResourceResponse) => void): Request<SsmSap.Types.UntagResourceResponse, AWSError>;
  /**
   * Delete the tags for a resource.
   */
  untagResource(callback?: (err: AWSError, data: SsmSap.Types.UntagResourceResponse) => void): Request<SsmSap.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the settings of an application registered with AWS Systems Manager for SAP.
   */
  updateApplicationSettings(params: SsmSap.Types.UpdateApplicationSettingsInput, callback?: (err: AWSError, data: SsmSap.Types.UpdateApplicationSettingsOutput) => void): Request<SsmSap.Types.UpdateApplicationSettingsOutput, AWSError>;
  /**
   * Updates the settings of an application registered with AWS Systems Manager for SAP.
   */
  updateApplicationSettings(callback?: (err: AWSError, data: SsmSap.Types.UpdateApplicationSettingsOutput) => void): Request<SsmSap.Types.UpdateApplicationSettingsOutput, AWSError>;
}
declare namespace SsmSap {
  export type AppRegistryArn = string;
  export interface Application {
    /**
     * The ID of the application.
     */
    Id?: ApplicationId;
    /**
     * The type of the application.
     */
    Type?: ApplicationType;
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    Arn?: SsmSapArn;
    /**
     * The Amazon Resource Name (ARN) of the Application Registry.
     */
    AppRegistryArn?: AppRegistryArn;
    /**
     * The status of the application.
     */
    Status?: ApplicationStatus;
    /**
     * The latest discovery result for the application.
     */
    DiscoveryStatus?: ApplicationDiscoveryStatus;
    /**
     * The components of the application.
     */
    Components?: ComponentIdList;
    /**
     * The time at which the application was last updated.
     */
    LastUpdated?: Timestamp;
    /**
     * The status message.
     */
    StatusMessage?: String;
  }
  export interface ApplicationCredential {
    /**
     * The name of the SAP HANA database.
     */
    DatabaseName: DatabaseName;
    /**
     * The type of the application credentials. 
     */
    CredentialType: CredentialType;
    /**
     * The secret ID created in AWS Secrets Manager to store the credentials of the SAP application. 
     */
    SecretId: SecretId;
  }
  export type ApplicationCredentialList = ApplicationCredential[];
  export type ApplicationDiscoveryStatus = "SUCCESS"|"REGISTRATION_FAILED"|"REFRESH_FAILED"|"REGISTERING"|"DELETING"|string;
  export type ApplicationId = string;
  export type ApplicationStatus = "ACTIVATED"|"STARTING"|"STOPPED"|"STOPPING"|"FAILED"|"REGISTERING"|"DELETING"|"UNKNOWN"|string;
  export interface ApplicationSummary {
    /**
     * The ID of the application.
     */
    Id?: ApplicationId;
    /**
     * The type of the application.
     */
    Type?: ApplicationType;
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    Arn?: SsmSapArn;
    /**
     * The tags on the application.
     */
    Tags?: TagMap;
  }
  export type ApplicationSummaryList = ApplicationSummary[];
  export type ApplicationType = "HANA"|string;
  export type Arn = string;
  export interface AssociatedHost {
    /**
     * The name of the host.
     */
    Hostname?: String;
    /**
     * The ID of the Amazon EC2 instance.
     */
    Ec2InstanceId?: String;
    /**
     * The version of the operating system.
     */
    OsVersion?: String;
  }
  export interface BackintConfig {
    /**
     * AWS service for your database backup.
     */
    BackintMode: BackintMode;
    /**
     * 
     */
    EnsureNoBackupInProcess: Boolean;
  }
  export type BackintMode = "AWSBackup"|string;
  export type Boolean = boolean;
  export type ClusterStatus = "ONLINE"|"STANDBY"|"MAINTENANCE"|"OFFLINE"|"NONE"|string;
  export interface Component {
    /**
     * The ID of the component.
     */
    ComponentId?: ComponentId;
    /**
     * The parent component of a highly available environment. For example, in a highly available SAP on AWS workload, the parent component consists of the entire setup, including the child components.
     */
    ParentComponent?: ComponentId;
    /**
     * The child components of a highly available environment. For example, in a highly available SAP on AWS workload, the child component consists of the primary and secondar instances.
     */
    ChildComponents?: ComponentIdList;
    /**
     * The ID of the application.
     */
    ApplicationId?: ApplicationId;
    /**
     * The type of the component.
     */
    ComponentType?: ComponentType;
    /**
     * The status of the component.
     */
    Status?: ComponentStatus;
    /**
     * The hostname of the component.
     */
    SapHostname?: String;
    /**
     * The kernel version of the component.
     */
    SapKernelVersion?: String;
    /**
     * The SAP HANA version of the component.
     */
    HdbVersion?: String;
    /**
     * Details of the SAP HANA system replication for the component.
     */
    Resilience?: Resilience;
    /**
     * The associated host of the component.
     */
    AssociatedHost?: AssociatedHost;
    /**
     * The SAP HANA databases of the component.
     */
    Databases?: DatabaseIdList;
    /**
     * The hosts of the component.
     */
    Hosts?: HostList;
    /**
     * The primary host of the component.
     */
    PrimaryHost?: String;
    /**
     * The time at which the component was last updated.
     */
    LastUpdated?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the component.
     */
    Arn?: SsmSapArn;
  }
  export type ComponentId = string;
  export type ComponentIdList = ComponentId[];
  export type ComponentStatus = "ACTIVATED"|"STARTING"|"STOPPED"|"STOPPING"|"RUNNING"|"RUNNING_WITH_ERROR"|"UNDEFINED"|string;
  export interface ComponentSummary {
    /**
     * The ID of the application.
     */
    ApplicationId?: ApplicationId;
    /**
     * The ID of the component.
     */
    ComponentId?: ComponentId;
    /**
     * The type of the component.
     */
    ComponentType?: ComponentType;
    /**
     * The tags of the component.
     */
    Tags?: TagMap;
    /**
     * The Amazon Resource Name (ARN) of the component summary.
     */
    Arn?: SsmSapArn;
  }
  export type ComponentSummaryList = ComponentSummary[];
  export type ComponentType = "HANA"|"HANA_NODE"|string;
  export type CredentialType = "ADMIN"|string;
  export interface Database {
    /**
     * The ID of the application.
     */
    ApplicationId?: ApplicationId;
    /**
     * The ID of the component.
     */
    ComponentId?: ComponentId;
    /**
     * The credentials of the database.
     */
    Credentials?: ApplicationCredentialList;
    /**
     * The ID of the SAP HANA database.
     */
    DatabaseId?: DatabaseId;
    /**
     * The name of the database.
     */
    DatabaseName?: String;
    /**
     * The type of the database.
     */
    DatabaseType?: DatabaseType;
    /**
     * The Amazon Resource Name (ARN) of the database.
     */
    Arn?: SsmSapArn;
    /**
     * The status of the database.
     */
    Status?: DatabaseStatus;
    /**
     * The primary host of the database.
     */
    PrimaryHost?: String;
    /**
     * The SQL port of the database.
     */
    SQLPort?: Integer;
    /**
     * The time at which the database was last updated.
     */
    LastUpdated?: Timestamp;
  }
  export type DatabaseId = string;
  export type DatabaseIdList = DatabaseId[];
  export type DatabaseName = string;
  export type DatabaseStatus = "RUNNING"|"STARTING"|"STOPPED"|"WARNING"|"UNKNOWN"|"ERROR"|string;
  export interface DatabaseSummary {
    /**
     * The ID of the application.
     */
    ApplicationId?: ApplicationId;
    /**
     * The ID of the component.
     */
    ComponentId?: ComponentId;
    /**
     * The ID of the database.
     */
    DatabaseId?: DatabaseId;
    /**
     * The type of the database.
     */
    DatabaseType?: DatabaseType;
    /**
     * The Amazon Resource Name (ARN) of the database.
     */
    Arn?: SsmSapArn;
    /**
     * The tags of the database.
     */
    Tags?: TagMap;
  }
  export type DatabaseSummaryList = DatabaseSummary[];
  export type DatabaseType = "SYSTEM"|"TENANT"|string;
  export interface DeleteResourcePermissionInput {
    /**
     * Delete or restore the permissions on the target database.
     */
    ActionType?: PermissionActionType;
    /**
     * The Amazon Resource Name (ARN) of the source resource.
     */
    SourceResourceArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: Arn;
  }
  export interface DeleteResourcePermissionOutput {
    /**
     * The policy that removes permissions on the target database.
     */
    Policy?: String;
  }
  export interface DeregisterApplicationInput {
    /**
     * The ID of the application.
     */
    ApplicationId: ApplicationId;
  }
  export interface DeregisterApplicationOutput {
  }
  export interface Filter {
    /**
     * The name of the filter. Filter names are case-sensitive. 
     */
    Name: FilterName;
    /**
     * The filter values. Filter values are case-sensitive. If you specify multiple values for a filter, the values are joined with an OR, and the request returns all results that match any of the specified values
     */
    Value: FilterValue;
    /**
     * The operator for the filter. 
     */
    Operator: FilterOperator;
  }
  export type FilterList = Filter[];
  export type FilterName = string;
  export type FilterOperator = "Equals"|"GreaterThanOrEquals"|"LessThanOrEquals"|string;
  export type FilterValue = string;
  export interface GetApplicationInput {
    /**
     * The ID of the application.
     */
    ApplicationId?: ApplicationId;
    /**
     * The Amazon Resource Name (ARN) of the application. 
     */
    ApplicationArn?: SsmSapArn;
    /**
     * The Amazon Resource Name (ARN) of the application registry.
     */
    AppRegistryArn?: AppRegistryArn;
  }
  export interface GetApplicationOutput {
    /**
     * Returns all of the metadata of an application registered with AWS Systems Manager for SAP.
     */
    Application?: Application;
    /**
     * The tags of a registered application.
     */
    Tags?: TagMap;
  }
  export interface GetComponentInput {
    /**
     * The ID of the application.
     */
    ApplicationId: ApplicationId;
    /**
     * The ID of the component.
     */
    ComponentId: ComponentId;
  }
  export interface GetComponentOutput {
    /**
     * The component of an application registered with AWS Systems Manager for SAP.
     */
    Component?: Component;
    /**
     * The tags of a component.
     */
    Tags?: TagMap;
  }
  export interface GetDatabaseInput {
    /**
     * The ID of the application.
     */
    ApplicationId?: ApplicationId;
    /**
     * The ID of the component.
     */
    ComponentId?: ComponentId;
    /**
     * The ID of the database.
     */
    DatabaseId?: DatabaseId;
    /**
     * The Amazon Resource Name (ARN) of the database.
     */
    DatabaseArn?: SsmSapArn;
  }
  export interface GetDatabaseOutput {
    /**
     * The SAP HANA database of an application registered with AWS Systems Manager for SAP.
     */
    Database?: Database;
    /**
     * The tags of a database.
     */
    Tags?: TagMap;
  }
  export interface GetOperationInput {
    /**
     * The ID of the operation.
     */
    OperationId: OperationId;
  }
  export interface GetOperationOutput {
    /**
     * Returns the details of an operation.
     */
    Operation?: Operation;
  }
  export interface GetResourcePermissionInput {
    /**
     * 
     */
    ActionType?: PermissionActionType;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: Arn;
  }
  export interface GetResourcePermissionOutput {
    /**
     * 
     */
    Policy?: String;
  }
  export interface Host {
    /**
     * The name of the Dedicated Host.
     */
    HostName?: String;
    /**
     * The IP address of the Dedicated Host. 
     */
    HostIp?: String;
    /**
     * The ID of Amazon EC2 instance.
     */
    EC2InstanceId?: String;
    /**
     * The instance ID of the instance on the Dedicated Host.
     */
    InstanceId?: String;
    /**
     * The role of the Dedicated Host.
     */
    HostRole?: HostRole;
    /**
     * The version of the operating system.
     */
    OsVersion?: String;
  }
  export type HostList = Host[];
  export type HostRole = "LEADER"|"WORKER"|"STANDBY"|"UNKNOWN"|string;
  export type InstanceId = string;
  export type InstanceList = InstanceId[];
  export type Integer = number;
  export interface ListApplicationsInput {
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value. 
     */
    MaxResults?: MaxResults;
  }
  export interface ListApplicationsOutput {
    /**
     * The applications registered with AWS Systems Manager for SAP.
     */
    Applications?: ApplicationSummaryList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    NextToken?: NextToken;
  }
  export interface ListComponentsInput {
    /**
     * The ID of the application.
     */
    ApplicationId?: ApplicationId;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value. If you do not specify a value for MaxResults, the request returns 50 items per page by default.
     */
    MaxResults?: MaxResults;
  }
  export interface ListComponentsOutput {
    /**
     * List of components registered with AWS System Manager for SAP.
     */
    Components?: ComponentSummaryList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    NextToken?: NextToken;
  }
  export interface ListDatabasesInput {
    /**
     * The ID of the application.
     */
    ApplicationId?: ApplicationId;
    /**
     * The ID of the component.
     */
    ComponentId?: ComponentId;
    /**
     * The token for the next page of results. 
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value. If you do not specify a value for MaxResults, the request returns 50 items per page by default.
     */
    MaxResults?: MaxResults;
  }
  export interface ListDatabasesOutput {
    /**
     * The SAP HANA databases of an application.
     */
    Databases?: DatabaseSummaryList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    NextToken?: NextToken;
  }
  export interface ListOperationsInput {
    /**
     * The ID of the application.
     */
    ApplicationId: ApplicationId;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value. If you do not specify a value for MaxResults, the request returns 50 items per page by default.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results. 
     */
    NextToken?: NextToken;
    /**
     * The filters of an operation.
     */
    Filters?: FilterList;
  }
  export interface ListOperationsOutput {
    /**
     * List of operations performed by AWS Systems Manager for SAP.
     */
    Operations?: OperationList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: SsmSapArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * 
     */
    tags?: TagMap;
  }
  export type MaxResults = number;
  export type NextToken = string;
  export interface Operation {
    /**
     * The ID of the operation.
     */
    Id?: OperationId;
    /**
     * The type of the operation.
     */
    Type?: OperationType;
    /**
     * The status of the operation.
     */
    Status?: OperationStatus;
    /**
     * The status message of the operation.
     */
    StatusMessage?: String;
    /**
     * The properties of the operation.
     */
    Properties?: OperationProperties;
    /**
     * The resource type of the operation.
     */
    ResourceType?: ResourceType;
    /**
     * The resource ID of the operation.
     */
    ResourceId?: ResourceId;
    /**
     * The Amazon Resource Name (ARN) of the operation.
     */
    ResourceArn?: Arn;
    /**
     * The start time of the operation.
     */
    StartTime?: Timestamp;
    /**
     * The end time of the operation.
     */
    EndTime?: Timestamp;
    /**
     * The time at which the operation was last updated.
     */
    LastUpdatedTime?: Timestamp;
  }
  export type OperationId = string;
  export type OperationIdList = OperationId[];
  export type OperationList = Operation[];
  export type OperationMode = "PRIMARY"|"LOGREPLAY"|"DELTA_DATASHIPPING"|"LOGREPLAY_READACCESS"|"NONE"|string;
  export type OperationProperties = {[key: string]: String};
  export type OperationStatus = "INPROGRESS"|"SUCCESS"|"ERROR"|string;
  export type OperationType = string;
  export type PermissionActionType = "RESTORE"|string;
  export interface PutResourcePermissionInput {
    /**
     * 
     */
    ActionType: PermissionActionType;
    /**
     * 
     */
    SourceResourceArn: Arn;
    /**
     * 
     */
    ResourceArn: Arn;
  }
  export interface PutResourcePermissionOutput {
    /**
     * 
     */
    Policy?: String;
  }
  export interface RegisterApplicationInput {
    /**
     * The ID of the application.
     */
    ApplicationId: ApplicationId;
    /**
     * The type of the application.
     */
    ApplicationType: ApplicationType;
    /**
     * The Amazon EC2 instances on which your SAP application is running.
     */
    Instances: InstanceList;
    /**
     * The SAP instance number of the application.
     */
    SapInstanceNumber?: SAPInstanceNumber;
    /**
     * The System ID of the application.
     */
    Sid?: SID;
    /**
     * The tags to be attached to the SAP application.
     */
    Tags?: TagMap;
    /**
     * The credentials of the SAP application.
     */
    Credentials: ApplicationCredentialList;
  }
  export interface RegisterApplicationOutput {
    /**
     * The application registered with AWS Systems Manager for SAP.
     */
    Application?: Application;
    /**
     * The ID of the operation.
     */
    OperationId?: OperationId;
  }
  export type ReplicationMode = "PRIMARY"|"NONE"|"SYNC"|"SYNCMEM"|"ASYNC"|string;
  export interface Resilience {
    /**
     * The tier of the component.
     */
    HsrTier?: String;
    /**
     * The replication mode of the component.
     */
    HsrReplicationMode?: ReplicationMode;
    /**
     * The operation mode of the component.
     */
    HsrOperationMode?: OperationMode;
    /**
     * The cluster status of the component.
     */
    ClusterStatus?: ClusterStatus;
  }
  export type ResourceId = string;
  export type ResourceType = string;
  export type SAPInstanceNumber = string;
  export type SID = string;
  export type SecretId = string;
  export type SsmSapArn = string;
  export interface StartApplicationRefreshInput {
    /**
     * The ID of the application.
     */
    ApplicationId: ApplicationId;
  }
  export interface StartApplicationRefreshOutput {
    /**
     * The ID of the operation.
     */
    OperationId?: OperationId;
  }
  export type String = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: SsmSapArn;
    /**
     * The tags on a resource.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: SsmSapArn;
    /**
     * Adds/updates or removes credentials for applications registered with AWS Systems Manager for SAP.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateApplicationSettingsInput {
    /**
     * The ID of the application.
     */
    ApplicationId: ApplicationId;
    /**
     * The credentials to be added or updated.
     */
    CredentialsToAddOrUpdate?: ApplicationCredentialList;
    /**
     * The credentials to be removed.
     */
    CredentialsToRemove?: ApplicationCredentialList;
    /**
     * Installation of AWS Backint Agent for SAP HANA.
     */
    Backint?: BackintConfig;
  }
  export interface UpdateApplicationSettingsOutput {
    /**
     * The update message.
     */
    Message?: String;
    /**
     * The IDs of the operations.
     */
    OperationIds?: OperationIdList;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-05-10"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the SsmSap client.
   */
  export import Types = SsmSap;
}
export = SsmSap;
