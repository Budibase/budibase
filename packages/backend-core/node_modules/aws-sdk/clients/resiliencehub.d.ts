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
   * Adds the resource mapping for the draft application version.
   */
  addDraftAppVersionResourceMappings(params: Resiliencehub.Types.AddDraftAppVersionResourceMappingsRequest, callback?: (err: AWSError, data: Resiliencehub.Types.AddDraftAppVersionResourceMappingsResponse) => void): Request<Resiliencehub.Types.AddDraftAppVersionResourceMappingsResponse, AWSError>;
  /**
   * Adds the resource mapping for the draft application version.
   */
  addDraftAppVersionResourceMappings(callback?: (err: AWSError, data: Resiliencehub.Types.AddDraftAppVersionResourceMappingsResponse) => void): Request<Resiliencehub.Types.AddDraftAppVersionResourceMappingsResponse, AWSError>;
  /**
   * Creates a Resilience Hub application. A Resilience Hub application is a collection of Amazon Web Services resources structured to prevent and recover Amazon Web Services application disruptions. To describe a Resilience Hub application, you provide an application name, resources from one or more–up to five–CloudFormation stacks, and an appropriate resiliency policy.  &lt;p&gt;After you create a Resilience Hub application, you publish it so that you can run a resiliency assessment on it. You can then use recommendations from the assessment to improve resiliency by running another assessment, comparing results, and then iterating the process until you achieve your goals for recovery time objective (RTO) and recovery point objective (RPO).&lt;/p&gt; 
   */
  createApp(params: Resiliencehub.Types.CreateAppRequest, callback?: (err: AWSError, data: Resiliencehub.Types.CreateAppResponse) => void): Request<Resiliencehub.Types.CreateAppResponse, AWSError>;
  /**
   * Creates a Resilience Hub application. A Resilience Hub application is a collection of Amazon Web Services resources structured to prevent and recover Amazon Web Services application disruptions. To describe a Resilience Hub application, you provide an application name, resources from one or more–up to five–CloudFormation stacks, and an appropriate resiliency policy.  &lt;p&gt;After you create a Resilience Hub application, you publish it so that you can run a resiliency assessment on it. You can then use recommendations from the assessment to improve resiliency by running another assessment, comparing results, and then iterating the process until you achieve your goals for recovery time objective (RTO) and recovery point objective (RPO).&lt;/p&gt; 
   */
  createApp(callback?: (err: AWSError, data: Resiliencehub.Types.CreateAppResponse) => void): Request<Resiliencehub.Types.CreateAppResponse, AWSError>;
  /**
   * Creates a new recommendation template.
   */
  createRecommendationTemplate(params: Resiliencehub.Types.CreateRecommendationTemplateRequest, callback?: (err: AWSError, data: Resiliencehub.Types.CreateRecommendationTemplateResponse) => void): Request<Resiliencehub.Types.CreateRecommendationTemplateResponse, AWSError>;
  /**
   * Creates a new recommendation template.
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
   * Deletes an AWS Resilience Hub application. This is a destructive action that can't be undone.
   */
  deleteApp(params: Resiliencehub.Types.DeleteAppRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DeleteAppResponse) => void): Request<Resiliencehub.Types.DeleteAppResponse, AWSError>;
  /**
   * Deletes an AWS Resilience Hub application. This is a destructive action that can't be undone.
   */
  deleteApp(callback?: (err: AWSError, data: Resiliencehub.Types.DeleteAppResponse) => void): Request<Resiliencehub.Types.DeleteAppResponse, AWSError>;
  /**
   * Deletes an AWS Resilience Hub application assessment. This is a destructive action that can't be undone.
   */
  deleteAppAssessment(params: Resiliencehub.Types.DeleteAppAssessmentRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DeleteAppAssessmentResponse) => void): Request<Resiliencehub.Types.DeleteAppAssessmentResponse, AWSError>;
  /**
   * Deletes an AWS Resilience Hub application assessment. This is a destructive action that can't be undone.
   */
  deleteAppAssessment(callback?: (err: AWSError, data: Resiliencehub.Types.DeleteAppAssessmentResponse) => void): Request<Resiliencehub.Types.DeleteAppAssessmentResponse, AWSError>;
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
   * Describes an AWS Resilience Hub application.
   */
  describeApp(params: Resiliencehub.Types.DescribeAppRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppResponse) => void): Request<Resiliencehub.Types.DescribeAppResponse, AWSError>;
  /**
   * Describes an AWS Resilience Hub application.
   */
  describeApp(callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppResponse) => void): Request<Resiliencehub.Types.DescribeAppResponse, AWSError>;
  /**
   * Describes an assessment for an AWS Resilience Hub application.
   */
  describeAppAssessment(params: Resiliencehub.Types.DescribeAppAssessmentRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppAssessmentResponse) => void): Request<Resiliencehub.Types.DescribeAppAssessmentResponse, AWSError>;
  /**
   * Describes an assessment for an AWS Resilience Hub application.
   */
  describeAppAssessment(callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppAssessmentResponse) => void): Request<Resiliencehub.Types.DescribeAppAssessmentResponse, AWSError>;
  /**
   * Returns the resolution status for the specified resolution identifier for an application version. If resolutionId is not specified, the current resolution status is returned.
   */
  describeAppVersionResourcesResolutionStatus(params: Resiliencehub.Types.DescribeAppVersionResourcesResolutionStatusRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppVersionResourcesResolutionStatusResponse) => void): Request<Resiliencehub.Types.DescribeAppVersionResourcesResolutionStatusResponse, AWSError>;
  /**
   * Returns the resolution status for the specified resolution identifier for an application version. If resolutionId is not specified, the current resolution status is returned.
   */
  describeAppVersionResourcesResolutionStatus(callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppVersionResourcesResolutionStatusResponse) => void): Request<Resiliencehub.Types.DescribeAppVersionResourcesResolutionStatusResponse, AWSError>;
  /**
   * Describes details about an AWS Resilience Hub 
   */
  describeAppVersionTemplate(params: Resiliencehub.Types.DescribeAppVersionTemplateRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppVersionTemplateResponse) => void): Request<Resiliencehub.Types.DescribeAppVersionTemplateResponse, AWSError>;
  /**
   * Describes details about an AWS Resilience Hub 
   */
  describeAppVersionTemplate(callback?: (err: AWSError, data: Resiliencehub.Types.DescribeAppVersionTemplateResponse) => void): Request<Resiliencehub.Types.DescribeAppVersionTemplateResponse, AWSError>;
  /**
   * Describes the status of importing resources to an application version.
   */
  describeDraftAppVersionResourcesImportStatus(params: Resiliencehub.Types.DescribeDraftAppVersionResourcesImportStatusRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DescribeDraftAppVersionResourcesImportStatusResponse) => void): Request<Resiliencehub.Types.DescribeDraftAppVersionResourcesImportStatusResponse, AWSError>;
  /**
   * Describes the status of importing resources to an application version.
   */
  describeDraftAppVersionResourcesImportStatus(callback?: (err: AWSError, data: Resiliencehub.Types.DescribeDraftAppVersionResourcesImportStatusResponse) => void): Request<Resiliencehub.Types.DescribeDraftAppVersionResourcesImportStatusResponse, AWSError>;
  /**
   * Describes a specified resiliency policy for an AWS Resilience Hub application. The returned policy object includes creation time, data location constraints, the Amazon Resource Name (ARN) for the policy, tags, tier, and more.
   */
  describeResiliencyPolicy(params: Resiliencehub.Types.DescribeResiliencyPolicyRequest, callback?: (err: AWSError, data: Resiliencehub.Types.DescribeResiliencyPolicyResponse) => void): Request<Resiliencehub.Types.DescribeResiliencyPolicyResponse, AWSError>;
  /**
   * Describes a specified resiliency policy for an AWS Resilience Hub application. The returned policy object includes creation time, data location constraints, the Amazon Resource Name (ARN) for the policy, tags, tier, and more.
   */
  describeResiliencyPolicy(callback?: (err: AWSError, data: Resiliencehub.Types.DescribeResiliencyPolicyResponse) => void): Request<Resiliencehub.Types.DescribeResiliencyPolicyResponse, AWSError>;
  /**
   * Imports resources from sources such as a CloudFormation stack, resource-groups, or application registry app to a draft application version.
   */
  importResourcesToDraftAppVersion(params: Resiliencehub.Types.ImportResourcesToDraftAppVersionRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ImportResourcesToDraftAppVersionResponse) => void): Request<Resiliencehub.Types.ImportResourcesToDraftAppVersionResponse, AWSError>;
  /**
   * Imports resources from sources such as a CloudFormation stack, resource-groups, or application registry app to a draft application version.
   */
  importResourcesToDraftAppVersion(callback?: (err: AWSError, data: Resiliencehub.Types.ImportResourcesToDraftAppVersionResponse) => void): Request<Resiliencehub.Types.ImportResourcesToDraftAppVersionResponse, AWSError>;
  /**
   * Lists the alarm recommendations for a AWS Resilience Hub application.
   */
  listAlarmRecommendations(params: Resiliencehub.Types.ListAlarmRecommendationsRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListAlarmRecommendationsResponse) => void): Request<Resiliencehub.Types.ListAlarmRecommendationsResponse, AWSError>;
  /**
   * Lists the alarm recommendations for a AWS Resilience Hub application.
   */
  listAlarmRecommendations(callback?: (err: AWSError, data: Resiliencehub.Types.ListAlarmRecommendationsResponse) => void): Request<Resiliencehub.Types.ListAlarmRecommendationsResponse, AWSError>;
  /**
   * Lists the assessments for an AWS Resilience Hub application. You can use request parameters to refine the results for the response object.
   */
  listAppAssessments(params: Resiliencehub.Types.ListAppAssessmentsRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListAppAssessmentsResponse) => void): Request<Resiliencehub.Types.ListAppAssessmentsResponse, AWSError>;
  /**
   * Lists the assessments for an AWS Resilience Hub application. You can use request parameters to refine the results for the response object.
   */
  listAppAssessments(callback?: (err: AWSError, data: Resiliencehub.Types.ListAppAssessmentsResponse) => void): Request<Resiliencehub.Types.ListAppAssessmentsResponse, AWSError>;
  /**
   * Lists the compliances for an AWS Resilience Hub component.
   */
  listAppComponentCompliances(params: Resiliencehub.Types.ListAppComponentCompliancesRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListAppComponentCompliancesResponse) => void): Request<Resiliencehub.Types.ListAppComponentCompliancesResponse, AWSError>;
  /**
   * Lists the compliances for an AWS Resilience Hub component.
   */
  listAppComponentCompliances(callback?: (err: AWSError, data: Resiliencehub.Types.ListAppComponentCompliancesResponse) => void): Request<Resiliencehub.Types.ListAppComponentCompliancesResponse, AWSError>;
  /**
   * Lists the recommendations for an AWS Resilience Hub component.
   */
  listAppComponentRecommendations(params: Resiliencehub.Types.ListAppComponentRecommendationsRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListAppComponentRecommendationsResponse) => void): Request<Resiliencehub.Types.ListAppComponentRecommendationsResponse, AWSError>;
  /**
   * Lists the recommendations for an AWS Resilience Hub component.
   */
  listAppComponentRecommendations(callback?: (err: AWSError, data: Resiliencehub.Types.ListAppComponentRecommendationsResponse) => void): Request<Resiliencehub.Types.ListAppComponentRecommendationsResponse, AWSError>;
  /**
   * Lists how the resources in an application version are mapped/sourced from. Mappings can be physical resource identifiers, CloudFormation stacks, resource-groups, or an application registry app.
   */
  listAppVersionResourceMappings(params: Resiliencehub.Types.ListAppVersionResourceMappingsRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListAppVersionResourceMappingsResponse) => void): Request<Resiliencehub.Types.ListAppVersionResourceMappingsResponse, AWSError>;
  /**
   * Lists how the resources in an application version are mapped/sourced from. Mappings can be physical resource identifiers, CloudFormation stacks, resource-groups, or an application registry app.
   */
  listAppVersionResourceMappings(callback?: (err: AWSError, data: Resiliencehub.Types.ListAppVersionResourceMappingsResponse) => void): Request<Resiliencehub.Types.ListAppVersionResourceMappingsResponse, AWSError>;
  /**
   * Lists all the resources in an application version.
   */
  listAppVersionResources(params: Resiliencehub.Types.ListAppVersionResourcesRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListAppVersionResourcesResponse) => void): Request<Resiliencehub.Types.ListAppVersionResourcesResponse, AWSError>;
  /**
   * Lists all the resources in an application version.
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
   * Lists your Resilience Hub applications.
   */
  listApps(params: Resiliencehub.Types.ListAppsRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListAppsResponse) => void): Request<Resiliencehub.Types.ListAppsResponse, AWSError>;
  /**
   * Lists your Resilience Hub applications.
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
   * Lists the resources that are not currently supported in AWS Resilience Hub. An unsupported resource is a resource that exists in the object that was used to create an app, but is not supported by Resilience Hub.
   */
  listUnsupportedAppVersionResources(params: Resiliencehub.Types.ListUnsupportedAppVersionResourcesRequest, callback?: (err: AWSError, data: Resiliencehub.Types.ListUnsupportedAppVersionResourcesResponse) => void): Request<Resiliencehub.Types.ListUnsupportedAppVersionResourcesResponse, AWSError>;
  /**
   * Lists the resources that are not currently supported in AWS Resilience Hub. An unsupported resource is a resource that exists in the object that was used to create an app, but is not supported by Resilience Hub.
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
   * Adds or updates the app template for a draft version of a Resilience Hub app.
   */
  putDraftAppVersionTemplate(params: Resiliencehub.Types.PutDraftAppVersionTemplateRequest, callback?: (err: AWSError, data: Resiliencehub.Types.PutDraftAppVersionTemplateResponse) => void): Request<Resiliencehub.Types.PutDraftAppVersionTemplateResponse, AWSError>;
  /**
   * Adds or updates the app template for a draft version of a Resilience Hub app.
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
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
    /**
     *  Mappings used to map logical resources from the template to physical resources. You can use the mapping type CFN_STACK if the application template uses a logical stack name. Or you can map individual resources by using the mapping type RESOURCE. We recommend using the mapping type CFN_STACK if the application is backed by a CloudFormation stack.
     */
    resourceMappings: ResourceMappingList;
  }
  export interface AddDraftAppVersionResourceMappingsResponse {
    /**
     *  The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
    /**
     * Mappings used to map logical resources from the template to physical resources. You can use the mapping type CFN_STACK if the application template uses a logical stack name. Or you can map individual resources by using the mapping type RESOURCE. We recommend using the mapping type CFN_STACK if the application is backed by a CloudFormation stack.
     */
    resourceMappings: ResourceMappingList;
  }
  export interface AlarmRecommendation {
    /**
     * The application component for the CloudWatch alarm recommendation.
     */
    appComponentName?: EntityId;
    /**
     * The description of the recommendation.
     */
    description?: EntityDescription;
    /**
     * The list of CloudWatch alarm recommendations.
     */
    items?: RecommendationItemList;
    /**
     * The name of the alarm recommendation.
     */
    name: String500;
    /**
     * The prerequisite for the alarm recommendation.
     */
    prerequisite?: String500;
    /**
     * The identifier of the alarm recommendation.
     */
    recommendationId: Uuid;
    /**
     * The reference identifier of the alarm recommendation.
     */
    referenceId: SpecReferenceId;
    /**
     * The type of alarm recommendation.
     */
    type: AlarmType;
  }
  export type AlarmRecommendationList = AlarmRecommendation[];
  export type AlarmType = "Metric"|"Composite"|"Canary"|"Logs"|"Event"|string;
  export interface App {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
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
     * The timestamp for the most recent compliance evaluation.
     */
    lastAppComplianceEvaluationTime?: TimeStamp;
    /**
     * The timestamp for the most recent resiliency score evaluation.
     */
    lastResiliencyScoreEvaluationTime?: TimeStamp;
    /**
     * The name for the application.
     */
    name: EntityName;
    /**
     * The Amazon Resource Name (ARN) of the resiliency policy. The format for this ARN is: arn:partition:dcps:region:account:resiliency-policy/policy-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    policyArn?: Arn;
    /**
     * The current resiliency score for the application.
     */
    resiliencyScore?: Double;
    /**
     * The status of the action.
     */
    status?: AppStatusType;
    /**
     * The tags assigned to the resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key/value pair.
     */
    tags?: TagMap;
  }
  export interface AppAssessment {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn?: Arn;
    /**
     * The version of the application.
     */
    appVersion?: EntityVersion;
    /**
     * The Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:dcps:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    assessmentArn: Arn;
    /**
     * The name of the assessment.
     */
    assessmentName?: EntityName;
    /**
     * The current status of the assessment for the resiliency policy.
     */
    assessmentStatus: AssessmentStatus;
    /**
     * The application compliance against the resiliency policy.
     */
    compliance?: AssessmentCompliance;
    /**
     * The current status of the compliance for the resiliency policy.
     */
    complianceStatus?: ComplianceStatus;
    /**
     * The cost for the application.
     */
    cost?: Cost;
    /**
     * The end time for the action.
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
     * The resiliency policy.
     */
    policy?: ResiliencyPolicy;
    /**
     * The current resiliency score for the application.
     */
    resiliencyScore?: ResiliencyScore;
    /**
     * The starting time for the action.
     */
    startTime?: TimeStamp;
    /**
     * The tags assigned to the resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key/value pair.
     */
    tags?: TagMap;
  }
  export interface AppAssessmentSummary {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn?: Arn;
    /**
     * The version of the application.
     */
    appVersion?: EntityVersion;
    /**
     * The Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:dcps:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    assessmentArn: Arn;
    /**
     * The name of the assessment.
     */
    assessmentName?: EntityName;
    /**
     * The current status of the assessment for the resiliency policy.
     */
    assessmentStatus: AssessmentStatus;
    /**
     * The current status of compliance for the resiliency policy.
     */
    complianceStatus?: ComplianceStatus;
    /**
     * The cost for the application.
     */
    cost?: Cost;
    /**
     * The end time for the action.
     */
    endTime?: TimeStamp;
    /**
     * The entity that invoked the assessment.
     */
    invoker?: AssessmentInvoker;
    /**
     * The message from the assessment run.
     */
    message?: String500;
    /**
     * The current resiliency score for the application.
     */
    resiliencyScore?: Double;
    /**
     * The starting time for the action.
     */
    startTime?: TimeStamp;
  }
  export type AppAssessmentSummaryList = AppAssessmentSummary[];
  export type AppComplianceStatusType = "PolicyBreached"|"PolicyMet"|"NotAssessed"|"ChangesDetected"|string;
  export interface AppComponent {
    /**
     * The name of the application component.
     */
    name: String255;
    /**
     * The type of application component.
     */
    type: String255;
  }
  export interface AppComponentCompliance {
    /**
     * The name of the application component.
     */
    appComponentName?: EntityId;
    /**
     * The compliance of the application component against the resiliency policy.
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
     * The status of the action.
     */
    status?: ComplianceStatus;
  }
  export type AppComponentList = AppComponent[];
  export type AppStatusType = "Active"|"Deleting"|string;
  export interface AppSummary {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
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
     * The name of the application.
     */
    name: EntityName;
    /**
     * The current resiliency score for the application.
     */
    resiliencyScore?: Double;
  }
  export type AppSummaryList = AppSummary[];
  export type AppTemplateBody = string;
  export type AppVersionList = AppVersionSummary[];
  export interface AppVersionSummary {
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
  }
  export type Arn = string;
  export type ArnList = Arn[];
  export type AssessmentCompliance = {[key: string]: DisruptionCompliance};
  export type AssessmentInvoker = "User"|"System"|string;
  export type AssessmentStatus = "Pending"|"InProgress"|"Failed"|"Success"|string;
  export type AssessmentStatusList = AssessmentStatus[];
  export type AwsRegion = string;
  export type BooleanOptional = boolean;
  export type ClientToken = string;
  export type ComplianceStatus = "PolicyBreached"|"PolicyMet"|string;
  export type ComponentCompliancesList = AppComponentCompliance[];
  export interface ComponentRecommendation {
    /**
     * The name of the application component.
     */
    appComponentName: EntityId;
    /**
     * The list of recommendations.
     */
    configRecommendations: ConfigRecommendationList;
    /**
     * The recommendation status.
     */
    recommendationStatus: RecommendationComplianceStatus;
  }
  export type ComponentRecommendationList = ComponentRecommendation[];
  export interface ConfigRecommendation {
    /**
     * The application component name.
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
     * The reference identifier for the recommendation configuration.
     */
    referenceId: SpecReferenceId;
    /**
     * List of the suggested configuration changes.
     */
    suggestedChanges?: SuggestedChangesList;
  }
  export type ConfigRecommendationList = ConfigRecommendation[];
  export type ConfigRecommendationOptimizationType = "LeastCost"|"LeastChange"|"BestAZRecovery"|"LeastErrors"|"BestAttainable"|string;
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
     * Used for an idempotency token. A client token is a unique, case-sensitive string of up to 64 ASCII characters. You should not reuse the same client token for other API requests.
     */
    clientToken?: ClientToken;
    /**
     * The optional description for an app.
     */
    description?: EntityDescription;
    /**
     * The name for the application.
     */
    name: EntityName;
    /**
     * The Amazon Resource Name (ARN) of the resiliency policy. The format for this ARN is: arn:partition:dcps:region:account:resiliency-policy/policy-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    policyArn?: Arn;
    /**
     * The tags assigned to the resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key/value pair.
     */
    tags?: TagMap;
  }
  export interface CreateAppResponse {
    /**
     * The created application returned as an object with details including compliance status, creation time, description, resiliency score, and more.
     */
    app: App;
  }
  export interface CreateRecommendationTemplateRequest {
    /**
     * The Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:dcps:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
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
     * The tags assigned to the resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key/value pair.
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
     * The tags assigned to the resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key/value pair.
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
     * The Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:dcps:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    assessmentArn: Arn;
    /**
     * Used for an idempotency token. A client token is a unique, case-sensitive string of up to 64 ASCII characters. You should not reuse the same client token for other API requests.
     */
    clientToken?: ClientToken;
  }
  export interface DeleteAppAssessmentResponse {
    /**
     * The Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:dcps:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    assessmentArn: Arn;
    /**
     * The current status of the assessment for the resiliency policy.
     */
    assessmentStatus: AssessmentStatus;
  }
  export interface DeleteAppRequest {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
    /**
     * Used for an idempotency token. A client token is a unique, case-sensitive string of up to 64 ASCII characters. You should not reuse the same client token for other API requests.
     */
    clientToken?: ClientToken;
    /**
     * A boolean option to force the deletion of a Resilience Hub application. 
     */
    forceDelete?: BooleanOptional;
  }
  export interface DeleteAppResponse {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
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
     * The status of the action.
     */
    status: RecommendationTemplateStatus;
  }
  export interface DeleteResiliencyPolicyRequest {
    /**
     * Used for an idempotency token. A client token is a unique, case-sensitive string of up to 64 ASCII characters. You should not reuse the same client token for other API requests.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) of the resiliency policy. The format for this ARN is: arn:partition:dcps:region:account:resiliency-policy/policy-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    policyArn: Arn;
  }
  export interface DeleteResiliencyPolicyResponse {
    /**
     * The Amazon Resource Name (ARN) of the resiliency policy. The format for this ARN is: arn:partition:dcps:region:account:resiliency-policy/policy-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    policyArn: Arn;
  }
  export interface DescribeAppAssessmentRequest {
    /**
     * The Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:dcps:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    assessmentArn: Arn;
  }
  export interface DescribeAppAssessmentResponse {
    /**
     * The assessment for an AWS Resilience Hub application, returned as an object. This object includes Amazon Resource Names (ARNs), compliance information, compliance status, cost, messages, resiliency scores, and more.
     */
    assessment: AppAssessment;
  }
  export interface DescribeAppRequest {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
  }
  export interface DescribeAppResponse {
    /**
     * The specified application, returned as an object with details including compliance status, creation time, description, resiliency score, and more.
     */
    app: App;
  }
  export interface DescribeAppVersionResourcesResolutionStatusRequest {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
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
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
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
     * The status of the action.
     */
    status: ResourceResolutionStatusType;
  }
  export interface DescribeAppVersionTemplateRequest {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
  }
  export interface DescribeAppVersionTemplateResponse {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
    /**
     * The body of the template.
     */
    appTemplateBody: AppTemplateBody;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
  }
  export interface DescribeDraftAppVersionResourcesImportStatusRequest {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
  }
  export interface DescribeDraftAppVersionResourcesImportStatusResponse {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
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
     * The status of the action.
     */
    status: ResourceImportStatusType;
    /**
     * The timestamp for when the status last changed.
     */
    statusChangeTime: TimeStamp;
  }
  export interface DescribeResiliencyPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the resiliency policy. The format for this ARN is: arn:partition:dcps:region:account:resiliency-policy/policy-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    policyArn: Arn;
  }
  export interface DescribeResiliencyPolicyResponse {
    /**
     * Information about the specific resiliency policy, returned as an object. This object includes creation time, data location constraints, its name, description, tags, the recovery time objective (RTO) and recovery point objective (RPO) in seconds, and more.
     */
    policy: ResiliencyPolicy;
  }
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
     * The RPO reference identifier.
     */
    rpoReferenceId?: String500;
    /**
     * The RTO description.
     */
    rtoDescription?: String500;
    /**
     * The RTO reference identifier.
     */
    rtoReferenceId?: String500;
  }
  export type DisruptionPolicy = {[key: string]: FailurePolicy};
  export type DisruptionResiliencyScore = {[key: string]: Double};
  export type DisruptionType = "Software"|"Hardware"|"AZ"|"Region"|string;
  export type DocumentName = string;
  export type Double = number;
  export type EntityDescription = string;
  export type EntityId = string;
  export type EntityName = string;
  export type EntityNameList = EntityName[];
  export type EntityVersion = string;
  export type EstimatedCostTier = "L1"|"L2"|"L3"|"L4"|string;
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
  export interface ImportResourcesToDraftAppVersionRequest {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
    /**
     * The Amazon Resource Names (ARNs) for the resources that you want to import.
     */
    sourceArns: ArnList;
  }
  export interface ImportResourcesToDraftAppVersionResponse {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
    /**
     * The Amazon Resource Names (ARNs) for the resources that you imported.
     */
    sourceArns: ArnList;
    /**
     * The status of the action.
     */
    status: ResourceImportStatusType;
  }
  export interface ListAlarmRecommendationsRequest {
    /**
     * The Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:dcps:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    assessmentArn: Arn;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAlarmRecommendationsResponse {
    /**
     * The alarm recommendations for an AWS Resilience Hub application, returned as an object. This object includes application component names, descriptions, information about whether a recommendation has already been implemented or not, prerequisites, and more.
     */
    alarmRecommendations: AlarmRecommendationList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppAssessmentsRequest {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
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
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
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
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppComponentCompliancesRequest {
    /**
     * The Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:dcps:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    assessmentArn: Arn;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppComponentCompliancesResponse {
    /**
     * The compliances for an AWS Resilience Hub application component, returned as an object. This object contains component names, compliances, costs, resiliency scores, outage scores, and more.
     */
    componentCompliances: ComponentCompliancesList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppComponentRecommendationsRequest {
    /**
     * The Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:dcps:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    assessmentArn: Arn;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppComponentRecommendationsResponse {
    /**
     * The recommendations for an Resilience Hub application component, returned as an object. This object contains component names, configuration recommendations, and recommendation statuses.
     */
    componentRecommendations: ComponentRecommendationList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppVersionResourceMappingsRequest {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppVersionResourceMappingsResponse {
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
    /**
     * Mappings used to map logical resources from the template to physical resources. You can use the mapping type CFN_STACK if the application template uses a logical stack name. Or you can map individual resources by using the mapping type RESOURCE. We recommend using the mapping type CFN_STACK if the application is backed by a CloudFormation stack.
     */
    resourceMappings: ResourceMappingList;
  }
  export interface ListAppVersionResourcesRequest {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
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
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
    /**
     * The physical resources in the application version.
     */
    physicalResources: PhysicalResourceList;
    /**
     * The identifier for a specific resolution.
     */
    resolutionId: String255;
  }
  export interface ListAppVersionsRequest {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppVersionsResponse {
    /**
     * The version of the application.
     */
    appVersions: AppVersionList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListAppsRequest {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn?: Arn;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
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
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
  }
  export interface ListRecommendationTemplatesRequest {
    /**
     * The Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:dcps:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    assessmentArn: Arn;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
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
     * The status of the action.
     */
    status?: RecommendationTemplateStatusList;
  }
  export interface ListRecommendationTemplatesResponse {
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
    /**
     * The recommendation templates for the Resilience Hub applications.
     */
    recommendationTemplates?: RecommendationTemplateList;
  }
  export interface ListResiliencyPoliciesRequest {
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
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
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
    /**
     * The resiliency policies for the Resilience Hub applications.
     */
    resiliencyPolicies: ResiliencyPolicies;
  }
  export interface ListSopRecommendationsRequest {
    /**
     * The Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:dcps:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    assessmentArn: Arn;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListSopRecommendationsResponse {
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
    /**
     * The standard operating procedure (SOP) recommendations for the Resilience Hub applications.
     */
    sopRecommendations: SopRecommendationList;
  }
  export interface ListSuggestedResiliencyPoliciesRequest {
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListSuggestedResiliencyPoliciesResponse {
    /**
     * The token for the next set of results, or null if there are no more results.
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
     * The tags assigned to the resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key/value pair.
     */
    tags?: TagMap;
  }
  export interface ListTestRecommendationsRequest {
    /**
     * The Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:dcps:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    assessmentArn: Arn;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Null, or the token from a previous call to get the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListTestRecommendationsResponse {
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: NextToken;
    /**
     * The test recommendations for the Resilience Hub application.
     */
    testRecommendations: TestRecommendationList;
  }
  export interface ListUnsupportedAppVersionResourcesRequest {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
    /**
     * The maximum number of results to include in the response. If more results exist than the specified MaxResults value, a token is included in the response so that the remaining results can be retrieved.
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
     * The token for the next set of results, or null if there are no more results.
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
     * The identifier of the resource.
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
  }
  export type MaxResults = number;
  export type NextToken = string;
  export type PhysicalIdentifierType = "Arn"|"Native"|string;
  export interface PhysicalResource {
    /**
     * The application components that belong to this resource.
     */
    appComponents?: AppComponentList;
    /**
     * The logical identifier of the resource.
     */
    logicalResourceId: LogicalResourceId;
    /**
     * The physical identifier of the resource.
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
     * The identifier of the physical resource.
     */
    identifier: String255;
    /**
     * Specifies the type of physical resource identifier.  Arn  The resource identifier is an Amazon Resource Name (ARN) .  Native  The resource identifier is a Resilience Hub-native identifier.  
     */
    type: PhysicalIdentifierType;
  }
  export type PhysicalResourceList = PhysicalResource[];
  export interface PublishAppVersionRequest {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
  }
  export interface PublishAppVersionResponse {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion?: EntityVersion;
  }
  export interface PutDraftAppVersionTemplateRequest {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
    /**
     * A JSON string that contains the body of the app template.
     */
    appTemplateBody: AppTemplateBody;
  }
  export interface PutDraftAppVersionTemplateResponse {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
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
     * The resource identifier.
     */
    resourceId?: String500;
    /**
     * The target account identifier.
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
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the assessment. The format for this ARN is: arn:partition:dcps:region:account:app-assessment/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    assessmentArn: Arn;
    /**
     * The end time for the action.
     */
    endTime?: TimeStamp;
    /**
     * The format of the recommendation template.  CfnJson  The template is CloudFormation JSON.  CfnYaml  The template is CloudFormation YAML.  
     */
    format: TemplateFormat;
    /**
     * The message for the recommendation template.
     */
    message?: String500;
    /**
     * The name for the recommendation template.
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
     * The Amazon Resource Name (ARN) for the recommendation template.
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
     * The status of the action.
     */
    status: RecommendationTemplateStatus;
    /**
     * The tags assigned to the resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key/value pair.
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
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
    /**
     * The names of the registered applications to remove from the resource mappings.
     */
    appRegistryAppNames?: EntityNameList;
    /**
     * The names of the CloudFormation stacks to remove from the resource mappings.
     */
    logicalStackNames?: String255List;
    /**
     * The names of the resource groups to remove from the resource mappings.
     */
    resourceGroupNames?: EntityNameList;
    /**
     * The names of the resources to remove from the resource mappings.
     */
    resourceNames?: EntityNameList;
  }
  export interface RemoveDraftAppVersionResourceMappingsResponse {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
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
     * The Amazon Resource Name (ARN) of the resiliency policy. The format for this ARN is: arn:partition:dcps:region:account:resiliency-policy/policy-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
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
     * The tags assigned to the resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key/value pair.
     */
    tags?: TagMap;
    /**
     * The tier for this resiliency policy, ranging from the highest severity (MissionCritical) to lowest (NonCritical).
     */
    tier?: ResiliencyPolicyTier;
  }
  export type ResiliencyPolicyTier = "MissionCritical"|"Critical"|"Important"|"CoreServices"|"NonCritical"|string;
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
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
    /**
     * The version of the application.
     */
    appVersion: EntityVersion;
  }
  export interface ResolveAppVersionResourcesResponse {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
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
     * The status of the action.
     */
    status: ResourceResolutionStatusType;
  }
  export type ResourceImportStatusType = "Pending"|"InProgress"|"Failed"|"Success"|string;
  export interface ResourceMapping {
    /**
     * The name of the application this resource is mapped to.
     */
    appRegistryAppName?: EntityName;
    /**
     * The name of the CloudFormation stack this resource is mapped to.
     */
    logicalStackName?: String255;
    /**
     * Specifies the type of resource mapping.  AppRegistryApp  The resource is mapped to another application. The name of the application is contained in the appRegistryAppName property.  CfnStack  The resource is mapped to a CloudFormation stack. The name of the CloudFormation stack is contained in the logicalStackName property.  Resource  The resource is mapped to another resource. The name of the resource is contained in the resourceName property.  ResourceGroup  The resource is mapped to a resource group. The name of the resource group is contained in the resourceGroupName property.  
     */
    mappingType: ResourceMappingType;
    /**
     * The identifier of this resource.
     */
    physicalResourceId: PhysicalResourceId;
    /**
     * The name of the resource group this resource is mapped to.
     */
    resourceGroupName?: EntityName;
    /**
     * The name of the resource this resource is mapped to.
     */
    resourceName?: EntityName;
  }
  export type ResourceMappingList = ResourceMapping[];
  export type ResourceMappingType = "CfnStack"|"Resource"|"AppRegistryApp"|"ResourceGroup"|string;
  export type ResourceResolutionStatusType = "Pending"|"InProgress"|"Failed"|"Success"|string;
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
  export type Seconds = number;
  export interface SopRecommendation {
    /**
     * The application component name.
     */
    appComponentName?: EntityId;
    /**
     * The description of the SOP recommendation.
     */
    description?: String500;
    /**
     * The recommendation items.
     */
    items?: RecommendationItemList;
    /**
     * The name of the SOP recommendation.
     */
    name?: DocumentName;
    /**
     * The prerequisite for the SOP recommendation.
     */
    prerequisite?: String500;
    /**
     * Identifier for the SOP recommendation.
     */
    recommendationId: Uuid;
    /**
     * The reference identifier for the SOP recommendation.
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
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
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
     * The tags assigned to the resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key/value pair.
     */
    tags?: TagMap;
  }
  export interface StartAppAssessmentResponse {
    /**
     * The assessment created.
     */
    assessment: AppAssessment;
  }
  export type String255 = string;
  export type String255List = String255[];
  export type String500 = string;
  export type SuggestedChangesList = EntityDescription[];
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource. 
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
  export interface TestRecommendation {
    /**
     * The name of the application component.
     */
    appComponentName?: EntityId;
    /**
     * The description for the test recommendation.
     */
    description?: String500;
    /**
     * The intent of the test recommendation.
     */
    intent?: EntityDescription;
    /**
     * The test recommendation items.
     */
    items?: RecommendationItemList;
    /**
     * The name of the test recommendation.
     */
    name?: DocumentName;
    /**
     * The prerequisite of the test recommendation.
     */
    prerequisite?: String500;
    /**
     * Identifier for the test recommendation.
     */
    recommendationId?: Uuid;
    /**
     * The reference identifier for the test recommendation.
     */
    referenceId: SpecReferenceId;
    /**
     * The level of risk for this test recommendation.
     */
    risk?: TestRisk;
    /**
     * The type of test recommendation.
     */
    type?: TestType;
  }
  export type TestRecommendationList = TestRecommendation[];
  export type TestRisk = "Small"|"Medium"|"High"|string;
  export type TestType = "Software"|"Hardware"|"AZ"|"Region"|string;
  export type TimeStamp = Date;
  export interface UnsupportedResource {
    /**
     * The logical resource identifier for the unsupported resource.
     */
    logicalResourceId: LogicalResourceId;
    /**
     * The physical resource identifier for the unsupported resource.
     */
    physicalResourceId: PhysicalResourceId;
    /**
     * The type of resource.
     */
    resourceType: String255;
  }
  export type UnsupportedResourceList = UnsupportedResource[];
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource. 
     */
    resourceArn: Arn;
    /**
     * The keys of the tags to remove.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAppRequest {
    /**
     * The Amazon Resource Name (ARN) of the application. The format for this ARN is: arn:partition:dcps:region:account:app/app-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    appArn: Arn;
    /**
     * Specifies if the resiliency policy ARN should be cleared.
     */
    clearResiliencyPolicyArn?: BooleanOptional;
    /**
     * The optional description for an app.
     */
    description?: EntityDescription;
    /**
     * The Amazon Resource Name (ARN) of the resiliency policy. The format for this ARN is: arn:partition:dcps:region:account:resiliency-policy/policy-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
     */
    policyArn?: Arn;
  }
  export interface UpdateAppResponse {
    /**
     * The specified application, returned as an object with details including compliance status, creation time, description, resiliency score, and more.
     */
    app: App;
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
     * The Amazon Resource Name (ARN) of the resiliency policy. The format for this ARN is: arn:partition:dcps:region:account:resiliency-policy/policy-id. For more information about ARNs, see  Amazon Resource Names (ARNs) in the AWS General Reference.
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
