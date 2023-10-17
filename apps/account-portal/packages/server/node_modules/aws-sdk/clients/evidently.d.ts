import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Evidently extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Evidently.Types.ClientConfiguration)
  config: Config & Evidently.Types.ClientConfiguration;
  /**
   * This operation assigns feature variation to user sessions. For each user session, you pass in an entityID that represents the user. Evidently then checks the evaluation rules and assigns the variation. The first rules that are evaluated are the override rules. If the user's entityID matches an override rule, the user is served the variation specified by that rule. Next, if there is a launch of the feature, the user might be assigned to a variation in the launch. The chance of this depends on the percentage of users that are allocated to that launch. If the user is enrolled in the launch, the variation they are served depends on the allocation of the various feature variations used for the launch. If the user is not assigned to a launch, and there is an ongoing experiment for this feature, the user might be assigned to a variation in the experiment. The chance of this depends on the percentage of users that are allocated to that experiment. If the user is enrolled in the experiment, the variation they are served depends on the allocation of the various feature variations used for the experiment.  If the user is not assigned to a launch or experiment, they are served the default variation.
   */
  batchEvaluateFeature(params: Evidently.Types.BatchEvaluateFeatureRequest, callback?: (err: AWSError, data: Evidently.Types.BatchEvaluateFeatureResponse) => void): Request<Evidently.Types.BatchEvaluateFeatureResponse, AWSError>;
  /**
   * This operation assigns feature variation to user sessions. For each user session, you pass in an entityID that represents the user. Evidently then checks the evaluation rules and assigns the variation. The first rules that are evaluated are the override rules. If the user's entityID matches an override rule, the user is served the variation specified by that rule. Next, if there is a launch of the feature, the user might be assigned to a variation in the launch. The chance of this depends on the percentage of users that are allocated to that launch. If the user is enrolled in the launch, the variation they are served depends on the allocation of the various feature variations used for the launch. If the user is not assigned to a launch, and there is an ongoing experiment for this feature, the user might be assigned to a variation in the experiment. The chance of this depends on the percentage of users that are allocated to that experiment. If the user is enrolled in the experiment, the variation they are served depends on the allocation of the various feature variations used for the experiment.  If the user is not assigned to a launch or experiment, they are served the default variation.
   */
  batchEvaluateFeature(callback?: (err: AWSError, data: Evidently.Types.BatchEvaluateFeatureResponse) => void): Request<Evidently.Types.BatchEvaluateFeatureResponse, AWSError>;
  /**
   * Creates an Evidently experiment. Before you create an experiment, you must create the feature to use for the experiment. An experiment helps you make feature design decisions based on evidence and data. An experiment can test as many as five variations at once. Evidently collects experiment data and analyzes it by statistical methods, and provides clear recommendations about which variations perform better. You can optionally specify a segment to have the experiment consider only certain audience types in the experiment, such as using only user sessions from a certain location or who use a certain internet browser. Don't use this operation to update an existing experiment. Instead, use UpdateExperiment. 
   */
  createExperiment(params: Evidently.Types.CreateExperimentRequest, callback?: (err: AWSError, data: Evidently.Types.CreateExperimentResponse) => void): Request<Evidently.Types.CreateExperimentResponse, AWSError>;
  /**
   * Creates an Evidently experiment. Before you create an experiment, you must create the feature to use for the experiment. An experiment helps you make feature design decisions based on evidence and data. An experiment can test as many as five variations at once. Evidently collects experiment data and analyzes it by statistical methods, and provides clear recommendations about which variations perform better. You can optionally specify a segment to have the experiment consider only certain audience types in the experiment, such as using only user sessions from a certain location or who use a certain internet browser. Don't use this operation to update an existing experiment. Instead, use UpdateExperiment. 
   */
  createExperiment(callback?: (err: AWSError, data: Evidently.Types.CreateExperimentResponse) => void): Request<Evidently.Types.CreateExperimentResponse, AWSError>;
  /**
   * Creates an Evidently feature that you want to launch or test. You can define up to five variations of a feature, and use these variations in your launches and experiments. A feature must be created in a project. For information about creating a project, see CreateProject. Don't use this operation to update an existing feature. Instead, use UpdateFeature. 
   */
  createFeature(params: Evidently.Types.CreateFeatureRequest, callback?: (err: AWSError, data: Evidently.Types.CreateFeatureResponse) => void): Request<Evidently.Types.CreateFeatureResponse, AWSError>;
  /**
   * Creates an Evidently feature that you want to launch or test. You can define up to five variations of a feature, and use these variations in your launches and experiments. A feature must be created in a project. For information about creating a project, see CreateProject. Don't use this operation to update an existing feature. Instead, use UpdateFeature. 
   */
  createFeature(callback?: (err: AWSError, data: Evidently.Types.CreateFeatureResponse) => void): Request<Evidently.Types.CreateFeatureResponse, AWSError>;
  /**
   * Creates a launch of a given feature. Before you create a launch, you must create the feature to use for the launch. You can use a launch to safely validate new features by serving them to a specified percentage of your users while you roll out the feature. You can monitor the performance of the new feature to help you decide when to ramp up traffic to more users. This helps you reduce risk and identify unintended consequences before you fully launch the feature. Don't use this operation to update an existing launch. Instead, use UpdateLaunch. 
   */
  createLaunch(params: Evidently.Types.CreateLaunchRequest, callback?: (err: AWSError, data: Evidently.Types.CreateLaunchResponse) => void): Request<Evidently.Types.CreateLaunchResponse, AWSError>;
  /**
   * Creates a launch of a given feature. Before you create a launch, you must create the feature to use for the launch. You can use a launch to safely validate new features by serving them to a specified percentage of your users while you roll out the feature. You can monitor the performance of the new feature to help you decide when to ramp up traffic to more users. This helps you reduce risk and identify unintended consequences before you fully launch the feature. Don't use this operation to update an existing launch. Instead, use UpdateLaunch. 
   */
  createLaunch(callback?: (err: AWSError, data: Evidently.Types.CreateLaunchResponse) => void): Request<Evidently.Types.CreateLaunchResponse, AWSError>;
  /**
   * Creates a project, which is the logical object in Evidently that can contain features, launches, and experiments. Use projects to group similar features together. To update an existing project, use UpdateProject.
   */
  createProject(params: Evidently.Types.CreateProjectRequest, callback?: (err: AWSError, data: Evidently.Types.CreateProjectResponse) => void): Request<Evidently.Types.CreateProjectResponse, AWSError>;
  /**
   * Creates a project, which is the logical object in Evidently that can contain features, launches, and experiments. Use projects to group similar features together. To update an existing project, use UpdateProject.
   */
  createProject(callback?: (err: AWSError, data: Evidently.Types.CreateProjectResponse) => void): Request<Evidently.Types.CreateProjectResponse, AWSError>;
  /**
   * Use this operation to define a segment of your audience. A segment is a portion of your audience that share one or more characteristics. Examples could be Chrome browser users, users in Europe, or Firefox browser users in Europe who also fit other criteria that your application collects, such as age. Using a segment in an experiment limits that experiment to evaluate only the users who match the segment criteria. Using one or more segments in a launch allows you to define different traffic splits for the different audience segments. For more information about segment pattern syntax, see  Segment rule pattern syntax. The pattern that you define for a segment is matched against the value of evaluationContext, which is passed into Evidently in the EvaluateFeature operation, when Evidently assigns a feature variation to a user.
   */
  createSegment(params: Evidently.Types.CreateSegmentRequest, callback?: (err: AWSError, data: Evidently.Types.CreateSegmentResponse) => void): Request<Evidently.Types.CreateSegmentResponse, AWSError>;
  /**
   * Use this operation to define a segment of your audience. A segment is a portion of your audience that share one or more characteristics. Examples could be Chrome browser users, users in Europe, or Firefox browser users in Europe who also fit other criteria that your application collects, such as age. Using a segment in an experiment limits that experiment to evaluate only the users who match the segment criteria. Using one or more segments in a launch allows you to define different traffic splits for the different audience segments. For more information about segment pattern syntax, see  Segment rule pattern syntax. The pattern that you define for a segment is matched against the value of evaluationContext, which is passed into Evidently in the EvaluateFeature operation, when Evidently assigns a feature variation to a user.
   */
  createSegment(callback?: (err: AWSError, data: Evidently.Types.CreateSegmentResponse) => void): Request<Evidently.Types.CreateSegmentResponse, AWSError>;
  /**
   * Deletes an Evidently experiment. The feature used for the experiment is not deleted. To stop an experiment without deleting it, use StopExperiment. 
   */
  deleteExperiment(params: Evidently.Types.DeleteExperimentRequest, callback?: (err: AWSError, data: Evidently.Types.DeleteExperimentResponse) => void): Request<Evidently.Types.DeleteExperimentResponse, AWSError>;
  /**
   * Deletes an Evidently experiment. The feature used for the experiment is not deleted. To stop an experiment without deleting it, use StopExperiment. 
   */
  deleteExperiment(callback?: (err: AWSError, data: Evidently.Types.DeleteExperimentResponse) => void): Request<Evidently.Types.DeleteExperimentResponse, AWSError>;
  /**
   * Deletes an Evidently feature.
   */
  deleteFeature(params: Evidently.Types.DeleteFeatureRequest, callback?: (err: AWSError, data: Evidently.Types.DeleteFeatureResponse) => void): Request<Evidently.Types.DeleteFeatureResponse, AWSError>;
  /**
   * Deletes an Evidently feature.
   */
  deleteFeature(callback?: (err: AWSError, data: Evidently.Types.DeleteFeatureResponse) => void): Request<Evidently.Types.DeleteFeatureResponse, AWSError>;
  /**
   * Deletes an Evidently launch. The feature used for the launch is not deleted. To stop a launch without deleting it, use StopLaunch. 
   */
  deleteLaunch(params: Evidently.Types.DeleteLaunchRequest, callback?: (err: AWSError, data: Evidently.Types.DeleteLaunchResponse) => void): Request<Evidently.Types.DeleteLaunchResponse, AWSError>;
  /**
   * Deletes an Evidently launch. The feature used for the launch is not deleted. To stop a launch without deleting it, use StopLaunch. 
   */
  deleteLaunch(callback?: (err: AWSError, data: Evidently.Types.DeleteLaunchResponse) => void): Request<Evidently.Types.DeleteLaunchResponse, AWSError>;
  /**
   * Deletes an Evidently project. Before you can delete a project, you must delete all the features that the project contains. To delete a feature, use DeleteFeature.
   */
  deleteProject(params: Evidently.Types.DeleteProjectRequest, callback?: (err: AWSError, data: Evidently.Types.DeleteProjectResponse) => void): Request<Evidently.Types.DeleteProjectResponse, AWSError>;
  /**
   * Deletes an Evidently project. Before you can delete a project, you must delete all the features that the project contains. To delete a feature, use DeleteFeature.
   */
  deleteProject(callback?: (err: AWSError, data: Evidently.Types.DeleteProjectResponse) => void): Request<Evidently.Types.DeleteProjectResponse, AWSError>;
  /**
   * Deletes a segment. You can't delete a segment that is being used in a launch or experiment, even if that launch or experiment is not currently running.
   */
  deleteSegment(params: Evidently.Types.DeleteSegmentRequest, callback?: (err: AWSError, data: Evidently.Types.DeleteSegmentResponse) => void): Request<Evidently.Types.DeleteSegmentResponse, AWSError>;
  /**
   * Deletes a segment. You can't delete a segment that is being used in a launch or experiment, even if that launch or experiment is not currently running.
   */
  deleteSegment(callback?: (err: AWSError, data: Evidently.Types.DeleteSegmentResponse) => void): Request<Evidently.Types.DeleteSegmentResponse, AWSError>;
  /**
   * This operation assigns a feature variation to one given user session. You pass in an entityID that represents the user. Evidently then checks the evaluation rules and assigns the variation. The first rules that are evaluated are the override rules. If the user's entityID matches an override rule, the user is served the variation specified by that rule. If there is a current launch with this feature that uses segment overrides, and if the user session's evaluationContext matches a segment rule defined in a segment override, the configuration in the segment overrides is used. For more information about segments, see CreateSegment and Use segments to focus your audience. If there is a launch with no segment overrides, the user might be assigned to a variation in the launch. The chance of this depends on the percentage of users that are allocated to that launch. If the user is enrolled in the launch, the variation they are served depends on the allocation of the various feature variations used for the launch. If the user is not assigned to a launch, and there is an ongoing experiment for this feature, the user might be assigned to a variation in the experiment. The chance of this depends on the percentage of users that are allocated to that experiment. If the experiment uses a segment, then only user sessions with evaluationContext values that match the segment rule are used in the experiment. If the user is enrolled in the experiment, the variation they are served depends on the allocation of the various feature variations used for the experiment.  If the user is not assigned to a launch or experiment, they are served the default variation.
   */
  evaluateFeature(params: Evidently.Types.EvaluateFeatureRequest, callback?: (err: AWSError, data: Evidently.Types.EvaluateFeatureResponse) => void): Request<Evidently.Types.EvaluateFeatureResponse, AWSError>;
  /**
   * This operation assigns a feature variation to one given user session. You pass in an entityID that represents the user. Evidently then checks the evaluation rules and assigns the variation. The first rules that are evaluated are the override rules. If the user's entityID matches an override rule, the user is served the variation specified by that rule. If there is a current launch with this feature that uses segment overrides, and if the user session's evaluationContext matches a segment rule defined in a segment override, the configuration in the segment overrides is used. For more information about segments, see CreateSegment and Use segments to focus your audience. If there is a launch with no segment overrides, the user might be assigned to a variation in the launch. The chance of this depends on the percentage of users that are allocated to that launch. If the user is enrolled in the launch, the variation they are served depends on the allocation of the various feature variations used for the launch. If the user is not assigned to a launch, and there is an ongoing experiment for this feature, the user might be assigned to a variation in the experiment. The chance of this depends on the percentage of users that are allocated to that experiment. If the experiment uses a segment, then only user sessions with evaluationContext values that match the segment rule are used in the experiment. If the user is enrolled in the experiment, the variation they are served depends on the allocation of the various feature variations used for the experiment.  If the user is not assigned to a launch or experiment, they are served the default variation.
   */
  evaluateFeature(callback?: (err: AWSError, data: Evidently.Types.EvaluateFeatureResponse) => void): Request<Evidently.Types.EvaluateFeatureResponse, AWSError>;
  /**
   * Returns the details about one experiment. You must already know the experiment name. To retrieve a list of experiments in your account, use ListExperiments.
   */
  getExperiment(params: Evidently.Types.GetExperimentRequest, callback?: (err: AWSError, data: Evidently.Types.GetExperimentResponse) => void): Request<Evidently.Types.GetExperimentResponse, AWSError>;
  /**
   * Returns the details about one experiment. You must already know the experiment name. To retrieve a list of experiments in your account, use ListExperiments.
   */
  getExperiment(callback?: (err: AWSError, data: Evidently.Types.GetExperimentResponse) => void): Request<Evidently.Types.GetExperimentResponse, AWSError>;
  /**
   * Retrieves the results of a running or completed experiment. No results are available until there have been 100 events for each variation and at least 10 minutes have passed since the start of the experiment. To increase the statistical power, Evidently performs an additional offline p-value analysis at the end of the experiment. Offline p-value analysis can detect statistical significance in some cases where the anytime p-values used during the experiment do not find statistical significance. Experiment results are available up to 63 days after the start of the experiment. They are not available after that because of CloudWatch data retention policies.
   */
  getExperimentResults(params: Evidently.Types.GetExperimentResultsRequest, callback?: (err: AWSError, data: Evidently.Types.GetExperimentResultsResponse) => void): Request<Evidently.Types.GetExperimentResultsResponse, AWSError>;
  /**
   * Retrieves the results of a running or completed experiment. No results are available until there have been 100 events for each variation and at least 10 minutes have passed since the start of the experiment. To increase the statistical power, Evidently performs an additional offline p-value analysis at the end of the experiment. Offline p-value analysis can detect statistical significance in some cases where the anytime p-values used during the experiment do not find statistical significance. Experiment results are available up to 63 days after the start of the experiment. They are not available after that because of CloudWatch data retention policies.
   */
  getExperimentResults(callback?: (err: AWSError, data: Evidently.Types.GetExperimentResultsResponse) => void): Request<Evidently.Types.GetExperimentResultsResponse, AWSError>;
  /**
   * Returns the details about one feature. You must already know the feature name. To retrieve a list of features in your account, use ListFeatures.
   */
  getFeature(params: Evidently.Types.GetFeatureRequest, callback?: (err: AWSError, data: Evidently.Types.GetFeatureResponse) => void): Request<Evidently.Types.GetFeatureResponse, AWSError>;
  /**
   * Returns the details about one feature. You must already know the feature name. To retrieve a list of features in your account, use ListFeatures.
   */
  getFeature(callback?: (err: AWSError, data: Evidently.Types.GetFeatureResponse) => void): Request<Evidently.Types.GetFeatureResponse, AWSError>;
  /**
   * Returns the details about one launch. You must already know the launch name. To retrieve a list of launches in your account, use ListLaunches.
   */
  getLaunch(params: Evidently.Types.GetLaunchRequest, callback?: (err: AWSError, data: Evidently.Types.GetLaunchResponse) => void): Request<Evidently.Types.GetLaunchResponse, AWSError>;
  /**
   * Returns the details about one launch. You must already know the launch name. To retrieve a list of launches in your account, use ListLaunches.
   */
  getLaunch(callback?: (err: AWSError, data: Evidently.Types.GetLaunchResponse) => void): Request<Evidently.Types.GetLaunchResponse, AWSError>;
  /**
   * Returns the details about one launch. You must already know the project name. To retrieve a list of projects in your account, use ListProjects.
   */
  getProject(params: Evidently.Types.GetProjectRequest, callback?: (err: AWSError, data: Evidently.Types.GetProjectResponse) => void): Request<Evidently.Types.GetProjectResponse, AWSError>;
  /**
   * Returns the details about one launch. You must already know the project name. To retrieve a list of projects in your account, use ListProjects.
   */
  getProject(callback?: (err: AWSError, data: Evidently.Types.GetProjectResponse) => void): Request<Evidently.Types.GetProjectResponse, AWSError>;
  /**
   * Returns information about the specified segment. Specify the segment you want to view by specifying its ARN.
   */
  getSegment(params: Evidently.Types.GetSegmentRequest, callback?: (err: AWSError, data: Evidently.Types.GetSegmentResponse) => void): Request<Evidently.Types.GetSegmentResponse, AWSError>;
  /**
   * Returns information about the specified segment. Specify the segment you want to view by specifying its ARN.
   */
  getSegment(callback?: (err: AWSError, data: Evidently.Types.GetSegmentResponse) => void): Request<Evidently.Types.GetSegmentResponse, AWSError>;
  /**
   * Returns configuration details about all the experiments in the specified project.
   */
  listExperiments(params: Evidently.Types.ListExperimentsRequest, callback?: (err: AWSError, data: Evidently.Types.ListExperimentsResponse) => void): Request<Evidently.Types.ListExperimentsResponse, AWSError>;
  /**
   * Returns configuration details about all the experiments in the specified project.
   */
  listExperiments(callback?: (err: AWSError, data: Evidently.Types.ListExperimentsResponse) => void): Request<Evidently.Types.ListExperimentsResponse, AWSError>;
  /**
   * Returns configuration details about all the features in the specified project.
   */
  listFeatures(params: Evidently.Types.ListFeaturesRequest, callback?: (err: AWSError, data: Evidently.Types.ListFeaturesResponse) => void): Request<Evidently.Types.ListFeaturesResponse, AWSError>;
  /**
   * Returns configuration details about all the features in the specified project.
   */
  listFeatures(callback?: (err: AWSError, data: Evidently.Types.ListFeaturesResponse) => void): Request<Evidently.Types.ListFeaturesResponse, AWSError>;
  /**
   * Returns configuration details about all the launches in the specified project.
   */
  listLaunches(params: Evidently.Types.ListLaunchesRequest, callback?: (err: AWSError, data: Evidently.Types.ListLaunchesResponse) => void): Request<Evidently.Types.ListLaunchesResponse, AWSError>;
  /**
   * Returns configuration details about all the launches in the specified project.
   */
  listLaunches(callback?: (err: AWSError, data: Evidently.Types.ListLaunchesResponse) => void): Request<Evidently.Types.ListLaunchesResponse, AWSError>;
  /**
   * Returns configuration details about all the projects in the current Region in your account.
   */
  listProjects(params: Evidently.Types.ListProjectsRequest, callback?: (err: AWSError, data: Evidently.Types.ListProjectsResponse) => void): Request<Evidently.Types.ListProjectsResponse, AWSError>;
  /**
   * Returns configuration details about all the projects in the current Region in your account.
   */
  listProjects(callback?: (err: AWSError, data: Evidently.Types.ListProjectsResponse) => void): Request<Evidently.Types.ListProjectsResponse, AWSError>;
  /**
   * Use this operation to find which experiments or launches are using a specified segment.
   */
  listSegmentReferences(params: Evidently.Types.ListSegmentReferencesRequest, callback?: (err: AWSError, data: Evidently.Types.ListSegmentReferencesResponse) => void): Request<Evidently.Types.ListSegmentReferencesResponse, AWSError>;
  /**
   * Use this operation to find which experiments or launches are using a specified segment.
   */
  listSegmentReferences(callback?: (err: AWSError, data: Evidently.Types.ListSegmentReferencesResponse) => void): Request<Evidently.Types.ListSegmentReferencesResponse, AWSError>;
  /**
   * Returns a list of audience segments that you have created in your account in this Region.
   */
  listSegments(params: Evidently.Types.ListSegmentsRequest, callback?: (err: AWSError, data: Evidently.Types.ListSegmentsResponse) => void): Request<Evidently.Types.ListSegmentsResponse, AWSError>;
  /**
   * Returns a list of audience segments that you have created in your account in this Region.
   */
  listSegments(callback?: (err: AWSError, data: Evidently.Types.ListSegmentsResponse) => void): Request<Evidently.Types.ListSegmentsResponse, AWSError>;
  /**
   * Displays the tags associated with an Evidently resource.
   */
  listTagsForResource(params: Evidently.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Evidently.Types.ListTagsForResourceResponse) => void): Request<Evidently.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Displays the tags associated with an Evidently resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Evidently.Types.ListTagsForResourceResponse) => void): Request<Evidently.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Sends performance events to Evidently. These events can be used to evaluate a launch or an experiment.
   */
  putProjectEvents(params: Evidently.Types.PutProjectEventsRequest, callback?: (err: AWSError, data: Evidently.Types.PutProjectEventsResponse) => void): Request<Evidently.Types.PutProjectEventsResponse, AWSError>;
  /**
   * Sends performance events to Evidently. These events can be used to evaluate a launch or an experiment.
   */
  putProjectEvents(callback?: (err: AWSError, data: Evidently.Types.PutProjectEventsResponse) => void): Request<Evidently.Types.PutProjectEventsResponse, AWSError>;
  /**
   * Starts an existing experiment. To create an experiment, use CreateExperiment.
   */
  startExperiment(params: Evidently.Types.StartExperimentRequest, callback?: (err: AWSError, data: Evidently.Types.StartExperimentResponse) => void): Request<Evidently.Types.StartExperimentResponse, AWSError>;
  /**
   * Starts an existing experiment. To create an experiment, use CreateExperiment.
   */
  startExperiment(callback?: (err: AWSError, data: Evidently.Types.StartExperimentResponse) => void): Request<Evidently.Types.StartExperimentResponse, AWSError>;
  /**
   * Starts an existing launch. To create a launch, use CreateLaunch.
   */
  startLaunch(params: Evidently.Types.StartLaunchRequest, callback?: (err: AWSError, data: Evidently.Types.StartLaunchResponse) => void): Request<Evidently.Types.StartLaunchResponse, AWSError>;
  /**
   * Starts an existing launch. To create a launch, use CreateLaunch.
   */
  startLaunch(callback?: (err: AWSError, data: Evidently.Types.StartLaunchResponse) => void): Request<Evidently.Types.StartLaunchResponse, AWSError>;
  /**
   * Stops an experiment that is currently running. If you stop an experiment, you can't resume it or restart it.
   */
  stopExperiment(params: Evidently.Types.StopExperimentRequest, callback?: (err: AWSError, data: Evidently.Types.StopExperimentResponse) => void): Request<Evidently.Types.StopExperimentResponse, AWSError>;
  /**
   * Stops an experiment that is currently running. If you stop an experiment, you can't resume it or restart it.
   */
  stopExperiment(callback?: (err: AWSError, data: Evidently.Types.StopExperimentResponse) => void): Request<Evidently.Types.StopExperimentResponse, AWSError>;
  /**
   * Stops a launch that is currently running. After you stop a launch, you will not be able to resume it or restart it. Also, it will not be evaluated as a rule for traffic allocation, and the traffic that was allocated to the launch will instead be available to the feature's experiment, if there is one. Otherwise, all traffic will be served the default variation after the launch is stopped.
   */
  stopLaunch(params: Evidently.Types.StopLaunchRequest, callback?: (err: AWSError, data: Evidently.Types.StopLaunchResponse) => void): Request<Evidently.Types.StopLaunchResponse, AWSError>;
  /**
   * Stops a launch that is currently running. After you stop a launch, you will not be able to resume it or restart it. Also, it will not be evaluated as a rule for traffic allocation, and the traffic that was allocated to the launch will instead be available to the feature's experiment, if there is one. Otherwise, all traffic will be served the default variation after the launch is stopped.
   */
  stopLaunch(callback?: (err: AWSError, data: Evidently.Types.StopLaunchResponse) => void): Request<Evidently.Types.StopLaunchResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified CloudWatch Evidently resource. Projects, features, launches, and experiments can be tagged. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can use the TagResource action with a resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the list of tags associated with the alarm. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag. You can associate as many as 50 tags with a resource. For more information, see Tagging Amazon Web Services resources.
   */
  tagResource(params: Evidently.Types.TagResourceRequest, callback?: (err: AWSError, data: Evidently.Types.TagResourceResponse) => void): Request<Evidently.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified CloudWatch Evidently resource. Projects, features, launches, and experiments can be tagged. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can use the TagResource action with a resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the list of tags associated with the alarm. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag. You can associate as many as 50 tags with a resource. For more information, see Tagging Amazon Web Services resources.
   */
  tagResource(callback?: (err: AWSError, data: Evidently.Types.TagResourceResponse) => void): Request<Evidently.Types.TagResourceResponse, AWSError>;
  /**
   * Use this operation to test a rules pattern that you plan to use to create an audience segment. For more information about segments, see CreateSegment.
   */
  testSegmentPattern(params: Evidently.Types.TestSegmentPatternRequest, callback?: (err: AWSError, data: Evidently.Types.TestSegmentPatternResponse) => void): Request<Evidently.Types.TestSegmentPatternResponse, AWSError>;
  /**
   * Use this operation to test a rules pattern that you plan to use to create an audience segment. For more information about segments, see CreateSegment.
   */
  testSegmentPattern(callback?: (err: AWSError, data: Evidently.Types.TestSegmentPatternResponse) => void): Request<Evidently.Types.TestSegmentPatternResponse, AWSError>;
  /**
   * Removes one or more tags from the specified resource.
   */
  untagResource(params: Evidently.Types.UntagResourceRequest, callback?: (err: AWSError, data: Evidently.Types.UntagResourceResponse) => void): Request<Evidently.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified resource.
   */
  untagResource(callback?: (err: AWSError, data: Evidently.Types.UntagResourceResponse) => void): Request<Evidently.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates an Evidently experiment.  Don't use this operation to update an experiment's tag. Instead, use TagResource. 
   */
  updateExperiment(params: Evidently.Types.UpdateExperimentRequest, callback?: (err: AWSError, data: Evidently.Types.UpdateExperimentResponse) => void): Request<Evidently.Types.UpdateExperimentResponse, AWSError>;
  /**
   * Updates an Evidently experiment.  Don't use this operation to update an experiment's tag. Instead, use TagResource. 
   */
  updateExperiment(callback?: (err: AWSError, data: Evidently.Types.UpdateExperimentResponse) => void): Request<Evidently.Types.UpdateExperimentResponse, AWSError>;
  /**
   * Updates an existing feature. You can't use this operation to update the tags of an existing feature. Instead, use TagResource. 
   */
  updateFeature(params: Evidently.Types.UpdateFeatureRequest, callback?: (err: AWSError, data: Evidently.Types.UpdateFeatureResponse) => void): Request<Evidently.Types.UpdateFeatureResponse, AWSError>;
  /**
   * Updates an existing feature. You can't use this operation to update the tags of an existing feature. Instead, use TagResource. 
   */
  updateFeature(callback?: (err: AWSError, data: Evidently.Types.UpdateFeatureResponse) => void): Request<Evidently.Types.UpdateFeatureResponse, AWSError>;
  /**
   * Updates a launch of a given feature.  Don't use this operation to update the tags of an existing launch. Instead, use TagResource. 
   */
  updateLaunch(params: Evidently.Types.UpdateLaunchRequest, callback?: (err: AWSError, data: Evidently.Types.UpdateLaunchResponse) => void): Request<Evidently.Types.UpdateLaunchResponse, AWSError>;
  /**
   * Updates a launch of a given feature.  Don't use this operation to update the tags of an existing launch. Instead, use TagResource. 
   */
  updateLaunch(callback?: (err: AWSError, data: Evidently.Types.UpdateLaunchResponse) => void): Request<Evidently.Types.UpdateLaunchResponse, AWSError>;
  /**
   * Updates the description of an existing project. To create a new project, use CreateProject. Don't use this operation to update the data storage options of a project. Instead, use UpdateProjectDataDelivery.  Don't use this operation to update the tags of a project. Instead, use TagResource. 
   */
  updateProject(params: Evidently.Types.UpdateProjectRequest, callback?: (err: AWSError, data: Evidently.Types.UpdateProjectResponse) => void): Request<Evidently.Types.UpdateProjectResponse, AWSError>;
  /**
   * Updates the description of an existing project. To create a new project, use CreateProject. Don't use this operation to update the data storage options of a project. Instead, use UpdateProjectDataDelivery.  Don't use this operation to update the tags of a project. Instead, use TagResource. 
   */
  updateProject(callback?: (err: AWSError, data: Evidently.Types.UpdateProjectResponse) => void): Request<Evidently.Types.UpdateProjectResponse, AWSError>;
  /**
   * Updates the data storage options for this project. If you store evaluation events, you an keep them and analyze them on your own. If you choose not to store evaluation events, Evidently deletes them after using them to produce metrics and other experiment results that you can view. You can't specify both cloudWatchLogs and s3Destination in the same operation.
   */
  updateProjectDataDelivery(params: Evidently.Types.UpdateProjectDataDeliveryRequest, callback?: (err: AWSError, data: Evidently.Types.UpdateProjectDataDeliveryResponse) => void): Request<Evidently.Types.UpdateProjectDataDeliveryResponse, AWSError>;
  /**
   * Updates the data storage options for this project. If you store evaluation events, you an keep them and analyze them on your own. If you choose not to store evaluation events, Evidently deletes them after using them to produce metrics and other experiment results that you can view. You can't specify both cloudWatchLogs and s3Destination in the same operation.
   */
  updateProjectDataDelivery(callback?: (err: AWSError, data: Evidently.Types.UpdateProjectDataDeliveryResponse) => void): Request<Evidently.Types.UpdateProjectDataDeliveryResponse, AWSError>;
}
declare namespace Evidently {
  export type AppConfigResourceId = string;
  export type Arn = string;
  export interface BatchEvaluateFeatureRequest {
    /**
     * The name or ARN of the project that contains the feature being evaluated.
     */
    project: ProjectRef;
    /**
     * An array of structures, where each structure assigns a feature variation to one user session.
     */
    requests: EvaluationRequestsList;
  }
  export interface BatchEvaluateFeatureResponse {
    /**
     * An array of structures, where each structure displays the results of one feature evaluation assignment to one user session.
     */
    results?: EvaluationResultsList;
  }
  export type Boolean = boolean;
  export type ChangeDirectionEnum = "INCREASE"|"DECREASE"|string;
  export interface CloudWatchLogsDestination {
    /**
     * The name of the log group where the project stores evaluation events.
     */
    logGroup?: CwLogGroupSafeName;
  }
  export interface CloudWatchLogsDestinationConfig {
    /**
     * The name of the log group where the project stores evaluation events.
     */
    logGroup?: CwLogGroupSafeName;
  }
  export interface CreateExperimentRequest {
    /**
     * An optional description of the experiment.
     */
    description?: Description;
    /**
     * An array of structures that defines the metrics used for the experiment, and whether a higher or lower value for each metric is the goal.
     */
    metricGoals: MetricGoalConfigList;
    /**
     * A name for the new experiment.
     */
    name: ExperimentName;
    /**
     * A structure that contains the configuration of which variation to use as the "control" version. tThe "control" version is used for comparison with other variations. This structure also specifies how much experiment traffic is allocated to each variation.
     */
    onlineAbConfig?: OnlineAbConfig;
    /**
     * The name or ARN of the project that you want to create the new experiment in.
     */
    project: ProjectRef;
    /**
     * When Evidently assigns a particular user session to an experiment, it must use a randomization ID to determine which variation the user session is served. This randomization ID is a combination of the entity ID and randomizationSalt. If you omit randomizationSalt, Evidently uses the experiment name as the randomizationSalt.
     */
    randomizationSalt?: RandomizationSalt;
    /**
     * The portion of the available audience that you want to allocate to this experiment, in thousandths of a percent. The available audience is the total audience minus the audience that you have allocated to overrides or current launches of this feature. This is represented in thousandths of a percent. For example, specify 10,000 to allocate 10% of the available audience.
     */
    samplingRate?: SplitWeight;
    /**
     * Specifies an audience segment to use in the experiment. When a segment is used in an experiment, only user sessions that match the segment pattern are used in the experiment.
     */
    segment?: SegmentRef;
    /**
     * Assigns one or more tags (key-value pairs) to the experiment. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can associate as many as 50 tags with an experiment. For more information, see Tagging Amazon Web Services resources.
     */
    tags?: TagMap;
    /**
     * An array of structures that describe the configuration of each feature variation used in the experiment.
     */
    treatments: TreatmentConfigList;
  }
  export interface CreateExperimentResponse {
    /**
     * A structure containing the configuration details of the experiment that you created.
     */
    experiment: Experiment;
  }
  export interface CreateFeatureRequest {
    /**
     * The name of the variation to use as the default variation. The default variation is served to users who are not allocated to any ongoing launches or experiments of this feature. This variation must also be listed in the variations structure. If you omit defaultVariation, the first variation listed in the variations structure is used as the default variation.
     */
    defaultVariation?: VariationName;
    /**
     * An optional description of the feature.
     */
    description?: Description;
    /**
     * Specify users that should always be served a specific variation of a feature. Each user is specified by a key-value pair . For each key, specify a user by entering their user ID, account ID, or some other identifier. For the value, specify the name of the variation that they are to be served. This parameter is limited to 2500 overrides or a total of 40KB. The 40KB limit includes an overhead of 6 bytes per override.
     */
    entityOverrides?: EntityOverrideMap;
    /**
     * Specify ALL_RULES to activate the traffic allocation specified by any ongoing launches or experiments. Specify DEFAULT_VARIATION to serve the default variation to all users instead.
     */
    evaluationStrategy?: FeatureEvaluationStrategy;
    /**
     * The name for the new feature.
     */
    name: FeatureName;
    /**
     * The name or ARN of the project that is to contain the new feature.
     */
    project: ProjectRef;
    /**
     * Assigns one or more tags (key-value pairs) to the feature. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can associate as many as 50 tags with a feature. For more information, see Tagging Amazon Web Services resources.
     */
    tags?: TagMap;
    /**
     * An array of structures that contain the configuration of the feature's different variations.
     */
    variations: VariationConfigsList;
  }
  export interface CreateFeatureResponse {
    /**
     * A structure that contains information about the new feature.
     */
    feature?: Feature;
  }
  export interface CreateLaunchRequest {
    /**
     * An optional description for the launch.
     */
    description?: Description;
    /**
     * An array of structures that contains the feature and variations that are to be used for the launch.
     */
    groups: LaunchGroupConfigList;
    /**
     * An array of structures that define the metrics that will be used to monitor the launch performance.
     */
    metricMonitors?: MetricMonitorConfigList;
    /**
     * The name for the new launch.
     */
    name: LaunchName;
    /**
     * The name or ARN of the project that you want to create the launch in.
     */
    project: ProjectRef;
    /**
     * When Evidently assigns a particular user session to a launch, it must use a randomization ID to determine which variation the user session is served. This randomization ID is a combination of the entity ID and randomizationSalt. If you omit randomizationSalt, Evidently uses the launch name as the randomizationSalt.
     */
    randomizationSalt?: RandomizationSalt;
    /**
     * An array of structures that define the traffic allocation percentages among the feature variations during each step of the launch.
     */
    scheduledSplitsConfig?: ScheduledSplitsLaunchConfig;
    /**
     * Assigns one or more tags (key-value pairs) to the launch. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can associate as many as 50 tags with a launch. For more information, see Tagging Amazon Web Services resources.
     */
    tags?: TagMap;
  }
  export interface CreateLaunchResponse {
    /**
     * A structure that contains the configuration of the launch that was created.
     */
    launch: Launch;
  }
  export interface CreateProjectRequest {
    /**
     * Use this parameter if the project will use client-side evaluation powered by AppConfig. Client-side evaluation allows your application to assign variations to user sessions locally instead of by calling the EvaluateFeature operation. This mitigates the latency and availability risks that come with an API call. For more information, see  Client-side evaluation - powered by AppConfig.  This parameter is a structure that contains information about the AppConfig application and environment that will be used as for client-side evaluation. To create a project that uses client-side evaluation, you must have the evidently:ExportProjectAsConfiguration permission.
     */
    appConfigResource?: ProjectAppConfigResourceConfig;
    /**
     * A structure that contains information about where Evidently is to store evaluation events for longer term storage, if you choose to do so. If you choose not to store these events, Evidently deletes them after using them to produce metrics and other experiment results that you can view.
     */
    dataDelivery?: ProjectDataDeliveryConfig;
    /**
     * An optional description of the project.
     */
    description?: Description;
    /**
     * The name for the project.
     */
    name: ProjectName;
    /**
     * Assigns one or more tags (key-value pairs) to the project. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can associate as many as 50 tags with a project. For more information, see Tagging Amazon Web Services resources.
     */
    tags?: TagMap;
  }
  export interface CreateProjectResponse {
    /**
     * A structure that contains information about the created project.
     */
    project: Project;
  }
  export interface CreateSegmentRequest {
    /**
     * An optional description for this segment.
     */
    description?: Description;
    /**
     * A name for the segment.
     */
    name: SegmentName;
    /**
     * The pattern to use for the segment. For more information about pattern syntax, see  Segment rule pattern syntax.
     */
    pattern: SegmentPattern;
    /**
     * Assigns one or more tags (key-value pairs) to the segment. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can associate as many as 50 tags with a segment. For more information, see Tagging Amazon Web Services resources.
     */
    tags?: TagMap;
  }
  export interface CreateSegmentResponse {
    /**
     * A structure that contains the complete information about the segment that was just created.
     */
    segment: Segment;
  }
  export type CwDimensionSafeName = string;
  export type CwLogGroupSafeName = string;
  export interface DeleteExperimentRequest {
    /**
     * The name of the experiment to delete.
     */
    experiment: ExperimentName;
    /**
     * The name or ARN of the project that contains the experiment to delete.
     */
    project: ProjectRef;
  }
  export interface DeleteExperimentResponse {
  }
  export interface DeleteFeatureRequest {
    /**
     * The name of the feature to delete.
     */
    feature: FeatureName;
    /**
     * The name or ARN of the project that contains the feature to delete.
     */
    project: ProjectRef;
  }
  export interface DeleteFeatureResponse {
  }
  export interface DeleteLaunchRequest {
    /**
     * The name of the launch to delete.
     */
    launch: LaunchName;
    /**
     * The name or ARN of the project that contains the launch to delete.
     */
    project: ProjectRef;
  }
  export interface DeleteLaunchResponse {
  }
  export interface DeleteProjectRequest {
    /**
     * The name or ARN of the project to delete.
     */
    project: ProjectRef;
  }
  export interface DeleteProjectResponse {
  }
  export interface DeleteSegmentRequest {
    /**
     * Specifies the segment to delete.
     */
    segment: SegmentRef;
  }
  export interface DeleteSegmentResponse {
  }
  export type Description = string;
  export type Double = number;
  export type DoubleValueList = Double[];
  export type EntityId = string;
  export type EntityOverrideMap = {[key: string]: VariationName};
  export type ErrorCodeEnum = string;
  export type ErrorMessage = string;
  export interface EvaluateFeatureRequest {
    /**
     * An internal ID that represents a unique user of the application. This entityID is checked against any override rules assigned for this feature.
     */
    entityId: EntityId;
    /**
     * A JSON object of attributes that you can optionally pass in as part of the evaluation event sent to Evidently from the user session. Evidently can use this value to match user sessions with defined audience segments. For more information, see Use segments to focus your audience. If you include this parameter, the value must be a JSON object. A JSON array is not supported.
     */
    evaluationContext?: JsonValue;
    /**
     * The name of the feature being evaluated.
     */
    feature: FeatureName;
    /**
     * The name or ARN of the project that contains this feature.
     */
    project: ProjectRef;
  }
  export interface EvaluateFeatureResponse {
    /**
     * If this user was assigned to a launch or experiment, this field lists the launch or experiment name.
     */
    details?: JsonValue;
    /**
     * Specifies the reason that the user session was assigned this variation. Possible values include DEFAULT, meaning the user was served the default variation; LAUNCH_RULE_MATCH, if the user session was enrolled in a launch; EXPERIMENT_RULE_MATCH, if the user session was enrolled in an experiment; or ENTITY_OVERRIDES_MATCH, if the user's entityId matches an override rule.
     */
    reason?: String;
    /**
     * The value assigned to this variation to differentiate it from the other variations of this feature.
     */
    value?: VariableValue;
    /**
     * The name of the variation that was served to the user session.
     */
    variation?: String;
  }
  export interface EvaluationRequest {
    /**
     * An internal ID that represents a unique user session of the application. This entityID is checked against any override rules assigned for this feature.
     */
    entityId: EntityId;
    /**
     * A JSON block of attributes that you can optionally pass in. This JSON block is included in the evaluation events sent to Evidently from the user session. 
     */
    evaluationContext?: JsonValue;
    /**
     * The name of the feature being evaluated.
     */
    feature: FeatureName;
  }
  export type EvaluationRequestsList = EvaluationRequest[];
  export interface EvaluationResult {
    /**
     * If this user was assigned to a launch or experiment, this field lists the launch or experiment name.
     */
    details?: JsonValue;
    /**
     * An internal ID that represents a unique user session of the application.
     */
    entityId: EntityId;
    /**
     * The name of the feature being evaluated.
     */
    feature: FeatureName;
    /**
     * The name or ARN of the project that contains the feature being evaluated.
     */
    project?: Arn;
    /**
     * Specifies the reason that the user session was assigned this variation. Possible values include DEFAULT, meaning the user was served the default variation; LAUNCH_RULE_MATCH, if the user session was enrolled in a launch; or EXPERIMENT_RULE_MATCH, if the user session was enrolled in an experiment.
     */
    reason?: String;
    /**
     * The value assigned to this variation to differentiate it from the other variations of this feature.
     */
    value?: VariableValue;
    /**
     * The name of the variation that was served to the user session.
     */
    variation?: String;
  }
  export type EvaluationResultsList = EvaluationResult[];
  export interface EvaluationRule {
    /**
     * The name of the experiment or launch.
     */
    name?: RuleName;
    /**
     * This value is aws.evidently.splits if this is an evaluation rule for a launch, and it is aws.evidently.onlineab if this is an evaluation rule for an experiment.
     */
    type: RuleType;
  }
  export type EvaluationRulesList = EvaluationRule[];
  export interface Event {
    /**
     * The event data.
     */
    data: JsonValue;
    /**
     * The timestamp of the event.
     */
    timestamp: Timestamp;
    /**
     *  aws.evidently.evaluation specifies an evaluation event, which determines which feature variation that a user sees. aws.evidently.custom specifies a custom event, which generates metrics from user actions such as clicks and checkouts.
     */
    type: EventType;
  }
  export type EventList = Event[];
  export type EventType = "aws.evidently.evaluation"|"aws.evidently.custom"|string;
  export interface Experiment {
    /**
     * The ARN of the experiment.
     */
    arn: ExperimentArn;
    /**
     * The date and time that the experiment is first created.
     */
    createdTime: Timestamp;
    /**
     * A description of the experiment.
     */
    description?: Description;
    /**
     * A structure that contains the date and time that the experiment started and ended.
     */
    execution?: ExperimentExecution;
    /**
     * The date and time that the experiment was most recently updated.
     */
    lastUpdatedTime: Timestamp;
    /**
     * An array of structures that defines the metrics used for the experiment, and whether a higher or lower value for each metric is the goal.
     */
    metricGoals?: MetricGoalsList;
    /**
     * The name of the experiment.
     */
    name: ExperimentName;
    /**
     * A structure that contains the configuration of which variation to use as the "control" version. The "control" version is used for comparison with other variations. This structure also specifies how much experiment traffic is allocated to each variation.
     */
    onlineAbDefinition?: OnlineAbDefinition;
    /**
     * The name or ARN of the project that contains this experiment.
     */
    project?: ProjectArn;
    /**
     * This value is used when Evidently assigns a particular user session to the experiment. It helps create a randomization ID to determine which variation the user session is served. This randomization ID is a combination of the entity ID and randomizationSalt.
     */
    randomizationSalt?: RandomizationSalt;
    /**
     * In thousandths of a percent, the amount of the available audience that is allocated to this experiment. The available audience is the total audience minus the audience that you have allocated to overrides or current launches of this feature. This is represented in thousandths of a percent, so a value of 10,000 is 10% of the available audience.
     */
    samplingRate?: SplitWeight;
    /**
     * A structure that contains the time and date that Evidently completed the analysis of the experiment.
     */
    schedule?: ExperimentSchedule;
    /**
     * The audience segment being used for the experiment, if a segment is being used.
     */
    segment?: SegmentArn;
    /**
     * The current state of the experiment.
     */
    status: ExperimentStatus;
    /**
     * If the experiment was stopped, this is the string that was entered by the person who stopped the experiment, to explain why it was stopped.
     */
    statusReason?: Description;
    /**
     * The list of tag keys and values associated with this experiment.
     */
    tags?: TagMap;
    /**
     * An array of structures that describe the configuration of each feature variation used in the experiment.
     */
    treatments?: TreatmentList;
    /**
     * The type of this experiment. Currently, this value must be aws.experiment.onlineab.
     */
    type: ExperimentType;
  }
  export type ExperimentArn = string;
  export type ExperimentBaseStat = "Mean"|string;
  export interface ExperimentExecution {
    /**
     * The date and time that the experiment ended.
     */
    endedTime?: Timestamp;
    /**
     * The date and time that the experiment started.
     */
    startedTime?: Timestamp;
  }
  export type ExperimentList = Experiment[];
  export type ExperimentName = string;
  export interface ExperimentReport {
    /**
     * The content of the report.
     */
    content?: JsonValue;
    /**
     * The name of the metric that is analyzed in this experiment report.
     */
    metricName?: CwDimensionSafeName;
    /**
     * The type of analysis used for this report.
     */
    reportName?: ExperimentReportName;
    /**
     * The name of the variation that this report pertains to.
     */
    treatmentName?: TreatmentName;
  }
  export type ExperimentReportList = ExperimentReport[];
  export type ExperimentReportName = "BayesianInference"|string;
  export type ExperimentReportNameList = ExperimentReportName[];
  export type ExperimentResultRequestType = "BaseStat"|"TreatmentEffect"|"ConfidenceInterval"|"PValue"|string;
  export type ExperimentResultRequestTypeList = ExperimentResultRequestType[];
  export type ExperimentResultResponseType = "Mean"|"TreatmentEffect"|"ConfidenceIntervalUpperBound"|"ConfidenceIntervalLowerBound"|"PValue"|string;
  export interface ExperimentResultsData {
    /**
     * The name of the metric.
     */
    metricName?: CwDimensionSafeName;
    /**
     * The experiment statistic that these results pertain to.
     */
    resultStat?: ExperimentResultResponseType;
    /**
     * The treatment, or variation, that returned the values in this structure.
     */
    treatmentName?: TreatmentName;
    /**
     * The values for the metricName that were recorded in the experiment.
     */
    values?: DoubleValueList;
  }
  export type ExperimentResultsDataList = ExperimentResultsData[];
  export interface ExperimentSchedule {
    /**
     * The time and date that Evidently completed the analysis of the experiment.
     */
    analysisCompleteTime?: Timestamp;
  }
  export type ExperimentStatus = "CREATED"|"UPDATING"|"RUNNING"|"COMPLETED"|"CANCELLED"|string;
  export type ExperimentStopDesiredState = "COMPLETED"|"CANCELLED"|string;
  export type ExperimentType = "aws.evidently.onlineab"|string;
  export interface Feature {
    /**
     * The ARN of the feature.
     */
    arn: FeatureArn;
    /**
     * The date and time that the feature is created.
     */
    createdTime: Timestamp;
    /**
     * The name of the variation that is used as the default variation. The default variation is served to users who are not allocated to any ongoing launches or experiments of this feature. This variation must also be listed in the variations structure. If you omit defaultVariation, the first variation listed in the variations structure is used as the default variation.
     */
    defaultVariation?: VariationName;
    /**
     * The description of the feature.
     */
    description?: Description;
    /**
     * A set of key-value pairs that specify users who should always be served a specific variation of a feature. Each key specifies a user using their user ID, account ID, or some other identifier. The value specifies the name of the variation that the user is to be served. For the override to be successful, the value of the key must match the entityId used in the EvaluateFeature operation.
     */
    entityOverrides?: EntityOverrideMap;
    /**
     * An array of structures that define the evaluation rules for the feature.
     */
    evaluationRules?: EvaluationRulesList;
    /**
     * If this value is ALL_RULES, the traffic allocation specified by any ongoing launches or experiments is being used. If this is DEFAULT_VARIATION, the default variation is being served to all users.
     */
    evaluationStrategy: FeatureEvaluationStrategy;
    /**
     * The date and time that the feature was most recently updated.
     */
    lastUpdatedTime: Timestamp;
    /**
     * The name of the feature.
     */
    name: FeatureName;
    /**
     * The name or ARN of the project that contains the feature.
     */
    project?: ProjectArn;
    /**
     * The current state of the feature.
     */
    status: FeatureStatus;
    /**
     * The list of tag keys and values associated with this feature.
     */
    tags?: TagMap;
    /**
     * Defines the type of value used to define the different feature variations. For more information, see Variation types 
     */
    valueType: VariationValueType;
    /**
     * An array of structures that contain the configuration of the feature's different variations.
     */
    variations: VariationsList;
  }
  export type FeatureArn = string;
  export type FeatureEvaluationStrategy = "ALL_RULES"|"DEFAULT_VARIATION"|string;
  export type FeatureName = string;
  export type FeatureStatus = "AVAILABLE"|"UPDATING"|string;
  export type FeatureSummariesList = FeatureSummary[];
  export interface FeatureSummary {
    /**
     * The ARN of the feature.
     */
    arn: Arn;
    /**
     * The date and time that the feature is created.
     */
    createdTime: Timestamp;
    /**
     * The name of the variation that is used as the default variation. The default variation is served to users who are not allocated to any ongoing launches or experiments of this feature.
     */
    defaultVariation?: VariationName;
    /**
     * An array of structures that define
     */
    evaluationRules?: EvaluationRulesList;
    /**
     * If this value is ALL_RULES, the traffic allocation specified by any ongoing launches or experiments is being used. If this is DEFAULT_VARIATION, the default variation is being served to all users.
     */
    evaluationStrategy: FeatureEvaluationStrategy;
    /**
     * The date and time that the feature was most recently updated.
     */
    lastUpdatedTime: Timestamp;
    /**
     * The name of the feature.
     */
    name: FeatureName;
    /**
     * The name or ARN of the project that contains the feature.
     */
    project?: ProjectRef;
    /**
     * The current state of the feature.
     */
    status: FeatureStatus;
    /**
     * The list of tag keys and values associated with this feature.
     */
    tags?: TagMap;
  }
  export type FeatureToVariationMap = {[key: string]: VariationName};
  export interface GetExperimentRequest {
    /**
     * The name of the experiment that you want to see the details of.
     */
    experiment: ExperimentName;
    /**
     * The name or ARN of the project that contains the experiment.
     */
    project: ProjectRef;
  }
  export interface GetExperimentResponse {
    /**
     * A structure containing the configuration details of the experiment.
     */
    experiment?: Experiment;
  }
  export interface GetExperimentResultsRequest {
    /**
     * The statistic used to calculate experiment results. Currently the only valid value is mean, which uses the mean of the collected values as the statistic.
     */
    baseStat?: ExperimentBaseStat;
    /**
     * The date and time that the experiment ended, if it is completed. This must be no longer than 30 days after the experiment start time.
     */
    endTime?: Timestamp;
    /**
     * The name of the experiment to retrieve the results of.
     */
    experiment: ExperimentName;
    /**
     * The names of the experiment metrics that you want to see the results of.
     */
    metricNames: MetricNameList;
    /**
     * In seconds, the amount of time to aggregate results together. 
     */
    period?: ResultsPeriod;
    /**
     * The name or ARN of the project that contains the experiment that you want to see the results of.
     */
    project: ProjectRef;
    /**
     * The names of the report types that you want to see. Currently, BayesianInference is the only valid value.
     */
    reportNames?: ExperimentReportNameList;
    /**
     * The statistics that you want to see in the returned results.    PValue specifies to use p-values for the results. A p-value is used in hypothesis testing to measure how often you are willing to make a mistake in rejecting the null hypothesis. A general practice is to reject the null hypothesis and declare that the results are statistically significant when the p-value is less than 0.05.    ConfidenceInterval specifies a confidence interval for the results. The confidence interval represents the range of values for the chosen metric that is likely to contain the true difference between the baseStat of a variation and the baseline. Evidently returns the 95% confidence interval.     TreatmentEffect is the difference in the statistic specified by the baseStat parameter between each variation and the default variation.     BaseStat returns the statistical values collected for the metric for each variation. The statistic uses the same statistic specified in the baseStat parameter. Therefore, if baseStat is mean, this returns the mean of the values collected for each variation.  
     */
    resultStats?: ExperimentResultRequestTypeList;
    /**
     * The date and time that the experiment started.
     */
    startTime?: Timestamp;
    /**
     * The names of the experiment treatments that you want to see the results for.
     */
    treatmentNames: TreatmentNameList;
  }
  export interface GetExperimentResultsResponse {
    /**
     * If the experiment doesn't yet have enough events to provide valid results, this field is returned with the message Not enough events to generate results. If there are enough events to provide valid results, this field is not returned.
     */
    details?: String;
    /**
     * An array of structures that include the reports that you requested.
     */
    reports?: ExperimentReportList;
    /**
     * An array of structures that include experiment results including metric names and values. 
     */
    resultsData?: ExperimentResultsDataList;
    /**
     * The timestamps of each result returned.
     */
    timestamps?: TimestampList;
  }
  export interface GetFeatureRequest {
    /**
     * The name of the feature that you want to retrieve information for.
     */
    feature: FeatureName;
    /**
     * The name or ARN of the project that contains the feature.
     */
    project: ProjectRef;
  }
  export interface GetFeatureResponse {
    /**
     * A structure containing the configuration details of the feature.
     */
    feature: Feature;
  }
  export interface GetLaunchRequest {
    /**
     * The name of the launch that you want to see the details of.
     */
    launch: LaunchName;
    /**
     * The name or ARN of the project that contains the launch.
     */
    project: ProjectRef;
  }
  export interface GetLaunchResponse {
    /**
     * A structure containing the configuration details of the launch.
     */
    launch?: Launch;
  }
  export interface GetProjectRequest {
    /**
     * The name or ARN of the project that you want to see the details of.
     */
    project: ProjectRef;
  }
  export interface GetProjectResponse {
    /**
     * A structure containing the configuration details of the project.
     */
    project: Project;
  }
  export interface GetSegmentRequest {
    /**
     * The ARN of the segment to return information for.
     */
    segment: SegmentRef;
  }
  export interface GetSegmentResponse {
    /**
     * A structure that contains the complete information about the segment.
     */
    segment: Segment;
  }
  export type GroupName = string;
  export type GroupToWeightMap = {[key: string]: SplitWeight};
  export type Integer = number;
  export type JsonPath = string;
  export type JsonValue = string;
  export interface Launch {
    /**
     * The ARN of the launch.
     */
    arn: LaunchArn;
    /**
     * The date and time that the launch is created.
     */
    createdTime: Timestamp;
    /**
     * The description of the launch.
     */
    description?: Description;
    /**
     * A structure that contains information about the start and end times of the launch.
     */
    execution?: LaunchExecution;
    /**
     * An array of structures that define the feature variations that are being used in the launch.
     */
    groups?: LaunchGroupList;
    /**
     * The date and time that the launch was most recently updated.
     */
    lastUpdatedTime: Timestamp;
    /**
     * An array of structures that define the metrics that are being used to monitor the launch performance.
     */
    metricMonitors?: MetricMonitorList;
    /**
     * The name of the launch.
     */
    name: LaunchName;
    /**
     * The name or ARN of the project that contains the launch.
     */
    project?: ProjectRef;
    /**
     * This value is used when Evidently assigns a particular user session to the launch, to help create a randomization ID to determine which variation the user session is served. This randomization ID is a combination of the entity ID and randomizationSalt.
     */
    randomizationSalt?: RandomizationSalt;
    /**
     * An array of structures that define the traffic allocation percentages among the feature variations during each step of the launch.
     */
    scheduledSplitsDefinition?: ScheduledSplitsLaunchDefinition;
    /**
     * The current state of the launch.
     */
    status: LaunchStatus;
    /**
     * If the launch was stopped, this is the string that was entered by the person who stopped the launch, to explain why it was stopped.
     */
    statusReason?: Description;
    /**
     * The list of tag keys and values associated with this launch.
     */
    tags?: TagMap;
    /**
     * The type of launch.
     */
    type: LaunchType;
  }
  export type LaunchArn = string;
  export interface LaunchExecution {
    /**
     * The date and time that the launch ended.
     */
    endedTime?: Timestamp;
    /**
     * The date and time that the launch started.
     */
    startedTime?: Timestamp;
  }
  export interface LaunchGroup {
    /**
     * A description of the launch group.
     */
    description?: Description;
    /**
     * The feature variation for this launch group. This is a key-value pair.
     */
    featureVariations: FeatureToVariationMap;
    /**
     * The name of the launch group.
     */
    name: GroupName;
  }
  export interface LaunchGroupConfig {
    /**
     * A description of the launch group.
     */
    description?: Description;
    /**
     * The feature that this launch is using.
     */
    feature: FeatureName;
    /**
     * A name for this launch group.
     */
    name: GroupName;
    /**
     * The feature variation to use for this launch group.
     */
    variation: VariationName;
  }
  export type LaunchGroupConfigList = LaunchGroupConfig[];
  export type LaunchGroupList = LaunchGroup[];
  export type LaunchName = string;
  export type LaunchStatus = "CREATED"|"UPDATING"|"RUNNING"|"COMPLETED"|"CANCELLED"|string;
  export type LaunchStopDesiredState = "COMPLETED"|"CANCELLED"|string;
  export type LaunchType = "aws.evidently.splits"|string;
  export type LaunchesList = Launch[];
  export interface ListExperimentsRequest {
    /**
     * The maximum number of results to include in the response.
     */
    maxResults?: MaxExperiments;
    /**
     * The token to use when requesting the next set of results. You received this token from a previous ListExperiments operation.
     */
    nextToken?: NextToken;
    /**
     * The name or ARN of the project to return the experiment list from.
     */
    project: ProjectRef;
    /**
     * Use this optional parameter to limit the returned results to only the experiments with the status that you specify here.
     */
    status?: ExperimentStatus;
  }
  export interface ListExperimentsResponse {
    /**
     * An array of structures that contain the configuration details of the experiments in the specified project.
     */
    experiments?: ExperimentList;
    /**
     * The token to use in a subsequent ListExperiments operation to return the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListFeaturesRequest {
    /**
     * The maximum number of results to include in the response.
     */
    maxResults?: MaxFeatures;
    /**
     * The token to use when requesting the next set of results. You received this token from a previous ListFeatures operation.
     */
    nextToken?: NextToken;
    /**
     * The name or ARN of the project to return the feature list from.
     */
    project: ProjectRef;
  }
  export interface ListFeaturesResponse {
    /**
     * An array of structures that contain the configuration details of the features in the specified project.
     */
    features?: FeatureSummariesList;
    /**
     * The token to use in a subsequent ListFeatures operation to return the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListLaunchesRequest {
    /**
     * The maximum number of results to include in the response.
     */
    maxResults?: MaxLaunches;
    /**
     * The token to use when requesting the next set of results. You received this token from a previous ListLaunches operation.
     */
    nextToken?: NextToken;
    /**
     * The name or ARN of the project to return the launch list from.
     */
    project: ProjectRef;
    /**
     * Use this optional parameter to limit the returned results to only the launches with the status that you specify here.
     */
    status?: LaunchStatus;
  }
  export interface ListLaunchesResponse {
    /**
     * An array of structures that contain the configuration details of the launches in the specified project.
     */
    launches?: LaunchesList;
    /**
     * The token to use in a subsequent ListLaunches operation to return the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListProjectsRequest {
    /**
     * The maximum number of results to include in the response.
     */
    maxResults?: MaxProjects;
    /**
     * The token to use when requesting the next set of results. You received this token from a previous ListProjects operation.
     */
    nextToken?: NextToken;
  }
  export interface ListProjectsResponse {
    /**
     * The token to use in a subsequent ListProjects operation to return the next set of results.
     */
    nextToken?: NextToken;
    /**
     * An array of structures that contain the configuration details of the projects in the Region.
     */
    projects?: ProjectSummariesList;
  }
  export interface ListSegmentReferencesRequest {
    /**
     * The maximum number of results to include in the response. If you omit this, the default of 50 is used.
     */
    maxResults?: MaxReferences;
    /**
     * The token to use when requesting the next set of results. You received this token from a previous ListSegmentReferences operation.
     */
    nextToken?: NextToken;
    /**
     * The ARN of the segment that you want to view information for.
     */
    segment: SegmentRef;
    /**
     * Specifies whether to return information about launches or experiments that use this segment.
     */
    type: SegmentReferenceResourceType;
  }
  export interface ListSegmentReferencesResponse {
    /**
     * The token to use in a subsequent ListSegmentReferences operation to return the next set of results.
     */
    nextToken?: NextToken;
    /**
     * An array of structures, where each structure contains information about one experiment or launch that uses this segment. 
     */
    referencedBy?: RefResourceList;
  }
  export interface ListSegmentsRequest {
    /**
     * The maximum number of results to include in the response. If you omit this, the default of 50 is used.
     */
    maxResults?: MaxSegments;
    /**
     * The token to use when requesting the next set of results. You received this token from a previous ListSegments operation.
     */
    nextToken?: NextToken;
  }
  export interface ListSegmentsResponse {
    /**
     * The token to use in a subsequent ListSegments operation to return the next set of results.
     */
    nextToken?: NextToken;
    /**
     * An array of structures that contain information about the segments in this Region.
     */
    segments?: SegmentList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource that you want to see the tags of.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The list of tag keys and values associated with the resource you specified.
     */
    tags?: TagMap;
  }
  export type Long = number;
  export type MaxExperiments = number;
  export type MaxFeatures = number;
  export type MaxLaunches = number;
  export type MaxProjects = number;
  export type MaxReferences = number;
  export type MaxSegments = number;
  export interface MetricDefinition {
    /**
     * The entity, such as a user or session, that does an action that causes a metric value to be recorded.
     */
    entityIdKey?: JsonPath;
    /**
     * The EventBridge event pattern that defines how the metric is recorded. For more information about EventBridge event patterns, see Amazon EventBridge event patterns.
     */
    eventPattern?: JsonValue;
    /**
     * The name of the metric.
     */
    name?: CwDimensionSafeName;
    /**
     * The label for the units that the metric is measuring.
     */
    unitLabel?: MetricUnitLabel;
    /**
     * The value that is tracked to produce the metric.
     */
    valueKey?: JsonPath;
  }
  export interface MetricDefinitionConfig {
    /**
     * The entity, such as a user or session, that does an action that causes a metric value to be recorded. An example is userDetails.userID.
     */
    entityIdKey: JsonPath;
    /**
     * The EventBridge event pattern that defines how the metric is recorded. For more information about EventBridge event patterns, see Amazon EventBridge event patterns.
     */
    eventPattern?: MetricDefinitionConfigEventPatternString;
    /**
     * A name for the metric.
     */
    name: CwDimensionSafeName;
    /**
     * A label for the units that the metric is measuring.
     */
    unitLabel?: MetricUnitLabel;
    /**
     * The value that is tracked to produce the metric.
     */
    valueKey: JsonPath;
  }
  export type MetricDefinitionConfigEventPatternString = string;
  export interface MetricGoal {
    /**
     *  INCREASE means that a variation with a higher number for this metric is performing better.  DECREASE means that a variation with a lower number for this metric is performing better.
     */
    desiredChange?: ChangeDirectionEnum;
    /**
     * A structure that contains details about the metric.
     */
    metricDefinition: MetricDefinition;
  }
  export interface MetricGoalConfig {
    /**
     *  INCREASE means that a variation with a higher number for this metric is performing better.  DECREASE means that a variation with a lower number for this metric is performing better.
     */
    desiredChange?: ChangeDirectionEnum;
    /**
     * A structure that contains details about the metric.
     */
    metricDefinition: MetricDefinitionConfig;
  }
  export type MetricGoalConfigList = MetricGoalConfig[];
  export type MetricGoalsList = MetricGoal[];
  export interface MetricMonitor {
    /**
     * A structure that defines the metric.
     */
    metricDefinition: MetricDefinition;
  }
  export interface MetricMonitorConfig {
    /**
     * A structure that defines the metric.
     */
    metricDefinition: MetricDefinitionConfig;
  }
  export type MetricMonitorConfigList = MetricMonitorConfig[];
  export type MetricMonitorList = MetricMonitor[];
  export type MetricNameList = CwDimensionSafeName[];
  export type MetricUnitLabel = string;
  export type NextToken = string;
  export interface OnlineAbConfig {
    /**
     * The name of the variation that is to be the default variation that the other variations are compared to.
     */
    controlTreatmentName?: TreatmentName;
    /**
     * A set of key-value pairs. The keys are variation names, and the values are the portion of experiment traffic to be assigned to that variation. Specify the traffic portion in thousandths of a percent, so 20,000 for a variation would allocate 20% of the experiment traffic to that variation.
     */
    treatmentWeights?: TreatmentToWeightMap;
  }
  export interface OnlineAbDefinition {
    /**
     * The name of the variation that is the default variation that the other variations are compared to.
     */
    controlTreatmentName?: TreatmentName;
    /**
     * A set of key-value pairs. The keys are variation names, and the values are the portion of experiment traffic to be assigned to that variation. The traffic portion is specified in thousandths of a percent, so 20,000 for a variation would allocate 20% of the experiment traffic to that variation.
     */
    treatmentWeights?: TreatmentToWeightMap;
  }
  export type PrimitiveBoolean = boolean;
  export interface Project {
    /**
     * The number of ongoing experiments currently in the project.
     */
    activeExperimentCount?: Long;
    /**
     * The number of ongoing launches currently in the project.
     */
    activeLaunchCount?: Long;
    /**
     * This structure defines the configuration of how your application integrates with AppConfig to run client-side evaluation.
     */
    appConfigResource?: ProjectAppConfigResource;
    /**
     * The name or ARN of the project.
     */
    arn: ProjectArn;
    /**
     * The date and time that the project is created.
     */
    createdTime: Timestamp;
    /**
     * A structure that contains information about where Evidently is to store evaluation events for longer term storage.
     */
    dataDelivery?: ProjectDataDelivery;
    /**
     * The user-entered description of the project.
     */
    description?: Description;
    /**
     * The number of experiments currently in the project. This includes all experiments that have been created and not deleted, whether they are ongoing or not.
     */
    experimentCount?: Long;
    /**
     * The number of features currently in the project.
     */
    featureCount?: Long;
    /**
     * The date and time that the project was most recently updated.
     */
    lastUpdatedTime: Timestamp;
    /**
     * The number of launches currently in the project. This includes all launches that have been created and not deleted, whether they are ongoing or not.
     */
    launchCount?: Long;
    /**
     * The name of the project.
     */
    name: ProjectName;
    /**
     * The current state of the project.
     */
    status: ProjectStatus;
    /**
     * The list of tag keys and values associated with this project.
     */
    tags?: TagMap;
  }
  export interface ProjectAppConfigResource {
    /**
     * The ID of the AppConfig application to use for client-side evaluation. 
     */
    applicationId: AppConfigResourceId;
    /**
     * The ID of the AppConfig profile to use for client-side evaluation. 
     */
    configurationProfileId: AppConfigResourceId;
    /**
     * The ID of the AppConfig environment to use for client-side evaluation. This must be an environment that is within the application that you specify for applicationId.
     */
    environmentId: AppConfigResourceId;
  }
  export interface ProjectAppConfigResourceConfig {
    /**
     * The ID of the AppConfig application to use for client-side evaluation. 
     */
    applicationId?: AppConfigResourceId;
    /**
     * The ID of the AppConfig environment to use for client-side evaluation. This must be an environment that is within the application that you specify for applicationId.
     */
    environmentId?: AppConfigResourceId;
  }
  export type ProjectArn = string;
  export interface ProjectDataDelivery {
    /**
     * If the project stores evaluation events in CloudWatch Logs, this structure stores the log group name.
     */
    cloudWatchLogs?: CloudWatchLogsDestination;
    /**
     * If the project stores evaluation events in an Amazon S3 bucket, this structure stores the bucket name and bucket prefix.
     */
    s3Destination?: S3Destination;
  }
  export interface ProjectDataDeliveryConfig {
    /**
     * If the project stores evaluation events in CloudWatch Logs, this structure stores the log group name.
     */
    cloudWatchLogs?: CloudWatchLogsDestinationConfig;
    /**
     * If the project stores evaluation events in an Amazon S3 bucket, this structure stores the bucket name and bucket prefix.
     */
    s3Destination?: S3DestinationConfig;
  }
  export type ProjectName = string;
  export type ProjectRef = string;
  export type ProjectStatus = "AVAILABLE"|"UPDATING"|string;
  export type ProjectSummariesList = ProjectSummary[];
  export interface ProjectSummary {
    /**
     * The number of experiments currently in the project.
     */
    activeExperimentCount?: Long;
    /**
     * The number of ongoing launches currently in the project.
     */
    activeLaunchCount?: Long;
    /**
     * The name or ARN of the project.
     */
    arn: ProjectArn;
    /**
     * The date and time that the project is created.
     */
    createdTime: Timestamp;
    /**
     * The description of the project.
     */
    description?: Description;
    /**
     * The number of experiments currently in the project.
     */
    experimentCount?: Long;
    /**
     * The number of features currently in the project.
     */
    featureCount?: Long;
    /**
     * The date and time that the project was most recently updated.
     */
    lastUpdatedTime: Timestamp;
    /**
     * The number of launches currently in the project, including launches that are ongoing, completed, and not started yet.
     */
    launchCount?: Long;
    /**
     * The name of the project.
     */
    name: ProjectName;
    /**
     * The current state of the project.
     */
    status: ProjectStatus;
    /**
     * The list of tag keys and values associated with this project.
     */
    tags?: TagMap;
  }
  export interface PutProjectEventsRequest {
    /**
     * An array of event structures that contain the performance data that is being sent to Evidently.
     */
    events: EventList;
    /**
     * The name or ARN of the project to write the events to.
     */
    project: ProjectRef;
  }
  export interface PutProjectEventsResponse {
    /**
     * A structure that contains Evidently's response to the sent events, including an event ID and error codes, if any.
     */
    eventResults?: PutProjectEventsResultEntryList;
    /**
     * The number of events in the operation that could not be used by Evidently.
     */
    failedEventCount?: Integer;
  }
  export interface PutProjectEventsResultEntry {
    /**
     * If the PutProjectEvents operation has an error, the error code is returned here.
     */
    errorCode?: ErrorCodeEnum;
    /**
     * If the PutProjectEvents operation has an error, the error message is returned here.
     */
    errorMessage?: ErrorMessage;
    /**
     * A unique ID assigned to this PutProjectEvents operation. 
     */
    eventId?: Uuid;
  }
  export type PutProjectEventsResultEntryList = PutProjectEventsResultEntry[];
  export type RandomizationSalt = string;
  export interface RefResource {
    /**
     * The ARN of the experiment or launch.
     */
    arn?: String;
    /**
     * The day and time that this experiment or launch ended.
     */
    endTime?: String;
    /**
     * The day and time that this experiment or launch was most recently updated.
     */
    lastUpdatedOn?: String;
    /**
     * The name of the experiment or launch.
     */
    name: String;
    /**
     * The day and time that this experiment or launch started.
     */
    startTime?: String;
    /**
     * The status of the experiment or launch.
     */
    status?: String;
    /**
     * Specifies whether the resource that this structure contains information about is an experiment or a launch.
     */
    type: String;
  }
  export type RefResourceList = RefResource[];
  export type ResultsPeriod = number;
  export type RuleName = string;
  export type RuleType = string;
  export type S3BucketSafeName = string;
  export interface S3Destination {
    /**
     * The name of the bucket in which Evidently stores evaluation events.
     */
    bucket?: S3BucketSafeName;
    /**
     * The bucket prefix in which Evidently stores evaluation events.
     */
    prefix?: S3PrefixSafeName;
  }
  export interface S3DestinationConfig {
    /**
     * The name of the bucket in which Evidently stores evaluation events.
     */
    bucket?: S3BucketSafeName;
    /**
     * The bucket prefix in which Evidently stores evaluation events.
     */
    prefix?: S3PrefixSafeName;
  }
  export type S3PrefixSafeName = string;
  export interface ScheduledSplit {
    /**
     * The traffic allocation percentages among the feature variations during one step of a launch. This is a set of key-value pairs. The keys are variation names. The values represent the percentage of traffic to allocate to that variation during this step. The values is expressed in thousandths of a percent, so assigning a weight of 50000 assigns 50% of traffic to that variation. If the sum of the weights for all the variations in a segment override does not add up to 100,000, then the remaining traffic that matches this segment is not assigned by this segment override, and instead moves on to the next segment override or the default traffic split.
     */
    groupWeights?: GroupToWeightMap;
    /**
     * Use this parameter to specify different traffic splits for one or more audience segments. A segment is a portion of your audience that share one or more characteristics. Examples could be Chrome browser users, users in Europe, or Firefox browser users in Europe who also fit other criteria that your application collects, such as age. This parameter is an array of up to six segment override objects. Each of these objects specifies a segment that you have already created, and defines the traffic split for that segment.
     */
    segmentOverrides?: SegmentOverridesList;
    /**
     * The date and time that this step of the launch starts.
     */
    startTime: Timestamp;
  }
  export interface ScheduledSplitConfig {
    /**
     * The traffic allocation percentages among the feature variations during one step of a launch. This is a set of key-value pairs. The keys are variation names. The values represent the percentage of traffic to allocate to that variation during this step. The values is expressed in thousandths of a percent, so assigning a weight of 50000 assigns 50% of traffic to that variation. If the sum of the weights for all the variations in a segment override does not add up to 100,000, then the remaining traffic that matches this segment is not assigned by this segment override, and instead moves on to the next segment override or the default traffic split.
     */
    groupWeights: GroupToWeightMap;
    /**
     * Use this parameter to specify different traffic splits for one or more audience segments. A segment is a portion of your audience that share one or more characteristics. Examples could be Chrome browser users, users in Europe, or Firefox browser users in Europe who also fit other criteria that your application collects, such as age. This parameter is an array of up to six segment override objects. Each of these objects specifies a segment that you have already created, and defines the traffic split for that segment.
     */
    segmentOverrides?: SegmentOverridesList;
    /**
     * The date and time that this step of the launch starts.
     */
    startTime: Timestamp;
  }
  export type ScheduledSplitConfigList = ScheduledSplitConfig[];
  export interface ScheduledSplitsLaunchConfig {
    /**
     * An array of structures that define the traffic allocation percentages among the feature variations during each step of the launch. This also defines the start time of each step.
     */
    steps: ScheduledSplitConfigList;
  }
  export interface ScheduledSplitsLaunchDefinition {
    /**
     * An array of structures that define the traffic allocation percentages among the feature variations during each step of the launch. This also defines the start time of each step.
     */
    steps?: ScheduledStepList;
  }
  export type ScheduledStepList = ScheduledSplit[];
  export interface Segment {
    /**
     * The ARN of the segment.
     */
    arn: SegmentArn;
    /**
     * The date and time that this segment was created.
     */
    createdTime: Timestamp;
    /**
     * The customer-created description for this segment.
     */
    description?: Description;
    /**
     * The number of experiments that this segment is used in. This count includes all current experiments, not just those that are currently running.
     */
    experimentCount?: Long;
    /**
     * The date and time that this segment was most recently updated.
     */
    lastUpdatedTime: Timestamp;
    /**
     * The number of launches that this segment is used in. This count includes all current launches, not just those that are currently running.
     */
    launchCount?: Long;
    /**
     * The name of the segment.
     */
    name: SegmentName;
    /**
     * The pattern that defines the attributes to use to evalute whether a user session will be in the segment. For more information about the pattern syntax, see Segment rule pattern syntax.
     */
    pattern: SegmentPattern;
    /**
     * The list of tag keys and values associated with this launch.
     */
    tags?: TagMap;
  }
  export type SegmentArn = string;
  export type SegmentList = Segment[];
  export type SegmentName = string;
  export interface SegmentOverride {
    /**
     * A number indicating the order to use to evaluate segment overrides, if there are more than one. Segment overrides with lower numbers are evaluated first.
     */
    evaluationOrder: Long;
    /**
     * The ARN of the segment to use.
     */
    segment: SegmentRef;
    /**
     * The traffic allocation percentages among the feature variations to assign to this segment. This is a set of key-value pairs. The keys are variation names. The values represent the amount of traffic to allocate to that variation for this segment. This is expressed in thousandths of a percent, so a weight of 50000 represents 50% of traffic.
     */
    weights: GroupToWeightMap;
  }
  export type SegmentOverridesList = SegmentOverride[];
  export type SegmentPattern = string;
  export type SegmentRef = string;
  export type SegmentReferenceResourceType = "EXPERIMENT"|"LAUNCH"|string;
  export type SplitWeight = number;
  export interface StartExperimentRequest {
    /**
     * The date and time to end the experiment. This must be no more than 30 days after the experiment starts.
     */
    analysisCompleteTime: Timestamp;
    /**
     * The name of the experiment to start.
     */
    experiment: ExperimentName;
    /**
     * The name or ARN of the project that contains the experiment to start.
     */
    project: ProjectRef;
  }
  export interface StartExperimentResponse {
    /**
     * A timestamp that indicates when the experiment started.
     */
    startedTime?: Timestamp;
  }
  export interface StartLaunchRequest {
    /**
     * The name of the launch to start.
     */
    launch: LaunchName;
    /**
     * The name or ARN of the project that contains the launch to start.
     */
    project: ProjectRef;
  }
  export interface StartLaunchResponse {
    /**
     * A structure that contains information about the launch that was started.
     */
    launch: Launch;
  }
  export interface StopExperimentRequest {
    /**
     * Specify whether the experiment is to be considered COMPLETED or CANCELLED after it stops.
     */
    desiredState?: ExperimentStopDesiredState;
    /**
     * The name of the experiment to stop.
     */
    experiment: ExperimentName;
    /**
     * The name or ARN of the project that contains the experiment to stop.
     */
    project: ProjectRef;
    /**
     * A string that describes why you are stopping the experiment.
     */
    reason?: Description;
  }
  export interface StopExperimentResponse {
    /**
     * The date and time that the experiment stopped.
     */
    endedTime?: Timestamp;
  }
  export interface StopLaunchRequest {
    /**
     * Specify whether to consider the launch as COMPLETED or CANCELLED after it stops.
     */
    desiredState?: LaunchStopDesiredState;
    /**
     * The name of the launch to stop.
     */
    launch: LaunchName;
    /**
     * The name or ARN of the project that contains the launch that you want to stop.
     */
    project: ProjectRef;
    /**
     * A string that describes why you are stopping the launch.
     */
    reason?: Description;
  }
  export interface StopLaunchResponse {
    /**
     * The date and time that the launch stopped.
     */
    endedTime?: Timestamp;
  }
  export type String = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The ARN of the CloudWatch Evidently resource that you're adding tags to.
     */
    resourceArn: Arn;
    /**
     * The list of key-value pairs to associate with the resource.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface TestSegmentPatternRequest {
    /**
     * The pattern to test.
     */
    pattern: SegmentPattern;
    /**
     * A sample evaluationContext JSON block to test against the specified pattern.
     */
    payload: JsonValue;
  }
  export interface TestSegmentPatternResponse {
    /**
     * Returns true if the pattern matches the payload.
     */
    match: Boolean;
  }
  export type Timestamp = Date;
  export type TimestampList = Timestamp[];
  export interface Treatment {
    /**
     * The description of the treatment.
     */
    description?: Description;
    /**
     * The feature variation used for this treatment. This is a key-value pair. The key is the feature name, and the value is the variation name.
     */
    featureVariations?: FeatureToVariationMap;
    /**
     * The name of this treatment.
     */
    name: TreatmentName;
  }
  export interface TreatmentConfig {
    /**
     * A description for this treatment.
     */
    description?: Description;
    /**
     * The feature that this experiment is testing.
     */
    feature: FeatureName;
    /**
     * A name for this treatment.
     */
    name: TreatmentName;
    /**
     * The name of the variation to use as this treatment in the experiment.
     */
    variation: VariationName;
  }
  export type TreatmentConfigList = TreatmentConfig[];
  export type TreatmentList = Treatment[];
  export type TreatmentName = string;
  export type TreatmentNameList = TreatmentName[];
  export type TreatmentToWeightMap = {[key: string]: SplitWeight};
  export interface UntagResourceRequest {
    /**
     * The ARN of the CloudWatch Evidently resource that you're removing tags from.
     */
    resourceArn: Arn;
    /**
     * The list of tag keys to remove from the resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateExperimentRequest {
    /**
     * An optional description of the experiment.
     */
    description?: Description;
    /**
     * The name of the experiment to update.
     */
    experiment: ExperimentName;
    /**
     * An array of structures that defines the metrics used for the experiment, and whether a higher or lower value for each metric is the goal.
     */
    metricGoals?: MetricGoalConfigList;
    /**
     * A structure that contains the configuration of which variation o use as the "control" version. The "control" version is used for comparison with other variations. This structure also specifies how much experiment traffic is allocated to each variation.
     */
    onlineAbConfig?: OnlineAbConfig;
    /**
     * The name or ARN of the project that contains the experiment that you want to update.
     */
    project: ProjectRef;
    /**
     * When Evidently assigns a particular user session to an experiment, it must use a randomization ID to determine which variation the user session is served. This randomization ID is a combination of the entity ID and randomizationSalt. If you omit randomizationSalt, Evidently uses the experiment name as the randomizationSalt.
     */
    randomizationSalt?: RandomizationSalt;
    /**
     * Removes a segment from being used in an experiment. You can't use this parameter if the experiment is currently running.
     */
    removeSegment?: PrimitiveBoolean;
    /**
     * The portion of the available audience that you want to allocate to this experiment, in thousandths of a percent. The available audience is the total audience minus the audience that you have allocated to overrides or current launches of this feature. This is represented in thousandths of a percent. For example, specify 20,000 to allocate 20% of the available audience.
     */
    samplingRate?: SplitWeight;
    /**
     * Adds an audience segment to an experiment. When a segment is used in an experiment, only user sessions that match the segment pattern are used in the experiment. You can't use this parameter if the experiment is currently running.
     */
    segment?: SegmentRef;
    /**
     * An array of structures that define the variations being tested in the experiment.
     */
    treatments?: TreatmentConfigList;
  }
  export interface UpdateExperimentResponse {
    /**
     * A structure containing the configuration details of the experiment that was updated.
     */
    experiment: Experiment;
  }
  export interface UpdateFeatureRequest {
    /**
     * To update variation configurations for this feature, or add new ones, specify this structure. In this array, include any variations that you want to add or update. If the array includes a variation name that already exists for this feature, it is updated. If it includes a new variation name, it is added as a new variation.
     */
    addOrUpdateVariations?: VariationConfigsList;
    /**
     * The name of the variation to use as the default variation. The default variation is served to users who are not allocated to any ongoing launches or experiments of this feature.
     */
    defaultVariation?: VariationName;
    /**
     * An optional description of the feature.
     */
    description?: Description;
    /**
     * Specified users that should always be served a specific variation of a feature. Each user is specified by a key-value pair . For each key, specify a user by entering their user ID, account ID, or some other identifier. For the value, specify the name of the variation that they are to be served. This parameter is limited to 2500 overrides or a total of 40KB. The 40KB limit includes an overhead of 6 bytes per override.
     */
    entityOverrides?: EntityOverrideMap;
    /**
     * Specify ALL_RULES to activate the traffic allocation specified by any ongoing launches or experiments. Specify DEFAULT_VARIATION to serve the default variation to all users instead.
     */
    evaluationStrategy?: FeatureEvaluationStrategy;
    /**
     * The name of the feature to be updated.
     */
    feature: FeatureName;
    /**
     * The name or ARN of the project that contains the feature to be updated.
     */
    project: ProjectRef;
    /**
     * Removes a variation from the feature. If the variation you specify doesn't exist, then this makes no change and does not report an error. This operation fails if you try to remove a variation that is part of an ongoing launch or experiment.
     */
    removeVariations?: VariationNameList;
  }
  export interface UpdateFeatureResponse {
    /**
     * A structure that contains information about the updated feature.
     */
    feature: Feature;
  }
  export interface UpdateLaunchRequest {
    /**
     * An optional description for the launch.
     */
    description?: Description;
    /**
     * An array of structures that contains the feature and variations that are to be used for the launch.
     */
    groups?: LaunchGroupConfigList;
    /**
     * The name of the launch that is to be updated.
     */
    launch: LaunchName;
    /**
     * An array of structures that define the metrics that will be used to monitor the launch performance.
     */
    metricMonitors?: MetricMonitorConfigList;
    /**
     * The name or ARN of the project that contains the launch that you want to update.
     */
    project: ProjectRef;
    /**
     * When Evidently assigns a particular user session to a launch, it must use a randomization ID to determine which variation the user session is served. This randomization ID is a combination of the entity ID and randomizationSalt. If you omit randomizationSalt, Evidently uses the launch name as the randomizationSalt.
     */
    randomizationSalt?: RandomizationSalt;
    /**
     * An array of structures that define the traffic allocation percentages among the feature variations during each step of the launch.
     */
    scheduledSplitsConfig?: ScheduledSplitsLaunchConfig;
  }
  export interface UpdateLaunchResponse {
    /**
     * A structure that contains the new configuration of the launch that was updated.
     */
    launch: Launch;
  }
  export interface UpdateProjectDataDeliveryRequest {
    /**
     * A structure containing the CloudWatch Logs log group where you want to store evaluation events.
     */
    cloudWatchLogs?: CloudWatchLogsDestinationConfig;
    /**
     * The name or ARN of the project that you want to modify the data storage options for.
     */
    project: ProjectRef;
    /**
     * A structure containing the S3 bucket name and bucket prefix where you want to store evaluation events.
     */
    s3Destination?: S3DestinationConfig;
  }
  export interface UpdateProjectDataDeliveryResponse {
    /**
     * A structure containing details about the project that you updated.
     */
    project: Project;
  }
  export interface UpdateProjectRequest {
    /**
     * Use this parameter if the project will use client-side evaluation powered by AppConfig. Client-side evaluation allows your application to assign variations to user sessions locally instead of by calling the EvaluateFeature operation. This mitigates the latency and availability risks that come with an API call. allows you to This parameter is a structure that contains information about the AppConfig application that will be used for client-side evaluation.
     */
    appConfigResource?: ProjectAppConfigResourceConfig;
    /**
     * An optional description of the project.
     */
    description?: Description;
    /**
     * The name or ARN of the project to update.
     */
    project: ProjectRef;
  }
  export interface UpdateProjectResponse {
    /**
     * A structure containing information about the updated project.
     */
    project: Project;
  }
  export type Uuid = string;
  export interface VariableValue {
    /**
     * If this feature uses the Boolean variation type, this field contains the Boolean value of this variation.
     */
    boolValue?: Boolean;
    /**
     * If this feature uses the double integer variation type, this field contains the double integer value of this variation.
     */
    doubleValue?: Double;
    /**
     * If this feature uses the long variation type, this field contains the long value of this variation.
     */
    longValue?: VariableValueLongValueLong;
    /**
     * If this feature uses the string variation type, this field contains the string value of this variation.
     */
    stringValue?: VariableValueStringValueString;
  }
  export type VariableValueLongValueLong = number;
  export type VariableValueStringValueString = string;
  export interface Variation {
    /**
     * The name of the variation.
     */
    name?: VariationName;
    /**
     * The value assigned to this variation.
     */
    value?: VariableValue;
  }
  export interface VariationConfig {
    /**
     * The name of the variation.
     */
    name: VariationName;
    /**
     * The value assigned to this variation.
     */
    value: VariableValue;
  }
  export type VariationConfigsList = VariationConfig[];
  export type VariationName = string;
  export type VariationNameList = VariationName[];
  export type VariationValueType = "STRING"|"LONG"|"DOUBLE"|"BOOLEAN"|string;
  export type VariationsList = Variation[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-02-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Evidently client.
   */
  export import Types = Evidently;
}
export = Evidently;
