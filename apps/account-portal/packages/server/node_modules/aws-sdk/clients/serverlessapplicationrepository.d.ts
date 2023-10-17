import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ServerlessApplicationRepository extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ServerlessApplicationRepository.Types.ClientConfiguration)
  config: Config & ServerlessApplicationRepository.Types.ClientConfiguration;
  /**
   * Creates an application, optionally including an AWS SAM file to create the first application version in the same call.
   */
  createApplication(params: ServerlessApplicationRepository.Types.CreateApplicationRequest, callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.CreateApplicationResponse) => void): Request<ServerlessApplicationRepository.Types.CreateApplicationResponse, AWSError>;
  /**
   * Creates an application, optionally including an AWS SAM file to create the first application version in the same call.
   */
  createApplication(callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.CreateApplicationResponse) => void): Request<ServerlessApplicationRepository.Types.CreateApplicationResponse, AWSError>;
  /**
   * Creates an application version.
   */
  createApplicationVersion(params: ServerlessApplicationRepository.Types.CreateApplicationVersionRequest, callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.CreateApplicationVersionResponse) => void): Request<ServerlessApplicationRepository.Types.CreateApplicationVersionResponse, AWSError>;
  /**
   * Creates an application version.
   */
  createApplicationVersion(callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.CreateApplicationVersionResponse) => void): Request<ServerlessApplicationRepository.Types.CreateApplicationVersionResponse, AWSError>;
  /**
   * Creates an AWS CloudFormation change set for the given application.
   */
  createCloudFormationChangeSet(params: ServerlessApplicationRepository.Types.CreateCloudFormationChangeSetRequest, callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.CreateCloudFormationChangeSetResponse) => void): Request<ServerlessApplicationRepository.Types.CreateCloudFormationChangeSetResponse, AWSError>;
  /**
   * Creates an AWS CloudFormation change set for the given application.
   */
  createCloudFormationChangeSet(callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.CreateCloudFormationChangeSetResponse) => void): Request<ServerlessApplicationRepository.Types.CreateCloudFormationChangeSetResponse, AWSError>;
  /**
   * Creates an AWS CloudFormation template.
   */
  createCloudFormationTemplate(params: ServerlessApplicationRepository.Types.CreateCloudFormationTemplateRequest, callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.CreateCloudFormationTemplateResponse) => void): Request<ServerlessApplicationRepository.Types.CreateCloudFormationTemplateResponse, AWSError>;
  /**
   * Creates an AWS CloudFormation template.
   */
  createCloudFormationTemplate(callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.CreateCloudFormationTemplateResponse) => void): Request<ServerlessApplicationRepository.Types.CreateCloudFormationTemplateResponse, AWSError>;
  /**
   * Deletes the specified application.
   */
  deleteApplication(params: ServerlessApplicationRepository.Types.DeleteApplicationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified application.
   */
  deleteApplication(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets the specified application.
   */
  getApplication(params: ServerlessApplicationRepository.Types.GetApplicationRequest, callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.GetApplicationResponse) => void): Request<ServerlessApplicationRepository.Types.GetApplicationResponse, AWSError>;
  /**
   * Gets the specified application.
   */
  getApplication(callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.GetApplicationResponse) => void): Request<ServerlessApplicationRepository.Types.GetApplicationResponse, AWSError>;
  /**
   * Retrieves the policy for the application.
   */
  getApplicationPolicy(params: ServerlessApplicationRepository.Types.GetApplicationPolicyRequest, callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.GetApplicationPolicyResponse) => void): Request<ServerlessApplicationRepository.Types.GetApplicationPolicyResponse, AWSError>;
  /**
   * Retrieves the policy for the application.
   */
  getApplicationPolicy(callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.GetApplicationPolicyResponse) => void): Request<ServerlessApplicationRepository.Types.GetApplicationPolicyResponse, AWSError>;
  /**
   * Gets the specified AWS CloudFormation template.
   */
  getCloudFormationTemplate(params: ServerlessApplicationRepository.Types.GetCloudFormationTemplateRequest, callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.GetCloudFormationTemplateResponse) => void): Request<ServerlessApplicationRepository.Types.GetCloudFormationTemplateResponse, AWSError>;
  /**
   * Gets the specified AWS CloudFormation template.
   */
  getCloudFormationTemplate(callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.GetCloudFormationTemplateResponse) => void): Request<ServerlessApplicationRepository.Types.GetCloudFormationTemplateResponse, AWSError>;
  /**
   * Retrieves the list of applications nested in the containing application.
   */
  listApplicationDependencies(params: ServerlessApplicationRepository.Types.ListApplicationDependenciesRequest, callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.ListApplicationDependenciesResponse) => void): Request<ServerlessApplicationRepository.Types.ListApplicationDependenciesResponse, AWSError>;
  /**
   * Retrieves the list of applications nested in the containing application.
   */
  listApplicationDependencies(callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.ListApplicationDependenciesResponse) => void): Request<ServerlessApplicationRepository.Types.ListApplicationDependenciesResponse, AWSError>;
  /**
   * Lists versions for the specified application.
   */
  listApplicationVersions(params: ServerlessApplicationRepository.Types.ListApplicationVersionsRequest, callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.ListApplicationVersionsResponse) => void): Request<ServerlessApplicationRepository.Types.ListApplicationVersionsResponse, AWSError>;
  /**
   * Lists versions for the specified application.
   */
  listApplicationVersions(callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.ListApplicationVersionsResponse) => void): Request<ServerlessApplicationRepository.Types.ListApplicationVersionsResponse, AWSError>;
  /**
   * Lists applications owned by the requester.
   */
  listApplications(params: ServerlessApplicationRepository.Types.ListApplicationsRequest, callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.ListApplicationsResponse) => void): Request<ServerlessApplicationRepository.Types.ListApplicationsResponse, AWSError>;
  /**
   * Lists applications owned by the requester.
   */
  listApplications(callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.ListApplicationsResponse) => void): Request<ServerlessApplicationRepository.Types.ListApplicationsResponse, AWSError>;
  /**
   * Sets the permission policy for an application. For the list of actions supported for this operation, see
 Application 
 Permissions
 .
   */
  putApplicationPolicy(params: ServerlessApplicationRepository.Types.PutApplicationPolicyRequest, callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.PutApplicationPolicyResponse) => void): Request<ServerlessApplicationRepository.Types.PutApplicationPolicyResponse, AWSError>;
  /**
   * Sets the permission policy for an application. For the list of actions supported for this operation, see
 Application 
 Permissions
 .
   */
  putApplicationPolicy(callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.PutApplicationPolicyResponse) => void): Request<ServerlessApplicationRepository.Types.PutApplicationPolicyResponse, AWSError>;
  /**
   * Unshares an application from an AWS Organization.This operation can be called only from the organization's master account.
   */
  unshareApplication(params: ServerlessApplicationRepository.Types.UnshareApplicationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Unshares an application from an AWS Organization.This operation can be called only from the organization's master account.
   */
  unshareApplication(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the specified application.
   */
  updateApplication(params: ServerlessApplicationRepository.Types.UpdateApplicationRequest, callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.UpdateApplicationResponse) => void): Request<ServerlessApplicationRepository.Types.UpdateApplicationResponse, AWSError>;
  /**
   * Updates the specified application.
   */
  updateApplication(callback?: (err: AWSError, data: ServerlessApplicationRepository.Types.UpdateApplicationResponse) => void): Request<ServerlessApplicationRepository.Types.UpdateApplicationResponse, AWSError>;
}
declare namespace ServerlessApplicationRepository {
  export interface ApplicationDependencySummary {
    /**
     * The Amazon Resource Name (ARN) of the nested application.
     */
    ApplicationId: __string;
    /**
     * The semantic version of the nested application.
     */
    SemanticVersion: __string;
  }
  export interface ApplicationPolicyStatement {
    /**
     * For the list of actions supported for this operation, see Application 
 Permissions.
     */
    Actions: __listOf__string;
    /**
     * An array of PrinciplalOrgIDs, which corresponds to AWS IAM aws:PrincipalOrgID global condition key.
     */
    PrincipalOrgIDs?: __listOf__string;
    /**
     * An array of AWS account IDs, or * to make the application public.
     */
    Principals: __listOf__string;
    /**
     * A unique ID for the statement.
     */
    StatementId?: __string;
  }
  export interface ApplicationSummary {
    /**
     * The application Amazon Resource Name (ARN).
     */
    ApplicationId: __string;
    /**
     * The name of the author publishing the app.Minimum length=1. Maximum length=127.Pattern "^[a-z0-9](([a-z0-9]|-(?!-))*[a-z0-9])?$";
     */
    Author: __string;
    /**
     * The date and time this resource was created.
     */
    CreationTime?: __string;
    /**
     * The description of the application.Minimum length=1. Maximum length=256
     */
    Description: __string;
    /**
     * A URL with more information about the application, for example the location of your GitHub repository for the application.
     */
    HomePageUrl?: __string;
    /**
     * Labels to improve discovery of apps in search results.Minimum length=1. Maximum length=127. Maximum number of labels: 10Pattern: "^[a-zA-Z0-9+\\-_:\\/@]+$";
     */
    Labels?: __listOf__string;
    /**
     * The name of the application.Minimum length=1. Maximum length=140Pattern: "[a-zA-Z0-9\\-]+";
     */
    Name: __string;
    /**
     * A valid identifier from https://spdx.org/licenses/.
     */
    SpdxLicenseId?: __string;
  }
  export type Capability = "CAPABILITY_IAM"|"CAPABILITY_NAMED_IAM"|"CAPABILITY_AUTO_EXPAND"|"CAPABILITY_RESOURCE_POLICY"|string;
  export interface CreateApplicationRequest {
    /**
     * The name of the author publishing the app.Minimum length=1. Maximum length=127.Pattern "^[a-z0-9](([a-z0-9]|-(?!-))*[a-z0-9])?$";
     */
    Author: __string;
    /**
     * The description of the application.Minimum length=1. Maximum length=256
     */
    Description: __string;
    /**
     * A URL with more information about the application, for example the location of your GitHub repository for the application.
     */
    HomePageUrl?: __string;
    /**
     * Labels to improve discovery of apps in search results.Minimum length=1. Maximum length=127. Maximum number of labels: 10Pattern: "^[a-zA-Z0-9+\\-_:\\/@]+$";
     */
    Labels?: __listOf__string;
    /**
     * A local text file that contains the license of the app that matches the spdxLicenseID value of your application.
 The file has the format file://&lt;path>/&lt;filename>.Maximum size 5 MBYou can specify only one of licenseBody and licenseUrl; otherwise, an error results.
     */
    LicenseBody?: __string;
    /**
     * A link to the S3 object that contains the license of the app that matches the spdxLicenseID value of your application.Maximum size 5 MBYou can specify only one of licenseBody and licenseUrl; otherwise, an error results.
     */
    LicenseUrl?: __string;
    /**
     * The name of the application that you want to publish.Minimum length=1. Maximum length=140Pattern: "[a-zA-Z0-9\\-]+";
     */
    Name: __string;
    /**
     * A local text readme file in Markdown language that contains a more detailed description of the application and how it works.
 The file has the format file://&lt;path>/&lt;filename>.Maximum size 5 MBYou can specify only one of readmeBody and readmeUrl; otherwise, an error results.
     */
    ReadmeBody?: __string;
    /**
     * A link to the S3 object in Markdown language that contains a more detailed description of the application and how it works.Maximum size 5 MBYou can specify only one of readmeBody and readmeUrl; otherwise, an error results.
     */
    ReadmeUrl?: __string;
    /**
     * The semantic version of the application:
 https://semver.org/
 
     */
    SemanticVersion?: __string;
    /**
     * A link to the S3 object that contains the ZIP archive of the source code for this version of your application.Maximum size 50 MB
     */
    SourceCodeArchiveUrl?: __string;
    /**
     * A link to a public repository for the source code of your application, for example the URL of a specific GitHub commit.
     */
    SourceCodeUrl?: __string;
    /**
     * A valid identifier from https://spdx.org/licenses/.
     */
    SpdxLicenseId?: __string;
    /**
     * The local raw packaged AWS SAM template file of your application.
 The file has the format file://&lt;path>/&lt;filename>.You can specify only one of templateBody and templateUrl; otherwise an error results.
     */
    TemplateBody?: __string;
    /**
     * A link to the S3 object containing the packaged AWS SAM template of your application.You can specify only one of templateBody and templateUrl; otherwise an error results.
     */
    TemplateUrl?: __string;
  }
  export interface CreateApplicationResponse {
    /**
     * The application Amazon Resource Name (ARN).
     */
    ApplicationId?: __string;
    /**
     * The name of the author publishing the app.Minimum length=1. Maximum length=127.Pattern "^[a-z0-9](([a-z0-9]|-(?!-))*[a-z0-9])?$";
     */
    Author?: __string;
    /**
     * The date and time this resource was created.
     */
    CreationTime?: __string;
    /**
     * The description of the application.Minimum length=1. Maximum length=256
     */
    Description?: __string;
    /**
     * A URL with more information about the application, for example the location of your GitHub repository for the application.
     */
    HomePageUrl?: __string;
    /**
     * Whether the author of this application has been verified. This means means that AWS has made a good faith review, as a reasonable and prudent service provider, of the information provided by the requester and has confirmed that the requester's identity is as claimed.
     */
    IsVerifiedAuthor?: __boolean;
    /**
     * Labels to improve discovery of apps in search results.Minimum length=1. Maximum length=127. Maximum number of labels: 10Pattern: "^[a-zA-Z0-9+\\-_:\\/@]+$";
     */
    Labels?: __listOf__string;
    /**
     * A link to a license file of the app that matches the spdxLicenseID value of your application.Maximum size 5 MB
     */
    LicenseUrl?: __string;
    /**
     * The name of the application.Minimum length=1. Maximum length=140Pattern: "[a-zA-Z0-9\\-]+";
     */
    Name?: __string;
    /**
     * A link to the readme file in Markdown language that contains a more detailed description of the application and how it works.Maximum size 5 MB
     */
    ReadmeUrl?: __string;
    /**
     * A valid identifier from https://spdx.org/licenses/.
     */
    SpdxLicenseId?: __string;
    /**
     * The URL to the public profile of a verified author. This URL is submitted by the author.
     */
    VerifiedAuthorUrl?: __string;
    /**
     * Version information about the application.
     */
    Version?: Version;
  }
  export interface CreateApplicationVersionRequest {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    ApplicationId: __string;
    /**
     * The semantic version of the new version.
     */
    SemanticVersion: __string;
    /**
     * A link to the S3 object that contains the ZIP archive of the source code for this version of your application.Maximum size 50 MB
     */
    SourceCodeArchiveUrl?: __string;
    /**
     * A link to a public repository for the source code of your application, for example the URL of a specific GitHub commit.
     */
    SourceCodeUrl?: __string;
    /**
     * The raw packaged AWS SAM template of your application.
     */
    TemplateBody?: __string;
    /**
     * A link to the packaged AWS SAM template of your application.
     */
    TemplateUrl?: __string;
  }
  export interface CreateApplicationVersionResponse {
    /**
     * The application Amazon Resource Name (ARN).
     */
    ApplicationId?: __string;
    /**
     * The date and time this resource was created.
     */
    CreationTime?: __string;
    /**
     * An array of parameter types supported by the application.
     */
    ParameterDefinitions?: __listOfParameterDefinition;
    /**
     * A list of values that you must specify before you can deploy certain applications.
 Some applications might include resources that can affect permissions in your AWS
 account, for example, by creating new AWS Identity and Access Management (IAM) users.
 For those applications, you must explicitly acknowledge their capabilities by
 specifying this parameter.The only valid values are CAPABILITY_IAM, CAPABILITY_NAMED_IAM,
 CAPABILITY_RESOURCE_POLICY, and CAPABILITY_AUTO_EXPAND.The following resources require you to specify CAPABILITY_IAM or
 CAPABILITY_NAMED_IAM:
 AWS::IAM::Group,
 AWS::IAM::InstanceProfile,
 AWS::IAM::Policy, and
 AWS::IAM::Role.
 If the application contains IAM resources, you can specify either CAPABILITY_IAM
 or CAPABILITY_NAMED_IAM. If the application contains IAM resources
 with custom names, you must specify CAPABILITY_NAMED_IAM.The following resources require you to specify CAPABILITY_RESOURCE_POLICY:
 AWS::Lambda::Permission,
 AWS::IAM:Policy,
 AWS::ApplicationAutoScaling::ScalingPolicy,
 AWS::S3::BucketPolicy,
 AWS::SQS::QueuePolicy, and
 AWS::SNS::TopicPolicy.Applications that contain one or more nested applications require you to specify
 CAPABILITY_AUTO_EXPAND.If your application template contains any of the above resources, we recommend that you review
 all permissions associated with the application before deploying. If you don't specify
 this parameter for an application that requires capabilities, the call will fail.
     */
    RequiredCapabilities?: __listOfCapability;
    /**
     * Whether all of the AWS resources contained in this application are supported in the region
 in which it is being retrieved.
     */
    ResourcesSupported?: __boolean;
    /**
     * The semantic version of the application:
 https://semver.org/
 
     */
    SemanticVersion?: __string;
    /**
     * A link to the S3 object that contains the ZIP archive of the source code for this version of your application.Maximum size 50 MB
     */
    SourceCodeArchiveUrl?: __string;
    /**
     * A link to a public repository for the source code of your application, for example the URL of a specific GitHub commit.
     */
    SourceCodeUrl?: __string;
    /**
     * A link to the packaged AWS SAM template of your application.
     */
    TemplateUrl?: __string;
  }
  export interface CreateCloudFormationChangeSetRequest {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    ApplicationId: __string;
    /**
     * A list of values that you must specify before you can deploy certain applications.
 Some applications might include resources that can affect permissions in your AWS
 account, for example, by creating new AWS Identity and Access Management (IAM) users.
 For those applications, you must explicitly acknowledge their capabilities by
 specifying this parameter.The only valid values are CAPABILITY_IAM, CAPABILITY_NAMED_IAM,
 CAPABILITY_RESOURCE_POLICY, and CAPABILITY_AUTO_EXPAND.The following resources require you to specify CAPABILITY_IAM or
 CAPABILITY_NAMED_IAM:
 AWS::IAM::Group,
 AWS::IAM::InstanceProfile,
 AWS::IAM::Policy, and
 AWS::IAM::Role.
 If the application contains IAM resources, you can specify either CAPABILITY_IAM
 or CAPABILITY_NAMED_IAM. If the application contains IAM resources
 with custom names, you must specify CAPABILITY_NAMED_IAM.The following resources require you to specify CAPABILITY_RESOURCE_POLICY:
 AWS::Lambda::Permission,
 AWS::IAM:Policy,
 AWS::ApplicationAutoScaling::ScalingPolicy,
 AWS::S3::BucketPolicy,
 AWS::SQS::QueuePolicy, and
 AWS::SNS:TopicPolicy.Applications that contain one or more nested applications require you to specify
 CAPABILITY_AUTO_EXPAND.If your application template contains any of the above resources, we recommend that you review
 all permissions associated with the application before deploying. If you don't specify
 this parameter for an application that requires capabilities, the call will fail.
     */
    Capabilities?: __listOf__string;
    /**
     * This property corresponds to the parameter of the same name for the AWS CloudFormation CreateChangeSet
  API.
     */
    ChangeSetName?: __string;
    /**
     * This property corresponds to the parameter of the same name for the AWS CloudFormation CreateChangeSet
  API.
     */
    ClientToken?: __string;
    /**
     * This property corresponds to the parameter of the same name for the AWS CloudFormation CreateChangeSet
  API.
     */
    Description?: __string;
    /**
     * This property corresponds to the parameter of the same name for the AWS CloudFormation CreateChangeSet
  API.
     */
    NotificationArns?: __listOf__string;
    /**
     * A list of parameter values for the parameters of the application.
     */
    ParameterOverrides?: __listOfParameterValue;
    /**
     * This property corresponds to the parameter of the same name for the AWS CloudFormation CreateChangeSet
  API.
     */
    ResourceTypes?: __listOf__string;
    /**
     * This property corresponds to the parameter of the same name for the AWS CloudFormation CreateChangeSet
  API.
     */
    RollbackConfiguration?: RollbackConfiguration;
    /**
     * The semantic version of the application:
 https://semver.org/
 
     */
    SemanticVersion?: __string;
    /**
     * This property corresponds to the parameter of the same name for the AWS CloudFormation CreateChangeSet
  API.
     */
    StackName: __string;
    /**
     * This property corresponds to the parameter of the same name for the AWS CloudFormation CreateChangeSet
  API.
     */
    Tags?: __listOfTag;
    /**
     * The UUID returned by CreateCloudFormationTemplate.Pattern: [0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}
     */
    TemplateId?: __string;
  }
  export interface CreateCloudFormationChangeSetResponse {
    /**
     * The application Amazon Resource Name (ARN).
     */
    ApplicationId?: __string;
    /**
     * The Amazon Resource Name (ARN) of the change set.Length constraints: Minimum length of 1.Pattern: ARN:[-a-zA-Z0-9:/]*
     */
    ChangeSetId?: __string;
    /**
     * The semantic version of the application:
 https://semver.org/
 
     */
    SemanticVersion?: __string;
    /**
     * The unique ID of the stack.
     */
    StackId?: __string;
  }
  export interface CreateCloudFormationTemplateRequest {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    ApplicationId: __string;
    /**
     * The semantic version of the application:
 https://semver.org/
 
     */
    SemanticVersion?: __string;
  }
  export interface CreateCloudFormationTemplateResponse {
    /**
     * The application Amazon Resource Name (ARN).
     */
    ApplicationId?: __string;
    /**
     * The date and time this resource was created.
     */
    CreationTime?: __string;
    /**
     * The date and time this template expires. Templates
 expire 1 hour after creation.
     */
    ExpirationTime?: __string;
    /**
     * The semantic version of the application:
 https://semver.org/
 
     */
    SemanticVersion?: __string;
    /**
     * Status of the template creation workflow.Possible values: PREPARING | ACTIVE | EXPIRED
 
     */
    Status?: Status;
    /**
     * The UUID returned by CreateCloudFormationTemplate.Pattern: [0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}
     */
    TemplateId?: __string;
    /**
     * A link to the template that can be used to deploy the application using
 AWS CloudFormation.
     */
    TemplateUrl?: __string;
  }
  export interface DeleteApplicationRequest {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    ApplicationId: __string;
  }
  export interface GetApplicationPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    ApplicationId: __string;
  }
  export interface GetApplicationPolicyResponse {
    /**
     * An array of policy statements applied to the application.
     */
    Statements?: __listOfApplicationPolicyStatement;
  }
  export interface GetApplicationRequest {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    ApplicationId: __string;
    /**
     * The semantic version of the application to get.
     */
    SemanticVersion?: __string;
  }
  export interface GetApplicationResponse {
    /**
     * The application Amazon Resource Name (ARN).
     */
    ApplicationId?: __string;
    /**
     * The name of the author publishing the app.Minimum length=1. Maximum length=127.Pattern "^[a-z0-9](([a-z0-9]|-(?!-))*[a-z0-9])?$";
     */
    Author?: __string;
    /**
     * The date and time this resource was created.
     */
    CreationTime?: __string;
    /**
     * The description of the application.Minimum length=1. Maximum length=256
     */
    Description?: __string;
    /**
     * A URL with more information about the application, for example the location of your GitHub repository for the application.
     */
    HomePageUrl?: __string;
    /**
     * Whether the author of this application has been verified. This means means that AWS has made a good faith review, as a reasonable and prudent service provider, of the information provided by the requester and has confirmed that the requester's identity is as claimed.
     */
    IsVerifiedAuthor?: __boolean;
    /**
     * Labels to improve discovery of apps in search results.Minimum length=1. Maximum length=127. Maximum number of labels: 10Pattern: "^[a-zA-Z0-9+\\-_:\\/@]+$";
     */
    Labels?: __listOf__string;
    /**
     * A link to a license file of the app that matches the spdxLicenseID value of your application.Maximum size 5 MB
     */
    LicenseUrl?: __string;
    /**
     * The name of the application.Minimum length=1. Maximum length=140Pattern: "[a-zA-Z0-9\\-]+";
     */
    Name?: __string;
    /**
     * A link to the readme file in Markdown language that contains a more detailed description of the application and how it works.Maximum size 5 MB
     */
    ReadmeUrl?: __string;
    /**
     * A valid identifier from https://spdx.org/licenses/.
     */
    SpdxLicenseId?: __string;
    /**
     * The URL to the public profile of a verified author. This URL is submitted by the author.
     */
    VerifiedAuthorUrl?: __string;
    /**
     * Version information about the application.
     */
    Version?: Version;
  }
  export interface GetCloudFormationTemplateRequest {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    ApplicationId: __string;
    /**
     * The UUID returned by CreateCloudFormationTemplate.Pattern: [0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}
     */
    TemplateId: __string;
  }
  export interface GetCloudFormationTemplateResponse {
    /**
     * The application Amazon Resource Name (ARN).
     */
    ApplicationId?: __string;
    /**
     * The date and time this resource was created.
     */
    CreationTime?: __string;
    /**
     * The date and time this template expires. Templates
 expire 1 hour after creation.
     */
    ExpirationTime?: __string;
    /**
     * The semantic version of the application:
 https://semver.org/
 
     */
    SemanticVersion?: __string;
    /**
     * Status of the template creation workflow.Possible values: PREPARING | ACTIVE | EXPIRED
 
     */
    Status?: Status;
    /**
     * The UUID returned by CreateCloudFormationTemplate.Pattern: [0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}
     */
    TemplateId?: __string;
    /**
     * A link to the template that can be used to deploy the application using
 AWS CloudFormation.
     */
    TemplateUrl?: __string;
  }
  export interface ListApplicationDependenciesRequest {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    ApplicationId: __string;
    /**
     * The total number of items to return.
     */
    MaxItems?: MaxItems;
    /**
     * A token to specify where to start paginating.
     */
    NextToken?: __string;
    /**
     * The semantic version of the application to get.
     */
    SemanticVersion?: __string;
  }
  export interface ListApplicationDependenciesResponse {
    /**
     * An array of application summaries nested in the application.
     */
    Dependencies?: __listOfApplicationDependencySummary;
    /**
     * The token to request the next page of results.
     */
    NextToken?: __string;
  }
  export interface ListApplicationVersionsRequest {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    ApplicationId: __string;
    /**
     * The total number of items to return.
     */
    MaxItems?: MaxItems;
    /**
     * A token to specify where to start paginating.
     */
    NextToken?: __string;
  }
  export interface ListApplicationVersionsResponse {
    /**
     * The token to request the next page of results.
     */
    NextToken?: __string;
    /**
     * An array of version summaries for the application.
     */
    Versions?: __listOfVersionSummary;
  }
  export interface ListApplicationsRequest {
    /**
     * The total number of items to return.
     */
    MaxItems?: MaxItems;
    /**
     * A token to specify where to start paginating.
     */
    NextToken?: __string;
  }
  export interface ListApplicationsResponse {
    /**
     * An array of application summaries.
     */
    Applications?: __listOfApplicationSummary;
    /**
     * The token to request the next page of results.
     */
    NextToken?: __string;
  }
  export type MaxItems = number;
  export interface ParameterDefinition {
    /**
     * A regular expression that represents the patterns to allow for String types.
     */
    AllowedPattern?: __string;
    /**
     * An array containing the list of values allowed for the parameter.
     */
    AllowedValues?: __listOf__string;
    /**
     * A string that explains a constraint when the constraint is violated. For example, without a constraint description,
 a parameter that has an allowed pattern of [A-Za-z0-9]+ displays the following error message when the user
 specifies an invalid value:
 Malformed input-Parameter MyParameter must match pattern [A-Za-z0-9]+
 By adding a constraint description, such as "must contain only uppercase and lowercase letters and numbers," you can display
 the following customized error message:
 Malformed input-Parameter MyParameter must contain only uppercase and lowercase letters and numbers.
 
     */
    ConstraintDescription?: __string;
    /**
     * A value of the appropriate type for the template to use if no value is specified when a stack is created.
 If you define constraints for the parameter, you must specify a value that adheres to those constraints.
     */
    DefaultValue?: __string;
    /**
     * A string of up to 4,000 characters that describes the parameter.
     */
    Description?: __string;
    /**
     * An integer value that determines the largest number of characters that you want to allow for String types.
     */
    MaxLength?: __integer;
    /**
     * A numeric value that determines the largest numeric value that you want to allow for Number types.
     */
    MaxValue?: __integer;
    /**
     * An integer value that determines the smallest number of characters that you want to allow for String types.
     */
    MinLength?: __integer;
    /**
     * A numeric value that determines the smallest numeric value that you want to allow for Number types.
     */
    MinValue?: __integer;
    /**
     * The name of the parameter.
     */
    Name: __string;
    /**
     * Whether to mask the parameter value whenever anyone makes a call that describes the stack. If you set the
 value to true, the parameter value is masked with asterisks (*****).
     */
    NoEcho?: __boolean;
    /**
     * A list of AWS SAM resources that use this parameter.
     */
    ReferencedByResources: __listOf__string;
    /**
     * The type of the parameter.Valid values: String | Number | List&lt;Number> | CommaDelimitedList
 
 String: A literal string.For example, users can specify "MyUserName".
 Number: An integer or float. AWS CloudFormation validates the parameter value as a number. However, when you use the
 parameter elsewhere in your template (for example, by using the Ref intrinsic function), the parameter value becomes a string.For example, users might specify "8888".
 List&lt;Number>: An array of integers or floats that are separated by commas. AWS CloudFormation validates the parameter value as numbers. However, when
 you use the parameter elsewhere in your template (for example, by using the Ref intrinsic function), the parameter value becomes a list of strings.For example, users might specify "80,20", and then Ref results in ["80","20"].
 CommaDelimitedList: An array of literal strings that are separated by commas. The total number of strings should be one more than the total number of commas.
 Also, each member string is space-trimmed.For example, users might specify "test,dev,prod", and then Ref results in ["test","dev","prod"].
     */
    Type?: __string;
  }
  export interface ParameterValue {
    /**
     * The key associated with the parameter. If you don't specify a key and value for a particular parameter, AWS CloudFormation
 uses the default value that is specified in your template.
     */
    Name: __string;
    /**
     * The input value associated with the parameter.
     */
    Value: __string;
  }
  export interface PutApplicationPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    ApplicationId: __string;
    /**
     * An array of policy statements applied to the application.
     */
    Statements: __listOfApplicationPolicyStatement;
  }
  export interface PutApplicationPolicyResponse {
    /**
     * An array of policy statements applied to the application.
     */
    Statements?: __listOfApplicationPolicyStatement;
  }
  export interface RollbackConfiguration {
    /**
     * This property corresponds to the content of the same name for the AWS CloudFormation RollbackConfiguration
  Data Type.
     */
    MonitoringTimeInMinutes?: __integer;
    /**
     * This property corresponds to the content of the same name for the AWS CloudFormation RollbackConfiguration
  Data Type.
     */
    RollbackTriggers?: __listOfRollbackTrigger;
  }
  export interface RollbackTrigger {
    /**
     * This property corresponds to the content of the same name for the AWS CloudFormation RollbackTrigger
  Data Type.
     */
    Arn: __string;
    /**
     * This property corresponds to the content of the same name for the AWS CloudFormation RollbackTrigger
  Data Type.
     */
    Type: __string;
  }
  export type Status = "PREPARING"|"ACTIVE"|"EXPIRED"|string;
  export interface Tag {
    /**
     * This property corresponds to the content of the same name for the AWS CloudFormation Tag
  Data Type.
     */
    Key: __string;
    /**
     * This property corresponds to the content of the same name for the AWS CloudFormation 
 Tag
 
 Data Type.
     */
    Value: __string;
  }
  export interface UnshareApplicationRequest {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    ApplicationId: __string;
    /**
     * The AWS Organization ID to unshare the application from.
     */
    OrganizationId: __string;
  }
  export interface UpdateApplicationRequest {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    ApplicationId: __string;
    /**
     * The name of the author publishing the app.Minimum length=1. Maximum length=127.Pattern "^[a-z0-9](([a-z0-9]|-(?!-))*[a-z0-9])?$";
     */
    Author?: __string;
    /**
     * The description of the application.Minimum length=1. Maximum length=256
     */
    Description?: __string;
    /**
     * A URL with more information about the application, for example the location of your GitHub repository for the application.
     */
    HomePageUrl?: __string;
    /**
     * Labels to improve discovery of apps in search results.Minimum length=1. Maximum length=127. Maximum number of labels: 10Pattern: "^[a-zA-Z0-9+\\-_:\\/@]+$";
     */
    Labels?: __listOf__string;
    /**
     * A text readme file in Markdown language that contains a more detailed description of the application and how it works.Maximum size 5 MB
     */
    ReadmeBody?: __string;
    /**
     * A link to the readme file in Markdown language that contains a more detailed description of the application and how it works.Maximum size 5 MB
     */
    ReadmeUrl?: __string;
  }
  export interface UpdateApplicationResponse {
    /**
     * The application Amazon Resource Name (ARN).
     */
    ApplicationId?: __string;
    /**
     * The name of the author publishing the app.Minimum length=1. Maximum length=127.Pattern "^[a-z0-9](([a-z0-9]|-(?!-))*[a-z0-9])?$";
     */
    Author?: __string;
    /**
     * The date and time this resource was created.
     */
    CreationTime?: __string;
    /**
     * The description of the application.Minimum length=1. Maximum length=256
     */
    Description?: __string;
    /**
     * A URL with more information about the application, for example the location of your GitHub repository for the application.
     */
    HomePageUrl?: __string;
    /**
     * Whether the author of this application has been verified. This means means that AWS has made a good faith review, as a reasonable and prudent service provider, of the information provided by the requester and has confirmed that the requester's identity is as claimed.
     */
    IsVerifiedAuthor?: __boolean;
    /**
     * Labels to improve discovery of apps in search results.Minimum length=1. Maximum length=127. Maximum number of labels: 10Pattern: "^[a-zA-Z0-9+\\-_:\\/@]+$";
     */
    Labels?: __listOf__string;
    /**
     * A link to a license file of the app that matches the spdxLicenseID value of your application.Maximum size 5 MB
     */
    LicenseUrl?: __string;
    /**
     * The name of the application.Minimum length=1. Maximum length=140Pattern: "[a-zA-Z0-9\\-]+";
     */
    Name?: __string;
    /**
     * A link to the readme file in Markdown language that contains a more detailed description of the application and how it works.Maximum size 5 MB
     */
    ReadmeUrl?: __string;
    /**
     * A valid identifier from https://spdx.org/licenses/.
     */
    SpdxLicenseId?: __string;
    /**
     * The URL to the public profile of a verified author. This URL is submitted by the author.
     */
    VerifiedAuthorUrl?: __string;
    /**
     * Version information about the application.
     */
    Version?: Version;
  }
  export interface Version {
    /**
     * The application Amazon Resource Name (ARN).
     */
    ApplicationId: __string;
    /**
     * The date and time this resource was created.
     */
    CreationTime: __string;
    /**
     * An array of parameter types supported by the application.
     */
    ParameterDefinitions: __listOfParameterDefinition;
    /**
     * A list of values that you must specify before you can deploy certain applications.
 Some applications might include resources that can affect permissions in your AWS
 account, for example, by creating new AWS Identity and Access Management (IAM) users.
 For those applications, you must explicitly acknowledge their capabilities by
 specifying this parameter.The only valid values are CAPABILITY_IAM, CAPABILITY_NAMED_IAM,
 CAPABILITY_RESOURCE_POLICY, and CAPABILITY_AUTO_EXPAND.The following resources require you to specify CAPABILITY_IAM or
 CAPABILITY_NAMED_IAM:
 AWS::IAM::Group,
 AWS::IAM::InstanceProfile,
 AWS::IAM::Policy, and
 AWS::IAM::Role.
 If the application contains IAM resources, you can specify either CAPABILITY_IAM
 or CAPABILITY_NAMED_IAM. If the application contains IAM resources
 with custom names, you must specify CAPABILITY_NAMED_IAM.The following resources require you to specify CAPABILITY_RESOURCE_POLICY:
 AWS::Lambda::Permission,
 AWS::IAM:Policy,
 AWS::ApplicationAutoScaling::ScalingPolicy,
 AWS::S3::BucketPolicy,
 AWS::SQS::QueuePolicy, and
 AWS::SNS::TopicPolicy.Applications that contain one or more nested applications require you to specify
 CAPABILITY_AUTO_EXPAND.If your application template contains any of the above resources, we recommend that you review
 all permissions associated with the application before deploying. If you don't specify
 this parameter for an application that requires capabilities, the call will fail.
     */
    RequiredCapabilities: __listOfCapability;
    /**
     * Whether all of the AWS resources contained in this application are supported in the region
 in which it is being retrieved.
     */
    ResourcesSupported: __boolean;
    /**
     * The semantic version of the application:
 https://semver.org/
 
     */
    SemanticVersion: __string;
    /**
     * A link to the S3 object that contains the ZIP archive of the source code for this version of your application.Maximum size 50 MB
     */
    SourceCodeArchiveUrl?: __string;
    /**
     * A link to a public repository for the source code of your application, for example the URL of a specific GitHub commit.
     */
    SourceCodeUrl?: __string;
    /**
     * A link to the packaged AWS SAM template of your application.
     */
    TemplateUrl: __string;
  }
  export interface VersionSummary {
    /**
     * The application Amazon Resource Name (ARN).
     */
    ApplicationId: __string;
    /**
     * The date and time this resource was created.
     */
    CreationTime: __string;
    /**
     * The semantic version of the application:
 https://semver.org/
 
     */
    SemanticVersion: __string;
    /**
     * A link to a public repository for the source code of your application, for example the URL of a specific GitHub commit.
     */
    SourceCodeUrl?: __string;
  }
  export type __boolean = boolean;
  export type __integer = number;
  export type __listOfApplicationDependencySummary = ApplicationDependencySummary[];
  export type __listOfApplicationPolicyStatement = ApplicationPolicyStatement[];
  export type __listOfApplicationSummary = ApplicationSummary[];
  export type __listOfCapability = Capability[];
  export type __listOfParameterDefinition = ParameterDefinition[];
  export type __listOfParameterValue = ParameterValue[];
  export type __listOfRollbackTrigger = RollbackTrigger[];
  export type __listOfTag = Tag[];
  export type __listOfVersionSummary = VersionSummary[];
  export type __listOf__string = __string[];
  export type __string = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-09-08"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ServerlessApplicationRepository client.
   */
  export import Types = ServerlessApplicationRepository;
}
export = ServerlessApplicationRepository;
