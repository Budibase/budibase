import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Resiliencehub extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Resiliencehub.Types.ClientConfiguration)
  config: Config & Resiliencehub.Types.ClientConfiguration;
  /**
   * Adds the resource mapping for the draft application version. You can also update an existing resource mapping to a new physical resource.
   */
  addDraftAppVersionResourceMappings(params: Resiliencehub.Types.AddDraftAppVersionResourceMappingsRequest, callback?: (err: AWSError, data: Resiliencehub.Types.AddDraftAppVersionResourceMappingsResponse) => void): Request<Resiliencehub.Types.AddDraftAppVersionResourceMappingsResponse, AWSError>;
  /**
   * Adds the resource mapping for the draft application version. You can also update an existing resource mapping to a new physical resource.
   */
  addDraftAppVersionResourceMappings(callback?: (err: AWSError, data: Resiliencehub.Types.AddDraftAppVersionResourceMappingsResponse) => void): Request<Resiliencehub.Types.AddDraftAppVersionResourceMappingsResponse, AWSError>;
  /**
   * Enables you to include or exclude one or more operational recommendations.
   */
  batchUpdateRecommendationStatus(params: Resiliencehub.Types.BatchUpdateRecommendationStatusRequest, callback?: (err: AWSError, data: Resiliencehub.Types.BatchUpdateRecommendationStatusResponse) => void): Request<Resiliencehub.Types.BatchUpdateRecommendationStatusResponse, AWSError>;
  /**
   * Enables you to include or exclude one or more operational recommendations.
   */
  batchUpdateRecommendationStatus(callback?: (err: AWSError, data: Resiliencehub.Types.BatchUpdateRecommendationStatusResponse) => void): Request<Resiliencehub.Types.BatchUpdateRecommendationStatusResponse, AWSError>;
  /**
   * Creates an Resilience Hub application. An Resilience Hub application is a collection of Amazon Web Services resources structured to prevent and recover Amazon Web Services application disruptions. To describe a Resilience Hub application, you provide an application name, resources from one or more CloudFormation stacks, Resource Groups, Terraform state files, AppRegistry applications, and an appropriate resiliency policy. In addition, you can also add resources that are located on Amazon Elastic Kubernetes Service (Amazon EKS) clusters as optional resources. For more information about the number of resources supported per application, see Service quotas. After you create an Resilience Hub application, you publish it so that you can run a resiliency assessment on it. You can then use recommendations from the assessment to improve resiliency by running another assessment, comparing results, and then iterating the process until you achieve your goals for recovery time objective (RTO) and recovery point objective (RPO).
   */
  createApp(params: Resiliencehub.Types.CreateAppRequest, callback?: (err: AWSError, data: Resiliencehub.Types.CreateAppResponse) => void): Request<Resiliencehub.Types.CreateAppResponse, AWSError>;
  /**
   * Creates an Resilience Hub application. An Resilience Hub application is a collection of Amazon Web Services resources structured to prevent and recover Amazon Web Services application disruptions. To describe a Resilience Hub application, you provide an application name, resources from one or more CloudFormation stacks, Resource Groups, Terraform state files, AppRegistry applications, and an appropriate resiliency policy. In addition, you can also add resources that are located on Amazon Elastic Kubernetes Service (Amazon EKS) clusters as optional resources. For more information about the number of resources supported per application, see Service quotas. After you create an Resilience Hub application, you publish it so that you can run a resiliency assessment on it. You can then use recommendations from the assessment to improve resiliency by running another assessment, comparing results, and then iterating the process until you achieve your goals for recovery time objective (RTO) and recovery point objective (RPO).
   */
  createApp(callback?: (err: AWSError, data: Resiliencehub.Types.CreateAppResponse) => void): Request<Resiliencehub.Types.CreateAppResponse, AWSError>;
  /**
   * Creates a new Application Component in the Resilience Hub application.  This API updates the Resilience Hub application draft version. To use this Application Component for running assessments, you must publish the Resilience Hub application using the PublishAppVersion API. 
   */
  createAppVersionAppComponent(params: Resiliencehub.Types.CreateAppVersionAppComponentRequest, callback?: (err: AWSError, data: Resiliencehub.Types.CreateAppVersionAppComponentResponse) => void): Request<Resiliencehub.Types.CreateAppVersionAppComponentResponse, AWSError>;
  /**
   * Creates a new Application Component in the Resilience Hub application.  This API updates the Resilience Hub application draft version. To use this Application Component for running assessments, you must publish the Resilience Hub application using the PublishAppVersion API. 
   */
  createAppVersionAppComponent(callback?: (err: AWSError, data: Resiliencehub.Types.CreateAppVersionAppComponentResponse) => void): Request<Resiliencehub.Types.CreateAppVersionAppComponentResponse, AWSError>;
  /**
   * Adds a resource to the Resilience Hub application and assigns it to the specified Application Components. If you specify a new Application Component, Resilience Hub will automatically create the Application Component.    This action has no effect outside Resilience Hub.   This API updates the Resilience Hub application draft version. To use this resource for running resiliency assessments, you must publish the Resilience Hub application using the PublishAppVersion API.   To update application version with new physicalResourceID, you must call ResolveAppVersionResources API.   
   */
  createAppVersionResource(params: Resiliencehub.Types.CreateAppVersionResourceRequest, callback?: (err: AWSError, data: Resiliencehub.Types.CreateAppVersionResourceResponse) => void): Request<Resiliencehub.Types.CreateAppVersionResourceResponse, AWSError>;
  /**
   * Adds a resource to the Resilience Hub application and assigns it to the specified Application Components. If you specify a new Application Component, Resilience Hub will automatically create the Application Component.    This action has no effect outside Resilience Hub.   This API updates the Resilience Hub application draft version. To use this resource for running resiliency assessments, you must publish the Resilience Hub application using the PublishAppVersion API.   To update application version with new physicalResourceID, you must call ResolveAppVersionResources API.   
   */
  createAppVersionResource(callback?: (err: AWSError, data: Resiliencehub.Types.CreateAppVersionResourceResponse) => void): Request<Resiliencehub.Types.CreateAppVersionResourceResponse, AWSError>;
  /**
   * Creates a new recommendation template for the Resilience Hub application.
   */
  createRecommendationTemplate(params: Resiliencehub.Types.CreateRecommendationTemplateRequest, callback?: (err: AWSError, data: Resiliencehub.Types.CreateRecommendationTemplateResponse) => void): Request<Resiliencehub.Types.CreateRecommendationTemplateResponse, AWSError>;
  /**
   * Creates a new recommendation template for the Resilience Hub application.
   */
  createRecommendationTemplate(callback?: (err: AWSError, data: Resiliencehub.Types.CreateRecommendationTemplateResponse) => void): Request<Resiliencehub.Types.CreateRecommendationTemplateResponse, AWSError>;
  /**
   * Creates a resiliency policy for an application.
   */
  createResiliencyPolicy(params: Resiliencehub.Types.CreateResiliencyPolicyRequest, callback?: (err: AWSError, data: Resiliencehub.Types.CreateResiliencyPolicyResponse) => void): Request<Resiliencehub.Types.CreateResiliencyPolicyResponse, AWSError>;
  /**
   * Creates a resiliency policy for an application.
   */
  createResiliencyPolicy(callback?: (err: AWSError, data: Resiliencehub.Types.CreateResiliencyPolicyResponse) => void): Request<Resiliencehub.Types.CreateResiliencyPolicyResponse, AWSError>;
  /**
   * Deletes an Resilience Hub application. This is a destructive action that can't be undone.
   */
  deleteApp(params: Resiliencehub.Types.DeleteAppRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DeleteAppResponse) => void): Request<Resiliencehub.Types.DeleteAppResponse, AWSError>;
  /**
   * Deletes an Resilience Hub application. This is a destructive action that can't be undone.
   */
  deleteApp(callback?: (err: AWSError, data: Resiliencehub.Types.DeleteAppResponse) => void): Request<Resiliencehub.Types.DeleteAppResponse, AWSError>;
  /**
   * Deletes an Resilience Hub application assessment. This is a destructive action that can't be undone.
   */
  deleteAppAssessment(params: Resiliencehub.Types.DeleteAppAssessmentRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DeleteAppAssessmentResponse) => void): Request<Resiliencehub.Types.DeleteAppAssessmentResponse, AWSError>;
  /**
   * Deletes an Resilience Hub application assessment. This is a destructive action that can't be undone.
   */
  deleteAppAssessment(callback?: (err: AWSError, data: Resiliencehub.Types.DeleteAppAssessmentResponse) => void): Request<Resiliencehub.Types.DeleteAppAssessmentResponse, AWSError>;
  /**
   * Deletes the input source and all of its imported resources from the Resilience Hub application.
   */
  deleteAppInputSource(params: Resiliencehub.Types.DeleteAppInputSourceRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DeleteAppInputSourceResponse) => void): Request<Resiliencehub.Types.DeleteAppInputSourceResponse, AWSError>;
  /**
   * Deletes the input source and all of its imported resources from the Resilience Hub application.
   */
  deleteAppInputSource(callback?: (err: AWSError, data: Resiliencehub.Types.DeleteAppInputSourceResponse) => void): Request<Resiliencehub.Types.DeleteAppInputSourceResponse, AWSError>;
  /**
   * Deletes an Application Component from the Resilience Hub application.    This API updates the Resilience Hub application draft version. To use this Application Component for running assessments, you must publish the Resilience Hub application using the PublishAppVersion API.   You will not be able to delete an Application Component if it has resources associated with it.   
   */
  deleteAppVersionAppComponent(params: Resiliencehub.Types.DeleteAppVersionAppComponentRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DeleteAppVersionAppComponentResponse) => void): Request<Resiliencehub.Types.DeleteAppVersionAppComponentResponse, AWSError>;
  /**
   * Deletes an Application Component from the Resilience Hub application.    This API updates the Resilience Hub application draft version. To use this Application Component for running assessments, you must publish the Resilience Hub application using the PublishAppVersion API.   You will not be able to delete an Application Component if it has resources associated with it.   
   */
  deleteAppVersionAppComponent(callback?: (err: AWSError, data: Resiliencehub.Types.DeleteAppVersionAppComponentResponse) => void): Request<Resiliencehub.Types.DeleteAppVersionAppComponentResponse, AWSError>;
  /**
   * Deletes a resource from the Resilience Hub application.    You can only delete a manually added resource. To exclude non-manually added resources, use the UpdateAppVersionResource API.   This action has no effect outside Resilience Hub.   This API updates the Resilience Hub application draft version. To use this resource for running resiliency assessments, you must publish the Resilience Hub application using the PublishAppVersion API.   
   */
  deleteAppVersionResource(params: Resiliencehub.Types.DeleteAppVersionResourceRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DeleteAppVersionResourceResponse) => void): Request<Resiliencehub.Types.DeleteAppVersionResourceResponse, AWSError>;
  /**
   * Deletes a resource from the Resilience Hub application.    You can only delete a manually added resource. To exclude non-manually added resources, use the UpdateAppVersionResource API.   This action has no effect outside Resilience Hub.   This API updates the Resilience Hub application draft version. To use this resource for running resiliency assessments, you must publish the Resilience Hub application using the PublishAppVersion API.   
   */
  deleteAppVersionResource(callback?: (err: AWSError, data: Resiliencehub.Types.DeleteAppVersionResourceResponse) => void): Request<Resiliencehub.Types.DeleteAppVersionResourceResponse, AWSError>;
  /**
   * Deletes a recommendation template. This is a destructive action that can't be undone.
   */
  deleteRecommendationTemplate(params: Resiliencehub.Types.DeleteRecommendationTemplateRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DeleteRecommendationTemplateResponse) => void): Request<Resiliencehub.Types.DeleteRecommendationTemplateResponse, AWSError>;
  /**
   * Deletes a recommendation template. This is a destructive action that can't be undone.
   */
  deleteRecommendationTemplate(callback?: (err: AWSError, data: Resiliencehub.Types.DeleteRecommendationTemplateResponse) => void): Request<Resiliencehub.Types.DeleteRecommendationTemplateResponse, AWSError>;
  /**
   * Deletes a resiliency policy. This is a destructive action that can't be undone.
   */
  deleteResiliencyPolicy(params: Resiliencehub.Types.DeleteResiliencyPolicyRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DeleteResiliencyPolicyResponse) => void): Request<Resiliencehub.Types.DeleteResiliencyPolicyResponse, AWSError>;
  /**
   * Deletes a resiliency policy. This is a destructive action that can't be undone.
   */
  deleteResiliencyPolicy(callback?: (err: AWSError, data: Resiliencehub.Types.DeleteResiliencyPolicyResponse) => void): Request<Resiliencehub.Types.DeleteResiliencyPolicyResponse, AWSError>;
  /**
   * Describes an Resilience Hub application.
   */
  describeApp(params: Resiliencehub.Types.DescribeAppRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppResponse) => void): Request<Resiliencehub.Types.DescribeAppResponse, AWSError>;
  /**
   * Describes an Resilience Hub application.
   */
  describeApp(callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppResponse) => void): Request<Resiliencehub.Types.DescribeAppResponse, AWSError>;
  /**
   * Describes an assessment for an Resilience Hub application.
   */
  describeAppAssessment(params: Resiliencehub.Types.DescribeAppAssessmentRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppAssessmentResponse) => void): Request<Resiliencehub.Types.DescribeAppAssessmentResponse, AWSError>;
  /**
   * Describes an assessment for an Resilience Hub application.
   */
  describeAppAssessment(callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppAssessmentResponse) => void): Request<Resiliencehub.Types.DescribeAppAssessmentResponse, AWSError>;
  /**
   * Describes the Resilience Hub application version.
   */
  describeAppVersion(params: Resiliencehub.Types.DescribeAppVersionRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppVersionResponse) => void): Request<Resiliencehub.Types.DescribeAppVersionResponse, AWSError>;
  /**
   * Describes the Resilience Hub application version.
   */
  describeAppVersion(callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppVersionResponse) => void): Request<Resiliencehub.Types.DescribeAppVersionResponse, AWSError>;
  /**
   * Describes an Application Component in the Resilience Hub application.
   */
  describeAppVersionAppComponent(params: Resiliencehub.Types.DescribeAppVersionAppComponentRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppVersionAppComponentResponse) => void): Request<Resiliencehub.Types.DescribeAppVersionAppComponentResponse, AWSError>;
  /**
   * Describes an Application Component in the Resilience Hub application.
   */
  describeAppVersionAppComponent(callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppVersionAppComponentResponse) => void): Request<Resiliencehub.Types.DescribeAppVersionAppComponentResponse, AWSError>;
  /**
   * Describes a resource of the Resilience Hub application.  This API accepts only one of the following parameters to descibe the resource:    resourceName     logicalResourceId     physicalResourceId (Along with physicalResourceId, you can also provide awsAccountId, and awsRegion)   
   */
  describeAppVersionResource(params: Resiliencehub.Types.DescribeAppVersionResourceRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppVersionResourceResponse) => void): Request<Resiliencehub.Types.DescribeAppVersionResourceResponse, AWSError>;
  /**
   * Describes a resource of the Resilience Hub application.  This API accepts only one of the following parameters to descibe the resource:    resourceName     logicalResourceId     physicalResourceId (Along with physicalResourceId, you can also provide awsAccountId, and awsRegion)   
   */
  describeAppVersionResource(callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppVersionResourceResponse) => void): Request<Resiliencehub.Types.DescribeAppVersionResourceResponse, AWSError>;
  /**
   * Returns the resolution status for the specified resolution identifier for an application version. If resolutionId is not specified, the current resolution status is returned.
   */
  describeAppVersionResourcesResolutionStatus(params: Resiliencehub.Types.DescribeAppVersionResourcesResolutionStatusRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppVersionResourcesResolutionStatusResponse) => void): Request<Resiliencehub.Types.DescribeAppVersionResourcesResolutionStatusResponse, AWSError>;
  /**
   * Returns the resolution status for the specified resolution identifier for an application version. If resolutionId is not specified, the current resolution status is returned.
   */
  describeAppVersionResourcesResolutionStatus(callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppVersionResourcesResolutionStatusResponse) => void): Request<Resiliencehub.Types.DescribeAppVersionResourcesResolutionStatusResponse, AWSError>;
  /**
   * Describes details about an Resilience Hub application.
   */
  describeAppVersionTemplate(params: Resiliencehub.Types.DescribeAppVersionTemplateRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppVersionTemplateResponse) => void): Request<Resiliencehub.Types.DescribeAppVersionTemplateResponse, AWSError>;
  /**
   * Describes details about an Resilience Hub application.
   */
  describeAppVersionTemplate(callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppVersionTemplateResponse) => void): Request<Resiliencehub.Types.DescribeAppVersionTemplateResponse, AWSError>;
  /**
   * Describes the status of importing resources to an application version.  If you get a 404 error with ResourceImportStatusNotFoundAppMetadataException, you must call importResourcesToDraftAppVersion after creating the application and before calling describeDraftAppVersionResourcesImportStatus to obtain the status. 
   */
  describeDraftAppVersionResourcesImportStatus(params: Resiliencehub.Types.DescribeDraftAppVersionResourcesImportStatusRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DescribeDraftAppVersionResourcesImportStatusResponse) => void): Request<Resiliencehub.Types.DescribeDraftAppVersionResourcesImportStatusResponse, AWSError>;
  /**
   * Describes the status of importing resources to an application version.  If you get a 404 error with ResourceImportStatusNotFoundAppMetadataException, you must call importResourcesToDraftAppVersion after creating the application and before calling describeDraftAppVersionResourcesImportStatus to obtain the status. 
   */
  describeDraftAppVersionResourcesImportStatus(callback?: (err: AWSError, data: Resiliencehub.Types.DescribeDraftAppVersionResourcesImportStatusResponse) => void): Request<Resiliencehub.Types.DescribeDraftAppVersionResourcesImportStatusResponse, AWSError>;
  /**
   * Describes a specified resiliency policy for an Resilience Hub application. The returned policy object includes creation time, data location constraints, the Amazon Resource Name (ARN) for the policy, tags, tier, and more.
   */
  describeResiliencyPolicy(params: Resiliencehub.Types.DescribeResiliencyPolicyRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DescribeResiliencyPolicyResponse) => void): Request<Resiliencehub.Types.DescribeResiliencyPolicyResponse, AWSError>;
  /**
   * Describes a specified resiliency policy for an Resilience Hub application. The returned policy object includes creation time, data location constraints, the Amazon Resource Name (ARN) for the policy, tags, tier, and more.
   */
  describeResiliencyPolicy(callback?: (err: AWSError, data: Resiliencehub.Types.DescribeResiliencyPolicyResponse) => void): Request<Resiliencehub.Types.DescribeResiliencyPolicyResponse, AWSError>;
  /**
   * Imports resources to Resilience Hub application draft version from different input sources. For more information about the input sources supported by Resilience Hub, see Discover the structure and describe your Resilience Hub application.
   */
  importResourcesToDraftAppVersion(params: Resiliencehub.Types.ImportResourcesToDraftAppVersionRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ImportResourcesToDraftAppVersionResponse) => void): Request<Resiliencehub.Types.ImportResourcesToDraftAppVersionResponse, AWSError>;
  /**
   * Imports resources to Resilience Hub application draft version from different input sources. For more information about the input sources supported by Resilience Hub, see Discover the structure and describe your Resilience Hub application.
   */
  importResourcesToDraftAppVersion(callback?: (err: AWSError, data: Resiliencehub.Types.ImportResourcesToDraftAppVersionResponse) => void): Request<Resiliencehub.Types.ImportResourcesToDraftAppVersionResponse, AWSError>;
  /**
   * Lists the alarm recommendations for an Resilience Hub application.
   */
  listAlarmRecommendations(params: Resiliencehub.Types.ListAlarmRecommendationsRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListAlarmRecommendationsResponse) => void): Request<Resiliencehub.Types.ListAlarmRecommendationsResponse, AWSError>;
  /**
   * Lists the alarm recommendations for an Resilience Hub application.
   */
  listAlarmRecommendations(callback?: (err: AWSError, data: Resiliencehub.Types.ListAlarmRecommendationsResponse) => void): Request<Resiliencehub.Types.ListAlarmRecommendationsResponse, AWSError>;
  /**
   * List of compliance drifts that were detected while running an assessment.
   */
  listAppAssessmentComplianceDrifts(params: Resiliencehub.Types.ListAppAssessmentComplianceDriftsRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListAppAssessmentComplianceDriftsResponse) => void): Request<Resiliencehub.Types.ListAppAssessmentComplianceDriftsResponse, AWSError>;
  /**
   * List of compliance drifts that were detected while running an assessment.
   */
  listAppAssessmentComplianceDrifts(callback?: (err: AWSError, data: Resiliencehub.Types.ListAppAssessmentComplianceDriftsResponse) => void): Request<Resiliencehub.Types.ListAppAssessmentComplianceDriftsResponse, AWSError>;
  /**
   * Lists the assessments for an Resilience Hub application. You can use request parameters to refine the results for the response object.
   */
  listAppAssessments(params: Resiliencehub.Types.ListAppAssessmentsRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListAppAssessmentsResponse) => void): Request<Resiliencehub.Types.ListAppAssessmentsResponse, AWSError>;
  /**
   * Lists the assessments for an Resilience Hub application. You can use request parameters to refine the results for the response object.
   */
  listAppAssessments(callback?: (err: AWSError, data: Resiliencehub.Types.ListAppAssessmentsResponse) => void): Request<Resiliencehub.Types.ListAppAssessmentsResponse, AWSError>;
  /**
   * Lists the compliances for an Resilience Hub Application Component.
   */
  listAppComponentCompliances(params: Resiliencehub.Types.ListAppComponentCompliancesRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListAppComponentCompliancesResponse) => void): Request<Resiliencehub.Types.ListAppComponentCompliancesResponse, AWSError>;
  /**
   * Lists the compliances for an Resilience Hub Application Component.
   */
  listAppComponentCompliances(callback?: (err: AWSError, data: Resiliencehub.Types.ListAppComponentCompliancesResponse) => void): Request<Resiliencehub.Types.ListAppComponentCompliancesResponse, AWSError>;
  /**
   * Lists the recommendations for an Resilience Hub Application Component.
   */
  listAppComponentRecommendations(params: Resiliencehub.Types.ListAppComponentRecommendationsRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListAppComponentRecommendationsResponse) => void): Request<Resiliencehub.Types.ListAppComponentRecommendationsResponse, AWSError>;
  /**
   * Lists the recommendations for an Resilience Hub Application Component.
   */
  listAppComponentRecommendations(callback?: (err: AWSError, data: Resiliencehub.Types.ListAppComponentRecommendationsResponse) => void): Request<Resiliencehub.Types.ListAppComponentRecommendationsResponse, AWSError>;
  /**
   * Lists all the input sources of the Resilience Hub application. For more information about the input sources supported by Resilience Hub, see Discover the structure and describe your Resilience Hub application.
   */
  listAppInputSources(params: Resiliencehub.Types.ListAppInputSourcesRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListAppInputSourcesResponse) => void): Request<Resiliencehub.Types.ListAppInputSourcesResponse, AWSError>;
  /**
   * Lists all the input sources of the Resilience Hub application. For more information about the input sources supported by Resilience Hub, see Discover the structure and describe your Resilience Hub application.
   */
  listAppInputSources(callback?: (err: AWSError, data: Resiliencehub.Types.ListAppInputSourcesResponse) => void): Request<Resiliencehub.Types.ListAppInputSourcesResponse, AWSError>;
  /**
   * Lists all the Application Components in the Resilience Hub application.
   */
  listAppVersionAppComponents(params: Resiliencehub.Types.ListAppVersionAppComponentsRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListAppVersionAppComponentsResponse) => void): Request<Resiliencehub.Types.ListAppVersionAppComponentsResponse, AWSError>;
  /**
   * Lists all the Application Components in the Resilience Hub application.
   */
  listAppVersionAppComponents(callback?: (err: AWSError, data: Resiliencehub.Types.ListAppVersionAppComponentsResponse) => void): Request<Resiliencehub.Types.ListAppVersionAppComponentsResponse, AWSError>;
  /**
   * Lists how the resources in an application version are mapped/sourced from. Mappings can be physical resource identifiers, CloudFormation stacks, resource-groups, or an application registry app.
   */
  listAppVersionResourceMappings(params: Resiliencehub.Types.ListAppVersionResourceMappingsRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListAppVersionResourceMappingsResponse) => void): Request<Resiliencehub.Types.ListAppVersionResourceMappingsResponse, AWSError>;
  /**
   * Lists how the resources in an application version are mapped/sourced from. Mappings can be physical resource identifiers, CloudFormation stacks, resource-groups, or an application registry app.
   */
  listAppVersionResourceMappings(callback?: (err: AWSError, data: Resiliencehub.Types.ListAppVersionResourceMappingsResponse) => void): Request<Resiliencehub.Types.ListAppVersionResourceMappingsResponse, AWSError>;
  /**
   * Lists all the resources in an Resilience Hub application.
   */
  listAppVersionResources(params: Resiliencehub.Types.ListAppVersionResourcesRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListAppVersionResourcesResponse) => void): Request<Resiliencehub.Types.ListAppVersionResourcesResponse, AWSError>;
  /**
   * Lists all the resources in an Resilience Hub application.
   */
  listAppVersionResources(callback?: (err: AWSError, data: Resiliencehub.Types.ListAppVersionResourcesResponse) => void): Request<Resiliencehub.Types.ListAppVersionResourcesResponse, AWSError>;
  /**
   * Lists the different versions for the Resilience Hub applications.
   */
  listAppVersions(params: Resiliencehub.Types.ListAppVersionsRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListAppVersionsResponse) => void): Request<Resiliencehub.Types.ListAppVersionsResponse, AWSError>;
  /**
   * Lists the different versions for the Resilience Hub applications.
   */
  listAppVersions(callback?: (err: AWSError, data: Resiliencehub.Types.ListAppVersionsResponse) => void): Request<Resiliencehub.Types.ListAppVersionsResponse, AWSError>;
  /**
   * Lists your Resilience Hub applications.  You can filter applications using only one filter at a time or without using any filter. If you try to filter applications using multiple filters, you will get the following error:  An error occurred (ValidationException) when calling the ListApps operation: Only one filter is supported for this operation.  
   */
  listApps(params: Resiliencehub.Types.ListAppsRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListAppsResponse) => void): Request<Resiliencehub.Types.ListAppsResponse, AWSError>;
  /**
   * Lists your Resilience Hub applications.  You can filter applications using only one filter at a time or without using any filter. If you try to filter applications using multiple filters, you will get the following error:  An error occurred (ValidationException) when calling the ListApps operation: Only one filter is supported for this operation.  
   */
  listApps(callback?: (err: AWSError, data: Resiliencehub.Types.ListAppsResponse) => void): Request<Resiliencehub.Types.ListAppsResponse, AWSError>;
  /**
   * Lists the recommendation templates for the Resilience Hub applications.
   */
  listRecommendationTemplates(params: Resiliencehub.Types.ListRecommendationTemplatesRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListRecommendationTemplatesResponse) => void): Request<Resiliencehub.Types.ListRecommendationTemplatesResponse, AWSError>;
  /**
   * Lists the recommendation templates for the Resilience Hub applications.
   */
  listRecommendationTemplates(callback?: (err: AWSError, data: Resiliencehub.Types.ListRecommendationTemplatesResponse) => void): Request<Resiliencehub.Types.ListRecommendationTemplatesResponse, AWSError>;
  /**
   * Lists the resiliency policies for the Resilience Hub applications.
   */
  listResiliencyPolicies(params: Resiliencehub.Types.ListResiliencyPoliciesRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListResiliencyPoliciesResponse) => void): Request<Resiliencehub.Types.ListResiliencyPoliciesResponse, AWSError>;
  /**
   * Lists the resiliency policies for the Resilience Hub applications.
   */
  listResiliencyPolicies(callback?: (err: AWSError, data: Resiliencehub.Types.ListResiliencyPoliciesResponse) => void): Request<Resiliencehub.Types.ListResiliencyPoliciesResponse, AWSError>;
  /**
   * Lists the standard operating procedure (SOP) recommendations for the Resilience Hub applications.
   */
  listSopRecommendations(params: Resiliencehub.Types.ListSopRecommendationsRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListSopRecommendationsResponse) => void): Request<Resiliencehub.Types.ListSopRecommendationsResponse, AWSError>;
  /**
   * Lists the standard operating procedure (SOP) recommendations for the Resilience Hub applications.
   */
  listSopRecommendations(callback?: (err: AWSError, data: Resiliencehub.Types.ListSopRecommendationsResponse) => void): Request<Resiliencehub.Types.ListSopRecommendationsResponse, AWSError>;
  /**
   * Lists the suggested resiliency policies for the Resilience Hub applications.
   */
  listSuggestedResiliencyPolicies(params: Resiliencehub.Types.ListSuggestedResiliencyPoliciesRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListSuggestedResiliencyPoliciesResponse) => void): Request<Resiliencehub.Types.ListSuggestedResiliencyPoliciesResponse, AWSError>;
  /**
   * Lists the suggested resiliency policies for the Resilience Hub applications.
   */
  listSuggestedResiliencyPolicies(callback?: (err: AWSError, data: Resiliencehub.Types.ListSuggestedResiliencyPoliciesResponse) => void): Request<Resiliencehub.Types.ListSuggestedResiliencyPoliciesResponse, AWSError>;
  /**
   * Lists the tags for your resources in your Resilience Hub applications.
   */
  listTagsForResource(params: Resiliencehub.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListTagsForResourceResponse) => void): Request<Resiliencehub.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags for your resources in your Resilience Hub applications.
   */
  listTagsForResource(callback?: (err: AWSError, data: Resiliencehub.Types.ListTagsForResourceResponse) => void): Request<Resiliencehub.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the test recommendations for the Resilience Hub application.
   */
  listTestRecommendations(params: Resiliencehub.Types.ListTestRecommendationsRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListTestRecommendationsResponse) => void): Request<Resiliencehub.Types.ListTestRecommendationsResponse, AWSError>;
  /**
   * Lists the test recommendations for the Resilience Hub application.
   */
  listTestRecommendations(callback?: (err: AWSError, data: Resiliencehub.Types.ListTestRecommendationsResponse) => void): Request<Resiliencehub.Types.ListTestRecommendationsResponse, AWSError>;
  /**
   * Lists the resources that are not currently supported in Resilience Hub. An unsupported resource is a resource that exists in the object that was used to create an app, but is not supported by Resilience Hub.
   */
  listUnsupportedAppVersionResources(params: Resiliencehub.Types.ListUnsupportedAppVersionResourcesRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListUnsupportedAppVersionResourcesResponse) => void): Request<Resiliencehub.Types.ListUnsupportedAppVersionResourcesResponse, AWSError>;
  /**
   * Lists the resources that are not currently supported in Resilience Hub. An unsupported resource is a resource that exists in the object that was used to create an app, but is not supported by Resilience Hub.
   */
  listUnsupportedAppVersionResources(callback?: (err: AWSError, data: Resiliencehub.Types.ListUnsupportedAppVersionResourcesResponse) => void): Request<Resiliencehub.Types.ListUnsupportedAppVersionResourcesResponse, AWSError>;
  /**
   * Publishes a new version of a specific Resilience Hub application.
   */
  publishAppVersion(params: Resiliencehub.Types.PublishAppVersionRequest, callback?: (err: AWSError, data: Resiliencehub.Types.PublishAppVersionResponse) => void): Request<Resiliencehub.Types.PublishAppVersionResponse, AWSError>;
  /**
   * Publishes a new version of a specific Resilience Hub application.
   */
  publishAppVersion(callback?: (err: AWSError, data: Resiliencehub.Types.PublishAppVersionResponse) => void): Request<Resiliencehub.Types.PublishAppVersionResponse, AWSError>;
  /**
   * Adds or updates the app template for an Resilience Hub application draft version.
   */
  putDraftAppVersionTemplate(params: Resiliencehub.Types.PutDraftAppVersionTemplateRequest, callback?: (err: AWSError, data: Resiliencehub.Types.PutDraftAppVersionTemplateResponse) => void): Request<Resiliencehub.Types.PutDraftAppVersionTemplateResponse, AWSError>;
  /**
   * Adds or updates the app template for an Resilience Hub application draft version.
   */
  putDraftAppVersionTemplate(callback?: (err: AWSError, data: Resiliencehub.Types.PutDraftAppVersionTemplateResponse) => void): Request<Resiliencehub.Types.PutDraftAppVersionTemplateResponse, AWSError>;
  /**
   * Removes resource mappings from a draft application version.
   */
  removeDraftAppVersionResourceMappings(params: Resiliencehub.Types.RemoveDraftAppVersionResourceMappingsRequest, callback?: (err: AWSError, data: Resiliencehub.Types.RemoveDraftAppVersionResourceMappingsResponse) => void): Request<Resiliencehub.Types.RemoveDraftAppVersionResourceMappingsResponse, AWSError>;
  /**
   * Removes resource mappings from a draft application version.
   */
  removeDraftAppVersionResourceMappings(callback?: (err: AWSError, data: Resiliencehub.Types.RemoveDraftAppVersionResourceMappingsResponse) => void): Request<Resiliencehub.Types.RemoveDraftAppVersionResourceMappingsResponse, AWSError>;
  /**
   * Resolves the resources for an application version.
   */
  resolveAppVersionResources(params: Resiliencehub.Types.ResolveAppVersionResourcesRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ResolveAppVersionResourcesResponse) => void): Request<Resiliencehub.Types.ResolveAppVersionResourcesResponse, AWSError>;
  /**
   * Resolves the resources for an application version.
   */
  resolveAppVersionResources(callback?: (err: AWSError, data: Resiliencehub.Types.ResolveAppVersionResourcesResponse) => void): Request<Resiliencehub.Types.ResolveAppVersionResourcesResponse, AWSError>;
  /**
   * Creates a new application assessment for an application.
   */
  startAppAssessment(params: Resiliencehub.Types.StartAppAssessmentRequest, callback?: (err: AWSError, data: Resiliencehub.Types.StartAppAssessmentResponse) => void): Request<Resiliencehub.Types.StartAppAssessmentResponse, AWSError>;
  /**
   * Creates a new application assessment for an application.
   */
  startAppAssessment(callback?: (err: AWSError, data: Resiliencehub.Types.StartAppAssessmentResponse) => void): Request<Resiliencehub.Types.StartAppAssessmentResponse, AWSError>;
  /**
   * Applies one or more tags to a resource.
   */
  tagResource(params: Resiliencehub.Types.TagResourceRequest, callback?: (err: AWSError, data: Resiliencehub.Types.TagResourceResponse) => void): Request<Resiliencehub.Types.TagResourceResponse, AWSError>;
  /**
   * Applies one or more tags to a resource.
   */
  tagResource(callback?: (err: AWSError, data: Resiliencehub.Types.TagResourceResponse) => void): Request<Resiliencehub.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from a resource.
   */
  untagResource(params: Resiliencehub.Types.UntagResourceRequest, callback?: (err: AWSError, data: Resiliencehub.Types.UntagResourceResponse) => void): Request<Resiliencehub.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: Resiliencehub.Types.UntagResourceResponse) => void): Request<Resiliencehub.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates an application.
   */
  updateApp(params: Resiliencehub.Types.UpdateAppRequest, callback?: (err: AWSError, data: Resiliencehub.Types.UpdateAppResponse) => void): Request<Resiliencehub.Types.UpdateAppResponse, AWSError>;
  /**
   * Updates an application.
   */
  updateApp(callback?: (err: AWSError, data: Resiliencehub.Types.UpdateAppResponse) => void): Request<Resiliencehub.Types.UpdateAppResponse, AWSError>;
  /**
   * Updates the Resilience Hub application version.  This API updates the Resilience Hub application draft version. To use this information for running resiliency assessments, you must publish the Resilience Hub application using the PublishAppVersion API. 
   */
  updateAppVersion(params: Resiliencehub.Types.UpdateAppVersionRequest, callback?: (err: AWSError, data: Resiliencehub.Types.UpdateAppVersionResponse) => void): Request<Resiliencehub.Types.UpdateAppVersionResponse, AWSError>;
  /**
   * Updates the Resilience Hub application version.  This API updates the Resilience Hub application draft version. To use this information for running resiliency assessments, you must publish the Resilience Hub application using the PublishAppVersion API. 
   */
  updateAppVersion(callback?: (err: AWSError, data: Resiliencehub.Types.UpdateAppVersionResponse) => void): Request<Resiliencehub.Types.UpdateAppVersionResponse, AWSError>;
  /**
   * Updates an existing Application Component in the Resilience Hub application.  This API updates the Resilience Hub application draft version. To use this Application Component for running assessments, you must publish the Resilience Hub application using the PublishAppVersion API. 
   */
  updateAppVersionAppComponent(params: Resiliencehub.Types.UpdateAppVersionAppComponentRequest, callback?: (err: AWSError, data: Resiliencehub.Types.UpdateAppVersionAppComponentResponse) => void): Request<Resiliencehub.Types.UpdateAppVersionAppComponentResponse, AWSError>;
  /**
   * Updates an existing Application Component in the Resilience Hub application.  This API updates the Resilience Hub application draft version. To use this Application Component for running assessments, you must publish the Resilience Hub application using the PublishAppVersion API. 
   */
  updateAppVersionAppComponent(callback?: (err: AWSError, data: Resiliencehub.Types.UpdateAppVersionAppComponentResponse) => void): Request<Resiliencehub.Types.UpdateAppVersionAppComponentResponse, AWSError>;
  /**
   * Updates the resource details in the Resilience Hub application.    This action has no effect outside Resilience Hub.   This API updates the Resilience Hub application draft version. To use this resource for running resiliency assessments, you must publish the Resilience Hub application using the PublishAppVersion API.   To update application version with new physicalResourceID, you must call ResolveAppVersionResources API.   
   */
  updateAppVersionResource(params: Resiliencehub.Types.UpdateAppVersionResourceRequest, callback?: (err: AWSError, data: Resiliencehub.Types.UpdateAppVersionResourceResponse) => void): Request<Resiliencehub.Types.UpdateAppVersionResourceResponse, AWSError>;
  /**
   * Updates the resource details in the Resilience Hub application.    This action has no effect outside Resilience Hub.   This API updates the Resilience Hub application draft version. To use this resource for running resiliency assessments, you must publish the Resilience Hub application using the PublishAppVersion API.   To update application version with new physicalResourceID, you must call ResolveAppVersionResources API.   
   */
  updateAppVersionResource(callback?: (err: AWSError, data: Resiliencehub.Types.UpdateAppVersionResourceResponse) => void): Request<Resiliencehub.Types.UpdateAppVersionResourceResponse, AWSError>;
  /**
   * Updates a resiliency policy.
   */
  updateResiliencyPolicy(params: Resiliencehub.Types.UpdateResiliencyPolicyRequest, callback?: (err: AWSError, data: Resiliencehub.Types.UpdateResiliencyPolicyResponse) => void): Request<Resiliencehub.Types.UpdateResiliencyPolicyResponse, AWSError>;
  /**
   * Updates a resiliency policy.
   */
  updateResiliencyPolicy(callback?: (err: AWSError, data: Resiliencehub.Types.UpdateResiliencyPolicyResponse) => void): Request<Resiliencehub.Types.UpdateResiliencyPolicyResponse, AWSError>;
}
declare namespace Resiliencehub {
  export interface AddDraftAppVersionResourceMappingsRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Mappings used to map logical resources from the template to physical resources. You can use the mapping type CFN_STACK if the application template uses a logical stack name. Or you can map individual resources by using the mapping type RESOURCE. We recommend using the mapping type CFN_STACK if the application is backed by a CloudFormation stack.
     */
    resourceMappings: ResourceMappingList;
  }
  export interface AddDraftAppVersionResourceMappingsResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
    /**
     * List of sources that are used to map a logical resource from the template to a physical resource. You can use sources such as CloudFormation, Terraform state files, AppRegistry applications, or Amazon EKS.
     */
    resourceMappings: ResourceMappingList;
  }
  export type AdditionalInfoMap = {[key: string]: AdditionalInfoValueList};
  export type AdditionalInfoValueList = String1024[];
  export interface AlarmRecommendation {
    /**
     * Application Component name for the CloudWatch alarm recommendation. This name is saved as the first item in the appComponentNames list.
     */
    appComponentName?: EntityId;
    /**
     * List of Application Component names for the CloudWatch alarm recommendation.
     */
    appComponentNames?: AppComponentNameList;
    /**
     * Description of the alarm recommendation.
     */
    description?: EntityDescription;
    /**
     * List of CloudWatch alarm recommendations.
     */
    items?: RecommendationItemList;
    /**
     * Name of the alarm recommendation.
     */
    name: String500;
    /**
     * The prerequisite for the alarm recommendation.
     */
    prerequisite?: String500;
    /**
     * Identifier of the alarm recommendation.
     */
    recommendationId: Uuid;
    /**
     * Reference identifier of the alarm recommendation.
     */
    referenceId: SpecReferenceId;
    /**
     * Type of alarm recommendation.
     */
    type: AlarmType;
  }
  export type AlarmRecommendationList = AlarmRecommendation[];
  export type AlarmReferenceIdList = String500[];
  export type AlarmType = "Metric"|"Composite"|"Canary"|"Logs"|"Event"|string;
  export interface App {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Assessment execution schedule with 'Daily' or 'Disabled' values. 
     */
    assessmentSchedule?: AppAssessmentScheduleType;
    /**
     * Current status of compliance for the resiliency policy.
     */
    complianceStatus?: AppComplianceStatusType;
    /**
     * Timestamp for when the app was created.
     */
    creationTime: TimeStamp;
    /**
     * Optional description for an application.
     */
    description?: EntityDescription;
    /**
     * Indicates if compliance drifts (deviations) were detected while running an assessment for your application.
     */
    driftStatus?: AppDriftStatusType;
    /**
     * The list of events you would like to subscribe and get notification for. Currently, Resilience Hub supports notifications only for Drift detected and Scheduled assessment failure events.
     */
    eventSubscriptions?: EventSubscriptionList;
    /**
     * Timestamp for the most recent compliance evaluation.
     */
    lastAppComplianceEvaluationTime?: TimeStamp;
    /**
     * Indicates the last time that a drift was evaluated.
     */
    lastDriftEvaluationTime?: TimeStamp;
    /**
     * Timestamp for the most recent resiliency score evaluation.
     */
    lastResiliencyScoreEvaluationTime?: TimeStamp;
    /**
     * Name for the application.
     */
    name: EntityName;
    /**
     * Defines the roles and credentials that Resilience Hub would use while creating the application, importing its resources, and running an assessment.
     */
    permissionModel?: PermissionModel;
    /**
     * Amazon Resource Name (ARN) of the resiliency policy. The format for this ARN is: arn:partition:resiliencehub:region:account:resiliency-policy/policy-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    policyArn?: Arn;
    /**
     * Current resiliency score for the application.
     */
    resiliencyScore?: Double;
    /**
     * Status of the application.
     */
    status?: AppStatusType;
    /**
     * Tags assigned to the resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key/value pair.
     */
    tags?: TagMap;
  }
  export interface AppAssessment {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn?: Arn;
    /**
     * Version of an application.
     */
    appVersion?: EntityVersion;
    /**
     * Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:resiliencehub:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    assessmentArn: Arn;
    /**
     * Name of the assessment.
     */
    assessmentName?: EntityName;
    /**
     * Current status of the assessment for the resiliency policy.
     */
    assessmentStatus: AssessmentStatus;
    /**
     * Application compliance against the resiliency policy.
     */
    compliance?: AssessmentCompliance;
    /**
     * Current status of the compliance for the resiliency policy.
     */
    complianceStatus?: ComplianceStatus;
    /**
     * Cost for the application.
     */
    cost?: Cost;
    /**
     * Indicates if compliance drifts (deviations) were detected while running an assessment for your application.
     */
    driftStatus?: DriftStatus;
    /**
     * End time for the action.
     */
    endTime?: TimeStamp;
    /**
     * The entity that invoked the assessment.
     */
    invoker: AssessmentInvoker;
    /**
     * Error or warning message from the assessment execution
     */
    message?: String500;
    /**
     * Resiliency policy of an application.
     */
    policy?: ResiliencyPolicy;
    /**
     * Current resiliency score for an application.
     */
    resiliencyScore?: ResiliencyScore;
    /**
     *  A resource error object containing a list of errors retrieving an application's resources. 
     */
    resourceErrorsDetails?: ResourceErrorsDetails;
    /**
     * Starting time for the action.
     */
    startTime?: TimeStamp;
    /**
     * Tags assigned to the resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key/value pair.
     */
    tags?: TagMap;
    /**
     * Version name of the published application.
     */
    versionName?: EntityVersion;
  }
  export type AppAssessmentScheduleType = "Disabled"|"Daily"|string;
  export interface AppAssessmentSummary {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn?: Arn;
    /**
     * Version of an application.
     */
    appVersion?: EntityVersion;
    /**
     * Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:resiliencehub:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    assessmentArn: Arn;
    /**
     * Name of the assessment.
     */
    assessmentName?: EntityName;
    /**
     * Current status of the assessment for the resiliency policy.
     */
    assessmentStatus: AssessmentStatus;
    /**
     * TCurrent status of compliance for the resiliency policy.
     */
    complianceStatus?: ComplianceStatus;
    /**
     * Cost for an application.
     */
    cost?: Cost;
    /**
     * Indicates if compliance drifts (deviations) were detected while running an assessment for your application.
     */
    driftStatus?: DriftStatus;
    /**
     * End time for the action.
     */
    endTime?: TimeStamp;
    /**
     * Entity that invoked the assessment.
     */
    invoker?: AssessmentInvoker;
    /**
     * Message from the assessment run.
     */
    message?: String500;
    /**
     * Current resiliency score for the application.
     */
    resiliencyScore?: Double;
    /**
     * Starting time for the action.
     */
    startTime?: TimeStamp;
    /**
     * Name of an application version.
     */
    versionName?: EntityVersion;
  }
  export type AppAssessmentSummaryList = AppAssessmentSummary[];
  export type AppComplianceStatusType = "PolicyBreached"|"PolicyMet"|"NotAssessed"|"ChangesDetected"|string;
  export interface AppComponent {
    /**
     * Additional configuration parameters for an Resilience Hub application. If you want to implement additionalInfo through the Resilience Hub console rather than using an API call, see Configure the application configuration parameters.  Currently, this parameter accepts a key-value mapping (in a string format) of only one failover region and one associated account. Key: "failover-regions"  Value: "[{"region":"&lt;REGION&gt;", "accounts":[{"id":"&lt;ACCOUNT_ID&gt;"}]}]"  
     */
    additionalInfo?: AdditionalInfoMap;
    /**
     * Identifier of the Application Component.
     */
    id?: String255;
    /**
     * Name of the Application Component.
     */
    name: String255;
    /**
     * The type of Application Component.
     */
    type: String255;
  }
  export interface AppComponentCompliance {
    /**
     * Name of the Application Component.
     */
    appComponentName?: EntityId;
    /**
     * The compliance of the Application Component against the resiliency policy.
     */
    compliance?: AssessmentCompliance;
    /**
     * The cost for the application.
     */
    cost?: Cost;
    /**
     * The compliance message.
     */
    message?: String500;
    /**
     * The current resiliency score for the application.
     */
    resiliencyScore?: ResiliencyScore;
    /**
     * Status of the action.
     */
    status?: ComplianceStatus;
  }
  export type AppComponentList = AppComponent[];
  export type AppComponentNameList = String255[];
  export type AppDriftStatusType = "NotChecked"|"NotDetected"|"Detected"|string;
  export interface AppInputSource {
    /**
     * The namespace on your Amazon Elastic Kubernetes Service cluster.
     */
    eksSourceClusterNamespace?: EksSourceClusterNamespace;
    /**
     * The resource type of the input source.
     */
    importType: ResourceMappingType;
    /**
     * The number of resources.
     */
    resourceCount?: Integer;
    /**
     * The Amazon Resource Name (ARN) of the input source. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    sourceArn?: Arn;
    /**
     * The name of the input source.
     */
    sourceName?: String255;
    /**
     * The name of the Terraform s3 state ﬁle.
     */
    terraformSource?: TerraformSource;
  }
  export type AppInputSourceList = AppInputSource[];
  export type AppStatusType = "Active"|"Deleting"|string;
  export interface AppSummary {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     *  Assessment execution schedule with 'Daily' or 'Disabled' values. 
     */
    assessmentSchedule?: AppAssessmentScheduleType;
    /**
     * The current status of compliance for the resiliency policy.
     */
    complianceStatus?: AppComplianceStatusType;
    /**
     * The timestamp for when the app was created.
     */
    creationTime: TimeStamp;
    /**
     * The optional description for an app.
     */
    description?: EntityDescription;
    /**
     * Indicates if compliance drifts (deviations) were detected while running an assessment for your application.
     */
    driftStatus?: AppDriftStatusType;
    /**
     * The name of the application.
     */
    name: EntityName;
    /**
     * The current resiliency score for the application.
     */
    resiliencyScore?: Double;
    /**
     * Status of the application.
     */
    status?: AppStatusType;
  }
  export type AppSummaryList = AppSummary[];
  export type AppTemplateBody = string;
  export type AppVersionList = AppVersionSummary[];
  export interface AppVersionSummary {
    /**
     * Version of an application.
     */
    appVersion: EntityVersion;
    /**
     * Creation time of the application version.
     */
    creationTime?: TimeStamp;
    /**
     * Identifier of the application version.
     */
    identifier?: LongOptional;
    /**
     * Name of the application version.
     */
    versionName?: EntityVersion;
  }
  export type Arn = string;
  export type ArnList = Arn[];
  export type AssessmentCompliance = {[key: string]: DisruptionCompliance};
  export type AssessmentInvoker = "User"|"System"|string;
  export type AssessmentStatus = "Pending"|"InProgress"|"Failed"|"Success"|string;
  export type AssessmentStatusList = AssessmentStatus[];
  export type AwsRegion = string;
  export type BatchUpdateRecommendationStatusFailedEntries = BatchUpdateRecommendationStatusFailedEntry[];
  export interface BatchUpdateRecommendationStatusFailedEntry {
    /**
     * An identifier of an entry in this batch that is used to communicate the result.  The entryIds of a batch request need to be unique within a request. 
     */
    entryId: String255;
    /**
     * Indicates the error that occurred while excluding an operational recommendation.
     */
    errorMessage: ErrorMessage;
  }
  export interface BatchUpdateRecommendationStatusRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Defines the list of operational recommendations that need to be included or excluded.
     */
    requestEntries: UpdateRecommendationStatusRequestEntries;
  }
  export interface BatchUpdateRecommendationStatusResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * A list of items with error details about each item, which could not be included or excluded.
     */
    failedEntries: BatchUpdateRecommendationStatusFailedEntries;
    /**
     * A list of items that were included or excluded.
     */
    successfulEntries: BatchUpdateRecommendationStatusSuccessfulEntries;
  }
  export type BatchUpdateRecommendationStatusSuccessfulEntries = BatchUpdateRecommendationStatusSuccessfulEntry[];
  export interface BatchUpdateRecommendationStatusSuccessfulEntry {
    /**
     * An identifier for an entry in this batch that is used to communicate the result.  The entryIds of a batch request need to be unique within a request. 
     */
    entryId: String255;
    /**
     * Indicates the reason for excluding an operational recommendation.
     */
    excludeReason?: ExcludeRecommendationReason;
    /**
     * Indicates if the operational recommendation was successfully excluded.
     */
    excluded: BooleanOptional;
    /**
     * The operational recommendation item.
     */
    item: UpdateRecommendationStatusItem;
    /**
     * Reference identifier of the operational recommendation.
     */
    referenceId: SpecReferenceId;
  }
  export type BooleanOptional = boolean;
  export type ClientToken = string;
  export interface ComplianceDrift {
    /**
     * Assessment identifier that is associated with this drift item.
     */
    actualReferenceId?: String255;
    /**
     * Actual compliance value of the entity.
     */
    actualValue?: AssessmentCompliance;
    /**
     * Identifier of your application.
     */
    appId?: String255;
    /**
     * Published version of your application on which drift was detected.
     */
    appVersion?: String255;
    /**
     * Difference type between actual and expected recovery point objective (RPO) and recovery time objective (RTO) values. Currently, Resilience Hub supports only NotEqual difference type.
     */
    diffType?: DifferenceType;
    /**
     * The type of drift detected. Currently, Resilience Hub supports only ApplicationCompliance drift type.
     */
    driftType?: DriftType;
    /**
     * Identifier of an entity in which drift was detected. For compliance drift, the entity ID can be either application ID or the AppComponent ID.
     */
    entityId?: String255;
    /**
     * The type of entity in which drift was detected. For compliance drifts, Resilience Hub supports AWS::ResilienceHub::AppComponent and AWS::ResilienceHub::Application.
     */
    entityType?: String255;
    /**
     * Assessment identifier of a previous assessment of the same application version. Resilience Hub uses the previous assessment (associated with the reference identifier) to compare the compliance with the current assessment to identify drifts.
     */
    expectedReferenceId?: String255;
    /**
     * The expected compliance value of an entity.
     */
    expectedValue?: AssessmentCompliance;
  }
  export type ComplianceDriftList = ComplianceDrift[];
  export type ComplianceStatus = "PolicyBreached"|"PolicyMet"|string;
  export type ComponentCompliancesList = AppComponentCompliance[];
  export interface ComponentRecommendation {
    /**
     * Name of the Application Component.
     */
    appComponentName: EntityId;
    /**
     * List of recommendations.
     */
    configRecommendations: ConfigRecommendationList;
    /**
     * Status of the recommendation.
     */
    recommendationStatus: RecommendationComplianceStatus;
  }
  export type ComponentRecommendationList = ComponentRecommendation[];
  export interface ConfigRecommendation {
    /**
     * Name of the Application Component.
     */
    appComponentName?: EntityId;
    /**
     * The current compliance against the resiliency policy before applying the configuration change.
     */
    compliance?: AssessmentCompliance;
    /**
     * The cost for the application.
     */
    cost?: Cost;
    /**
     * The optional description for an app.
     */
    description?: EntityDescription;
    /**
     * The architecture type.
     */
    haArchitecture?: HaArchitecture;
    /**
     * The name of the recommendation configuration.
     */
    name: EntityName;
    /**
     * The type of optimization.
     */
    optimizationType: ConfigRecommendationOptimizationType;
    /**
     * The expected compliance against the resiliency policy after applying the configuration change.
     */
    recommendationCompliance?: RecommendationCompliance;
    /**
     * Reference identifier for the recommendation configuration.
     */
    referenceId: SpecReferenceId;
    /**
     * List of the suggested configuration changes.
     */
    suggestedChanges?: SuggestedChangesList;
  }
  export type ConfigRecommendationList = ConfigRecommendation[];
  export type ConfigRecommendationOptimizationType = "LeastCost"|"LeastChange"|"BestAZRecovery"|"LeastErrors"|"BestAttainable"|"BestRegionRecovery"|string;
  export interface Cost {
    /**
     * The cost amount.
     */
    amount: Double;
    /**
     * The cost currency, for example USD.
     */
    currency: CurrencyCode;
    /**
     * The cost frequency.
     */
    frequency: CostFrequency;
  }
  export type CostFrequency = "Hourly"|"Daily"|"Monthly"|"Yearly"|string;
  export interface CreateAppRequest {
    /**
     *  Assessment execution schedule with 'Daily' or 'Disabled' values. 
     */
    assessmentSchedule?: AppAssessmentScheduleType;
    /**
     * Used for an idempotency token. A client token is a unique, case-sensitive string of up to 64 ASCII characters. You should not reuse the same client token for other API requests.
     */
    clientToken?: ClientToken;
    /**
     * The optional description for an app.
     */
    description?: EntityDescription;
    /**
     * The list of events you would like to subscribe and get notification for. Currently, Resilience Hub supports only Drift detected and Scheduled assessment failure events notification.
     */
    eventSubscriptions?: EventSubscriptionList;
    /**
     * Name of the application.
     */
    name: EntityName;
    /**
     * Defines the roles and credentials that Resilience Hub would use while creating the application, importing its resources, and running an assessment.
     */
    permissionModel?: PermissionModel;
    /**
     * Amazon Resource Name (ARN) of the resiliency policy. The format for this ARN is: arn:partition:resiliencehub:region:account:resiliency-policy/policy-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    policyArn?: Arn;
    /**
     * Tags assigned to the resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key/value pair.
     */
    tags?: TagMap;
  }
  export interface CreateAppResponse {
    /**
     * The created application returned as an object with details including compliance status, creation time, description, resiliency score, and more.
     */
    app: App;
  }
  export interface CreateAppVersionAppComponentRequest {
    /**
     * Currently, there is no supported additional information for Application Components.
     */
    additionalInfo?: AdditionalInfoMap;
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Used for an idempotency token. A client token is a unique, case-sensitive string of up to 64 ASCII characters. You should not reuse the same client token for other API requests.
     */
    clientToken?: ClientToken;
    /**
     * Identifier of the Application Component.
     */
    id?: String255;
    /**
     * Name of the Application Component.
     */
    name: String255;
    /**
     * Type of Application Component. For more information about the types of Application Component, see Grouping resources in an AppComponent.
     */
    type: String255;
  }
  export interface CreateAppVersionAppComponentResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * List of Application Components that belong to this resource.
     */
    appComponent?: AppComponent;
    /**
     * Resilience Hub application version.
     */
    appVersion: EntityVersion;
  }
  export interface CreateAppVersionResourceRequest {
    /**
     * Currently, there is no supported additional information for resources.
     */
    additionalInfo?: AdditionalInfoMap;
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * List of Application Components that this resource belongs to. If an Application Component is not part of the Resilience Hub application, it will be added.
     */
    appComponents: AppComponentNameList;
    /**
     * Amazon Web Services account that owns the physical resource.
     */
    awsAccountId?: CustomerId;
    /**
     * Amazon Web Services region that owns the physical resource.
     */
    awsRegion?: AwsRegion;
    /**
     * Used for an idempotency token. A client token is a unique, case-sensitive string of up to 64 ASCII characters. You should not reuse the same client token for other API requests.
     */
    clientToken?: ClientToken;
    /**
     * Logical identifier of the resource.
     */
    logicalResourceId: LogicalResourceId;
    /**
     * Physical identifier of the resource.
     */
    physicalResourceId: String2048;
    /**
     * Name of the resource.
     */
    resourceName?: EntityName;
    /**
     * Type of resource.
     */
    resourceType: String255;
  }
  export interface CreateAppVersionResourceResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Resilience Hub application version.
     */
    appVersion: EntityVersion;
    /**
     * Defines a physical resource. A physical resource is a resource that exists in your account. It can be identified using an Amazon Resource Name (ARN) or a Resilience Hub-native identifier.
     */
    physicalResource?: PhysicalResource;
  }
  export interface CreateRecommendationTemplateRequest {
    /**
     * Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:resiliencehub:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    assessmentArn: Arn;
    /**
     * The name of the Amazon S3 bucket that will contain the recommendation template.
     */
    bucketName?: EntityName;
    /**
     * Used for an idempotency token. A client token is a unique, case-sensitive string of up to 64 ASCII characters. You should not reuse the same client token for other API requests.
     */
    clientToken?: ClientToken;
    /**
     * The format for the recommendation template.  CfnJson  The template is CloudFormation JSON.  CfnYaml  The template is CloudFormation YAML.  
     */
    format?: TemplateFormat;
    /**
     * The name for the recommendation template.
     */
    name: EntityName;
    /**
     * Identifiers for the recommendations used to create a recommendation template.
     */
    recommendationIds?: RecommendationIdList;
    /**
     * An array of strings that specify the recommendation template type or types.  Alarm  The template is an AlarmRecommendation template.  Sop  The template is a SopRecommendation template.  Test  The template is a TestRecommendation template.  
     */
    recommendationTypes?: RenderRecommendationTypeList;
    /**
     * Tags assigned to the resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key/value pair.
     */
    tags?: TagMap;
  }
  export interface CreateRecommendationTemplateResponse {
    /**
     * The newly created recommendation template, returned as an object. This object includes the template's name, format, status, tags, Amazon S3 bucket location, and more.
     */
    recommendationTemplate?: RecommendationTemplate;
  }
  export interface CreateResiliencyPolicyRequest {
    /**
     * Used for an idempotency token. A client token is a unique, case-sensitive string of up to 64 ASCII characters. You should not reuse the same client token for other API requests.
     */
    clientToken?: ClientToken;
    /**
     * Specifies a high-level geographical location constraint for where your resilience policy data can be stored.
     */
    dataLocationConstraint?: DataLocationConstraint;
    /**
     * The type of resiliency policy to be created, including the recovery time objective (RTO) and recovery point objective (RPO) in seconds.
     */
    policy: DisruptionPolicy;
    /**
     * The description for the policy.
     */
    policyDescription?: EntityDescription;
    /**
     * The name of the policy
     */
    policyName: EntityName;
    /**
     * Tags assigned to the resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key/value pair.
     */
    tags?: TagMap;
    /**
     * The tier for this resiliency policy, ranging from the highest severity (MissionCritical) to lowest (NonCritical).
     */
    tier: ResiliencyPolicyTier;
  }
  export interface CreateResiliencyPolicyResponse {
    /**
     * The type of resiliency policy that was created, including the recovery time objective (RTO) and recovery point objective (RPO) in seconds.
     */
    policy: ResiliencyPolicy;
  }
  export type CurrencyCode = string;
  export type CustomerId = string;
  export type DataLocationConstraint = "AnyLocation"|"SameContinent"|"SameCountry"|string;
  export interface DeleteAppAssessmentRequest {
    /**
     * Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:resiliencehub:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    assessmentArn: Arn;
    /**
     * Used for an idempotency token. A client token is a unique, case-sensitive string of up to 64 ASCII characters. You should not reuse the same client token for other API requests.
     */
    clientToken?: ClientToken;
  }
  export interface DeleteAppAssessmentResponse {
    /**
     * Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:resiliencehub:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    assessmentArn: Arn;
    /**
     * The current status of the assessment for the resiliency policy.
     */
    assessmentStatus: AssessmentStatus;
  }
  export interface DeleteAppInputSourceRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Used for an idempotency token. A client token is a unique, case-sensitive string of up to 64 ASCII characters. You should not reuse the same client token for other API requests.
     */
    clientToken?: ClientToken;
    /**
     * The namespace on your Amazon Elastic Kubernetes Service cluster that you want to delete from the Resilience Hub application.
     */
    eksSourceClusterNamespace?: EksSourceClusterNamespace;
    /**
     * The Amazon Resource Name (ARN) of the imported resource you want to remove from the Resilience Hub application. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    sourceArn?: Arn;
    /**
     * The imported Terraform s3 state ﬁle you want to remove from the Resilience Hub application.
     */
    terraformSource?: TerraformSource;
  }
  export interface DeleteAppInputSourceResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn?: Arn;
    /**
     * Name of the input source from where the application resource is imported from.
     */
    appInputSource?: AppInputSource;
  }
  export interface DeleteAppRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Used for an idempotency token. A client token is a unique, case-sensitive string of up to 64 ASCII characters. You should not reuse the same client token for other API requests.
     */
    clientToken?: ClientToken;
    /**
     * A boolean option to force the deletion of an Resilience Hub application. 
     */
    forceDelete?: BooleanOptional;
  }
  export interface DeleteAppResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
  }
  export interface DeleteAppVersionAppComponentRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Used for an idempotency token. A client token is a unique, case-sensitive string of up to 64 ASCII characters. You should not reuse the same client token for other API requests.
     */
    clientToken?: ClientToken;
    /**
     * Identifier of the Application Component.
     */
    id: String255;
  }
  export interface DeleteAppVersionAppComponentResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * List of Application Components that belong to this resource.
     */
    appComponent?: AppComponent;
    /**
     * Resilience Hub application version.
     */
    appVersion: EntityVersion;
  }
  export interface DeleteAppVersionResourceRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Amazon Web Services account that owns the physical resource.
     */
    awsAccountId?: CustomerId;
    /**
     * Amazon Web Services region that owns the physical resource.
     */
    awsRegion?: AwsRegion;
    /**
     * Used for an idempotency token. A client token is a unique, case-sensitive string of up to 64 ASCII characters. You should not reuse the same client token for other API requests.
     */
    clientToken?: ClientToken;
    /**
     * Logical identifier of the resource.
     */
    logicalResourceId?: LogicalResourceId;
    /**
     * Physical identifier of the resource.
     */
    physicalResourceId?: String2048;
    /**
     * Name of the resource.
     */
    resourceName?: EntityName;
  }
  export interface DeleteAppVersionResourceResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Resilience Hub application version.
     */
    appVersion: EntityVersion;
    /**
     * Defines a physical resource. A physical resource is a resource that exists in your account. It can be identified using an Amazon Resource Name (ARN) or a Resilience Hub-native identifier.
     */
    physicalResource?: PhysicalResource;
  }
  export interface DeleteRecommendationTemplateRequest {
    /**
     * Used for an idempotency token. A client token is a unique, case-sensitive string of up to 64 ASCII characters. You should not reuse the same client token for other API requests.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) for a recommendation template.
     */
    recommendationTemplateArn: Arn;
  }
  export interface DeleteRecommendationTemplateResponse {
    /**
     * The Amazon Resource Name (ARN) for a recommendation template.
     */
    recommendationTemplateArn: Arn;
    /**
     * Status of the action.
     */
    status: RecommendationTemplateStatus;
  }
  export interface DeleteResiliencyPolicyRequest {
    /**
     * Used for an idempotency token. A client token is a unique, case-sensitive string of up to 64 ASCII characters. You should not reuse the same client token for other API requests.
     */
    clientToken?: ClientToken;
    /**
     * Amazon Resource Name (ARN) of the resiliency policy. The format for this ARN is: arn:partition:resiliencehub:region:account:resiliency-policy/policy-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    policyArn: Arn;
  }
  export interface DeleteResiliencyPolicyResponse {
    /**
     * Amazon Resource Name (ARN) of the resiliency policy. The format for this ARN is: arn:partition:resiliencehub:region:account:resiliency-policy/policy-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    policyArn: Arn;
  }
  export interface DescribeAppAssessmentRequest {
    /**
     * Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:resiliencehub:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    assessmentArn: Arn;
  }
  export interface DescribeAppAssessmentResponse {
    /**
     * The assessment for an Resilience Hub application, returned as an object. This object includes Amazon Resource Names (ARNs), compliance information, compliance status, cost, messages, resiliency scores, and more.
     */
    assessment: AppAssessment;
  }
  export interface DescribeAppRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
  }
  export interface DescribeAppResponse {
    /**
     * The specified application, returned as an object with details including compliance status, creation time, description, resiliency score, and more.
     */
    app: App;
  }
  export interface DescribeAppVersionAppComponentRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Resilience Hub application version.
     */
    appVersion: EntityVersion;
    /**
     * Identifier of the Application Component.
     */
    id: String255;
  }
  export interface DescribeAppVersionAppComponentResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * List of Application Components that belong to this resource.
     */
    appComponent?: AppComponent;
    /**
     * Resilience Hub application version.
     */
    appVersion: EntityVersion;
  }
  export interface DescribeAppVersionRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Resilience Hub application version.
     */
    appVersion: EntityVersion;
  }
  export interface DescribeAppVersionResourceRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Resilience Hub application version.
     */
    appVersion: EntityVersion;
    /**
     * Amazon Web Services account that owns the physical resource.
     */
    awsAccountId?: CustomerId;
    /**
     * Amazon Web Services region that owns the physical resource.
     */
    awsRegion?: AwsRegion;
    /**
     * Logical identifier of the resource.
     */
    logicalResourceId?: LogicalResourceId;
    /**
     * Physical identifier of the resource.
     */
    physicalResourceId?: String2048;
    /**
     * Name of the resource.
     */
    resourceName?: EntityName;
  }
  export interface DescribeAppVersionResourceResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Resilience Hub application version.
     */
    appVersion: EntityVersion;
    /**
     * Defines a physical resource. A physical resource is a resource that exists in your account. It can be identified using an Amazon Resource Name (ARN) or a Resilience Hub-native identifier.
     */
    physicalResource?: PhysicalResource;
  }
  export interface DescribeAppVersionResourcesResolutionStatusRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
    /**
     * The identifier for a specific resolution.
     */
    resolutionId?: String255;
  }
  export interface DescribeAppVersionResourcesResolutionStatusResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
    /**
     * The returned error message for the request.
     */
    errorMessage?: String500;
    /**
     * The identifier for a specific resolution.
     */
    resolutionId: String255;
    /**
     * Status of the action.
     */
    status: ResourceResolutionStatusType;
  }
  export interface DescribeAppVersionResponse {
    /**
     * Additional configuration parameters for an Resilience Hub application. If you want to implement additionalInfo through the Resilience Hub console rather than using an API call, see Configure the application configuration parameters.  Currently, this parameter supports only failover region and account. 
     */
    additionalInfo?: AdditionalInfoMap;
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Resilience Hub application version.
     */
    appVersion: EntityVersion;
  }
  export interface DescribeAppVersionTemplateRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
  }
  export interface DescribeAppVersionTemplateResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * A JSON string that provides information about your application structure. To learn more about the appTemplateBody template, see the sample template provided in the Examples section. The appTemplateBody JSON string has the following structure:     resources   The list of logical resources that must be included in the Resilience Hub application. Type: Array  Don't add the resources that you want to exclude.  Each resources array item includes the following fields:     logicalResourceId   Logical identifier of the resource. Type: Object Each logicalResourceId object includes the following fields:    identifier  Identifier of the resource. Type: String    logicalStackName  The name of the CloudFormation stack this resource belongs to. Type: String    resourceGroupName  The name of the resource group this resource belongs to. Type: String    terraformSourceName  The name of the Terraform S3 state file this resource belongs to. Type: String    eksSourceName  Name of the Amazon Elastic Kubernetes Service cluster and namespace this resource belongs to.  This parameter accepts values in "eks-cluster/namespace" format.  Type: String       type   The type of resource. Type: string     name   The name of the resource. Type: String    additionalInfo  Additional configuration parameters for an Resilience Hub application. If you want to implement additionalInfo through the Resilience Hub console rather than using an API call, see Configure the application configuration parameters.  Currently, this parameter accepts a key-value mapping (in a string format) of only one failover region and one associated account. Key: "failover-regions"  Value: "[{"region":"&lt;REGION&gt;", "accounts":[{"id":"&lt;ACCOUNT_ID&gt;"}]}]"         appComponents   List of Application Components that this resource belongs to. If an Application Component is not part of the Resilience Hub application, it will be added. Type: Array Each appComponents array item includes the following fields:    name  Name of the Application Component. Type: String    type  Type of Application Component. For more information about the types of Application Component, see Grouping resources in an AppComponent. Type: String    resourceNames  The list of included resources that are assigned to the Application Component. Type: Array of strings    additionalInfo  Additional configuration parameters for an Resilience Hub application. If you want to implement additionalInfo through the Resilience Hub console rather than using an API call, see Configure the application configuration parameters.  Currently, this parameter accepts a key-value mapping (in a string format) of only one failover region and one associated account. Key: "failover-regions"  Value: "[{"region":"&lt;REGION&gt;", "accounts":[{"id":"&lt;ACCOUNT_ID&gt;"}]}]"         excludedResources   The list of logical resource identifiers to be excluded from the application. Type: Array  Don't add the resources that you want to include.  Each excludedResources array item includes the following fields:     logicalResourceIds   Logical identifier of the resource. Type: Object  You can configure only one of the following fields:    logicalStackName     resourceGroupName     terraformSourceName     eksSourceName     Each logicalResourceIds object includes the following fields:    identifier  Identifier of the resource. Type: String    logicalStackName  The name of the CloudFormation stack this resource belongs to. Type: String    resourceGroupName  The name of the resource group this resource belongs to. Type: String    terraformSourceName  The name of the Terraform S3 state file this resource belongs to. Type: String    eksSourceName  Name of the Amazon Elastic Kubernetes Service cluster and namespace this resource belongs to.  This parameter accepts values in "eks-cluster/namespace" format.  Type: String         version   Resilience Hub application version.    additionalInfo  Additional configuration parameters for an Resilience Hub application. If you want to implement additionalInfo through the Resilience Hub console rather than using an API call, see Configure the application configuration parameters.  Currently, this parameter accepts a key-value mapping (in a string format) of only one failover region and one associated account. Key: "failover-regions"  Value: "[{"region":"&lt;REGION&gt;", "accounts":[{"id":"&lt;ACCOUNT_ID&gt;"}]}]"    
     */
    appTemplateBody: AppTemplateBody;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
  }
  export interface DescribeDraftAppVersionResourcesImportStatusRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
  }
  export interface DescribeDraftAppVersionResourcesImportStatusResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
    /**
     * The returned error message for the request.
     */
    errorMessage?: String500;
    /**
     * Status of the action.
     */
    status: ResourceImportStatusType;
    /**
     * The timestamp for when the status last changed.
     */
    statusChangeTime: TimeStamp;
  }
  export interface DescribeResiliencyPolicyRequest {
    /**
     * Amazon Resource Name (ARN) of the resiliency policy. The format for this ARN is: arn:partition:resiliencehub:region:account:resiliency-policy/policy-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    policyArn: Arn;
  }
  export interface DescribeResiliencyPolicyResponse {
    /**
     * Information about the specific resiliency policy, returned as an object. This object includes creation time, data location constraints, its name, description, tags, the recovery time objective (RTO) and recovery point objective (RPO) in seconds, and more.
     */
    policy: ResiliencyPolicy;
  }
  export type DifferenceType = "NotEqual"|string;
  export interface DisruptionCompliance {
    /**
     * The Recovery Point Objective (RPO) that is achievable, in seconds.
     */
    achievableRpoInSecs?: Seconds;
    /**
     * The Recovery Time Objective (RTO) that is achievable, in seconds
     */
    achievableRtoInSecs?: Seconds;
    /**
     * The current status of compliance for the resiliency policy.
     */
    complianceStatus: ComplianceStatus;
    /**
     * The current RPO, in seconds.
     */
    currentRpoInSecs?: Seconds;
    /**
     * The current RTO, in seconds.
     */
    currentRtoInSecs?: Seconds;
    /**
     * The disruption compliance message.
     */
    message?: String500;
    /**
     * The RPO description.
     */
    rpoDescription?: String500;
    /**
     * Reference identifier of the RPO .
     */
    rpoReferenceId?: String500;
    /**
     * The RTO description.
     */
    rtoDescription?: String500;
    /**
     * Reference identifier of the RTO.
     */
    rtoReferenceId?: String500;
  }
  export type DisruptionPolicy = {[key: string]: FailurePolicy};
  export type DisruptionResiliencyScore = {[key: string]: Double};
  export type DisruptionType = "Software"|"Hardware"|"AZ"|"Region"|string;
  export type DocumentName = string;
  export type Double = number;
  export type DriftStatus = "NotChecked"|"NotDetected"|"Detected"|string;
  export type DriftType = "ApplicationCompliance"|string;
  export type EksNamespace = string;
  export type EksNamespaceList = EksNamespace[];
  export interface EksSource {
    /**
     * Amazon Resource Name (ARN) of the Amazon Elastic Kubernetes Service cluster. The format for this ARN is: arn:aws:eks:region:account-id:cluster/cluster-name. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    eksClusterArn: Arn;
    /**
     * The list of namespaces located on your Amazon Elastic Kubernetes Service cluster.
     */
    namespaces: EksNamespaceList;
  }
  export interface EksSourceClusterNamespace {
    /**
     * Amazon Resource Name (ARN) of the Amazon Elastic Kubernetes Service cluster. The format for this ARN is: arn:aws:eks:region:account-id:cluster/cluster-name. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    eksClusterArn: Arn;
    /**
     * Name of the namespace that is located on your Amazon Elastic Kubernetes Service cluster.
     */
    namespace: EksNamespace;
  }
  export type EksSourceList = EksSource[];
  export type EntityDescription = string;
  export type EntityId = string;
  export type EntityName = string;
  export type EntityNameList = EntityName[];
  export type EntityVersion = string;
  export type ErrorMessage = string;
  export type EstimatedCostTier = "L1"|"L2"|"L3"|"L4"|string;
  export interface EventSubscription {
    /**
     * The type of event you would like to subscribe and get notification for. Currently, Resilience Hub supports notifications only for Drift detected (DriftDetected) and Scheduled assessment failure (ScheduledAssessmentFailure) events.
     */
    eventType: EventType;
    /**
     * Unique name to identify an event subscription.
     */
    name: String255;
    /**
     * Amazon Resource Name (ARN) of the Amazon Simple Notification Service topic. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    snsTopicArn?: Arn;
  }
  export type EventSubscriptionList = EventSubscription[];
  export type EventType = "ScheduledAssessmentFailure"|"DriftDetected"|string;
  export type ExcludeRecommendationReason = "AlreadyImplemented"|"NotRelevant"|"ComplexityOfImplementation"|string;
  export interface FailurePolicy {
    /**
     * The Recovery Point Objective (RPO), in seconds.
     */
    rpoInSecs: Seconds;
    /**
     * The Recovery Time Objective (RTO), in seconds.
     */
    rtoInSecs: Seconds;
  }
  export type HaArchitecture = "MultiSite"|"WarmStandby"|"PilotLight"|"BackupAndRestore"|"NoRecoveryPlan"|string;
  export type IamRoleArn = string;
  export type IamRoleArnList = IamRoleArn[];
  export type IamRoleName = string;
  export interface ImportResourcesToDraftAppVersionRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * The input sources of the Amazon Elastic Kubernetes Service resources you need to import.
     */
    eksSources?: EksSourceList;
    /**
     * The import strategy you would like to set to import resources into Resilience Hub application.
     */
    importStrategy?: ResourceImportStrategyType;
    /**
     * The Amazon Resource Names (ARNs) for the resources.
     */
    sourceArns?: ArnList;
    /**
     *  A list of terraform file s3 URLs you need to import. 
     */
    terraformSources?: TerraformSourceList;
  }
  export interface ImportResourcesToDraftAppVersionResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
    /**
     * The input sources of the Amazon Elastic Kubernetes Service resources you have imported.
     */
    eksSources?: EksSourceList;
    /**
     * The Amazon Resource Names (ARNs) for the resources you have imported.
     */
    sourceArns?: ArnList;
    /**
     * Status of the action.
     */
    status: ResourceImportStatusType;
    /**
     *  A list of terraform file s3 URLs you have imported. 
     */
    terraformSources?: TerraformSourceList;
  }
  export type Integer = number;
  export interface ListAlarmRecommendationsRequest {
    /**
     * Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:resiliencehub:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    assessmentArn: Arn;
    /**
     * Maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAlarmRecommendationsResponse {
    /**
     * The alarm recommendations for an Resilience Hub application, returned as an object. This object includes Application Component names, descriptions, information about whether a recommendation has already been implemented or not, prerequisites, and more.
     */
    alarmRecommendations: AlarmRecommendationList;
    /**
     * Token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppAssessmentComplianceDriftsRequest {
    /**
     * Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:resiliencehub:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    assessmentArn: Arn;
    /**
     * Indicates the maximum number of applications requested.
     */
    maxResults?: MaxResults;
    /**
     * Indicates the unique token number of the next application to be checked for compliance and regulatory requirements from the list of applications.
     */
    nextToken?: NextToken;
  }
  export interface ListAppAssessmentComplianceDriftsResponse {
    /**
     * Indicates compliance drifts (recovery time objective (RTO) and recovery point objective (RPO)) detected for an assessed entity.
     */
    complianceDrifts: ComplianceDriftList;
    /**
     * Token number of the next application to be checked for compliance and regulatory requirements from the list of applications.
     */
    nextToken?: NextToken;
  }
  export interface ListAppAssessmentsRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn?: Arn;
    /**
     * The name for the assessment.
     */
    assessmentName?: EntityName;
    /**
     * The current status of the assessment for the resiliency policy.
     */
    assessmentStatus?: AssessmentStatusList;
    /**
     * The current status of compliance for the resiliency policy.
     */
    complianceStatus?: ComplianceStatus;
    /**
     * Specifies the entity that invoked a specific assessment, either a User or the System.
     */
    invoker?: AssessmentInvoker;
    /**
     * Maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The default is to sort by ascending startTime. To sort by descending startTime, set reverseOrder to true.
     */
    reverseOrder?: BooleanOptional;
  }
  export interface ListAppAssessmentsResponse {
    /**
     * The summaries for the specified assessments, returned as an object. This object includes application versions, associated Amazon Resource Numbers (ARNs), cost, messages, resiliency scores, and more.
     */
    assessmentSummaries: AppAssessmentSummaryList;
    /**
     * Token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppComponentCompliancesRequest {
    /**
     * Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:resiliencehub:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    assessmentArn: Arn;
    /**
     * Maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppComponentCompliancesResponse {
    /**
     * The compliances for an Resilience Hub Application Component, returned as an object. This object contains the names of the Application Components, compliances, costs, resiliency scores, outage scores, and more.
     */
    componentCompliances: ComponentCompliancesList;
    /**
     * Token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppComponentRecommendationsRequest {
    /**
     * Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:resiliencehub:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    assessmentArn: Arn;
    /**
     * Maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppComponentRecommendationsResponse {
    /**
     * The recommendations for an Resilience Hub Application Component, returned as an object. This object contains the names of the Application Components, configuration recommendations, and recommendation statuses.
     */
    componentRecommendations: ComponentRecommendationList;
    /**
     * Token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppInputSourcesRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Resilience Hub application version.
     */
    appVersion: EntityVersion;
    /**
     * Maximum number of input sources to be displayed per Resilience Hub application.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppInputSourcesResponse {
    /**
     * The list of Resilience Hub application input sources.
     */
    appInputSources: AppInputSourceList;
    /**
     * Token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppVersionAppComponentsRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Version of the Application Component.
     */
    appVersion: EntityVersion;
    /**
     * Maximum number of Application Components to be displayed per Resilience Hub application version.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppVersionAppComponentsResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Defines an Application Component.
     */
    appComponents?: AppComponentList;
    /**
     * Resilience Hub application version.
     */
    appVersion: EntityVersion;
    /**
     * Token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppVersionResourceMappingsRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
    /**
     * Maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppVersionResourceMappingsResponse {
    /**
     * Token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
    /**
     * Mappings used to map logical resources from the template to physical resources. You can use the mapping type CFN_STACK if the application template uses a logical stack name. Or you can map individual resources by using the mapping type RESOURCE. We recommend using the mapping type CFN_STACK if the application is backed by a CloudFormation stack.
     */
    resourceMappings: ResourceMappingList;
  }
  export interface ListAppVersionResourcesRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
    /**
     * Maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The identifier for a specific resolution.
     */
    resolutionId?: String255;
  }
  export interface ListAppVersionResourcesResponse {
    /**
     * Token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
    /**
     * The physical resources in the application version.
     */
    physicalResources: PhysicalResourceList;
    /**
     * The ID for a specific resolution.
     */
    resolutionId: String255;
  }
  export interface ListAppVersionsRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Upper limit of the time range to filter the application versions.
     */
    endTime?: TimeStamp;
    /**
     * Maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
    /**
     * Lower limit of the time range to filter the application versions.
     */
    startTime?: TimeStamp;
  }
  export interface ListAppVersionsResponse {
    /**
     * The version of the application.
     */
    appVersions: AppVersionList;
    /**
     * Token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppsRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn?: Arn;
    /**
     * Maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * The name for the one of the listed applications.
     */
    name?: EntityName;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppsResponse {
    /**
     * Summaries for the Resilience Hub application.
     */
    appSummaries: AppSummaryList;
    /**
     * Token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListRecommendationTemplatesRequest {
    /**
     * Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:resiliencehub:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    assessmentArn: Arn;
    /**
     * Maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * The name for one of the listed recommendation templates.
     */
    name?: EntityName;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The Amazon Resource Name (ARN) for a recommendation template.
     */
    recommendationTemplateArn?: Arn;
    /**
     * The default is to sort by ascending startTime. To sort by descending startTime, set reverseOrder to true.
     */
    reverseOrder?: BooleanOptional;
    /**
     * Status of the action.
     */
    status?: RecommendationTemplateStatusList;
  }
  export interface ListRecommendationTemplatesResponse {
    /**
     * Token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
    /**
     * The recommendation templates for the Resilience Hub applications.
     */
    recommendationTemplates?: RecommendationTemplateList;
  }
  export interface ListResiliencyPoliciesRequest {
    /**
     * Maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The name of the policy
     */
    policyName?: EntityName;
  }
  export interface ListResiliencyPoliciesResponse {
    /**
     * Token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
    /**
     * The resiliency policies for the Resilience Hub applications.
     */
    resiliencyPolicies: ResiliencyPolicies;
  }
  export interface ListSopRecommendationsRequest {
    /**
     * Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:resiliencehub:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    assessmentArn: Arn;
    /**
     * Maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListSopRecommendationsResponse {
    /**
     * Token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
    /**
     * The standard operating procedure (SOP) recommendations for the Resilience Hub applications.
     */
    sopRecommendations: SopRecommendationList;
  }
  export interface ListSuggestedResiliencyPoliciesRequest {
    /**
     * Maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListSuggestedResiliencyPoliciesResponse {
    /**
     * Token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
    /**
     * The suggested resiliency policies for the Resilience Hub applications.
     */
    resiliencyPolicies: ResiliencyPolicies;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for a specific resource in your Resilience Hub application.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * Tags assigned to the resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key/value pair.
     */
    tags?: TagMap;
  }
  export interface ListTestRecommendationsRequest {
    /**
     * Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:resiliencehub:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    assessmentArn: Arn;
    /**
     * Maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListTestRecommendationsResponse {
    /**
     * Token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
    /**
     * The test recommendations for the Resilience Hub application.
     */
    testRecommendations: TestRecommendationList;
  }
  export interface ListUnsupportedAppVersionResourcesRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
    /**
     * Maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The identifier for a specific resolution.
     */
    resolutionId?: String255;
  }
  export interface ListUnsupportedAppVersionResourcesResponse {
    /**
     * Token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
    /**
     * The identifier for a specific resolution.
     */
    resolutionId: String255;
    /**
     * The unsupported resources for the application.
     */
    unsupportedResources: UnsupportedResourceList;
  }
  export interface LogicalResourceId {
    /**
     * Name of the Amazon Elastic Kubernetes Service cluster and namespace this resource belongs to.  This parameter accepts values in "eks-cluster/namespace" format. 
     */
    eksSourceName?: String255;
    /**
     * Identifier of the resource.
     */
    identifier: String255;
    /**
     * The name of the CloudFormation stack this resource belongs to.
     */
    logicalStackName?: String255;
    /**
     * The name of the resource group that this resource belongs to.
     */
    resourceGroupName?: EntityName;
    /**
     *  The name of the Terraform S3 state file this resource belongs to. 
     */
    terraformSourceName?: String255;
  }
  export type LongOptional = number;
  export type MaxResults = number;
  export type NextToken = string;
  export interface PermissionModel {
    /**
     * Defines a list of role Amazon Resource Names (ARNs) to be used in other accounts. These ARNs are used for querying purposes while importing resources and assessing your application.    These ARNs are required only when your resources are in other accounts and you have different role name in these accounts. Else, the invoker role name will be used in the other accounts.   These roles must have a trust policy with iam:AssumeRole permission to the invoker role in the primary account.   
     */
    crossAccountRoleArns?: IamRoleArnList;
    /**
     * Existing Amazon Web Services IAM role name in the primary Amazon Web Services account that will be assumed by Resilience Hub Service Principle to obtain a read-only access to your application resources while running an assessment.  You must have iam:passRole permission for this role while creating or updating the application. 
     */
    invokerRoleName?: IamRoleName;
    /**
     * Defines how Resilience Hub scans your resources. It can scan for the resources by using a pre-existing role in your Amazon Web Services account, or by using the credentials of the current IAM user.
     */
    type: PermissionModelType;
  }
  export type PermissionModelType = "LegacyIAMUser"|"RoleBased"|string;
  export type PhysicalIdentifierType = "Arn"|"Native"|string;
  export interface PhysicalResource {
    /**
     * Additional configuration parameters for an Resilience Hub application. If you want to implement additionalInfo through the Resilience Hub console rather than using an API call, see Configure the application configuration parameters.  Currently, this parameter accepts a key-value mapping (in a string format) of only one failover region and one associated account. Key: "failover-regions"  Value: "[{"region":"&lt;REGION&gt;", "accounts":[{"id":"&lt;ACCOUNT_ID&gt;"}]}]"  
     */
    additionalInfo?: AdditionalInfoMap;
    /**
     * The application components that belong to this resource.
     */
    appComponents?: AppComponentList;
    /**
     * Indicates if a resource is included or excluded from the assessment.
     */
    excluded?: BooleanOptional;
    /**
     * Logical identifier of the resource.
     */
    logicalResourceId: LogicalResourceId;
    /**
     * Name of the parent resource.
     */
    parentResourceName?: EntityName;
    /**
     * Identifier of the physical resource.
     */
    physicalResourceId: PhysicalResourceId;
    /**
     * The name of the resource.
     */
    resourceName?: EntityName;
    /**
     * The type of resource.
     */
    resourceType: String255;
    /**
     * Type of input source.
     */
    sourceType?: ResourceSourceType;
  }
  export interface PhysicalResourceId {
    /**
     * The Amazon Web Services account that owns the physical resource.
     */
    awsAccountId?: CustomerId;
    /**
     * The Amazon Web Services Region that the physical resource is located in.
     */
    awsRegion?: AwsRegion;
    /**
     * Identifier of the physical resource.
     */
    identifier: String255;
    /**
     * Specifies the type of physical resource identifier.  Arn  The resource identifier is an Amazon Resource Name (ARN) and it can identify the following list of resources:    AWS::ECS::Service     AWS::EFS::FileSystem     AWS::ElasticLoadBalancingV2::LoadBalancer     AWS::Lambda::Function     AWS::SNS::Topic     Native  The resource identifier is an Resilience Hub-native identifier and it can identify the following list of resources:    AWS::ApiGateway::RestApi     AWS::ApiGatewayV2::Api     AWS::AutoScaling::AutoScalingGroup     AWS::DocDB::DBCluster     AWS::DocDB::DBGlobalCluster     AWS::DocDB::DBInstance     AWS::DynamoDB::GlobalTable     AWS::DynamoDB::Table     AWS::EC2::EC2Fleet     AWS::EC2::Instance     AWS::EC2::NatGateway     AWS::EC2::Volume     AWS::ElasticLoadBalancing::LoadBalancer     AWS::RDS::DBCluster     AWS::RDS::DBInstance     AWS::RDS::GlobalCluster     AWS::Route53::RecordSet     AWS::S3::Bucket     AWS::SQS::Queue     
     */
    type: PhysicalIdentifierType;
  }
  export type PhysicalResourceList = PhysicalResource[];
  export interface PublishAppVersionRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Name of the application version.
     */
    versionName?: EntityVersion;
  }
  export interface PublishAppVersionResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion?: EntityVersion;
    /**
     * Identifier of the application version.
     */
    identifier?: LongOptional;
    /**
     * Name of the application version.
     */
    versionName?: EntityVersion;
  }
  export interface PutDraftAppVersionTemplateRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * A JSON string that provides information about your application structure. To learn more about the appTemplateBody template, see the sample template provided in the Examples section. The appTemplateBody JSON string has the following structure:     resources   The list of logical resources that must be included in the Resilience Hub application. Type: Array  Don't add the resources that you want to exclude.  Each resources array item includes the following fields:     logicalResourceId   Logical identifier of the resource. Type: Object Each logicalResourceId object includes the following fields:    identifier  Identifier of the resource. Type: String    logicalStackName  The name of the CloudFormation stack this resource belongs to. Type: String    resourceGroupName  The name of the resource group this resource belongs to. Type: String    terraformSourceName  The name of the Terraform S3 state file this resource belongs to. Type: String    eksSourceName  Name of the Amazon Elastic Kubernetes Service cluster and namespace this resource belongs to.  This parameter accepts values in "eks-cluster/namespace" format.  Type: String       type   The type of resource. Type: string     name   The name of the resource. Type: String    additionalInfo  Additional configuration parameters for an Resilience Hub application. If you want to implement additionalInfo through the Resilience Hub console rather than using an API call, see Configure the application configuration parameters.  Currently, this parameter accepts a key-value mapping (in a string format) of only one failover region and one associated account. Key: "failover-regions"  Value: "[{"region":"&lt;REGION&gt;", "accounts":[{"id":"&lt;ACCOUNT_ID&gt;"}]}]"         appComponents   List of Application Components that this resource belongs to. If an Application Component is not part of the Resilience Hub application, it will be added. Type: Array Each appComponents array item includes the following fields:    name  Name of the Application Component. Type: String    type  Type of Application Component. For more information about the types of Application Component, see Grouping resources in an AppComponent. Type: String    resourceNames  The list of included resources that are assigned to the Application Component. Type: Array of strings    additionalInfo  Additional configuration parameters for an Resilience Hub application. If you want to implement additionalInfo through the Resilience Hub console rather than using an API call, see Configure the application configuration parameters.  Currently, this parameter accepts a key-value mapping (in a string format) of only one failover region and one associated account. Key: "failover-regions"  Value: "[{"region":"&lt;REGION&gt;", "accounts":[{"id":"&lt;ACCOUNT_ID&gt;"}]}]"         excludedResources   The list of logical resource identifiers to be excluded from the application. Type: Array  Don't add the resources that you want to include.  Each excludedResources array item includes the following fields:     logicalResourceIds   Logical identifier of the resource. Type: Object  You can configure only one of the following fields:    logicalStackName     resourceGroupName     terraformSourceName     eksSourceName     Each logicalResourceIds object includes the following fields:    identifier  Identifier of the resource. Type: String    logicalStackName  The name of the CloudFormation stack this resource belongs to. Type: String    resourceGroupName  The name of the resource group this resource belongs to. Type: String    terraformSourceName  The name of the Terraform S3 state file this resource belongs to. Type: String    eksSourceName  Name of the Amazon Elastic Kubernetes Service cluster and namespace this resource belongs to.  This parameter accepts values in "eks-cluster/namespace" format.  Type: String         version   Resilience Hub application version.    additionalInfo  Additional configuration parameters for an Resilience Hub application. If you want to implement additionalInfo through the Resilience Hub console rather than using an API call, see Configure the application configuration parameters.  Currently, this parameter accepts a key-value mapping (in a string format) of only one failover region and one associated account. Key: "failover-regions"  Value: "[{"region":"&lt;REGION&gt;", "accounts":[{"id":"&lt;ACCOUNT_ID&gt;"}]}]"    
     */
    appTemplateBody: AppTemplateBody;
  }
  export interface PutDraftAppVersionTemplateResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn?: Arn;
    /**
     * The version of the application.
     */
    appVersion?: EntityVersion;
  }
  export type RecommendationCompliance = {[key: string]: RecommendationDisruptionCompliance};
  export type RecommendationComplianceStatus = "BreachedUnattainable"|"BreachedCanMeet"|"MetCanImprove"|string;
  export interface RecommendationDisruptionCompliance {
    /**
     * The expected compliance status after applying the recommended configuration change.
     */
    expectedComplianceStatus: ComplianceStatus;
    /**
     * The expected Recovery Point Objective (RPO) description after applying the recommended configuration change.
     */
    expectedRpoDescription?: String500;
    /**
     * The expected RPO after applying the recommended configuration change.
     */
    expectedRpoInSecs?: Seconds;
    /**
     * The expected Recovery Time Objective (RTO) description after applying the recommended configuration change.
     */
    expectedRtoDescription?: String500;
    /**
     * The expected RTO after applying the recommended configuration change.
     */
    expectedRtoInSecs?: Seconds;
  }
  export type RecommendationIdList = Uuid[];
  export interface RecommendationItem {
    /**
     * Specifies if the recommendation has already been implemented.
     */
    alreadyImplemented?: BooleanOptional;
    /**
     * Indicates the reason for excluding an operational recommendation.
     */
    excludeReason?: ExcludeRecommendationReason;
    /**
     * Indicates if an operational recommendation item is excluded.
     */
    excluded?: BooleanOptional;
    /**
     * Identifier of the resource.
     */
    resourceId?: String500;
    /**
     * Identifier of the target account.
     */
    targetAccountId?: CustomerId;
    /**
     * The target region.
     */
    targetRegion?: AwsRegion;
  }
  export type RecommendationItemList = RecommendationItem[];
  export interface RecommendationTemplate {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn?: Arn;
    /**
     * Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:resiliencehub:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    assessmentArn: Arn;
    /**
     * The end time for the action.
     */
    endTime?: TimeStamp;
    /**
     * Format of the recommendation template.  CfnJson  The template is CloudFormation JSON.  CfnYaml  The template is CloudFormation YAML.  
     */
    format: TemplateFormat;
    /**
     * Message for the recommendation template.
     */
    message?: String500;
    /**
     * Name for the recommendation template.
     */
    name: EntityName;
    /**
     * Indicates if replacements are needed.
     */
    needsReplacements?: BooleanOptional;
    /**
     * Identifiers for the recommendations used in the recommendation template.
     */
    recommendationIds?: RecommendationIdList;
    /**
     * Amazon Resource Name (ARN) for the recommendation template.
     */
    recommendationTemplateArn: Arn;
    /**
     * An array of strings that specify the recommendation template type or types.  Alarm  The template is an AlarmRecommendation template.  Sop  The template is a SopRecommendation template.  Test  The template is a TestRecommendation template.  
     */
    recommendationTypes: RenderRecommendationTypeList;
    /**
     * The start time for the action.
     */
    startTime?: TimeStamp;
    /**
     * Status of the action.
     */
    status: RecommendationTemplateStatus;
    /**
     * Tags assigned to the resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key/value pair.
     */
    tags?: TagMap;
    /**
     * The file location of the template.
     */
    templatesLocation?: S3Location;
  }
  export type RecommendationTemplateList = RecommendationTemplate[];
  export type RecommendationTemplateStatus = "Pending"|"InProgress"|"Failed"|"Success"|string;
  export type RecommendationTemplateStatusList = RecommendationTemplateStatus[];
  export interface RemoveDraftAppVersionResourceMappingsRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * The names of the registered applications you want to remove from the resource mappings.
     */
    appRegistryAppNames?: EntityNameList;
    /**
     * The names of the Amazon Elastic Kubernetes Service clusters and namespaces you want to remove from the resource mappings.  This parameter accepts values in "eks-cluster/namespace" format. 
     */
    eksSourceNames?: String255List;
    /**
     * The names of the CloudFormation stacks you want to remove from the resource mappings.
     */
    logicalStackNames?: String255List;
    /**
     * The names of the resource groups you want to remove from the resource mappings.
     */
    resourceGroupNames?: EntityNameList;
    /**
     * The names of the resources you want to remove from the resource mappings.
     */
    resourceNames?: EntityNameList;
    /**
     * The names of the Terraform sources you want to remove from the resource mappings.
     */
    terraformSourceNames?: String255List;
  }
  export interface RemoveDraftAppVersionResourceMappingsResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn?: Arn;
    /**
     * The version of the application.
     */
    appVersion?: EntityVersion;
  }
  export type RenderRecommendationType = "Alarm"|"Sop"|"Test"|string;
  export type RenderRecommendationTypeList = RenderRecommendationType[];
  export type ResiliencyPolicies = ResiliencyPolicy[];
  export interface ResiliencyPolicy {
    /**
     * The timestamp for when the resiliency policy was created.
     */
    creationTime?: TimeStamp;
    /**
     * Specifies a high-level geographical location constraint for where your resilience policy data can be stored.
     */
    dataLocationConstraint?: DataLocationConstraint;
    /**
     * Specifies the estimated cost tier of the resiliency policy.
     */
    estimatedCostTier?: EstimatedCostTier;
    /**
     * The resiliency policy.
     */
    policy?: DisruptionPolicy;
    /**
     * Amazon Resource Name (ARN) of the resiliency policy. The format for this ARN is: arn:partition:resiliencehub:region:account:resiliency-policy/policy-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    policyArn?: Arn;
    /**
     * The description for the policy.
     */
    policyDescription?: EntityDescription;
    /**
     * The name of the policy
     */
    policyName?: EntityName;
    /**
     * Tags assigned to the resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key/value pair.
     */
    tags?: TagMap;
    /**
     * The tier for this resiliency policy, ranging from the highest severity (MissionCritical) to lowest (NonCritical).
     */
    tier?: ResiliencyPolicyTier;
  }
  export type ResiliencyPolicyTier = "MissionCritical"|"Critical"|"Important"|"CoreServices"|"NonCritical"|"NotApplicable"|string;
  export interface ResiliencyScore {
    /**
     * The disruption score for a valid key.
     */
    disruptionScore: DisruptionResiliencyScore;
    /**
     * The outage score for a valid key.
     */
    score: Double;
  }
  export interface ResolveAppVersionResourcesRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
  }
  export interface ResolveAppVersionResourcesResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
    /**
     * The identifier for a specific resolution.
     */
    resolutionId: String255;
    /**
     * Status of the action.
     */
    status: ResourceResolutionStatusType;
  }
  export interface ResourceError {
    /**
     * Identifier of the logical resource. 
     */
    logicalResourceId?: String255;
    /**
     * Identifier of the physical resource. 
     */
    physicalResourceId?: String255;
    /**
     *  This is the error message. 
     */
    reason?: ErrorMessage;
  }
  export type ResourceErrorList = ResourceError[];
  export interface ResourceErrorsDetails {
    /**
     *  This indicates if there are more errors not listed in the resourceErrors list. 
     */
    hasMoreErrors?: BooleanOptional;
    /**
     *  A list of errors retrieving an application's resources. 
     */
    resourceErrors?: ResourceErrorList;
  }
  export type ResourceImportStatusType = "Pending"|"InProgress"|"Failed"|"Success"|string;
  export type ResourceImportStrategyType = "AddOnly"|"ReplaceAll"|string;
  export interface ResourceMapping {
    /**
     * The name of the application this resource is mapped to.
     */
    appRegistryAppName?: EntityName;
    /**
     * Name of the Amazon Elastic Kubernetes Service cluster and namespace this resource belongs to.  This parameter accepts values in "eks-cluster/namespace" format. 
     */
    eksSourceName?: String255;
    /**
     * The name of the CloudFormation stack this resource is mapped to.
     */
    logicalStackName?: String255;
    /**
     * Specifies the type of resource mapping.  AppRegistryApp  The resource is mapped to another application. The name of the application is contained in the appRegistryAppName property.  CfnStack  The resource is mapped to a CloudFormation stack. The name of the CloudFormation stack is contained in the logicalStackName property.  Resource  The resource is mapped to another resource. The name of the resource is contained in the resourceName property.  ResourceGroup  The resource is mapped to Resource Groups. The name of the resource group is contained in the resourceGroupName property.  
     */
    mappingType: ResourceMappingType;
    /**
     * Identifier of the physical resource.
     */
    physicalResourceId: PhysicalResourceId;
    /**
     * Name of the resource group that the resource is mapped to.
     */
    resourceGroupName?: EntityName;
    /**
     * Name of the resource that the resource is mapped to.
     */
    resourceName?: EntityName;
    /**
     *  The short name of the Terraform source. 
     */
    terraformSourceName?: String255;
  }
  export type ResourceMappingList = ResourceMapping[];
  export type ResourceMappingType = "CfnStack"|"Resource"|"AppRegistryApp"|"ResourceGroup"|"Terraform"|"EKS"|string;
  export type ResourceResolutionStatusType = "Pending"|"InProgress"|"Failed"|"Success"|string;
  export type ResourceSourceType = "AppTemplate"|"Discovered"|string;
  export interface S3Location {
    /**
     * The name of the Amazon S3 bucket.
     */
    bucket?: String500;
    /**
     * The prefix for the Amazon S3 bucket.
     */
    prefix?: String500;
  }
  export type S3Url = string;
  export type Seconds = number;
  export interface SopRecommendation {
    /**
     * Name of the Application Component.
     */
    appComponentName?: EntityId;
    /**
     * Description of the SOP recommendation.
     */
    description?: String500;
    /**
     * The recommendation items.
     */
    items?: RecommendationItemList;
    /**
     * Name of the SOP recommendation.
     */
    name?: DocumentName;
    /**
     * Prerequisite for the SOP recommendation.
     */
    prerequisite?: String500;
    /**
     * Identifier for the SOP recommendation.
     */
    recommendationId: Uuid;
    /**
     * Reference identifier for the SOP recommendation.
     */
    referenceId: SpecReferenceId;
    /**
     * The service type.
     */
    serviceType: SopServiceType;
  }
  export type SopRecommendationList = SopRecommendation[];
  export type SopServiceType = "SSM"|string;
  export type SpecReferenceId = string;
  export interface StartAppAssessmentRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
    /**
     * The name for the assessment.
     */
    assessmentName: EntityName;
    /**
     * Used for an idempotency token. A client token is a unique, case-sensitive string of up to 64 ASCII characters. You should not reuse the same client token for other API requests.
     */
    clientToken?: ClientToken;
    /**
     * Tags assigned to the resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key/value pair.
     */
    tags?: TagMap;
  }
  export interface StartAppAssessmentResponse {
    /**
     * The assessment created.
     */
    assessment: AppAssessment;
  }
  export type String1024 = string;
  export type String128WithoutWhitespace = string;
  export type String2048 = string;
  export type String255 = string;
  export type String255List = String255[];
  export type String500 = string;
  export type SuggestedChangesList = EntityDescription[];
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * Amazon Resource Name (ARN) of the resource. 
     */
    resourceArn: Arn;
    /**
     * The tags to assign to the resource. Each tag consists of a key/value pair.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TemplateFormat = "CfnYaml"|"CfnJson"|string;
  export interface TerraformSource {
    /**
     *  The URL of the Terraform s3 state file you need to import. 
     */
    s3StateFileUrl: S3Url;
  }
  export type TerraformSourceList = TerraformSource[];
  export interface TestRecommendation {
    /**
     * Name of the Application Component.
     */
    appComponentName?: EntityId;
    /**
     *  A list of recommended alarms that are used in the test and must be exported before or with the test. 
     */
    dependsOnAlarms?: AlarmReferenceIdList;
    /**
     * Description for the test recommendation.
     */
    description?: String500;
    /**
     * Intent of the test recommendation.
     */
    intent?: EntityDescription;
    /**
     * The test recommendation items.
     */
    items?: RecommendationItemList;
    /**
     * Name of the test recommendation.
     */
    name?: DocumentName;
    /**
     * Prerequisite of the test recommendation.
     */
    prerequisite?: String500;
    /**
     * Identifier for the test recommendation.
     */
    recommendationId?: Uuid;
    /**
     * Reference identifier for the test recommendation.
     */
    referenceId: SpecReferenceId;
    /**
     * Level of risk for this test recommendation.
     */
    risk?: TestRisk;
    /**
     * Type of test recommendation.
     */
    type?: TestType;
  }
  export type TestRecommendationList = TestRecommendation[];
  export type TestRisk = "Small"|"Medium"|"High"|string;
  export type TestType = "Software"|"Hardware"|"AZ"|"Region"|string;
  export type TimeStamp = Date;
  export interface UnsupportedResource {
    /**
     * Logical resource identifier for the unsupported resource.
     */
    logicalResourceId: LogicalResourceId;
    /**
     * Physical resource identifier for the unsupported resource.
     */
    physicalResourceId: PhysicalResourceId;
    /**
     * The type of resource.
     */
    resourceType: String255;
    /**
     * The status of the unsupported resource.
     */
    unsupportedResourceStatus?: String255;
  }
  export type UnsupportedResourceList = UnsupportedResource[];
  export interface UntagResourceRequest {
    /**
     * Amazon Resource Name (ARN) of the resource. 
     */
    resourceArn: Arn;
    /**
     * The keys of the tags you want to remove.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAppRequest {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     *  Assessment execution schedule with 'Daily' or 'Disabled' values. 
     */
    assessmentSchedule?: AppAssessmentScheduleType;
    /**
     * Specifies if the resiliency policy ARN should be cleared.
     */
    clearResiliencyPolicyArn?: BooleanOptional;
    /**
     * The optional description for an app.
     */
    description?: EntityDescription;
    /**
     * The list of events you would like to subscribe and get notification for. Currently, Resilience Hub supports notifications only for Drift detected and Scheduled assessment failure events.
     */
    eventSubscriptions?: EventSubscriptionList;
    /**
     * Defines the roles and credentials that Resilience Hub would use while creating an application, importing its resources, and running an assessment.
     */
    permissionModel?: PermissionModel;
    /**
     * Amazon Resource Name (ARN) of the resiliency policy. The format for this ARN is: arn:partition:resiliencehub:region:account:resiliency-policy/policy-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    policyArn?: Arn;
  }
  export interface UpdateAppResponse {
    /**
     * The specified application, returned as an object with details including compliance status, creation time, description, resiliency score, and more.
     */
    app: App;
  }
  export interface UpdateAppVersionAppComponentRequest {
    /**
     * Currently, there is no supported additional information for Application Components.
     */
    additionalInfo?: AdditionalInfoMap;
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Identifier of the Application Component.
     */
    id: String255;
    /**
     * Name of the Application Component.
     */
    name?: String255;
    /**
     * Type of Application Component. For more information about the types of Application Component, see Grouping resources in an AppComponent.
     */
    type?: String255;
  }
  export interface UpdateAppVersionAppComponentResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * List of Application Components that belong to this resource.
     */
    appComponent?: AppComponent;
    /**
     * Resilience Hub application version.
     */
    appVersion: EntityVersion;
  }
  export interface UpdateAppVersionRequest {
    /**
     * Additional configuration parameters for an Resilience Hub application. If you want to implement additionalInfo through the Resilience Hub console rather than using an API call, see Configure the application configuration parameters.  Currently, this parameter accepts a key-value mapping (in a string format) of only one failover region and one associated account. Key: "failover-regions"  Value: "[{"region":"&lt;REGION&gt;", "accounts":[{"id":"&lt;ACCOUNT_ID&gt;"}]}]"  
     */
    additionalInfo?: AdditionalInfoMap;
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
  }
  export interface UpdateAppVersionResourceRequest {
    /**
     * Currently, there is no supported additional information for resources.
     */
    additionalInfo?: AdditionalInfoMap;
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * List of Application Components that this resource belongs to. If an Application Component is not part of the Resilience Hub application, it will be added.
     */
    appComponents?: AppComponentNameList;
    /**
     * Amazon Web Services account that owns the physical resource.
     */
    awsAccountId?: CustomerId;
    /**
     * Amazon Web Services region that owns the physical resource.
     */
    awsRegion?: AwsRegion;
    /**
     * Indicates if a resource is excluded from an Resilience Hub application.  You can exclude only imported resources from an Resilience Hub application. 
     */
    excluded?: BooleanOptional;
    /**
     * Logical identifier of the resource.
     */
    logicalResourceId?: LogicalResourceId;
    /**
     * Physical identifier of the resource.
     */
    physicalResourceId?: String2048;
    /**
     * Name of the resource.
     */
    resourceName?: EntityName;
    /**
     * Type of resource.
     */
    resourceType?: String255;
  }
  export interface UpdateAppVersionResourceResponse {
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Resilience Hub application version.
     */
    appVersion: EntityVersion;
    /**
     * Defines a physical resource. A physical resource is a resource that exists in your account. It can be identified using an Amazon Resource Name (ARN) or a Resilience Hub-native identifier.
     */
    physicalResource?: PhysicalResource;
  }
  export interface UpdateAppVersionResponse {
    /**
     * Additional configuration parameters for an Resilience Hub application. If you want to implement additionalInfo through the Resilience Hub console rather than using an API call, see Configure the application configuration parameters.  Currently, this parameter supports only failover region and account. 
     */
    additionalInfo?: AdditionalInfoMap;
    /**
     * Amazon Resource Name (ARN) of the Resilience Hub application. The format for this ARN is: arn:partition:resiliencehub:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    appArn: Arn;
    /**
     * Resilience Hub application version.
     */
    appVersion: EntityVersion;
  }
  export interface UpdateRecommendationStatusItem {
    /**
     * Resource identifier of the operational recommendation item.
     */
    resourceId?: String500;
    /**
     * Identifier of the target Amazon Web Services account.
     */
    targetAccountId?: CustomerId;
    /**
     * Identifier of the target Amazon Web Services Region.
     */
    targetRegion?: AwsRegion;
  }
  export type UpdateRecommendationStatusRequestEntries = UpdateRecommendationStatusRequestEntry[];
  export interface UpdateRecommendationStatusRequestEntry {
    /**
     * An identifier for an entry in this batch that is used to communicate the result.  The entryIds of a batch request need to be unique within a request. 
     */
    entryId: String255;
    /**
     * Indicates the reason for excluding an operational recommendation.
     */
    excludeReason?: ExcludeRecommendationReason;
    /**
     * Indicates if the operational recommendation needs to be excluded. If set to True, the operational recommendation will be excluded.
     */
    excluded: BooleanOptional;
    /**
     * The operational recommendation item.
     */
    item: UpdateRecommendationStatusItem;
    /**
     * Reference identifier of the operational recommendation item.
     */
    referenceId: SpecReferenceId;
  }
  export interface UpdateResiliencyPolicyRequest {
    /**
     * Specifies a high-level geographical location constraint for where your resilience policy data can be stored.
     */
    dataLocationConstraint?: DataLocationConstraint;
    /**
     * The type of resiliency policy to be created, including the recovery time objective (RTO) and recovery point objective (RPO) in seconds.
     */
    policy?: DisruptionPolicy;
    /**
     * Amazon Resource Name (ARN) of the resiliency policy. The format for this ARN is: arn:partition:resiliencehub:region:account:resiliency-policy/policy-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference guide.
     */
    policyArn: Arn;
    /**
     * The description for the policy.
     */
    policyDescription?: EntityDescription;
    /**
     * The name of the policy
     */
    policyName?: EntityName;
    /**
     * The tier for this resiliency policy, ranging from the highest severity (MissionCritical) to lowest (NonCritical).
     */
    tier?: ResiliencyPolicyTier;
  }
  export interface UpdateResiliencyPolicyResponse {
    /**
     * The type of resiliency policy that was updated, including the recovery time objective (RTO) and recovery point objective (RPO) in seconds.
     */
    policy: ResiliencyPolicy;
  }
  export type Uuid = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-04-30"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Resiliencehub client.
   */
  export import Types = Resiliencehub;
}
export = Resiliencehub;
