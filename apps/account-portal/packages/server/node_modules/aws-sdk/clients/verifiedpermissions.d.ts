import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class VerifiedPermissions extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: VerifiedPermissions.Types.ClientConfiguration)
  config: Config & VerifiedPermissions.Types.ClientConfiguration;
  /**
   * Creates a reference to an Amazon Cognito user pool as an external identity provider (IdP).  After you create an identity source, you can use the identities provided by the IdP as proxies for the principal in authorization queries that use the IsAuthorizedWithToken operation. These identities take the form of tokens that contain claims about the user, such as IDs, attributes and group memberships. Amazon Cognito provides both identity tokens and access tokens, and Verified Permissions can use either or both. Any combination of identity and access tokens results in the same Cedar principal. Verified Permissions automatically translates the information about the identities into the standard Cedar attributes that can be evaluated by your policies. Because the Amazon Cognito identity and access tokens can contain different information, the tokens you choose to use determine which principal attributes are available to access when evaluating Cedar policies.  If you delete a Amazon Cognito user pool or user, tokens from that deleted pool or that deleted user continue to be usable until they expire.   To reference a user from this identity source in your Cedar policies, use the following syntax.  IdentityType::"&lt;CognitoUserPoolIdentifier&gt;|&lt;CognitoClientId&gt;  Where IdentityType is the string that you provide to the PrincipalEntityType parameter for this operation. The CognitoUserPoolId and CognitoClientId are defined by the Amazon Cognito user pool.   Verified Permissions is  eventually consistent . It can take a few seconds for a new or changed element to be propagate through the service and be visible in the results of other Verified Permissions operations. 
   */
  createIdentitySource(params: VerifiedPermissions.Types.CreateIdentitySourceInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.CreateIdentitySourceOutput) => void): Request<VerifiedPermissions.Types.CreateIdentitySourceOutput, AWSError>;
  /**
   * Creates a reference to an Amazon Cognito user pool as an external identity provider (IdP).  After you create an identity source, you can use the identities provided by the IdP as proxies for the principal in authorization queries that use the IsAuthorizedWithToken operation. These identities take the form of tokens that contain claims about the user, such as IDs, attributes and group memberships. Amazon Cognito provides both identity tokens and access tokens, and Verified Permissions can use either or both. Any combination of identity and access tokens results in the same Cedar principal. Verified Permissions automatically translates the information about the identities into the standard Cedar attributes that can be evaluated by your policies. Because the Amazon Cognito identity and access tokens can contain different information, the tokens you choose to use determine which principal attributes are available to access when evaluating Cedar policies.  If you delete a Amazon Cognito user pool or user, tokens from that deleted pool or that deleted user continue to be usable until they expire.   To reference a user from this identity source in your Cedar policies, use the following syntax.  IdentityType::"&lt;CognitoUserPoolIdentifier&gt;|&lt;CognitoClientId&gt;  Where IdentityType is the string that you provide to the PrincipalEntityType parameter for this operation. The CognitoUserPoolId and CognitoClientId are defined by the Amazon Cognito user pool.   Verified Permissions is  eventually consistent . It can take a few seconds for a new or changed element to be propagate through the service and be visible in the results of other Verified Permissions operations. 
   */
  createIdentitySource(callback?: (err: AWSError, data: VerifiedPermissions.Types.CreateIdentitySourceOutput) => void): Request<VerifiedPermissions.Types.CreateIdentitySourceOutput, AWSError>;
  /**
   * Creates a Cedar policy and saves it in the specified policy store. You can create either a static policy or a policy linked to a policy template.   To create a static policy, provide the Cedar policy text in the StaticPolicy section of the PolicyDefinition.   To create a policy that is dynamically linked to a policy template, specify the policy template ID and the principal and resource to associate with this policy in the templateLinked section of the PolicyDefinition. If the policy template is ever updated, any policies linked to the policy template automatically use the updated template.    Creating a policy causes it to be validated against the schema in the policy store. If the policy doesn't pass validation, the operation fails and the policy isn't stored.   Verified Permissions is  eventually consistent . It can take a few seconds for a new or changed element to be propagate through the service and be visible in the results of other Verified Permissions operations. 
   */
  createPolicy(params: VerifiedPermissions.Types.CreatePolicyInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.CreatePolicyOutput) => void): Request<VerifiedPermissions.Types.CreatePolicyOutput, AWSError>;
  /**
   * Creates a Cedar policy and saves it in the specified policy store. You can create either a static policy or a policy linked to a policy template.   To create a static policy, provide the Cedar policy text in the StaticPolicy section of the PolicyDefinition.   To create a policy that is dynamically linked to a policy template, specify the policy template ID and the principal and resource to associate with this policy in the templateLinked section of the PolicyDefinition. If the policy template is ever updated, any policies linked to the policy template automatically use the updated template.    Creating a policy causes it to be validated against the schema in the policy store. If the policy doesn't pass validation, the operation fails and the policy isn't stored.   Verified Permissions is  eventually consistent . It can take a few seconds for a new or changed element to be propagate through the service and be visible in the results of other Verified Permissions operations. 
   */
  createPolicy(callback?: (err: AWSError, data: VerifiedPermissions.Types.CreatePolicyOutput) => void): Request<VerifiedPermissions.Types.CreatePolicyOutput, AWSError>;
  /**
   * Creates a policy store. A policy store is a container for policy resources.  Although Cedar supports multiple namespaces, Verified Permissions currently supports only one namespace per policy store.   Verified Permissions is  eventually consistent . It can take a few seconds for a new or changed element to be propagate through the service and be visible in the results of other Verified Permissions operations. 
   */
  createPolicyStore(params: VerifiedPermissions.Types.CreatePolicyStoreInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.CreatePolicyStoreOutput) => void): Request<VerifiedPermissions.Types.CreatePolicyStoreOutput, AWSError>;
  /**
   * Creates a policy store. A policy store is a container for policy resources.  Although Cedar supports multiple namespaces, Verified Permissions currently supports only one namespace per policy store.   Verified Permissions is  eventually consistent . It can take a few seconds for a new or changed element to be propagate through the service and be visible in the results of other Verified Permissions operations. 
   */
  createPolicyStore(callback?: (err: AWSError, data: VerifiedPermissions.Types.CreatePolicyStoreOutput) => void): Request<VerifiedPermissions.Types.CreatePolicyStoreOutput, AWSError>;
  /**
   * Creates a policy template. A template can use placeholders for the principal and resource. A template must be instantiated into a policy by associating it with specific principals and resources to use for the placeholders. That instantiated policy can then be considered in authorization decisions. The instantiated policy works identically to any other policy, except that it is dynamically linked to the template. If the template changes, then any policies that are linked to that template are immediately updated as well.  Verified Permissions is  eventually consistent . It can take a few seconds for a new or changed element to be propagate through the service and be visible in the results of other Verified Permissions operations. 
   */
  createPolicyTemplate(params: VerifiedPermissions.Types.CreatePolicyTemplateInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.CreatePolicyTemplateOutput) => void): Request<VerifiedPermissions.Types.CreatePolicyTemplateOutput, AWSError>;
  /**
   * Creates a policy template. A template can use placeholders for the principal and resource. A template must be instantiated into a policy by associating it with specific principals and resources to use for the placeholders. That instantiated policy can then be considered in authorization decisions. The instantiated policy works identically to any other policy, except that it is dynamically linked to the template. If the template changes, then any policies that are linked to that template are immediately updated as well.  Verified Permissions is  eventually consistent . It can take a few seconds for a new or changed element to be propagate through the service and be visible in the results of other Verified Permissions operations. 
   */
  createPolicyTemplate(callback?: (err: AWSError, data: VerifiedPermissions.Types.CreatePolicyTemplateOutput) => void): Request<VerifiedPermissions.Types.CreatePolicyTemplateOutput, AWSError>;
  /**
   * Deletes an identity source that references an identity provider (IdP) such as Amazon Cognito. After you delete the identity source, you can no longer use tokens for identities from that identity source to represent principals in authorization queries made using IsAuthorizedWithToken. operations.
   */
  deleteIdentitySource(params: VerifiedPermissions.Types.DeleteIdentitySourceInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.DeleteIdentitySourceOutput) => void): Request<VerifiedPermissions.Types.DeleteIdentitySourceOutput, AWSError>;
  /**
   * Deletes an identity source that references an identity provider (IdP) such as Amazon Cognito. After you delete the identity source, you can no longer use tokens for identities from that identity source to represent principals in authorization queries made using IsAuthorizedWithToken. operations.
   */
  deleteIdentitySource(callback?: (err: AWSError, data: VerifiedPermissions.Types.DeleteIdentitySourceOutput) => void): Request<VerifiedPermissions.Types.DeleteIdentitySourceOutput, AWSError>;
  /**
   * Deletes the specified policy from the policy store. This operation is idempotent; if you specify a policy that doesn't exist, the request response returns a successful HTTP 200 status code.
   */
  deletePolicy(params: VerifiedPermissions.Types.DeletePolicyInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.DeletePolicyOutput) => void): Request<VerifiedPermissions.Types.DeletePolicyOutput, AWSError>;
  /**
   * Deletes the specified policy from the policy store. This operation is idempotent; if you specify a policy that doesn't exist, the request response returns a successful HTTP 200 status code.
   */
  deletePolicy(callback?: (err: AWSError, data: VerifiedPermissions.Types.DeletePolicyOutput) => void): Request<VerifiedPermissions.Types.DeletePolicyOutput, AWSError>;
  /**
   * Deletes the specified policy store. This operation is idempotent. If you specify a policy store that does not exist, the request response will still return a successful HTTP 200 status code.
   */
  deletePolicyStore(params: VerifiedPermissions.Types.DeletePolicyStoreInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.DeletePolicyStoreOutput) => void): Request<VerifiedPermissions.Types.DeletePolicyStoreOutput, AWSError>;
  /**
   * Deletes the specified policy store. This operation is idempotent. If you specify a policy store that does not exist, the request response will still return a successful HTTP 200 status code.
   */
  deletePolicyStore(callback?: (err: AWSError, data: VerifiedPermissions.Types.DeletePolicyStoreOutput) => void): Request<VerifiedPermissions.Types.DeletePolicyStoreOutput, AWSError>;
  /**
   * Deletes the specified policy template from the policy store.  This operation also deletes any policies that were created from the specified policy template. Those policies are immediately removed from all future API responses, and are asynchronously deleted from the policy store. 
   */
  deletePolicyTemplate(params: VerifiedPermissions.Types.DeletePolicyTemplateInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.DeletePolicyTemplateOutput) => void): Request<VerifiedPermissions.Types.DeletePolicyTemplateOutput, AWSError>;
  /**
   * Deletes the specified policy template from the policy store.  This operation also deletes any policies that were created from the specified policy template. Those policies are immediately removed from all future API responses, and are asynchronously deleted from the policy store. 
   */
  deletePolicyTemplate(callback?: (err: AWSError, data: VerifiedPermissions.Types.DeletePolicyTemplateOutput) => void): Request<VerifiedPermissions.Types.DeletePolicyTemplateOutput, AWSError>;
  /**
   * Retrieves the details about the specified identity source.
   */
  getIdentitySource(params: VerifiedPermissions.Types.GetIdentitySourceInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.GetIdentitySourceOutput) => void): Request<VerifiedPermissions.Types.GetIdentitySourceOutput, AWSError>;
  /**
   * Retrieves the details about the specified identity source.
   */
  getIdentitySource(callback?: (err: AWSError, data: VerifiedPermissions.Types.GetIdentitySourceOutput) => void): Request<VerifiedPermissions.Types.GetIdentitySourceOutput, AWSError>;
  /**
   * Retrieves information about the specified policy.
   */
  getPolicy(params: VerifiedPermissions.Types.GetPolicyInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.GetPolicyOutput) => void): Request<VerifiedPermissions.Types.GetPolicyOutput, AWSError>;
  /**
   * Retrieves information about the specified policy.
   */
  getPolicy(callback?: (err: AWSError, data: VerifiedPermissions.Types.GetPolicyOutput) => void): Request<VerifiedPermissions.Types.GetPolicyOutput, AWSError>;
  /**
   * Retrieves details about a policy store.
   */
  getPolicyStore(params: VerifiedPermissions.Types.GetPolicyStoreInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.GetPolicyStoreOutput) => void): Request<VerifiedPermissions.Types.GetPolicyStoreOutput, AWSError>;
  /**
   * Retrieves details about a policy store.
   */
  getPolicyStore(callback?: (err: AWSError, data: VerifiedPermissions.Types.GetPolicyStoreOutput) => void): Request<VerifiedPermissions.Types.GetPolicyStoreOutput, AWSError>;
  /**
   * Retrieve the details for the specified policy template in the specified policy store.
   */
  getPolicyTemplate(params: VerifiedPermissions.Types.GetPolicyTemplateInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.GetPolicyTemplateOutput) => void): Request<VerifiedPermissions.Types.GetPolicyTemplateOutput, AWSError>;
  /**
   * Retrieve the details for the specified policy template in the specified policy store.
   */
  getPolicyTemplate(callback?: (err: AWSError, data: VerifiedPermissions.Types.GetPolicyTemplateOutput) => void): Request<VerifiedPermissions.Types.GetPolicyTemplateOutput, AWSError>;
  /**
   * Retrieve the details for the specified schema in the specified policy store.
   */
  getSchema(params: VerifiedPermissions.Types.GetSchemaInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.GetSchemaOutput) => void): Request<VerifiedPermissions.Types.GetSchemaOutput, AWSError>;
  /**
   * Retrieve the details for the specified schema in the specified policy store.
   */
  getSchema(callback?: (err: AWSError, data: VerifiedPermissions.Types.GetSchemaOutput) => void): Request<VerifiedPermissions.Types.GetSchemaOutput, AWSError>;
  /**
   * Makes an authorization decision about a service request described in the parameters. The information in the parameters can also define additional context that Verified Permissions can include in the evaluation. The request is evaluated against all matching policies in the specified policy store. The result of the decision is either Allow or Deny, along with a list of the policies that resulted in the decision.
   */
  isAuthorized(params: VerifiedPermissions.Types.IsAuthorizedInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.IsAuthorizedOutput) => void): Request<VerifiedPermissions.Types.IsAuthorizedOutput, AWSError>;
  /**
   * Makes an authorization decision about a service request described in the parameters. The information in the parameters can also define additional context that Verified Permissions can include in the evaluation. The request is evaluated against all matching policies in the specified policy store. The result of the decision is either Allow or Deny, along with a list of the policies that resulted in the decision.
   */
  isAuthorized(callback?: (err: AWSError, data: VerifiedPermissions.Types.IsAuthorizedOutput) => void): Request<VerifiedPermissions.Types.IsAuthorizedOutput, AWSError>;
  /**
   * Makes an authorization decision about a service request described in the parameters. The principal in this request comes from an external identity source in the form of an identity token formatted as a JSON web token (JWT). The information in the parameters can also define additional context that Verified Permissions can include in the evaluation. The request is evaluated against all matching policies in the specified policy store. The result of the decision is either Allow or Deny, along with a list of the policies that resulted in the decision.  If you specify the identityToken parameter, then this operation derives the principal from that token. You must not also include that principal in the entities parameter or the operation fails and reports a conflict between the two entity sources. If you provide only an accessToken, then you can include the entity as part of the entities parameter to provide additional attributes.  At this time, Verified Permissions accepts tokens from only Amazon Cognito. Verified Permissions validates each token that is specified in a request by checking its expiration date and its signature.  If you delete a Amazon Cognito user pool or user, tokens from that deleted pool or that deleted user continue to be usable until they expire. 
   */
  isAuthorizedWithToken(params: VerifiedPermissions.Types.IsAuthorizedWithTokenInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.IsAuthorizedWithTokenOutput) => void): Request<VerifiedPermissions.Types.IsAuthorizedWithTokenOutput, AWSError>;
  /**
   * Makes an authorization decision about a service request described in the parameters. The principal in this request comes from an external identity source in the form of an identity token formatted as a JSON web token (JWT). The information in the parameters can also define additional context that Verified Permissions can include in the evaluation. The request is evaluated against all matching policies in the specified policy store. The result of the decision is either Allow or Deny, along with a list of the policies that resulted in the decision.  If you specify the identityToken parameter, then this operation derives the principal from that token. You must not also include that principal in the entities parameter or the operation fails and reports a conflict between the two entity sources. If you provide only an accessToken, then you can include the entity as part of the entities parameter to provide additional attributes.  At this time, Verified Permissions accepts tokens from only Amazon Cognito. Verified Permissions validates each token that is specified in a request by checking its expiration date and its signature.  If you delete a Amazon Cognito user pool or user, tokens from that deleted pool or that deleted user continue to be usable until they expire. 
   */
  isAuthorizedWithToken(callback?: (err: AWSError, data: VerifiedPermissions.Types.IsAuthorizedWithTokenOutput) => void): Request<VerifiedPermissions.Types.IsAuthorizedWithTokenOutput, AWSError>;
  /**
   * Returns a paginated list of all of the identity sources defined in the specified policy store.
   */
  listIdentitySources(params: VerifiedPermissions.Types.ListIdentitySourcesInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.ListIdentitySourcesOutput) => void): Request<VerifiedPermissions.Types.ListIdentitySourcesOutput, AWSError>;
  /**
   * Returns a paginated list of all of the identity sources defined in the specified policy store.
   */
  listIdentitySources(callback?: (err: AWSError, data: VerifiedPermissions.Types.ListIdentitySourcesOutput) => void): Request<VerifiedPermissions.Types.ListIdentitySourcesOutput, AWSError>;
  /**
   * Returns a paginated list of all policies stored in the specified policy store.
   */
  listPolicies(params: VerifiedPermissions.Types.ListPoliciesInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.ListPoliciesOutput) => void): Request<VerifiedPermissions.Types.ListPoliciesOutput, AWSError>;
  /**
   * Returns a paginated list of all policies stored in the specified policy store.
   */
  listPolicies(callback?: (err: AWSError, data: VerifiedPermissions.Types.ListPoliciesOutput) => void): Request<VerifiedPermissions.Types.ListPoliciesOutput, AWSError>;
  /**
   * Returns a paginated list of all policy stores in the calling Amazon Web Services account.
   */
  listPolicyStores(params: VerifiedPermissions.Types.ListPolicyStoresInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.ListPolicyStoresOutput) => void): Request<VerifiedPermissions.Types.ListPolicyStoresOutput, AWSError>;
  /**
   * Returns a paginated list of all policy stores in the calling Amazon Web Services account.
   */
  listPolicyStores(callback?: (err: AWSError, data: VerifiedPermissions.Types.ListPolicyStoresOutput) => void): Request<VerifiedPermissions.Types.ListPolicyStoresOutput, AWSError>;
  /**
   * Returns a paginated list of all policy templates in the specified policy store.
   */
  listPolicyTemplates(params: VerifiedPermissions.Types.ListPolicyTemplatesInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.ListPolicyTemplatesOutput) => void): Request<VerifiedPermissions.Types.ListPolicyTemplatesOutput, AWSError>;
  /**
   * Returns a paginated list of all policy templates in the specified policy store.
   */
  listPolicyTemplates(callback?: (err: AWSError, data: VerifiedPermissions.Types.ListPolicyTemplatesOutput) => void): Request<VerifiedPermissions.Types.ListPolicyTemplatesOutput, AWSError>;
  /**
   * Creates or updates the policy schema in the specified policy store. The schema is used to validate any Cedar policies and policy templates submitted to the policy store. Any changes to the schema validate only policies and templates submitted after the schema change. Existing policies and templates are not re-evaluated against the changed schema. If you later update a policy, then it is evaluated against the new schema at that time.  Verified Permissions is  eventually consistent . It can take a few seconds for a new or changed element to be propagate through the service and be visible in the results of other Verified Permissions operations. 
   */
  putSchema(params: VerifiedPermissions.Types.PutSchemaInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.PutSchemaOutput) => void): Request<VerifiedPermissions.Types.PutSchemaOutput, AWSError>;
  /**
   * Creates or updates the policy schema in the specified policy store. The schema is used to validate any Cedar policies and policy templates submitted to the policy store. Any changes to the schema validate only policies and templates submitted after the schema change. Existing policies and templates are not re-evaluated against the changed schema. If you later update a policy, then it is evaluated against the new schema at that time.  Verified Permissions is  eventually consistent . It can take a few seconds for a new or changed element to be propagate through the service and be visible in the results of other Verified Permissions operations. 
   */
  putSchema(callback?: (err: AWSError, data: VerifiedPermissions.Types.PutSchemaOutput) => void): Request<VerifiedPermissions.Types.PutSchemaOutput, AWSError>;
  /**
   * Updates the specified identity source to use a new identity provider (IdP) source, or to change the mapping of identities from the IdP to a different principal entity type.  Verified Permissions is  eventually consistent . It can take a few seconds for a new or changed element to be propagate through the service and be visible in the results of other Verified Permissions operations. 
   */
  updateIdentitySource(params: VerifiedPermissions.Types.UpdateIdentitySourceInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.UpdateIdentitySourceOutput) => void): Request<VerifiedPermissions.Types.UpdateIdentitySourceOutput, AWSError>;
  /**
   * Updates the specified identity source to use a new identity provider (IdP) source, or to change the mapping of identities from the IdP to a different principal entity type.  Verified Permissions is  eventually consistent . It can take a few seconds for a new or changed element to be propagate through the service and be visible in the results of other Verified Permissions operations. 
   */
  updateIdentitySource(callback?: (err: AWSError, data: VerifiedPermissions.Types.UpdateIdentitySourceOutput) => void): Request<VerifiedPermissions.Types.UpdateIdentitySourceOutput, AWSError>;
  /**
   * Modifies a Cedar static policy in the specified policy store. You can change only certain elements of the UpdatePolicyDefinition parameter. You can directly update only static policies. To change a template-linked policy, you must update the template instead, using UpdatePolicyTemplate.    If policy validation is enabled in the policy store, then updating a static policy causes Verified Permissions to validate the policy against the schema in the policy store. If the updated static policy doesn't pass validation, the operation fails and the update isn't stored.   When you edit a static policy, You can change only certain elements of a static policy:   The action referenced by the policy.    A condition clause, such as when and unless.    You can't change these elements of a static policy:    Changing a policy from a static policy to a template-linked policy.    Changing the effect of a static policy from permit or forbid.    The principal referenced by a static policy.    The resource referenced by a static policy.      To update a template-linked policy, you must update the template instead.      Verified Permissions is  eventually consistent . It can take a few seconds for a new or changed element to be propagate through the service and be visible in the results of other Verified Permissions operations. 
   */
  updatePolicy(params: VerifiedPermissions.Types.UpdatePolicyInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.UpdatePolicyOutput) => void): Request<VerifiedPermissions.Types.UpdatePolicyOutput, AWSError>;
  /**
   * Modifies a Cedar static policy in the specified policy store. You can change only certain elements of the UpdatePolicyDefinition parameter. You can directly update only static policies. To change a template-linked policy, you must update the template instead, using UpdatePolicyTemplate.    If policy validation is enabled in the policy store, then updating a static policy causes Verified Permissions to validate the policy against the schema in the policy store. If the updated static policy doesn't pass validation, the operation fails and the update isn't stored.   When you edit a static policy, You can change only certain elements of a static policy:   The action referenced by the policy.    A condition clause, such as when and unless.    You can't change these elements of a static policy:    Changing a policy from a static policy to a template-linked policy.    Changing the effect of a static policy from permit or forbid.    The principal referenced by a static policy.    The resource referenced by a static policy.      To update a template-linked policy, you must update the template instead.      Verified Permissions is  eventually consistent . It can take a few seconds for a new or changed element to be propagate through the service and be visible in the results of other Verified Permissions operations. 
   */
  updatePolicy(callback?: (err: AWSError, data: VerifiedPermissions.Types.UpdatePolicyOutput) => void): Request<VerifiedPermissions.Types.UpdatePolicyOutput, AWSError>;
  /**
   * Modifies the validation setting for a policy store.  Verified Permissions is  eventually consistent . It can take a few seconds for a new or changed element to be propagate through the service and be visible in the results of other Verified Permissions operations. 
   */
  updatePolicyStore(params: VerifiedPermissions.Types.UpdatePolicyStoreInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.UpdatePolicyStoreOutput) => void): Request<VerifiedPermissions.Types.UpdatePolicyStoreOutput, AWSError>;
  /**
   * Modifies the validation setting for a policy store.  Verified Permissions is  eventually consistent . It can take a few seconds for a new or changed element to be propagate through the service and be visible in the results of other Verified Permissions operations. 
   */
  updatePolicyStore(callback?: (err: AWSError, data: VerifiedPermissions.Types.UpdatePolicyStoreOutput) => void): Request<VerifiedPermissions.Types.UpdatePolicyStoreOutput, AWSError>;
  /**
   * Updates the specified policy template. You can update only the description and the some elements of the policyBody.   Changes you make to the policy template content are immediately reflected in authorization decisions that involve all template-linked policies instantiated from this template.   Verified Permissions is  eventually consistent . It can take a few seconds for a new or changed element to be propagate through the service and be visible in the results of other Verified Permissions operations. 
   */
  updatePolicyTemplate(params: VerifiedPermissions.Types.UpdatePolicyTemplateInput, callback?: (err: AWSError, data: VerifiedPermissions.Types.UpdatePolicyTemplateOutput) => void): Request<VerifiedPermissions.Types.UpdatePolicyTemplateOutput, AWSError>;
  /**
   * Updates the specified policy template. You can update only the description and the some elements of the policyBody.   Changes you make to the policy template content are immediately reflected in authorization decisions that involve all template-linked policies instantiated from this template.   Verified Permissions is  eventually consistent . It can take a few seconds for a new or changed element to be propagate through the service and be visible in the results of other Verified Permissions operations. 
   */
  updatePolicyTemplate(callback?: (err: AWSError, data: VerifiedPermissions.Types.UpdatePolicyTemplateOutput) => void): Request<VerifiedPermissions.Types.UpdatePolicyTemplateOutput, AWSError>;
}
declare namespace VerifiedPermissions {
  export type ActionId = string;
  export interface ActionIdentifier {
    /**
     * The type of an action.
     */
    actionType: ActionType;
    /**
     * The ID of an action.
     */
    actionId: ActionId;
  }
  export type ActionType = string;
  export interface AttributeValue {
    /**
     * An attribute value of Boolean type. Example: {"boolean": true} 
     */
    boolean?: BooleanAttribute;
    /**
     * An attribute value of type EntityIdentifier. Example: "entityIdentifier": { "entityId": "&lt;id&gt;", "entityType": "&lt;entity type&gt;"} 
     */
    entityIdentifier?: EntityIdentifier;
    /**
     * An attribute value of Long type. Example: {"long": 0} 
     */
    long?: LongAttribute;
    /**
     * An attribute value of String type. Example: {"string": "abc"} 
     */
    string?: StringAttribute;
    /**
     * An attribute value of Set type. Example: {"set": [ {} ] } 
     */
    set?: SetAttribute;
    /**
     * An attribute value of Record type. Example: {"record": { "keyName": {} } } 
     */
    record?: RecordAttribute;
  }
  export type Boolean = boolean;
  export type BooleanAttribute = boolean;
  export type ClientId = string;
  export type ClientIds = ClientId[];
  export interface CognitoUserPoolConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Cognito user pool that contains the identities to be authorized. Example: "UserPoolArn": "arn:aws:cognito-idp:us-east-1:123456789012:userpool/us-east-1_1a2b3c4d5" 
     */
    userPoolArn: UserPoolArn;
    /**
     * The unique application client IDs that are associated with the specified Amazon Cognito user pool. Example: "ClientIds": ["&amp;ExampleCogClientId;"] 
     */
    clientIds?: ClientIds;
  }
  export interface Configuration {
    /**
     * Contains configuration details of a Amazon Cognito user pool that Verified Permissions can use as a source of authenticated identities as entities. It specifies the Amazon Resource Name (ARN) of a Amazon Cognito user pool and one or more application client IDs. Example: "configuration":{"cognitoUserPoolConfiguration":{"userPoolArn":"arn:aws:cognito-idp:us-east-1:123456789012:userpool/us-east-1_1a2b3c4d5","clientIds": ["a1b2c3d4e5f6g7h8i9j0kalbmc"]}} 
     */
    cognitoUserPoolConfiguration?: CognitoUserPoolConfiguration;
  }
  export interface ContextDefinition {
    /**
     * An list of attributes that are needed to successfully evaluate an authorization request. Each attribute in this array must include a map of a data type and its value. Example: "Context":{"&lt;KeyName1&gt;":{"boolean":true},"&lt;KeyName2&gt;":{"long":1234}} 
     */
    contextMap?: ContextMap;
  }
  export type ContextMap = {[key: string]: AttributeValue};
  export interface CreateIdentitySourceInput {
    /**
     * Specifies a unique, case-sensitive ID that you provide to ensure the idempotency of the request. This lets you safely retry the request without accidentally performing the same operation a second time. Passing the same value to a later call to an operation requires that you also pass the same value for all other parameters. We recommend that you use a UUID type of value.. If you don't provide this value, then Amazon Web Services generates a random one for you. If you retry the operation with the same ClientToken, but with different parameters, the retry fails with an IdempotentParameterMismatch error.
     */
    clientToken?: IdempotencyToken;
    /**
     * Specifies the ID of the policy store in which you want to store this identity source. Only policies and requests made using this policy store can reference identities from the identity provider configured in the new identity source.
     */
    policyStoreId: PolicyStoreId;
    /**
     * Specifies the details required to communicate with the identity provider (IdP) associated with this identity source.  At this time, the only valid member of this structure is a Amazon Cognito user pool configuration. You must specify a UserPoolArn, and optionally, a ClientId. 
     */
    configuration: Configuration;
    /**
     * Specifies the namespace and data type of the principals generated for identities authenticated by the new identity source.
     */
    principalEntityType?: PrincipalEntityType;
  }
  export interface CreateIdentitySourceOutput {
    /**
     * The date and time the identity source was originally created.
     */
    createdDate: TimestampFormat;
    /**
     * The unique ID of the new identity source.
     */
    identitySourceId: IdentitySourceId;
    /**
     * The date and time the identity source was most recently updated.
     */
    lastUpdatedDate: TimestampFormat;
    /**
     * The ID of the policy store that contains the identity source.
     */
    policyStoreId: PolicyStoreId;
  }
  export interface CreatePolicyInput {
    /**
     * Specifies a unique, case-sensitive ID that you provide to ensure the idempotency of the request. This lets you safely retry the request without accidentally performing the same operation a second time. Passing the same value to a later call to an operation requires that you also pass the same value for all other parameters. We recommend that you use a UUID type of value.. If you don't provide this value, then Amazon Web Services generates a random one for you. If you retry the operation with the same ClientToken, but with different parameters, the retry fails with an IdempotentParameterMismatch error.
     */
    clientToken?: IdempotencyToken;
    /**
     * Specifies the PolicyStoreId of the policy store you want to store the policy in.
     */
    policyStoreId: PolicyStoreId;
    /**
     * A structure that specifies the policy type and content to use for the new policy. You must include either a static or a templateLinked element. The policy content must be written in the Cedar policy language.
     */
    definition: PolicyDefinition;
  }
  export interface CreatePolicyOutput {
    /**
     * The ID of the policy store that contains the new policy.
     */
    policyStoreId: PolicyStoreId;
    /**
     * The unique ID of the new policy.
     */
    policyId: PolicyId;
    /**
     * The policy type of the new policy.
     */
    policyType: PolicyType;
    /**
     * The principal specified in the new policy's scope. This response element isn't present when principal isn't specified in the policy content.
     */
    principal?: EntityIdentifier;
    /**
     * The resource specified in the new policy's scope. This response element isn't present when the resource isn't specified in the policy content.
     */
    resource?: EntityIdentifier;
    /**
     * The date and time the policy was originally created.
     */
    createdDate: TimestampFormat;
    /**
     * The date and time the policy was last updated.
     */
    lastUpdatedDate: TimestampFormat;
  }
  export interface CreatePolicyStoreInput {
    /**
     * Specifies a unique, case-sensitive ID that you provide to ensure the idempotency of the request. This lets you safely retry the request without accidentally performing the same operation a second time. Passing the same value to a later call to an operation requires that you also pass the same value for all other parameters. We recommend that you use a UUID type of value.. If you don't provide this value, then Amazon Web Services generates a random one for you. If you retry the operation with the same ClientToken, but with different parameters, the retry fails with an IdempotentParameterMismatch error.
     */
    clientToken?: IdempotencyToken;
    /**
     * Specifies the validation setting for this policy store. Currently, the only valid and required value is Mode.  We recommend that you turn on STRICT mode only after you define a schema. If a schema doesn't exist, then STRICT mode causes any policy to fail validation, and Verified Permissions rejects the policy. You can turn off validation by using the UpdatePolicyStore. Then, when you have a schema defined, use UpdatePolicyStore again to turn validation back on. 
     */
    validationSettings: ValidationSettings;
  }
  export interface CreatePolicyStoreOutput {
    /**
     * The unique ID of the new policy store.
     */
    policyStoreId: PolicyStoreId;
    /**
     * The Amazon Resource Name (ARN) of the new policy store.
     */
    arn: ResourceArn;
    /**
     * The date and time the policy store was originally created.
     */
    createdDate: TimestampFormat;
    /**
     * The date and time the policy store was last updated.
     */
    lastUpdatedDate: TimestampFormat;
  }
  export interface CreatePolicyTemplateInput {
    /**
     * Specifies a unique, case-sensitive ID that you provide to ensure the idempotency of the request. This lets you safely retry the request without accidentally performing the same operation a second time. Passing the same value to a later call to an operation requires that you also pass the same value for all other parameters. We recommend that you use a UUID type of value.. If you don't provide this value, then Amazon Web Services generates a random one for you. If you retry the operation with the same ClientToken, but with different parameters, the retry fails with an IdempotentParameterMismatch error.
     */
    clientToken?: IdempotencyToken;
    /**
     * The ID of the policy store in which to create the policy template.
     */
    policyStoreId: PolicyStoreId;
    /**
     * Specifies a description for the policy template.
     */
    description?: PolicyTemplateDescription;
    /**
     * Specifies the content that you want to use for the new policy template, written in the Cedar policy language.
     */
    statement: PolicyStatement;
  }
  export interface CreatePolicyTemplateOutput {
    /**
     * The ID of the policy store that contains the policy template.
     */
    policyStoreId: PolicyStoreId;
    /**
     * The unique ID of the new policy template.
     */
    policyTemplateId: PolicyTemplateId;
    /**
     * The date and time the policy template was originally created.
     */
    createdDate: TimestampFormat;
    /**
     * The date and time the policy template was most recently updated.
     */
    lastUpdatedDate: TimestampFormat;
  }
  export type Decision = "ALLOW"|"DENY"|string;
  export interface DeleteIdentitySourceInput {
    /**
     * Specifies the ID of the policy store that contains the identity source that you want to delete.
     */
    policyStoreId: PolicyStoreId;
    /**
     * Specifies the ID of the identity source that you want to delete.
     */
    identitySourceId: IdentitySourceId;
  }
  export interface DeleteIdentitySourceOutput {
  }
  export interface DeletePolicyInput {
    /**
     * Specifies the ID of the policy store that contains the policy that you want to delete.
     */
    policyStoreId: PolicyStoreId;
    /**
     * Specifies the ID of the policy that you want to delete.
     */
    policyId: PolicyId;
  }
  export interface DeletePolicyOutput {
  }
  export interface DeletePolicyStoreInput {
    /**
     * Specifies the ID of the policy store that you want to delete.
     */
    policyStoreId: PolicyStoreId;
  }
  export interface DeletePolicyStoreOutput {
  }
  export interface DeletePolicyTemplateInput {
    /**
     * Specifies the ID of the policy store that contains the policy template that you want to delete.
     */
    policyStoreId: PolicyStoreId;
    /**
     * Specifies the ID of the policy template that you want to delete.
     */
    policyTemplateId: PolicyTemplateId;
  }
  export interface DeletePolicyTemplateOutput {
  }
  export interface DeterminingPolicyItem {
    /**
     * The Id of a policy that determined to an authorization decision. Example: "policyId":"SPEXAMPLEabcdefg111111" 
     */
    policyId: PolicyId;
  }
  export type DeterminingPolicyList = DeterminingPolicyItem[];
  export type DiscoveryUrl = string;
  export interface EntitiesDefinition {
    /**
     * An array of entities that are needed to successfully evaluate an authorization request. Each entity in this array must include an identifier for the entity, the attributes of the entity, and a list of any parent entities.
     */
    entityList?: EntityList;
  }
  export type EntityAttributes = {[key: string]: AttributeValue};
  export type EntityId = string;
  export interface EntityIdentifier {
    /**
     * The type of an entity. Example: "entityType":"typeName" 
     */
    entityType: EntityType;
    /**
     * The identifier of an entity.  "entityId":"identifier" 
     */
    entityId: EntityId;
  }
  export interface EntityItem {
    /**
     * The identifier of the entity.
     */
    identifier: EntityIdentifier;
    /**
     * A list of attributes for the entity.
     */
    attributes?: EntityAttributes;
    /**
     * The parents in the hierarchy that contains the entity.
     */
    parents?: ParentList;
  }
  export type EntityList = EntityItem[];
  export interface EntityReference {
    /**
     * Used to indicate that a principal or resource is not specified. This can be used to search for policies that are not associated with a specific principal or resource.
     */
    unspecified?: Boolean;
    /**
     * The identifier of the entity. It can consist of either an EntityType and EntityId, a principal, or a resource.
     */
    identifier?: EntityIdentifier;
  }
  export type EntityType = string;
  export interface EvaluationErrorItem {
    /**
     * The error description.
     */
    errorDescription: String;
  }
  export type EvaluationErrorList = EvaluationErrorItem[];
  export interface GetIdentitySourceInput {
    /**
     * Specifies the ID of the policy store that contains the identity source you want information about.
     */
    policyStoreId: PolicyStoreId;
    /**
     * Specifies the ID of the identity source you want information about.
     */
    identitySourceId: IdentitySourceId;
  }
  export interface GetIdentitySourceOutput {
    /**
     * The date and time that the identity source was originally created.
     */
    createdDate: TimestampFormat;
    /**
     * A structure that describes the configuration of the identity source.
     */
    details: IdentitySourceDetails;
    /**
     * The ID of the identity source.
     */
    identitySourceId: IdentitySourceId;
    /**
     * The date and time that the identity source was most recently updated.
     */
    lastUpdatedDate: TimestampFormat;
    /**
     * The ID of the policy store that contains the identity source.
     */
    policyStoreId: PolicyStoreId;
    /**
     * The data type of principals generated for identities authenticated by this identity source.
     */
    principalEntityType: PrincipalEntityType;
  }
  export interface GetPolicyInput {
    /**
     * Specifies the ID of the policy store that contains the policy that you want information about.
     */
    policyStoreId: PolicyStoreId;
    /**
     * Specifies the ID of the policy you want information about.
     */
    policyId: PolicyId;
  }
  export interface GetPolicyOutput {
    /**
     * The ID of the policy store that contains the policy that you want information about.
     */
    policyStoreId: PolicyStoreId;
    /**
     * The unique ID of the policy that you want information about.
     */
    policyId: PolicyId;
    /**
     * The type of the policy.
     */
    policyType: PolicyType;
    /**
     * The principal specified in the policy's scope. This element isn't included in the response when Principal isn't present in the policy content.
     */
    principal?: EntityIdentifier;
    /**
     * The resource specified in the policy's scope. This element isn't included in the response when Resource isn't present in the policy content.
     */
    resource?: EntityIdentifier;
    /**
     * The definition of the requested policy.
     */
    definition: PolicyDefinitionDetail;
    /**
     * The date and time that the policy was originally created.
     */
    createdDate: TimestampFormat;
    /**
     * The date and time that the policy was last updated.
     */
    lastUpdatedDate: TimestampFormat;
  }
  export interface GetPolicyStoreInput {
    /**
     * Specifies the ID of the policy store that you want information about.
     */
    policyStoreId: PolicyStoreId;
  }
  export interface GetPolicyStoreOutput {
    /**
     * The ID of the policy store;
     */
    policyStoreId: PolicyStoreId;
    /**
     * The Amazon Resource Name (ARN) of the policy store.
     */
    arn: ResourceArn;
    /**
     * The current validation settings for the policy store.
     */
    validationSettings: ValidationSettings;
    /**
     * The date and time that the policy store was originally created.
     */
    createdDate: TimestampFormat;
    /**
     * The date and time that the policy store was last updated.
     */
    lastUpdatedDate: TimestampFormat;
  }
  export interface GetPolicyTemplateInput {
    /**
     * Specifies the ID of the policy store that contains the policy template that you want information about.
     */
    policyStoreId: PolicyStoreId;
    /**
     * Specifies the ID of the policy template that you want information about.
     */
    policyTemplateId: PolicyTemplateId;
  }
  export interface GetPolicyTemplateOutput {
    /**
     * The ID of the policy store that contains the policy template.
     */
    policyStoreId: PolicyStoreId;
    /**
     * The ID of the policy template.
     */
    policyTemplateId: PolicyTemplateId;
    /**
     * The description of the policy template.
     */
    description?: PolicyTemplateDescription;
    /**
     * The content of the body of the policy template written in the Cedar policy language.
     */
    statement: PolicyStatement;
    /**
     * The date and time that the policy template was originally created.
     */
    createdDate: TimestampFormat;
    /**
     * The date and time that the policy template was most recently updated.
     */
    lastUpdatedDate: TimestampFormat;
  }
  export interface GetSchemaInput {
    /**
     * Specifies the ID of the policy store that contains the schema.
     */
    policyStoreId: PolicyStoreId;
  }
  export interface GetSchemaOutput {
    /**
     * The ID of the policy store that contains the schema.
     */
    policyStoreId: PolicyStoreId;
    /**
     * The body of the schema, written in Cedar schema JSON.
     */
    schema: SchemaJson;
    /**
     * The date and time that the schema was originally created.
     */
    createdDate: TimestampFormat;
    /**
     * The date and time that the schema was most recently updated.
     */
    lastUpdatedDate: TimestampFormat;
  }
  export type IdempotencyToken = string;
  export interface IdentitySourceDetails {
    /**
     * The application client IDs associated with the specified Amazon Cognito user pool that are enabled for this identity source.
     */
    clientIds?: ClientIds;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Cognito user pool whose identities are accessible to this Verified Permissions policy store.
     */
    userPoolArn?: UserPoolArn;
    /**
     * The well-known URL that points to this user pool's OIDC discovery endpoint. This is a URL string in the following format. This URL replaces the placeholders for both the Amazon Web Services Region and the user pool identifier with those appropriate for this user pool.  https://cognito-idp.&lt;region&gt;.amazonaws.com/&lt;user-pool-id&gt;/.well-known/openid-configuration 
     */
    discoveryUrl?: DiscoveryUrl;
    /**
     * A string that identifies the type of OIDC service represented by this identity source.  At this time, the only valid value is cognito.
     */
    openIdIssuer?: OpenIdIssuer;
  }
  export interface IdentitySourceFilter {
    /**
     * The Cedar entity type of the principals returned by the identity provider (IdP) associated with this identity source.
     */
    principalEntityType?: PrincipalEntityType;
  }
  export type IdentitySourceFilters = IdentitySourceFilter[];
  export type IdentitySourceId = string;
  export interface IdentitySourceItem {
    /**
     * The date and time the identity source was originally created.
     */
    createdDate: TimestampFormat;
    /**
     * A structure that contains the details of the associated identity provider (IdP).
     */
    details: IdentitySourceItemDetails;
    /**
     * The unique identifier of the identity source.
     */
    identitySourceId: IdentitySourceId;
    /**
     * The date and time the identity source was most recently updated.
     */
    lastUpdatedDate: TimestampFormat;
    /**
     * The identifier of the policy store that contains the identity source.
     */
    policyStoreId: PolicyStoreId;
    /**
     * The Cedar entity type of the principals returned from the IdP associated with this identity source.
     */
    principalEntityType: PrincipalEntityType;
  }
  export interface IdentitySourceItemDetails {
    /**
     * The application client IDs associated with the specified Amazon Cognito user pool that are enabled for this identity source.
     */
    clientIds?: ClientIds;
    /**
     * The Amazon Cognito user pool whose identities are accessible to this Verified Permissions policy store.
     */
    userPoolArn?: UserPoolArn;
    /**
     * The well-known URL that points to this user pool's OIDC discovery endpoint. This is a URL string in the following format. This URL replaces the placeholders for both the Amazon Web Services Region and the user pool identifier with those appropriate for this user pool.  https://cognito-idp.&lt;region&gt;.amazonaws.com/&lt;user-pool-id&gt;/.well-known/openid-configuration 
     */
    discoveryUrl?: DiscoveryUrl;
    /**
     * A string that identifies the type of OIDC service represented by this identity source.  At this time, the only valid value is cognito.
     */
    openIdIssuer?: OpenIdIssuer;
  }
  export type IdentitySources = IdentitySourceItem[];
  export interface IsAuthorizedInput {
    /**
     * Specifies the ID of the policy store. Policies in this policy store will be used to make an authorization decision for the input.
     */
    policyStoreId: PolicyStoreId;
    /**
     * Specifies the principal for which the authorization decision is to be made.
     */
    principal?: EntityIdentifier;
    /**
     * Specifies the requested action to be authorized. For example, is the principal authorized to perform this action on the resource?
     */
    action?: ActionIdentifier;
    /**
     * Specifies the resource for which the authorization decision is to be made.
     */
    resource?: EntityIdentifier;
    /**
     * Specifies additional context that can be used to make more granular authorization decisions.
     */
    context?: ContextDefinition;
    /**
     * Specifies the list of resources and principals and their associated attributes that Verified Permissions can examine when evaluating the policies.   You can include only principal and resource entities in this parameter; you can't include actions. You must specify actions in the schema. 
     */
    entities?: EntitiesDefinition;
  }
  export interface IsAuthorizedOutput {
    /**
     * An authorization decision that indicates if the authorization request should be allowed or denied.
     */
    decision: Decision;
    /**
     * The list of determining policies used to make the authorization decision. For example, if there are two matching policies, where one is a forbid and the other is a permit, then the forbid policy will be the determining policy. In the case of multiple matching permit policies then there would be multiple determining policies. In the case that no policies match, and hence the response is DENY, there would be no determining policies.
     */
    determiningPolicies: DeterminingPolicyList;
    /**
     * Errors that occurred while making an authorization decision, for example, a policy references an Entity or entity Attribute that does not exist in the slice.
     */
    errors: EvaluationErrorList;
  }
  export interface IsAuthorizedWithTokenInput {
    /**
     * Specifies the ID of the policy store. Policies in this policy store will be used to make an authorization decision for the input.
     */
    policyStoreId: PolicyStoreId;
    /**
     * Specifies an identity token for the principal to be authorized. This token is provided to you by the identity provider (IdP) associated with the specified identity source. You must specify either an AccessToken or an IdentityToken, or both.
     */
    identityToken?: Token;
    /**
     * Specifies an access token for the principal to be authorized. This token is provided to you by the identity provider (IdP) associated with the specified identity source. You must specify either an AccessToken, or an IdentityToken, or both.
     */
    accessToken?: Token;
    /**
     * Specifies the requested action to be authorized. Is the specified principal authorized to perform this action on the specified resource.
     */
    action?: ActionIdentifier;
    /**
     * Specifies the resource for which the authorization decision is made. For example, is the principal allowed to perform the action on the resource?
     */
    resource?: EntityIdentifier;
    /**
     * Specifies additional context that can be used to make more granular authorization decisions.
     */
    context?: ContextDefinition;
    /**
     * Specifies the list of resources and their associated attributes that Verified Permissions can examine when evaluating the policies.   You can include only resource and action entities in this parameter; you can't include principals.   The IsAuthorizedWithToken operation takes principal attributes from  only  the identityToken or accessToken passed to the operation.   For action entities, you can include only their Identifier and EntityType.    
     */
    entities?: EntitiesDefinition;
  }
  export interface IsAuthorizedWithTokenOutput {
    /**
     * An authorization decision that indicates if the authorization request should be allowed or denied.
     */
    decision: Decision;
    /**
     * The list of determining policies used to make the authorization decision. For example, if there are multiple matching policies, where at least one is a forbid policy, then because forbid always overrides permit the forbid policies are the determining policies. If all matching policies are permit policies, then those policies are the determining policies. When no policies match and the response is the default DENY, there are no determining policies.
     */
    determiningPolicies: DeterminingPolicyList;
    /**
     * Errors that occurred while making an authorization decision. For example, a policy references an entity or entity attribute that does not exist in the slice.
     */
    errors: EvaluationErrorList;
  }
  export interface ListIdentitySourcesInput {
    /**
     * Specifies the ID of the policy store that contains the identity sources that you want to list.
     */
    policyStoreId: PolicyStoreId;
    /**
     * Specifies that you want to receive the next page of results. Valid only if you received a NextToken response in the previous request. If you did, it indicates that more output is available. Set this parameter to the value provided by the previous call's NextToken response to request the next page of results.
     */
    nextToken?: NextToken;
    /**
     * Specifies the total number of results that you want included in each response. If additional items exist beyond the number you specify, the NextToken response element is returned with a value (not null). Include the specified value as the NextToken request parameter in the next call to the operation to get the next set of results. Note that the service might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results. If you do not specify this parameter, the operation defaults to 10 identity sources per response. You can specify a maximum of 200 identity sources per response.
     */
    maxResults?: ListIdentitySourcesMaxResults;
    /**
     * Specifies characteristics of an identity source that you can use to limit the output to matching identity sources.
     */
    filters?: IdentitySourceFilters;
  }
  export type ListIdentitySourcesMaxResults = number;
  export interface ListIdentitySourcesOutput {
    /**
     * If present, this value indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null. This indicates that this is the last page of results.
     */
    nextToken?: NextToken;
    /**
     * The list of identity sources stored in the specified policy store.
     */
    identitySources: IdentitySources;
  }
  export interface ListPoliciesInput {
    /**
     * Specifies the ID of the policy store you want to list policies from.
     */
    policyStoreId: PolicyStoreId;
    /**
     * Specifies that you want to receive the next page of results. Valid only if you received a NextToken response in the previous request. If you did, it indicates that more output is available. Set this parameter to the value provided by the previous call's NextToken response to request the next page of results.
     */
    nextToken?: NextToken;
    /**
     * Specifies the total number of results that you want included in each response. If additional items exist beyond the number you specify, the NextToken response element is returned with a value (not null). Include the specified value as the NextToken request parameter in the next call to the operation to get the next set of results. Note that the service might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results. If you do not specify this parameter, the operation defaults to 10 policies per response. You can specify a maximum of 50 policies per response.
     */
    maxResults?: MaxResults;
    /**
     * Specifies a filter that limits the response to only policies that match the specified criteria. For example, you list only the policies that reference a specified principal.
     */
    filter?: PolicyFilter;
  }
  export interface ListPoliciesOutput {
    /**
     * If present, this value indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null. This indicates that this is the last page of results.
     */
    nextToken?: NextToken;
    /**
     * Lists all policies that are available in the specified policy store.
     */
    policies: PolicyList;
  }
  export interface ListPolicyStoresInput {
    /**
     * Specifies that you want to receive the next page of results. Valid only if you received a NextToken response in the previous request. If you did, it indicates that more output is available. Set this parameter to the value provided by the previous call's NextToken response to request the next page of results.
     */
    nextToken?: NextToken;
    /**
     * Specifies the total number of results that you want included in each response. If additional items exist beyond the number you specify, the NextToken response element is returned with a value (not null). Include the specified value as the NextToken request parameter in the next call to the operation to get the next set of results. Note that the service might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results. If you do not specify this parameter, the operation defaults to 10 policy stores per response. You can specify a maximum of 50 policy stores per response.
     */
    maxResults?: MaxResults;
  }
  export interface ListPolicyStoresOutput {
    /**
     * If present, this value indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null. This indicates that this is the last page of results.
     */
    nextToken?: NextToken;
    /**
     * The list of policy stores in the account.
     */
    policyStores: PolicyStoreList;
  }
  export interface ListPolicyTemplatesInput {
    /**
     * Specifies the ID of the policy store that contains the policy templates you want to list.
     */
    policyStoreId: PolicyStoreId;
    /**
     * Specifies that you want to receive the next page of results. Valid only if you received a NextToken response in the previous request. If you did, it indicates that more output is available. Set this parameter to the value provided by the previous call's NextToken response to request the next page of results.
     */
    nextToken?: NextToken;
    /**
     * Specifies the total number of results that you want included in each response. If additional items exist beyond the number you specify, the NextToken response element is returned with a value (not null). Include the specified value as the NextToken request parameter in the next call to the operation to get the next set of results. Note that the service might return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results. If you do not specify this parameter, the operation defaults to 10 policy templates per response. You can specify a maximum of 50 policy templates per response.
     */
    maxResults?: MaxResults;
  }
  export interface ListPolicyTemplatesOutput {
    /**
     * If present, this value indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null. This indicates that this is the last page of results.
     */
    nextToken?: NextToken;
    /**
     * The list of the policy templates in the specified policy store.
     */
    policyTemplates: PolicyTemplatesList;
  }
  export type LongAttribute = number;
  export type MaxResults = number;
  export type Namespace = string;
  export type NamespaceList = Namespace[];
  export type NextToken = string;
  export type OpenIdIssuer = "COGNITO"|string;
  export type ParentList = EntityIdentifier[];
  export interface PolicyDefinition {
    /**
     * A structure that describes a static policy. An static policy doesn't use a template or allow placeholders for entities.
     */
    static?: StaticPolicyDefinition;
    /**
     * A structure that describes a policy that was instantiated from a template. The template can specify placeholders for principal and resource. When you use CreatePolicy to create a policy from a template, you specify the exact principal and resource to use for the instantiated policy.
     */
    templateLinked?: TemplateLinkedPolicyDefinition;
  }
  export interface PolicyDefinitionDetail {
    /**
     * Information about a static policy that wasn't created with a policy template.
     */
    static?: StaticPolicyDefinitionDetail;
    /**
     * Information about a template-linked policy that was created by instantiating a policy template.
     */
    templateLinked?: TemplateLinkedPolicyDefinitionDetail;
  }
  export interface PolicyDefinitionItem {
    /**
     * Information about a static policy that wasn't created with a policy template.
     */
    static?: StaticPolicyDefinitionItem;
    /**
     * Information about a template-linked policy that was created by instantiating a policy template.
     */
    templateLinked?: TemplateLinkedPolicyDefinitionItem;
  }
  export interface PolicyFilter {
    /**
     * Filters the output to only policies that reference the specified principal.
     */
    principal?: EntityReference;
    /**
     * Filters the output to only policies that reference the specified resource.
     */
    resource?: EntityReference;
    /**
     * Filters the output to only policies of the specified type.
     */
    policyType?: PolicyType;
    /**
     * Filters the output to only template-linked policies that were instantiated from the specified policy template.
     */
    policyTemplateId?: PolicyTemplateId;
  }
  export type PolicyId = string;
  export interface PolicyItem {
    /**
     * The identifier of the PolicyStore where the policy you want information about is stored.
     */
    policyStoreId: PolicyStoreId;
    /**
     * The identifier of the policy you want information about.
     */
    policyId: PolicyId;
    /**
     * The type of the policy. This is one of the following values:    static     templateLinked   
     */
    policyType: PolicyType;
    /**
     * The principal associated with the policy.
     */
    principal?: EntityIdentifier;
    /**
     * The resource associated with the policy.
     */
    resource?: EntityIdentifier;
    /**
     * The policy definition of an item in the list of policies returned.
     */
    definition: PolicyDefinitionItem;
    /**
     * The date and time the policy was created.
     */
    createdDate: TimestampFormat;
    /**
     * The date and time the policy was most recently updated.
     */
    lastUpdatedDate: TimestampFormat;
  }
  export type PolicyList = PolicyItem[];
  export type PolicyStatement = string;
  export type PolicyStoreId = string;
  export interface PolicyStoreItem {
    /**
     * The unique identifier of the policy store.
     */
    policyStoreId: PolicyStoreId;
    /**
     * The Amazon Resource Name (ARN) of the policy store.
     */
    arn: ResourceArn;
    /**
     * The date and time the policy was created.
     */
    createdDate: TimestampFormat;
  }
  export type PolicyStoreList = PolicyStoreItem[];
  export type PolicyTemplateDescription = string;
  export type PolicyTemplateId = string;
  export interface PolicyTemplateItem {
    /**
     * The unique identifier of the policy store that contains the template.
     */
    policyStoreId: PolicyStoreId;
    /**
     * The unique identifier of the policy template.
     */
    policyTemplateId: PolicyTemplateId;
    /**
     * The description attached to the policy template.
     */
    description?: PolicyTemplateDescription;
    /**
     * The date and time that the policy template was created.
     */
    createdDate: TimestampFormat;
    /**
     * The date and time that the policy template was most recently updated.
     */
    lastUpdatedDate: TimestampFormat;
  }
  export type PolicyTemplatesList = PolicyTemplateItem[];
  export type PolicyType = "STATIC"|"TEMPLATE_LINKED"|string;
  export type PrincipalEntityType = string;
  export interface PutSchemaInput {
    /**
     * Specifies the ID of the policy store in which to place the schema.
     */
    policyStoreId: PolicyStoreId;
    /**
     * Specifies the definition of the schema to be stored. The schema definition must be written in Cedar schema JSON.
     */
    definition: SchemaDefinition;
  }
  export interface PutSchemaOutput {
    /**
     * The unique ID of the policy store that contains the schema.
     */
    policyStoreId: PolicyStoreId;
    /**
     * Identifies the namespaces of the entities referenced by this schema.
     */
    namespaces: NamespaceList;
    /**
     * The date and time that the schema was originally created.
     */
    createdDate: TimestampFormat;
    /**
     * The date and time that the schema was last updated.
     */
    lastUpdatedDate: TimestampFormat;
  }
  export type RecordAttribute = {[key: string]: AttributeValue};
  export type ResourceArn = string;
  export interface SchemaDefinition {
    /**
     * A JSON string representation of the schema supported by applications that use this policy store. For more information, see Policy store schema in the Amazon Verified Permissions User Guide.
     */
    cedarJson?: SchemaJson;
  }
  export type SchemaJson = string;
  export type SetAttribute = AttributeValue[];
  export interface StaticPolicyDefinition {
    /**
     * The description of the static policy.
     */
    description?: StaticPolicyDescription;
    /**
     * The policy content of the static policy, written in the Cedar policy language.
     */
    statement: PolicyStatement;
  }
  export interface StaticPolicyDefinitionDetail {
    /**
     * A description of the static policy.
     */
    description?: StaticPolicyDescription;
    /**
     * The content of the static policy written in the Cedar policy language.
     */
    statement: PolicyStatement;
  }
  export interface StaticPolicyDefinitionItem {
    /**
     * A description of the static policy.
     */
    description?: StaticPolicyDescription;
  }
  export type StaticPolicyDescription = string;
  export type String = string;
  export type StringAttribute = string;
  export interface TemplateLinkedPolicyDefinition {
    /**
     * The unique identifier of the policy template used to create this policy.
     */
    policyTemplateId: PolicyTemplateId;
    /**
     * The principal associated with this template-linked policy. Verified Permissions substitutes this principal for the ?principal placeholder in the policy template when it evaluates an authorization request.
     */
    principal?: EntityIdentifier;
    /**
     * The resource associated with this template-linked policy. Verified Permissions substitutes this resource for the ?resource placeholder in the policy template when it evaluates an authorization request.
     */
    resource?: EntityIdentifier;
  }
  export interface TemplateLinkedPolicyDefinitionDetail {
    /**
     * The unique identifier of the policy template used to create this policy.
     */
    policyTemplateId: PolicyTemplateId;
    /**
     * The principal associated with this template-linked policy. Verified Permissions substitutes this principal for the ?principal placeholder in the policy template when it evaluates an authorization request.
     */
    principal?: EntityIdentifier;
    /**
     * The resource associated with this template-linked policy. Verified Permissions substitutes this resource for the ?resource placeholder in the policy template when it evaluates an authorization request.
     */
    resource?: EntityIdentifier;
  }
  export interface TemplateLinkedPolicyDefinitionItem {
    /**
     * The unique identifier of the policy template used to create this policy.
     */
    policyTemplateId: PolicyTemplateId;
    /**
     * The principal associated with this template-linked policy. Verified Permissions substitutes this principal for the ?principal placeholder in the policy template when it evaluates an authorization request.
     */
    principal?: EntityIdentifier;
    /**
     * The resource associated with this template-linked policy. Verified Permissions substitutes this resource for the ?resource placeholder in the policy template when it evaluates an authorization request.
     */
    resource?: EntityIdentifier;
  }
  export type TimestampFormat = Date;
  export type Token = string;
  export interface UpdateCognitoUserPoolConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Cognito user pool associated with this identity source.
     */
    userPoolArn: UserPoolArn;
    /**
     * The client ID of an app client that is configured for the specified Amazon Cognito user pool.
     */
    clientIds?: ClientIds;
  }
  export interface UpdateConfiguration {
    /**
     * Contains configuration details of a Amazon Cognito user pool.
     */
    cognitoUserPoolConfiguration?: UpdateCognitoUserPoolConfiguration;
  }
  export interface UpdateIdentitySourceInput {
    /**
     * Specifies the ID of the policy store that contains the identity source that you want to update.
     */
    policyStoreId: PolicyStoreId;
    /**
     * Specifies the ID of the identity source that you want to update.
     */
    identitySourceId: IdentitySourceId;
    /**
     * Specifies the details required to communicate with the identity provider (IdP) associated with this identity source.  At this time, the only valid member of this structure is a Amazon Cognito user pool configuration. You must specify a userPoolArn, and optionally, a ClientId. 
     */
    updateConfiguration: UpdateConfiguration;
    /**
     * Specifies the data type of principals generated for identities authenticated by the identity source.
     */
    principalEntityType?: PrincipalEntityType;
  }
  export interface UpdateIdentitySourceOutput {
    /**
     * The date and time that the updated identity source was originally created.
     */
    createdDate: TimestampFormat;
    /**
     * The ID of the updated identity source.
     */
    identitySourceId: IdentitySourceId;
    /**
     * The date and time that the identity source was most recently updated.
     */
    lastUpdatedDate: TimestampFormat;
    /**
     * The ID of the policy store that contains the updated identity source.
     */
    policyStoreId: PolicyStoreId;
  }
  export interface UpdatePolicyDefinition {
    /**
     * Contains details about the updates to be applied to a static policy.
     */
    static?: UpdateStaticPolicyDefinition;
  }
  export interface UpdatePolicyInput {
    /**
     * Specifies the ID of the policy store that contains the policy that you want to update.
     */
    policyStoreId: PolicyStoreId;
    /**
     * Specifies the ID of the policy that you want to update. To find this value, you can use ListPolicies.
     */
    policyId: PolicyId;
    /**
     * Specifies the updated policy content that you want to replace on the specified policy. The content must be valid Cedar policy language text. You can change only the following elements from the policy definition:   The action referenced by the policy.   Any conditional clauses, such as when or unless clauses.   You can't change the following elements:   Changing from static to templateLinked.   Changing the effect of the policy from permit or forbid.   The principal referenced by the policy.   The resource referenced by the policy.  
     */
    definition: UpdatePolicyDefinition;
  }
  export interface UpdatePolicyOutput {
    /**
     * The ID of the policy store that contains the policy that was updated.
     */
    policyStoreId: PolicyStoreId;
    /**
     * The ID of the policy that was updated.
     */
    policyId: PolicyId;
    /**
     * The type of the policy that was updated.
     */
    policyType: PolicyType;
    /**
     * The principal specified in the policy's scope. This element isn't included in the response when Principal isn't present in the policy content.
     */
    principal?: EntityIdentifier;
    /**
     * The resource specified in the policy's scope. This element isn't included in the response when Resource isn't present in the policy content.
     */
    resource?: EntityIdentifier;
    /**
     * The date and time that the policy was originally created.
     */
    createdDate: TimestampFormat;
    /**
     * The date and time that the policy was most recently updated.
     */
    lastUpdatedDate: TimestampFormat;
  }
  export interface UpdatePolicyStoreInput {
    /**
     * Specifies the ID of the policy store that you want to update
     */
    policyStoreId: PolicyStoreId;
    /**
     * A structure that defines the validation settings that want to enable for the policy store.
     */
    validationSettings: ValidationSettings;
  }
  export interface UpdatePolicyStoreOutput {
    /**
     * The ID of the updated policy store.
     */
    policyStoreId: PolicyStoreId;
    /**
     * The Amazon Resource Name (ARN) of the updated policy store.
     */
    arn: ResourceArn;
    /**
     * The date and time that the policy store was originally created.
     */
    createdDate: TimestampFormat;
    /**
     * The date and time that the policy store was most recently updated.
     */
    lastUpdatedDate: TimestampFormat;
  }
  export interface UpdatePolicyTemplateInput {
    /**
     * Specifies the ID of the policy store that contains the policy template that you want to update.
     */
    policyStoreId: PolicyStoreId;
    /**
     * Specifies the ID of the policy template that you want to update.
     */
    policyTemplateId: PolicyTemplateId;
    /**
     * Specifies a new description to apply to the policy template.
     */
    description?: PolicyTemplateDescription;
    /**
     * Specifies new statement content written in Cedar policy language to replace the current body of the policy template. You can change only the following elements of the policy body:   The action referenced by the policy template.   Any conditional clauses, such as when or unless clauses.   You can't change the following elements:   The effect (permit or forbid) of the policy template.   The principal referenced by the policy template.   The resource referenced by the policy template.  
     */
    statement: PolicyStatement;
  }
  export interface UpdatePolicyTemplateOutput {
    /**
     * The ID of the policy store that contains the updated policy template.
     */
    policyStoreId: PolicyStoreId;
    /**
     * The ID of the updated policy template.
     */
    policyTemplateId: PolicyTemplateId;
    /**
     * The date and time that the policy template was originally created.
     */
    createdDate: TimestampFormat;
    /**
     * The date and time that the policy template was most recently updated.
     */
    lastUpdatedDate: TimestampFormat;
  }
  export interface UpdateStaticPolicyDefinition {
    /**
     * Specifies the description to be added to or replaced on the static policy.
     */
    description?: StaticPolicyDescription;
    /**
     * Specifies the Cedar policy language text to be added to or replaced on the static policy.  You can change only the following elements from the original content:   The action referenced by the policy.   Any conditional clauses, such as when or unless clauses.   You can't change the following elements:   Changing from StaticPolicy to TemplateLinkedPolicy.   The effect (permit or forbid) of the policy.   The principal referenced by the policy.   The resource referenced by the policy.   
     */
    statement: PolicyStatement;
  }
  export type UserPoolArn = string;
  export type ValidationMode = "OFF"|"STRICT"|string;
  export interface ValidationSettings {
    /**
     * The validation mode currently configured for this policy store. The valid values are:    OFF – Neither Verified Permissions nor Cedar perform any validation on policies. No validation errors are reported by either service.    STRICT – Requires a schema to be present in the policy store. Cedar performs validation on all submitted new or updated static policies and policy templates. Any that fail validation are rejected and Cedar doesn't store them in the policy store.    If Mode=STRICT and the policy store doesn't contain a schema, Verified Permissions rejects all static policies and policy templates because there is no schema to validate against.  To submit a static policy or policy template without a schema, you must turn off validation. 
     */
    mode: ValidationMode;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-12-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the VerifiedPermissions client.
   */
  export import Types = VerifiedPermissions;
}
export = VerifiedPermissions;
