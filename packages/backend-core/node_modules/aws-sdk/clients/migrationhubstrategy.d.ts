import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class MigrationHubStrategy extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: MigrationHubStrategy.Types.ClientConfiguration)
  config: Config & MigrationHubStrategy.Types.ClientConfiguration;
  /**
   *  Retrieves details about an application component. 
   */
  getApplicationComponentDetails(params: MigrationHubStrategy.Types.GetApplicationComponentDetailsRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.GetApplicationComponentDetailsResponse) => void): Request<MigrationHubStrategy.Types.GetApplicationComponentDetailsResponse, AWSError>;
  /**
   *  Retrieves details about an application component. 
   */
  getApplicationComponentDetails(callback?: (err: AWSError, data: MigrationHubStrategy.Types.GetApplicationComponentDetailsResponse) => void): Request<MigrationHubStrategy.Types.GetApplicationComponentDetailsResponse, AWSError>;
  /**
   *  Retrieves a list of all the recommended strategies and tools for an application component running on a server. 
   */
  getApplicationComponentStrategies(params: MigrationHubStrategy.Types.GetApplicationComponentStrategiesRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.GetApplicationComponentStrategiesResponse) => void): Request<MigrationHubStrategy.Types.GetApplicationComponentStrategiesResponse, AWSError>;
  /**
   *  Retrieves a list of all the recommended strategies and tools for an application component running on a server. 
   */
  getApplicationComponentStrategies(callback?: (err: AWSError, data: MigrationHubStrategy.Types.GetApplicationComponentStrategiesResponse) => void): Request<MigrationHubStrategy.Types.GetApplicationComponentStrategiesResponse, AWSError>;
  /**
   *  Retrieves the status of an on-going assessment. 
   */
  getAssessment(params: MigrationHubStrategy.Types.GetAssessmentRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.GetAssessmentResponse) => void): Request<MigrationHubStrategy.Types.GetAssessmentResponse, AWSError>;
  /**
   *  Retrieves the status of an on-going assessment. 
   */
  getAssessment(callback?: (err: AWSError, data: MigrationHubStrategy.Types.GetAssessmentResponse) => void): Request<MigrationHubStrategy.Types.GetAssessmentResponse, AWSError>;
  /**
   *  Retrieves the details about a specific import task. 
   */
  getImportFileTask(params: MigrationHubStrategy.Types.GetImportFileTaskRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.GetImportFileTaskResponse) => void): Request<MigrationHubStrategy.Types.GetImportFileTaskResponse, AWSError>;
  /**
   *  Retrieves the details about a specific import task. 
   */
  getImportFileTask(callback?: (err: AWSError, data: MigrationHubStrategy.Types.GetImportFileTaskResponse) => void): Request<MigrationHubStrategy.Types.GetImportFileTaskResponse, AWSError>;
  /**
   *  Retrieves your migration and modernization preferences. 
   */
  getPortfolioPreferences(params: MigrationHubStrategy.Types.GetPortfolioPreferencesRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.GetPortfolioPreferencesResponse) => void): Request<MigrationHubStrategy.Types.GetPortfolioPreferencesResponse, AWSError>;
  /**
   *  Retrieves your migration and modernization preferences. 
   */
  getPortfolioPreferences(callback?: (err: AWSError, data: MigrationHubStrategy.Types.GetPortfolioPreferencesResponse) => void): Request<MigrationHubStrategy.Types.GetPortfolioPreferencesResponse, AWSError>;
  /**
   *  Retrieves overall summary including the number of servers to rehost and the overall number of anti-patterns. 
   */
  getPortfolioSummary(params: MigrationHubStrategy.Types.GetPortfolioSummaryRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.GetPortfolioSummaryResponse) => void): Request<MigrationHubStrategy.Types.GetPortfolioSummaryResponse, AWSError>;
  /**
   *  Retrieves overall summary including the number of servers to rehost and the overall number of anti-patterns. 
   */
  getPortfolioSummary(callback?: (err: AWSError, data: MigrationHubStrategy.Types.GetPortfolioSummaryResponse) => void): Request<MigrationHubStrategy.Types.GetPortfolioSummaryResponse, AWSError>;
  /**
   *  Retrieves detailed information about the specified recommendation report. 
   */
  getRecommendationReportDetails(params: MigrationHubStrategy.Types.GetRecommendationReportDetailsRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.GetRecommendationReportDetailsResponse) => void): Request<MigrationHubStrategy.Types.GetRecommendationReportDetailsResponse, AWSError>;
  /**
   *  Retrieves detailed information about the specified recommendation report. 
   */
  getRecommendationReportDetails(callback?: (err: AWSError, data: MigrationHubStrategy.Types.GetRecommendationReportDetailsResponse) => void): Request<MigrationHubStrategy.Types.GetRecommendationReportDetailsResponse, AWSError>;
  /**
   *  Retrieves detailed information about a specified server. 
   */
  getServerDetails(params: MigrationHubStrategy.Types.GetServerDetailsRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.GetServerDetailsResponse) => void): Request<MigrationHubStrategy.Types.GetServerDetailsResponse, AWSError>;
  /**
   *  Retrieves detailed information about a specified server. 
   */
  getServerDetails(callback?: (err: AWSError, data: MigrationHubStrategy.Types.GetServerDetailsResponse) => void): Request<MigrationHubStrategy.Types.GetServerDetailsResponse, AWSError>;
  /**
   *  Retrieves recommended strategies and tools for the specified server. 
   */
  getServerStrategies(params: MigrationHubStrategy.Types.GetServerStrategiesRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.GetServerStrategiesResponse) => void): Request<MigrationHubStrategy.Types.GetServerStrategiesResponse, AWSError>;
  /**
   *  Retrieves recommended strategies and tools for the specified server. 
   */
  getServerStrategies(callback?: (err: AWSError, data: MigrationHubStrategy.Types.GetServerStrategiesResponse) => void): Request<MigrationHubStrategy.Types.GetServerStrategiesResponse, AWSError>;
  /**
   *  Retrieves a list of all the application components (processes). 
   */
  listApplicationComponents(params: MigrationHubStrategy.Types.ListApplicationComponentsRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.ListApplicationComponentsResponse) => void): Request<MigrationHubStrategy.Types.ListApplicationComponentsResponse, AWSError>;
  /**
   *  Retrieves a list of all the application components (processes). 
   */
  listApplicationComponents(callback?: (err: AWSError, data: MigrationHubStrategy.Types.ListApplicationComponentsResponse) => void): Request<MigrationHubStrategy.Types.ListApplicationComponentsResponse, AWSError>;
  /**
   *  Retrieves a list of all the installed collectors. 
   */
  listCollectors(params: MigrationHubStrategy.Types.ListCollectorsRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.ListCollectorsResponse) => void): Request<MigrationHubStrategy.Types.ListCollectorsResponse, AWSError>;
  /**
   *  Retrieves a list of all the installed collectors. 
   */
  listCollectors(callback?: (err: AWSError, data: MigrationHubStrategy.Types.ListCollectorsResponse) => void): Request<MigrationHubStrategy.Types.ListCollectorsResponse, AWSError>;
  /**
   *  Retrieves a list of all the imports performed. 
   */
  listImportFileTask(params: MigrationHubStrategy.Types.ListImportFileTaskRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.ListImportFileTaskResponse) => void): Request<MigrationHubStrategy.Types.ListImportFileTaskResponse, AWSError>;
  /**
   *  Retrieves a list of all the imports performed. 
   */
  listImportFileTask(callback?: (err: AWSError, data: MigrationHubStrategy.Types.ListImportFileTaskResponse) => void): Request<MigrationHubStrategy.Types.ListImportFileTaskResponse, AWSError>;
  /**
   *  Returns a list of all the servers. 
   */
  listServers(params: MigrationHubStrategy.Types.ListServersRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.ListServersResponse) => void): Request<MigrationHubStrategy.Types.ListServersResponse, AWSError>;
  /**
   *  Returns a list of all the servers. 
   */
  listServers(callback?: (err: AWSError, data: MigrationHubStrategy.Types.ListServersResponse) => void): Request<MigrationHubStrategy.Types.ListServersResponse, AWSError>;
  /**
   *  Saves the specified migration and modernization preferences. 
   */
  putPortfolioPreferences(params: MigrationHubStrategy.Types.PutPortfolioPreferencesRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.PutPortfolioPreferencesResponse) => void): Request<MigrationHubStrategy.Types.PutPortfolioPreferencesResponse, AWSError>;
  /**
   *  Saves the specified migration and modernization preferences. 
   */
  putPortfolioPreferences(callback?: (err: AWSError, data: MigrationHubStrategy.Types.PutPortfolioPreferencesResponse) => void): Request<MigrationHubStrategy.Types.PutPortfolioPreferencesResponse, AWSError>;
  /**
   *  Starts the assessment of an on-premises environment. 
   */
  startAssessment(params: MigrationHubStrategy.Types.StartAssessmentRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.StartAssessmentResponse) => void): Request<MigrationHubStrategy.Types.StartAssessmentResponse, AWSError>;
  /**
   *  Starts the assessment of an on-premises environment. 
   */
  startAssessment(callback?: (err: AWSError, data: MigrationHubStrategy.Types.StartAssessmentResponse) => void): Request<MigrationHubStrategy.Types.StartAssessmentResponse, AWSError>;
  /**
   *  Starts a file import. 
   */
  startImportFileTask(params: MigrationHubStrategy.Types.StartImportFileTaskRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.StartImportFileTaskResponse) => void): Request<MigrationHubStrategy.Types.StartImportFileTaskResponse, AWSError>;
  /**
   *  Starts a file import. 
   */
  startImportFileTask(callback?: (err: AWSError, data: MigrationHubStrategy.Types.StartImportFileTaskResponse) => void): Request<MigrationHubStrategy.Types.StartImportFileTaskResponse, AWSError>;
  /**
   *  Starts generating a recommendation report. 
   */
  startRecommendationReportGeneration(params: MigrationHubStrategy.Types.StartRecommendationReportGenerationRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.StartRecommendationReportGenerationResponse) => void): Request<MigrationHubStrategy.Types.StartRecommendationReportGenerationResponse, AWSError>;
  /**
   *  Starts generating a recommendation report. 
   */
  startRecommendationReportGeneration(callback?: (err: AWSError, data: MigrationHubStrategy.Types.StartRecommendationReportGenerationResponse) => void): Request<MigrationHubStrategy.Types.StartRecommendationReportGenerationResponse, AWSError>;
  /**
   *  Stops the assessment of an on-premises environment. 
   */
  stopAssessment(params: MigrationHubStrategy.Types.StopAssessmentRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.StopAssessmentResponse) => void): Request<MigrationHubStrategy.Types.StopAssessmentResponse, AWSError>;
  /**
   *  Stops the assessment of an on-premises environment. 
   */
  stopAssessment(callback?: (err: AWSError, data: MigrationHubStrategy.Types.StopAssessmentResponse) => void): Request<MigrationHubStrategy.Types.StopAssessmentResponse, AWSError>;
  /**
   *  Updates the configuration of an application component. 
   */
  updateApplicationComponentConfig(params: MigrationHubStrategy.Types.UpdateApplicationComponentConfigRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.UpdateApplicationComponentConfigResponse) => void): Request<MigrationHubStrategy.Types.UpdateApplicationComponentConfigResponse, AWSError>;
  /**
   *  Updates the configuration of an application component. 
   */
  updateApplicationComponentConfig(callback?: (err: AWSError, data: MigrationHubStrategy.Types.UpdateApplicationComponentConfigResponse) => void): Request<MigrationHubStrategy.Types.UpdateApplicationComponentConfigResponse, AWSError>;
  /**
   *  Updates the configuration of the specified server. 
   */
  updateServerConfig(params: MigrationHubStrategy.Types.UpdateServerConfigRequest, callback?: (err: AWSError, data: MigrationHubStrategy.Types.UpdateServerConfigResponse) => void): Request<MigrationHubStrategy.Types.UpdateServerConfigResponse, AWSError>;
  /**
   *  Updates the configuration of the specified server. 
   */
  updateServerConfig(callback?: (err: AWSError, data: MigrationHubStrategy.Types.UpdateServerConfigResponse) => void): Request<MigrationHubStrategy.Types.UpdateServerConfigResponse, AWSError>;
}
declare namespace MigrationHubStrategy {
  export type AntipatternReportStatus = "FAILED"|"IN_PROGRESS"|"SUCCESS"|string;
  export interface AntipatternSeveritySummary {
    /**
     *  Contains the count of anti-patterns. 
     */
    count?: Integer;
    /**
     *  Contains the severity of anti-patterns. 
     */
    severity?: Severity;
  }
  export type AppType = "DotNetFramework"|"Java"|"SQLServer"|"IIS"|"Oracle"|"Other"|string;
  export type ApplicationComponentCriteria = "NOT_DEFINED"|"APP_NAME"|"SERVER_ID"|"APP_TYPE"|"STRATEGY"|"DESTINATION"|string;
  export interface ApplicationComponentDetail {
    /**
     *  The status of analysis, if the application component has source code or an associated database. 
     */
    analysisStatus?: SrcCodeOrDbAnalysisStatus;
    /**
     *  The S3 bucket name and the Amazon S3 key name for the anti-pattern report. 
     */
    antipatternReportS3Object?: S3Object;
    /**
     *  The status of the anti-pattern report generation.
     */
    antipatternReportStatus?: AntipatternReportStatus;
    /**
     *  The status message for the anti-pattern. 
     */
    antipatternReportStatusMessage?: StatusMessage;
    /**
     *  The type of application component. 
     */
    appType?: AppType;
    /**
     *  The ID of the server that the application component is running on. 
     */
    associatedServerId?: ServerId;
    /**
     *  Configuration details for the database associated with the application component. 
     */
    databaseConfigDetail?: DatabaseConfigDetail;
    /**
     *  The ID of the application component. 
     */
    id?: ResourceId;
    /**
     *  Indicates whether the application component has been included for server recommendation or not. 
     */
    inclusionStatus?: InclusionStatus;
    /**
     *  The timestamp of when the application component was assessed. 
     */
    lastAnalyzedTimestamp?: TimeStamp;
    /**
     *  A list of anti-pattern severity summaries. 
     */
    listAntipatternSeveritySummary?: ListAntipatternSeveritySummary;
    /**
     *  Set to true if the application component is running on multiple servers.
     */
    moreServerAssociationExists?: Boolean;
    /**
     *  The name of application component. 
     */
    name?: ResourceName;
    /**
     *  OS driver. 
     */
    osDriver?: String;
    /**
     *  OS version. 
     */
    osVersion?: String;
    /**
     *  The top recommendation set for the application component. 
     */
    recommendationSet?: RecommendationSet;
    /**
     *  The application component subtype.
     */
    resourceSubType?: ResourceSubType;
    /**
     *  Details about the source code repository associated with the application component. 
     */
    sourceCodeRepositories?: SourceCodeRepositories;
    /**
     *  A detailed description of the analysis status and any failure message. 
     */
    statusMessage?: StatusMessage;
  }
  export type ApplicationComponentDetails = ApplicationComponentDetail[];
  export type ApplicationComponentId = string;
  export type ApplicationComponentStrategies = ApplicationComponentStrategy[];
  export interface ApplicationComponentStrategy {
    /**
     *  Set to true if the recommendation is set as preferred. 
     */
    isPreferred?: Boolean;
    /**
     *  Strategy recommendation for the application component. 
     */
    recommendation?: RecommendationSet;
    /**
     *  The recommendation status of a strategy for an application component. 
     */
    status?: StrategyRecommendation;
  }
  export interface ApplicationComponentSummary {
    /**
     *  Contains the name of application types. 
     */
    appType?: AppType;
    /**
     *  Contains the count of application type. 
     */
    count?: Integer;
  }
  export interface ApplicationPreferences {
    /**
     *  Application preferences that you specify to prefer managed environment. 
     */
    managementPreference?: ManagementPreference;
  }
  export type AssessmentStatus = "IN_PROGRESS"|"COMPLETE"|"FAILED"|"STOPPED"|string;
  export interface AssessmentSummary {
    /**
     *  The Amazon S3 object containing the anti-pattern report. 
     */
    antipatternReportS3Object?: S3Object;
    /**
     *  The status of the anti-pattern report. 
     */
    antipatternReportStatus?: AntipatternReportStatus;
    /**
     *  The status message of the anti-pattern report. 
     */
    antipatternReportStatusMessage?: StatusMessage;
    /**
     *  The time the assessment was performed. 
     */
    lastAnalyzedTimestamp?: TimeStamp;
    /**
     *  List of AntipatternSeveritySummary. 
     */
    listAntipatternSeveritySummary?: ListAntipatternSeveritySummary;
    /**
     *  List of ApplicationComponentStrategySummary. 
     */
    listApplicationComponentStrategySummary?: ListStrategySummary;
    /**
     *  List of ApplicationComponentSummary. 
     */
    listApplicationComponentSummary?: ListApplicationComponentSummary;
    /**
     *  List of ServerStrategySummary. 
     */
    listServerStrategySummary?: ListStrategySummary;
    /**
     *  List of ServerSummary. 
     */
    listServerSummary?: ListServerSummary;
  }
  export interface AssociatedApplication {
    /**
     *  ID of the application as defined in Application Discovery Service. 
     */
    id?: String;
    /**
     *  Name of the application as defined in Application Discovery Service. 
     */
    name?: String;
  }
  export type AssociatedApplications = AssociatedApplication[];
  export type AssociatedServerIDs = String[];
  export type AsyncTaskId = string;
  export interface AwsManagedResources {
    /**
     *  The choice of application destination that you specify. 
     */
    targetDestination: AwsManagedTargetDestinations;
  }
  export type AwsManagedTargetDestination = "None specified"|"AWS Elastic BeanStalk"|"AWS Fargate"|string;
  export type AwsManagedTargetDestinations = AwsManagedTargetDestination[];
  export type Boolean = boolean;
  export interface BusinessGoals {
    /**
     *  Business goal to reduce license costs. 
     */
    licenseCostReduction?: BusinessGoalsInteger;
    /**
     *  Business goal to modernize infrastructure by moving to cloud native technologies. 
     */
    modernizeInfrastructureWithCloudNativeTechnologies?: BusinessGoalsInteger;
    /**
     *  Business goal to reduce the operational overhead on the team by moving into managed services. 
     */
    reduceOperationalOverheadWithManagedServices?: BusinessGoalsInteger;
    /**
     *  Business goal to achieve migration at a fast pace. 
     */
    speedOfMigration?: BusinessGoalsInteger;
  }
  export type BusinessGoalsInteger = number;
  export interface Collector {
    /**
     *  Indicates the health of a collector. 
     */
    collectorHealth?: CollectorHealth;
    /**
     *  The ID of the collector. 
     */
    collectorId?: String;
    /**
     *  Current version of the collector that is running in the environment that you specify. 
     */
    collectorVersion?: String;
    /**
     *  Hostname of the server that is hosting the collector. 
     */
    hostName?: String;
    /**
     *  IP address of the server that is hosting the collector. 
     */
    ipAddress?: String;
    /**
     *  Time when the collector last pinged the service. 
     */
    lastActivityTimeStamp?: String;
    /**
     *  Time when the collector registered with the service. 
     */
    registeredTimeStamp?: String;
  }
  export type CollectorHealth = "COLLECTOR_HEALTHY"|"COLLECTOR_UNHEALTHY"|string;
  export type Collectors = Collector[];
  export interface DataCollectionDetails {
    /**
     *  The time the assessment completes. 
     */
    completionTime?: TimeStamp;
    /**
     *  The number of failed servers in the assessment. 
     */
    failed?: Integer;
    /**
     *  The number of servers with the assessment status IN_PROGESS. 
     */
    inProgress?: Integer;
    /**
     *  The total number of servers in the assessment. 
     */
    servers?: Integer;
    /**
     *  The start time of assessment. 
     */
    startTime?: TimeStamp;
    /**
     *  The status of the assessment. 
     */
    status?: AssessmentStatus;
    /**
     *  The number of successful servers in the assessment. 
     */
    success?: Integer;
  }
  export type DataSourceType = "ApplicationDiscoveryService"|"MPA"|string;
  export interface DatabaseConfigDetail {
    /**
     *  AWS Secrets Manager key that holds the credentials that you use to connect to a database. 
     */
    secretName?: String;
  }
  export type DatabaseManagementPreference = "AWS-managed"|"Self-manage"|"No preference"|string;
  export interface DatabaseMigrationPreference {
    /**
     *  Indicates whether you are interested in moving from one type of database to another. For example, from SQL Server to Amazon Aurora MySQL-Compatible Edition. 
     */
    heterogeneous?: Heterogeneous;
    /**
     *  Indicates whether you are interested in moving to the same type of database into AWS. For example, from SQL Server in your environment to SQL Server on AWS. 
     */
    homogeneous?: Homogeneous;
    /**
     *  Indicated that you do not prefer heterogeneous or homogeneous. 
     */
    noPreference?: NoDatabaseMigrationPreference;
  }
  export interface DatabasePreferences {
    /**
     *  Specifies whether you're interested in self-managed databases or databases managed by AWS. 
     */
    databaseManagementPreference?: DatabaseManagementPreference;
    /**
     *  Specifies your preferred migration path. 
     */
    databaseMigrationPreference?: DatabaseMigrationPreference;
  }
  export interface GetApplicationComponentDetailsRequest {
    /**
     *  The ID of the application component. The ID is unique within an AWS account.
     */
    applicationComponentId: ApplicationComponentId;
  }
  export interface GetApplicationComponentDetailsResponse {
    /**
     *  Detailed information about an application component. 
     */
    applicationComponentDetail?: ApplicationComponentDetail;
    /**
     *  The associated application group as defined in AWS Application Discovery Service. 
     */
    associatedApplications?: AssociatedApplications;
    /**
     *  A list of the IDs of the servers on which the application component is running. 
     */
    associatedServerIds?: AssociatedServerIDs;
    /**
     *  Set to true if the application component belongs to more than one application group. 
     */
    moreApplicationResource?: Boolean;
  }
  export interface GetApplicationComponentStrategiesRequest {
    /**
     *  The ID of the application component. The ID is unique within an AWS account.
     */
    applicationComponentId: ApplicationComponentId;
  }
  export interface GetApplicationComponentStrategiesResponse {
    /**
     *  A list of application component strategy recommendations. 
     */
    applicationComponentStrategies?: ApplicationComponentStrategies;
  }
  export interface GetAssessmentRequest {
    /**
     *  The assessmentid returned by StartAssessment.
     */
    id: AsyncTaskId;
  }
  export interface GetAssessmentResponse {
    /**
     *  Detailed information about the assessment. 
     */
    dataCollectionDetails?: DataCollectionDetails;
    /**
     *  The ID for the specific assessment task. 
     */
    id?: AsyncTaskId;
  }
  export interface GetImportFileTaskRequest {
    /**
     *  The ID of the import file task. This ID is returned in the response of StartImportFileTask. 
     */
    id: String;
  }
  export interface GetImportFileTaskResponse {
    /**
     *  The time that the import task completed. 
     */
    completionTime?: TimeStamp;
    /**
     *  The import file task id returned in the response of StartImportFileTask. 
     */
    id?: String;
    /**
     *  The name of the import task given in StartImportFileTask. 
     */
    importName?: String;
    /**
     *  The S3 bucket where import file is located. 
     */
    inputS3Bucket?: importS3Bucket;
    /**
     *  The Amazon S3 key name of the import file. 
     */
    inputS3Key?: importS3Key;
    /**
     *  The number of records that failed to be imported. 
     */
    numberOfRecordsFailed?: Integer;
    /**
     *  The number of records successfully imported. 
     */
    numberOfRecordsSuccess?: Integer;
    /**
     *  Start time of the import task. 
     */
    startTime?: TimeStamp;
    /**
     *  Status of import file task. 
     */
    status?: ImportFileTaskStatus;
    /**
     *  The S3 bucket name for status report of import task. 
     */
    statusReportS3Bucket?: importS3Bucket;
    /**
     *  The Amazon S3 key name for status report of import task. The report contains details about whether each record imported successfully or why it did not.
     */
    statusReportS3Key?: importS3Key;
  }
  export interface GetPortfolioPreferencesRequest {
  }
  export interface GetPortfolioPreferencesResponse {
    /**
     *  The transformation preferences for non-database applications. 
     */
    applicationPreferences?: ApplicationPreferences;
    /**
     *  The transformation preferences for database applications. 
     */
    databasePreferences?: DatabasePreferences;
    /**
     *  The rank of business goals based on priority. 
     */
    prioritizeBusinessGoals?: PrioritizeBusinessGoals;
  }
  export interface GetPortfolioSummaryRequest {
  }
  export interface GetPortfolioSummaryResponse {
    /**
     *  An assessment summary for the portfolio including the number of servers to rehost and the overall number of anti-patterns. 
     */
    assessmentSummary?: AssessmentSummary;
  }
  export interface GetRecommendationReportDetailsRequest {
    /**
     *  The recommendation report generation task id returned by StartRecommendationReportGeneration. 
     */
    id: RecommendationTaskId;
  }
  export interface GetRecommendationReportDetailsResponse {
    /**
     *  The ID of the recommendation report generation task. See the response of StartRecommendationReportGeneration. 
     */
    id?: RecommendationTaskId;
    /**
     *  Detailed information about the recommendation report. 
     */
    recommendationReportDetails?: RecommendationReportDetails;
  }
  export interface GetServerDetailsRequest {
    /**
     *  The maximum number of items to include in the response. The maximum value is 100. 
     */
    maxResults?: MaxResult;
    /**
     *  The token from a previous call that you use to retrieve the next set of results. For example, if a previous call to this action returned 100 items, but you set maxResults to 10. You'll receive a set of 10 results along with a token. You then use the returned token to retrieve the next set of 10. 
     */
    nextToken?: NextToken;
    /**
     *  The ID of the server. 
     */
    serverId: ServerId;
  }
  export interface GetServerDetailsResponse {
    /**
     *  The associated application group the server belongs to, as defined in AWS Application Discovery Service. 
     */
    associatedApplications?: AssociatedApplications;
    /**
     *  The token you use to retrieve the next set of results, or null if there are no more results. 
     */
    nextToken?: String;
    /**
     *  Detailed information about the server. 
     */
    serverDetail?: ServerDetail;
  }
  export interface GetServerStrategiesRequest {
    /**
     *  The ID of the server. 
     */
    serverId: ServerId;
  }
  export interface GetServerStrategiesResponse {
    /**
     *  A list of strategy recommendations for the server. 
     */
    serverStrategies?: ServerStrategies;
  }
  export interface Group {
    /**
     *  The key of the specific import group. 
     */
    name?: GroupName;
    /**
     *  The value of the specific import group. 
     */
    value?: String;
  }
  export type GroupIds = Group[];
  export type GroupName = "ExternalId"|string;
  export interface Heterogeneous {
    /**
     *  The target database engine for heterogeneous database migration preference. 
     */
    targetDatabaseEngine: HeterogeneousTargetDatabaseEngines;
  }
  export type HeterogeneousTargetDatabaseEngine = "None specified"|"Amazon Aurora"|"AWS PostgreSQL"|"MySQL"|"Microsoft SQL Server"|"Oracle Database"|"MariaDB"|"SAP"|"Db2 LUW"|"MongoDB"|string;
  export type HeterogeneousTargetDatabaseEngines = HeterogeneousTargetDatabaseEngine[];
  export interface Homogeneous {
    /**
     *  The target database engine for homogeneous database migration preferences. 
     */
    targetDatabaseEngine?: HomogeneousTargetDatabaseEngines;
  }
  export type HomogeneousTargetDatabaseEngine = "None specified"|string;
  export type HomogeneousTargetDatabaseEngines = HomogeneousTargetDatabaseEngine[];
  export type IPAddress = string;
  export interface ImportFileTaskInformation {
    /**
     *  The time that the import task completes. 
     */
    completionTime?: TimeStamp;
    /**
     *  The ID of the import file task. 
     */
    id?: String;
    /**
     *  The name of the import task given in StartImportFileTask. 
     */
    importName?: String;
    /**
     *  The S3 bucket where the import file is located. 
     */
    inputS3Bucket?: importS3Bucket;
    /**
     *  The Amazon S3 key name of the import file. 
     */
    inputS3Key?: importS3Key;
    /**
     *  The number of records that failed to be imported. 
     */
    numberOfRecordsFailed?: Integer;
    /**
     *  The number of records successfully imported. 
     */
    numberOfRecordsSuccess?: Integer;
    /**
     *  Start time of the import task. 
     */
    startTime?: TimeStamp;
    /**
     *  Status of import file task. 
     */
    status?: ImportFileTaskStatus;
    /**
     *  The S3 bucket name for status report of import task. 
     */
    statusReportS3Bucket?: importS3Bucket;
    /**
     *  The Amazon S3 key name for status report of import task. The report contains details about whether each record imported successfully or why it did not. 
     */
    statusReportS3Key?: importS3Key;
  }
  export type ImportFileTaskStatus = "ImportInProgress"|"ImportFailed"|"ImportPartialSuccess"|"ImportSuccess"|"DeleteInProgress"|"DeleteFailed"|"DeletePartialSuccess"|"DeleteSuccess"|string;
  export type InclusionStatus = "excludeFromAssessment"|"includeInAssessment"|string;
  export type Integer = number;
  export type InterfaceName = string;
  export type ListAntipatternSeveritySummary = AntipatternSeveritySummary[];
  export type ListApplicationComponentSummary = ApplicationComponentSummary[];
  export interface ListApplicationComponentsRequest {
    /**
     *  Criteria for filtering the list of application components. 
     */
    applicationComponentCriteria?: ApplicationComponentCriteria;
    /**
     *  Specify the value based on the application component criteria type. For example, if applicationComponentCriteria is set to SERVER_ID and filterValue is set to server1, then ListApplicationComponents returns all the application components running on server1. 
     */
    filterValue?: ListApplicationComponentsRequestFilterValueString;
    /**
     *  The group ID specified in to filter on. 
     */
    groupIdFilter?: GroupIds;
    /**
     *  The maximum number of items to include in the response. The maximum value is 100. 
     */
    maxResults?: MaxResult;
    /**
     *  The token from a previous call that you use to retrieve the next set of results. For example, if a previous call to this action returned 100 items, but you set maxResults to 10. You'll receive a set of 10 results along with a token. You then use the returned token to retrieve the next set of 10. 
     */
    nextToken?: NextToken;
    /**
     *  Specifies whether to sort by ascending (ASC) or descending (DESC) order. 
     */
    sort?: SortOrder;
  }
  export type ListApplicationComponentsRequestFilterValueString = string;
  export interface ListApplicationComponentsResponse {
    /**
     *  The list of application components with detailed information about each component. 
     */
    applicationComponentInfos?: ApplicationComponentDetails;
    /**
     *  The token you use to retrieve the next set of results, or null if there are no more results. 
     */
    nextToken?: NextToken;
  }
  export interface ListCollectorsRequest {
    /**
     *  The maximum number of items to include in the response. The maximum value is 100. 
     */
    maxResults?: MaxResult;
    /**
     *  The token from a previous call that you use to retrieve the next set of results. For example, if a previous call to this action returned 100 items, but you set maxResults to 10. You'll receive a set of 10 results along with a token. You then use the returned token to retrieve the next set of 10. 
     */
    nextToken?: NextToken;
  }
  export interface ListCollectorsResponse {
    /**
     *  The list of all the installed collectors. 
     */
    Collectors?: Collectors;
    /**
     *  The token you use to retrieve the next set of results, or null if there are no more results. 
     */
    nextToken?: NextToken;
  }
  export type ListImportFileTaskInformation = ImportFileTaskInformation[];
  export interface ListImportFileTaskRequest {
    /**
     *  The total number of items to return. The maximum value is 100. 
     */
    maxResults?: Integer;
    /**
     *  The token from a previous call that you use to retrieve the next set of results. For example, if a previous call to this action returned 100 items, but you set maxResults to 10. You'll receive a set of 10 results along with a token. You then use the returned token to retrieve the next set of 10. 
     */
    nextToken?: String;
  }
  export interface ListImportFileTaskResponse {
    /**
     *  The token you use to retrieve the next set of results, or null if there are no more results. 
     */
    nextToken?: String;
    /**
     *  Lists information about the files you import.
     */
    taskInfos?: ListImportFileTaskInformation;
  }
  export type ListServerSummary = ServerSummary[];
  export interface ListServersRequest {
    /**
     *  Specifies the filter value, which is based on the type of server criteria. For example, if serverCriteria is OS_NAME, and the filterValue is equal to WindowsServer, then ListServers returns all of the servers matching the OS name WindowsServer. 
     */
    filterValue?: String;
    /**
     *  Specifies the group ID to filter on. 
     */
    groupIdFilter?: GroupIds;
    /**
     *  The maximum number of items to include in the response. The maximum value is 100. 
     */
    maxResults?: MaxResult;
    /**
     *  The token from a previous call that you use to retrieve the next set of results. For example, if a previous call to this action returned 100 items, but you set maxResults to 10. You'll receive a set of 10 results along with a token. You then use the returned token to retrieve the next set of 10. 
     */
    nextToken?: NextToken;
    /**
     *  Criteria for filtering servers. 
     */
    serverCriteria?: ServerCriteria;
    /**
     *  Specifies whether to sort by ascending (ASC) or descending (DESC) order. 
     */
    sort?: SortOrder;
  }
  export interface ListServersResponse {
    /**
     *  The token you use to retrieve the next set of results, or null if there are no more results. 
     */
    nextToken?: NextToken;
    /**
     *  The list of servers with detailed information about each server. 
     */
    serverInfos?: ServerDetails;
  }
  export type ListStrategySummary = StrategySummary[];
  export type Location = string;
  export type MacAddress = string;
  export interface ManagementPreference {
    /**
     *  Indicates interest in solutions that are managed by AWS. 
     */
    awsManagedResources?: AwsManagedResources;
    /**
     *  No specific preference. 
     */
    noPreference?: NoManagementPreference;
    /**
     *  Indicates interest in managing your own resources on AWS. 
     */
    selfManageResources?: SelfManageResources;
  }
  export type MaxResult = number;
  export type NetMask = string;
  export interface NetworkInfo {
    /**
     *  Information about the name of the interface of the server for which the assessment was run. 
     */
    interfaceName: InterfaceName;
    /**
     *  Information about the IP address of the server for which the assessment was run. 
     */
    ipAddress: IPAddress;
    /**
     *  Information about the MAC address of the server for which the assessment was run. 
     */
    macAddress: MacAddress;
    /**
     *  Information about the subnet mask of the server for which the assessment was run. 
     */
    netMask: NetMask;
  }
  export type NetworkInfoList = NetworkInfo[];
  export type NextToken = string;
  export interface NoDatabaseMigrationPreference {
    /**
     *  The target database engine for database migration preference that you specify. 
     */
    targetDatabaseEngine: TargetDatabaseEngines;
  }
  export interface NoManagementPreference {
    /**
     *  The choice of application destination that you specify. 
     */
    targetDestination: NoPreferenceTargetDestinations;
  }
  export type NoPreferenceTargetDestination = "None specified"|"AWS Elastic BeanStalk"|"AWS Fargate"|"Amazon Elastic Cloud Compute (EC2)"|"Amazon Elastic Container Service (ECS)"|"Amazon Elastic Kubernetes Service (EKS)"|string;
  export type NoPreferenceTargetDestinations = NoPreferenceTargetDestination[];
  export interface OSInfo {
    /**
     *  Information about the type of operating system. 
     */
    type?: OSType;
    /**
     *  Information about the version of operating system. 
     */
    version?: OSVersion;
  }
  export type OSType = "LINUX"|"WINDOWS"|string;
  export type OSVersion = string;
  export type OutputFormat = "Excel"|"Json"|string;
  export interface PrioritizeBusinessGoals {
    /**
     *  Rank of business goals based on priority. 
     */
    businessGoals?: BusinessGoals;
  }
  export interface PutPortfolioPreferencesRequest {
    /**
     *  The transformation preferences for non-database applications. 
     */
    applicationPreferences?: ApplicationPreferences;
    /**
     *  The transformation preferences for database applications. 
     */
    databasePreferences?: DatabasePreferences;
    /**
     *  The rank of the business goals based on priority. 
     */
    prioritizeBusinessGoals?: PrioritizeBusinessGoals;
  }
  export interface PutPortfolioPreferencesResponse {
  }
  export interface RecommendationReportDetails {
    /**
     *  The time that the recommendation report generation task completes. 
     */
    completionTime?: RecommendationReportTimeStamp;
    /**
     *  The S3 bucket where the report file is located. 
     */
    s3Bucket?: String;
    /**
     *  The Amazon S3 key name of the report file. 
     */
    s3Keys?: S3Keys;
    /**
     *  The time that the recommendation report generation task starts. 
     */
    startTime?: RecommendationReportTimeStamp;
    /**
     *  The status of the recommendation report generation task. 
     */
    status?: RecommendationReportStatus;
    /**
     *  The status message for recommendation report generation. 
     */
    statusMessage?: RecommendationReportStatusMessage;
  }
  export type RecommendationReportStatus = "FAILED"|"IN_PROGRESS"|"SUCCESS"|string;
  export type RecommendationReportStatusMessage = string;
  export type RecommendationReportTimeStamp = Date;
  export interface RecommendationSet {
    /**
     *  The recommended strategy. 
     */
    strategy?: Strategy;
    /**
     *  The recommended target destination. 
     */
    targetDestination?: TargetDestination;
    /**
     *  The target destination for the recommendation set. 
     */
    transformationTool?: TransformationTool;
  }
  export type RecommendationTaskId = string;
  export type ResourceId = string;
  export type ResourceName = string;
  export type ResourceSubType = "Database"|"Process"|"DatabaseProcess"|string;
  export type RunTimeAssessmentStatus = "dataCollectionTaskToBeScheduled"|"dataCollectionTaskScheduled"|"dataCollectionTaskStarted"|"dataCollectionTaskStopped"|"dataCollectionTaskSuccess"|"dataCollectionTaskFailed"|"dataCollectionTaskPartialSuccess"|string;
  export type S3Bucket = string;
  export type S3Key = string;
  export type S3Keys = String[];
  export interface S3Object {
    /**
     *  The S3 bucket name. 
     */
    s3Bucket?: S3Bucket;
    /**
     *  The Amazon S3 key name. 
     */
    s3key?: S3Key;
  }
  export type SecretsManagerKey = string;
  export interface SelfManageResources {
    /**
     *  Self-managed resources target destination. 
     */
    targetDestination: SelfManageTargetDestinations;
  }
  export type SelfManageTargetDestination = "None specified"|"Amazon Elastic Cloud Compute (EC2)"|"Amazon Elastic Container Service (ECS)"|"Amazon Elastic Kubernetes Service (EKS)"|string;
  export type SelfManageTargetDestinations = SelfManageTargetDestination[];
  export type ServerCriteria = "NOT_DEFINED"|"OS_NAME"|"STRATEGY"|"DESTINATION"|"SERVER_ID"|string;
  export interface ServerDetail {
    /**
     *  The S3 bucket name and Amazon S3 key name for anti-pattern report. 
     */
    antipatternReportS3Object?: S3Object;
    /**
     *  The status of the anti-pattern report generation. 
     */
    antipatternReportStatus?: AntipatternReportStatus;
    /**
     *  A message about the status of the anti-pattern report generation. 
     */
    antipatternReportStatusMessage?: StatusMessage;
    /**
     *  A list of strategy summaries. 
     */
    applicationComponentStrategySummary?: ListStrategySummary;
    /**
     *  The status of assessment for the server. 
     */
    dataCollectionStatus?: RunTimeAssessmentStatus;
    /**
     *  The server ID. 
     */
    id?: ResourceId;
    /**
     *  The timestamp of when the server was assessed. 
     */
    lastAnalyzedTimestamp?: TimeStamp;
    /**
     *  A list of anti-pattern severity summaries. 
     */
    listAntipatternSeveritySummary?: ListAntipatternSeveritySummary;
    /**
     *  The name of the server. 
     */
    name?: ResourceName;
    /**
     *  A set of recommendations. 
     */
    recommendationSet?: RecommendationSet;
    /**
     *  The type of server. 
     */
    serverType?: String;
    /**
     *  A message about the status of data collection, which contains detailed descriptions of any error messages. 
     */
    statusMessage?: StatusMessage;
    /**
     *  System information about the server. 
     */
    systemInfo?: SystemInfo;
  }
  export type ServerDetails = ServerDetail[];
  export type ServerId = string;
  export type ServerOsType = "WindowsServer"|"AmazonLinux"|"EndOfSupportWindowsServer"|"Redhat"|"Other"|string;
  export type ServerStrategies = ServerStrategy[];
  export interface ServerStrategy {
    /**
     *  Set to true if the recommendation is set as preferred. 
     */
    isPreferred?: Boolean;
    /**
     *  The number of application components with this strategy recommendation running on the server. 
     */
    numberOfApplicationComponents?: Integer;
    /**
     *  Strategy recommendation for the server. 
     */
    recommendation?: RecommendationSet;
    /**
     *  The recommendation status of the strategy for the server. 
     */
    status?: StrategyRecommendation;
  }
  export interface ServerSummary {
    /**
     *  Type of operating system for the servers. 
     */
    ServerOsType?: ServerOsType;
    /**
     *  Number of servers. 
     */
    count?: Integer;
  }
  export type Severity = "HIGH"|"MEDIUM"|"LOW"|string;
  export type SortOrder = "ASC"|"DESC"|string;
  export interface SourceCode {
    /**
     *  The repository name for the source code. 
     */
    location?: Location;
    /**
     *  The branch of the source code. 
     */
    sourceVersion?: SourceVersion;
    /**
     *  The type of repository to use for the source code. 
     */
    versionControl?: VersionControl;
  }
  export type SourceCodeList = SourceCode[];
  export type SourceCodeRepositories = SourceCodeRepository[];
  export interface SourceCodeRepository {
    /**
     *  The branch of the source code. 
     */
    branch?: String;
    /**
     *  The repository name for the source code. 
     */
    repository?: String;
    /**
     *  The type of repository to use for the source code. 
     */
    versionControlType?: String;
  }
  export type SourceVersion = string;
  export type SrcCodeOrDbAnalysisStatus = "ANALYSIS_TO_BE_SCHEDULED"|"ANALYSIS_STARTED"|"ANALYSIS_SUCCESS"|"ANALYSIS_FAILED"|string;
  export interface StartAssessmentRequest {
    /**
     *  The S3 bucket used by the collectors to send analysis data to the service. The bucket name must begin with migrationhub-strategy-. 
     */
    s3bucketForAnalysisData?: StartAssessmentRequestS3bucketForAnalysisDataString;
    /**
     *  The S3 bucket where all the reports generated by the service are stored. The bucket name must begin with migrationhub-strategy-. 
     */
    s3bucketForReportData?: StartAssessmentRequestS3bucketForReportDataString;
  }
  export type StartAssessmentRequestS3bucketForAnalysisDataString = string;
  export type StartAssessmentRequestS3bucketForReportDataString = string;
  export interface StartAssessmentResponse {
    /**
     *  The ID of the assessment. 
     */
    assessmentId?: AsyncTaskId;
  }
  export interface StartImportFileTaskRequest {
    /**
     *  The S3 bucket where the import file is located. The bucket name is required to begin with migrationhub-strategy-.
     */
    S3Bucket: importS3Bucket;
    /**
     * Specifies the source that the servers are coming from. By default, Strategy Recommendations assumes that the servers specified in the import file are available in AWS Application Discovery Service. 
     */
    dataSourceType?: DataSourceType;
    /**
     * Groups the resources in the import file together with a unique name. This ID can be as filter in ListApplicationComponents and ListServers. 
     */
    groupId?: GroupIds;
    /**
     *  A descriptive name for the request. 
     */
    name: StartImportFileTaskRequestNameString;
    /**
     *  The S3 bucket where Strategy Recommendations uploads import results. The bucket name is required to begin with migrationhub-strategy-. 
     */
    s3bucketForReportData?: StartImportFileTaskRequestS3bucketForReportDataString;
    /**
     *  The Amazon S3 key name of the import file. 
     */
    s3key: String;
  }
  export type StartImportFileTaskRequestNameString = string;
  export type StartImportFileTaskRequestS3bucketForReportDataString = string;
  export interface StartImportFileTaskResponse {
    /**
     *  The ID for a specific import task. The ID is unique within an AWS account. 
     */
    id?: String;
  }
  export interface StartRecommendationReportGenerationRequest {
    /**
     *  Groups the resources in the recommendation report with a unique name. 
     */
    groupIdFilter?: GroupIds;
    /**
     *  The output format for the recommendation report file. The default format is Microsoft Excel. 
     */
    outputFormat?: OutputFormat;
  }
  export interface StartRecommendationReportGenerationResponse {
    /**
     *  The ID of the recommendation report generation task. 
     */
    id?: RecommendationTaskId;
  }
  export type StatusMessage = string;
  export interface StopAssessmentRequest {
    /**
     *  The assessmentId returned by StartAssessment. 
     */
    assessmentId: AsyncTaskId;
  }
  export interface StopAssessmentResponse {
  }
  export type Strategy = "Rehost"|"Retirement"|"Refactor"|"Replatform"|"Retain"|"Relocate"|"Repurchase"|string;
  export interface StrategyOption {
    /**
     *  Indicates if a specific strategy is preferred for the application component. 
     */
    isPreferred?: Boolean;
    /**
     *  Type of transformation. For example, Rehost, Replatform, and so on. 
     */
    strategy?: Strategy;
    /**
     *  Destination information about where the application component can migrate to. For example, EC2, ECS, and so on. 
     */
    targetDestination?: TargetDestination;
    /**
     *  The name of the tool that can be used to transform an application component using this strategy. 
     */
    toolName?: TransformationToolName;
  }
  export type StrategyRecommendation = "recommended"|"viableOption"|"notRecommended"|string;
  export interface StrategySummary {
    /**
     *  The count of recommendations per strategy. 
     */
    count?: Integer;
    /**
     *  The name of recommended strategy. 
     */
    strategy?: Strategy;
  }
  export type String = string;
  export interface SystemInfo {
    /**
     *  CPU architecture type for the server. 
     */
    cpuArchitecture?: String;
    /**
     *  File system type for the server. 
     */
    fileSystemType?: String;
    /**
     *  Networking information related to a server. 
     */
    networkInfoList?: NetworkInfoList;
    /**
     *  Operating system corresponding to a server. 
     */
    osInfo?: OSInfo;
  }
  export type TargetDatabaseEngine = "None specified"|"Amazon Aurora"|"AWS PostgreSQL"|"MySQL"|"Microsoft SQL Server"|"Oracle Database"|"MariaDB"|"SAP"|"Db2 LUW"|"MongoDB"|string;
  export type TargetDatabaseEngines = TargetDatabaseEngine[];
  export type TargetDestination = "None specified"|"AWS Elastic BeanStalk"|"AWS Fargate"|"Amazon Elastic Cloud Compute (EC2)"|"Amazon Elastic Container Service (ECS)"|"Amazon Elastic Kubernetes Service (EKS)"|"Aurora MySQL"|"Aurora PostgreSQL"|"Amazon Relational Database Service on MySQL"|"Amazon Relational Database Service on PostgreSQL"|"Amazon DocumentDB"|"Amazon DynamoDB"|"Amazon Relational Database Service"|string;
  export type TimeStamp = Date;
  export type TranformationToolDescription = string;
  export type TranformationToolInstallationLink = string;
  export interface TransformationTool {
    /**
     *  Description of the tool. 
     */
    description?: TranformationToolDescription;
    /**
     *  Name of the tool. 
     */
    name?: TransformationToolName;
    /**
     *  URL for installing the tool. 
     */
    tranformationToolInstallationLink?: TranformationToolInstallationLink;
  }
  export type TransformationToolName = "App2Container"|"Porting Assistant For .NET"|"End of Support Migration"|"Windows Web Application Migration Assistant"|"Application Migration Service"|"Strategy Recommendation Support"|"In Place Operating System Upgrade"|"Schema Conversion Tool"|"Database Migration Service"|"Native SQL Server Backup/Restore"|string;
  export interface UpdateApplicationComponentConfigRequest {
    /**
     *  The ID of the application component. The ID is unique within an AWS account. 
     */
    applicationComponentId: ApplicationComponentId;
    /**
     *  Indicates whether the application component has been included for server recommendation or not. 
     */
    inclusionStatus?: InclusionStatus;
    /**
     *  Database credentials. 
     */
    secretsManagerKey?: SecretsManagerKey;
    /**
     *  The list of source code configurations to update for the application component. 
     */
    sourceCodeList?: SourceCodeList;
    /**
     *  The preferred strategy options for the application component. Use values from the GetApplicationComponentStrategies response. 
     */
    strategyOption?: StrategyOption;
  }
  export interface UpdateApplicationComponentConfigResponse {
  }
  export interface UpdateServerConfigRequest {
    /**
     *  The ID of the server. 
     */
    serverId: ServerId;
    /**
     *  The preferred strategy options for the application component. See the response from GetServerStrategies.
     */
    strategyOption?: StrategyOption;
  }
  export interface UpdateServerConfigResponse {
  }
  export type VersionControl = "GITHUB"|"GITHUB_ENTERPRISE"|string;
  export type importS3Bucket = string;
  export type importS3Key = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-02-19"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the MigrationHubStrategy client.
   */
  export import Types = MigrationHubStrategy;
}
export = MigrationHubStrategy;
