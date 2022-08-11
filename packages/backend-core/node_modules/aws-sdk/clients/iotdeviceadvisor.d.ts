import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class IotDeviceAdvisor extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: IotDeviceAdvisor.Types.ClientConfiguration)
  config: Config & IotDeviceAdvisor.Types.ClientConfiguration;
  /**
   * Creates a Device Advisor test suite.
   */
  createSuiteDefinition(params: IotDeviceAdvisor.Types.CreateSuiteDefinitionRequest, callback?: (err: AWSError, data: IotDeviceAdvisor.Types.CreateSuiteDefinitionResponse) => void): Request<IotDeviceAdvisor.Types.CreateSuiteDefinitionResponse, AWSError>;
  /**
   * Creates a Device Advisor test suite.
   */
  createSuiteDefinition(callback?: (err: AWSError, data: IotDeviceAdvisor.Types.CreateSuiteDefinitionResponse) => void): Request<IotDeviceAdvisor.Types.CreateSuiteDefinitionResponse, AWSError>;
  /**
   * Deletes a Device Advisor test suite.
   */
  deleteSuiteDefinition(params: IotDeviceAdvisor.Types.DeleteSuiteDefinitionRequest, callback?: (err: AWSError, data: IotDeviceAdvisor.Types.DeleteSuiteDefinitionResponse) => void): Request<IotDeviceAdvisor.Types.DeleteSuiteDefinitionResponse, AWSError>;
  /**
   * Deletes a Device Advisor test suite.
   */
  deleteSuiteDefinition(callback?: (err: AWSError, data: IotDeviceAdvisor.Types.DeleteSuiteDefinitionResponse) => void): Request<IotDeviceAdvisor.Types.DeleteSuiteDefinitionResponse, AWSError>;
  /**
   * Gets information about a Device Advisor test suite.
   */
  getSuiteDefinition(params: IotDeviceAdvisor.Types.GetSuiteDefinitionRequest, callback?: (err: AWSError, data: IotDeviceAdvisor.Types.GetSuiteDefinitionResponse) => void): Request<IotDeviceAdvisor.Types.GetSuiteDefinitionResponse, AWSError>;
  /**
   * Gets information about a Device Advisor test suite.
   */
  getSuiteDefinition(callback?: (err: AWSError, data: IotDeviceAdvisor.Types.GetSuiteDefinitionResponse) => void): Request<IotDeviceAdvisor.Types.GetSuiteDefinitionResponse, AWSError>;
  /**
   * Gets information about a Device Advisor test suite run.
   */
  getSuiteRun(params: IotDeviceAdvisor.Types.GetSuiteRunRequest, callback?: (err: AWSError, data: IotDeviceAdvisor.Types.GetSuiteRunResponse) => void): Request<IotDeviceAdvisor.Types.GetSuiteRunResponse, AWSError>;
  /**
   * Gets information about a Device Advisor test suite run.
   */
  getSuiteRun(callback?: (err: AWSError, data: IotDeviceAdvisor.Types.GetSuiteRunResponse) => void): Request<IotDeviceAdvisor.Types.GetSuiteRunResponse, AWSError>;
  /**
   * Gets a report download link for a successful Device Advisor qualifying test suite run.
   */
  getSuiteRunReport(params: IotDeviceAdvisor.Types.GetSuiteRunReportRequest, callback?: (err: AWSError, data: IotDeviceAdvisor.Types.GetSuiteRunReportResponse) => void): Request<IotDeviceAdvisor.Types.GetSuiteRunReportResponse, AWSError>;
  /**
   * Gets a report download link for a successful Device Advisor qualifying test suite run.
   */
  getSuiteRunReport(callback?: (err: AWSError, data: IotDeviceAdvisor.Types.GetSuiteRunReportResponse) => void): Request<IotDeviceAdvisor.Types.GetSuiteRunReportResponse, AWSError>;
  /**
   * Lists the Device Advisor test suites you have created.
   */
  listSuiteDefinitions(params: IotDeviceAdvisor.Types.ListSuiteDefinitionsRequest, callback?: (err: AWSError, data: IotDeviceAdvisor.Types.ListSuiteDefinitionsResponse) => void): Request<IotDeviceAdvisor.Types.ListSuiteDefinitionsResponse, AWSError>;
  /**
   * Lists the Device Advisor test suites you have created.
   */
  listSuiteDefinitions(callback?: (err: AWSError, data: IotDeviceAdvisor.Types.ListSuiteDefinitionsResponse) => void): Request<IotDeviceAdvisor.Types.ListSuiteDefinitionsResponse, AWSError>;
  /**
   * Lists the runs of the specified Device Advisor test suite. You can list all runs of the test suite, or the runs of a specific version of the test suite.
   */
  listSuiteRuns(params: IotDeviceAdvisor.Types.ListSuiteRunsRequest, callback?: (err: AWSError, data: IotDeviceAdvisor.Types.ListSuiteRunsResponse) => void): Request<IotDeviceAdvisor.Types.ListSuiteRunsResponse, AWSError>;
  /**
   * Lists the runs of the specified Device Advisor test suite. You can list all runs of the test suite, or the runs of a specific version of the test suite.
   */
  listSuiteRuns(callback?: (err: AWSError, data: IotDeviceAdvisor.Types.ListSuiteRunsResponse) => void): Request<IotDeviceAdvisor.Types.ListSuiteRunsResponse, AWSError>;
  /**
   * Lists the tags attached to an IoT Device Advisor resource.
   */
  listTagsForResource(params: IotDeviceAdvisor.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: IotDeviceAdvisor.Types.ListTagsForResourceResponse) => void): Request<IotDeviceAdvisor.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags attached to an IoT Device Advisor resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: IotDeviceAdvisor.Types.ListTagsForResourceResponse) => void): Request<IotDeviceAdvisor.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Starts a Device Advisor test suite run.
   */
  startSuiteRun(params: IotDeviceAdvisor.Types.StartSuiteRunRequest, callback?: (err: AWSError, data: IotDeviceAdvisor.Types.StartSuiteRunResponse) => void): Request<IotDeviceAdvisor.Types.StartSuiteRunResponse, AWSError>;
  /**
   * Starts a Device Advisor test suite run.
   */
  startSuiteRun(callback?: (err: AWSError, data: IotDeviceAdvisor.Types.StartSuiteRunResponse) => void): Request<IotDeviceAdvisor.Types.StartSuiteRunResponse, AWSError>;
  /**
   * Stops a Device Advisor test suite run that is currently running.
   */
  stopSuiteRun(params: IotDeviceAdvisor.Types.StopSuiteRunRequest, callback?: (err: AWSError, data: IotDeviceAdvisor.Types.StopSuiteRunResponse) => void): Request<IotDeviceAdvisor.Types.StopSuiteRunResponse, AWSError>;
  /**
   * Stops a Device Advisor test suite run that is currently running.
   */
  stopSuiteRun(callback?: (err: AWSError, data: IotDeviceAdvisor.Types.StopSuiteRunResponse) => void): Request<IotDeviceAdvisor.Types.StopSuiteRunResponse, AWSError>;
  /**
   * Adds to and modifies existing tags of an IoT Device Advisor resource.
   */
  tagResource(params: IotDeviceAdvisor.Types.TagResourceRequest, callback?: (err: AWSError, data: IotDeviceAdvisor.Types.TagResourceResponse) => void): Request<IotDeviceAdvisor.Types.TagResourceResponse, AWSError>;
  /**
   * Adds to and modifies existing tags of an IoT Device Advisor resource.
   */
  tagResource(callback?: (err: AWSError, data: IotDeviceAdvisor.Types.TagResourceResponse) => void): Request<IotDeviceAdvisor.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from an IoT Device Advisor resource.
   */
  untagResource(params: IotDeviceAdvisor.Types.UntagResourceRequest, callback?: (err: AWSError, data: IotDeviceAdvisor.Types.UntagResourceResponse) => void): Request<IotDeviceAdvisor.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from an IoT Device Advisor resource.
   */
  untagResource(callback?: (err: AWSError, data: IotDeviceAdvisor.Types.UntagResourceResponse) => void): Request<IotDeviceAdvisor.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates a Device Advisor test suite.
   */
  updateSuiteDefinition(params: IotDeviceAdvisor.Types.UpdateSuiteDefinitionRequest, callback?: (err: AWSError, data: IotDeviceAdvisor.Types.UpdateSuiteDefinitionResponse) => void): Request<IotDeviceAdvisor.Types.UpdateSuiteDefinitionResponse, AWSError>;
  /**
   * Updates a Device Advisor test suite.
   */
  updateSuiteDefinition(callback?: (err: AWSError, data: IotDeviceAdvisor.Types.UpdateSuiteDefinitionResponse) => void): Request<IotDeviceAdvisor.Types.UpdateSuiteDefinitionResponse, AWSError>;
}
declare namespace IotDeviceAdvisor {
  export type AmazonResourceName = string;
  export interface CreateSuiteDefinitionRequest {
    /**
     * Creates a Device Advisor test suite with suite definition configuration.
     */
    suiteDefinitionConfiguration?: SuiteDefinitionConfiguration;
    /**
     * The tags to be attached to the suite definition.
     */
    tags?: TagMap;
  }
  export interface CreateSuiteDefinitionResponse {
    /**
     * Creates a Device Advisor test suite with suite UUID.
     */
    suiteDefinitionId?: UUID;
    /**
     * Creates a Device Advisor test suite with Amazon Resource name.
     */
    suiteDefinitionArn?: AmazonResourceName;
    /**
     * Creates a Device Advisor test suite with suite definition name.
     */
    suiteDefinitionName?: SuiteDefinitionName;
    /**
     * Creates a Device Advisor test suite with TimeStamp of when it was created.
     */
    createdAt?: Timestamp;
  }
  export interface DeleteSuiteDefinitionRequest {
    /**
     * Suite definition Id of the test suite to be deleted.
     */
    suiteDefinitionId: UUID;
  }
  export interface DeleteSuiteDefinitionResponse {
  }
  export interface DeviceUnderTest {
    /**
     * Lists devices thing arn
     */
    thingArn?: AmazonResourceName;
    /**
     * Lists devices certificate arn
     */
    certificateArn?: AmazonResourceName;
  }
  export type DeviceUnderTestList = DeviceUnderTest[];
  export type ErrorReason = string;
  export type Failure = string;
  export interface GetSuiteDefinitionRequest {
    /**
     * Suite definition Id of the test suite to get.
     */
    suiteDefinitionId: UUID;
    /**
     * Suite definition version of the test suite to get.
     */
    suiteDefinitionVersion?: SuiteDefinitionVersion;
  }
  export interface GetSuiteDefinitionResponse {
    /**
     * Suite definition Id of the suite definition.
     */
    suiteDefinitionId?: UUID;
    /**
     * The ARN of the suite definition.
     */
    suiteDefinitionArn?: AmazonResourceName;
    /**
     * Suite definition version of the suite definition.
     */
    suiteDefinitionVersion?: SuiteDefinitionVersion;
    /**
     * Latest suite definition version of the suite definition.
     */
    latestVersion?: SuiteDefinitionVersion;
    /**
     * Suite configuration of the suite definition.
     */
    suiteDefinitionConfiguration?: SuiteDefinitionConfiguration;
    /**
     * Date (in Unix epoch time) when the suite definition was created.
     */
    createdAt?: Timestamp;
    /**
     * Date (in Unix epoch time) when the suite definition was last modified.
     */
    lastModifiedAt?: Timestamp;
    /**
     * Tags attached to the suite definition.
     */
    tags?: TagMap;
  }
  export interface GetSuiteRunReportRequest {
    /**
     * Suite definition Id of the test suite.
     */
    suiteDefinitionId: UUID;
    /**
     * Suite run Id of the test suite run.
     */
    suiteRunId: UUID;
  }
  export interface GetSuiteRunReportResponse {
    /**
     * Download URL of the qualification report.
     */
    qualificationReportDownloadUrl?: QualificationReportDownloadUrl;
  }
  export interface GetSuiteRunRequest {
    /**
     * Suite definition Id for the test suite run.
     */
    suiteDefinitionId: UUID;
    /**
     * Suite run Id for the test suite run.
     */
    suiteRunId: UUID;
  }
  export interface GetSuiteRunResponse {
    /**
     * Suite definition Id for the test suite run.
     */
    suiteDefinitionId?: UUID;
    /**
     * Suite definition version for the test suite run.
     */
    suiteDefinitionVersion?: SuiteDefinitionVersion;
    /**
     * Suite run Id for the test suite run.
     */
    suiteRunId?: UUID;
    /**
     * The ARN of the suite run.
     */
    suiteRunArn?: AmazonResourceName;
    /**
     * Suite run configuration for the test suite run.
     */
    suiteRunConfiguration?: SuiteRunConfiguration;
    /**
     * Test results for the test suite run.
     */
    testResult?: TestResult;
    /**
     * Date (in Unix epoch time) when the test suite run was started.
     */
    startTime?: Timestamp;
    /**
     * Date (in Unix epoch time) when the test suite run ended.
     */
    endTime?: Timestamp;
    /**
     * Status for the test suite run.
     */
    status?: SuiteRunStatus;
    /**
     * Error reason for any test suite run failure.
     */
    errorReason?: ErrorReason;
    /**
     * The tags attached to the suite run.
     */
    tags?: TagMap;
  }
  export type GroupName = string;
  export interface GroupResult {
    /**
     * Group result Id.
     */
    groupId?: UUID;
    /**
     * Group Result Name.
     */
    groupName?: GroupName;
    /**
     * Tests under Group Result.
     */
    tests?: TestCaseRuns;
  }
  export type GroupResultList = GroupResult[];
  export type IntendedForQualificationBoolean = boolean;
  export interface ListSuiteDefinitionsRequest {
    /**
     * The maximum number of results to return at once.
     */
    maxResults?: MaxResults;
    /**
     * A token used to get the next set of results.
     */
    nextToken?: Token;
  }
  export interface ListSuiteDefinitionsResponse {
    /**
     * An array of objects that provide summaries of information about the suite definitions in the list.
     */
    suiteDefinitionInformationList?: SuiteDefinitionInformationList;
    /**
     * A token used to get the next set of results.
     */
    nextToken?: Token;
  }
  export interface ListSuiteRunsRequest {
    /**
     * Lists the test suite runs of the specified test suite based on suite definition Id.
     */
    suiteDefinitionId?: UUID;
    /**
     * Must be passed along with suiteDefinitionId. Lists the test suite runs of the specified test suite based on suite definition version.
     */
    suiteDefinitionVersion?: SuiteDefinitionVersion;
    /**
     * The maximum number of results to return at once.
     */
    maxResults?: MaxResults;
    /**
     * A token to retrieve the next set of results.
     */
    nextToken?: Token;
  }
  export interface ListSuiteRunsResponse {
    /**
     * An array of objects that provide summaries of information about the suite runs in the list.
     */
    suiteRunsList?: SuiteRunsList;
    /**
     * A token to retrieve the next set of results.
     */
    nextToken?: Token;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the IoT Device Advisor resource.
     */
    resourceArn: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags attached to the IoT Device Advisor resource.
     */
    tags?: TagMap;
  }
  export type LogUrl = string;
  export type MaxResults = number;
  export type QualificationReportDownloadUrl = string;
  export type RootGroup = string;
  export type SelectedTestList = UUID[];
  export interface StartSuiteRunRequest {
    /**
     * Suite definition Id of the test suite.
     */
    suiteDefinitionId: UUID;
    /**
     * Suite definition version of the test suite.
     */
    suiteDefinitionVersion?: SuiteDefinitionVersion;
    /**
     * Suite run configuration.
     */
    suiteRunConfiguration?: SuiteRunConfiguration;
    /**
     * The tags to be attached to the suite run.
     */
    tags?: TagMap;
  }
  export interface StartSuiteRunResponse {
    /**
     * Suite Run Id of the started suite run.
     */
    suiteRunId?: UUID;
    /**
     * Amazon resource name of the started suite run.
     */
    suiteRunArn?: AmazonResourceName;
    /**
     * Date (in Unix epoch time) when the suite run was created.
     */
    createdAt?: Timestamp;
  }
  export type Status = "PASS"|"FAIL"|"CANCELED"|"PENDING"|"RUNNING"|"STOPPING"|"STOPPED"|"PASS_WITH_WARNINGS"|"ERROR"|string;
  export interface StopSuiteRunRequest {
    /**
     * Suite definition Id of the test suite run to be stopped.
     */
    suiteDefinitionId: UUID;
    /**
     * Suite run Id of the test suite run to be stopped.
     */
    suiteRunId: UUID;
  }
  export interface StopSuiteRunResponse {
  }
  export type String128 = string;
  export type String256 = string;
  export interface SuiteDefinitionConfiguration {
    /**
     * Gets Suite Definition Configuration name.
     */
    suiteDefinitionName?: SuiteDefinitionName;
    /**
     * Gets the devices configured.
     */
    devices?: DeviceUnderTestList;
    /**
     * Gets the tests intended for qualification in a suite.
     */
    intendedForQualification?: IntendedForQualificationBoolean;
    /**
     * Gets test suite root group.
     */
    rootGroup?: RootGroup;
    /**
     * Gets device permission arn.
     */
    devicePermissionRoleArn?: AmazonResourceName;
  }
  export interface SuiteDefinitionInformation {
    /**
     * Suite definition Id of the test suite.
     */
    suiteDefinitionId?: UUID;
    /**
     * Suite name of the test suite.
     */
    suiteDefinitionName?: SuiteDefinitionName;
    /**
     * Specifies the devices under test for the test suite.
     */
    defaultDevices?: DeviceUnderTestList;
    /**
     * Specifies if the test suite is intended for qualification.
     */
    intendedForQualification?: IntendedForQualificationBoolean;
    /**
     * Date (in Unix epoch time) when the test suite was created.
     */
    createdAt?: Timestamp;
  }
  export type SuiteDefinitionInformationList = SuiteDefinitionInformation[];
  export type SuiteDefinitionName = string;
  export type SuiteDefinitionVersion = string;
  export interface SuiteRunConfiguration {
    /**
     * Gets the primary device for suite run.
     */
    primaryDevice?: DeviceUnderTest;
    /**
     * Gets test case list.
     */
    selectedTestList?: SelectedTestList;
  }
  export interface SuiteRunInformation {
    /**
     * Suite definition Id of the suite run.
     */
    suiteDefinitionId?: UUID;
    /**
     * Suite definition version of the suite run.
     */
    suiteDefinitionVersion?: SuiteDefinitionVersion;
    /**
     * Suite definition name of the suite run.
     */
    suiteDefinitionName?: SuiteDefinitionName;
    /**
     * Suite run Id of the suite run.
     */
    suiteRunId?: UUID;
    /**
     * Date (in Unix epoch time) when the suite run was created.
     */
    createdAt?: Timestamp;
    /**
     * Date (in Unix epoch time) when the suite run was started.
     */
    startedAt?: Timestamp;
    /**
     * Date (in Unix epoch time) when the suite run ended.
     */
    endAt?: Timestamp;
    /**
     * Status of the suite run.
     */
    status?: SuiteRunStatus;
    /**
     * Number of test cases that passed in the suite run.
     */
    passed?: SuiteRunResultCount;
    /**
     * Number of test cases that failed in the suite run.
     */
    failed?: SuiteRunResultCount;
  }
  export type SuiteRunResultCount = number;
  export type SuiteRunStatus = "PASS"|"FAIL"|"CANCELED"|"PENDING"|"RUNNING"|"STOPPING"|"STOPPED"|"PASS_WITH_WARNINGS"|"ERROR"|string;
  export type SuiteRunsList = SuiteRunInformation[];
  export type TagKeyList = String128[];
  export type TagMap = {[key: string]: String256};
  export interface TagResourceRequest {
    /**
     * The resource ARN of an IoT Device Advisor resource.
     */
    resourceArn: AmazonResourceName;
    /**
     * The tags to be attached to the IoT Device Advisor resource.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TestCaseDefinitionName = string;
  export interface TestCaseRun {
    /**
     * Provides test case run Id.
     */
    testCaseRunId?: UUID;
    /**
     * Provides test case run definition Id.
     */
    testCaseDefinitionId?: UUID;
    /**
     * Provides test case run definition Name.
     */
    testCaseDefinitionName?: TestCaseDefinitionName;
    /**
     * Provides test case run status.
     */
    status?: Status;
    /**
     * Provides test case run start time.
     */
    startTime?: Timestamp;
    /**
     * Provides test case run end time.
     */
    endTime?: Timestamp;
    /**
     * Provides test case run log Url.
     */
    logUrl?: LogUrl;
    /**
     * Provides test case run warnings.
     */
    warnings?: Warnings;
    /**
     * Provides test case run failure result.
     */
    failure?: Failure;
  }
  export type TestCaseRuns = TestCaseRun[];
  export interface TestResult {
    /**
     * Show each group of test results.
     */
    groups?: GroupResultList;
  }
  export type Timestamp = Date;
  export type Token = string;
  export type UUID = string;
  export interface UntagResourceRequest {
    /**
     * The resource ARN of an IoT Device Advisor resource.
     */
    resourceArn: AmazonResourceName;
    /**
     * List of tag keys to remove from the IoT Device Advisor resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateSuiteDefinitionRequest {
    /**
     * Suite definition Id of the test suite to be updated.
     */
    suiteDefinitionId: UUID;
    /**
     * Updates a Device Advisor test suite with suite definition configuration.
     */
    suiteDefinitionConfiguration?: SuiteDefinitionConfiguration;
  }
  export interface UpdateSuiteDefinitionResponse {
    /**
     * Suite definition Id of the updated test suite.
     */
    suiteDefinitionId?: UUID;
    /**
     * Amazon Resource name of the updated test suite.
     */
    suiteDefinitionArn?: AmazonResourceName;
    /**
     * Suite definition name of the updated test suite.
     */
    suiteDefinitionName?: SuiteDefinitionName;
    /**
     * Suite definition version of the updated test suite.
     */
    suiteDefinitionVersion?: SuiteDefinitionVersion;
    /**
     * Timestamp of when the test suite was created.
     */
    createdAt?: Timestamp;
    /**
     * Timestamp of when the test suite was updated.
     */
    lastUpdatedAt?: Timestamp;
  }
  export type Warnings = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-09-18"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the IotDeviceAdvisor client.
   */
  export import Types = IotDeviceAdvisor;
}
export = IotDeviceAdvisor;
