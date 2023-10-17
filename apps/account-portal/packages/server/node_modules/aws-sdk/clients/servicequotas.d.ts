import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ServiceQuotas extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ServiceQuotas.Types.ClientConfiguration)
  config: Config & ServiceQuotas.Types.ClientConfiguration;
  /**
   * Associates your quota request template with your organization. When a new Amazon Web Services account is created in your organization, the quota increase requests in the template are automatically applied to the account. You can add a quota increase request for any adjustable quota to your template.
   */
  associateServiceQuotaTemplate(params: ServiceQuotas.Types.AssociateServiceQuotaTemplateRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.AssociateServiceQuotaTemplateResponse) => void): Request<ServiceQuotas.Types.AssociateServiceQuotaTemplateResponse, AWSError>;
  /**
   * Associates your quota request template with your organization. When a new Amazon Web Services account is created in your organization, the quota increase requests in the template are automatically applied to the account. You can add a quota increase request for any adjustable quota to your template.
   */
  associateServiceQuotaTemplate(callback?: (err: AWSError, data: ServiceQuotas.Types.AssociateServiceQuotaTemplateResponse) => void): Request<ServiceQuotas.Types.AssociateServiceQuotaTemplateResponse, AWSError>;
  /**
   * Deletes the quota increase request for the specified quota from your quota request template.
   */
  deleteServiceQuotaIncreaseRequestFromTemplate(params: ServiceQuotas.Types.DeleteServiceQuotaIncreaseRequestFromTemplateRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.DeleteServiceQuotaIncreaseRequestFromTemplateResponse) => void): Request<ServiceQuotas.Types.DeleteServiceQuotaIncreaseRequestFromTemplateResponse, AWSError>;
  /**
   * Deletes the quota increase request for the specified quota from your quota request template.
   */
  deleteServiceQuotaIncreaseRequestFromTemplate(callback?: (err: AWSError, data: ServiceQuotas.Types.DeleteServiceQuotaIncreaseRequestFromTemplateResponse) => void): Request<ServiceQuotas.Types.DeleteServiceQuotaIncreaseRequestFromTemplateResponse, AWSError>;
  /**
   * Disables your quota request template. After a template is disabled, the quota increase requests in the template are not applied to new Amazon Web Services accounts in your organization. Disabling a quota request template does not apply its quota increase requests.
   */
  disassociateServiceQuotaTemplate(params: ServiceQuotas.Types.DisassociateServiceQuotaTemplateRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.DisassociateServiceQuotaTemplateResponse) => void): Request<ServiceQuotas.Types.DisassociateServiceQuotaTemplateResponse, AWSError>;
  /**
   * Disables your quota request template. After a template is disabled, the quota increase requests in the template are not applied to new Amazon Web Services accounts in your organization. Disabling a quota request template does not apply its quota increase requests.
   */
  disassociateServiceQuotaTemplate(callback?: (err: AWSError, data: ServiceQuotas.Types.DisassociateServiceQuotaTemplateResponse) => void): Request<ServiceQuotas.Types.DisassociateServiceQuotaTemplateResponse, AWSError>;
  /**
   * Retrieves the default value for the specified quota. The default value does not reflect any quota increases.
   */
  getAWSDefaultServiceQuota(params: ServiceQuotas.Types.GetAWSDefaultServiceQuotaRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.GetAWSDefaultServiceQuotaResponse) => void): Request<ServiceQuotas.Types.GetAWSDefaultServiceQuotaResponse, AWSError>;
  /**
   * Retrieves the default value for the specified quota. The default value does not reflect any quota increases.
   */
  getAWSDefaultServiceQuota(callback?: (err: AWSError, data: ServiceQuotas.Types.GetAWSDefaultServiceQuotaResponse) => void): Request<ServiceQuotas.Types.GetAWSDefaultServiceQuotaResponse, AWSError>;
  /**
   * Retrieves the status of the association for the quota request template.
   */
  getAssociationForServiceQuotaTemplate(params: ServiceQuotas.Types.GetAssociationForServiceQuotaTemplateRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.GetAssociationForServiceQuotaTemplateResponse) => void): Request<ServiceQuotas.Types.GetAssociationForServiceQuotaTemplateResponse, AWSError>;
  /**
   * Retrieves the status of the association for the quota request template.
   */
  getAssociationForServiceQuotaTemplate(callback?: (err: AWSError, data: ServiceQuotas.Types.GetAssociationForServiceQuotaTemplateResponse) => void): Request<ServiceQuotas.Types.GetAssociationForServiceQuotaTemplateResponse, AWSError>;
  /**
   * Retrieves information about the specified quota increase request.
   */
  getRequestedServiceQuotaChange(params: ServiceQuotas.Types.GetRequestedServiceQuotaChangeRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.GetRequestedServiceQuotaChangeResponse) => void): Request<ServiceQuotas.Types.GetRequestedServiceQuotaChangeResponse, AWSError>;
  /**
   * Retrieves information about the specified quota increase request.
   */
  getRequestedServiceQuotaChange(callback?: (err: AWSError, data: ServiceQuotas.Types.GetRequestedServiceQuotaChangeResponse) => void): Request<ServiceQuotas.Types.GetRequestedServiceQuotaChangeResponse, AWSError>;
  /**
   * Retrieves the applied quota value for the specified quota. For some quotas, only the default values are available. If the applied quota value is not available for a quota, the quota is not retrieved.
   */
  getServiceQuota(params: ServiceQuotas.Types.GetServiceQuotaRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.GetServiceQuotaResponse) => void): Request<ServiceQuotas.Types.GetServiceQuotaResponse, AWSError>;
  /**
   * Retrieves the applied quota value for the specified quota. For some quotas, only the default values are available. If the applied quota value is not available for a quota, the quota is not retrieved.
   */
  getServiceQuota(callback?: (err: AWSError, data: ServiceQuotas.Types.GetServiceQuotaResponse) => void): Request<ServiceQuotas.Types.GetServiceQuotaResponse, AWSError>;
  /**
   * Retrieves information about the specified quota increase request in your quota request template.
   */
  getServiceQuotaIncreaseRequestFromTemplate(params: ServiceQuotas.Types.GetServiceQuotaIncreaseRequestFromTemplateRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.GetServiceQuotaIncreaseRequestFromTemplateResponse) => void): Request<ServiceQuotas.Types.GetServiceQuotaIncreaseRequestFromTemplateResponse, AWSError>;
  /**
   * Retrieves information about the specified quota increase request in your quota request template.
   */
  getServiceQuotaIncreaseRequestFromTemplate(callback?: (err: AWSError, data: ServiceQuotas.Types.GetServiceQuotaIncreaseRequestFromTemplateResponse) => void): Request<ServiceQuotas.Types.GetServiceQuotaIncreaseRequestFromTemplateResponse, AWSError>;
  /**
   * Lists the default values for the quotas for the specified Amazon Web Service. A default value does not reflect any quota increases.
   */
  listAWSDefaultServiceQuotas(params: ServiceQuotas.Types.ListAWSDefaultServiceQuotasRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.ListAWSDefaultServiceQuotasResponse) => void): Request<ServiceQuotas.Types.ListAWSDefaultServiceQuotasResponse, AWSError>;
  /**
   * Lists the default values for the quotas for the specified Amazon Web Service. A default value does not reflect any quota increases.
   */
  listAWSDefaultServiceQuotas(callback?: (err: AWSError, data: ServiceQuotas.Types.ListAWSDefaultServiceQuotasResponse) => void): Request<ServiceQuotas.Types.ListAWSDefaultServiceQuotasResponse, AWSError>;
  /**
   * Retrieves the quota increase requests for the specified Amazon Web Service.
   */
  listRequestedServiceQuotaChangeHistory(params: ServiceQuotas.Types.ListRequestedServiceQuotaChangeHistoryRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.ListRequestedServiceQuotaChangeHistoryResponse) => void): Request<ServiceQuotas.Types.ListRequestedServiceQuotaChangeHistoryResponse, AWSError>;
  /**
   * Retrieves the quota increase requests for the specified Amazon Web Service.
   */
  listRequestedServiceQuotaChangeHistory(callback?: (err: AWSError, data: ServiceQuotas.Types.ListRequestedServiceQuotaChangeHistoryResponse) => void): Request<ServiceQuotas.Types.ListRequestedServiceQuotaChangeHistoryResponse, AWSError>;
  /**
   * Retrieves the quota increase requests for the specified quota.
   */
  listRequestedServiceQuotaChangeHistoryByQuota(params: ServiceQuotas.Types.ListRequestedServiceQuotaChangeHistoryByQuotaRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.ListRequestedServiceQuotaChangeHistoryByQuotaResponse) => void): Request<ServiceQuotas.Types.ListRequestedServiceQuotaChangeHistoryByQuotaResponse, AWSError>;
  /**
   * Retrieves the quota increase requests for the specified quota.
   */
  listRequestedServiceQuotaChangeHistoryByQuota(callback?: (err: AWSError, data: ServiceQuotas.Types.ListRequestedServiceQuotaChangeHistoryByQuotaResponse) => void): Request<ServiceQuotas.Types.ListRequestedServiceQuotaChangeHistoryByQuotaResponse, AWSError>;
  /**
   * Lists the quota increase requests in the specified quota request template.
   */
  listServiceQuotaIncreaseRequestsInTemplate(params: ServiceQuotas.Types.ListServiceQuotaIncreaseRequestsInTemplateRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.ListServiceQuotaIncreaseRequestsInTemplateResponse) => void): Request<ServiceQuotas.Types.ListServiceQuotaIncreaseRequestsInTemplateResponse, AWSError>;
  /**
   * Lists the quota increase requests in the specified quota request template.
   */
  listServiceQuotaIncreaseRequestsInTemplate(callback?: (err: AWSError, data: ServiceQuotas.Types.ListServiceQuotaIncreaseRequestsInTemplateResponse) => void): Request<ServiceQuotas.Types.ListServiceQuotaIncreaseRequestsInTemplateResponse, AWSError>;
  /**
   * Lists the applied quota values for the specified Amazon Web Service. For some quotas, only the default values are available. If the applied quota value is not available for a quota, the quota is not retrieved.
   */
  listServiceQuotas(params: ServiceQuotas.Types.ListServiceQuotasRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.ListServiceQuotasResponse) => void): Request<ServiceQuotas.Types.ListServiceQuotasResponse, AWSError>;
  /**
   * Lists the applied quota values for the specified Amazon Web Service. For some quotas, only the default values are available. If the applied quota value is not available for a quota, the quota is not retrieved.
   */
  listServiceQuotas(callback?: (err: AWSError, data: ServiceQuotas.Types.ListServiceQuotasResponse) => void): Request<ServiceQuotas.Types.ListServiceQuotasResponse, AWSError>;
  /**
   * Lists the names and codes for the Amazon Web Services integrated with Service Quotas.
   */
  listServices(params: ServiceQuotas.Types.ListServicesRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.ListServicesResponse) => void): Request<ServiceQuotas.Types.ListServicesResponse, AWSError>;
  /**
   * Lists the names and codes for the Amazon Web Services integrated with Service Quotas.
   */
  listServices(callback?: (err: AWSError, data: ServiceQuotas.Types.ListServicesResponse) => void): Request<ServiceQuotas.Types.ListServicesResponse, AWSError>;
  /**
   * Returns a list of the tags assigned to the specified applied quota.
   */
  listTagsForResource(params: ServiceQuotas.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.ListTagsForResourceResponse) => void): Request<ServiceQuotas.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns a list of the tags assigned to the specified applied quota.
   */
  listTagsForResource(callback?: (err: AWSError, data: ServiceQuotas.Types.ListTagsForResourceResponse) => void): Request<ServiceQuotas.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Adds a quota increase request to your quota request template.
   */
  putServiceQuotaIncreaseRequestIntoTemplate(params: ServiceQuotas.Types.PutServiceQuotaIncreaseRequestIntoTemplateRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.PutServiceQuotaIncreaseRequestIntoTemplateResponse) => void): Request<ServiceQuotas.Types.PutServiceQuotaIncreaseRequestIntoTemplateResponse, AWSError>;
  /**
   * Adds a quota increase request to your quota request template.
   */
  putServiceQuotaIncreaseRequestIntoTemplate(callback?: (err: AWSError, data: ServiceQuotas.Types.PutServiceQuotaIncreaseRequestIntoTemplateResponse) => void): Request<ServiceQuotas.Types.PutServiceQuotaIncreaseRequestIntoTemplateResponse, AWSError>;
  /**
   * Submits a quota increase request for the specified quota.
   */
  requestServiceQuotaIncrease(params: ServiceQuotas.Types.RequestServiceQuotaIncreaseRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.RequestServiceQuotaIncreaseResponse) => void): Request<ServiceQuotas.Types.RequestServiceQuotaIncreaseResponse, AWSError>;
  /**
   * Submits a quota increase request for the specified quota.
   */
  requestServiceQuotaIncrease(callback?: (err: AWSError, data: ServiceQuotas.Types.RequestServiceQuotaIncreaseResponse) => void): Request<ServiceQuotas.Types.RequestServiceQuotaIncreaseResponse, AWSError>;
  /**
   * Adds tags to the specified applied quota. You can include one or more tags to add to the quota.
   */
  tagResource(params: ServiceQuotas.Types.TagResourceRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.TagResourceResponse) => void): Request<ServiceQuotas.Types.TagResourceResponse, AWSError>;
  /**
   * Adds tags to the specified applied quota. You can include one or more tags to add to the quota.
   */
  tagResource(callback?: (err: AWSError, data: ServiceQuotas.Types.TagResourceResponse) => void): Request<ServiceQuotas.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from the specified applied quota. You can specify one or more tags to remove.
   */
  untagResource(params: ServiceQuotas.Types.UntagResourceRequest, callback?: (err: AWSError, data: ServiceQuotas.Types.UntagResourceResponse) => void): Request<ServiceQuotas.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from the specified applied quota. You can specify one or more tags to remove.
   */
  untagResource(callback?: (err: AWSError, data: ServiceQuotas.Types.UntagResourceResponse) => void): Request<ServiceQuotas.Types.UntagResourceResponse, AWSError>;
}
declare namespace ServiceQuotas {
  export type AmazonResourceName = string;
  export type AppliedLevelEnum = "ACCOUNT"|"RESOURCE"|"ALL"|string;
  export interface AssociateServiceQuotaTemplateRequest {
  }
  export interface AssociateServiceQuotaTemplateResponse {
  }
  export type AwsRegion = string;
  export type CustomerServiceEngagementId = string;
  export type DateTime = Date;
  export interface DeleteServiceQuotaIncreaseRequestFromTemplateRequest {
    /**
     * Specifies the service identifier. To find the service code value for an Amazon Web Services service, use the ListServices operation.
     */
    ServiceCode: ServiceCode;
    /**
     * Specifies the quota identifier. To find the quota code for a specific quota, use the ListServiceQuotas operation, and look for the QuotaCode response in the output for the quota you want.
     */
    QuotaCode: QuotaCode;
    /**
     * Specifies the Amazon Web Services Region for which the request was made.
     */
    AwsRegion: AwsRegion;
  }
  export interface DeleteServiceQuotaIncreaseRequestFromTemplateResponse {
  }
  export interface DisassociateServiceQuotaTemplateRequest {
  }
  export interface DisassociateServiceQuotaTemplateResponse {
  }
  export type ErrorCode = "DEPENDENCY_ACCESS_DENIED_ERROR"|"DEPENDENCY_THROTTLING_ERROR"|"DEPENDENCY_SERVICE_ERROR"|"SERVICE_QUOTA_NOT_AVAILABLE_ERROR"|string;
  export type ErrorMessage = string;
  export interface ErrorReason {
    /**
     * Service Quotas returns the following error values:    DEPENDENCY_ACCESS_DENIED_ERROR - The caller does not have the required permissions to complete the action. To resolve the error, you must have permission to access the Amazon Web Service or quota.    DEPENDENCY_THROTTLING_ERROR - The Amazon Web Service is throttling Service Quotas.     DEPENDENCY_SERVICE_ERROR - The Amazon Web Service is not available.    SERVICE_QUOTA_NOT_AVAILABLE_ERROR - There was an error in Service Quotas.  
     */
    ErrorCode?: ErrorCode;
    /**
     * The error message.
     */
    ErrorMessage?: ErrorMessage;
  }
  export interface GetAWSDefaultServiceQuotaRequest {
    /**
     * Specifies the service identifier. To find the service code value for an Amazon Web Services service, use the ListServices operation.
     */
    ServiceCode: ServiceCode;
    /**
     * Specifies the quota identifier. To find the quota code for a specific quota, use the ListServiceQuotas operation, and look for the QuotaCode response in the output for the quota you want.
     */
    QuotaCode: QuotaCode;
  }
  export interface GetAWSDefaultServiceQuotaResponse {
    /**
     * Information about the quota.
     */
    Quota?: ServiceQuota;
  }
  export interface GetAssociationForServiceQuotaTemplateRequest {
  }
  export interface GetAssociationForServiceQuotaTemplateResponse {
    /**
     * The association status. If the status is ASSOCIATED, the quota increase requests in the template are automatically applied to new Amazon Web Services accounts in your organization.
     */
    ServiceQuotaTemplateAssociationStatus?: ServiceQuotaTemplateAssociationStatus;
  }
  export interface GetRequestedServiceQuotaChangeRequest {
    /**
     * Specifies the ID of the quota increase request.
     */
    RequestId: RequestId;
  }
  export interface GetRequestedServiceQuotaChangeResponse {
    /**
     * Information about the quota increase request.
     */
    RequestedQuota?: RequestedServiceQuotaChange;
  }
  export interface GetServiceQuotaIncreaseRequestFromTemplateRequest {
    /**
     * Specifies the service identifier. To find the service code value for an Amazon Web Services service, use the ListServices operation.
     */
    ServiceCode: ServiceCode;
    /**
     * Specifies the quota identifier. To find the quota code for a specific quota, use the ListServiceQuotas operation, and look for the QuotaCode response in the output for the quota you want.
     */
    QuotaCode: QuotaCode;
    /**
     * Specifies the Amazon Web Services Region for which you made the request.
     */
    AwsRegion: AwsRegion;
  }
  export interface GetServiceQuotaIncreaseRequestFromTemplateResponse {
    /**
     * Information about the quota increase request.
     */
    ServiceQuotaIncreaseRequestInTemplate?: ServiceQuotaIncreaseRequestInTemplate;
  }
  export interface GetServiceQuotaRequest {
    /**
     * Specifies the service identifier. To find the service code value for an Amazon Web Services service, use the ListServices operation.
     */
    ServiceCode: ServiceCode;
    /**
     * Specifies the quota identifier. To find the quota code for a specific quota, use the ListServiceQuotas operation, and look for the QuotaCode response in the output for the quota you want.
     */
    QuotaCode: QuotaCode;
    /**
     * Specifies the Amazon Web Services account or resource to which the quota applies. The value in this field depends on the context scope associated with the specified service quota.
     */
    ContextId?: QuotaContextId;
  }
  export interface GetServiceQuotaResponse {
    /**
     * Information about the quota.
     */
    Quota?: ServiceQuota;
  }
  export type GlobalQuota = boolean;
  export type InputTagKeys = TagKey[];
  export type InputTags = Tag[];
  export interface ListAWSDefaultServiceQuotasRequest {
    /**
     * Specifies the service identifier. To find the service code value for an Amazon Web Services service, use the ListServices operation.
     */
    ServiceCode: ServiceCode;
    /**
     * Specifies a value for receiving additional results after you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * Specifies the maximum number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value appropriate to the operation. If additional items exist beyond those included in the current response, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results.  An API operation can return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results. 
     */
    MaxResults?: MaxResults;
  }
  export interface ListAWSDefaultServiceQuotasResponse {
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
    /**
     * Information about the quotas.
     */
    Quotas?: ServiceQuotaListDefinition;
  }
  export interface ListRequestedServiceQuotaChangeHistoryByQuotaRequest {
    /**
     * Specifies the service identifier. To find the service code value for an Amazon Web Services service, use the ListServices operation.
     */
    ServiceCode: ServiceCode;
    /**
     * Specifies the quota identifier. To find the quota code for a specific quota, use the ListServiceQuotas operation, and look for the QuotaCode response in the output for the quota you want.
     */
    QuotaCode: QuotaCode;
    /**
     * Specifies that you want to filter the results to only the requests with the matching status.
     */
    Status?: RequestStatus;
    /**
     * Specifies a value for receiving additional results after you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * Specifies the maximum number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value appropriate to the operation. If additional items exist beyond those included in the current response, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results.  An API operation can return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results. 
     */
    MaxResults?: MaxResults;
    /**
     * Specifies at which level within the Amazon Web Services account the quota request applies to.
     */
    QuotaRequestedAtLevel?: AppliedLevelEnum;
  }
  export interface ListRequestedServiceQuotaChangeHistoryByQuotaResponse {
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
    /**
     * Information about the quota increase requests.
     */
    RequestedQuotas?: RequestedServiceQuotaChangeHistoryListDefinition;
  }
  export interface ListRequestedServiceQuotaChangeHistoryRequest {
    /**
     * Specifies the service identifier. To find the service code value for an Amazon Web Services service, use the ListServices operation.
     */
    ServiceCode?: ServiceCode;
    /**
     * Specifies that you want to filter the results to only the requests with the matching status.
     */
    Status?: RequestStatus;
    /**
     * Specifies a value for receiving additional results after you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * Specifies the maximum number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value appropriate to the operation. If additional items exist beyond those included in the current response, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results.  An API operation can return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results. 
     */
    MaxResults?: MaxResults;
    /**
     * Specifies at which level within the Amazon Web Services account the quota request applies to.
     */
    QuotaRequestedAtLevel?: AppliedLevelEnum;
  }
  export interface ListRequestedServiceQuotaChangeHistoryResponse {
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
    /**
     * Information about the quota increase requests.
     */
    RequestedQuotas?: RequestedServiceQuotaChangeHistoryListDefinition;
  }
  export interface ListServiceQuotaIncreaseRequestsInTemplateRequest {
    /**
     * Specifies the service identifier. To find the service code value for an Amazon Web Services service, use the ListServices operation.
     */
    ServiceCode?: ServiceCode;
    /**
     * Specifies the Amazon Web Services Region for which you made the request.
     */
    AwsRegion?: AwsRegion;
    /**
     * Specifies a value for receiving additional results after you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * Specifies the maximum number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value appropriate to the operation. If additional items exist beyond those included in the current response, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results.  An API operation can return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results. 
     */
    MaxResults?: MaxResults;
  }
  export interface ListServiceQuotaIncreaseRequestsInTemplateResponse {
    /**
     * Information about the quota increase requests.
     */
    ServiceQuotaIncreaseRequestInTemplateList?: ServiceQuotaIncreaseRequestInTemplateList;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
  }
  export interface ListServiceQuotasRequest {
    /**
     * Specifies the service identifier. To find the service code value for an Amazon Web Services service, use the ListServices operation.
     */
    ServiceCode: ServiceCode;
    /**
     * Specifies a value for receiving additional results after you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * Specifies the maximum number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value appropriate to the operation. If additional items exist beyond those included in the current response, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results.  An API operation can return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results. 
     */
    MaxResults?: MaxResults;
    /**
     * Specifies the quota identifier. To find the quota code for a specific quota, use the ListServiceQuotas operation, and look for the QuotaCode response in the output for the quota you want.
     */
    QuotaCode?: QuotaCode;
    /**
     * Specifies at which level of granularity that the quota value is applied.
     */
    QuotaAppliedAtLevel?: AppliedLevelEnum;
  }
  export interface ListServiceQuotasResponse {
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
    /**
     * Information about the quotas.
     */
    Quotas?: ServiceQuotaListDefinition;
  }
  export interface ListServicesRequest {
    /**
     * Specifies a value for receiving additional results after you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: NextToken;
    /**
     * Specifies the maximum number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value appropriate to the operation. If additional items exist beyond those included in the current response, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results.  An API operation can return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results. 
     */
    MaxResults?: MaxResults;
  }
  export interface ListServicesResponse {
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: NextToken;
    /**
     * The list of the Amazon Web Service names and service codes.
     */
    Services?: ServiceInfoListDefinition;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the applied quota for which you want to list tags. You can get this information by using the Service Quotas console, or by listing the quotas using the list-service-quotas CLI command or the ListServiceQuotas Amazon Web Services API operation.
     */
    ResourceARN: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A complex data type that contains zero or more tag elements.
     */
    Tags?: OutputTags;
  }
  export type MaxResults = number;
  export type MetricDimensionName = string;
  export type MetricDimensionValue = string;
  export type MetricDimensionsMapDefinition = {[key: string]: MetricDimensionValue};
  export interface MetricInfo {
    /**
     * The namespace of the metric.
     */
    MetricNamespace?: QuotaMetricNamespace;
    /**
     * The name of the metric.
     */
    MetricName?: QuotaMetricName;
    /**
     * The metric dimension. This is a name/value pair that is part of the identity of a metric.
     */
    MetricDimensions?: MetricDimensionsMapDefinition;
    /**
     * The metric statistic that we recommend you use when determining quota usage.
     */
    MetricStatisticRecommendation?: Statistic;
  }
  export type NextToken = string;
  export type OutputTags = Tag[];
  export type PeriodUnit = "MICROSECOND"|"MILLISECOND"|"SECOND"|"MINUTE"|"HOUR"|"DAY"|"WEEK"|string;
  export type PeriodValue = number;
  export interface PutServiceQuotaIncreaseRequestIntoTemplateRequest {
    /**
     * Specifies the quota identifier. To find the quota code for a specific quota, use the ListServiceQuotas operation, and look for the QuotaCode response in the output for the quota you want.
     */
    QuotaCode: QuotaCode;
    /**
     * Specifies the service identifier. To find the service code value for an Amazon Web Services service, use the ListServices operation.
     */
    ServiceCode: ServiceCode;
    /**
     * Specifies the Amazon Web Services Region to which the template applies.
     */
    AwsRegion: AwsRegion;
    /**
     * Specifies the new, increased value for the quota.
     */
    DesiredValue: QuotaValue;
  }
  export interface PutServiceQuotaIncreaseRequestIntoTemplateResponse {
    /**
     * Information about the quota increase request.
     */
    ServiceQuotaIncreaseRequestInTemplate?: ServiceQuotaIncreaseRequestInTemplate;
  }
  export type QuotaAdjustable = boolean;
  export type QuotaArn = string;
  export type QuotaCode = string;
  export type QuotaContextId = string;
  export interface QuotaContextInfo {
    /**
     * Specifies whether the quota applies to an Amazon Web Services account, or to a resource.
     */
    ContextScope?: QuotaContextScope;
    /**
     * When the ContextScope is RESOURCE, then this specifies the resource type of the specified resource.
     */
    ContextScopeType?: QuotaContextScopeType;
    /**
     * Specifies the Amazon Web Services account or resource to which the quota applies. The value in this field depends on the context scope associated with the specified service quota.
     */
    ContextId?: QuotaContextId;
  }
  export type QuotaContextScope = "RESOURCE"|"ACCOUNT"|string;
  export type QuotaContextScopeType = string;
  export type QuotaMetricName = string;
  export type QuotaMetricNamespace = string;
  export type QuotaName = string;
  export interface QuotaPeriod {
    /**
     * The value associated with the reported PeriodUnit.
     */
    PeriodValue?: PeriodValue;
    /**
     * The time unit.
     */
    PeriodUnit?: PeriodUnit;
  }
  export type QuotaUnit = string;
  export type QuotaValue = number;
  export type RequestId = string;
  export interface RequestServiceQuotaIncreaseRequest {
    /**
     * Specifies the service identifier. To find the service code value for an Amazon Web Services service, use the ListServices operation.
     */
    ServiceCode: ServiceCode;
    /**
     * Specifies the quota identifier. To find the quota code for a specific quota, use the ListServiceQuotas operation, and look for the QuotaCode response in the output for the quota you want.
     */
    QuotaCode: QuotaCode;
    /**
     * Specifies the new, increased value for the quota.
     */
    DesiredValue: QuotaValue;
    /**
     * Specifies the Amazon Web Services account or resource to which the quota applies. The value in this field depends on the context scope associated with the specified service quota.
     */
    ContextId?: QuotaContextId;
  }
  export interface RequestServiceQuotaIncreaseResponse {
    /**
     * Information about the quota increase request.
     */
    RequestedQuota?: RequestedServiceQuotaChange;
  }
  export type RequestStatus = "PENDING"|"CASE_OPENED"|"APPROVED"|"DENIED"|"CASE_CLOSED"|"NOT_APPROVED"|"INVALID_REQUEST"|string;
  export interface RequestedServiceQuotaChange {
    /**
     * The unique identifier.
     */
    Id?: RequestId;
    /**
     * The case ID.
     */
    CaseId?: CustomerServiceEngagementId;
    /**
     * Specifies the service identifier. To find the service code value for an Amazon Web Services service, use the ListServices operation.
     */
    ServiceCode?: ServiceCode;
    /**
     * Specifies the service name.
     */
    ServiceName?: ServiceName;
    /**
     * Specifies the quota identifier. To find the quota code for a specific quota, use the ListServiceQuotas operation, and look for the QuotaCode response in the output for the quota you want.
     */
    QuotaCode?: QuotaCode;
    /**
     * Specifies the quota name.
     */
    QuotaName?: QuotaName;
    /**
     * The new, increased value for the quota.
     */
    DesiredValue?: QuotaValue;
    /**
     * The state of the quota increase request.
     */
    Status?: RequestStatus;
    /**
     * The date and time when the quota increase request was received and the case ID was created.
     */
    Created?: DateTime;
    /**
     * The date and time of the most recent change.
     */
    LastUpdated?: DateTime;
    /**
     * The IAM identity of the requester.
     */
    Requester?: Requester;
    /**
     * The Amazon Resource Name (ARN) of the quota.
     */
    QuotaArn?: QuotaArn;
    /**
     * Indicates whether the quota is global.
     */
    GlobalQuota?: GlobalQuota;
    /**
     * The unit of measurement.
     */
    Unit?: QuotaUnit;
    /**
     * Specifies at which level within the Amazon Web Services account the quota request applies to.
     */
    QuotaRequestedAtLevel?: AppliedLevelEnum;
    /**
     * The context for this service quota.
     */
    QuotaContext?: QuotaContextInfo;
  }
  export type RequestedServiceQuotaChangeHistoryListDefinition = RequestedServiceQuotaChange[];
  export type Requester = string;
  export type ServiceCode = string;
  export interface ServiceInfo {
    /**
     * Specifies the service identifier. To find the service code value for an Amazon Web Services service, use the ListServices operation.
     */
    ServiceCode?: ServiceCode;
    /**
     * Specifies the service name.
     */
    ServiceName?: ServiceName;
  }
  export type ServiceInfoListDefinition = ServiceInfo[];
  export type ServiceName = string;
  export interface ServiceQuota {
    /**
     * Specifies the service identifier. To find the service code value for an Amazon Web Services service, use the ListServices operation.
     */
    ServiceCode?: ServiceCode;
    /**
     * Specifies the service name.
     */
    ServiceName?: ServiceName;
    /**
     * The Amazon Resource Name (ARN) of the quota.
     */
    QuotaArn?: QuotaArn;
    /**
     * Specifies the quota identifier. To find the quota code for a specific quota, use the ListServiceQuotas operation, and look for the QuotaCode response in the output for the quota you want.
     */
    QuotaCode?: QuotaCode;
    /**
     * Specifies the quota name.
     */
    QuotaName?: QuotaName;
    /**
     * The quota value.
     */
    Value?: QuotaValue;
    /**
     * The unit of measurement.
     */
    Unit?: QuotaUnit;
    /**
     * Indicates whether the quota value can be increased.
     */
    Adjustable?: QuotaAdjustable;
    /**
     * Indicates whether the quota is global.
     */
    GlobalQuota?: GlobalQuota;
    /**
     * Information about the measurement.
     */
    UsageMetric?: MetricInfo;
    /**
     * The period of time.
     */
    Period?: QuotaPeriod;
    /**
     * The error code and error reason.
     */
    ErrorReason?: ErrorReason;
    /**
     * Specifies at which level of granularity that the quota value is applied.
     */
    QuotaAppliedAtLevel?: AppliedLevelEnum;
    /**
     * The context for this service quota.
     */
    QuotaContext?: QuotaContextInfo;
  }
  export interface ServiceQuotaIncreaseRequestInTemplate {
    /**
     * Specifies the service identifier. To find the service code value for an Amazon Web Services service, use the ListServices operation.
     */
    ServiceCode?: ServiceCode;
    /**
     * Specifies the service name.
     */
    ServiceName?: ServiceName;
    /**
     * Specifies the quota identifier. To find the quota code for a specific quota, use the ListServiceQuotas operation, and look for the QuotaCode response in the output for the quota you want.
     */
    QuotaCode?: QuotaCode;
    /**
     * Specifies the quota name.
     */
    QuotaName?: QuotaName;
    /**
     * The new, increased value of the quota.
     */
    DesiredValue?: QuotaValue;
    /**
     * The Amazon Web Services Region.
     */
    AwsRegion?: AwsRegion;
    /**
     * The unit of measurement.
     */
    Unit?: QuotaUnit;
    /**
     * Indicates whether the quota is global.
     */
    GlobalQuota?: GlobalQuota;
  }
  export type ServiceQuotaIncreaseRequestInTemplateList = ServiceQuotaIncreaseRequestInTemplate[];
  export type ServiceQuotaListDefinition = ServiceQuota[];
  export type ServiceQuotaTemplateAssociationStatus = "ASSOCIATED"|"DISASSOCIATED"|string;
  export type Statistic = string;
  export interface Tag {
    /**
     * A string that contains a tag key. The string length should be between 1 and 128 characters. Valid characters include a-z, A-Z, 0-9, space, and the special characters _ - . : / = + @.
     */
    Key: TagKey;
    /**
     * A string that contains an optional tag value. The string length should be between 0 and 256 characters. Valid characters include a-z, A-Z, 0-9, space, and the special characters _ - . : / = + @.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the applied quota. You can get this information by using the Service Quotas console, or by listing the quotas using the list-service-quotas CLI command or the ListServiceQuotas Amazon Web Services API operation.
     */
    ResourceARN: AmazonResourceName;
    /**
     * The tags that you want to add to the resource.
     */
    Tags: InputTags;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the applied quota that you want to untag. You can get this information by using the Service Quotas console, or by listing the quotas using the list-service-quotas CLI command or the ListServiceQuotas Amazon Web Services API operation.
     */
    ResourceARN: AmazonResourceName;
    /**
     * The keys of the tags that you want to remove from the resource.
     */
    TagKeys: InputTagKeys;
  }
  export interface UntagResourceResponse {
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-06-24"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ServiceQuotas client.
   */
  export import Types = ServiceQuotas;
}
export = ServiceQuotas;
