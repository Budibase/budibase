import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Connect extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Connect.Types.ClientConfiguration)
  config: Config & Connect.Types.ClientConfiguration;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Associates an approved origin to an Amazon Connect instance.
   */
  associateApprovedOrigin(params: Connect.Types.AssociateApprovedOriginRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Associates an approved origin to an Amazon Connect instance.
   */
  associateApprovedOrigin(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Allows the specified Amazon Connect instance to access the specified Amazon Lex or Amazon Lex V2 bot.
   */
  associateBot(params: Connect.Types.AssociateBotRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Allows the specified Amazon Connect instance to access the specified Amazon Lex or Amazon Lex V2 bot.
   */
  associateBot(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Associates a storage resource type for the first time. You can only associate one type of storage configuration in a single call. This means, for example, that you can't define an instance with multiple S3 buckets for storing chat transcripts. This API does not create a resource that doesn't exist. It only associates it to the instance. Ensure that the resource being specified in the storage configuration, like an S3 bucket, exists when being used for association.
   */
  associateInstanceStorageConfig(params: Connect.Types.AssociateInstanceStorageConfigRequest, callback?: (err: AWSError, data: Connect.Types.AssociateInstanceStorageConfigResponse) => void): Request<Connect.Types.AssociateInstanceStorageConfigResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Associates a storage resource type for the first time. You can only associate one type of storage configuration in a single call. This means, for example, that you can't define an instance with multiple S3 buckets for storing chat transcripts. This API does not create a resource that doesn't exist. It only associates it to the instance. Ensure that the resource being specified in the storage configuration, like an S3 bucket, exists when being used for association.
   */
  associateInstanceStorageConfig(callback?: (err: AWSError, data: Connect.Types.AssociateInstanceStorageConfigResponse) => void): Request<Connect.Types.AssociateInstanceStorageConfigResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Allows the specified Amazon Connect instance to access the specified Lambda function.
   */
  associateLambdaFunction(params: Connect.Types.AssociateLambdaFunctionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Allows the specified Amazon Connect instance to access the specified Lambda function.
   */
  associateLambdaFunction(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Allows the specified Amazon Connect instance to access the specified Amazon Lex bot.
   */
  associateLexBot(params: Connect.Types.AssociateLexBotRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Allows the specified Amazon Connect instance to access the specified Amazon Lex bot.
   */
  associateLexBot(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Associates a set of quick connects with a queue.
   */
  associateQueueQuickConnects(params: Connect.Types.AssociateQueueQuickConnectsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Associates a set of quick connects with a queue.
   */
  associateQueueQuickConnects(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associates a set of queues with a routing profile.
   */
  associateRoutingProfileQueues(params: Connect.Types.AssociateRoutingProfileQueuesRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associates a set of queues with a routing profile.
   */
  associateRoutingProfileQueues(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Associates a security key to the instance.
   */
  associateSecurityKey(params: Connect.Types.AssociateSecurityKeyRequest, callback?: (err: AWSError, data: Connect.Types.AssociateSecurityKeyResponse) => void): Request<Connect.Types.AssociateSecurityKeyResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Associates a security key to the instance.
   */
  associateSecurityKey(callback?: (err: AWSError, data: Connect.Types.AssociateSecurityKeyResponse) => void): Request<Connect.Types.AssociateSecurityKeyResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Creates an agent status for the specified Amazon Connect instance.
   */
  createAgentStatus(params: Connect.Types.CreateAgentStatusRequest, callback?: (err: AWSError, data: Connect.Types.CreateAgentStatusResponse) => void): Request<Connect.Types.CreateAgentStatusResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Creates an agent status for the specified Amazon Connect instance.
   */
  createAgentStatus(callback?: (err: AWSError, data: Connect.Types.CreateAgentStatusResponse) => void): Request<Connect.Types.CreateAgentStatusResponse, AWSError>;
  /**
   * Creates a contact flow for the specified Amazon Connect instance. You can also create and update contact flows using the Amazon Connect Flow language.
   */
  createContactFlow(params: Connect.Types.CreateContactFlowRequest, callback?: (err: AWSError, data: Connect.Types.CreateContactFlowResponse) => void): Request<Connect.Types.CreateContactFlowResponse, AWSError>;
  /**
   * Creates a contact flow for the specified Amazon Connect instance. You can also create and update contact flows using the Amazon Connect Flow language.
   */
  createContactFlow(callback?: (err: AWSError, data: Connect.Types.CreateContactFlowResponse) => void): Request<Connect.Types.CreateContactFlowResponse, AWSError>;
  /**
   * Creates hours of operation. 
   */
  createHoursOfOperation(params: Connect.Types.CreateHoursOfOperationRequest, callback?: (err: AWSError, data: Connect.Types.CreateHoursOfOperationResponse) => void): Request<Connect.Types.CreateHoursOfOperationResponse, AWSError>;
  /**
   * Creates hours of operation. 
   */
  createHoursOfOperation(callback?: (err: AWSError, data: Connect.Types.CreateHoursOfOperationResponse) => void): Request<Connect.Types.CreateHoursOfOperationResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Initiates an Amazon Connect instance with all the supported channels enabled. It does not attach any storage, such as Amazon Simple Storage Service (Amazon S3) or Amazon Kinesis. It also does not allow for any configurations on features, such as Contact Lens for Amazon Connect.  Amazon Connect enforces a limit on the total number of instances that you can create or delete in 30 days. If you exceed this limit, you will get an error message indicating there has been an excessive number of attempts at creating or deleting instances. You must wait 30 days before you can restart creating and deleting instances in your account.
   */
  createInstance(params: Connect.Types.CreateInstanceRequest, callback?: (err: AWSError, data: Connect.Types.CreateInstanceResponse) => void): Request<Connect.Types.CreateInstanceResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Initiates an Amazon Connect instance with all the supported channels enabled. It does not attach any storage, such as Amazon Simple Storage Service (Amazon S3) or Amazon Kinesis. It also does not allow for any configurations on features, such as Contact Lens for Amazon Connect.  Amazon Connect enforces a limit on the total number of instances that you can create or delete in 30 days. If you exceed this limit, you will get an error message indicating there has been an excessive number of attempts at creating or deleting instances. You must wait 30 days before you can restart creating and deleting instances in your account.
   */
  createInstance(callback?: (err: AWSError, data: Connect.Types.CreateInstanceResponse) => void): Request<Connect.Types.CreateInstanceResponse, AWSError>;
  /**
   * Creates an AWS resource association with an Amazon Connect instance.
   */
  createIntegrationAssociation(params: Connect.Types.CreateIntegrationAssociationRequest, callback?: (err: AWSError, data: Connect.Types.CreateIntegrationAssociationResponse) => void): Request<Connect.Types.CreateIntegrationAssociationResponse, AWSError>;
  /**
   * Creates an AWS resource association with an Amazon Connect instance.
   */
  createIntegrationAssociation(callback?: (err: AWSError, data: Connect.Types.CreateIntegrationAssociationResponse) => void): Request<Connect.Types.CreateIntegrationAssociationResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Creates a new queue for the specified Amazon Connect instance.
   */
  createQueue(params: Connect.Types.CreateQueueRequest, callback?: (err: AWSError, data: Connect.Types.CreateQueueResponse) => void): Request<Connect.Types.CreateQueueResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Creates a new queue for the specified Amazon Connect instance.
   */
  createQueue(callback?: (err: AWSError, data: Connect.Types.CreateQueueResponse) => void): Request<Connect.Types.CreateQueueResponse, AWSError>;
  /**
   * Creates a quick connect for the specified Amazon Connect instance.
   */
  createQuickConnect(params: Connect.Types.CreateQuickConnectRequest, callback?: (err: AWSError, data: Connect.Types.CreateQuickConnectResponse) => void): Request<Connect.Types.CreateQuickConnectResponse, AWSError>;
  /**
   * Creates a quick connect for the specified Amazon Connect instance.
   */
  createQuickConnect(callback?: (err: AWSError, data: Connect.Types.CreateQuickConnectResponse) => void): Request<Connect.Types.CreateQuickConnectResponse, AWSError>;
  /**
   * Creates a new routing profile.
   */
  createRoutingProfile(params: Connect.Types.CreateRoutingProfileRequest, callback?: (err: AWSError, data: Connect.Types.CreateRoutingProfileResponse) => void): Request<Connect.Types.CreateRoutingProfileResponse, AWSError>;
  /**
   * Creates a new routing profile.
   */
  createRoutingProfile(callback?: (err: AWSError, data: Connect.Types.CreateRoutingProfileResponse) => void): Request<Connect.Types.CreateRoutingProfileResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Creates a security profile.
   */
  createSecurityProfile(params: Connect.Types.CreateSecurityProfileRequest, callback?: (err: AWSError, data: Connect.Types.CreateSecurityProfileResponse) => void): Request<Connect.Types.CreateSecurityProfileResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Creates a security profile.
   */
  createSecurityProfile(callback?: (err: AWSError, data: Connect.Types.CreateSecurityProfileResponse) => void): Request<Connect.Types.CreateSecurityProfileResponse, AWSError>;
  /**
   * Creates a use case for an integration association.
   */
  createUseCase(params: Connect.Types.CreateUseCaseRequest, callback?: (err: AWSError, data: Connect.Types.CreateUseCaseResponse) => void): Request<Connect.Types.CreateUseCaseResponse, AWSError>;
  /**
   * Creates a use case for an integration association.
   */
  createUseCase(callback?: (err: AWSError, data: Connect.Types.CreateUseCaseResponse) => void): Request<Connect.Types.CreateUseCaseResponse, AWSError>;
  /**
   * Creates a user account for the specified Amazon Connect instance. For information about how to create user accounts using the Amazon Connect console, see Add Users in the Amazon Connect Administrator Guide.
   */
  createUser(params: Connect.Types.CreateUserRequest, callback?: (err: AWSError, data: Connect.Types.CreateUserResponse) => void): Request<Connect.Types.CreateUserResponse, AWSError>;
  /**
   * Creates a user account for the specified Amazon Connect instance. For information about how to create user accounts using the Amazon Connect console, see Add Users in the Amazon Connect Administrator Guide.
   */
  createUser(callback?: (err: AWSError, data: Connect.Types.CreateUserResponse) => void): Request<Connect.Types.CreateUserResponse, AWSError>;
  /**
   * Creates a new user hierarchy group.
   */
  createUserHierarchyGroup(params: Connect.Types.CreateUserHierarchyGroupRequest, callback?: (err: AWSError, data: Connect.Types.CreateUserHierarchyGroupResponse) => void): Request<Connect.Types.CreateUserHierarchyGroupResponse, AWSError>;
  /**
   * Creates a new user hierarchy group.
   */
  createUserHierarchyGroup(callback?: (err: AWSError, data: Connect.Types.CreateUserHierarchyGroupResponse) => void): Request<Connect.Types.CreateUserHierarchyGroupResponse, AWSError>;
  /**
   * Deletes an hours of operation.
   */
  deleteHoursOfOperation(params: Connect.Types.DeleteHoursOfOperationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an hours of operation.
   */
  deleteHoursOfOperation(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Deletes the Amazon Connect instance. Amazon Connect enforces a limit on the total number of instances that you can create or delete in 30 days. If you exceed this limit, you will get an error message indicating there has been an excessive number of attempts at creating or deleting instances. You must wait 30 days before you can restart creating and deleting instances in your account.
   */
  deleteInstance(params: Connect.Types.DeleteInstanceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Deletes the Amazon Connect instance. Amazon Connect enforces a limit on the total number of instances that you can create or delete in 30 days. If you exceed this limit, you will get an error message indicating there has been an excessive number of attempts at creating or deleting instances. You must wait 30 days before you can restart creating and deleting instances in your account.
   */
  deleteInstance(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an AWS resource association from an Amazon Connect instance. The association must not have any use cases associated with it.
   */
  deleteIntegrationAssociation(params: Connect.Types.DeleteIntegrationAssociationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an AWS resource association from an Amazon Connect instance. The association must not have any use cases associated with it.
   */
  deleteIntegrationAssociation(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a quick connect.
   */
  deleteQuickConnect(params: Connect.Types.DeleteQuickConnectRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a quick connect.
   */
  deleteQuickConnect(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Deletes a security profile.
   */
  deleteSecurityProfile(params: Connect.Types.DeleteSecurityProfileRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Deletes a security profile.
   */
  deleteSecurityProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a use case from an integration association.
   */
  deleteUseCase(params: Connect.Types.DeleteUseCaseRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a use case from an integration association.
   */
  deleteUseCase(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a user account from the specified Amazon Connect instance. For information about what happens to a user's data when their account is deleted, see Delete Users from Your Amazon Connect Instance in the Amazon Connect Administrator Guide.
   */
  deleteUser(params: Connect.Types.DeleteUserRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a user account from the specified Amazon Connect instance. For information about what happens to a user's data when their account is deleted, see Delete Users from Your Amazon Connect Instance in the Amazon Connect Administrator Guide.
   */
  deleteUser(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an existing user hierarchy group. It must not be associated with any agents or have any active child groups.
   */
  deleteUserHierarchyGroup(params: Connect.Types.DeleteUserHierarchyGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an existing user hierarchy group. It must not be associated with any agents or have any active child groups.
   */
  deleteUserHierarchyGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Describes an agent status.
   */
  describeAgentStatus(params: Connect.Types.DescribeAgentStatusRequest, callback?: (err: AWSError, data: Connect.Types.DescribeAgentStatusResponse) => void): Request<Connect.Types.DescribeAgentStatusResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Describes an agent status.
   */
  describeAgentStatus(callback?: (err: AWSError, data: Connect.Types.DescribeAgentStatusResponse) => void): Request<Connect.Types.DescribeAgentStatusResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Describes the specified contact.   Contact information is available in Amazon Connect for 24 months, and then it is deleted. 
   */
  describeContact(params: Connect.Types.DescribeContactRequest, callback?: (err: AWSError, data: Connect.Types.DescribeContactResponse) => void): Request<Connect.Types.DescribeContactResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Describes the specified contact.   Contact information is available in Amazon Connect for 24 months, and then it is deleted. 
   */
  describeContact(callback?: (err: AWSError, data: Connect.Types.DescribeContactResponse) => void): Request<Connect.Types.DescribeContactResponse, AWSError>;
  /**
   * Describes the specified contact flow. You can also create and update contact flows using the Amazon Connect Flow language.
   */
  describeContactFlow(params: Connect.Types.DescribeContactFlowRequest, callback?: (err: AWSError, data: Connect.Types.DescribeContactFlowResponse) => void): Request<Connect.Types.DescribeContactFlowResponse, AWSError>;
  /**
   * Describes the specified contact flow. You can also create and update contact flows using the Amazon Connect Flow language.
   */
  describeContactFlow(callback?: (err: AWSError, data: Connect.Types.DescribeContactFlowResponse) => void): Request<Connect.Types.DescribeContactFlowResponse, AWSError>;
  /**
   * Describes the hours of operation.
   */
  describeHoursOfOperation(params: Connect.Types.DescribeHoursOfOperationRequest, callback?: (err: AWSError, data: Connect.Types.DescribeHoursOfOperationResponse) => void): Request<Connect.Types.DescribeHoursOfOperationResponse, AWSError>;
  /**
   * Describes the hours of operation.
   */
  describeHoursOfOperation(callback?: (err: AWSError, data: Connect.Types.DescribeHoursOfOperationResponse) => void): Request<Connect.Types.DescribeHoursOfOperationResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Returns the current state of the specified instance identifier. It tracks the instance while it is being created and returns an error status, if applicable.  If an instance is not created successfully, the instance status reason field returns details relevant to the reason. The instance in a failed state is returned only for 24 hours after the CreateInstance API was invoked.
   */
  describeInstance(params: Connect.Types.DescribeInstanceRequest, callback?: (err: AWSError, data: Connect.Types.DescribeInstanceResponse) => void): Request<Connect.Types.DescribeInstanceResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Returns the current state of the specified instance identifier. It tracks the instance while it is being created and returns an error status, if applicable.  If an instance is not created successfully, the instance status reason field returns details relevant to the reason. The instance in a failed state is returned only for 24 hours after the CreateInstance API was invoked.
   */
  describeInstance(callback?: (err: AWSError, data: Connect.Types.DescribeInstanceResponse) => void): Request<Connect.Types.DescribeInstanceResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Describes the specified instance attribute.
   */
  describeInstanceAttribute(params: Connect.Types.DescribeInstanceAttributeRequest, callback?: (err: AWSError, data: Connect.Types.DescribeInstanceAttributeResponse) => void): Request<Connect.Types.DescribeInstanceAttributeResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Describes the specified instance attribute.
   */
  describeInstanceAttribute(callback?: (err: AWSError, data: Connect.Types.DescribeInstanceAttributeResponse) => void): Request<Connect.Types.DescribeInstanceAttributeResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Retrieves the current storage configurations for the specified resource type, association ID, and instance ID.
   */
  describeInstanceStorageConfig(params: Connect.Types.DescribeInstanceStorageConfigRequest, callback?: (err: AWSError, data: Connect.Types.DescribeInstanceStorageConfigResponse) => void): Request<Connect.Types.DescribeInstanceStorageConfigResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Retrieves the current storage configurations for the specified resource type, association ID, and instance ID.
   */
  describeInstanceStorageConfig(callback?: (err: AWSError, data: Connect.Types.DescribeInstanceStorageConfigResponse) => void): Request<Connect.Types.DescribeInstanceStorageConfigResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Describes the specified queue.
   */
  describeQueue(params: Connect.Types.DescribeQueueRequest, callback?: (err: AWSError, data: Connect.Types.DescribeQueueResponse) => void): Request<Connect.Types.DescribeQueueResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Describes the specified queue.
   */
  describeQueue(callback?: (err: AWSError, data: Connect.Types.DescribeQueueResponse) => void): Request<Connect.Types.DescribeQueueResponse, AWSError>;
  /**
   * Describes the quick connect.
   */
  describeQuickConnect(params: Connect.Types.DescribeQuickConnectRequest, callback?: (err: AWSError, data: Connect.Types.DescribeQuickConnectResponse) => void): Request<Connect.Types.DescribeQuickConnectResponse, AWSError>;
  /**
   * Describes the quick connect.
   */
  describeQuickConnect(callback?: (err: AWSError, data: Connect.Types.DescribeQuickConnectResponse) => void): Request<Connect.Types.DescribeQuickConnectResponse, AWSError>;
  /**
   * Describes the specified routing profile.
   */
  describeRoutingProfile(params: Connect.Types.DescribeRoutingProfileRequest, callback?: (err: AWSError, data: Connect.Types.DescribeRoutingProfileResponse) => void): Request<Connect.Types.DescribeRoutingProfileResponse, AWSError>;
  /**
   * Describes the specified routing profile.
   */
  describeRoutingProfile(callback?: (err: AWSError, data: Connect.Types.DescribeRoutingProfileResponse) => void): Request<Connect.Types.DescribeRoutingProfileResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Gets basic information about the security profle.
   */
  describeSecurityProfile(params: Connect.Types.DescribeSecurityProfileRequest, callback?: (err: AWSError, data: Connect.Types.DescribeSecurityProfileResponse) => void): Request<Connect.Types.DescribeSecurityProfileResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Gets basic information about the security profle.
   */
  describeSecurityProfile(callback?: (err: AWSError, data: Connect.Types.DescribeSecurityProfileResponse) => void): Request<Connect.Types.DescribeSecurityProfileResponse, AWSError>;
  /**
   * Describes the specified user account. You can find the instance ID in the console (it’s the final part of the ARN). The console does not display the user IDs. Instead, list the users and note the IDs provided in the output.
   */
  describeUser(params: Connect.Types.DescribeUserRequest, callback?: (err: AWSError, data: Connect.Types.DescribeUserResponse) => void): Request<Connect.Types.DescribeUserResponse, AWSError>;
  /**
   * Describes the specified user account. You can find the instance ID in the console (it’s the final part of the ARN). The console does not display the user IDs. Instead, list the users and note the IDs provided in the output.
   */
  describeUser(callback?: (err: AWSError, data: Connect.Types.DescribeUserResponse) => void): Request<Connect.Types.DescribeUserResponse, AWSError>;
  /**
   * Describes the specified hierarchy group.
   */
  describeUserHierarchyGroup(params: Connect.Types.DescribeUserHierarchyGroupRequest, callback?: (err: AWSError, data: Connect.Types.DescribeUserHierarchyGroupResponse) => void): Request<Connect.Types.DescribeUserHierarchyGroupResponse, AWSError>;
  /**
   * Describes the specified hierarchy group.
   */
  describeUserHierarchyGroup(callback?: (err: AWSError, data: Connect.Types.DescribeUserHierarchyGroupResponse) => void): Request<Connect.Types.DescribeUserHierarchyGroupResponse, AWSError>;
  /**
   * Describes the hierarchy structure of the specified Amazon Connect instance.
   */
  describeUserHierarchyStructure(params: Connect.Types.DescribeUserHierarchyStructureRequest, callback?: (err: AWSError, data: Connect.Types.DescribeUserHierarchyStructureResponse) => void): Request<Connect.Types.DescribeUserHierarchyStructureResponse, AWSError>;
  /**
   * Describes the hierarchy structure of the specified Amazon Connect instance.
   */
  describeUserHierarchyStructure(callback?: (err: AWSError, data: Connect.Types.DescribeUserHierarchyStructureResponse) => void): Request<Connect.Types.DescribeUserHierarchyStructureResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Revokes access to integrated applications from Amazon Connect.
   */
  disassociateApprovedOrigin(params: Connect.Types.DisassociateApprovedOriginRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Revokes access to integrated applications from Amazon Connect.
   */
  disassociateApprovedOrigin(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Revokes authorization from the specified instance to access the specified Amazon Lex or Amazon Lex V2 bot. 
   */
  disassociateBot(params: Connect.Types.DisassociateBotRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Revokes authorization from the specified instance to access the specified Amazon Lex or Amazon Lex V2 bot. 
   */
  disassociateBot(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Removes the storage type configurations for the specified resource type and association ID.
   */
  disassociateInstanceStorageConfig(params: Connect.Types.DisassociateInstanceStorageConfigRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Removes the storage type configurations for the specified resource type and association ID.
   */
  disassociateInstanceStorageConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Remove the Lambda function from the dropdown options available in the relevant contact flow blocks.
   */
  disassociateLambdaFunction(params: Connect.Types.DisassociateLambdaFunctionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Remove the Lambda function from the dropdown options available in the relevant contact flow blocks.
   */
  disassociateLambdaFunction(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Revokes authorization from the specified instance to access the specified Amazon Lex bot.
   */
  disassociateLexBot(params: Connect.Types.DisassociateLexBotRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Revokes authorization from the specified instance to access the specified Amazon Lex bot.
   */
  disassociateLexBot(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Disassociates a set of quick connects from a queue.
   */
  disassociateQueueQuickConnects(params: Connect.Types.DisassociateQueueQuickConnectsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Disassociates a set of quick connects from a queue.
   */
  disassociateQueueQuickConnects(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disassociates a set of queues from a routing profile.
   */
  disassociateRoutingProfileQueues(params: Connect.Types.DisassociateRoutingProfileQueuesRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disassociates a set of queues from a routing profile.
   */
  disassociateRoutingProfileQueues(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Deletes the specified security key.
   */
  disassociateSecurityKey(params: Connect.Types.DisassociateSecurityKeyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Deletes the specified security key.
   */
  disassociateSecurityKey(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Retrieves the contact attributes for the specified contact.
   */
  getContactAttributes(params: Connect.Types.GetContactAttributesRequest, callback?: (err: AWSError, data: Connect.Types.GetContactAttributesResponse) => void): Request<Connect.Types.GetContactAttributesResponse, AWSError>;
  /**
   * Retrieves the contact attributes for the specified contact.
   */
  getContactAttributes(callback?: (err: AWSError, data: Connect.Types.GetContactAttributesResponse) => void): Request<Connect.Types.GetContactAttributesResponse, AWSError>;
  /**
   * Gets the real-time metric data from the specified Amazon Connect instance. For a description of each metric, see Real-time Metrics Definitions in the Amazon Connect Administrator Guide.
   */
  getCurrentMetricData(params: Connect.Types.GetCurrentMetricDataRequest, callback?: (err: AWSError, data: Connect.Types.GetCurrentMetricDataResponse) => void): Request<Connect.Types.GetCurrentMetricDataResponse, AWSError>;
  /**
   * Gets the real-time metric data from the specified Amazon Connect instance. For a description of each metric, see Real-time Metrics Definitions in the Amazon Connect Administrator Guide.
   */
  getCurrentMetricData(callback?: (err: AWSError, data: Connect.Types.GetCurrentMetricDataResponse) => void): Request<Connect.Types.GetCurrentMetricDataResponse, AWSError>;
  /**
   * Retrieves a token for federation.  This API doesn't support root users. If you try to invoke GetFederationToken with root credentials, an error message similar to the following one appears:   Provided identity: Principal: .... User: .... cannot be used for federation with Amazon Connect  
   */
  getFederationToken(params: Connect.Types.GetFederationTokenRequest, callback?: (err: AWSError, data: Connect.Types.GetFederationTokenResponse) => void): Request<Connect.Types.GetFederationTokenResponse, AWSError>;
  /**
   * Retrieves a token for federation.  This API doesn't support root users. If you try to invoke GetFederationToken with root credentials, an error message similar to the following one appears:   Provided identity: Principal: .... User: .... cannot be used for federation with Amazon Connect  
   */
  getFederationToken(callback?: (err: AWSError, data: Connect.Types.GetFederationTokenResponse) => void): Request<Connect.Types.GetFederationTokenResponse, AWSError>;
  /**
   * Gets historical metric data from the specified Amazon Connect instance. For a description of each historical metric, see Historical Metrics Definitions in the Amazon Connect Administrator Guide.
   */
  getMetricData(params: Connect.Types.GetMetricDataRequest, callback?: (err: AWSError, data: Connect.Types.GetMetricDataResponse) => void): Request<Connect.Types.GetMetricDataResponse, AWSError>;
  /**
   * Gets historical metric data from the specified Amazon Connect instance. For a description of each historical metric, see Historical Metrics Definitions in the Amazon Connect Administrator Guide.
   */
  getMetricData(callback?: (err: AWSError, data: Connect.Types.GetMetricDataResponse) => void): Request<Connect.Types.GetMetricDataResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Lists agent statuses.
   */
  listAgentStatuses(params: Connect.Types.ListAgentStatusRequest, callback?: (err: AWSError, data: Connect.Types.ListAgentStatusResponse) => void): Request<Connect.Types.ListAgentStatusResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Lists agent statuses.
   */
  listAgentStatuses(callback?: (err: AWSError, data: Connect.Types.ListAgentStatusResponse) => void): Request<Connect.Types.ListAgentStatusResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Returns a paginated list of all approved origins associated with the instance.
   */
  listApprovedOrigins(params: Connect.Types.ListApprovedOriginsRequest, callback?: (err: AWSError, data: Connect.Types.ListApprovedOriginsResponse) => void): Request<Connect.Types.ListApprovedOriginsResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Returns a paginated list of all approved origins associated with the instance.
   */
  listApprovedOrigins(callback?: (err: AWSError, data: Connect.Types.ListApprovedOriginsResponse) => void): Request<Connect.Types.ListApprovedOriginsResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. For the specified version of Amazon Lex, returns a paginated list of all the Amazon Lex bots currently associated with the instance. 
   */
  listBots(params: Connect.Types.ListBotsRequest, callback?: (err: AWSError, data: Connect.Types.ListBotsResponse) => void): Request<Connect.Types.ListBotsResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. For the specified version of Amazon Lex, returns a paginated list of all the Amazon Lex bots currently associated with the instance. 
   */
  listBots(callback?: (err: AWSError, data: Connect.Types.ListBotsResponse) => void): Request<Connect.Types.ListBotsResponse, AWSError>;
  /**
   * Provides information about the contact flows for the specified Amazon Connect instance. You can also create and update contact flows using the Amazon Connect Flow language. For more information about contact flows, see Contact Flows in the Amazon Connect Administrator Guide.
   */
  listContactFlows(params: Connect.Types.ListContactFlowsRequest, callback?: (err: AWSError, data: Connect.Types.ListContactFlowsResponse) => void): Request<Connect.Types.ListContactFlowsResponse, AWSError>;
  /**
   * Provides information about the contact flows for the specified Amazon Connect instance. You can also create and update contact flows using the Amazon Connect Flow language. For more information about contact flows, see Contact Flows in the Amazon Connect Administrator Guide.
   */
  listContactFlows(callback?: (err: AWSError, data: Connect.Types.ListContactFlowsResponse) => void): Request<Connect.Types.ListContactFlowsResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. For the specified referenceTypes, returns a list of references associated with the contact. 
   */
  listContactReferences(params: Connect.Types.ListContactReferencesRequest, callback?: (err: AWSError, data: Connect.Types.ListContactReferencesResponse) => void): Request<Connect.Types.ListContactReferencesResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. For the specified referenceTypes, returns a list of references associated with the contact. 
   */
  listContactReferences(callback?: (err: AWSError, data: Connect.Types.ListContactReferencesResponse) => void): Request<Connect.Types.ListContactReferencesResponse, AWSError>;
  /**
   * Provides information about the hours of operation for the specified Amazon Connect instance. For more information about hours of operation, see Set the Hours of Operation for a Queue in the Amazon Connect Administrator Guide.
   */
  listHoursOfOperations(params: Connect.Types.ListHoursOfOperationsRequest, callback?: (err: AWSError, data: Connect.Types.ListHoursOfOperationsResponse) => void): Request<Connect.Types.ListHoursOfOperationsResponse, AWSError>;
  /**
   * Provides information about the hours of operation for the specified Amazon Connect instance. For more information about hours of operation, see Set the Hours of Operation for a Queue in the Amazon Connect Administrator Guide.
   */
  listHoursOfOperations(callback?: (err: AWSError, data: Connect.Types.ListHoursOfOperationsResponse) => void): Request<Connect.Types.ListHoursOfOperationsResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Returns a paginated list of all attribute types for the given instance.
   */
  listInstanceAttributes(params: Connect.Types.ListInstanceAttributesRequest, callback?: (err: AWSError, data: Connect.Types.ListInstanceAttributesResponse) => void): Request<Connect.Types.ListInstanceAttributesResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Returns a paginated list of all attribute types for the given instance.
   */
  listInstanceAttributes(callback?: (err: AWSError, data: Connect.Types.ListInstanceAttributesResponse) => void): Request<Connect.Types.ListInstanceAttributesResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Returns a paginated list of storage configs for the identified instance and resource type.
   */
  listInstanceStorageConfigs(params: Connect.Types.ListInstanceStorageConfigsRequest, callback?: (err: AWSError, data: Connect.Types.ListInstanceStorageConfigsResponse) => void): Request<Connect.Types.ListInstanceStorageConfigsResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Returns a paginated list of storage configs for the identified instance and resource type.
   */
  listInstanceStorageConfigs(callback?: (err: AWSError, data: Connect.Types.ListInstanceStorageConfigsResponse) => void): Request<Connect.Types.ListInstanceStorageConfigsResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Return a list of instances which are in active state, creation-in-progress state, and failed state. Instances that aren't successfully created (they are in a failed state) are returned only for 24 hours after the CreateInstance API was invoked.
   */
  listInstances(params: Connect.Types.ListInstancesRequest, callback?: (err: AWSError, data: Connect.Types.ListInstancesResponse) => void): Request<Connect.Types.ListInstancesResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Return a list of instances which are in active state, creation-in-progress state, and failed state. Instances that aren't successfully created (they are in a failed state) are returned only for 24 hours after the CreateInstance API was invoked.
   */
  listInstances(callback?: (err: AWSError, data: Connect.Types.ListInstancesResponse) => void): Request<Connect.Types.ListInstancesResponse, AWSError>;
  /**
   * Provides summary information about the AWS resource associations for the specified Amazon Connect instance.
   */
  listIntegrationAssociations(params: Connect.Types.ListIntegrationAssociationsRequest, callback?: (err: AWSError, data: Connect.Types.ListIntegrationAssociationsResponse) => void): Request<Connect.Types.ListIntegrationAssociationsResponse, AWSError>;
  /**
   * Provides summary information about the AWS resource associations for the specified Amazon Connect instance.
   */
  listIntegrationAssociations(callback?: (err: AWSError, data: Connect.Types.ListIntegrationAssociationsResponse) => void): Request<Connect.Types.ListIntegrationAssociationsResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Returns a paginated list of all Lambda functions that display in the dropdown options in the relevant contact flow blocks.
   */
  listLambdaFunctions(params: Connect.Types.ListLambdaFunctionsRequest, callback?: (err: AWSError, data: Connect.Types.ListLambdaFunctionsResponse) => void): Request<Connect.Types.ListLambdaFunctionsResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Returns a paginated list of all Lambda functions that display in the dropdown options in the relevant contact flow blocks.
   */
  listLambdaFunctions(callback?: (err: AWSError, data: Connect.Types.ListLambdaFunctionsResponse) => void): Request<Connect.Types.ListLambdaFunctionsResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Returns a paginated list of all the Amazon Lex bots currently associated with the instance.
   */
  listLexBots(params: Connect.Types.ListLexBotsRequest, callback?: (err: AWSError, data: Connect.Types.ListLexBotsResponse) => void): Request<Connect.Types.ListLexBotsResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Returns a paginated list of all the Amazon Lex bots currently associated with the instance.
   */
  listLexBots(callback?: (err: AWSError, data: Connect.Types.ListLexBotsResponse) => void): Request<Connect.Types.ListLexBotsResponse, AWSError>;
  /**
   * Provides information about the phone numbers for the specified Amazon Connect instance.  For more information about phone numbers, see Set Up Phone Numbers for Your Contact Center in the Amazon Connect Administrator Guide.
   */
  listPhoneNumbers(params: Connect.Types.ListPhoneNumbersRequest, callback?: (err: AWSError, data: Connect.Types.ListPhoneNumbersResponse) => void): Request<Connect.Types.ListPhoneNumbersResponse, AWSError>;
  /**
   * Provides information about the phone numbers for the specified Amazon Connect instance.  For more information about phone numbers, see Set Up Phone Numbers for Your Contact Center in the Amazon Connect Administrator Guide.
   */
  listPhoneNumbers(callback?: (err: AWSError, data: Connect.Types.ListPhoneNumbersResponse) => void): Request<Connect.Types.ListPhoneNumbersResponse, AWSError>;
  /**
   * Provides information about the prompts for the specified Amazon Connect instance.
   */
  listPrompts(params: Connect.Types.ListPromptsRequest, callback?: (err: AWSError, data: Connect.Types.ListPromptsResponse) => void): Request<Connect.Types.ListPromptsResponse, AWSError>;
  /**
   * Provides information about the prompts for the specified Amazon Connect instance.
   */
  listPrompts(callback?: (err: AWSError, data: Connect.Types.ListPromptsResponse) => void): Request<Connect.Types.ListPromptsResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Lists the quick connects associated with a queue.
   */
  listQueueQuickConnects(params: Connect.Types.ListQueueQuickConnectsRequest, callback?: (err: AWSError, data: Connect.Types.ListQueueQuickConnectsResponse) => void): Request<Connect.Types.ListQueueQuickConnectsResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Lists the quick connects associated with a queue.
   */
  listQueueQuickConnects(callback?: (err: AWSError, data: Connect.Types.ListQueueQuickConnectsResponse) => void): Request<Connect.Types.ListQueueQuickConnectsResponse, AWSError>;
  /**
   * Provides information about the queues for the specified Amazon Connect instance. If you do not specify a QueueTypes parameter, both standard and agent queues are returned. This might cause an unexpected truncation of results if you have more than 1000 agents and you limit the number of results of the API call in code. For more information about queues, see Queues: Standard and Agent in the Amazon Connect Administrator Guide.
   */
  listQueues(params: Connect.Types.ListQueuesRequest, callback?: (err: AWSError, data: Connect.Types.ListQueuesResponse) => void): Request<Connect.Types.ListQueuesResponse, AWSError>;
  /**
   * Provides information about the queues for the specified Amazon Connect instance. If you do not specify a QueueTypes parameter, both standard and agent queues are returned. This might cause an unexpected truncation of results if you have more than 1000 agents and you limit the number of results of the API call in code. For more information about queues, see Queues: Standard and Agent in the Amazon Connect Administrator Guide.
   */
  listQueues(callback?: (err: AWSError, data: Connect.Types.ListQueuesResponse) => void): Request<Connect.Types.ListQueuesResponse, AWSError>;
  /**
   * Provides information about the quick connects for the specified Amazon Connect instance. 
   */
  listQuickConnects(params: Connect.Types.ListQuickConnectsRequest, callback?: (err: AWSError, data: Connect.Types.ListQuickConnectsResponse) => void): Request<Connect.Types.ListQuickConnectsResponse, AWSError>;
  /**
   * Provides information about the quick connects for the specified Amazon Connect instance. 
   */
  listQuickConnects(callback?: (err: AWSError, data: Connect.Types.ListQuickConnectsResponse) => void): Request<Connect.Types.ListQuickConnectsResponse, AWSError>;
  /**
   * Lists the queues associated with a routing profile.
   */
  listRoutingProfileQueues(params: Connect.Types.ListRoutingProfileQueuesRequest, callback?: (err: AWSError, data: Connect.Types.ListRoutingProfileQueuesResponse) => void): Request<Connect.Types.ListRoutingProfileQueuesResponse, AWSError>;
  /**
   * Lists the queues associated with a routing profile.
   */
  listRoutingProfileQueues(callback?: (err: AWSError, data: Connect.Types.ListRoutingProfileQueuesResponse) => void): Request<Connect.Types.ListRoutingProfileQueuesResponse, AWSError>;
  /**
   * Provides summary information about the routing profiles for the specified Amazon Connect instance. For more information about routing profiles, see Routing Profiles and Create a Routing Profile in the Amazon Connect Administrator Guide.
   */
  listRoutingProfiles(params: Connect.Types.ListRoutingProfilesRequest, callback?: (err: AWSError, data: Connect.Types.ListRoutingProfilesResponse) => void): Request<Connect.Types.ListRoutingProfilesResponse, AWSError>;
  /**
   * Provides summary information about the routing profiles for the specified Amazon Connect instance. For more information about routing profiles, see Routing Profiles and Create a Routing Profile in the Amazon Connect Administrator Guide.
   */
  listRoutingProfiles(callback?: (err: AWSError, data: Connect.Types.ListRoutingProfilesResponse) => void): Request<Connect.Types.ListRoutingProfilesResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Returns a paginated list of all security keys associated with the instance.
   */
  listSecurityKeys(params: Connect.Types.ListSecurityKeysRequest, callback?: (err: AWSError, data: Connect.Types.ListSecurityKeysResponse) => void): Request<Connect.Types.ListSecurityKeysResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Returns a paginated list of all security keys associated with the instance.
   */
  listSecurityKeys(callback?: (err: AWSError, data: Connect.Types.ListSecurityKeysResponse) => void): Request<Connect.Types.ListSecurityKeysResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Lists the permissions granted to a security profile.
   */
  listSecurityProfilePermissions(params: Connect.Types.ListSecurityProfilePermissionsRequest, callback?: (err: AWSError, data: Connect.Types.ListSecurityProfilePermissionsResponse) => void): Request<Connect.Types.ListSecurityProfilePermissionsResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Lists the permissions granted to a security profile.
   */
  listSecurityProfilePermissions(callback?: (err: AWSError, data: Connect.Types.ListSecurityProfilePermissionsResponse) => void): Request<Connect.Types.ListSecurityProfilePermissionsResponse, AWSError>;
  /**
   * Provides summary information about the security profiles for the specified Amazon Connect instance. For more information about security profiles, see Security Profiles in the Amazon Connect Administrator Guide.
   */
  listSecurityProfiles(params: Connect.Types.ListSecurityProfilesRequest, callback?: (err: AWSError, data: Connect.Types.ListSecurityProfilesResponse) => void): Request<Connect.Types.ListSecurityProfilesResponse, AWSError>;
  /**
   * Provides summary information about the security profiles for the specified Amazon Connect instance. For more information about security profiles, see Security Profiles in the Amazon Connect Administrator Guide.
   */
  listSecurityProfiles(callback?: (err: AWSError, data: Connect.Types.ListSecurityProfilesResponse) => void): Request<Connect.Types.ListSecurityProfilesResponse, AWSError>;
  /**
   * Lists the tags for the specified resource. For sample policies that use tags, see Amazon Connect Identity-Based Policy Examples in the Amazon Connect Administrator Guide.
   */
  listTagsForResource(params: Connect.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Connect.Types.ListTagsForResourceResponse) => void): Request<Connect.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags for the specified resource. For sample policies that use tags, see Amazon Connect Identity-Based Policy Examples in the Amazon Connect Administrator Guide.
   */
  listTagsForResource(callback?: (err: AWSError, data: Connect.Types.ListTagsForResourceResponse) => void): Request<Connect.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the use cases for the integration association. 
   */
  listUseCases(params: Connect.Types.ListUseCasesRequest, callback?: (err: AWSError, data: Connect.Types.ListUseCasesResponse) => void): Request<Connect.Types.ListUseCasesResponse, AWSError>;
  /**
   * Lists the use cases for the integration association. 
   */
  listUseCases(callback?: (err: AWSError, data: Connect.Types.ListUseCasesResponse) => void): Request<Connect.Types.ListUseCasesResponse, AWSError>;
  /**
   * Provides summary information about the hierarchy groups for the specified Amazon Connect instance. For more information about agent hierarchies, see Set Up Agent Hierarchies in the Amazon Connect Administrator Guide.
   */
  listUserHierarchyGroups(params: Connect.Types.ListUserHierarchyGroupsRequest, callback?: (err: AWSError, data: Connect.Types.ListUserHierarchyGroupsResponse) => void): Request<Connect.Types.ListUserHierarchyGroupsResponse, AWSError>;
  /**
   * Provides summary information about the hierarchy groups for the specified Amazon Connect instance. For more information about agent hierarchies, see Set Up Agent Hierarchies in the Amazon Connect Administrator Guide.
   */
  listUserHierarchyGroups(callback?: (err: AWSError, data: Connect.Types.ListUserHierarchyGroupsResponse) => void): Request<Connect.Types.ListUserHierarchyGroupsResponse, AWSError>;
  /**
   * Provides summary information about the users for the specified Amazon Connect instance.
   */
  listUsers(params: Connect.Types.ListUsersRequest, callback?: (err: AWSError, data: Connect.Types.ListUsersResponse) => void): Request<Connect.Types.ListUsersResponse, AWSError>;
  /**
   * Provides summary information about the users for the specified Amazon Connect instance.
   */
  listUsers(callback?: (err: AWSError, data: Connect.Types.ListUsersResponse) => void): Request<Connect.Types.ListUsersResponse, AWSError>;
  /**
   * When a contact is being recorded, and the recording has been suspended using SuspendContactRecording, this API resumes recording the call. Only voice recordings are supported at this time.
   */
  resumeContactRecording(params: Connect.Types.ResumeContactRecordingRequest, callback?: (err: AWSError, data: Connect.Types.ResumeContactRecordingResponse) => void): Request<Connect.Types.ResumeContactRecordingResponse, AWSError>;
  /**
   * When a contact is being recorded, and the recording has been suspended using SuspendContactRecording, this API resumes recording the call. Only voice recordings are supported at this time.
   */
  resumeContactRecording(callback?: (err: AWSError, data: Connect.Types.ResumeContactRecordingResponse) => void): Request<Connect.Types.ResumeContactRecordingResponse, AWSError>;
  /**
   * Initiates a contact flow to start a new chat for the customer. Response of this API provides a token required to obtain credentials from the CreateParticipantConnection API in the Amazon Connect Participant Service. When a new chat contact is successfully created, clients must subscribe to the participant’s connection for the created chat within 5 minutes. This is achieved by invoking CreateParticipantConnection with WEBSOCKET and CONNECTION_CREDENTIALS.  A 429 error occurs in two situations:   API rate limit is exceeded. API TPS throttling returns a TooManyRequests exception.   The quota for concurrent active chats is exceeded. Active chat throttling returns a LimitExceededException.   For more information about chat, see Chat in the Amazon Connect Administrator Guide.
   */
  startChatContact(params: Connect.Types.StartChatContactRequest, callback?: (err: AWSError, data: Connect.Types.StartChatContactResponse) => void): Request<Connect.Types.StartChatContactResponse, AWSError>;
  /**
   * Initiates a contact flow to start a new chat for the customer. Response of this API provides a token required to obtain credentials from the CreateParticipantConnection API in the Amazon Connect Participant Service. When a new chat contact is successfully created, clients must subscribe to the participant’s connection for the created chat within 5 minutes. This is achieved by invoking CreateParticipantConnection with WEBSOCKET and CONNECTION_CREDENTIALS.  A 429 error occurs in two situations:   API rate limit is exceeded. API TPS throttling returns a TooManyRequests exception.   The quota for concurrent active chats is exceeded. Active chat throttling returns a LimitExceededException.   For more information about chat, see Chat in the Amazon Connect Administrator Guide.
   */
  startChatContact(callback?: (err: AWSError, data: Connect.Types.StartChatContactResponse) => void): Request<Connect.Types.StartChatContactResponse, AWSError>;
  /**
   * Starts recording the contact when the agent joins the call. StartContactRecording is a one-time action. For example, if you use StopContactRecording to stop recording an ongoing call, you can't use StartContactRecording to restart it. For scenarios where the recording has started and you want to suspend and resume it, such as when collecting sensitive information (for example, a credit card number), use SuspendContactRecording and ResumeContactRecording. You can use this API to override the recording behavior configured in the Set recording behavior block. Only voice recordings are supported at this time.
   */
  startContactRecording(params: Connect.Types.StartContactRecordingRequest, callback?: (err: AWSError, data: Connect.Types.StartContactRecordingResponse) => void): Request<Connect.Types.StartContactRecordingResponse, AWSError>;
  /**
   * Starts recording the contact when the agent joins the call. StartContactRecording is a one-time action. For example, if you use StopContactRecording to stop recording an ongoing call, you can't use StartContactRecording to restart it. For scenarios where the recording has started and you want to suspend and resume it, such as when collecting sensitive information (for example, a credit card number), use SuspendContactRecording and ResumeContactRecording. You can use this API to override the recording behavior configured in the Set recording behavior block. Only voice recordings are supported at this time.
   */
  startContactRecording(callback?: (err: AWSError, data: Connect.Types.StartContactRecordingResponse) => void): Request<Connect.Types.StartContactRecordingResponse, AWSError>;
  /**
   *  Initiates real-time message streaming for a new chat contact.  For more information about message streaming, see Enable real-time chat message streaming in the Amazon Connect Administrator Guide.
   */
  startContactStreaming(params: Connect.Types.StartContactStreamingRequest, callback?: (err: AWSError, data: Connect.Types.StartContactStreamingResponse) => void): Request<Connect.Types.StartContactStreamingResponse, AWSError>;
  /**
   *  Initiates real-time message streaming for a new chat contact.  For more information about message streaming, see Enable real-time chat message streaming in the Amazon Connect Administrator Guide.
   */
  startContactStreaming(callback?: (err: AWSError, data: Connect.Types.StartContactStreamingResponse) => void): Request<Connect.Types.StartContactStreamingResponse, AWSError>;
  /**
   * Places an outbound call to a contact, and then initiates the contact flow. It performs the actions in the contact flow that's specified (in ContactFlowId). Agents do not initiate the outbound API, which means that they do not dial the contact. If the contact flow places an outbound call to a contact, and then puts the contact in queue, the call is then routed to the agent, like any other inbound case. There is a 60-second dialing timeout for this operation. If the call is not connected after 60 seconds, it fails.  UK numbers with a 447 prefix are not allowed by default. Before you can dial these UK mobile numbers, you must submit a service quota increase request. For more information, see Amazon Connect Service Quotas in the Amazon Connect Administrator Guide.    Campaign calls are not allowed by default. Before you can make a call with TrafficType = CAMPAIGN, you must submit a service quota increase request. For more information, see Amazon Connect Service Quotas in the Amazon Connect Administrator Guide.  
   */
  startOutboundVoiceContact(params: Connect.Types.StartOutboundVoiceContactRequest, callback?: (err: AWSError, data: Connect.Types.StartOutboundVoiceContactResponse) => void): Request<Connect.Types.StartOutboundVoiceContactResponse, AWSError>;
  /**
   * Places an outbound call to a contact, and then initiates the contact flow. It performs the actions in the contact flow that's specified (in ContactFlowId). Agents do not initiate the outbound API, which means that they do not dial the contact. If the contact flow places an outbound call to a contact, and then puts the contact in queue, the call is then routed to the agent, like any other inbound case. There is a 60-second dialing timeout for this operation. If the call is not connected after 60 seconds, it fails.  UK numbers with a 447 prefix are not allowed by default. Before you can dial these UK mobile numbers, you must submit a service quota increase request. For more information, see Amazon Connect Service Quotas in the Amazon Connect Administrator Guide.    Campaign calls are not allowed by default. Before you can make a call with TrafficType = CAMPAIGN, you must submit a service quota increase request. For more information, see Amazon Connect Service Quotas in the Amazon Connect Administrator Guide.  
   */
  startOutboundVoiceContact(callback?: (err: AWSError, data: Connect.Types.StartOutboundVoiceContactResponse) => void): Request<Connect.Types.StartOutboundVoiceContactResponse, AWSError>;
  /**
   * Initiates a contact flow to start a new task immediately or at a future date and time.
   */
  startTaskContact(params: Connect.Types.StartTaskContactRequest, callback?: (err: AWSError, data: Connect.Types.StartTaskContactResponse) => void): Request<Connect.Types.StartTaskContactResponse, AWSError>;
  /**
   * Initiates a contact flow to start a new task immediately or at a future date and time.
   */
  startTaskContact(callback?: (err: AWSError, data: Connect.Types.StartTaskContactResponse) => void): Request<Connect.Types.StartTaskContactResponse, AWSError>;
  /**
   * Ends the specified contact.
   */
  stopContact(params: Connect.Types.StopContactRequest, callback?: (err: AWSError, data: Connect.Types.StopContactResponse) => void): Request<Connect.Types.StopContactResponse, AWSError>;
  /**
   * Ends the specified contact.
   */
  stopContact(callback?: (err: AWSError, data: Connect.Types.StopContactResponse) => void): Request<Connect.Types.StopContactResponse, AWSError>;
  /**
   * Stops recording a call when a contact is being recorded. StopContactRecording is a one-time action. If you use StopContactRecording to stop recording an ongoing call, you can't use StartContactRecording to restart it. For scenarios where the recording has started and you want to suspend it for sensitive information (for example, to collect a credit card number), and then restart it, use SuspendContactRecording and ResumeContactRecording. Only voice recordings are supported at this time.
   */
  stopContactRecording(params: Connect.Types.StopContactRecordingRequest, callback?: (err: AWSError, data: Connect.Types.StopContactRecordingResponse) => void): Request<Connect.Types.StopContactRecordingResponse, AWSError>;
  /**
   * Stops recording a call when a contact is being recorded. StopContactRecording is a one-time action. If you use StopContactRecording to stop recording an ongoing call, you can't use StartContactRecording to restart it. For scenarios where the recording has started and you want to suspend it for sensitive information (for example, to collect a credit card number), and then restart it, use SuspendContactRecording and ResumeContactRecording. Only voice recordings are supported at this time.
   */
  stopContactRecording(callback?: (err: AWSError, data: Connect.Types.StopContactRecordingResponse) => void): Request<Connect.Types.StopContactRecordingResponse, AWSError>;
  /**
   *  Ends message streaming on a specified contact. To restart message streaming on that contact, call the StartContactStreaming API. 
   */
  stopContactStreaming(params: Connect.Types.StopContactStreamingRequest, callback?: (err: AWSError, data: Connect.Types.StopContactStreamingResponse) => void): Request<Connect.Types.StopContactStreamingResponse, AWSError>;
  /**
   *  Ends message streaming on a specified contact. To restart message streaming on that contact, call the StartContactStreaming API. 
   */
  stopContactStreaming(callback?: (err: AWSError, data: Connect.Types.StopContactStreamingResponse) => void): Request<Connect.Types.StopContactStreamingResponse, AWSError>;
  /**
   * When a contact is being recorded, this API suspends recording the call. For example, you might suspend the call recording while collecting sensitive information, such as a credit card number. Then use ResumeContactRecording to restart recording.  The period of time that the recording is suspended is filled with silence in the final recording.  Only voice recordings are supported at this time.
   */
  suspendContactRecording(params: Connect.Types.SuspendContactRecordingRequest, callback?: (err: AWSError, data: Connect.Types.SuspendContactRecordingResponse) => void): Request<Connect.Types.SuspendContactRecordingResponse, AWSError>;
  /**
   * When a contact is being recorded, this API suspends recording the call. For example, you might suspend the call recording while collecting sensitive information, such as a credit card number. Then use ResumeContactRecording to restart recording.  The period of time that the recording is suspended is filled with silence in the final recording.  Only voice recordings are supported at this time.
   */
  suspendContactRecording(callback?: (err: AWSError, data: Connect.Types.SuspendContactRecordingResponse) => void): Request<Connect.Types.SuspendContactRecordingResponse, AWSError>;
  /**
   * Adds the specified tags to the specified resource. The supported resource types are users, routing profiles, queues, quick connects, contact flows, agent status, and hours of operation. For sample policies that use tags, see Amazon Connect Identity-Based Policy Examples in the Amazon Connect Administrator Guide.
   */
  tagResource(params: Connect.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds the specified tags to the specified resource. The supported resource types are users, routing profiles, queues, quick connects, contact flows, agent status, and hours of operation. For sample policies that use tags, see Amazon Connect Identity-Based Policy Examples in the Amazon Connect Administrator Guide.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the specified resource.
   */
  untagResource(params: Connect.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the specified resource.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Updates agent status.
   */
  updateAgentStatus(params: Connect.Types.UpdateAgentStatusRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Updates agent status.
   */
  updateAgentStatus(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Adds or updates user defined contact information associated with the specified contact. At least one field to be updated must be present in the request.  You can add or update user-defined contact information for both ongoing and completed contacts. 
   */
  updateContact(params: Connect.Types.UpdateContactRequest, callback?: (err: AWSError, data: Connect.Types.UpdateContactResponse) => void): Request<Connect.Types.UpdateContactResponse, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Adds or updates user defined contact information associated with the specified contact. At least one field to be updated must be present in the request.  You can add or update user-defined contact information for both ongoing and completed contacts. 
   */
  updateContact(callback?: (err: AWSError, data: Connect.Types.UpdateContactResponse) => void): Request<Connect.Types.UpdateContactResponse, AWSError>;
  /**
   * Creates or updates user-defined contact attributes associated with the specified contact. You can create or update user-defined attributes for both ongoing and completed contacts. For example, while the call is active, you can update the customer's name or the reason the customer called. You can add notes about steps that the agent took during the call that display to the next agent that takes the call. You can also update attributes for a contact using data from your CRM application and save the data with the contact in Amazon Connect. You could also flag calls for additional analysis, such as legal review or to identify abusive callers. Contact attributes are available in Amazon Connect for 24 months, and are then deleted. For information about CTR retention and the maximum size of the CTR attributes section, see Feature specifications in the Amazon Connect Administrator Guide.   Important: You cannot use the operation to update attributes for contacts that occurred prior to the release of the API, which was September 12, 2018. You can update attributes only for contacts that started after the release of the API. If you attempt to update attributes for a contact that occurred prior to the release of the API, a 400 error is returned. This applies also to queued callbacks that were initiated prior to the release of the API but are still active in your instance.
   */
  updateContactAttributes(params: Connect.Types.UpdateContactAttributesRequest, callback?: (err: AWSError, data: Connect.Types.UpdateContactAttributesResponse) => void): Request<Connect.Types.UpdateContactAttributesResponse, AWSError>;
  /**
   * Creates or updates user-defined contact attributes associated with the specified contact. You can create or update user-defined attributes for both ongoing and completed contacts. For example, while the call is active, you can update the customer's name or the reason the customer called. You can add notes about steps that the agent took during the call that display to the next agent that takes the call. You can also update attributes for a contact using data from your CRM application and save the data with the contact in Amazon Connect. You could also flag calls for additional analysis, such as legal review or to identify abusive callers. Contact attributes are available in Amazon Connect for 24 months, and are then deleted. For information about CTR retention and the maximum size of the CTR attributes section, see Feature specifications in the Amazon Connect Administrator Guide.   Important: You cannot use the operation to update attributes for contacts that occurred prior to the release of the API, which was September 12, 2018. You can update attributes only for contacts that started after the release of the API. If you attempt to update attributes for a contact that occurred prior to the release of the API, a 400 error is returned. This applies also to queued callbacks that were initiated prior to the release of the API but are still active in your instance.
   */
  updateContactAttributes(callback?: (err: AWSError, data: Connect.Types.UpdateContactAttributesResponse) => void): Request<Connect.Types.UpdateContactAttributesResponse, AWSError>;
  /**
   * Updates the specified contact flow. You can also create and update contact flows using the Amazon Connect Flow language.
   */
  updateContactFlowContent(params: Connect.Types.UpdateContactFlowContentRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the specified contact flow. You can also create and update contact flows using the Amazon Connect Flow language.
   */
  updateContactFlowContent(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * The name of the contact flow. You can also create and update contact flows using the Amazon Connect Flow language.
   */
  updateContactFlowName(params: Connect.Types.UpdateContactFlowNameRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * The name of the contact flow. You can also create and update contact flows using the Amazon Connect Flow language.
   */
  updateContactFlowName(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the scheduled time of a task contact that is already scheduled.
   */
  updateContactSchedule(params: Connect.Types.UpdateContactScheduleRequest, callback?: (err: AWSError, data: Connect.Types.UpdateContactScheduleResponse) => void): Request<Connect.Types.UpdateContactScheduleResponse, AWSError>;
  /**
   * Updates the scheduled time of a task contact that is already scheduled.
   */
  updateContactSchedule(callback?: (err: AWSError, data: Connect.Types.UpdateContactScheduleResponse) => void): Request<Connect.Types.UpdateContactScheduleResponse, AWSError>;
  /**
   * Updates the hours of operation.
   */
  updateHoursOfOperation(params: Connect.Types.UpdateHoursOfOperationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the hours of operation.
   */
  updateHoursOfOperation(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Updates the value for the specified attribute type.
   */
  updateInstanceAttribute(params: Connect.Types.UpdateInstanceAttributeRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Updates the value for the specified attribute type.
   */
  updateInstanceAttribute(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Updates an existing configuration for a resource type. This API is idempotent.
   */
  updateInstanceStorageConfig(params: Connect.Types.UpdateInstanceStorageConfigRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Updates an existing configuration for a resource type. This API is idempotent.
   */
  updateInstanceStorageConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Updates the hours of operation for the specified queue.
   */
  updateQueueHoursOfOperation(params: Connect.Types.UpdateQueueHoursOfOperationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Updates the hours of operation for the specified queue.
   */
  updateQueueHoursOfOperation(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Updates the maximum number of contacts allowed in a queue before it is considered full.
   */
  updateQueueMaxContacts(params: Connect.Types.UpdateQueueMaxContactsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Updates the maximum number of contacts allowed in a queue before it is considered full.
   */
  updateQueueMaxContacts(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Updates the name and description of a queue. At least Name or Description must be provided.
   */
  updateQueueName(params: Connect.Types.UpdateQueueNameRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Updates the name and description of a queue. At least Name or Description must be provided.
   */
  updateQueueName(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Updates the outbound caller ID name, number, and outbound whisper flow for a specified queue.
   */
  updateQueueOutboundCallerConfig(params: Connect.Types.UpdateQueueOutboundCallerConfigRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Updates the outbound caller ID name, number, and outbound whisper flow for a specified queue.
   */
  updateQueueOutboundCallerConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Updates the status of the queue.
   */
  updateQueueStatus(params: Connect.Types.UpdateQueueStatusRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Updates the status of the queue.
   */
  updateQueueStatus(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the configuration settings for the specified quick connect.
   */
  updateQuickConnectConfig(params: Connect.Types.UpdateQuickConnectConfigRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the configuration settings for the specified quick connect.
   */
  updateQuickConnectConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the name and description of a quick connect. The request accepts the following data in JSON format. At least Name or Description must be provided.
   */
  updateQuickConnectName(params: Connect.Types.UpdateQuickConnectNameRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the name and description of a quick connect. The request accepts the following data in JSON format. At least Name or Description must be provided.
   */
  updateQuickConnectName(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the channels that agents can handle in the Contact Control Panel (CCP) for a routing profile.
   */
  updateRoutingProfileConcurrency(params: Connect.Types.UpdateRoutingProfileConcurrencyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the channels that agents can handle in the Contact Control Panel (CCP) for a routing profile.
   */
  updateRoutingProfileConcurrency(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the default outbound queue of a routing profile.
   */
  updateRoutingProfileDefaultOutboundQueue(params: Connect.Types.UpdateRoutingProfileDefaultOutboundQueueRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the default outbound queue of a routing profile.
   */
  updateRoutingProfileDefaultOutboundQueue(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the name and description of a routing profile. The request accepts the following data in JSON format. At least Name or Description must be provided.
   */
  updateRoutingProfileName(params: Connect.Types.UpdateRoutingProfileNameRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the name and description of a routing profile. The request accepts the following data in JSON format. At least Name or Description must be provided.
   */
  updateRoutingProfileName(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the properties associated with a set of queues for a routing profile.
   */
  updateRoutingProfileQueues(params: Connect.Types.UpdateRoutingProfileQueuesRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the properties associated with a set of queues for a routing profile.
   */
  updateRoutingProfileQueues(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Updates a security profile.
   */
  updateSecurityProfile(params: Connect.Types.UpdateSecurityProfileRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * This API is in preview release for Amazon Connect and is subject to change. Updates a security profile.
   */
  updateSecurityProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Assigns the specified hierarchy group to the specified user.
   */
  updateUserHierarchy(params: Connect.Types.UpdateUserHierarchyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Assigns the specified hierarchy group to the specified user.
   */
  updateUserHierarchy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the name of the user hierarchy group. 
   */
  updateUserHierarchyGroupName(params: Connect.Types.UpdateUserHierarchyGroupNameRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the name of the user hierarchy group. 
   */
  updateUserHierarchyGroupName(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the user hierarchy structure: add, remove, and rename user hierarchy levels.
   */
  updateUserHierarchyStructure(params: Connect.Types.UpdateUserHierarchyStructureRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the user hierarchy structure: add, remove, and rename user hierarchy levels.
   */
  updateUserHierarchyStructure(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the identity information for the specified user.  We strongly recommend limiting who has the ability to invoke UpdateUserIdentityInfo. Someone with that ability can change the login credentials of other users by changing their email address. This poses a security risk to your organization. They can change the email address of a user to the attacker's email address, and then reset the password through email. For more information, see Best Practices for Security Profiles in the Amazon Connect Administrator Guide. 
   */
  updateUserIdentityInfo(params: Connect.Types.UpdateUserIdentityInfoRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the identity information for the specified user.  We strongly recommend limiting who has the ability to invoke UpdateUserIdentityInfo. Someone with that ability can change the login credentials of other users by changing their email address. This poses a security risk to your organization. They can change the email address of a user to the attacker's email address, and then reset the password through email. For more information, see Best Practices for Security Profiles in the Amazon Connect Administrator Guide. 
   */
  updateUserIdentityInfo(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the phone configuration settings for the specified user.
   */
  updateUserPhoneConfig(params: Connect.Types.UpdateUserPhoneConfigRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the phone configuration settings for the specified user.
   */
  updateUserPhoneConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Assigns the specified routing profile to the specified user.
   */
  updateUserRoutingProfile(params: Connect.Types.UpdateUserRoutingProfileRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Assigns the specified routing profile to the specified user.
   */
  updateUserRoutingProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Assigns the specified security profiles to the specified user.
   */
  updateUserSecurityProfiles(params: Connect.Types.UpdateUserSecurityProfilesRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Assigns the specified security profiles to the specified user.
   */
  updateUserSecurityProfiles(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace Connect {
  export type ARN = string;
  export type AfterContactWorkTimeLimit = number;
  export type AgentFirstName = string;
  export interface AgentInfo {
    /**
     * The identifier of the agent who accepted the contact.
     */
    Id?: AgentResourceId;
    /**
     * The timestamp when the contact was connected to the agent.
     */
    ConnectedToAgentTimestamp?: timestamp;
  }
  export type AgentLastName = string;
  export type AgentResourceId = string;
  export interface AgentStatus {
    /**
     * The Amazon Resource Name (ARN) of the agent status.
     */
    AgentStatusARN?: ARN;
    /**
     * The identifier of the agent status.
     */
    AgentStatusId?: AgentStatusId;
    /**
     * The name of the agent status.
     */
    Name?: AgentStatusName;
    /**
     * The description of the agent status.
     */
    Description?: AgentStatusDescription;
    /**
     * The type of agent status.
     */
    Type?: AgentStatusType;
    /**
     * The display order of the agent status.
     */
    DisplayOrder?: AgentStatusOrderNumber;
    /**
     * The state of the agent status.
     */
    State?: AgentStatusState;
    /**
     * One or more tags.
     */
    Tags?: TagMap;
  }
  export type AgentStatusDescription = string;
  export type AgentStatusId = string;
  export type AgentStatusName = string;
  export type AgentStatusOrderNumber = number;
  export type AgentStatusState = "ENABLED"|"DISABLED"|string;
  export interface AgentStatusSummary {
    /**
     * The identifier for an agent status.
     */
    Id?: AgentStatusId;
    /**
     * The Amazon Resource Name (ARN) for the agent status.
     */
    Arn?: ARN;
    /**
     * The name of the agent status.
     */
    Name?: AgentStatusName;
    /**
     * The type of the agent status.
     */
    Type?: AgentStatusType;
  }
  export type AgentStatusSummaryList = AgentStatusSummary[];
  export type AgentStatusType = "ROUTABLE"|"CUSTOM"|"OFFLINE"|string;
  export type AgentStatusTypes = AgentStatusType[];
  export type AgentUsername = string;
  export type AliasArn = string;
  export interface AnswerMachineDetectionConfig {
    /**
     * The flag to indicate if answer machine detection analysis needs to be performed for a voice call. If set to true, TrafficType must be set as CAMPAIGN. 
     */
    EnableAnswerMachineDetection?: Boolean;
    /**
     * Wait for the answering machine prompt.
     */
    AwaitAnswerMachinePrompt?: Boolean;
  }
  export interface AssociateApprovedOriginRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The domain to add to your allow list.
     */
    Origin: Origin;
  }
  export interface AssociateBotRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    LexBot?: LexBot;
    /**
     * The Amazon Lex V2 bot to associate with the instance.
     */
    LexV2Bot?: LexV2Bot;
  }
  export interface AssociateInstanceStorageConfigRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * A valid resource type.
     */
    ResourceType: InstanceStorageResourceType;
    /**
     * A valid storage type.
     */
    StorageConfig: InstanceStorageConfig;
  }
  export interface AssociateInstanceStorageConfigResponse {
    /**
     * The existing association identifier that uniquely identifies the resource type and storage config for the given instance ID.
     */
    AssociationId?: AssociationId;
  }
  export interface AssociateLambdaFunctionRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The Amazon Resource Name (ARN) for the Lambda function being associated. Maximum number of characters allowed is 140.
     */
    FunctionArn: FunctionArn;
  }
  export interface AssociateLexBotRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The Amazon Lex bot to associate with the instance.
     */
    LexBot: LexBot;
  }
  export interface AssociateQueueQuickConnectsRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the queue.
     */
    QueueId: QueueId;
    /**
     * The quick connects to associate with this queue.
     */
    QuickConnectIds: QuickConnectsList;
  }
  export interface AssociateRoutingProfileQueuesRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the routing profile.
     */
    RoutingProfileId: RoutingProfileId;
    /**
     * The queues to associate with this routing profile.
     */
    QueueConfigs: RoutingProfileQueueConfigList;
  }
  export interface AssociateSecurityKeyRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * A valid security key in PEM format.
     */
    Key: PEM;
  }
  export interface AssociateSecurityKeyResponse {
    /**
     * The existing association identifier that uniquely identifies the resource type and storage config for the given instance ID.
     */
    AssociationId?: AssociationId;
  }
  export type AssociationId = string;
  export interface AttachmentReference {
    /**
     * Identifier of the attachment reference.
     */
    Name?: ReferenceKey;
    /**
     * Contains the location path of the attachment reference.
     */
    Value?: ReferenceValue;
    /**
     * Status of an attachment reference type.
     */
    Status?: ReferenceStatus;
  }
  export interface Attribute {
    /**
     * The type of attribute.
     */
    AttributeType?: InstanceAttributeType;
    /**
     * The value of the attribute.
     */
    Value?: InstanceAttributeValue;
  }
  export type AttributeName = string;
  export type AttributeValue = string;
  export type Attributes = {[key: string]: AttributeValue};
  export type AttributesList = Attribute[];
  export type AutoAccept = boolean;
  export type Boolean = boolean;
  export type BotName = string;
  export type BucketName = string;
  export type CampaignId = string;
  export type Channel = "VOICE"|"CHAT"|"TASK"|string;
  export type Channels = Channel[];
  export type ChatContent = string;
  export type ChatContentType = string;
  export interface ChatMessage {
    /**
     * The type of the content. Supported types are text and plain.
     */
    ContentType: ChatContentType;
    /**
     * The content of the chat message.
     */
    Content: ChatContent;
  }
  export interface ChatStreamingConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the standard Amazon SNS topic. The Amazon Resource Name (ARN) of the streaming endpoint that is used to publish real-time message streaming for chat conversations.
     */
    StreamingEndpointArn: ChatStreamingEndpointARN;
  }
  export type ChatStreamingEndpointARN = string;
  export type ClientToken = string;
  export type CommonNameLength127 = string;
  export type Comparison = "LT"|string;
  export type Concurrency = number;
  export interface Contact {
    /**
     * The Amazon Resource Name (ARN) for the contact.
     */
    Arn?: ARN;
    /**
     * The identifier for the contact.
     */
    Id?: ContactId;
    /**
     * If this contact is related to other contacts, this is the ID of the initial contact.
     */
    InitialContactId?: ContactId;
    /**
     * If this contact is not the first contact, this is the ID of the previous contact.
     */
    PreviousContactId?: ContactId;
    /**
     * Indicates how the contact was initiated.
     */
    InitiationMethod?: ContactInitiationMethod;
    /**
     * The name of the contact.
     */
    Name?: Name;
    /**
     * The description of the contact.
     */
    Description?: Description;
    /**
     * How the contact reached your contact center.
     */
    Channel?: Channel;
    /**
     * If this contact was queued, this contains information about the queue. 
     */
    QueueInfo?: QueueInfo;
    /**
     * Information about the agent who accepted the contact.
     */
    AgentInfo?: AgentInfo;
    /**
     * The date and time this contact was initiated, in UTC time. For INBOUND, this is when the contact arrived. For OUTBOUND, this is when the agent began dialing. For CALLBACK, this is when the callback contact was created. For TRANSFER and QUEUE_TRANSFER, this is when the transfer was initiated. For API, this is when the request arrived.
     */
    InitiationTimestamp?: timestamp;
    /**
     * The timestamp when the customer endpoint disconnected from Amazon Connect.
     */
    DisconnectTimestamp?: timestamp;
    /**
     * The timestamp when contact was last updated.
     */
    LastUpdateTimestamp?: timestamp;
    /**
     * The timestamp, in Unix epoch time format, at which to start running the inbound flow. 
     */
    ScheduledTimestamp?: timestamp;
  }
  export interface ContactFlow {
    /**
     * The Amazon Resource Name (ARN) of the contact flow.
     */
    Arn?: ARN;
    /**
     * The identifier of the contact flow.
     */
    Id?: ContactFlowId;
    /**
     * The name of the contact flow.
     */
    Name?: ContactFlowName;
    /**
     * The type of the contact flow. For descriptions of the available types, see Choose a Contact Flow Type in the Amazon Connect Administrator Guide.
     */
    Type?: ContactFlowType;
    /**
     * The description of the contact flow.
     */
    Description?: ContactFlowDescription;
    /**
     * The content of the contact flow.
     */
    Content?: ContactFlowContent;
    /**
     * One or more tags.
     */
    Tags?: TagMap;
  }
  export type ContactFlowContent = string;
  export type ContactFlowDescription = string;
  export type ContactFlowId = string;
  export type ContactFlowName = string;
  export interface ContactFlowSummary {
    /**
     * The identifier of the contact flow.
     */
    Id?: ContactFlowId;
    /**
     * The Amazon Resource Name (ARN) of the contact flow.
     */
    Arn?: ARN;
    /**
     * The name of the contact flow.
     */
    Name?: ContactFlowName;
    /**
     * The type of contact flow.
     */
    ContactFlowType?: ContactFlowType;
  }
  export type ContactFlowSummaryList = ContactFlowSummary[];
  export type ContactFlowType = "CONTACT_FLOW"|"CUSTOMER_QUEUE"|"CUSTOMER_HOLD"|"CUSTOMER_WHISPER"|"AGENT_HOLD"|"AGENT_WHISPER"|"OUTBOUND_WHISPER"|"AGENT_TRANSFER"|"QUEUE_TRANSFER"|string;
  export type ContactFlowTypes = ContactFlowType[];
  export type ContactId = string;
  export type ContactInitiationMethod = "INBOUND"|"OUTBOUND"|"TRANSFER"|"QUEUE_TRANSFER"|"CALLBACK"|"API"|string;
  export type ContactReferences = {[key: string]: Reference};
  export interface CreateAgentStatusRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The name of the status.
     */
    Name: AgentStatusName;
    /**
     * The description of the status.
     */
    Description?: AgentStatusDescription;
    /**
     * The state of the status.
     */
    State: AgentStatusState;
    /**
     * The display order of the status.
     */
    DisplayOrder?: AgentStatusOrderNumber;
    /**
     * One or more tags.
     */
    Tags?: TagMap;
  }
  export interface CreateAgentStatusResponse {
    /**
     * The Amazon Resource Name (ARN) of the agent status.
     */
    AgentStatusARN?: ARN;
    /**
     * The identifier of the agent status.
     */
    AgentStatusId?: AgentStatusId;
  }
  export interface CreateContactFlowRequest {
    /**
     * The identifier of the Amazon Connect instance.
     */
    InstanceId: InstanceId;
    /**
     * The name of the contact flow.
     */
    Name: ContactFlowName;
    /**
     * The type of the contact flow. For descriptions of the available types, see Choose a Contact Flow Type in the Amazon Connect Administrator Guide.
     */
    Type: ContactFlowType;
    /**
     * The description of the contact flow. 
     */
    Description?: ContactFlowDescription;
    /**
     * The content of the contact flow. 
     */
    Content: ContactFlowContent;
    /**
     * One or more tags.
     */
    Tags?: TagMap;
  }
  export interface CreateContactFlowResponse {
    /**
     * The identifier of the contact flow.
     */
    ContactFlowId?: ContactFlowId;
    /**
     * The Amazon Resource Name (ARN) of the contact flow.
     */
    ContactFlowArn?: ARN;
  }
  export interface CreateHoursOfOperationRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The name of the hours of operation.
     */
    Name: CommonNameLength127;
    /**
     * The description of the hours of operation.
     */
    Description?: HoursOfOperationDescription;
    /**
     * The time zone of the hours of operation.
     */
    TimeZone: TimeZone;
    /**
     * Configuration information for the hours of operation: day, start time, and end time.
     */
    Config: HoursOfOperationConfigList;
    /**
     * One or more tags.
     */
    Tags?: TagMap;
  }
  export interface CreateHoursOfOperationResponse {
    /**
     * The identifier for the hours of operation.
     */
    HoursOfOperationId?: HoursOfOperationId;
    /**
     * The Amazon Resource Name (ARN) for the hours of operation.
     */
    HoursOfOperationArn?: ARN;
  }
  export interface CreateInstanceRequest {
    /**
     * The idempotency token.
     */
    ClientToken?: ClientToken;
    /**
     * The type of identity management for your Amazon Connect users.
     */
    IdentityManagementType: DirectoryType;
    /**
     * The name for your instance.
     */
    InstanceAlias?: DirectoryAlias;
    /**
     * The identifier for the directory.
     */
    DirectoryId?: DirectoryId;
    /**
     * Your contact center handles incoming contacts.
     */
    InboundCallsEnabled: InboundCallsEnabled;
    /**
     * Your contact center allows outbound calls.
     */
    OutboundCallsEnabled: OutboundCallsEnabled;
  }
  export interface CreateInstanceResponse {
    /**
     * The identifier for the instance.
     */
    Id?: InstanceId;
    /**
     * The Amazon Resource Name (ARN) of the instance.
     */
    Arn?: ARN;
  }
  export interface CreateIntegrationAssociationRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The type of information to be ingested.
     */
    IntegrationType: IntegrationType;
    /**
     * The Amazon Resource Name (ARN) of the integration.
     */
    IntegrationArn: ARN;
    /**
     * The URL for the external application. This field is only required for the EVENT integration type.
     */
    SourceApplicationUrl?: URI;
    /**
     * The name of the external application. This field is only required for the EVENT integration type.
     */
    SourceApplicationName?: SourceApplicationName;
    /**
     * The type of the data source. This field is only required for the EVENT integration type.
     */
    SourceType?: SourceType;
    /**
     * One or more tags.
     */
    Tags?: TagMap;
  }
  export interface CreateIntegrationAssociationResponse {
    /**
     * The identifier for the integration association.
     */
    IntegrationAssociationId?: IntegrationAssociationId;
    /**
     * The Amazon Resource Name (ARN) for the association.
     */
    IntegrationAssociationArn?: ARN;
  }
  export interface CreateQueueRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The name of the queue.
     */
    Name: CommonNameLength127;
    /**
     * The description of the queue.
     */
    Description?: QueueDescription;
    /**
     * The outbound caller ID name, number, and outbound whisper flow.
     */
    OutboundCallerConfig?: OutboundCallerConfig;
    /**
     * The identifier for the hours of operation.
     */
    HoursOfOperationId: HoursOfOperationId;
    /**
     * The maximum number of contacts that can be in the queue before it is considered full.
     */
    MaxContacts?: QueueMaxContacts;
    /**
     * The quick connects available to agents who are working the queue.
     */
    QuickConnectIds?: QuickConnectsList;
    /**
     * One or more tags.
     */
    Tags?: TagMap;
  }
  export interface CreateQueueResponse {
    /**
     * The Amazon Resource Name (ARN) of the queue.
     */
    QueueArn?: ARN;
    /**
     * The identifier for the queue.
     */
    QueueId?: QueueId;
  }
  export interface CreateQuickConnectRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The name of the quick connect.
     */
    Name: QuickConnectName;
    /**
     * The description of the quick connect.
     */
    Description?: QuickConnectDescription;
    /**
     * Configuration settings for the quick connect.
     */
    QuickConnectConfig: QuickConnectConfig;
    /**
     * One or more tags.
     */
    Tags?: TagMap;
  }
  export interface CreateQuickConnectResponse {
    /**
     * The Amazon Resource Name (ARN) for the quick connect. 
     */
    QuickConnectARN?: ARN;
    /**
     * The identifier for the quick connect. 
     */
    QuickConnectId?: QuickConnectId;
  }
  export interface CreateRoutingProfileRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The name of the routing profile. Must not be more than 127 characters.
     */
    Name: RoutingProfileName;
    /**
     * Description of the routing profile. Must not be more than 250 characters.
     */
    Description: RoutingProfileDescription;
    /**
     * The default outbound queue for the routing profile.
     */
    DefaultOutboundQueueId: QueueId;
    /**
     * The inbound queues associated with the routing profile. If no queue is added, the agent can make only outbound calls.
     */
    QueueConfigs?: RoutingProfileQueueConfigList;
    /**
     * The channels that agents can handle in the Contact Control Panel (CCP) for this routing profile.
     */
    MediaConcurrencies: MediaConcurrencies;
    /**
     * One or more tags.
     */
    Tags?: TagMap;
  }
  export interface CreateRoutingProfileResponse {
    /**
     * The Amazon Resource Name (ARN) of the routing profile.
     */
    RoutingProfileArn?: ARN;
    /**
     * The identifier of the routing profile.
     */
    RoutingProfileId?: RoutingProfileId;
  }
  export interface CreateSecurityProfileRequest {
    /**
     * The name of the security profile.
     */
    SecurityProfileName: SecurityProfileName;
    /**
     * The description of the security profile.
     */
    Description?: SecurityProfileDescription;
    /**
     * Permissions assigned to the security profile.
     */
    Permissions?: PermissionsList;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * One or more tags.
     */
    Tags?: TagMap;
  }
  export interface CreateSecurityProfileResponse {
    /**
     * The identifier for the security profle.
     */
    SecurityProfileId?: SecurityProfileId;
    /**
     * The Amazon Resource Name (ARN) for the security profile.
     */
    SecurityProfileArn?: ARN;
  }
  export interface CreateUseCaseRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the integration association.
     */
    IntegrationAssociationId: IntegrationAssociationId;
    /**
     * The type of use case to associate to the integration association. Each integration association can have only one of each use case type.
     */
    UseCaseType: UseCaseType;
    /**
     * One or more tags.
     */
    Tags?: TagMap;
  }
  export interface CreateUseCaseResponse {
    /**
     * The identifier of the use case.
     */
    UseCaseId?: UseCaseId;
    /**
     * The Amazon Resource Name (ARN) for the use case.
     */
    UseCaseArn?: ARN;
  }
  export interface CreateUserHierarchyGroupRequest {
    /**
     * The name of the user hierarchy group. Must not be more than 100 characters.
     */
    Name: HierarchyGroupName;
    /**
     * The identifier for the parent hierarchy group. The user hierarchy is created at level one if the parent group ID is null.
     */
    ParentGroupId?: HierarchyGroupId;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
  }
  export interface CreateUserHierarchyGroupResponse {
    /**
     * The identifier of the hierarchy group.
     */
    HierarchyGroupId?: HierarchyGroupId;
    /**
     * The Amazon Resource Name (ARN) of the hierarchy group. 
     */
    HierarchyGroupArn?: ARN;
  }
  export interface CreateUserRequest {
    /**
     * The user name for the account. For instances not using SAML for identity management, the user name can include up to 20 characters. If you are using SAML for identity management, the user name can include up to 64 characters from [a-zA-Z0-9_-.\@]+.
     */
    Username: AgentUsername;
    /**
     * The password for the user account. A password is required if you are using Amazon Connect for identity management. Otherwise, it is an error to include a password.
     */
    Password?: Password;
    /**
     * The information about the identity of the user.
     */
    IdentityInfo?: UserIdentityInfo;
    /**
     * The phone settings for the user.
     */
    PhoneConfig: UserPhoneConfig;
    /**
     * The identifier of the user account in the directory used for identity management. If Amazon Connect cannot access the directory, you can specify this identifier to authenticate users. If you include the identifier, we assume that Amazon Connect cannot access the directory. Otherwise, the identity information is used to authenticate users from your directory. This parameter is required if you are using an existing directory for identity management in Amazon Connect when Amazon Connect cannot access your directory to authenticate users. If you are using SAML for identity management and include this parameter, an error is returned.
     */
    DirectoryUserId?: DirectoryUserId;
    /**
     * The identifier of the security profile for the user.
     */
    SecurityProfileIds: SecurityProfileIds;
    /**
     * The identifier of the routing profile for the user.
     */
    RoutingProfileId: RoutingProfileId;
    /**
     * The identifier of the hierarchy group for the user.
     */
    HierarchyGroupId?: HierarchyGroupId;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * One or more tags.
     */
    Tags?: TagMap;
  }
  export interface CreateUserResponse {
    /**
     * The identifier of the user account.
     */
    UserId?: UserId;
    /**
     * The Amazon Resource Name (ARN) of the user account.
     */
    UserArn?: ARN;
  }
  export interface Credentials {
    /**
     * An access token generated for a federated user to access Amazon Connect.
     */
    AccessToken?: SecurityToken;
    /**
     * A token generated with an expiration time for the session a user is logged in to Amazon Connect.
     */
    AccessTokenExpiration?: timestamp;
    /**
     * Renews a token generated for a user to access the Amazon Connect instance.
     */
    RefreshToken?: SecurityToken;
    /**
     * Renews the expiration timer for a generated token.
     */
    RefreshTokenExpiration?: timestamp;
  }
  export interface CurrentMetric {
    /**
     * The name of the metric.
     */
    Name?: CurrentMetricName;
    /**
     * The unit for the metric.
     */
    Unit?: Unit;
  }
  export interface CurrentMetricData {
    /**
     * Information about the metric.
     */
    Metric?: CurrentMetric;
    /**
     * The value of the metric.
     */
    Value?: Value;
  }
  export type CurrentMetricDataCollections = CurrentMetricData[];
  export type CurrentMetricName = "AGENTS_ONLINE"|"AGENTS_AVAILABLE"|"AGENTS_ON_CALL"|"AGENTS_NON_PRODUCTIVE"|"AGENTS_AFTER_CONTACT_WORK"|"AGENTS_ERROR"|"AGENTS_STAFFED"|"CONTACTS_IN_QUEUE"|"OLDEST_CONTACT_AGE"|"CONTACTS_SCHEDULED"|"AGENTS_ON_CONTACT"|"SLOTS_ACTIVE"|"SLOTS_AVAILABLE"|string;
  export interface CurrentMetricResult {
    /**
     * The dimensions for the metrics.
     */
    Dimensions?: Dimensions;
    /**
     * The set of metrics.
     */
    Collections?: CurrentMetricDataCollections;
  }
  export type CurrentMetricResults = CurrentMetricResult[];
  export type CurrentMetrics = CurrentMetric[];
  export type Delay = number;
  export interface DeleteHoursOfOperationRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the hours of operation.
     */
    HoursOfOperationId: HoursOfOperationId;
  }
  export interface DeleteInstanceRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
  }
  export interface DeleteIntegrationAssociationRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the integration association.
     */
    IntegrationAssociationId: IntegrationAssociationId;
  }
  export interface DeleteQuickConnectRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the quick connect.
     */
    QuickConnectId: QuickConnectId;
  }
  export interface DeleteSecurityProfileRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the security profle.
     */
    SecurityProfileId: SecurityProfileId;
  }
  export interface DeleteUseCaseRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the integration association.
     */
    IntegrationAssociationId: IntegrationAssociationId;
    /**
     * The identifier for the use case.
     */
    UseCaseId: UseCaseId;
  }
  export interface DeleteUserHierarchyGroupRequest {
    /**
     * The identifier of the hierarchy group.
     */
    HierarchyGroupId: HierarchyGroupId;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
  }
  export interface DeleteUserRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the user.
     */
    UserId: UserId;
  }
  export interface DescribeAgentStatusRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the agent status.
     */
    AgentStatusId: AgentStatusId;
  }
  export interface DescribeAgentStatusResponse {
    /**
     * The agent status.
     */
    AgentStatus?: AgentStatus;
  }
  export interface DescribeContactFlowRequest {
    /**
     * The identifier of the Amazon Connect instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the contact flow.
     */
    ContactFlowId: ContactFlowId;
  }
  export interface DescribeContactFlowResponse {
    /**
     * Information about the contact flow.
     */
    ContactFlow?: ContactFlow;
  }
  export interface DescribeContactRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the initial contact.
     */
    ContactId: ContactId;
  }
  export interface DescribeContactResponse {
    /**
     * Information about the contact.
     */
    Contact?: Contact;
  }
  export interface DescribeHoursOfOperationRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the hours of operation.
     */
    HoursOfOperationId: HoursOfOperationId;
  }
  export interface DescribeHoursOfOperationResponse {
    /**
     * The hours of operation.
     */
    HoursOfOperation?: HoursOfOperation;
  }
  export interface DescribeInstanceAttributeRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The type of attribute.
     */
    AttributeType: InstanceAttributeType;
  }
  export interface DescribeInstanceAttributeResponse {
    /**
     * The type of attribute.
     */
    Attribute?: Attribute;
  }
  export interface DescribeInstanceRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
  }
  export interface DescribeInstanceResponse {
    /**
     * The name of the instance.
     */
    Instance?: Instance;
  }
  export interface DescribeInstanceStorageConfigRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The existing association identifier that uniquely identifies the resource type and storage config for the given instance ID.
     */
    AssociationId: AssociationId;
    /**
     * A valid resource type.
     */
    ResourceType: InstanceStorageResourceType;
  }
  export interface DescribeInstanceStorageConfigResponse {
    /**
     * A valid storage type.
     */
    StorageConfig?: InstanceStorageConfig;
  }
  export interface DescribeQueueRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the queue.
     */
    QueueId: QueueId;
  }
  export interface DescribeQueueResponse {
    /**
     * The name of the queue.
     */
    Queue?: Queue;
  }
  export interface DescribeQuickConnectRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the quick connect.
     */
    QuickConnectId: QuickConnectId;
  }
  export interface DescribeQuickConnectResponse {
    /**
     * Information about the quick connect.
     */
    QuickConnect?: QuickConnect;
  }
  export interface DescribeRoutingProfileRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the routing profile.
     */
    RoutingProfileId: RoutingProfileId;
  }
  export interface DescribeRoutingProfileResponse {
    /**
     * The routing profile.
     */
    RoutingProfile?: RoutingProfile;
  }
  export interface DescribeSecurityProfileRequest {
    /**
     * The identifier for the security profle.
     */
    SecurityProfileId: SecurityProfileId;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
  }
  export interface DescribeSecurityProfileResponse {
    /**
     * The security profile.
     */
    SecurityProfile?: SecurityProfile;
  }
  export interface DescribeUserHierarchyGroupRequest {
    /**
     * The identifier of the hierarchy group.
     */
    HierarchyGroupId: HierarchyGroupId;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
  }
  export interface DescribeUserHierarchyGroupResponse {
    /**
     * Information about the hierarchy group.
     */
    HierarchyGroup?: HierarchyGroup;
  }
  export interface DescribeUserHierarchyStructureRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
  }
  export interface DescribeUserHierarchyStructureResponse {
    /**
     * Information about the hierarchy structure.
     */
    HierarchyStructure?: HierarchyStructure;
  }
  export interface DescribeUserRequest {
    /**
     * The identifier of the user account.
     */
    UserId: UserId;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
  }
  export interface DescribeUserResponse {
    /**
     * Information about the user account and configuration settings.
     */
    User?: User;
  }
  export type Description = string;
  export interface Dimensions {
    /**
     * Information about the queue for which metrics are returned.
     */
    Queue?: QueueReference;
    /**
     * The channel used for grouping and filters.
     */
    Channel?: Channel;
  }
  export type DirectoryAlias = string;
  export type DirectoryId = string;
  export type DirectoryType = "SAML"|"CONNECT_MANAGED"|"EXISTING_DIRECTORY"|string;
  export type DirectoryUserId = string;
  export interface DisassociateApprovedOriginRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The domain URL of the integrated application.
     */
    Origin: Origin;
  }
  export interface DisassociateBotRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    LexBot?: LexBot;
    /**
     * The Amazon Lex V2 bot to disassociate from the instance.
     */
    LexV2Bot?: LexV2Bot;
  }
  export interface DisassociateInstanceStorageConfigRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The existing association identifier that uniquely identifies the resource type and storage config for the given instance ID.
     */
    AssociationId: AssociationId;
    /**
     * A valid resource type.
     */
    ResourceType: InstanceStorageResourceType;
  }
  export interface DisassociateLambdaFunctionRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance..
     */
    InstanceId: InstanceId;
    /**
     * The Amazon Resource Name (ARN) of the Lambda function being disassociated.
     */
    FunctionArn: FunctionArn;
  }
  export interface DisassociateLexBotRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The name of the Amazon Lex bot. Maximum character limit of 50.
     */
    BotName: BotName;
    /**
     * The Region in which the Amazon Lex bot has been created.
     */
    LexRegion: LexRegion;
  }
  export interface DisassociateQueueQuickConnectsRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the queue.
     */
    QueueId: QueueId;
    /**
     * The quick connects to disassociate from the queue.
     */
    QuickConnectIds: QuickConnectsList;
  }
  export interface DisassociateRoutingProfileQueuesRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the routing profile.
     */
    RoutingProfileId: RoutingProfileId;
    /**
     * The queues to disassociate from this routing profile.
     */
    QueueReferences: RoutingProfileQueueReferenceList;
  }
  export interface DisassociateSecurityKeyRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The existing association identifier that uniquely identifies the resource type and storage config for the given instance ID.
     */
    AssociationId: AssociationId;
  }
  export type DisplayName = string;
  export type Email = string;
  export interface EncryptionConfig {
    /**
     * The type of encryption.
     */
    EncryptionType: EncryptionType;
    /**
     * The full ARN of the encryption key.   Be sure to provide the full ARN of the encryption key, not just the ID. 
     */
    KeyId: KeyId;
  }
  export type EncryptionType = "KMS"|string;
  export interface Filters {
    /**
     * The queues to use to filter the metrics. You can specify up to 100 queues per request.
     */
    Queues?: Queues;
    /**
     * The channel to use to filter the metrics.
     */
    Channels?: Channels;
  }
  export type FunctionArn = string;
  export type FunctionArnsList = FunctionArn[];
  export interface GetContactAttributesRequest {
    /**
     * The identifier of the Amazon Connect instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the initial contact.
     */
    InitialContactId: ContactId;
  }
  export interface GetContactAttributesResponse {
    /**
     * Information about the attributes.
     */
    Attributes?: Attributes;
  }
  export interface GetCurrentMetricDataRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The queues, up to 100, or channels, to use to filter the metrics returned. Metric data is retrieved only for the resources associated with the queues or channels included in the filter. You can include both queue IDs and queue ARNs in the same request. VOICE, CHAT, and TASK channels are supported.
     */
    Filters: Filters;
    /**
     * The grouping applied to the metrics returned. For example, when grouped by QUEUE, the metrics returned apply to each queue rather than aggregated for all queues. If you group by CHANNEL, you should include a Channels filter. VOICE, CHAT, and TASK channels are supported. If no Grouping is included in the request, a summary of metrics is returned.
     */
    Groupings?: Groupings;
    /**
     * The metrics to retrieve. Specify the name and unit for each metric. The following metrics are available. For a description of all the metrics, see Real-time Metrics Definitions in the Amazon Connect Administrator Guide.  AGENTS_AFTER_CONTACT_WORK  Unit: COUNT Name in real-time metrics report: ACW   AGENTS_AVAILABLE  Unit: COUNT Name in real-time metrics report: Available   AGENTS_ERROR  Unit: COUNT Name in real-time metrics report: Error   AGENTS_NON_PRODUCTIVE  Unit: COUNT Name in real-time metrics report: NPT (Non-Productive Time)   AGENTS_ON_CALL  Unit: COUNT Name in real-time metrics report: On contact   AGENTS_ON_CONTACT  Unit: COUNT Name in real-time metrics report: On contact   AGENTS_ONLINE  Unit: COUNT Name in real-time metrics report: Online   AGENTS_STAFFED  Unit: COUNT Name in real-time metrics report: Staffed   CONTACTS_IN_QUEUE  Unit: COUNT Name in real-time metrics report: In queue   CONTACTS_SCHEDULED  Unit: COUNT Name in real-time metrics report: Scheduled   OLDEST_CONTACT_AGE  Unit: SECONDS When you use groupings, Unit says SECONDS and the Value is returned in SECONDS.  When you do not use groupings, Unit says SECONDS but the Value is returned in MILLISECONDS. For example, if you get a response like this:  { "Metric": { "Name": "OLDEST_CONTACT_AGE", "Unit": "SECONDS" }, "Value": 24113.0 } The actual OLDEST_CONTACT_AGE is 24 seconds. Name in real-time metrics report: Oldest   SLOTS_ACTIVE  Unit: COUNT Name in real-time metrics report: Active   SLOTS_AVAILABLE  Unit: COUNT Name in real-time metrics report: Availability   
     */
    CurrentMetrics: CurrentMetrics;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results. The token expires after 5 minutes from the time it is created. Subsequent requests that use the token must use the same request parameters as the request that generated the token.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult100;
  }
  export interface GetCurrentMetricDataResponse {
    /**
     * If there are additional results, this is the token for the next set of results. The token expires after 5 minutes from the time it is created. Subsequent requests that use the token must use the same request parameters as the request that generated the token.
     */
    NextToken?: NextToken;
    /**
     * Information about the real-time metrics.
     */
    MetricResults?: CurrentMetricResults;
    /**
     * The time at which the metrics were retrieved and cached for pagination.
     */
    DataSnapshotTime?: timestamp;
  }
  export interface GetFederationTokenRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
  }
  export interface GetFederationTokenResponse {
    /**
     * The credentials to use for federation.
     */
    Credentials?: Credentials;
  }
  export interface GetMetricDataRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The timestamp, in UNIX Epoch time format, at which to start the reporting interval for the retrieval of historical metrics data. The time must be specified using a multiple of 5 minutes, such as 10:05, 10:10, 10:15. The start time cannot be earlier than 24 hours before the time of the request. Historical metrics are available only for 24 hours.
     */
    StartTime: timestamp;
    /**
     * The timestamp, in UNIX Epoch time format, at which to end the reporting interval for the retrieval of historical metrics data. The time must be specified using an interval of 5 minutes, such as 11:00, 11:05, 11:10, and must be later than the start time timestamp. The time range between the start and end time must be less than 24 hours.
     */
    EndTime: timestamp;
    /**
     * The queues, up to 100, or channels, to use to filter the metrics returned. Metric data is retrieved only for the resources associated with the queues or channels included in the filter. You can include both queue IDs and queue ARNs in the same request. VOICE, CHAT, and TASK channels are supported.  To filter by Queues, enter the queue ID/ARN, not the name of the queue. 
     */
    Filters: Filters;
    /**
     * The grouping applied to the metrics returned. For example, when results are grouped by queue, the metrics returned are grouped by queue. The values returned apply to the metrics for each queue rather than aggregated for all queues. If no grouping is specified, a summary of metrics for all queues is returned.
     */
    Groupings?: Groupings;
    /**
     * The metrics to retrieve. Specify the name, unit, and statistic for each metric. The following historical metrics are available. For a description of each metric, see Historical Metrics Definitions in the Amazon Connect Administrator Guide.  This API does not support a contacts incoming metric (there's no CONTACTS_INCOMING metric missing from the documented list).    ABANDON_TIME  Unit: SECONDS Statistic: AVG  AFTER_CONTACT_WORK_TIME  Unit: SECONDS Statistic: AVG  API_CONTACTS_HANDLED  Unit: COUNT Statistic: SUM  CALLBACK_CONTACTS_HANDLED  Unit: COUNT Statistic: SUM  CONTACTS_ABANDONED  Unit: COUNT Statistic: SUM  CONTACTS_AGENT_HUNG_UP_FIRST  Unit: COUNT Statistic: SUM  CONTACTS_CONSULTED  Unit: COUNT Statistic: SUM  CONTACTS_HANDLED  Unit: COUNT Statistic: SUM  CONTACTS_HANDLED_INCOMING  Unit: COUNT Statistic: SUM  CONTACTS_HANDLED_OUTBOUND  Unit: COUNT Statistic: SUM  CONTACTS_HOLD_ABANDONS  Unit: COUNT Statistic: SUM  CONTACTS_MISSED  Unit: COUNT Statistic: SUM  CONTACTS_QUEUED  Unit: COUNT Statistic: SUM  CONTACTS_TRANSFERRED_IN  Unit: COUNT Statistic: SUM  CONTACTS_TRANSFERRED_IN_FROM_QUEUE  Unit: COUNT Statistic: SUM  CONTACTS_TRANSFERRED_OUT  Unit: COUNT Statistic: SUM  CONTACTS_TRANSFERRED_OUT_FROM_QUEUE  Unit: COUNT Statistic: SUM  HANDLE_TIME  Unit: SECONDS Statistic: AVG  HOLD_TIME  Unit: SECONDS Statistic: AVG  INTERACTION_AND_HOLD_TIME  Unit: SECONDS Statistic: AVG  INTERACTION_TIME  Unit: SECONDS Statistic: AVG  OCCUPANCY  Unit: PERCENT Statistic: AVG  QUEUE_ANSWER_TIME  Unit: SECONDS Statistic: AVG  QUEUED_TIME  Unit: SECONDS Statistic: MAX  SERVICE_LEVEL  You can include up to 20 SERVICE_LEVEL metrics in a request. Unit: PERCENT Statistic: AVG Threshold: For ThresholdValue, enter any whole number from 1 to 604800 (inclusive), in seconds. For Comparison, you must enter LT (for "Less than").   
     */
    HistoricalMetrics: HistoricalMetrics;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult100;
  }
  export interface GetMetricDataResponse {
    /**
     * If there are additional results, this is the token for the next set of results. The token expires after 5 minutes from the time it is created. Subsequent requests that use the token must use the same request parameters as the request that generated the token.
     */
    NextToken?: NextToken;
    /**
     * Information about the historical metrics. If no grouping is specified, a summary of metric data is returned.
     */
    MetricResults?: HistoricalMetricResults;
  }
  export type Grouping = "QUEUE"|"CHANNEL"|string;
  export type Groupings = Grouping[];
  export interface HierarchyGroup {
    /**
     * The identifier of the hierarchy group.
     */
    Id?: HierarchyGroupId;
    /**
     * The Amazon Resource Name (ARN) of the hierarchy group.
     */
    Arn?: ARN;
    /**
     * The name of the hierarchy group.
     */
    Name?: HierarchyGroupName;
    /**
     * The identifier of the level in the hierarchy group.
     */
    LevelId?: HierarchyLevelId;
    /**
     * Information about the levels in the hierarchy group.
     */
    HierarchyPath?: HierarchyPath;
  }
  export type HierarchyGroupId = string;
  export type HierarchyGroupName = string;
  export interface HierarchyGroupSummary {
    /**
     * The identifier of the hierarchy group.
     */
    Id?: HierarchyGroupId;
    /**
     * The Amazon Resource Name (ARN) of the hierarchy group.
     */
    Arn?: ARN;
    /**
     * The name of the hierarchy group.
     */
    Name?: HierarchyGroupName;
  }
  export type HierarchyGroupSummaryList = HierarchyGroupSummary[];
  export interface HierarchyLevel {
    /**
     * The identifier of the hierarchy level.
     */
    Id?: HierarchyLevelId;
    /**
     * The Amazon Resource Name (ARN) of the hierarchy level.
     */
    Arn?: ARN;
    /**
     * The name of the hierarchy level.
     */
    Name?: HierarchyLevelName;
  }
  export type HierarchyLevelId = string;
  export type HierarchyLevelName = string;
  export interface HierarchyLevelUpdate {
    /**
     * The name of the user hierarchy level. Must not be more than 50 characters.
     */
    Name: HierarchyLevelName;
  }
  export interface HierarchyPath {
    /**
     * Information about level one.
     */
    LevelOne?: HierarchyGroupSummary;
    /**
     * Information about level two.
     */
    LevelTwo?: HierarchyGroupSummary;
    /**
     * Information about level three.
     */
    LevelThree?: HierarchyGroupSummary;
    /**
     * Information about level four.
     */
    LevelFour?: HierarchyGroupSummary;
    /**
     * Information about level five.
     */
    LevelFive?: HierarchyGroupSummary;
  }
  export interface HierarchyStructure {
    /**
     * Information about level one.
     */
    LevelOne?: HierarchyLevel;
    /**
     * Information about level two.
     */
    LevelTwo?: HierarchyLevel;
    /**
     * Information about level three.
     */
    LevelThree?: HierarchyLevel;
    /**
     * Information about level four.
     */
    LevelFour?: HierarchyLevel;
    /**
     * Information about level five.
     */
    LevelFive?: HierarchyLevel;
  }
  export interface HierarchyStructureUpdate {
    /**
     * The update for level one.
     */
    LevelOne?: HierarchyLevelUpdate;
    /**
     * The update for level two.
     */
    LevelTwo?: HierarchyLevelUpdate;
    /**
     * The update for level three.
     */
    LevelThree?: HierarchyLevelUpdate;
    /**
     * The update for level four.
     */
    LevelFour?: HierarchyLevelUpdate;
    /**
     * The update for level five.
     */
    LevelFive?: HierarchyLevelUpdate;
  }
  export interface HistoricalMetric {
    /**
     * The name of the metric.
     */
    Name?: HistoricalMetricName;
    /**
     * The threshold for the metric, used with service level metrics.
     */
    Threshold?: Threshold;
    /**
     * The statistic for the metric.
     */
    Statistic?: Statistic;
    /**
     * The unit for the metric.
     */
    Unit?: Unit;
  }
  export interface HistoricalMetricData {
    /**
     * Information about the metric.
     */
    Metric?: HistoricalMetric;
    /**
     * The value of the metric.
     */
    Value?: Value;
  }
  export type HistoricalMetricDataCollections = HistoricalMetricData[];
  export type HistoricalMetricName = "CONTACTS_QUEUED"|"CONTACTS_HANDLED"|"CONTACTS_ABANDONED"|"CONTACTS_CONSULTED"|"CONTACTS_AGENT_HUNG_UP_FIRST"|"CONTACTS_HANDLED_INCOMING"|"CONTACTS_HANDLED_OUTBOUND"|"CONTACTS_HOLD_ABANDONS"|"CONTACTS_TRANSFERRED_IN"|"CONTACTS_TRANSFERRED_OUT"|"CONTACTS_TRANSFERRED_IN_FROM_QUEUE"|"CONTACTS_TRANSFERRED_OUT_FROM_QUEUE"|"CONTACTS_MISSED"|"CALLBACK_CONTACTS_HANDLED"|"API_CONTACTS_HANDLED"|"OCCUPANCY"|"HANDLE_TIME"|"AFTER_CONTACT_WORK_TIME"|"QUEUED_TIME"|"ABANDON_TIME"|"QUEUE_ANSWER_TIME"|"HOLD_TIME"|"INTERACTION_TIME"|"INTERACTION_AND_HOLD_TIME"|"SERVICE_LEVEL"|string;
  export interface HistoricalMetricResult {
    /**
     * The dimension for the metrics.
     */
    Dimensions?: Dimensions;
    /**
     * The set of metrics.
     */
    Collections?: HistoricalMetricDataCollections;
  }
  export type HistoricalMetricResults = HistoricalMetricResult[];
  export type HistoricalMetrics = HistoricalMetric[];
  export type Hours = number;
  export type Hours24Format = number;
  export interface HoursOfOperation {
    /**
     * The identifier for the hours of operation.
     */
    HoursOfOperationId?: HoursOfOperationId;
    /**
     * The Amazon Resource Name (ARN) for the hours of operation.
     */
    HoursOfOperationArn?: ARN;
    /**
     * The name for the hours of operation.
     */
    Name?: CommonNameLength127;
    /**
     * The description for the hours of operation.
     */
    Description?: HoursOfOperationDescription;
    /**
     * The time zone for the hours of operation.
     */
    TimeZone?: TimeZone;
    /**
     * Configuration information for the hours of operation.
     */
    Config?: HoursOfOperationConfigList;
    /**
     * One or more tags.
     */
    Tags?: TagMap;
  }
  export interface HoursOfOperationConfig {
    /**
     * The day that the hours of operation applies to.
     */
    Day: HoursOfOperationDays;
    /**
     * The start time that your contact center opens.
     */
    StartTime: HoursOfOperationTimeSlice;
    /**
     * The end time that your contact center closes.
     */
    EndTime: HoursOfOperationTimeSlice;
  }
  export type HoursOfOperationConfigList = HoursOfOperationConfig[];
  export type HoursOfOperationDays = "SUNDAY"|"MONDAY"|"TUESDAY"|"WEDNESDAY"|"THURSDAY"|"FRIDAY"|"SATURDAY"|string;
  export type HoursOfOperationDescription = string;
  export type HoursOfOperationId = string;
  export type HoursOfOperationName = string;
  export interface HoursOfOperationSummary {
    /**
     * The identifier of the hours of operation.
     */
    Id?: HoursOfOperationId;
    /**
     * The Amazon Resource Name (ARN) of the hours of operation.
     */
    Arn?: ARN;
    /**
     * The name of the hours of operation.
     */
    Name?: HoursOfOperationName;
  }
  export type HoursOfOperationSummaryList = HoursOfOperationSummary[];
  export interface HoursOfOperationTimeSlice {
    /**
     * The hours.
     */
    Hours: Hours24Format;
    /**
     * The minutes.
     */
    Minutes: MinutesLimit60;
  }
  export type InboundCallsEnabled = boolean;
  export interface Instance {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    Id?: InstanceId;
    /**
     * The Amazon Resource Name (ARN) of the instance.
     */
    Arn?: ARN;
    /**
     * The identity management type.
     */
    IdentityManagementType?: DirectoryType;
    /**
     * The alias of instance.
     */
    InstanceAlias?: DirectoryAlias;
    /**
     * When the instance was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The service role of the instance.
     */
    ServiceRole?: ARN;
    /**
     * The state of the instance.
     */
    InstanceStatus?: InstanceStatus;
    /**
     * Relevant details why the instance was not successfully created. 
     */
    StatusReason?: InstanceStatusReason;
    /**
     * Whether inbound calls are enabled.
     */
    InboundCallsEnabled?: InboundCallsEnabled;
    /**
     * Whether outbound calls are enabled.
     */
    OutboundCallsEnabled?: OutboundCallsEnabled;
  }
  export type InstanceAttributeType = "INBOUND_CALLS"|"OUTBOUND_CALLS"|"CONTACTFLOW_LOGS"|"CONTACT_LENS"|"AUTO_RESOLVE_BEST_VOICES"|"USE_CUSTOM_TTS_VOICES"|"EARLY_MEDIA"|string;
  export type InstanceAttributeValue = string;
  export type InstanceId = string;
  export type InstanceStatus = "CREATION_IN_PROGRESS"|"ACTIVE"|"CREATION_FAILED"|string;
  export interface InstanceStatusReason {
    /**
     * The message.
     */
    Message?: String;
  }
  export interface InstanceStorageConfig {
    /**
     * The existing association identifier that uniquely identifies the resource type and storage config for the given instance ID.
     */
    AssociationId?: AssociationId;
    /**
     * A valid storage type.
     */
    StorageType: StorageType;
    /**
     * The S3 bucket configuration.
     */
    S3Config?: S3Config;
    /**
     * The configuration of the Kinesis video stream.
     */
    KinesisVideoStreamConfig?: KinesisVideoStreamConfig;
    /**
     * The configuration of the Kinesis data stream.
     */
    KinesisStreamConfig?: KinesisStreamConfig;
    /**
     * The configuration of the Kinesis Firehose delivery stream.
     */
    KinesisFirehoseConfig?: KinesisFirehoseConfig;
  }
  export type InstanceStorageConfigs = InstanceStorageConfig[];
  export type InstanceStorageResourceType = "CHAT_TRANSCRIPTS"|"CALL_RECORDINGS"|"SCHEDULED_REPORTS"|"MEDIA_STREAMS"|"CONTACT_TRACE_RECORDS"|"AGENT_EVENTS"|string;
  export interface InstanceSummary {
    /**
     * The identifier of the instance.
     */
    Id?: InstanceId;
    /**
     * The Amazon Resource Name (ARN) of the instance.
     */
    Arn?: ARN;
    /**
     * The identity management type of the instance.
     */
    IdentityManagementType?: DirectoryType;
    /**
     * The alias of the instance.
     */
    InstanceAlias?: DirectoryAlias;
    /**
     * When the instance was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The service role of the instance.
     */
    ServiceRole?: ARN;
    /**
     * The state of the instance.
     */
    InstanceStatus?: InstanceStatus;
    /**
     * Whether inbound calls are enabled.
     */
    InboundCallsEnabled?: InboundCallsEnabled;
    /**
     * Whether outbound calls are enabled.
     */
    OutboundCallsEnabled?: OutboundCallsEnabled;
  }
  export type InstanceSummaryList = InstanceSummary[];
  export type IntegrationAssociationId = string;
  export interface IntegrationAssociationSummary {
    /**
     * The identifier for the AppIntegration association.
     */
    IntegrationAssociationId?: IntegrationAssociationId;
    /**
     * The Amazon Resource Name (ARN) for the AppIntegration association.
     */
    IntegrationAssociationArn?: ARN;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId?: InstanceId;
    /**
     * The integration type.
     */
    IntegrationType?: IntegrationType;
    /**
     * The Amazon Resource Name (ARN) for the AppIntegration.
     */
    IntegrationArn?: ARN;
    /**
     * The URL for the external application.
     */
    SourceApplicationUrl?: URI;
    /**
     * The user-provided, friendly name for the external application.
     */
    SourceApplicationName?: SourceApplicationName;
    /**
     * The name of the source.
     */
    SourceType?: SourceType;
  }
  export type IntegrationAssociationSummaryList = IntegrationAssociationSummary[];
  export type IntegrationType = "EVENT"|"VOICE_ID"|"PINPOINT_APP"|"WISDOM_ASSISTANT"|"WISDOM_KNOWLEDGE_BASE"|string;
  export type KeyId = string;
  export interface KinesisFirehoseConfig {
    /**
     * The Amazon Resource Name (ARN) of the delivery stream.
     */
    FirehoseArn: ARN;
  }
  export interface KinesisStreamConfig {
    /**
     * The Amazon Resource Name (ARN) of the data stream.
     */
    StreamArn: ARN;
  }
  export interface KinesisVideoStreamConfig {
    /**
     * The prefix of the video stream.
     */
    Prefix: Prefix;
    /**
     * The number of hours data is retained in the stream. Kinesis Video Streams retains the data in a data store that is associated with the stream. The default value is 0, indicating that the stream does not persist data.
     */
    RetentionPeriodHours: Hours;
    /**
     * The encryption configuration.
     */
    EncryptionConfig: EncryptionConfig;
  }
  export interface LexBot {
    /**
     * The name of the Amazon Lex bot.
     */
    Name?: BotName;
    /**
     * The Region that the Amazon Lex bot was created in.
     */
    LexRegion?: LexRegion;
  }
  export interface LexBotConfig {
    LexBot?: LexBot;
    /**
     * Configuration information of an Amazon Lex V2 bot.
     */
    LexV2Bot?: LexV2Bot;
  }
  export type LexBotConfigList = LexBotConfig[];
  export type LexBotsList = LexBot[];
  export type LexRegion = string;
  export interface LexV2Bot {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Lex V2 bot.
     */
    AliasArn?: AliasArn;
  }
  export type LexVersion = "V1"|"V2"|string;
  export interface ListAgentStatusRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult1000;
    /**
     * Available agent status types.
     */
    AgentStatusTypes?: AgentStatusTypes;
  }
  export interface ListAgentStatusResponse {
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
    /**
     * A summary of agent statuses.
     */
    AgentStatusSummaryList?: AgentStatusSummaryList;
  }
  export interface ListApprovedOriginsRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult25;
  }
  export interface ListApprovedOriginsResponse {
    /**
     * The approved origins.
     */
    Origins?: OriginsList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListBotsRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult25;
    /**
     * The version of Amazon Lex or Amazon Lex V2.
     */
    LexVersion: LexVersion;
  }
  export interface ListBotsResponse {
    /**
     * The names and Regions of the Amazon Lex or Amazon Lex V2 bots associated with the specified instance.
     */
    LexBots?: LexBotConfigList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListContactFlowsRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The type of contact flow.
     */
    ContactFlowTypes?: ContactFlowTypes;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult1000;
  }
  export interface ListContactFlowsResponse {
    /**
     * Information about the contact flows.
     */
    ContactFlowSummaryList?: ContactFlowSummaryList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListContactReferencesRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the initial contact.
     */
    ContactId: ContactId;
    /**
     * The type of reference.
     */
    ReferenceTypes: ReferenceTypes;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.  This is not expected to be set since the value returned in the previous response is always null. 
     */
    NextToken?: NextToken;
  }
  export interface ListContactReferencesResponse {
    /**
     * Information about the contact flows.
     */
    ReferenceSummaryList?: ReferenceSummaryList;
    /**
     * If there are additional results, this is the token for the next set of results.  This is always returned as null in the response. 
     */
    NextToken?: NextToken;
  }
  export interface ListHoursOfOperationsRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult1000;
  }
  export interface ListHoursOfOperationsResponse {
    /**
     * Information about the hours of operation.
     */
    HoursOfOperationSummaryList?: HoursOfOperationSummaryList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListInstanceAttributesRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult7;
  }
  export interface ListInstanceAttributesResponse {
    /**
     * The attribute types.
     */
    Attributes?: AttributesList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListInstanceStorageConfigsRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * A valid resource type.
     */
    ResourceType: InstanceStorageResourceType;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult10;
  }
  export interface ListInstanceStorageConfigsResponse {
    /**
     * A valid storage type.
     */
    StorageConfigs?: InstanceStorageConfigs;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListInstancesRequest {
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult10;
  }
  export interface ListInstancesResponse {
    /**
     * Information about the instances.
     */
    InstanceSummaryList?: InstanceSummaryList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListIntegrationAssociationsRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * 
     */
    IntegrationType?: IntegrationType;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult100;
  }
  export interface ListIntegrationAssociationsResponse {
    /**
     * The associations.
     */
    IntegrationAssociationSummaryList?: IntegrationAssociationSummaryList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListLambdaFunctionsRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult25;
  }
  export interface ListLambdaFunctionsResponse {
    /**
     * The Lambdafunction ARNs associated with the specified instance.
     */
    LambdaFunctions?: FunctionArnsList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListLexBotsRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page. If no value is specified, the default is 10. 
     */
    MaxResults?: MaxResult25;
  }
  export interface ListLexBotsResponse {
    /**
     * The names and Regions of the Amazon Lex bots associated with the specified instance.
     */
    LexBots?: LexBotsList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListPhoneNumbersRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The type of phone number.
     */
    PhoneNumberTypes?: PhoneNumberTypes;
    /**
     * The ISO country code.
     */
    PhoneNumberCountryCodes?: PhoneNumberCountryCodes;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult1000;
  }
  export interface ListPhoneNumbersResponse {
    /**
     * Information about the phone numbers.
     */
    PhoneNumberSummaryList?: PhoneNumberSummaryList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListPromptsRequest {
    /**
     * The identifier of the Amazon Connect instance.
     */
    InstanceId: InstanceId;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult1000;
  }
  export interface ListPromptsResponse {
    /**
     * Information about the prompts.
     */
    PromptSummaryList?: PromptSummaryList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListQueueQuickConnectsRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the queue.
     */
    QueueId: QueueId;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult100;
  }
  export interface ListQueueQuickConnectsResponse {
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
    /**
     * Information about the quick connects.
     */
    QuickConnectSummaryList?: QuickConnectSummaryList;
  }
  export interface ListQueuesRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The type of queue.
     */
    QueueTypes?: QueueTypes;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult1000;
  }
  export interface ListQueuesResponse {
    /**
     * Information about the queues.
     */
    QueueSummaryList?: QueueSummaryList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListQuickConnectsRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult1000;
    /**
     * The type of quick connect. In the Amazon Connect console, when you create a quick connect, you are prompted to assign one of the following types: Agent (USER), External (PHONE_NUMBER), or Queue (QUEUE).
     */
    QuickConnectTypes?: QuickConnectTypes;
  }
  export interface ListQuickConnectsResponse {
    /**
     * Information about the quick connects.
     */
    QuickConnectSummaryList?: QuickConnectSummaryList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListRoutingProfileQueuesRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the routing profile.
     */
    RoutingProfileId: RoutingProfileId;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult100;
  }
  export interface ListRoutingProfileQueuesResponse {
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
    /**
     * Information about the routing profiles.
     */
    RoutingProfileQueueConfigSummaryList?: RoutingProfileQueueConfigSummaryList;
  }
  export interface ListRoutingProfilesRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult1000;
  }
  export interface ListRoutingProfilesResponse {
    /**
     * Information about the routing profiles.
     */
    RoutingProfileSummaryList?: RoutingProfileSummaryList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListSecurityKeysRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult2;
  }
  export interface ListSecurityKeysResponse {
    /**
     * The security keys.
     */
    SecurityKeys?: SecurityKeysList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListSecurityProfilePermissionsRequest {
    /**
     * The identifier for the security profle.
     */
    SecurityProfileId: SecurityProfileId;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult1000;
  }
  export interface ListSecurityProfilePermissionsResponse {
    /**
     * The permissions granted to the security profile.
     */
    Permissions?: PermissionsList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListSecurityProfilesRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult1000;
  }
  export interface ListSecurityProfilesResponse {
    /**
     * Information about the security profiles.
     */
    SecurityProfileSummaryList?: SecurityProfileSummaryList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: ARN;
  }
  export interface ListTagsForResourceResponse {
    /**
     * Information about the tags.
     */
    tags?: TagMap;
  }
  export interface ListUseCasesRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the integration association.
     */
    IntegrationAssociationId: IntegrationAssociationId;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult100;
  }
  export interface ListUseCasesResponse {
    /**
     * The use cases.
     */
    UseCaseSummaryList?: UseCaseSummaryList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListUserHierarchyGroupsRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult1000;
  }
  export interface ListUserHierarchyGroupsResponse {
    /**
     * Information about the hierarchy groups.
     */
    UserHierarchyGroupSummaryList?: HierarchyGroupSummaryList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListUsersRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResult1000;
  }
  export interface ListUsersResponse {
    /**
     * Information about the users.
     */
    UserSummaryList?: UserSummaryList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export type MaxResult10 = number;
  export type MaxResult100 = number;
  export type MaxResult1000 = number;
  export type MaxResult2 = number;
  export type MaxResult25 = number;
  export type MaxResult7 = number;
  export type MediaConcurrencies = MediaConcurrency[];
  export interface MediaConcurrency {
    /**
     * The channels that agents can handle in the Contact Control Panel (CCP).
     */
    Channel: Channel;
    /**
     * The number of contacts an agent can have on a channel simultaneously. Valid Range for VOICE: Minimum value of 1. Maximum value of 1. Valid Range for CHAT: Minimum value of 1. Maximum value of 10. Valid Range for TASK: Minimum value of 1. Maximum value of 10.
     */
    Concurrency: Concurrency;
  }
  export type MinutesLimit60 = number;
  export type Name = string;
  export type NextToken = string;
  export type Origin = string;
  export type OriginsList = Origin[];
  export interface OutboundCallerConfig {
    /**
     * The caller ID name.
     */
    OutboundCallerIdName?: OutboundCallerIdName;
    /**
     * The caller ID number.
     */
    OutboundCallerIdNumberId?: PhoneNumberId;
    /**
     * The outbound whisper flow to be used during an outbound call.
     */
    OutboundFlowId?: ContactFlowId;
  }
  export type OutboundCallerIdName = string;
  export type OutboundCallsEnabled = boolean;
  export type PEM = string;
  export interface ParticipantDetails {
    /**
     * Display name of the participant.
     */
    DisplayName: DisplayName;
  }
  export type ParticipantId = string;
  export type ParticipantToken = string;
  export type Password = string;
  export type PermissionsList = SecurityProfilePermission[];
  export type PhoneNumber = string;
  export type PhoneNumberCountryCode = "AF"|"AL"|"DZ"|"AS"|"AD"|"AO"|"AI"|"AQ"|"AG"|"AR"|"AM"|"AW"|"AU"|"AT"|"AZ"|"BS"|"BH"|"BD"|"BB"|"BY"|"BE"|"BZ"|"BJ"|"BM"|"BT"|"BO"|"BA"|"BW"|"BR"|"IO"|"VG"|"BN"|"BG"|"BF"|"BI"|"KH"|"CM"|"CA"|"CV"|"KY"|"CF"|"TD"|"CL"|"CN"|"CX"|"CC"|"CO"|"KM"|"CK"|"CR"|"HR"|"CU"|"CW"|"CY"|"CZ"|"CD"|"DK"|"DJ"|"DM"|"DO"|"TL"|"EC"|"EG"|"SV"|"GQ"|"ER"|"EE"|"ET"|"FK"|"FO"|"FJ"|"FI"|"FR"|"PF"|"GA"|"GM"|"GE"|"DE"|"GH"|"GI"|"GR"|"GL"|"GD"|"GU"|"GT"|"GG"|"GN"|"GW"|"GY"|"HT"|"HN"|"HK"|"HU"|"IS"|"IN"|"ID"|"IR"|"IQ"|"IE"|"IM"|"IL"|"IT"|"CI"|"JM"|"JP"|"JE"|"JO"|"KZ"|"KE"|"KI"|"KW"|"KG"|"LA"|"LV"|"LB"|"LS"|"LR"|"LY"|"LI"|"LT"|"LU"|"MO"|"MK"|"MG"|"MW"|"MY"|"MV"|"ML"|"MT"|"MH"|"MR"|"MU"|"YT"|"MX"|"FM"|"MD"|"MC"|"MN"|"ME"|"MS"|"MA"|"MZ"|"MM"|"NA"|"NR"|"NP"|"NL"|"AN"|"NC"|"NZ"|"NI"|"NE"|"NG"|"NU"|"KP"|"MP"|"NO"|"OM"|"PK"|"PW"|"PA"|"PG"|"PY"|"PE"|"PH"|"PN"|"PL"|"PT"|"PR"|"QA"|"CG"|"RE"|"RO"|"RU"|"RW"|"BL"|"SH"|"KN"|"LC"|"MF"|"PM"|"VC"|"WS"|"SM"|"ST"|"SA"|"SN"|"RS"|"SC"|"SL"|"SG"|"SX"|"SK"|"SI"|"SB"|"SO"|"ZA"|"KR"|"ES"|"LK"|"SD"|"SR"|"SJ"|"SZ"|"SE"|"CH"|"SY"|"TW"|"TJ"|"TZ"|"TH"|"TG"|"TK"|"TO"|"TT"|"TN"|"TR"|"TM"|"TC"|"TV"|"VI"|"UG"|"UA"|"AE"|"GB"|"US"|"UY"|"UZ"|"VU"|"VA"|"VE"|"VN"|"WF"|"EH"|"YE"|"ZM"|"ZW"|string;
  export type PhoneNumberCountryCodes = PhoneNumberCountryCode[];
  export type PhoneNumberId = string;
  export interface PhoneNumberQuickConnectConfig {
    /**
     * The phone number in E.164 format.
     */
    PhoneNumber: PhoneNumber;
  }
  export interface PhoneNumberSummary {
    /**
     * The identifier of the phone number.
     */
    Id?: PhoneNumberId;
    /**
     * The Amazon Resource Name (ARN) of the phone number.
     */
    Arn?: ARN;
    /**
     * The phone number.
     */
    PhoneNumber?: PhoneNumber;
    /**
     * The type of phone number.
     */
    PhoneNumberType?: PhoneNumberType;
    /**
     * The ISO country code.
     */
    PhoneNumberCountryCode?: PhoneNumberCountryCode;
  }
  export type PhoneNumberSummaryList = PhoneNumberSummary[];
  export type PhoneNumberType = "TOLL_FREE"|"DID"|string;
  export type PhoneNumberTypes = PhoneNumberType[];
  export type PhoneType = "SOFT_PHONE"|"DESK_PHONE"|string;
  export type Prefix = string;
  export type Priority = number;
  export type PromptId = string;
  export type PromptName = string;
  export interface PromptSummary {
    /**
     * The identifier of the prompt.
     */
    Id?: PromptId;
    /**
     * The Amazon Resource Name (ARN) of the prompt.
     */
    Arn?: ARN;
    /**
     * The name of the prompt.
     */
    Name?: PromptName;
  }
  export type PromptSummaryList = PromptSummary[];
  export interface Queue {
    /**
     * The name of the queue.
     */
    Name?: CommonNameLength127;
    /**
     * The Amazon Resource Name (ARN) for the queue.
     */
    QueueArn?: ARN;
    /**
     * The identifier for the queue.
     */
    QueueId?: QueueId;
    /**
     * The description of the queue.
     */
    Description?: QueueDescription;
    /**
     * The outbound caller ID name, number, and outbound whisper flow.
     */
    OutboundCallerConfig?: OutboundCallerConfig;
    /**
     * The identifier for the hours of operation.
     */
    HoursOfOperationId?: HoursOfOperationId;
    /**
     * The maximum number of contacts that can be in the queue before it is considered full.
     */
    MaxContacts?: QueueMaxContacts;
    /**
     * The status of the queue.
     */
    Status?: QueueStatus;
    /**
     * One or more tags.
     */
    Tags?: TagMap;
  }
  export type QueueDescription = string;
  export type QueueId = string;
  export interface QueueInfo {
    /**
     * The identifier of the agent who accepted the contact.
     */
    Id?: QueueId;
    /**
     * The timestamp when the contact was added to the queue.
     */
    EnqueueTimestamp?: timestamp;
  }
  export type QueueMaxContacts = number;
  export type QueueName = string;
  export interface QueueQuickConnectConfig {
    /**
     * The identifier for the queue.
     */
    QueueId: QueueId;
    /**
     * The identifier of the contact flow.
     */
    ContactFlowId: ContactFlowId;
  }
  export interface QueueReference {
    /**
     * The identifier of the queue.
     */
    Id?: QueueId;
    /**
     * The Amazon Resource Name (ARN) of the queue.
     */
    Arn?: ARN;
  }
  export type QueueStatus = "ENABLED"|"DISABLED"|string;
  export interface QueueSummary {
    /**
     * The identifier of the queue.
     */
    Id?: QueueId;
    /**
     * The Amazon Resource Name (ARN) of the queue.
     */
    Arn?: ARN;
    /**
     * The name of the queue.
     */
    Name?: QueueName;
    /**
     * The type of queue.
     */
    QueueType?: QueueType;
  }
  export type QueueSummaryList = QueueSummary[];
  export type QueueType = "STANDARD"|"AGENT"|string;
  export type QueueTypes = QueueType[];
  export type Queues = QueueId[];
  export interface QuickConnect {
    /**
     * The Amazon Resource Name (ARN) of the quick connect.
     */
    QuickConnectARN?: ARN;
    /**
     * The identifier for the quick connect.
     */
    QuickConnectId?: QuickConnectId;
    /**
     * The name of the quick connect.
     */
    Name?: QuickConnectName;
    /**
     * The description.
     */
    Description?: QuickConnectDescription;
    /**
     * Contains information about the quick connect.
     */
    QuickConnectConfig?: QuickConnectConfig;
    /**
     * One or more tags.
     */
    Tags?: TagMap;
  }
  export interface QuickConnectConfig {
    /**
     * The type of quick connect. In the Amazon Connect console, when you create a quick connect, you are prompted to assign one of the following types: Agent (USER), External (PHONE_NUMBER), or Queue (QUEUE). 
     */
    QuickConnectType: QuickConnectType;
    /**
     * The user configuration. This is required only if QuickConnectType is USER.
     */
    UserConfig?: UserQuickConnectConfig;
    /**
     * The queue configuration. This is required only if QuickConnectType is QUEUE.
     */
    QueueConfig?: QueueQuickConnectConfig;
    /**
     * The phone configuration. This is required only if QuickConnectType is PHONE_NUMBER.
     */
    PhoneConfig?: PhoneNumberQuickConnectConfig;
  }
  export type QuickConnectDescription = string;
  export type QuickConnectId = string;
  export type QuickConnectName = string;
  export interface QuickConnectSummary {
    /**
     * The identifier for the quick connect.
     */
    Id?: QuickConnectId;
    /**
     * The Amazon Resource Name (ARN) of the quick connect.
     */
    Arn?: ARN;
    /**
     * The name of the quick connect.
     */
    Name?: QuickConnectName;
    /**
     * The type of quick connect. In the Amazon Connect console, when you create a quick connect, you are prompted to assign one of the following types: Agent (USER), External (PHONE_NUMBER), or Queue (QUEUE).
     */
    QuickConnectType?: QuickConnectType;
  }
  export type QuickConnectSummaryList = QuickConnectSummary[];
  export type QuickConnectType = "USER"|"QUEUE"|"PHONE_NUMBER"|string;
  export type QuickConnectTypes = QuickConnectType[];
  export type QuickConnectsList = QuickConnectId[];
  export interface Reference {
    /**
     * A valid value for the reference. For example, for a URL reference, a formatted URL that is displayed to an agent in the Contact Control Panel (CCP).
     */
    Value: ReferenceValue;
    /**
     * The type of the reference. Only URL type can be added or updated on a contact.
     */
    Type: ReferenceType;
  }
  export type ReferenceKey = string;
  export type ReferenceStatus = "APPROVED"|"REJECTED"|string;
  export interface ReferenceSummary {
    /**
     * Information about Url reference if the referenceType is URL. Otherwise, null.
     */
    Url?: UrlReference;
    /**
     * Information about the attachment reference if the referenceType is ATTACHMENT. Otherwise, null.
     */
    Attachment?: AttachmentReference;
  }
  export type ReferenceSummaryList = ReferenceSummary[];
  export type ReferenceType = "URL"|"ATTACHMENT"|string;
  export type ReferenceTypes = ReferenceType[];
  export type ReferenceValue = string;
  export interface ResumeContactRecordingRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the contact.
     */
    ContactId: ContactId;
    /**
     * The identifier of the contact. This is the identifier of the contact associated with the first interaction with the contact center.
     */
    InitialContactId: ContactId;
  }
  export interface ResumeContactRecordingResponse {
  }
  export interface RoutingProfile {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId?: InstanceId;
    /**
     * The name of the routing profile.
     */
    Name?: RoutingProfileName;
    /**
     * The Amazon Resource Name (ARN) of the routing profile.
     */
    RoutingProfileArn?: ARN;
    /**
     * The identifier of the routing profile.
     */
    RoutingProfileId?: RoutingProfileId;
    /**
     * The description of the routing profile.
     */
    Description?: RoutingProfileDescription;
    /**
     * The channels agents can handle in the Contact Control Panel (CCP) for this routing profile.
     */
    MediaConcurrencies?: MediaConcurrencies;
    /**
     * The identifier of the default outbound queue for this routing profile.
     */
    DefaultOutboundQueueId?: QueueId;
    /**
     * One or more tags.
     */
    Tags?: TagMap;
  }
  export type RoutingProfileDescription = string;
  export type RoutingProfileId = string;
  export type RoutingProfileName = string;
  export interface RoutingProfileQueueConfig {
    /**
     * Contains information about a queue resource.
     */
    QueueReference: RoutingProfileQueueReference;
    /**
     * The order in which contacts are to be handled for the queue. For more information, see Queues: priority and delay.
     */
    Priority: Priority;
    /**
     * The delay, in seconds, a contact should be in the queue before they are routed to an available agent. For more information, see Queues: priority and delay in the Amazon Connect Administrator Guide.
     */
    Delay: Delay;
  }
  export type RoutingProfileQueueConfigList = RoutingProfileQueueConfig[];
  export interface RoutingProfileQueueConfigSummary {
    /**
     * The identifier for the queue.
     */
    QueueId: QueueId;
    /**
     * The Amazon Resource Name (ARN) of the queue.
     */
    QueueArn: ARN;
    /**
     * The name of the queue.
     */
    QueueName: QueueName;
    /**
     * The order in which contacts are to be handled for the queue. For more information, see Queues: priority and delay.
     */
    Priority: Priority;
    /**
     * The delay, in seconds, that a contact should be in the queue before they are routed to an available agent. For more information, see Queues: priority and delay in the Amazon Connect Administrator Guide.
     */
    Delay: Delay;
    /**
     * The channels this queue supports.
     */
    Channel: Channel;
  }
  export type RoutingProfileQueueConfigSummaryList = RoutingProfileQueueConfigSummary[];
  export interface RoutingProfileQueueReference {
    /**
     * The identifier for the queue.
     */
    QueueId: QueueId;
    /**
     * The channels agents can handle in the Contact Control Panel (CCP) for this routing profile.
     */
    Channel: Channel;
  }
  export type RoutingProfileQueueReferenceList = RoutingProfileQueueReference[];
  export interface RoutingProfileSummary {
    /**
     * The identifier of the routing profile.
     */
    Id?: RoutingProfileId;
    /**
     * The Amazon Resource Name (ARN) of the routing profile.
     */
    Arn?: ARN;
    /**
     * The name of the routing profile.
     */
    Name?: RoutingProfileName;
  }
  export type RoutingProfileSummaryList = RoutingProfileSummary[];
  export interface S3Config {
    /**
     * The S3 bucket name.
     */
    BucketName: BucketName;
    /**
     * The S3 bucket prefix.
     */
    BucketPrefix: Prefix;
    /**
     * The Amazon S3 encryption configuration.
     */
    EncryptionConfig?: EncryptionConfig;
  }
  export interface SecurityKey {
    /**
     * The existing association identifier that uniquely identifies the resource type and storage config for the given instance ID.
     */
    AssociationId?: AssociationId;
    /**
     * The key of the security key.
     */
    Key?: PEM;
    /**
     * When the security key was created.
     */
    CreationTime?: timestamp;
  }
  export type SecurityKeysList = SecurityKey[];
  export interface SecurityProfile {
    /**
     * The identifier for the security profile.
     */
    Id?: SecurityProfileId;
    /**
     * The organization resource identifier for the security profile.
     */
    OrganizationResourceId?: InstanceId;
    /**
     * The Amazon Resource Name (ARN) for the secruity profile.
     */
    Arn?: ARN;
    /**
     * The name for the security profile.
     */
    SecurityProfileName?: SecurityProfileName;
    /**
     * The description of the security profile.
     */
    Description?: SecurityProfileDescription;
    /**
     * One or more tags.
     */
    Tags?: TagMap;
  }
  export type SecurityProfileDescription = string;
  export type SecurityProfileId = string;
  export type SecurityProfileIds = SecurityProfileId[];
  export type SecurityProfileName = string;
  export type SecurityProfilePermission = string;
  export interface SecurityProfileSummary {
    /**
     * The identifier of the security profile.
     */
    Id?: SecurityProfileId;
    /**
     * The Amazon Resource Name (ARN) of the security profile.
     */
    Arn?: ARN;
    /**
     * The name of the security profile.
     */
    Name?: SecurityProfileName;
  }
  export type SecurityProfileSummaryList = SecurityProfileSummary[];
  export type SecurityToken = string;
  export type SourceApplicationName = string;
  export type SourceType = "SALESFORCE"|"ZENDESK"|string;
  export interface StartChatContactRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the contact flow for initiating the chat. To see the ContactFlowId in the Amazon Connect console user interface, on the navigation menu go to Routing, Contact Flows. Choose the contact flow. On the contact flow page, under the name of the contact flow, choose Show additional flow information. The ContactFlowId is the last part of the ARN, shown here in bold:  arn:aws:connect:us-west-2:xxxxxxxxxxxx:instance/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/contact-flow/846ec553-a005-41c0-8341-xxxxxxxxxxxx 
     */
    ContactFlowId: ContactFlowId;
    /**
     * A custom key-value pair using an attribute map. The attributes are standard Amazon Connect attributes. They can be accessed in contact flows just like any other contact attributes.  There can be up to 32,768 UTF-8 bytes across all key-value pairs per contact. Attribute keys can include only alphanumeric, dash, and underscore characters.
     */
    Attributes?: Attributes;
    /**
     * Information identifying the participant.
     */
    ParticipantDetails: ParticipantDetails;
    /**
     * The initial message to be sent to the newly created chat.
     */
    InitialMessage?: ChatMessage;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    ClientToken?: ClientToken;
  }
  export interface StartChatContactResponse {
    /**
     * The identifier of this contact within the Amazon Connect instance. 
     */
    ContactId?: ContactId;
    /**
     * The identifier for a chat participant. The participantId for a chat participant is the same throughout the chat lifecycle.
     */
    ParticipantId?: ParticipantId;
    /**
     * The token used by the chat participant to call CreateParticipantConnection. The participant token is valid for the lifetime of a chat participant.
     */
    ParticipantToken?: ParticipantToken;
  }
  export interface StartContactRecordingRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the contact.
     */
    ContactId: ContactId;
    /**
     * The identifier of the contact. This is the identifier of the contact associated with the first interaction with the contact center.
     */
    InitialContactId: ContactId;
    /**
     * The person being recorded.
     */
    VoiceRecordingConfiguration: VoiceRecordingConfiguration;
  }
  export interface StartContactRecordingResponse {
  }
  export interface StartContactStreamingRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the contact. This is the identifier of the contact associated with the first interaction with the contact center.
     */
    ContactId: ContactId;
    /**
     * The streaming configuration, such as the Amazon SNS streaming endpoint.
     */
    ChatStreamingConfiguration: ChatStreamingConfiguration;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    ClientToken: ClientToken;
  }
  export interface StartContactStreamingResponse {
    /**
     * The identifier of the streaming configuration enabled. 
     */
    StreamingId: StreamingId;
  }
  export interface StartOutboundVoiceContactRequest {
    /**
     * The phone number of the customer, in E.164 format.
     */
    DestinationPhoneNumber: PhoneNumber;
    /**
     * The identifier of the contact flow for the outbound call. To see the ContactFlowId in the Amazon Connect console user interface, on the navigation menu go to Routing, Contact Flows. Choose the contact flow. On the contact flow page, under the name of the contact flow, choose Show additional flow information. The ContactFlowId is the last part of the ARN, shown here in bold:  arn:aws:connect:us-west-2:xxxxxxxxxxxx:instance/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/contact-flow/846ec553-a005-41c0-8341-xxxxxxxxxxxx 
     */
    ContactFlowId: ContactFlowId;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. The token is valid for 7 days after creation. If a contact is already started, the contact ID is returned. 
     */
    ClientToken?: ClientToken;
    /**
     * The phone number associated with the Amazon Connect instance, in E.164 format. If you do not specify a source phone number, you must specify a queue.
     */
    SourcePhoneNumber?: PhoneNumber;
    /**
     * The queue for the call. If you specify a queue, the phone displayed for caller ID is the phone number specified in the queue. If you do not specify a queue, the queue defined in the contact flow is used. If you do not specify a queue, you must specify a source phone number.
     */
    QueueId?: QueueId;
    /**
     * A custom key-value pair using an attribute map. The attributes are standard Amazon Connect attributes, and can be accessed in contact flows just like any other contact attributes. There can be up to 32,768 UTF-8 bytes across all key-value pairs per contact. Attribute keys can include only alphanumeric, dash, and underscore characters.
     */
    Attributes?: Attributes;
    /**
     * Configuration of the answering machine detection for this outbound call. 
     */
    AnswerMachineDetectionConfig?: AnswerMachineDetectionConfig;
    /**
     * The campaign identifier of the outbound communication.
     */
    CampaignId?: CampaignId;
    /**
     * Denotes the class of traffic. Calls with different traffic types are handled differently by Amazon Connect. The default value is GENERAL. Use CAMPAIGN if EnableAnswerMachineDetection is set to true. For all other cases, use GENERAL. 
     */
    TrafficType?: TrafficType;
  }
  export interface StartOutboundVoiceContactResponse {
    /**
     * The identifier of this contact within the Amazon Connect instance.
     */
    ContactId?: ContactId;
  }
  export interface StartTaskContactRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the previous chat, voice, or task contact. 
     */
    PreviousContactId?: ContactId;
    /**
     * The identifier of the contact flow for initiating the tasks. To see the ContactFlowId in the Amazon Connect console user interface, on the navigation menu go to Routing, Contact Flows. Choose the contact flow. On the contact flow page, under the name of the contact flow, choose Show additional flow information. The ContactFlowId is the last part of the ARN, shown here in bold:  arn:aws:connect:us-west-2:xxxxxxxxxxxx:instance/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/contact-flow/846ec553-a005-41c0-8341-xxxxxxxxxxxx 
     */
    ContactFlowId: ContactFlowId;
    /**
     * A custom key-value pair using an attribute map. The attributes are standard Amazon Connect attributes, and can be accessed in contact flows just like any other contact attributes. There can be up to 32,768 UTF-8 bytes across all key-value pairs per contact. Attribute keys can include only alphanumeric, dash, and underscore characters.
     */
    Attributes?: Attributes;
    /**
     * The name of a task that is shown to an agent in the Contact Control Panel (CCP).
     */
    Name: Name;
    /**
     * A formatted URL that is shown to an agent in the Contact Control Panel (CCP).
     */
    References?: ContactReferences;
    /**
     * A description of the task that is shown to an agent in the Contact Control Panel (CCP).
     */
    Description?: Description;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    ClientToken?: ClientToken;
    /**
     * The timestamp, in Unix Epoch seconds format, at which to start running the inbound contact flow. The scheduled time cannot be in the past. It must be within up to 6 days in future. 
     */
    ScheduledTime?: Timestamp;
  }
  export interface StartTaskContactResponse {
    /**
     * The identifier of this contact within the Amazon Connect instance.
     */
    ContactId?: ContactId;
  }
  export type Statistic = "SUM"|"MAX"|"AVG"|string;
  export interface StopContactRecordingRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the contact.
     */
    ContactId: ContactId;
    /**
     * The identifier of the contact. This is the identifier of the contact associated with the first interaction with the contact center.
     */
    InitialContactId: ContactId;
  }
  export interface StopContactRecordingResponse {
  }
  export interface StopContactRequest {
    /**
     * The ID of the contact.
     */
    ContactId: ContactId;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
  }
  export interface StopContactResponse {
  }
  export interface StopContactStreamingRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the contact. This is the identifier of the contact that is associated with the first interaction with the contact center.
     */
    ContactId: ContactId;
    /**
     * The identifier of the streaming configuration enabled. 
     */
    StreamingId: StreamingId;
  }
  export interface StopContactStreamingResponse {
  }
  export type StorageType = "S3"|"KINESIS_VIDEO_STREAM"|"KINESIS_STREAM"|"KINESIS_FIREHOSE"|string;
  export type StreamingId = string;
  export type String = string;
  export interface SuspendContactRecordingRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the contact.
     */
    ContactId: ContactId;
    /**
     * The identifier of the contact. This is the identifier of the contact associated with the first interaction with the contact center.
     */
    InitialContactId: ContactId;
  }
  export interface SuspendContactRecordingResponse {
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: ARN;
    /**
     * One or more tags. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     */
    tags: TagMap;
  }
  export type TagValue = string;
  export interface Threshold {
    /**
     * The type of comparison. Only "less than" (LT) comparisons are supported.
     */
    Comparison?: Comparison;
    /**
     * The threshold value to compare.
     */
    ThresholdValue?: ThresholdValue;
  }
  export type ThresholdValue = number;
  export type TimeZone = string;
  export type Timestamp = Date;
  export type TrafficType = "GENERAL"|"CAMPAIGN"|string;
  export type URI = string;
  export type Unit = "SECONDS"|"COUNT"|"PERCENT"|string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: ARN;
    /**
     * The tag keys.
     */
    tagKeys: TagKeyList;
  }
  export type UpdateAgentStatusDescription = string;
  export interface UpdateAgentStatusRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the agent status.
     */
    AgentStatusId: AgentStatusId;
    /**
     * The name of the agent status.
     */
    Name?: AgentStatusName;
    /**
     * The description of the agent status.
     */
    Description?: UpdateAgentStatusDescription;
    /**
     * The state of the agent status.
     */
    State?: AgentStatusState;
    /**
     * The display order of the agent status.
     */
    DisplayOrder?: AgentStatusOrderNumber;
    /**
     * A number indicating the reset order of the agent status.
     */
    ResetOrderNumber?: Boolean;
  }
  export interface UpdateContactAttributesRequest {
    /**
     * The identifier of the contact. This is the identifier of the contact associated with the first interaction with the contact center.
     */
    InitialContactId: ContactId;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The Amazon Connect attributes. These attributes can be accessed in contact flows just like any other contact attributes. You can have up to 32,768 UTF-8 bytes across all attributes for a contact. Attribute keys can include only alphanumeric, dash, and underscore characters.
     */
    Attributes: Attributes;
  }
  export interface UpdateContactAttributesResponse {
  }
  export interface UpdateContactFlowContentRequest {
    /**
     * The identifier of the Amazon Connect instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the contact flow.
     */
    ContactFlowId: ContactFlowId;
    /**
     * The JSON string that represents contact flow’s content. For an example, see Example contact flow in Amazon Connect Flow language in the Amazon Connect Administrator Guide. 
     */
    Content: ContactFlowContent;
  }
  export interface UpdateContactFlowNameRequest {
    /**
     * The identifier of the Amazon Connect instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the contact flow.
     */
    ContactFlowId: ContactFlowId;
    /**
     * The name of the contact flow.
     */
    Name?: ContactFlowName;
    /**
     * The description of the contact flow.
     */
    Description?: ContactFlowDescription;
  }
  export interface UpdateContactRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the contact. This is the identifier of the contact associated with the first interaction with your contact center.
     */
    ContactId: ContactId;
    /**
     * The name of the contact.
     */
    Name?: Name;
    /**
     * The description of the contact.
     */
    Description?: Description;
    /**
     * A formatted URL that is shown to an agent in the Contact Control Panel (CCP).
     */
    References?: ContactReferences;
  }
  export interface UpdateContactResponse {
  }
  export interface UpdateContactScheduleRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the contact.
     */
    ContactId: ContactId;
    /**
     * The timestamp, in Unix Epoch seconds format, at which to start running the inbound contact flow. The scheduled time cannot be in the past. It must be within up to 6 days in future. 
     */
    ScheduledTime: Timestamp;
  }
  export interface UpdateContactScheduleResponse {
  }
  export type UpdateHoursOfOperationDescription = string;
  export interface UpdateHoursOfOperationRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the hours of operation.
     */
    HoursOfOperationId: HoursOfOperationId;
    /**
     * The name of the hours of operation.
     */
    Name?: CommonNameLength127;
    /**
     * The description of the hours of operation.
     */
    Description?: UpdateHoursOfOperationDescription;
    /**
     * The time zone of the hours of operation.
     */
    TimeZone?: TimeZone;
    /**
     * Configuration information of the hours of operation.
     */
    Config?: HoursOfOperationConfigList;
  }
  export interface UpdateInstanceAttributeRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The type of attribute.  Only allowlisted customers can consume USE_CUSTOM_TTS_VOICES. To access this feature, contact AWS Support for allowlisting. 
     */
    AttributeType: InstanceAttributeType;
    /**
     * The value for the attribute. Maximum character limit is 100. 
     */
    Value: InstanceAttributeValue;
  }
  export interface UpdateInstanceStorageConfigRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The existing association identifier that uniquely identifies the resource type and storage config for the given instance ID.
     */
    AssociationId: AssociationId;
    /**
     * A valid resource type.
     */
    ResourceType: InstanceStorageResourceType;
    StorageConfig: InstanceStorageConfig;
  }
  export interface UpdateQueueHoursOfOperationRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the queue.
     */
    QueueId: QueueId;
    /**
     * The identifier for the hours of operation.
     */
    HoursOfOperationId: HoursOfOperationId;
  }
  export interface UpdateQueueMaxContactsRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the queue.
     */
    QueueId: QueueId;
    /**
     * The maximum number of contacts that can be in the queue before it is considered full.
     */
    MaxContacts?: QueueMaxContacts;
  }
  export interface UpdateQueueNameRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the queue.
     */
    QueueId: QueueId;
    /**
     * The name of the queue.
     */
    Name?: CommonNameLength127;
    /**
     * The description of the queue.
     */
    Description?: QueueDescription;
  }
  export interface UpdateQueueOutboundCallerConfigRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the queue.
     */
    QueueId: QueueId;
    /**
     * The outbound caller ID name, number, and outbound whisper flow.
     */
    OutboundCallerConfig: OutboundCallerConfig;
  }
  export interface UpdateQueueStatusRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the queue.
     */
    QueueId: QueueId;
    /**
     * The status of the queue.
     */
    Status: QueueStatus;
  }
  export interface UpdateQuickConnectConfigRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the quick connect.
     */
    QuickConnectId: QuickConnectId;
    /**
     * Information about the configuration settings for the quick connect.
     */
    QuickConnectConfig: QuickConnectConfig;
  }
  export type UpdateQuickConnectDescription = string;
  export interface UpdateQuickConnectNameRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier for the quick connect.
     */
    QuickConnectId: QuickConnectId;
    /**
     * The name of the quick connect.
     */
    Name?: QuickConnectName;
    /**
     * The description of the quick connect.
     */
    Description?: UpdateQuickConnectDescription;
  }
  export interface UpdateRoutingProfileConcurrencyRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the routing profile.
     */
    RoutingProfileId: RoutingProfileId;
    /**
     * The channels that agents can handle in the Contact Control Panel (CCP).
     */
    MediaConcurrencies: MediaConcurrencies;
  }
  export interface UpdateRoutingProfileDefaultOutboundQueueRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the routing profile.
     */
    RoutingProfileId: RoutingProfileId;
    /**
     * The identifier for the default outbound queue.
     */
    DefaultOutboundQueueId: QueueId;
  }
  export interface UpdateRoutingProfileNameRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the routing profile.
     */
    RoutingProfileId: RoutingProfileId;
    /**
     * The name of the routing profile. Must not be more than 127 characters.
     */
    Name?: RoutingProfileName;
    /**
     * The description of the routing profile. Must not be more than 250 characters.
     */
    Description?: RoutingProfileDescription;
  }
  export interface UpdateRoutingProfileQueuesRequest {
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
    /**
     * The identifier of the routing profile.
     */
    RoutingProfileId: RoutingProfileId;
    /**
     * The queues to be updated for this routing profile. Queues must first be associated to the routing profile. You can do this using AssociateRoutingProfileQueues.
     */
    QueueConfigs: RoutingProfileQueueConfigList;
  }
  export interface UpdateSecurityProfileRequest {
    /**
     * The description of the security profile.
     */
    Description?: SecurityProfileDescription;
    /**
     * The permissions granted to a security profile.
     */
    Permissions?: PermissionsList;
    /**
     * The identifier for the security profle.
     */
    SecurityProfileId: SecurityProfileId;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
  }
  export interface UpdateUserHierarchyGroupNameRequest {
    /**
     * The name of the hierarchy group. Must not be more than 100 characters.
     */
    Name: HierarchyGroupName;
    /**
     * The identifier of the hierarchy group.
     */
    HierarchyGroupId: HierarchyGroupId;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
  }
  export interface UpdateUserHierarchyRequest {
    /**
     * The identifier of the hierarchy group.
     */
    HierarchyGroupId?: HierarchyGroupId;
    /**
     * The identifier of the user account.
     */
    UserId: UserId;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
  }
  export interface UpdateUserHierarchyStructureRequest {
    /**
     * The hierarchy levels to update.
     */
    HierarchyStructure: HierarchyStructureUpdate;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
  }
  export interface UpdateUserIdentityInfoRequest {
    /**
     * The identity information for the user.
     */
    IdentityInfo: UserIdentityInfo;
    /**
     * The identifier of the user account.
     */
    UserId: UserId;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
  }
  export interface UpdateUserPhoneConfigRequest {
    /**
     * Information about phone configuration settings for the user.
     */
    PhoneConfig: UserPhoneConfig;
    /**
     * The identifier of the user account.
     */
    UserId: UserId;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
  }
  export interface UpdateUserRoutingProfileRequest {
    /**
     * The identifier of the routing profile for the user.
     */
    RoutingProfileId: RoutingProfileId;
    /**
     * The identifier of the user account.
     */
    UserId: UserId;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
  }
  export interface UpdateUserSecurityProfilesRequest {
    /**
     * The identifiers of the security profiles for the user.
     */
    SecurityProfileIds: SecurityProfileIds;
    /**
     * The identifier of the user account.
     */
    UserId: UserId;
    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     */
    InstanceId: InstanceId;
  }
  export interface UrlReference {
    /**
     * Identifier of the URL reference.
     */
    Name?: ReferenceKey;
    /**
     * A valid URL.
     */
    Value?: ReferenceValue;
  }
  export interface UseCase {
    /**
     * The identifier for the use case.
     */
    UseCaseId?: UseCaseId;
    /**
     * The Amazon Resource Name (ARN) for the use case.
     */
    UseCaseArn?: ARN;
    /**
     * The type of use case to associate to the integration association. Each integration association can have only one of each use case type.
     */
    UseCaseType?: UseCaseType;
  }
  export type UseCaseId = string;
  export type UseCaseSummaryList = UseCase[];
  export type UseCaseType = "RULES_EVALUATION"|"CONNECT_CAMPAIGNS"|string;
  export interface User {
    /**
     * The identifier of the user account.
     */
    Id?: UserId;
    /**
     * The Amazon Resource Name (ARN) of the user account.
     */
    Arn?: ARN;
    /**
     * The user name assigned to the user account.
     */
    Username?: AgentUsername;
    /**
     * Information about the user identity.
     */
    IdentityInfo?: UserIdentityInfo;
    /**
     * Information about the phone configuration for the user.
     */
    PhoneConfig?: UserPhoneConfig;
    /**
     * The identifier of the user account in the directory used for identity management.
     */
    DirectoryUserId?: DirectoryUserId;
    /**
     * The identifiers of the security profiles for the user.
     */
    SecurityProfileIds?: SecurityProfileIds;
    /**
     * The identifier of the routing profile for the user.
     */
    RoutingProfileId?: RoutingProfileId;
    /**
     * The identifier of the hierarchy group for the user.
     */
    HierarchyGroupId?: HierarchyGroupId;
    /**
     * The tags.
     */
    Tags?: TagMap;
  }
  export type UserId = string;
  export interface UserIdentityInfo {
    /**
     * The first name. This is required if you are using Amazon Connect or SAML for identity management.
     */
    FirstName?: AgentFirstName;
    /**
     * The last name. This is required if you are using Amazon Connect or SAML for identity management.
     */
    LastName?: AgentLastName;
    /**
     * The email address. If you are using SAML for identity management and include this parameter, an error is returned.
     */
    Email?: Email;
  }
  export interface UserPhoneConfig {
    /**
     * The phone type.
     */
    PhoneType: PhoneType;
    /**
     * The Auto accept setting.
     */
    AutoAccept?: AutoAccept;
    /**
     * The After Call Work (ACW) timeout setting, in seconds.
     */
    AfterContactWorkTimeLimit?: AfterContactWorkTimeLimit;
    /**
     * The phone number for the user's desk phone.
     */
    DeskPhoneNumber?: PhoneNumber;
  }
  export interface UserQuickConnectConfig {
    /**
     * The identifier of the user.
     */
    UserId: UserId;
    /**
     * The identifier of the contact flow.
     */
    ContactFlowId: ContactFlowId;
  }
  export interface UserSummary {
    /**
     * The identifier of the user account.
     */
    Id?: UserId;
    /**
     * The Amazon Resource Name (ARN) of the user account.
     */
    Arn?: ARN;
    /**
     * The Amazon Connect user name of the user account.
     */
    Username?: AgentUsername;
  }
  export type UserSummaryList = UserSummary[];
  export type Value = number;
  export interface VoiceRecordingConfiguration {
    /**
     * Identifies which track is being recorded.
     */
    VoiceRecordingTrack?: VoiceRecordingTrack;
  }
  export type VoiceRecordingTrack = "FROM_AGENT"|"TO_AGENT"|"ALL"|string;
  export type timestamp = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-08-08"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Connect client.
   */
  export import Types = Connect;
}
export = Connect;
