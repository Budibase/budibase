import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ChimeSDKVoice extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ChimeSDKVoice.Types.ClientConfiguration)
  config: Config & ChimeSDKVoice.Types.ClientConfiguration;
  /**
   * Associates phone numbers with the specified Amazon Chime SDK Voice Connector.
   */
  associatePhoneNumbersWithVoiceConnector(params: ChimeSDKVoice.Types.AssociatePhoneNumbersWithVoiceConnectorRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.AssociatePhoneNumbersWithVoiceConnectorResponse) => void): Request<ChimeSDKVoice.Types.AssociatePhoneNumbersWithVoiceConnectorResponse, AWSError>;
  /**
   * Associates phone numbers with the specified Amazon Chime SDK Voice Connector.
   */
  associatePhoneNumbersWithVoiceConnector(callback?: (err: AWSError, data: ChimeSDKVoice.Types.AssociatePhoneNumbersWithVoiceConnectorResponse) => void): Request<ChimeSDKVoice.Types.AssociatePhoneNumbersWithVoiceConnectorResponse, AWSError>;
  /**
   * Associates phone numbers with the specified Amazon Chime SDK Voice Connector group.
   */
  associatePhoneNumbersWithVoiceConnectorGroup(params: ChimeSDKVoice.Types.AssociatePhoneNumbersWithVoiceConnectorGroupRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.AssociatePhoneNumbersWithVoiceConnectorGroupResponse) => void): Request<ChimeSDKVoice.Types.AssociatePhoneNumbersWithVoiceConnectorGroupResponse, AWSError>;
  /**
   * Associates phone numbers with the specified Amazon Chime SDK Voice Connector group.
   */
  associatePhoneNumbersWithVoiceConnectorGroup(callback?: (err: AWSError, data: ChimeSDKVoice.Types.AssociatePhoneNumbersWithVoiceConnectorGroupResponse) => void): Request<ChimeSDKVoice.Types.AssociatePhoneNumbersWithVoiceConnectorGroupResponse, AWSError>;
  /**
   *  Moves phone numbers into the Deletion queue. Phone numbers must be disassociated from any users or Amazon Chime SDK Voice Connectors before they can be deleted.   Phone numbers remain in the Deletion queue for 7 days before they are deleted permanently. 
   */
  batchDeletePhoneNumber(params: ChimeSDKVoice.Types.BatchDeletePhoneNumberRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.BatchDeletePhoneNumberResponse) => void): Request<ChimeSDKVoice.Types.BatchDeletePhoneNumberResponse, AWSError>;
  /**
   *  Moves phone numbers into the Deletion queue. Phone numbers must be disassociated from any users or Amazon Chime SDK Voice Connectors before they can be deleted.   Phone numbers remain in the Deletion queue for 7 days before they are deleted permanently. 
   */
  batchDeletePhoneNumber(callback?: (err: AWSError, data: ChimeSDKVoice.Types.BatchDeletePhoneNumberResponse) => void): Request<ChimeSDKVoice.Types.BatchDeletePhoneNumberResponse, AWSError>;
  /**
   * Updates one or more phone numbers.
   */
  batchUpdatePhoneNumber(params: ChimeSDKVoice.Types.BatchUpdatePhoneNumberRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.BatchUpdatePhoneNumberResponse) => void): Request<ChimeSDKVoice.Types.BatchUpdatePhoneNumberResponse, AWSError>;
  /**
   * Updates one or more phone numbers.
   */
  batchUpdatePhoneNumber(callback?: (err: AWSError, data: ChimeSDKVoice.Types.BatchUpdatePhoneNumberResponse) => void): Request<ChimeSDKVoice.Types.BatchUpdatePhoneNumberResponse, AWSError>;
  /**
   * Creates an order for phone numbers to be provisioned. For numbers outside the U.S., you must use the Amazon Chime SDK SIP media application dial-in product type.
   */
  createPhoneNumberOrder(params: ChimeSDKVoice.Types.CreatePhoneNumberOrderRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.CreatePhoneNumberOrderResponse) => void): Request<ChimeSDKVoice.Types.CreatePhoneNumberOrderResponse, AWSError>;
  /**
   * Creates an order for phone numbers to be provisioned. For numbers outside the U.S., you must use the Amazon Chime SDK SIP media application dial-in product type.
   */
  createPhoneNumberOrder(callback?: (err: AWSError, data: ChimeSDKVoice.Types.CreatePhoneNumberOrderResponse) => void): Request<ChimeSDKVoice.Types.CreatePhoneNumberOrderResponse, AWSError>;
  /**
   * Creates a proxy session for the specified Amazon Chime SDK Voice Connector for the specified participant phone numbers.
   */
  createProxySession(params: ChimeSDKVoice.Types.CreateProxySessionRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.CreateProxySessionResponse) => void): Request<ChimeSDKVoice.Types.CreateProxySessionResponse, AWSError>;
  /**
   * Creates a proxy session for the specified Amazon Chime SDK Voice Connector for the specified participant phone numbers.
   */
  createProxySession(callback?: (err: AWSError, data: ChimeSDKVoice.Types.CreateProxySessionResponse) => void): Request<ChimeSDKVoice.Types.CreateProxySessionResponse, AWSError>;
  /**
   * Creates a SIP media application. For more information about SIP media applications, see Managing SIP media applications and rules in the Amazon Chime SDK Administrator Guide.
   */
  createSipMediaApplication(params: ChimeSDKVoice.Types.CreateSipMediaApplicationRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.CreateSipMediaApplicationResponse) => void): Request<ChimeSDKVoice.Types.CreateSipMediaApplicationResponse, AWSError>;
  /**
   * Creates a SIP media application. For more information about SIP media applications, see Managing SIP media applications and rules in the Amazon Chime SDK Administrator Guide.
   */
  createSipMediaApplication(callback?: (err: AWSError, data: ChimeSDKVoice.Types.CreateSipMediaApplicationResponse) => void): Request<ChimeSDKVoice.Types.CreateSipMediaApplicationResponse, AWSError>;
  /**
   * Creates an outbound call to a phone number from the phone number specified in the request, and it invokes the endpoint of the specified sipMediaApplicationId.
   */
  createSipMediaApplicationCall(params: ChimeSDKVoice.Types.CreateSipMediaApplicationCallRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.CreateSipMediaApplicationCallResponse) => void): Request<ChimeSDKVoice.Types.CreateSipMediaApplicationCallResponse, AWSError>;
  /**
   * Creates an outbound call to a phone number from the phone number specified in the request, and it invokes the endpoint of the specified sipMediaApplicationId.
   */
  createSipMediaApplicationCall(callback?: (err: AWSError, data: ChimeSDKVoice.Types.CreateSipMediaApplicationCallResponse) => void): Request<ChimeSDKVoice.Types.CreateSipMediaApplicationCallResponse, AWSError>;
  /**
   * Creates a SIP rule, which can be used to run a SIP media application as a target for a specific trigger type. For more information about SIP rules, see Managing SIP media applications and rules in the Amazon Chime SDK Administrator Guide.
   */
  createSipRule(params: ChimeSDKVoice.Types.CreateSipRuleRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.CreateSipRuleResponse) => void): Request<ChimeSDKVoice.Types.CreateSipRuleResponse, AWSError>;
  /**
   * Creates a SIP rule, which can be used to run a SIP media application as a target for a specific trigger type. For more information about SIP rules, see Managing SIP media applications and rules in the Amazon Chime SDK Administrator Guide.
   */
  createSipRule(callback?: (err: AWSError, data: ChimeSDKVoice.Types.CreateSipRuleResponse) => void): Request<ChimeSDKVoice.Types.CreateSipRuleResponse, AWSError>;
  /**
   * Creates an Amazon Chime SDK Voice Connector. For more information about Voice Connectors, see Managing Amazon Chime SDK Voice Connector groups in the Amazon Chime SDK Administrator Guide.
   */
  createVoiceConnector(params: ChimeSDKVoice.Types.CreateVoiceConnectorRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.CreateVoiceConnectorResponse) => void): Request<ChimeSDKVoice.Types.CreateVoiceConnectorResponse, AWSError>;
  /**
   * Creates an Amazon Chime SDK Voice Connector. For more information about Voice Connectors, see Managing Amazon Chime SDK Voice Connector groups in the Amazon Chime SDK Administrator Guide.
   */
  createVoiceConnector(callback?: (err: AWSError, data: ChimeSDKVoice.Types.CreateVoiceConnectorResponse) => void): Request<ChimeSDKVoice.Types.CreateVoiceConnectorResponse, AWSError>;
  /**
   * Creates an Amazon Chime SDK Voice Connector group under the administrator's AWS account. You can associate Amazon Chime SDK Voice Connectors with the Voice Connector group by including VoiceConnectorItems in the request.  You can include Voice Connectors from different AWS Regions in your group. This creates a fault tolerant mechanism for fallback in case of availability events.
   */
  createVoiceConnectorGroup(params: ChimeSDKVoice.Types.CreateVoiceConnectorGroupRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.CreateVoiceConnectorGroupResponse) => void): Request<ChimeSDKVoice.Types.CreateVoiceConnectorGroupResponse, AWSError>;
  /**
   * Creates an Amazon Chime SDK Voice Connector group under the administrator's AWS account. You can associate Amazon Chime SDK Voice Connectors with the Voice Connector group by including VoiceConnectorItems in the request.  You can include Voice Connectors from different AWS Regions in your group. This creates a fault tolerant mechanism for fallback in case of availability events.
   */
  createVoiceConnectorGroup(callback?: (err: AWSError, data: ChimeSDKVoice.Types.CreateVoiceConnectorGroupResponse) => void): Request<ChimeSDKVoice.Types.CreateVoiceConnectorGroupResponse, AWSError>;
  /**
   * Creates a voice profile, which consists of an enrolled user and their latest voice print.  Before creating any voice profiles, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the AWS service terms for the Amazon Chime SDK.  For more information about voice profiles and voice analytics, see Using Amazon Chime SDK Voice Analytics in the Amazon Chime SDK Developer Guide.
   */
  createVoiceProfile(params: ChimeSDKVoice.Types.CreateVoiceProfileRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.CreateVoiceProfileResponse) => void): Request<ChimeSDKVoice.Types.CreateVoiceProfileResponse, AWSError>;
  /**
   * Creates a voice profile, which consists of an enrolled user and their latest voice print.  Before creating any voice profiles, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the AWS service terms for the Amazon Chime SDK.  For more information about voice profiles and voice analytics, see Using Amazon Chime SDK Voice Analytics in the Amazon Chime SDK Developer Guide.
   */
  createVoiceProfile(callback?: (err: AWSError, data: ChimeSDKVoice.Types.CreateVoiceProfileResponse) => void): Request<ChimeSDKVoice.Types.CreateVoiceProfileResponse, AWSError>;
  /**
   * Creates a voice profile domain, a collection of voice profiles, their voice prints, and encrypted enrollment audio.  Before creating any voice profiles, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the AWS service terms for the Amazon Chime SDK.  For more information about voice profile domains, see Using Amazon Chime SDK Voice Analytics in the Amazon Chime SDK Developer Guide.
   */
  createVoiceProfileDomain(params: ChimeSDKVoice.Types.CreateVoiceProfileDomainRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.CreateVoiceProfileDomainResponse) => void): Request<ChimeSDKVoice.Types.CreateVoiceProfileDomainResponse, AWSError>;
  /**
   * Creates a voice profile domain, a collection of voice profiles, their voice prints, and encrypted enrollment audio.  Before creating any voice profiles, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the AWS service terms for the Amazon Chime SDK.  For more information about voice profile domains, see Using Amazon Chime SDK Voice Analytics in the Amazon Chime SDK Developer Guide.
   */
  createVoiceProfileDomain(callback?: (err: AWSError, data: ChimeSDKVoice.Types.CreateVoiceProfileDomainResponse) => void): Request<ChimeSDKVoice.Types.CreateVoiceProfileDomainResponse, AWSError>;
  /**
   * Moves the specified phone number into the Deletion queue. A phone number must be disassociated from any users or Amazon Chime SDK Voice Connectors before it can be deleted. Deleted phone numbers remain in the Deletion queue queue for 7 days before they are deleted permanently.
   */
  deletePhoneNumber(params: ChimeSDKVoice.Types.DeletePhoneNumberRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Moves the specified phone number into the Deletion queue. A phone number must be disassociated from any users or Amazon Chime SDK Voice Connectors before it can be deleted. Deleted phone numbers remain in the Deletion queue queue for 7 days before they are deleted permanently.
   */
  deletePhoneNumber(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified proxy session from the specified Amazon Chime SDK Voice Connector.
   */
  deleteProxySession(params: ChimeSDKVoice.Types.DeleteProxySessionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified proxy session from the specified Amazon Chime SDK Voice Connector.
   */
  deleteProxySession(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a SIP media application.
   */
  deleteSipMediaApplication(params: ChimeSDKVoice.Types.DeleteSipMediaApplicationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a SIP media application.
   */
  deleteSipMediaApplication(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a SIP rule.
   */
  deleteSipRule(params: ChimeSDKVoice.Types.DeleteSipRuleRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a SIP rule.
   */
  deleteSipRule(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Amazon Chime SDK Voice Connector. Any phone numbers associated with the Amazon Chime SDK Voice Connector must be disassociated from it before it can be deleted.
   */
  deleteVoiceConnector(params: ChimeSDKVoice.Types.DeleteVoiceConnectorRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Amazon Chime SDK Voice Connector. Any phone numbers associated with the Amazon Chime SDK Voice Connector must be disassociated from it before it can be deleted.
   */
  deleteVoiceConnector(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the emergency calling details from the specified Amazon Chime SDK Voice Connector.
   */
  deleteVoiceConnectorEmergencyCallingConfiguration(params: ChimeSDKVoice.Types.DeleteVoiceConnectorEmergencyCallingConfigurationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the emergency calling details from the specified Amazon Chime SDK Voice Connector.
   */
  deleteVoiceConnectorEmergencyCallingConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Amazon Chime SDK Voice Connector group. Any VoiceConnectorItems and phone numbers associated with the group must be removed before it can be deleted.
   */
  deleteVoiceConnectorGroup(params: ChimeSDKVoice.Types.DeleteVoiceConnectorGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Amazon Chime SDK Voice Connector group. Any VoiceConnectorItems and phone numbers associated with the group must be removed before it can be deleted.
   */
  deleteVoiceConnectorGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the origination settings for the specified Amazon Chime SDK Voice Connector.   If emergency calling is configured for the Voice Connector, it must be deleted prior to deleting the origination settings. 
   */
  deleteVoiceConnectorOrigination(params: ChimeSDKVoice.Types.DeleteVoiceConnectorOriginationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the origination settings for the specified Amazon Chime SDK Voice Connector.   If emergency calling is configured for the Voice Connector, it must be deleted prior to deleting the origination settings. 
   */
  deleteVoiceConnectorOrigination(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the proxy configuration from the specified Amazon Chime SDK Voice Connector.
   */
  deleteVoiceConnectorProxy(params: ChimeSDKVoice.Types.DeleteVoiceConnectorProxyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the proxy configuration from the specified Amazon Chime SDK Voice Connector.
   */
  deleteVoiceConnectorProxy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Voice Connector's streaming configuration.
   */
  deleteVoiceConnectorStreamingConfiguration(params: ChimeSDKVoice.Types.DeleteVoiceConnectorStreamingConfigurationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Voice Connector's streaming configuration.
   */
  deleteVoiceConnectorStreamingConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the termination settings for the specified Amazon Chime SDK Voice Connector.  If emergency calling is configured for the Voice Connector, it must be deleted prior to deleting the termination settings. 
   */
  deleteVoiceConnectorTermination(params: ChimeSDKVoice.Types.DeleteVoiceConnectorTerminationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the termination settings for the specified Amazon Chime SDK Voice Connector.  If emergency calling is configured for the Voice Connector, it must be deleted prior to deleting the termination settings. 
   */
  deleteVoiceConnectorTermination(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified SIP credentials used by your equipment to authenticate during call termination.
   */
  deleteVoiceConnectorTerminationCredentials(params: ChimeSDKVoice.Types.DeleteVoiceConnectorTerminationCredentialsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified SIP credentials used by your equipment to authenticate during call termination.
   */
  deleteVoiceConnectorTerminationCredentials(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a voice profile, including its voice print and enrollment data. WARNING: This action is not reversible.
   */
  deleteVoiceProfile(params: ChimeSDKVoice.Types.DeleteVoiceProfileRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a voice profile, including its voice print and enrollment data. WARNING: This action is not reversible.
   */
  deleteVoiceProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes all voice profiles in the domain. WARNING: This action is not reversible.
   */
  deleteVoiceProfileDomain(params: ChimeSDKVoice.Types.DeleteVoiceProfileDomainRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes all voice profiles in the domain. WARNING: This action is not reversible.
   */
  deleteVoiceProfileDomain(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disassociates the specified phone numbers from the specified Amazon Chime SDK Voice Connector.
   */
  disassociatePhoneNumbersFromVoiceConnector(params: ChimeSDKVoice.Types.DisassociatePhoneNumbersFromVoiceConnectorRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.DisassociatePhoneNumbersFromVoiceConnectorResponse) => void): Request<ChimeSDKVoice.Types.DisassociatePhoneNumbersFromVoiceConnectorResponse, AWSError>;
  /**
   * Disassociates the specified phone numbers from the specified Amazon Chime SDK Voice Connector.
   */
  disassociatePhoneNumbersFromVoiceConnector(callback?: (err: AWSError, data: ChimeSDKVoice.Types.DisassociatePhoneNumbersFromVoiceConnectorResponse) => void): Request<ChimeSDKVoice.Types.DisassociatePhoneNumbersFromVoiceConnectorResponse, AWSError>;
  /**
   * Disassociates the specified phone numbers from the specified Amazon Chime SDK Voice Connector group.
   */
  disassociatePhoneNumbersFromVoiceConnectorGroup(params: ChimeSDKVoice.Types.DisassociatePhoneNumbersFromVoiceConnectorGroupRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.DisassociatePhoneNumbersFromVoiceConnectorGroupResponse) => void): Request<ChimeSDKVoice.Types.DisassociatePhoneNumbersFromVoiceConnectorGroupResponse, AWSError>;
  /**
   * Disassociates the specified phone numbers from the specified Amazon Chime SDK Voice Connector group.
   */
  disassociatePhoneNumbersFromVoiceConnectorGroup(callback?: (err: AWSError, data: ChimeSDKVoice.Types.DisassociatePhoneNumbersFromVoiceConnectorGroupResponse) => void): Request<ChimeSDKVoice.Types.DisassociatePhoneNumbersFromVoiceConnectorGroupResponse, AWSError>;
  /**
   * Retrieves the global settings for the Amazon Chime SDK Voice Connectors in an AWS account.
   */
  getGlobalSettings(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetGlobalSettingsResponse) => void): Request<ChimeSDKVoice.Types.GetGlobalSettingsResponse, AWSError>;
  /**
   * Retrieves details for the specified phone number ID, such as associations, capabilities, and product type.
   */
  getPhoneNumber(params: ChimeSDKVoice.Types.GetPhoneNumberRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetPhoneNumberResponse) => void): Request<ChimeSDKVoice.Types.GetPhoneNumberResponse, AWSError>;
  /**
   * Retrieves details for the specified phone number ID, such as associations, capabilities, and product type.
   */
  getPhoneNumber(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetPhoneNumberResponse) => void): Request<ChimeSDKVoice.Types.GetPhoneNumberResponse, AWSError>;
  /**
   * Retrieves details for the specified phone number order, such as the order creation timestamp, phone numbers in E.164 format, product type, and order status.
   */
  getPhoneNumberOrder(params: ChimeSDKVoice.Types.GetPhoneNumberOrderRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetPhoneNumberOrderResponse) => void): Request<ChimeSDKVoice.Types.GetPhoneNumberOrderResponse, AWSError>;
  /**
   * Retrieves details for the specified phone number order, such as the order creation timestamp, phone numbers in E.164 format, product type, and order status.
   */
  getPhoneNumberOrder(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetPhoneNumberOrderResponse) => void): Request<ChimeSDKVoice.Types.GetPhoneNumberOrderResponse, AWSError>;
  /**
   * Retrieves the phone number settings for the administrator's AWS account, such as the default outbound calling name.
   */
  getPhoneNumberSettings(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetPhoneNumberSettingsResponse) => void): Request<ChimeSDKVoice.Types.GetPhoneNumberSettingsResponse, AWSError>;
  /**
   * Retrieves the specified proxy session details for the specified Amazon Chime SDK Voice Connector.
   */
  getProxySession(params: ChimeSDKVoice.Types.GetProxySessionRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetProxySessionResponse) => void): Request<ChimeSDKVoice.Types.GetProxySessionResponse, AWSError>;
  /**
   * Retrieves the specified proxy session details for the specified Amazon Chime SDK Voice Connector.
   */
  getProxySession(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetProxySessionResponse) => void): Request<ChimeSDKVoice.Types.GetProxySessionResponse, AWSError>;
  /**
   * Retrieves the information for a SIP media application, including name, AWS Region, and endpoints.
   */
  getSipMediaApplication(params: ChimeSDKVoice.Types.GetSipMediaApplicationRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetSipMediaApplicationResponse) => void): Request<ChimeSDKVoice.Types.GetSipMediaApplicationResponse, AWSError>;
  /**
   * Retrieves the information for a SIP media application, including name, AWS Region, and endpoints.
   */
  getSipMediaApplication(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetSipMediaApplicationResponse) => void): Request<ChimeSDKVoice.Types.GetSipMediaApplicationResponse, AWSError>;
  /**
   * Gets the Alexa Skill configuration for the SIP media application.
   */
  getSipMediaApplicationAlexaSkillConfiguration(params: ChimeSDKVoice.Types.GetSipMediaApplicationAlexaSkillConfigurationRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetSipMediaApplicationAlexaSkillConfigurationResponse) => void): Request<ChimeSDKVoice.Types.GetSipMediaApplicationAlexaSkillConfigurationResponse, AWSError>;
  /**
   * Gets the Alexa Skill configuration for the SIP media application.
   */
  getSipMediaApplicationAlexaSkillConfiguration(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetSipMediaApplicationAlexaSkillConfigurationResponse) => void): Request<ChimeSDKVoice.Types.GetSipMediaApplicationAlexaSkillConfigurationResponse, AWSError>;
  /**
   * Retrieves the logging configuration for the specified SIP media application.
   */
  getSipMediaApplicationLoggingConfiguration(params: ChimeSDKVoice.Types.GetSipMediaApplicationLoggingConfigurationRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetSipMediaApplicationLoggingConfigurationResponse) => void): Request<ChimeSDKVoice.Types.GetSipMediaApplicationLoggingConfigurationResponse, AWSError>;
  /**
   * Retrieves the logging configuration for the specified SIP media application.
   */
  getSipMediaApplicationLoggingConfiguration(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetSipMediaApplicationLoggingConfigurationResponse) => void): Request<ChimeSDKVoice.Types.GetSipMediaApplicationLoggingConfigurationResponse, AWSError>;
  /**
   * Retrieves the details of a SIP rule, such as the rule ID, name, triggers, and target endpoints.
   */
  getSipRule(params: ChimeSDKVoice.Types.GetSipRuleRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetSipRuleResponse) => void): Request<ChimeSDKVoice.Types.GetSipRuleResponse, AWSError>;
  /**
   * Retrieves the details of a SIP rule, such as the rule ID, name, triggers, and target endpoints.
   */
  getSipRule(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetSipRuleResponse) => void): Request<ChimeSDKVoice.Types.GetSipRuleResponse, AWSError>;
  /**
   * Retrieves the details of the specified speaker search task.
   */
  getSpeakerSearchTask(params: ChimeSDKVoice.Types.GetSpeakerSearchTaskRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetSpeakerSearchTaskResponse) => void): Request<ChimeSDKVoice.Types.GetSpeakerSearchTaskResponse, AWSError>;
  /**
   * Retrieves the details of the specified speaker search task.
   */
  getSpeakerSearchTask(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetSpeakerSearchTaskResponse) => void): Request<ChimeSDKVoice.Types.GetSpeakerSearchTaskResponse, AWSError>;
  /**
   * Retrieves details for the specified Amazon Chime SDK Voice Connector, such as timestamps,name, outbound host, and encryption requirements.
   */
  getVoiceConnector(params: ChimeSDKVoice.Types.GetVoiceConnectorRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceConnectorResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceConnectorResponse, AWSError>;
  /**
   * Retrieves details for the specified Amazon Chime SDK Voice Connector, such as timestamps,name, outbound host, and encryption requirements.
   */
  getVoiceConnector(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceConnectorResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceConnectorResponse, AWSError>;
  /**
   * Retrieves the emergency calling configuration details for the specified Voice Connector.
   */
  getVoiceConnectorEmergencyCallingConfiguration(params: ChimeSDKVoice.Types.GetVoiceConnectorEmergencyCallingConfigurationRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceConnectorEmergencyCallingConfigurationResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceConnectorEmergencyCallingConfigurationResponse, AWSError>;
  /**
   * Retrieves the emergency calling configuration details for the specified Voice Connector.
   */
  getVoiceConnectorEmergencyCallingConfiguration(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceConnectorEmergencyCallingConfigurationResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceConnectorEmergencyCallingConfigurationResponse, AWSError>;
  /**
   * Retrieves details for the specified Amazon Chime SDK Voice Connector group, such as timestamps,name, and associated VoiceConnectorItems.
   */
  getVoiceConnectorGroup(params: ChimeSDKVoice.Types.GetVoiceConnectorGroupRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceConnectorGroupResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceConnectorGroupResponse, AWSError>;
  /**
   * Retrieves details for the specified Amazon Chime SDK Voice Connector group, such as timestamps,name, and associated VoiceConnectorItems.
   */
  getVoiceConnectorGroup(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceConnectorGroupResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceConnectorGroupResponse, AWSError>;
  /**
   * Retrieves the logging configuration settings for the specified Voice Connector. Shows whether SIP message logs are enabled for sending to Amazon CloudWatch Logs.
   */
  getVoiceConnectorLoggingConfiguration(params: ChimeSDKVoice.Types.GetVoiceConnectorLoggingConfigurationRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceConnectorLoggingConfigurationResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceConnectorLoggingConfigurationResponse, AWSError>;
  /**
   * Retrieves the logging configuration settings for the specified Voice Connector. Shows whether SIP message logs are enabled for sending to Amazon CloudWatch Logs.
   */
  getVoiceConnectorLoggingConfiguration(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceConnectorLoggingConfigurationResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceConnectorLoggingConfigurationResponse, AWSError>;
  /**
   * Retrieves the origination settings for the specified Voice Connector.
   */
  getVoiceConnectorOrigination(params: ChimeSDKVoice.Types.GetVoiceConnectorOriginationRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceConnectorOriginationResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceConnectorOriginationResponse, AWSError>;
  /**
   * Retrieves the origination settings for the specified Voice Connector.
   */
  getVoiceConnectorOrigination(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceConnectorOriginationResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceConnectorOriginationResponse, AWSError>;
  /**
   * Retrieves the proxy configuration details for the specified Amazon Chime SDK Voice Connector.
   */
  getVoiceConnectorProxy(params: ChimeSDKVoice.Types.GetVoiceConnectorProxyRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceConnectorProxyResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceConnectorProxyResponse, AWSError>;
  /**
   * Retrieves the proxy configuration details for the specified Amazon Chime SDK Voice Connector.
   */
  getVoiceConnectorProxy(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceConnectorProxyResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceConnectorProxyResponse, AWSError>;
  /**
   * Retrieves the streaming configuration details for the specified Amazon Chime SDK Voice Connector. Shows whether media streaming is enabled for sending to Amazon Kinesis. It also shows the retention period, in hours, for the Amazon Kinesis data.
   */
  getVoiceConnectorStreamingConfiguration(params: ChimeSDKVoice.Types.GetVoiceConnectorStreamingConfigurationRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceConnectorStreamingConfigurationResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceConnectorStreamingConfigurationResponse, AWSError>;
  /**
   * Retrieves the streaming configuration details for the specified Amazon Chime SDK Voice Connector. Shows whether media streaming is enabled for sending to Amazon Kinesis. It also shows the retention period, in hours, for the Amazon Kinesis data.
   */
  getVoiceConnectorStreamingConfiguration(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceConnectorStreamingConfigurationResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceConnectorStreamingConfigurationResponse, AWSError>;
  /**
   * Retrieves the termination setting details for the specified Voice Connector.
   */
  getVoiceConnectorTermination(params: ChimeSDKVoice.Types.GetVoiceConnectorTerminationRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceConnectorTerminationResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceConnectorTerminationResponse, AWSError>;
  /**
   * Retrieves the termination setting details for the specified Voice Connector.
   */
  getVoiceConnectorTermination(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceConnectorTerminationResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceConnectorTerminationResponse, AWSError>;
  /**
   * Retrieves information about the last time a SIP OPTIONS ping was received from your SIP infrastructure for the specified Amazon Chime SDK Voice Connector.
   */
  getVoiceConnectorTerminationHealth(params: ChimeSDKVoice.Types.GetVoiceConnectorTerminationHealthRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceConnectorTerminationHealthResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceConnectorTerminationHealthResponse, AWSError>;
  /**
   * Retrieves information about the last time a SIP OPTIONS ping was received from your SIP infrastructure for the specified Amazon Chime SDK Voice Connector.
   */
  getVoiceConnectorTerminationHealth(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceConnectorTerminationHealthResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceConnectorTerminationHealthResponse, AWSError>;
  /**
   * Retrieves the details of the specified voice profile.
   */
  getVoiceProfile(params: ChimeSDKVoice.Types.GetVoiceProfileRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceProfileResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceProfileResponse, AWSError>;
  /**
   * Retrieves the details of the specified voice profile.
   */
  getVoiceProfile(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceProfileResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceProfileResponse, AWSError>;
  /**
   * Retrieves the details of the specified voice profile domain.
   */
  getVoiceProfileDomain(params: ChimeSDKVoice.Types.GetVoiceProfileDomainRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceProfileDomainResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceProfileDomainResponse, AWSError>;
  /**
   * Retrieves the details of the specified voice profile domain.
   */
  getVoiceProfileDomain(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceProfileDomainResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceProfileDomainResponse, AWSError>;
  /**
   * Retrieves the details of a voice tone analysis task.
   */
  getVoiceToneAnalysisTask(params: ChimeSDKVoice.Types.GetVoiceToneAnalysisTaskRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceToneAnalysisTaskResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceToneAnalysisTaskResponse, AWSError>;
  /**
   * Retrieves the details of a voice tone analysis task.
   */
  getVoiceToneAnalysisTask(callback?: (err: AWSError, data: ChimeSDKVoice.Types.GetVoiceToneAnalysisTaskResponse) => void): Request<ChimeSDKVoice.Types.GetVoiceToneAnalysisTaskResponse, AWSError>;
  /**
   * Lists the available AWS Regions in which you can create an Amazon Chime SDK Voice Connector.
   */
  listAvailableVoiceConnectorRegions(callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListAvailableVoiceConnectorRegionsResponse) => void): Request<ChimeSDKVoice.Types.ListAvailableVoiceConnectorRegionsResponse, AWSError>;
  /**
   * Lists the phone numbers for an administrator's Amazon Chime SDK account.
   */
  listPhoneNumberOrders(params: ChimeSDKVoice.Types.ListPhoneNumberOrdersRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListPhoneNumberOrdersResponse) => void): Request<ChimeSDKVoice.Types.ListPhoneNumberOrdersResponse, AWSError>;
  /**
   * Lists the phone numbers for an administrator's Amazon Chime SDK account.
   */
  listPhoneNumberOrders(callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListPhoneNumberOrdersResponse) => void): Request<ChimeSDKVoice.Types.ListPhoneNumberOrdersResponse, AWSError>;
  /**
   * Lists the phone numbers for the specified Amazon Chime SDK account, Amazon Chime SDK user, Amazon Chime SDK Voice Connector, or Amazon Chime SDK Voice Connector group.
   */
  listPhoneNumbers(params: ChimeSDKVoice.Types.ListPhoneNumbersRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListPhoneNumbersResponse) => void): Request<ChimeSDKVoice.Types.ListPhoneNumbersResponse, AWSError>;
  /**
   * Lists the phone numbers for the specified Amazon Chime SDK account, Amazon Chime SDK user, Amazon Chime SDK Voice Connector, or Amazon Chime SDK Voice Connector group.
   */
  listPhoneNumbers(callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListPhoneNumbersResponse) => void): Request<ChimeSDKVoice.Types.ListPhoneNumbersResponse, AWSError>;
  /**
   * Lists the proxy sessions for the specified Amazon Chime SDK Voice Connector.
   */
  listProxySessions(params: ChimeSDKVoice.Types.ListProxySessionsRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListProxySessionsResponse) => void): Request<ChimeSDKVoice.Types.ListProxySessionsResponse, AWSError>;
  /**
   * Lists the proxy sessions for the specified Amazon Chime SDK Voice Connector.
   */
  listProxySessions(callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListProxySessionsResponse) => void): Request<ChimeSDKVoice.Types.ListProxySessionsResponse, AWSError>;
  /**
   * Lists the SIP media applications under the administrator's AWS account.
   */
  listSipMediaApplications(params: ChimeSDKVoice.Types.ListSipMediaApplicationsRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListSipMediaApplicationsResponse) => void): Request<ChimeSDKVoice.Types.ListSipMediaApplicationsResponse, AWSError>;
  /**
   * Lists the SIP media applications under the administrator's AWS account.
   */
  listSipMediaApplications(callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListSipMediaApplicationsResponse) => void): Request<ChimeSDKVoice.Types.ListSipMediaApplicationsResponse, AWSError>;
  /**
   * Lists the SIP rules under the administrator's AWS account.
   */
  listSipRules(params: ChimeSDKVoice.Types.ListSipRulesRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListSipRulesResponse) => void): Request<ChimeSDKVoice.Types.ListSipRulesResponse, AWSError>;
  /**
   * Lists the SIP rules under the administrator's AWS account.
   */
  listSipRules(callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListSipRulesResponse) => void): Request<ChimeSDKVoice.Types.ListSipRulesResponse, AWSError>;
  /**
   * Lists the countries that you can order phone numbers from.
   */
  listSupportedPhoneNumberCountries(params: ChimeSDKVoice.Types.ListSupportedPhoneNumberCountriesRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListSupportedPhoneNumberCountriesResponse) => void): Request<ChimeSDKVoice.Types.ListSupportedPhoneNumberCountriesResponse, AWSError>;
  /**
   * Lists the countries that you can order phone numbers from.
   */
  listSupportedPhoneNumberCountries(callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListSupportedPhoneNumberCountriesResponse) => void): Request<ChimeSDKVoice.Types.ListSupportedPhoneNumberCountriesResponse, AWSError>;
  /**
   * Returns a list of the tags in a given resource.
   */
  listTagsForResource(params: ChimeSDKVoice.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListTagsForResourceResponse) => void): Request<ChimeSDKVoice.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns a list of the tags in a given resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListTagsForResourceResponse) => void): Request<ChimeSDKVoice.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the Amazon Chime SDK Voice Connector groups in the administrator's AWS account.
   */
  listVoiceConnectorGroups(params: ChimeSDKVoice.Types.ListVoiceConnectorGroupsRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListVoiceConnectorGroupsResponse) => void): Request<ChimeSDKVoice.Types.ListVoiceConnectorGroupsResponse, AWSError>;
  /**
   * Lists the Amazon Chime SDK Voice Connector groups in the administrator's AWS account.
   */
  listVoiceConnectorGroups(callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListVoiceConnectorGroupsResponse) => void): Request<ChimeSDKVoice.Types.ListVoiceConnectorGroupsResponse, AWSError>;
  /**
   * Lists the SIP credentials for the specified Amazon Chime SDK Voice Connector.
   */
  listVoiceConnectorTerminationCredentials(params: ChimeSDKVoice.Types.ListVoiceConnectorTerminationCredentialsRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListVoiceConnectorTerminationCredentialsResponse) => void): Request<ChimeSDKVoice.Types.ListVoiceConnectorTerminationCredentialsResponse, AWSError>;
  /**
   * Lists the SIP credentials for the specified Amazon Chime SDK Voice Connector.
   */
  listVoiceConnectorTerminationCredentials(callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListVoiceConnectorTerminationCredentialsResponse) => void): Request<ChimeSDKVoice.Types.ListVoiceConnectorTerminationCredentialsResponse, AWSError>;
  /**
   * Lists the Amazon Chime SDK Voice Connectors in the administrators AWS account.
   */
  listVoiceConnectors(params: ChimeSDKVoice.Types.ListVoiceConnectorsRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListVoiceConnectorsResponse) => void): Request<ChimeSDKVoice.Types.ListVoiceConnectorsResponse, AWSError>;
  /**
   * Lists the Amazon Chime SDK Voice Connectors in the administrators AWS account.
   */
  listVoiceConnectors(callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListVoiceConnectorsResponse) => void): Request<ChimeSDKVoice.Types.ListVoiceConnectorsResponse, AWSError>;
  /**
   * Lists the specified voice profile domains in the administrator's AWS account. 
   */
  listVoiceProfileDomains(params: ChimeSDKVoice.Types.ListVoiceProfileDomainsRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListVoiceProfileDomainsResponse) => void): Request<ChimeSDKVoice.Types.ListVoiceProfileDomainsResponse, AWSError>;
  /**
   * Lists the specified voice profile domains in the administrator's AWS account. 
   */
  listVoiceProfileDomains(callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListVoiceProfileDomainsResponse) => void): Request<ChimeSDKVoice.Types.ListVoiceProfileDomainsResponse, AWSError>;
  /**
   * Lists the voice profiles in a voice profile domain.
   */
  listVoiceProfiles(params: ChimeSDKVoice.Types.ListVoiceProfilesRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListVoiceProfilesResponse) => void): Request<ChimeSDKVoice.Types.ListVoiceProfilesResponse, AWSError>;
  /**
   * Lists the voice profiles in a voice profile domain.
   */
  listVoiceProfiles(callback?: (err: AWSError, data: ChimeSDKVoice.Types.ListVoiceProfilesResponse) => void): Request<ChimeSDKVoice.Types.ListVoiceProfilesResponse, AWSError>;
  /**
   * Updates the Alexa Skill configuration for the SIP media application.
   */
  putSipMediaApplicationAlexaSkillConfiguration(params: ChimeSDKVoice.Types.PutSipMediaApplicationAlexaSkillConfigurationRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.PutSipMediaApplicationAlexaSkillConfigurationResponse) => void): Request<ChimeSDKVoice.Types.PutSipMediaApplicationAlexaSkillConfigurationResponse, AWSError>;
  /**
   * Updates the Alexa Skill configuration for the SIP media application.
   */
  putSipMediaApplicationAlexaSkillConfiguration(callback?: (err: AWSError, data: ChimeSDKVoice.Types.PutSipMediaApplicationAlexaSkillConfigurationResponse) => void): Request<ChimeSDKVoice.Types.PutSipMediaApplicationAlexaSkillConfigurationResponse, AWSError>;
  /**
   * Updates the logging configuration for the specified SIP media application.
   */
  putSipMediaApplicationLoggingConfiguration(params: ChimeSDKVoice.Types.PutSipMediaApplicationLoggingConfigurationRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.PutSipMediaApplicationLoggingConfigurationResponse) => void): Request<ChimeSDKVoice.Types.PutSipMediaApplicationLoggingConfigurationResponse, AWSError>;
  /**
   * Updates the logging configuration for the specified SIP media application.
   */
  putSipMediaApplicationLoggingConfiguration(callback?: (err: AWSError, data: ChimeSDKVoice.Types.PutSipMediaApplicationLoggingConfigurationResponse) => void): Request<ChimeSDKVoice.Types.PutSipMediaApplicationLoggingConfigurationResponse, AWSError>;
  /**
   * Updates a Voice Connector's emergency calling configuration.
   */
  putVoiceConnectorEmergencyCallingConfiguration(params: ChimeSDKVoice.Types.PutVoiceConnectorEmergencyCallingConfigurationRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.PutVoiceConnectorEmergencyCallingConfigurationResponse) => void): Request<ChimeSDKVoice.Types.PutVoiceConnectorEmergencyCallingConfigurationResponse, AWSError>;
  /**
   * Updates a Voice Connector's emergency calling configuration.
   */
  putVoiceConnectorEmergencyCallingConfiguration(callback?: (err: AWSError, data: ChimeSDKVoice.Types.PutVoiceConnectorEmergencyCallingConfigurationResponse) => void): Request<ChimeSDKVoice.Types.PutVoiceConnectorEmergencyCallingConfigurationResponse, AWSError>;
  /**
   * Updates a Voice Connector's logging configuration.
   */
  putVoiceConnectorLoggingConfiguration(params: ChimeSDKVoice.Types.PutVoiceConnectorLoggingConfigurationRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.PutVoiceConnectorLoggingConfigurationResponse) => void): Request<ChimeSDKVoice.Types.PutVoiceConnectorLoggingConfigurationResponse, AWSError>;
  /**
   * Updates a Voice Connector's logging configuration.
   */
  putVoiceConnectorLoggingConfiguration(callback?: (err: AWSError, data: ChimeSDKVoice.Types.PutVoiceConnectorLoggingConfigurationResponse) => void): Request<ChimeSDKVoice.Types.PutVoiceConnectorLoggingConfigurationResponse, AWSError>;
  /**
   * Updates a Voice Connector's origination settings.
   */
  putVoiceConnectorOrigination(params: ChimeSDKVoice.Types.PutVoiceConnectorOriginationRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.PutVoiceConnectorOriginationResponse) => void): Request<ChimeSDKVoice.Types.PutVoiceConnectorOriginationResponse, AWSError>;
  /**
   * Updates a Voice Connector's origination settings.
   */
  putVoiceConnectorOrigination(callback?: (err: AWSError, data: ChimeSDKVoice.Types.PutVoiceConnectorOriginationResponse) => void): Request<ChimeSDKVoice.Types.PutVoiceConnectorOriginationResponse, AWSError>;
  /**
   * Puts the specified proxy configuration to the specified Amazon Chime SDK Voice Connector.
   */
  putVoiceConnectorProxy(params: ChimeSDKVoice.Types.PutVoiceConnectorProxyRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.PutVoiceConnectorProxyResponse) => void): Request<ChimeSDKVoice.Types.PutVoiceConnectorProxyResponse, AWSError>;
  /**
   * Puts the specified proxy configuration to the specified Amazon Chime SDK Voice Connector.
   */
  putVoiceConnectorProxy(callback?: (err: AWSError, data: ChimeSDKVoice.Types.PutVoiceConnectorProxyResponse) => void): Request<ChimeSDKVoice.Types.PutVoiceConnectorProxyResponse, AWSError>;
  /**
   * Updates a Voice Connector's streaming configuration settings.
   */
  putVoiceConnectorStreamingConfiguration(params: ChimeSDKVoice.Types.PutVoiceConnectorStreamingConfigurationRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.PutVoiceConnectorStreamingConfigurationResponse) => void): Request<ChimeSDKVoice.Types.PutVoiceConnectorStreamingConfigurationResponse, AWSError>;
  /**
   * Updates a Voice Connector's streaming configuration settings.
   */
  putVoiceConnectorStreamingConfiguration(callback?: (err: AWSError, data: ChimeSDKVoice.Types.PutVoiceConnectorStreamingConfigurationResponse) => void): Request<ChimeSDKVoice.Types.PutVoiceConnectorStreamingConfigurationResponse, AWSError>;
  /**
   * Updates a Voice Connector's termination settings.
   */
  putVoiceConnectorTermination(params: ChimeSDKVoice.Types.PutVoiceConnectorTerminationRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.PutVoiceConnectorTerminationResponse) => void): Request<ChimeSDKVoice.Types.PutVoiceConnectorTerminationResponse, AWSError>;
  /**
   * Updates a Voice Connector's termination settings.
   */
  putVoiceConnectorTermination(callback?: (err: AWSError, data: ChimeSDKVoice.Types.PutVoiceConnectorTerminationResponse) => void): Request<ChimeSDKVoice.Types.PutVoiceConnectorTerminationResponse, AWSError>;
  /**
   * Updates a Voice Connector's termination credentials.
   */
  putVoiceConnectorTerminationCredentials(params: ChimeSDKVoice.Types.PutVoiceConnectorTerminationCredentialsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates a Voice Connector's termination credentials.
   */
  putVoiceConnectorTerminationCredentials(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Restores a deleted phone number.
   */
  restorePhoneNumber(params: ChimeSDKVoice.Types.RestorePhoneNumberRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.RestorePhoneNumberResponse) => void): Request<ChimeSDKVoice.Types.RestorePhoneNumberResponse, AWSError>;
  /**
   * Restores a deleted phone number.
   */
  restorePhoneNumber(callback?: (err: AWSError, data: ChimeSDKVoice.Types.RestorePhoneNumberResponse) => void): Request<ChimeSDKVoice.Types.RestorePhoneNumberResponse, AWSError>;
  /**
   * Searches the provisioned phone numbers in an organization.
   */
  searchAvailablePhoneNumbers(params: ChimeSDKVoice.Types.SearchAvailablePhoneNumbersRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.SearchAvailablePhoneNumbersResponse) => void): Request<ChimeSDKVoice.Types.SearchAvailablePhoneNumbersResponse, AWSError>;
  /**
   * Searches the provisioned phone numbers in an organization.
   */
  searchAvailablePhoneNumbers(callback?: (err: AWSError, data: ChimeSDKVoice.Types.SearchAvailablePhoneNumbersResponse) => void): Request<ChimeSDKVoice.Types.SearchAvailablePhoneNumbersResponse, AWSError>;
  /**
   * Starts a speaker search task.  Before starting any speaker search tasks, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the AWS service terms for the Amazon Chime SDK. 
   */
  startSpeakerSearchTask(params: ChimeSDKVoice.Types.StartSpeakerSearchTaskRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.StartSpeakerSearchTaskResponse) => void): Request<ChimeSDKVoice.Types.StartSpeakerSearchTaskResponse, AWSError>;
  /**
   * Starts a speaker search task.  Before starting any speaker search tasks, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the AWS service terms for the Amazon Chime SDK. 
   */
  startSpeakerSearchTask(callback?: (err: AWSError, data: ChimeSDKVoice.Types.StartSpeakerSearchTaskResponse) => void): Request<ChimeSDKVoice.Types.StartSpeakerSearchTaskResponse, AWSError>;
  /**
   * Starts a voice tone analysis task. For more information about voice tone analysis, see Using Amazon Chime SDK voice analytics in the Amazon Chime SDK Developer Guide.  Before starting any voice tone analysis tasks, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the AWS service terms for the Amazon Chime SDK. 
   */
  startVoiceToneAnalysisTask(params: ChimeSDKVoice.Types.StartVoiceToneAnalysisTaskRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.StartVoiceToneAnalysisTaskResponse) => void): Request<ChimeSDKVoice.Types.StartVoiceToneAnalysisTaskResponse, AWSError>;
  /**
   * Starts a voice tone analysis task. For more information about voice tone analysis, see Using Amazon Chime SDK voice analytics in the Amazon Chime SDK Developer Guide.  Before starting any voice tone analysis tasks, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the AWS service terms for the Amazon Chime SDK. 
   */
  startVoiceToneAnalysisTask(callback?: (err: AWSError, data: ChimeSDKVoice.Types.StartVoiceToneAnalysisTaskResponse) => void): Request<ChimeSDKVoice.Types.StartVoiceToneAnalysisTaskResponse, AWSError>;
  /**
   * Stops a speaker search task.
   */
  stopSpeakerSearchTask(params: ChimeSDKVoice.Types.StopSpeakerSearchTaskRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a speaker search task.
   */
  stopSpeakerSearchTask(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a voice tone analysis task.
   */
  stopVoiceToneAnalysisTask(params: ChimeSDKVoice.Types.StopVoiceToneAnalysisTaskRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a voice tone analysis task.
   */
  stopVoiceToneAnalysisTask(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds a tag to the specified resource.
   */
  tagResource(params: ChimeSDKVoice.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds a tag to the specified resource.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes tags from a resource.
   */
  untagResource(params: ChimeSDKVoice.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates global settings for the Amazon Chime SDK Voice Connectors in an AWS account.
   */
  updateGlobalSettings(params: ChimeSDKVoice.Types.UpdateGlobalSettingsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates global settings for the Amazon Chime SDK Voice Connectors in an AWS account.
   */
  updateGlobalSettings(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates phone number details, such as product type or calling name, for the specified phone number ID. You can update one phone number detail at a time. For example, you can update either the product type or the calling name in one action. For numbers outside the U.S., you must use the Amazon Chime SDK SIP Media Application Dial-In product type. Updates to outbound calling names can take 72 hours to complete. Pending updates to outbound calling names must be complete before you can request another update.
   */
  updatePhoneNumber(params: ChimeSDKVoice.Types.UpdatePhoneNumberRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.UpdatePhoneNumberResponse) => void): Request<ChimeSDKVoice.Types.UpdatePhoneNumberResponse, AWSError>;
  /**
   * Updates phone number details, such as product type or calling name, for the specified phone number ID. You can update one phone number detail at a time. For example, you can update either the product type or the calling name in one action. For numbers outside the U.S., you must use the Amazon Chime SDK SIP Media Application Dial-In product type. Updates to outbound calling names can take 72 hours to complete. Pending updates to outbound calling names must be complete before you can request another update.
   */
  updatePhoneNumber(callback?: (err: AWSError, data: ChimeSDKVoice.Types.UpdatePhoneNumberResponse) => void): Request<ChimeSDKVoice.Types.UpdatePhoneNumberResponse, AWSError>;
  /**
   * Updates the phone number settings for the administrator's AWS account, such as the default outbound calling name. You can update the default outbound calling name once every seven days. Outbound calling names can take up to 72 hours to update.
   */
  updatePhoneNumberSettings(params: ChimeSDKVoice.Types.UpdatePhoneNumberSettingsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the phone number settings for the administrator's AWS account, such as the default outbound calling name. You can update the default outbound calling name once every seven days. Outbound calling names can take up to 72 hours to update.
   */
  updatePhoneNumberSettings(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the specified proxy session details, such as voice or SMS capabilities.
   */
  updateProxySession(params: ChimeSDKVoice.Types.UpdateProxySessionRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.UpdateProxySessionResponse) => void): Request<ChimeSDKVoice.Types.UpdateProxySessionResponse, AWSError>;
  /**
   * Updates the specified proxy session details, such as voice or SMS capabilities.
   */
  updateProxySession(callback?: (err: AWSError, data: ChimeSDKVoice.Types.UpdateProxySessionResponse) => void): Request<ChimeSDKVoice.Types.UpdateProxySessionResponse, AWSError>;
  /**
   * Updates the details of the specified SIP media application.
   */
  updateSipMediaApplication(params: ChimeSDKVoice.Types.UpdateSipMediaApplicationRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.UpdateSipMediaApplicationResponse) => void): Request<ChimeSDKVoice.Types.UpdateSipMediaApplicationResponse, AWSError>;
  /**
   * Updates the details of the specified SIP media application.
   */
  updateSipMediaApplication(callback?: (err: AWSError, data: ChimeSDKVoice.Types.UpdateSipMediaApplicationResponse) => void): Request<ChimeSDKVoice.Types.UpdateSipMediaApplicationResponse, AWSError>;
  /**
   * Invokes the AWS Lambda function associated with the SIP media application and transaction ID in an update request. The Lambda function can then return a new set of actions.
   */
  updateSipMediaApplicationCall(params: ChimeSDKVoice.Types.UpdateSipMediaApplicationCallRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.UpdateSipMediaApplicationCallResponse) => void): Request<ChimeSDKVoice.Types.UpdateSipMediaApplicationCallResponse, AWSError>;
  /**
   * Invokes the AWS Lambda function associated with the SIP media application and transaction ID in an update request. The Lambda function can then return a new set of actions.
   */
  updateSipMediaApplicationCall(callback?: (err: AWSError, data: ChimeSDKVoice.Types.UpdateSipMediaApplicationCallResponse) => void): Request<ChimeSDKVoice.Types.UpdateSipMediaApplicationCallResponse, AWSError>;
  /**
   * Updates the details of the specified SIP rule.
   */
  updateSipRule(params: ChimeSDKVoice.Types.UpdateSipRuleRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.UpdateSipRuleResponse) => void): Request<ChimeSDKVoice.Types.UpdateSipRuleResponse, AWSError>;
  /**
   * Updates the details of the specified SIP rule.
   */
  updateSipRule(callback?: (err: AWSError, data: ChimeSDKVoice.Types.UpdateSipRuleResponse) => void): Request<ChimeSDKVoice.Types.UpdateSipRuleResponse, AWSError>;
  /**
   * Updates the details for the specified Amazon Chime SDK Voice Connector.
   */
  updateVoiceConnector(params: ChimeSDKVoice.Types.UpdateVoiceConnectorRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.UpdateVoiceConnectorResponse) => void): Request<ChimeSDKVoice.Types.UpdateVoiceConnectorResponse, AWSError>;
  /**
   * Updates the details for the specified Amazon Chime SDK Voice Connector.
   */
  updateVoiceConnector(callback?: (err: AWSError, data: ChimeSDKVoice.Types.UpdateVoiceConnectorResponse) => void): Request<ChimeSDKVoice.Types.UpdateVoiceConnectorResponse, AWSError>;
  /**
   * Updates the settings for the specified Amazon Chime SDK Voice Connector group.
   */
  updateVoiceConnectorGroup(params: ChimeSDKVoice.Types.UpdateVoiceConnectorGroupRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.UpdateVoiceConnectorGroupResponse) => void): Request<ChimeSDKVoice.Types.UpdateVoiceConnectorGroupResponse, AWSError>;
  /**
   * Updates the settings for the specified Amazon Chime SDK Voice Connector group.
   */
  updateVoiceConnectorGroup(callback?: (err: AWSError, data: ChimeSDKVoice.Types.UpdateVoiceConnectorGroupResponse) => void): Request<ChimeSDKVoice.Types.UpdateVoiceConnectorGroupResponse, AWSError>;
  /**
   * Updates the specified voice profile’s voice print and refreshes its expiration timestamp.  As a condition of using this feature, you acknowledge that the collection, use, storage, and retention of your caller’s biometric identifiers and biometric information (“biometric data”) in the form of a digital voiceprint requires the caller’s informed consent via a written release. Such consent is required under various state laws, including biometrics laws in Illinois, Texas, Washington and other state privacy laws. You must provide a written release to each caller through a process that clearly reflects each caller’s informed consent before using Amazon Chime SDK Voice Insights service, as required under the terms of your agreement with AWS governing your use of the service. 
   */
  updateVoiceProfile(params: ChimeSDKVoice.Types.UpdateVoiceProfileRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.UpdateVoiceProfileResponse) => void): Request<ChimeSDKVoice.Types.UpdateVoiceProfileResponse, AWSError>;
  /**
   * Updates the specified voice profile’s voice print and refreshes its expiration timestamp.  As a condition of using this feature, you acknowledge that the collection, use, storage, and retention of your caller’s biometric identifiers and biometric information (“biometric data”) in the form of a digital voiceprint requires the caller’s informed consent via a written release. Such consent is required under various state laws, including biometrics laws in Illinois, Texas, Washington and other state privacy laws. You must provide a written release to each caller through a process that clearly reflects each caller’s informed consent before using Amazon Chime SDK Voice Insights service, as required under the terms of your agreement with AWS governing your use of the service. 
   */
  updateVoiceProfile(callback?: (err: AWSError, data: ChimeSDKVoice.Types.UpdateVoiceProfileResponse) => void): Request<ChimeSDKVoice.Types.UpdateVoiceProfileResponse, AWSError>;
  /**
   * Updates the settings for the specified voice profile domain.
   */
  updateVoiceProfileDomain(params: ChimeSDKVoice.Types.UpdateVoiceProfileDomainRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.UpdateVoiceProfileDomainResponse) => void): Request<ChimeSDKVoice.Types.UpdateVoiceProfileDomainResponse, AWSError>;
  /**
   * Updates the settings for the specified voice profile domain.
   */
  updateVoiceProfileDomain(callback?: (err: AWSError, data: ChimeSDKVoice.Types.UpdateVoiceProfileDomainResponse) => void): Request<ChimeSDKVoice.Types.UpdateVoiceProfileDomainResponse, AWSError>;
  /**
   * Validates an address to be used for 911 calls made with Amazon Chime SDK Voice Connectors. You can use validated addresses in a Presence Information Data Format Location Object file that you include in SIP requests. That helps ensure that addresses are routed to the appropriate Public Safety Answering Point.
   */
  validateE911Address(params: ChimeSDKVoice.Types.ValidateE911AddressRequest, callback?: (err: AWSError, data: ChimeSDKVoice.Types.ValidateE911AddressResponse) => void): Request<ChimeSDKVoice.Types.ValidateE911AddressResponse, AWSError>;
  /**
   * Validates an address to be used for 911 calls made with Amazon Chime SDK Voice Connectors. You can use validated addresses in a Presence Information Data Format Location Object file that you include in SIP requests. That helps ensure that addresses are routed to the appropriate Public Safety Answering Point.
   */
  validateE911Address(callback?: (err: AWSError, data: ChimeSDKVoice.Types.ValidateE911AddressResponse) => void): Request<ChimeSDKVoice.Types.ValidateE911AddressResponse, AWSError>;
}
declare namespace ChimeSDKVoice {
  export interface Address {
    /**
     * The address street, such as 8th Avenue.
     */
    streetName?: SensitiveNonEmptyString;
    /**
     * The address suffix, such as the N in 8th Avenue N.
     */
    streetSuffix?: SensitiveNonEmptyString;
    /**
     * An address suffix location, such as the S. Unit A in Central Park S. Unit A.
     */
    postDirectional?: SensitiveNonEmptyString;
    /**
     * An address prefix location, such as the N in N. Third St. 
     */
    preDirectional?: SensitiveNonEmptyString;
    /**
     * The numeric portion of an address.
     */
    streetNumber?: SensitiveNonEmptyString;
    /**
     * The city of an address.
     */
    city?: SensitiveNonEmptyString;
    /**
     * The state of an address.
     */
    state?: SensitiveNonEmptyString;
    /**
     * The postal code of an address.
     */
    postalCode?: SensitiveNonEmptyString;
    /**
     * The zip + 4 or postal code + 4 of an address.
     */
    postalCodePlus4?: SensitiveNonEmptyString;
    /**
     * The country of an address.
     */
    country?: SensitiveNonEmptyString;
  }
  export type AlexaSkillId = string;
  export type AlexaSkillIdList = AlexaSkillId[];
  export type AlexaSkillStatus = "ACTIVE"|"INACTIVE"|string;
  export type Alpha2CountryCode = string;
  export type AreaCode = string;
  export type Arn = string;
  export interface AssociatePhoneNumbersWithVoiceConnectorGroupRequest {
    /**
     * The Amazon Chime SDK Voice Connector group ID.
     */
    VoiceConnectorGroupId: NonEmptyString;
    /**
     * List of phone numbers, in E.164 format.
     */
    E164PhoneNumbers: E164PhoneNumberList;
    /**
     * If true, associates the provided phone numbers with the provided Amazon Chime SDK Voice Connector Group and removes any previously existing associations. If false, does not associate any phone numbers that have previously existing associations.
     */
    ForceAssociate?: NullableBoolean;
  }
  export interface AssociatePhoneNumbersWithVoiceConnectorGroupResponse {
    /**
     * If the action fails for one or more of the phone numbers in the request, a list of the phone numbers is returned, along with error codes and error messages.
     */
    PhoneNumberErrors?: PhoneNumberErrorList;
  }
  export interface AssociatePhoneNumbersWithVoiceConnectorRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
    /**
     * List of phone numbers, in E.164 format.
     */
    E164PhoneNumbers: E164PhoneNumberList;
    /**
     * If true, associates the provided phone numbers with the provided Amazon Chime SDK Voice Connector and removes any previously existing associations. If false, does not associate any phone numbers that have previously existing associations.
     */
    ForceAssociate?: NullableBoolean;
  }
  export interface AssociatePhoneNumbersWithVoiceConnectorResponse {
    /**
     * If the action fails for one or more of the phone numbers in the request, a list of the phone numbers is returned, along with error codes and error messages.
     */
    PhoneNumberErrors?: PhoneNumberErrorList;
  }
  export interface BatchDeletePhoneNumberRequest {
    /**
     * List of phone number IDs.
     */
    PhoneNumberIds: NonEmptyStringList;
  }
  export interface BatchDeletePhoneNumberResponse {
    /**
     * If the action fails for one or more of the phone numbers in the request, a list of the phone numbers is returned, along with error codes and error messages.
     */
    PhoneNumberErrors?: PhoneNumberErrorList;
  }
  export interface BatchUpdatePhoneNumberRequest {
    /**
     * Lists the phone numbers in the update request.
     */
    UpdatePhoneNumberRequestItems: UpdatePhoneNumberRequestItemList;
  }
  export interface BatchUpdatePhoneNumberResponse {
    /**
     * A list of failed phone numbers and their error messages.
     */
    PhoneNumberErrors?: PhoneNumberErrorList;
  }
  export type Boolean = boolean;
  export interface CallDetails {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId?: NonEmptyString128;
    /**
     * The transaction ID of a Voice Connector call.
     */
    TransactionId?: NonEmptyString256;
    /**
     * Identifies a person as the caller or the callee.
     */
    IsCaller?: Boolean;
  }
  export type CallLegType = "Caller"|"Callee"|string;
  export type CallingName = string;
  export type CallingNameStatus = "Unassigned"|"UpdateInProgress"|"UpdateSucceeded"|"UpdateFailed"|string;
  export type CallingRegion = string;
  export type CallingRegionList = CallingRegion[];
  export interface CandidateAddress {
    /**
     * The street information of the candidate address.
     */
    streetInfo?: SensitiveNonEmptyString;
    /**
     * The numeric portion of the candidate address.
     */
    streetNumber?: SensitiveNonEmptyString;
    /**
     * The city of the candidate address.
     */
    city?: SensitiveNonEmptyString;
    /**
     * The state of the candidate address.
     */
    state?: SensitiveNonEmptyString;
    /**
     * The postal code of the candidate address.
     */
    postalCode?: SensitiveNonEmptyString;
    /**
     * The zip + 4 or postal code +4 of the candidate address.
     */
    postalCodePlus4?: SensitiveNonEmptyString;
    /**
     * The country of the candidate address.
     */
    country?: SensitiveNonEmptyString;
  }
  export type CandidateAddressList = CandidateAddress[];
  export type Capability = "Voice"|"SMS"|string;
  export type CapabilityList = Capability[];
  export type ClientRequestId = string;
  export type ConfidenceScore = number;
  export type Country = string;
  export type CountryList = Country[];
  export type CpsLimit = number;
  export interface CreatePhoneNumberOrderRequest {
    /**
     * The phone number product type.
     */
    ProductType: PhoneNumberProductType;
    /**
     * List of phone numbers, in E.164 format.
     */
    E164PhoneNumbers: E164PhoneNumberList;
    /**
     * Specifies the name assigned to one or more phone numbers.
     */
    Name?: PhoneNumberName;
  }
  export interface CreatePhoneNumberOrderResponse {
    /**
     * The phone number order details.
     */
    PhoneNumberOrder?: PhoneNumberOrder;
  }
  export interface CreateProxySessionRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString128;
    /**
     * The participant phone numbers.
     */
    ParticipantPhoneNumbers: ParticipantPhoneNumberList;
    /**
     * The name of the proxy session.
     */
    Name?: ProxySessionNameString;
    /**
     * The number of minutes allowed for the proxy session.
     */
    ExpiryMinutes?: PositiveInteger;
    /**
     * The proxy session's capabilities.
     */
    Capabilities: CapabilityList;
    /**
     * The preference for proxy phone number reuse, or stickiness, between the same participants across sessions.
     */
    NumberSelectionBehavior?: NumberSelectionBehavior;
    /**
     * The preference for matching the country or area code of the proxy phone number with that of the first participant.
     */
    GeoMatchLevel?: GeoMatchLevel;
    /**
     * The country and area code for the proxy phone number.
     */
    GeoMatchParams?: GeoMatchParams;
  }
  export interface CreateProxySessionResponse {
    /**
     * The proxy session details.
     */
    ProxySession?: ProxySession;
  }
  export interface CreateSipMediaApplicationCallRequest {
    /**
     * The phone number that a user calls from. This is a phone number in your Amazon Chime SDK phone number inventory.
     */
    FromPhoneNumber: E164PhoneNumber;
    /**
     * The phone number that the service should call.
     */
    ToPhoneNumber: E164PhoneNumber;
    /**
     * The ID of the SIP media application.
     */
    SipMediaApplicationId: NonEmptyString;
    /**
     * The SIP headers added to an outbound call leg.
     */
    SipHeaders?: SipHeadersMap;
    /**
     * Context passed to a CreateSipMediaApplication API call. For example, you could pass key-value pairs such as: "FirstName": "John", "LastName": "Doe" 
     */
    ArgumentsMap?: SMACreateCallArgumentsMap;
  }
  export interface CreateSipMediaApplicationCallResponse {
    /**
     * The actual call.
     */
    SipMediaApplicationCall?: SipMediaApplicationCall;
  }
  export interface CreateSipMediaApplicationRequest {
    /**
     * The AWS Region assigned to the SIP media application.
     */
    AwsRegion: String;
    /**
     * The SIP media application's name.
     */
    Name: SipMediaApplicationName;
    /**
     * List of endpoints (Lambda ARNs) specified for the SIP media application.
     */
    Endpoints: SipMediaApplicationEndpointList;
    /**
     * The tags assigned to the SIP media application.
     */
    Tags?: TagList;
  }
  export interface CreateSipMediaApplicationResponse {
    /**
     * The SIP media application details.
     */
    SipMediaApplication?: SipMediaApplication;
  }
  export interface CreateSipRuleRequest {
    /**
     * The name of the SIP rule.
     */
    Name: SipRuleName;
    /**
     * The type of trigger assigned to the SIP rule in TriggerValue, currently RequestUriHostname or ToPhoneNumber.
     */
    TriggerType: SipRuleTriggerType;
    /**
     * If TriggerType is RequestUriHostname, the value can be the outbound host name of a Voice Connector. If TriggerType is ToPhoneNumber, the value can be a customer-owned phone number in the E164 format. The SipMediaApplication specified in the SipRule is triggered if the request URI in an incoming SIP request matches the RequestUriHostname, or if the To header in the incoming SIP request matches the ToPhoneNumber value.
     */
    TriggerValue: NonEmptyString;
    /**
     * Disables or enables a SIP rule. You must disable SIP rules before you can delete them.
     */
    Disabled?: NullableBoolean;
    /**
     * List of SIP media applications, with priority and AWS Region. Only one SIP application per AWS Region can be used.
     */
    TargetApplications?: SipRuleTargetApplicationList;
  }
  export interface CreateSipRuleResponse {
    /**
     * The SIP rule information, including the rule ID, triggers, and target applications.
     */
    SipRule?: SipRule;
  }
  export interface CreateVoiceConnectorGroupRequest {
    /**
     * The name of the Voice Connector group.
     */
    Name: VoiceConnectorGroupName;
    /**
     * Lists the Voice Connectors that inbound calls are routed to.
     */
    VoiceConnectorItems?: VoiceConnectorItemList;
  }
  export interface CreateVoiceConnectorGroupResponse {
    /**
     * The details of the Voice Connector group.
     */
    VoiceConnectorGroup?: VoiceConnectorGroup;
  }
  export interface CreateVoiceConnectorRequest {
    /**
     * The name of the Voice Connector.
     */
    Name: VoiceConnectorName;
    /**
     * The AWS Region in which the Amazon Chime SDK Voice Connector is created. Default value: us-east-1 .
     */
    AwsRegion?: VoiceConnectorAwsRegion;
    /**
     * Enables or disables encryption for the Voice Connector.
     */
    RequireEncryption: Boolean;
    /**
     * The tags assigned to the Voice Connector.
     */
    Tags?: TagList;
  }
  export interface CreateVoiceConnectorResponse {
    /**
     * The details of the Voice Connector.
     */
    VoiceConnector?: VoiceConnector;
  }
  export interface CreateVoiceProfileDomainRequest {
    /**
     * The name of the voice profile domain.
     */
    Name: VoiceProfileDomainName;
    /**
     * A description of the voice profile domain.
     */
    Description?: VoiceProfileDomainDescription;
    /**
     * The server-side encryption configuration for the request.
     */
    ServerSideEncryptionConfiguration: ServerSideEncryptionConfiguration;
    /**
     * The unique identifier for the client request. Use a different token for different domain creation requests.
     */
    ClientRequestToken?: ClientRequestId;
    /**
     * The tags assigned to the domain.
     */
    Tags?: TagList;
  }
  export interface CreateVoiceProfileDomainResponse {
    /**
     * The requested voice profile domain.
     */
    VoiceProfileDomain?: VoiceProfileDomain;
  }
  export interface CreateVoiceProfileRequest {
    /**
     * The ID of the speaker search task.
     */
    SpeakerSearchTaskId: NonEmptyString256;
  }
  export interface CreateVoiceProfileResponse {
    /**
     * The requested voice profile.
     */
    VoiceProfile?: VoiceProfile;
  }
  export interface Credential {
    /**
     * The RFC2617 compliant user name associated with the SIP credentials, in US-ASCII format.
     */
    Username?: SensitiveString;
    /**
     * The RFC2617 compliant password associated with the SIP credentials, in US-ASCII format.
     */
    Password?: SensitiveString;
  }
  export type CredentialList = Credential[];
  export interface DNISEmergencyCallingConfiguration {
    /**
     * The DNIS phone number that you route emergency calls to, in E.164 format.
     */
    EmergencyPhoneNumber: E164PhoneNumber;
    /**
     * The DNIS phone number for routing test emergency calls to, in E.164 format.
     */
    TestPhoneNumber?: E164PhoneNumber;
    /**
     * The country from which emergency calls are allowed, in ISO 3166-1 alpha-2 format.
     */
    CallingCountry: Alpha2CountryCode;
  }
  export type DNISEmergencyCallingConfigurationList = DNISEmergencyCallingConfiguration[];
  export type DataRetentionInHours = number;
  export interface DeletePhoneNumberRequest {
    /**
     * The phone number ID.
     */
    PhoneNumberId: SensitiveNonEmptyString;
  }
  export interface DeleteProxySessionRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString128;
    /**
     * The proxy session ID.
     */
    ProxySessionId: NonEmptyString128;
  }
  export interface DeleteSipMediaApplicationRequest {
    /**
     * The SIP media application ID.
     */
    SipMediaApplicationId: NonEmptyString;
  }
  export interface DeleteSipRuleRequest {
    /**
     * The SIP rule ID.
     */
    SipRuleId: NonEmptyString;
  }
  export interface DeleteVoiceConnectorEmergencyCallingConfigurationRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
  }
  export interface DeleteVoiceConnectorGroupRequest {
    /**
     * The Voice Connector Group ID.
     */
    VoiceConnectorGroupId: NonEmptyString;
  }
  export interface DeleteVoiceConnectorOriginationRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
  }
  export interface DeleteVoiceConnectorProxyRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString128;
  }
  export interface DeleteVoiceConnectorRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
  }
  export interface DeleteVoiceConnectorStreamingConfigurationRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
  }
  export interface DeleteVoiceConnectorTerminationCredentialsRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
    /**
     * The RFC2617 compliant username associated with the SIP credentials, in US-ASCII format.
     */
    Usernames: SensitiveStringList;
  }
  export interface DeleteVoiceConnectorTerminationRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
  }
  export interface DeleteVoiceProfileDomainRequest {
    /**
     * The voice profile domain ID.
     */
    VoiceProfileDomainId: NonEmptyString256;
  }
  export interface DeleteVoiceProfileRequest {
    /**
     * The voice profile ID.
     */
    VoiceProfileId: NonEmptyString256;
  }
  export interface DisassociatePhoneNumbersFromVoiceConnectorGroupRequest {
    /**
     * The Voice Connector group ID.
     */
    VoiceConnectorGroupId: NonEmptyString;
    /**
     * The list of phone numbers, in E.164 format.
     */
    E164PhoneNumbers: E164PhoneNumberList;
  }
  export interface DisassociatePhoneNumbersFromVoiceConnectorGroupResponse {
    /**
     * If the action fails for one or more of the phone numbers in the request, a list of the phone numbers is returned, along with error codes and error messages.
     */
    PhoneNumberErrors?: PhoneNumberErrorList;
  }
  export interface DisassociatePhoneNumbersFromVoiceConnectorRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
    /**
     * List of phone numbers, in E.164 format.
     */
    E164PhoneNumbers: E164PhoneNumberList;
  }
  export interface DisassociatePhoneNumbersFromVoiceConnectorResponse {
    /**
     * If the action fails for one or more of the phone numbers in the request, a list of the phone numbers is returned, along with error codes and error messages.
     */
    PhoneNumberErrors?: PhoneNumberErrorList;
  }
  export type E164PhoneNumber = string;
  export type E164PhoneNumberList = E164PhoneNumber[];
  export interface EmergencyCallingConfiguration {
    /**
     * The Dialed Number Identification Service (DNIS) emergency calling configuration details.
     */
    DNIS?: DNISEmergencyCallingConfigurationList;
  }
  export type ErrorCode = "BadRequest"|"Conflict"|"Forbidden"|"NotFound"|"PreconditionFailed"|"ResourceLimitExceeded"|"ServiceFailure"|"AccessDenied"|"ServiceUnavailable"|"Throttled"|"Throttling"|"Unauthorized"|"Unprocessable"|"VoiceConnectorGroupAssociationsExist"|"PhoneNumberAssociationsExist"|"Gone"|string;
  export type FunctionArn = string;
  export type GeoMatchLevel = "Country"|"AreaCode"|string;
  export interface GeoMatchParams {
    /**
     * The country.
     */
    Country: Country;
    /**
     * The area code.
     */
    AreaCode: AreaCode;
  }
  export interface GetGlobalSettingsResponse {
    /**
     * The Voice Connector settings.
     */
    VoiceConnector?: VoiceConnectorSettings;
  }
  export interface GetPhoneNumberOrderRequest {
    /**
     * The ID of the phone number order .
     */
    PhoneNumberOrderId: GuidString;
  }
  export interface GetPhoneNumberOrderResponse {
    /**
     * The phone number order details.
     */
    PhoneNumberOrder?: PhoneNumberOrder;
  }
  export interface GetPhoneNumberRequest {
    /**
     * The phone number ID.
     */
    PhoneNumberId: SensitiveNonEmptyString;
  }
  export interface GetPhoneNumberResponse {
    /**
     * The phone number details.
     */
    PhoneNumber?: PhoneNumber;
  }
  export interface GetPhoneNumberSettingsResponse {
    /**
     * The default outbound calling name for the account.
     */
    CallingName?: CallingName;
    /**
     * The updated outbound calling name timestamp, in ISO 8601 format.
     */
    CallingNameUpdatedTimestamp?: Iso8601Timestamp;
  }
  export interface GetProxySessionRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString128;
    /**
     * The proxy session ID.
     */
    ProxySessionId: NonEmptyString128;
  }
  export interface GetProxySessionResponse {
    /**
     * The proxy session details.
     */
    ProxySession?: ProxySession;
  }
  export interface GetSipMediaApplicationAlexaSkillConfigurationRequest {
    /**
     * The SIP media application ID.
     */
    SipMediaApplicationId: NonEmptyString;
  }
  export interface GetSipMediaApplicationAlexaSkillConfigurationResponse {
    /**
     * Returns the Alexa Skill configuration.
     */
    SipMediaApplicationAlexaSkillConfiguration?: SipMediaApplicationAlexaSkillConfiguration;
  }
  export interface GetSipMediaApplicationLoggingConfigurationRequest {
    /**
     * The SIP media application ID.
     */
    SipMediaApplicationId: NonEmptyString;
  }
  export interface GetSipMediaApplicationLoggingConfigurationResponse {
    /**
     * The actual logging configuration.
     */
    SipMediaApplicationLoggingConfiguration?: SipMediaApplicationLoggingConfiguration;
  }
  export interface GetSipMediaApplicationRequest {
    /**
     * The SIP media application ID .
     */
    SipMediaApplicationId: NonEmptyString;
  }
  export interface GetSipMediaApplicationResponse {
    /**
     * The details of the SIP media application.
     */
    SipMediaApplication?: SipMediaApplication;
  }
  export interface GetSipRuleRequest {
    /**
     * The SIP rule ID.
     */
    SipRuleId: NonEmptyString;
  }
  export interface GetSipRuleResponse {
    /**
     * The SIP rule details.
     */
    SipRule?: SipRule;
  }
  export interface GetSpeakerSearchTaskRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString128;
    /**
     * The ID of the speaker search task.
     */
    SpeakerSearchTaskId: NonEmptyString256;
  }
  export interface GetSpeakerSearchTaskResponse {
    /**
     * The details of the speaker search task.
     */
    SpeakerSearchTask?: SpeakerSearchTask;
  }
  export interface GetVoiceConnectorEmergencyCallingConfigurationRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
  }
  export interface GetVoiceConnectorEmergencyCallingConfigurationResponse {
    /**
     * The details of the emergency calling configuration.
     */
    EmergencyCallingConfiguration?: EmergencyCallingConfiguration;
  }
  export interface GetVoiceConnectorGroupRequest {
    /**
     * The Voice Connector group ID.
     */
    VoiceConnectorGroupId: NonEmptyString;
  }
  export interface GetVoiceConnectorGroupResponse {
    /**
     * The details of the Voice Connector group.
     */
    VoiceConnectorGroup?: VoiceConnectorGroup;
  }
  export interface GetVoiceConnectorLoggingConfigurationRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
  }
  export interface GetVoiceConnectorLoggingConfigurationResponse {
    /**
     * The logging configuration details .
     */
    LoggingConfiguration?: LoggingConfiguration;
  }
  export interface GetVoiceConnectorOriginationRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
  }
  export interface GetVoiceConnectorOriginationResponse {
    /**
     * The origination setting details.
     */
    Origination?: Origination;
  }
  export interface GetVoiceConnectorProxyRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString128;
  }
  export interface GetVoiceConnectorProxyResponse {
    /**
     * The proxy configuration details.
     */
    Proxy?: Proxy;
  }
  export interface GetVoiceConnectorRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
  }
  export interface GetVoiceConnectorResponse {
    /**
     * The Voice Connector details.
     */
    VoiceConnector?: VoiceConnector;
  }
  export interface GetVoiceConnectorStreamingConfigurationRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
  }
  export interface GetVoiceConnectorStreamingConfigurationResponse {
    /**
     * The details of the streaming configuration.
     */
    StreamingConfiguration?: StreamingConfiguration;
  }
  export interface GetVoiceConnectorTerminationHealthRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
  }
  export interface GetVoiceConnectorTerminationHealthResponse {
    /**
     * The termination health details.
     */
    TerminationHealth?: TerminationHealth;
  }
  export interface GetVoiceConnectorTerminationRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
  }
  export interface GetVoiceConnectorTerminationResponse {
    /**
     * The termination setting details.
     */
    Termination?: Termination;
  }
  export interface GetVoiceProfileDomainRequest {
    /**
     * The voice profile domain ID.
     */
    VoiceProfileDomainId: NonEmptyString256;
  }
  export interface GetVoiceProfileDomainResponse {
    /**
     * The details of the voice profile domain.
     */
    VoiceProfileDomain?: VoiceProfileDomain;
  }
  export interface GetVoiceProfileRequest {
    /**
     * The voice profile ID.
     */
    VoiceProfileId: NonEmptyString256;
  }
  export interface GetVoiceProfileResponse {
    /**
     * The voice profile details.
     */
    VoiceProfile?: VoiceProfile;
  }
  export interface GetVoiceToneAnalysisTaskRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString128;
    /**
     * The ID of the voice tone anlysis task.
     */
    VoiceToneAnalysisTaskId: NonEmptyString256;
    /**
     * Specifies whether the voice being analyzed is the caller (originator) or the callee (responder).
     */
    IsCaller: Boolean;
  }
  export interface GetVoiceToneAnalysisTaskResponse {
    /**
     * The details of the voice tone analysis task.
     */
    VoiceToneAnalysisTask?: VoiceToneAnalysisTask;
  }
  export type GuidString = string;
  export type Integer = number;
  export type Iso8601Timestamp = Date;
  export type LanguageCode = "en-US"|string;
  export interface ListAvailableVoiceConnectorRegionsResponse {
    /**
     * The list of AWS Regions.
     */
    VoiceConnectorRegions?: VoiceConnectorAwsRegionList;
  }
  export interface ListPhoneNumberOrdersRequest {
    /**
     * The token used to retrieve the next page of results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in a single call.
     */
    MaxResults?: ResultMax;
  }
  export interface ListPhoneNumberOrdersResponse {
    /**
     * The phone number order details.
     */
    PhoneNumberOrders?: PhoneNumberOrderList;
    /**
     * The token used to retrieve the next page of results.
     */
    NextToken?: String;
  }
  export interface ListPhoneNumbersRequest {
    /**
     * The status of your organization's phone numbers.
     */
    Status?: String;
    /**
     * The phone number product types.
     */
    ProductType?: PhoneNumberProductType;
    /**
     * The filter to limit the number of results.
     */
    FilterName?: PhoneNumberAssociationName;
    /**
     * The filter value.
     */
    FilterValue?: String;
    /**
     * The maximum number of results to return in a single call.
     */
    MaxResults?: ResultMax;
    /**
     * The token used to return the next page of results.
     */
    NextToken?: String;
  }
  export interface ListPhoneNumbersResponse {
    /**
     * The phone number details.
     */
    PhoneNumbers?: PhoneNumberList;
    /**
     * The token used to return the next page of results.
     */
    NextToken?: String;
  }
  export interface ListProxySessionsRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString128;
    /**
     * The proxy session status.
     */
    Status?: ProxySessionStatus;
    /**
     * The token used to retrieve the next page of results.
     */
    NextToken?: NextTokenString;
    /**
     * The maximum number of results to return in a single call.
     */
    MaxResults?: ResultMax;
  }
  export interface ListProxySessionsResponse {
    /**
     * The proxy sessions' details.
     */
    ProxySessions?: ProxySessions;
    /**
     * The token used to retrieve the next page of results.
     */
    NextToken?: NextTokenString;
  }
  export interface ListSipMediaApplicationsRequest {
    /**
     * The maximum number of results to return in a single call. Defaults to 100.
     */
    MaxResults?: ResultMax;
    /**
     * The token used to return the next page of results.
     */
    NextToken?: NextTokenString;
  }
  export interface ListSipMediaApplicationsResponse {
    /**
     * The list of SIP media applications and application details.
     */
    SipMediaApplications?: SipMediaApplicationList;
    /**
     * The token used to return the next page of results.
     */
    NextToken?: NextTokenString;
  }
  export interface ListSipRulesRequest {
    /**
     * The SIP media application ID.
     */
    SipMediaApplicationId?: NonEmptyString;
    /**
     * The maximum number of results to return in a single call. Defaults to 100.
     */
    MaxResults?: ResultMax;
    /**
     * The token used to return the next page of results.
     */
    NextToken?: NextTokenString;
  }
  export interface ListSipRulesResponse {
    /**
     * The list of SIP rules and details.
     */
    SipRules?: SipRuleList;
    /**
     * The token used to return the next page of results.
     */
    NextToken?: NextTokenString;
  }
  export interface ListSupportedPhoneNumberCountriesRequest {
    /**
     * The phone number product type.
     */
    ProductType: PhoneNumberProductType;
  }
  export interface ListSupportedPhoneNumberCountriesResponse {
    /**
     * The supported phone number countries.
     */
    PhoneNumberCountries?: PhoneNumberCountriesList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The resource ARN.
     */
    ResourceARN: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags in the list.
     */
    Tags?: TagList;
  }
  export interface ListVoiceConnectorGroupsRequest {
    /**
     * The token used to return the next page of results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in a single call. 
     */
    MaxResults?: ResultMax;
  }
  export interface ListVoiceConnectorGroupsResponse {
    /**
     * The details of the Voice Connector groups.
     */
    VoiceConnectorGroups?: VoiceConnectorGroupList;
    /**
     * The token used to return the next page of results.
     */
    NextToken?: String;
  }
  export interface ListVoiceConnectorTerminationCredentialsRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
  }
  export interface ListVoiceConnectorTerminationCredentialsResponse {
    /**
     * A list of user names.
     */
    Usernames?: SensitiveStringList;
  }
  export interface ListVoiceConnectorsRequest {
    /**
     * The token used to return the next page of results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in a single call.
     */
    MaxResults?: ResultMax;
  }
  export interface ListVoiceConnectorsResponse {
    /**
     * The details of the Voice Connectors.
     */
    VoiceConnectors?: VoiceConnectorList;
    /**
     * The token used to return the next page of results.
     */
    NextToken?: String;
  }
  export interface ListVoiceProfileDomainsRequest {
    /**
     * The token used to return the next page of results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in a single call.
     */
    MaxResults?: ResultMax;
  }
  export interface ListVoiceProfileDomainsResponse {
    /**
     * The list of voice profile domains.
     */
    VoiceProfileDomains?: VoiceProfileDomainSummaryList;
    /**
     * The token used to return the next page of results.
     */
    NextToken?: String;
  }
  export interface ListVoiceProfilesRequest {
    /**
     * The ID of the voice profile domain.
     */
    VoiceProfileDomainId: NonEmptyString256;
    /**
     * The token used to retrieve the next page of results.
     */
    NextToken?: String;
    /**
     * The maximum number of results in the request.
     */
    MaxResults?: ResultMax;
  }
  export interface ListVoiceProfilesResponse {
    /**
     * The list of voice profiles.
     */
    VoiceProfiles?: VoiceProfileSummaryList;
    /**
     * The token used to retrieve the next page of results.
     */
    NextToken?: String;
  }
  export interface LoggingConfiguration {
    /**
     * Boolean that enables sending SIP message logs to Amazon CloudWatch.
     */
    EnableSIPLogs?: Boolean;
    /**
     * Enables or disables media metrics logging.
     */
    EnableMediaMetricLogs?: Boolean;
  }
  export interface MediaInsightsConfiguration {
    /**
     * Denotes the configration as enabled or disabled.
     */
    Disabled?: Boolean;
    /**
     * The configuration's ARN.
     */
    ConfigurationArn?: Arn;
  }
  export type NextTokenString = string;
  export type NonEmptyString = string;
  export type NonEmptyString128 = string;
  export type NonEmptyString256 = string;
  export type NonEmptyStringList = String[];
  export type NotificationTarget = "EventBridge"|"SNS"|"SQS"|string;
  export type NullableBoolean = boolean;
  export type NumberSelectionBehavior = "PreferSticky"|"AvoidSticky"|string;
  export interface OrderedPhoneNumber {
    /**
     * The phone number, in E.164 format.
     */
    E164PhoneNumber?: E164PhoneNumber;
    /**
     * The phone number status.
     */
    Status?: OrderedPhoneNumberStatus;
  }
  export type OrderedPhoneNumberList = OrderedPhoneNumber[];
  export type OrderedPhoneNumberStatus = "Processing"|"Acquired"|"Failed"|string;
  export interface Origination {
    /**
     * The call distribution properties defined for your SIP hosts. Valid range: Minimum value of 1. Maximum value of 20. This parameter is not required, but you must specify this parameter or Disabled.
     */
    Routes?: OriginationRouteList;
    /**
     * When origination settings are disabled, inbound calls are not enabled for your Amazon Chime SDK Voice Connector. This parameter is not required, but you must specify this parameter or Routes.
     */
    Disabled?: Boolean;
  }
  export interface OriginationRoute {
    /**
     * The FQDN or IP address to contact for origination traffic.
     */
    Host?: String;
    /**
     * The designated origination route port. Defaults to 5060.
     */
    Port?: Port;
    /**
     * The protocol to use for the origination route. Encryption-enabled Amazon Chime SDK Voice Connectors use TCP protocol by default.
     */
    Protocol?: OriginationRouteProtocol;
    /**
     * The priority associated with the host, with 1 being the highest priority. Higher priority hosts are attempted first.
     */
    Priority?: OriginationRoutePriority;
    /**
     * The weight assigned to an origination route. When hosts have equal priority, calls are distributed between them based on their relative weights.
     */
    Weight?: OriginationRouteWeight;
  }
  export type OriginationRouteList = OriginationRoute[];
  export type OriginationRoutePriority = number;
  export type OriginationRouteProtocol = "TCP"|"UDP"|string;
  export type OriginationRouteWeight = number;
  export interface Participant {
    /**
     * The participant's phone number.
     */
    PhoneNumber?: E164PhoneNumber;
    /**
     * The participant's proxy phone number.
     */
    ProxyPhoneNumber?: E164PhoneNumber;
  }
  export type ParticipantPhoneNumberList = E164PhoneNumber[];
  export type Participants = Participant[];
  export interface PhoneNumber {
    /**
     * The phone number's ID.
     */
    PhoneNumberId?: SensitiveNonEmptyString;
    /**
     * The phone number, in E.164 format.
     */
    E164PhoneNumber?: E164PhoneNumber;
    /**
     * The phone number's country. Format: ISO 3166-1 alpha-2.
     */
    Country?: Alpha2CountryCode;
    /**
     * The phone number's type.
     */
    Type?: PhoneNumberType;
    /**
     * The phone number's product type.
     */
    ProductType?: PhoneNumberProductType;
    /**
     * The phone number's status.
     */
    Status?: PhoneNumberStatus;
    /**
     * The phone number's capabilities.
     */
    Capabilities?: PhoneNumberCapabilities;
    /**
     * The phone number's associations.
     */
    Associations?: PhoneNumberAssociationList;
    /**
     * The outbound calling name associated with the phone number.
     */
    CallingName?: CallingName;
    /**
     * The outbound calling name status.
     */
    CallingNameStatus?: CallingNameStatus;
    /**
     * The phone number creation timestamp, in ISO 8601 format.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The updated phone number timestamp, in ISO 8601 format.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
    /**
     * The deleted phone number timestamp, in ISO 8601 format.
     */
    DeletionTimestamp?: Iso8601Timestamp;
    /**
     * The phone number's order ID.
     */
    OrderId?: GuidString;
    /**
     * The name of the phone number.
     */
    Name?: PhoneNumberName;
  }
  export interface PhoneNumberAssociation {
    /**
     * Contains the ID for the entity specified in Name.
     */
    Value?: String;
    /**
     * Defines the association with an Amazon Chime SDK account ID, user ID, Voice Connector ID, or Voice Connector group ID.
     */
    Name?: PhoneNumberAssociationName;
    /**
     * The timestamp of the phone number association, in ISO 8601 format.
     */
    AssociatedTimestamp?: Iso8601Timestamp;
  }
  export type PhoneNumberAssociationList = PhoneNumberAssociation[];
  export type PhoneNumberAssociationName = "VoiceConnectorId"|"VoiceConnectorGroupId"|"SipRuleId"|string;
  export interface PhoneNumberCapabilities {
    /**
     * Allows or denies inbound calling for the specified phone number.
     */
    InboundCall?: NullableBoolean;
    /**
     * Allows or denies outbound calling for the specified phone number.
     */
    OutboundCall?: NullableBoolean;
    /**
     * Allows or denies inbound SMS messaging for the specified phone number.
     */
    InboundSMS?: NullableBoolean;
    /**
     * Allows or denies outbound SMS messaging for the specified phone number.
     */
    OutboundSMS?: NullableBoolean;
    /**
     * Allows or denies inbound MMS messaging for the specified phone number.
     */
    InboundMMS?: NullableBoolean;
    /**
     * Allows or denies inbound MMS messaging for the specified phone number.
     */
    OutboundMMS?: NullableBoolean;
  }
  export type PhoneNumberCountriesList = PhoneNumberCountry[];
  export interface PhoneNumberCountry {
    /**
     * The phone number country code. Format: ISO 3166-1 alpha-2.
     */
    CountryCode?: Alpha2CountryCode;
    /**
     * The supported phone number types.
     */
    SupportedPhoneNumberTypes?: PhoneNumberTypeList;
  }
  export interface PhoneNumberError {
    /**
     * The phone number ID for which the action failed.
     */
    PhoneNumberId?: SensitiveNonEmptyString;
    /**
     * The error code.
     */
    ErrorCode?: ErrorCode;
    /**
     * The error message.
     */
    ErrorMessage?: String;
  }
  export type PhoneNumberErrorList = PhoneNumberError[];
  export type PhoneNumberList = PhoneNumber[];
  export type PhoneNumberMaxResults = number;
  export type PhoneNumberName = string;
  export interface PhoneNumberOrder {
    /**
     * The ID of the phone order.
     */
    PhoneNumberOrderId?: GuidString;
    /**
     * The phone number order product type.
     */
    ProductType?: PhoneNumberProductType;
    /**
     * The status of the phone number order.
     */
    Status?: PhoneNumberOrderStatus;
    /**
     * The type of phone number being ordered, local or toll-free.
     */
    OrderType?: PhoneNumberOrderType;
    /**
     * The ordered phone number details, such as the phone number in E.164 format and the phone number status.
     */
    OrderedPhoneNumbers?: OrderedPhoneNumberList;
    /**
     * The phone number order creation time stamp, in ISO 8601 format.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The updated phone number order time stamp, in ISO 8601 format.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
  }
  export type PhoneNumberOrderList = PhoneNumberOrder[];
  export type PhoneNumberOrderStatus = "Processing"|"Successful"|"Failed"|"Partial"|"PendingDocuments"|"Submitted"|"FOC"|"ChangeRequested"|"Exception"|"CancelRequested"|"Cancelled"|string;
  export type PhoneNumberOrderType = "New"|"Porting"|string;
  export type PhoneNumberProductType = "VoiceConnector"|"SipMediaApplicationDialIn"|string;
  export type PhoneNumberStatus = "Cancelled"|"PortinCancelRequested"|"PortinInProgress"|"AcquireInProgress"|"AcquireFailed"|"Unassigned"|"Assigned"|"ReleaseInProgress"|"DeleteInProgress"|"ReleaseFailed"|"DeleteFailed"|string;
  export type PhoneNumberType = "Local"|"TollFree"|string;
  export type PhoneNumberTypeList = PhoneNumberType[];
  export type Port = number;
  export type PositiveInteger = number;
  export interface Proxy {
    /**
     * The default number of minutes allowed for proxy sessions.
     */
    DefaultSessionExpiryMinutes?: Integer;
    /**
     * When true, stops proxy sessions from being created on the specified Amazon Chime SDK Voice Connector.
     */
    Disabled?: Boolean;
    /**
     * The phone number to route calls to after a proxy session expires.
     */
    FallBackPhoneNumber?: E164PhoneNumber;
    /**
     * The countries for proxy phone numbers to be selected from.
     */
    PhoneNumberCountries?: StringList;
  }
  export interface ProxySession {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId?: NonEmptyString128;
    /**
     * The proxy session ID.
     */
    ProxySessionId?: NonEmptyString128;
    /**
     * The proxy session name.
     */
    Name?: String128;
    /**
     * The proxy session status.
     */
    Status?: ProxySessionStatus;
    /**
     * The number of minutes allowed for the proxy session.
     */
    ExpiryMinutes?: PositiveInteger;
    /**
     * The proxy session capabilities.
     */
    Capabilities?: CapabilityList;
    /**
     * The created time stamp, in ISO 8601 format.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The updated time stamp, in ISO 8601 format.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
    /**
     * The ended time stamp, in ISO 8601 format.
     */
    EndedTimestamp?: Iso8601Timestamp;
    /**
     * The proxy session participants.
     */
    Participants?: Participants;
    /**
     * The preference for proxy phone number reuse, or stickiness, between the same participants across sessions.
     */
    NumberSelectionBehavior?: NumberSelectionBehavior;
    /**
     * The preference for matching the country or area code of the proxy phone number with that of the first participant.
     */
    GeoMatchLevel?: GeoMatchLevel;
    /**
     * The country and area code for the proxy phone number.
     */
    GeoMatchParams?: GeoMatchParams;
  }
  export type ProxySessionNameString = string;
  export type ProxySessionStatus = "Open"|"InProgress"|"Closed"|string;
  export type ProxySessions = ProxySession[];
  export interface PutSipMediaApplicationAlexaSkillConfigurationRequest {
    /**
     * The SIP media application ID.
     */
    SipMediaApplicationId: NonEmptyString;
    /**
     * The Alexa Skill configuration.
     */
    SipMediaApplicationAlexaSkillConfiguration?: SipMediaApplicationAlexaSkillConfiguration;
  }
  export interface PutSipMediaApplicationAlexaSkillConfigurationResponse {
    /**
     * Returns the Alexa Skill configuration.
     */
    SipMediaApplicationAlexaSkillConfiguration?: SipMediaApplicationAlexaSkillConfiguration;
  }
  export interface PutSipMediaApplicationLoggingConfigurationRequest {
    /**
     * The SIP media application ID.
     */
    SipMediaApplicationId: NonEmptyString;
    /**
     * The logging configuration for the specified SIP media application.
     */
    SipMediaApplicationLoggingConfiguration?: SipMediaApplicationLoggingConfiguration;
  }
  export interface PutSipMediaApplicationLoggingConfigurationResponse {
    /**
     * The updated logging configuration for the specified SIP media application.
     */
    SipMediaApplicationLoggingConfiguration?: SipMediaApplicationLoggingConfiguration;
  }
  export interface PutVoiceConnectorEmergencyCallingConfigurationRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
    /**
     * The configuration being updated.
     */
    EmergencyCallingConfiguration: EmergencyCallingConfiguration;
  }
  export interface PutVoiceConnectorEmergencyCallingConfigurationResponse {
    /**
     * The updated configuration.
     */
    EmergencyCallingConfiguration?: EmergencyCallingConfiguration;
  }
  export interface PutVoiceConnectorLoggingConfigurationRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
    /**
     * The logging configuration being updated.
     */
    LoggingConfiguration: LoggingConfiguration;
  }
  export interface PutVoiceConnectorLoggingConfigurationResponse {
    /**
     * The updated logging configuration.
     */
    LoggingConfiguration?: LoggingConfiguration;
  }
  export interface PutVoiceConnectorOriginationRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
    /**
     * The origination settings being updated.
     */
    Origination: Origination;
  }
  export interface PutVoiceConnectorOriginationResponse {
    /**
     * The updated origination settings.
     */
    Origination?: Origination;
  }
  export interface PutVoiceConnectorProxyRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString128;
    /**
     * The default number of minutes allowed for proxy session.
     */
    DefaultSessionExpiryMinutes: Integer;
    /**
     * The countries for proxy phone numbers to be selected from.
     */
    PhoneNumberPoolCountries: CountryList;
    /**
     * The phone number to route calls to after a proxy session expires.
     */
    FallBackPhoneNumber?: E164PhoneNumber;
    /**
     * When true, stops proxy sessions from being created on the specified Amazon Chime SDK Voice Connector.
     */
    Disabled?: Boolean;
  }
  export interface PutVoiceConnectorProxyResponse {
    /**
     * The proxy configuration details.
     */
    Proxy?: Proxy;
  }
  export interface PutVoiceConnectorStreamingConfigurationRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
    /**
     * The streaming settings being updated.
     */
    StreamingConfiguration: StreamingConfiguration;
  }
  export interface PutVoiceConnectorStreamingConfigurationResponse {
    /**
     * The updated streaming settings.
     */
    StreamingConfiguration?: StreamingConfiguration;
  }
  export interface PutVoiceConnectorTerminationCredentialsRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
    /**
     * The termination credentials being updated.
     */
    Credentials?: CredentialList;
  }
  export interface PutVoiceConnectorTerminationRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
    /**
     * The termination settings to be updated.
     */
    Termination: Termination;
  }
  export interface PutVoiceConnectorTerminationResponse {
    /**
     * The updated termination settings.
     */
    Termination?: Termination;
  }
  export interface RestorePhoneNumberRequest {
    /**
     * The ID of the phone number being restored.
     */
    PhoneNumberId: SensitiveNonEmptyString;
  }
  export interface RestorePhoneNumberResponse {
    /**
     * The restored phone number.
     */
    PhoneNumber?: PhoneNumber;
  }
  export type ResultMax = number;
  export type SMACreateCallArgumentsMap = {[key: string]: SensitiveString};
  export type SMAUpdateCallArgumentsMap = {[key: string]: SensitiveString};
  export interface SearchAvailablePhoneNumbersRequest {
    /**
     * Confines a search to just the phone numbers associated with the specified area code.
     */
    AreaCode?: String;
    /**
     * Confines a search to just the phone numbers associated with the specified city.
     */
    City?: String;
    /**
     * Confines a search to just the phone numbers associated with the specified country.
     */
    Country?: Alpha2CountryCode;
    /**
     * Confines a search to just the phone numbers associated with the specified state.
     */
    State?: String;
    /**
     * Confines a search to just the phone numbers associated with the specified toll-free prefix.
     */
    TollFreePrefix?: TollFreePrefix;
    /**
     * Confines a search to just the phone numbers associated with the specified phone number type, either local or toll-free.
     */
    PhoneNumberType?: PhoneNumberType;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: PhoneNumberMaxResults;
    /**
     * The token used to return the next page of results.
     */
    NextToken?: String;
  }
  export interface SearchAvailablePhoneNumbersResponse {
    /**
     * Confines a search to just the phone numbers in the E.164 format.
     */
    E164PhoneNumbers?: E164PhoneNumberList;
    /**
     * The token used to return the next page of results.
     */
    NextToken?: String;
  }
  export type SensitiveNonEmptyString = string;
  export type SensitiveString = string;
  export type SensitiveStringList = SensitiveString[];
  export interface ServerSideEncryptionConfiguration {
    /**
     * The ARN of the KMS key used to encrypt the enrollment data in a voice profile domain. Asymmetric customer managed keys are not supported.
     */
    KmsKeyArn: Arn;
  }
  export type SipApplicationPriority = number;
  export type SipHeadersMap = {[key: string]: SensitiveString};
  export interface SipMediaApplication {
    /**
     * A SIP media application's ID.
     */
    SipMediaApplicationId?: NonEmptyString;
    /**
     * The AWS Region in which the SIP media application is created.
     */
    AwsRegion?: String;
    /**
     * The SIP media application's name.
     */
    Name?: SipMediaApplicationName;
    /**
     * List of endpoints for a SIP media application. Currently, only one endpoint per SIP media application is permitted.
     */
    Endpoints?: SipMediaApplicationEndpointList;
    /**
     * The SIP media application creation timestamp, in ISO 8601 format.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which the SIP media application was updated.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
    /**
     * The ARN of the SIP media application.
     */
    SipMediaApplicationArn?: NonEmptyString;
  }
  export interface SipMediaApplicationAlexaSkillConfiguration {
    /**
     * The status of the Alexa Skill configuration.
     */
    AlexaSkillStatus: AlexaSkillStatus;
    /**
     * The ID of the Alexa Skill configuration.
     */
    AlexaSkillIds: AlexaSkillIdList;
  }
  export interface SipMediaApplicationCall {
    /**
     * The call's transaction ID.
     */
    TransactionId?: GuidString;
  }
  export interface SipMediaApplicationEndpoint {
    /**
     * Valid Amazon Resource Name (ARN) of the Lambda function, version, or alias. The function must be created in the same AWS Region as the SIP media application.
     */
    LambdaArn?: FunctionArn;
  }
  export type SipMediaApplicationEndpointList = SipMediaApplicationEndpoint[];
  export type SipMediaApplicationList = SipMediaApplication[];
  export interface SipMediaApplicationLoggingConfiguration {
    /**
     * Enables message logging for the specified SIP media application.
     */
    EnableSipMediaApplicationMessageLogs?: Boolean;
  }
  export type SipMediaApplicationName = string;
  export interface SipRule {
    /**
     * A SIP rule's ID.
     */
    SipRuleId?: NonEmptyString;
    /**
     * A SIP rule's name.
     */
    Name?: SipRuleName;
    /**
     * Indicates whether the SIP rule is enabled or disabled. You must disable a rule before you can delete it.
     */
    Disabled?: Boolean;
    /**
     * The type of trigger set for a SIP rule, either a phone number or a URI request host name.
     */
    TriggerType?: SipRuleTriggerType;
    /**
     * The value set for a SIP rule's trigger type. Either a phone number or a URI hostname.
     */
    TriggerValue?: NonEmptyString;
    /**
     * The target SIP media application and other details, such as priority and AWS Region, to be specified in the SIP rule. Only one SIP rule per AWS Region can be provided.
     */
    TargetApplications?: SipRuleTargetApplicationList;
    /**
     * The time at which the SIP rule was created, in ISO 8601 format.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which the SIP rule was updated, in ISO 8601 format.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
  }
  export type SipRuleList = SipRule[];
  export type SipRuleName = string;
  export interface SipRuleTargetApplication {
    /**
     * The ID of a rule's target SIP media application.
     */
    SipMediaApplicationId?: NonEmptyString;
    /**
     * The priority setting of a rule's target SIP media application.
     */
    Priority?: SipApplicationPriority;
    /**
     * The AWS Region of a rule's target SIP media application.
     */
    AwsRegion?: String;
  }
  export type SipRuleTargetApplicationList = SipRuleTargetApplication[];
  export type SipRuleTriggerType = "ToPhoneNumber"|"RequestUriHostname"|string;
  export interface SpeakerSearchDetails {
    /**
     * The result value in the speaker search details.
     */
    Results?: SpeakerSearchResultList;
    /**
     * The status of a voice print generation operation, VoiceprintGenerationSuccess or VoiceprintGenerationFailure..
     */
    VoiceprintGenerationStatus?: NonEmptyString256;
  }
  export interface SpeakerSearchResult {
    /**
     * The confidence score in the speaker search analysis.
     */
    ConfidenceScore?: ConfidenceScore;
    /**
     * The voice profile ID.
     */
    VoiceProfileId?: NonEmptyString256;
  }
  export type SpeakerSearchResultList = SpeakerSearchResult[];
  export interface SpeakerSearchTask {
    /**
     * The speaker search task ID.
     */
    SpeakerSearchTaskId?: NonEmptyString256;
    /**
     * The status of the speaker search task, IN_QUEUE, IN_PROGRESS, PARTIAL_SUCCESS, SUCCEEDED, FAILED, or STOPPED.
     */
    SpeakerSearchTaskStatus?: NonEmptyString;
    /**
     * The call details of a speaker search task.
     */
    CallDetails?: CallDetails;
    /**
     * The details of a speaker search task.
     */
    SpeakerSearchDetails?: SpeakerSearchDetails;
    /**
     * The time at which a speaker search task was created.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which a speaker search task was updated.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which the speaker search task began.
     */
    StartedTimestamp?: Iso8601Timestamp;
    /**
     * A detailed message about the status of a speaker search.
     */
    StatusMessage?: String;
  }
  export interface StartSpeakerSearchTaskRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString128;
    /**
     * The transaction ID of the call being analyzed.
     */
    TransactionId: NonEmptyString256;
    /**
     * The ID of the voice profile domain that will store the voice profile.
     */
    VoiceProfileDomainId: NonEmptyString256;
    /**
     * The unique identifier for the client request. Use a different token for different speaker search tasks.
     */
    ClientRequestToken?: ClientRequestId;
    /**
     * Specifies which call leg to stream for speaker search.
     */
    CallLeg?: CallLegType;
  }
  export interface StartSpeakerSearchTaskResponse {
    /**
     * The details of the speaker search task.
     */
    SpeakerSearchTask?: SpeakerSearchTask;
  }
  export interface StartVoiceToneAnalysisTaskRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString128;
    /**
     * The transaction ID.
     */
    TransactionId: NonEmptyString256;
    /**
     * The language code.
     */
    LanguageCode: LanguageCode;
    /**
     * The unique identifier for the client request. Use a different token for different voice tone analysis tasks.
     */
    ClientRequestToken?: ClientRequestId;
  }
  export interface StartVoiceToneAnalysisTaskResponse {
    /**
     * The details of the voice tone analysis task.
     */
    VoiceToneAnalysisTask?: VoiceToneAnalysisTask;
  }
  export interface StopSpeakerSearchTaskRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString128;
    /**
     * The speaker search task ID.
     */
    SpeakerSearchTaskId: NonEmptyString256;
  }
  export interface StopVoiceToneAnalysisTaskRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString128;
    /**
     * The ID of the voice tone analysis task.
     */
    VoiceToneAnalysisTaskId: NonEmptyString256;
  }
  export interface StreamingConfiguration {
    /**
     * The amount of time, in hours, to the Kinesis data.
     */
    DataRetentionInHours: DataRetentionInHours;
    /**
     * When true, streaming to Kinesis is off.
     */
    Disabled: Boolean;
    /**
     * The streaming notification targets.
     */
    StreamingNotificationTargets?: StreamingNotificationTargetList;
    /**
     * The call analytics configuration.
     */
    MediaInsightsConfiguration?: MediaInsightsConfiguration;
  }
  export interface StreamingNotificationTarget {
    /**
     * The streaming notification target.
     */
    NotificationTarget?: NotificationTarget;
  }
  export type StreamingNotificationTargetList = StreamingNotificationTarget[];
  export type String = string;
  export type String128 = string;
  export type StringList = String[];
  export interface Tag {
    /**
     * The tag's key.
     */
    Key: TagKey;
    /**
     * The tag's value.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The ARN of the resource being tagged. 
     */
    ResourceARN: Arn;
    /**
     * A list of the tags being added to the resource.
     */
    Tags: TagList;
  }
  export type TagValue = string;
  export interface Termination {
    /**
     * The limit on calls per second. Max value based on account service quota. Default value of 1.
     */
    CpsLimit?: CpsLimit;
    /**
     * The default outbound calling number.
     */
    DefaultPhoneNumber?: E164PhoneNumber;
    /**
     * The countries to which calls are allowed, in ISO 3166-1 alpha-2 format. Required.
     */
    CallingRegions?: CallingRegionList;
    /**
     * The IP addresses allowed to make calls, in CIDR format.
     */
    CidrAllowedList?: StringList;
    /**
     * When termination is disabled, outbound calls cannot be made.
     */
    Disabled?: Boolean;
  }
  export interface TerminationHealth {
    /**
     * The timestamp, in ISO 8601 format.
     */
    Timestamp?: Iso8601Timestamp;
    /**
     * The source IP address.
     */
    Source?: String;
  }
  export type TollFreePrefix = string;
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource having its tags removed.
     */
    ResourceARN: Arn;
    /**
     * The keys of the tags being removed from the resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UpdateGlobalSettingsRequest {
    /**
     * The Voice Connector settings.
     */
    VoiceConnector?: VoiceConnectorSettings;
  }
  export interface UpdatePhoneNumberRequest {
    /**
     * The phone number ID.
     */
    PhoneNumberId: SensitiveNonEmptyString;
    /**
     * The product type.
     */
    ProductType?: PhoneNumberProductType;
    /**
     * The outbound calling name associated with the phone number.
     */
    CallingName?: CallingName;
    /**
     * Specifies the name assigned to one or more phone numbers.
     */
    Name?: PhoneNumberName;
  }
  export interface UpdatePhoneNumberRequestItem {
    /**
     * The phone number ID to update.
     */
    PhoneNumberId: SensitiveNonEmptyString;
    /**
     * The product type to update.
     */
    ProductType?: PhoneNumberProductType;
    /**
     * The outbound calling name to update.
     */
    CallingName?: CallingName;
    /**
     * The name of the phone number.
     */
    Name?: PhoneNumberName;
  }
  export type UpdatePhoneNumberRequestItemList = UpdatePhoneNumberRequestItem[];
  export interface UpdatePhoneNumberResponse {
    /**
     * The updated phone number details.
     */
    PhoneNumber?: PhoneNumber;
  }
  export interface UpdatePhoneNumberSettingsRequest {
    /**
     * The default outbound calling name for the account.
     */
    CallingName: CallingName;
  }
  export interface UpdateProxySessionRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString128;
    /**
     * The proxy session ID.
     */
    ProxySessionId: NonEmptyString128;
    /**
     * The proxy session capabilities.
     */
    Capabilities: CapabilityList;
    /**
     * The number of minutes allowed for the proxy session.
     */
    ExpiryMinutes?: PositiveInteger;
  }
  export interface UpdateProxySessionResponse {
    /**
     * The updated proxy session details.
     */
    ProxySession?: ProxySession;
  }
  export interface UpdateSipMediaApplicationCallRequest {
    /**
     * The ID of the SIP media application handling the call.
     */
    SipMediaApplicationId: NonEmptyString;
    /**
     * The ID of the call transaction.
     */
    TransactionId: NonEmptyString;
    /**
     * Arguments made available to the Lambda function as part of the CALL_UPDATE_REQUESTED event. Can contain 0-20 key-value pairs.
     */
    Arguments: SMAUpdateCallArgumentsMap;
  }
  export interface UpdateSipMediaApplicationCallResponse {
    /**
     * A Call instance for a SIP media application.
     */
    SipMediaApplicationCall?: SipMediaApplicationCall;
  }
  export interface UpdateSipMediaApplicationRequest {
    /**
     * The SIP media application ID.
     */
    SipMediaApplicationId: NonEmptyString;
    /**
     * The new name for the specified SIP media application.
     */
    Name?: SipMediaApplicationName;
    /**
     * The new set of endpoints for the specified SIP media application.
     */
    Endpoints?: SipMediaApplicationEndpointList;
  }
  export interface UpdateSipMediaApplicationResponse {
    /**
     * The updated SIP media application’s details.
     */
    SipMediaApplication?: SipMediaApplication;
  }
  export interface UpdateSipRuleRequest {
    /**
     * The SIP rule ID.
     */
    SipRuleId: NonEmptyString;
    /**
     * The new name for the specified SIP rule.
     */
    Name: SipRuleName;
    /**
     * The new value that indicates whether the rule is disabled.
     */
    Disabled?: NullableBoolean;
    /**
     * The new list of target applications.
     */
    TargetApplications?: SipRuleTargetApplicationList;
  }
  export interface UpdateSipRuleResponse {
    /**
     * The updated SIP rule details.
     */
    SipRule?: SipRule;
  }
  export interface UpdateVoiceConnectorGroupRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorGroupId: NonEmptyString;
    /**
     * The name of the Voice Connector group.
     */
    Name: VoiceConnectorGroupName;
    /**
     * The VoiceConnectorItems to associate with the Voice Connector group.
     */
    VoiceConnectorItems: VoiceConnectorItemList;
  }
  export interface UpdateVoiceConnectorGroupResponse {
    /**
     * The updated Voice Connector group.
     */
    VoiceConnectorGroup?: VoiceConnectorGroup;
  }
  export interface UpdateVoiceConnectorRequest {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
    /**
     * The name of the Voice Connector.
     */
    Name: VoiceConnectorName;
    /**
     * When enabled, requires encryption for the Voice Connector.
     */
    RequireEncryption: Boolean;
  }
  export interface UpdateVoiceConnectorResponse {
    /**
     * The updated Voice Connector details.
     */
    VoiceConnector?: VoiceConnector;
  }
  export interface UpdateVoiceProfileDomainRequest {
    /**
     * The domain ID.
     */
    VoiceProfileDomainId: NonEmptyString256;
    /**
     * The name of the voice profile domain.
     */
    Name?: VoiceProfileDomainName;
    /**
     * The description of the voice profile domain.
     */
    Description?: VoiceProfileDomainDescription;
  }
  export interface UpdateVoiceProfileDomainResponse {
    /**
     * The updated details of the voice profile domain.
     */
    VoiceProfileDomain?: VoiceProfileDomain;
  }
  export interface UpdateVoiceProfileRequest {
    /**
     * The profile ID.
     */
    VoiceProfileId: NonEmptyString256;
    /**
     * The ID of the speaker search task.
     */
    SpeakerSearchTaskId: NonEmptyString256;
  }
  export interface UpdateVoiceProfileResponse {
    /**
     * The updated voice profile settings.
     */
    VoiceProfile?: VoiceProfile;
  }
  export interface ValidateE911AddressRequest {
    /**
     * The AWS account ID.
     */
    AwsAccountId: NonEmptyString;
    /**
     * The address street number, such as 200 or 2121.
     */
    StreetNumber: SensitiveNonEmptyString;
    /**
     * The address street information, such as 8th Avenue.
     */
    StreetInfo: SensitiveNonEmptyString;
    /**
     * The address city, such as Portland.
     */
    City: SensitiveNonEmptyString;
    /**
     * The address state, such as ME.
     */
    State: SensitiveNonEmptyString;
    /**
     * The country in the address being validated.
     */
    Country: SensitiveNonEmptyString;
    /**
     * The dress postal code, such 04352.
     */
    PostalCode: SensitiveNonEmptyString;
  }
  export interface ValidateE911AddressResponse {
    /**
     * Number indicating the result of address validation. 0 means the address was perfect as-is and successfully validated. 1 means the address was corrected. 2 means the address sent was not close enough and was not validated.
     */
    ValidationResult?: ValidationResult;
    /**
     * The ID that represents the address.
     */
    AddressExternalId?: String;
    /**
     * The validated address.
     */
    Address?: Address;
    /**
     * The list of address suggestions..
     */
    CandidateAddressList?: CandidateAddressList;
  }
  export type ValidationResult = number;
  export interface VoiceConnector {
    /**
     * The Voice Connector's ID.
     */
    VoiceConnectorId?: NonEmptyString;
    /**
     * The AWS Region in which the Voice Connector is created. Default: us-east-1.
     */
    AwsRegion?: VoiceConnectorAwsRegion;
    /**
     * The Voice Connector's name.
     */
    Name?: VoiceConnectorName;
    /**
     * The outbound host name for the Voice Connector.
     */
    OutboundHostName?: String;
    /**
     * Enables or disables encryption for the Voice Connector.
     */
    RequireEncryption?: Boolean;
    /**
     * The Voice Connector's creation timestamp, in ISO 8601 format.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The Voice Connector's updated timestamp, in ISO 8601 format.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
    /**
     * The ARN of the Voice Connector.
     */
    VoiceConnectorArn?: NonEmptyString;
  }
  export type VoiceConnectorAwsRegion = "us-east-1"|"us-west-2"|"ca-central-1"|"eu-central-1"|"eu-west-1"|"eu-west-2"|"ap-northeast-2"|"ap-northeast-1"|"ap-southeast-1"|"ap-southeast-2"|string;
  export type VoiceConnectorAwsRegionList = VoiceConnectorAwsRegion[];
  export interface VoiceConnectorGroup {
    /**
     * The ID of a Voice Connector group.
     */
    VoiceConnectorGroupId?: NonEmptyString;
    /**
     * The name of a Voice Connector group.
     */
    Name?: VoiceConnectorGroupName;
    /**
     * The Voice Connectors to which you route inbound calls.
     */
    VoiceConnectorItems?: VoiceConnectorItemList;
    /**
     * The Voice Connector group's creation time stamp, in ISO 8601 format.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The Voice Connector group's creation time stamp, in ISO 8601 format.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
    /**
     * The ARN of the Voice Connector group.
     */
    VoiceConnectorGroupArn?: NonEmptyString;
  }
  export type VoiceConnectorGroupList = VoiceConnectorGroup[];
  export type VoiceConnectorGroupName = string;
  export interface VoiceConnectorItem {
    /**
     * The Voice Connector ID.
     */
    VoiceConnectorId: NonEmptyString;
    /**
     * The priority setting of a Voice Connector item. Calls are routed to hosts in priority order, with 1 as the highest priority. When hosts have equal priority, the system distributes calls among them based on their relative weight.
     */
    Priority: VoiceConnectorItemPriority;
  }
  export type VoiceConnectorItemList = VoiceConnectorItem[];
  export type VoiceConnectorItemPriority = number;
  export type VoiceConnectorList = VoiceConnector[];
  export type VoiceConnectorName = string;
  export interface VoiceConnectorSettings {
    /**
     * The S3 bucket that stores the Voice Connector's call detail records.
     */
    CdrBucket?: String;
  }
  export interface VoiceProfile {
    /**
     * The ID of the voice profile.
     */
    VoiceProfileId?: NonEmptyString256;
    /**
     * The ARN of the voice profile.
     */
    VoiceProfileArn?: Arn;
    /**
     * The ID of the domain that contains the voice profile.
     */
    VoiceProfileDomainId?: NonEmptyString256;
    /**
     * The time at which the voice profile was created and enrolled.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which the voice profile was last updated.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which a voice profile expires unless you re-enroll the caller via the UpdateVoiceProfile API.
     */
    ExpirationTimestamp?: Iso8601Timestamp;
  }
  export interface VoiceProfileDomain {
    /**
     * The ID of the voice profile domain.
     */
    VoiceProfileDomainId?: NonEmptyString256;
    /**
     * The voice profile domain's Amazon Resource Number (ARN).
     */
    VoiceProfileDomainArn?: Arn;
    /**
     * The name of the voice profile domain.
     */
    Name?: VoiceProfileDomainName;
    /**
     * The description of the voice profile domain.
     */
    Description?: VoiceProfileDomainDescription;
    /**
     * A structure that contains the configuration settings for server-side encryption.
     */
    ServerSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
    /**
     * The time at which the voice profile domain was created.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which the voice profile was last updated.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
  }
  export type VoiceProfileDomainDescription = string;
  export type VoiceProfileDomainName = string;
  export interface VoiceProfileDomainSummary {
    /**
     * The ID of the voice profile domain summary.
     */
    VoiceProfileDomainId?: NonEmptyString256;
    /**
     * The ARN of a voice profile in a voice profile domain summary.
     */
    VoiceProfileDomainArn?: Arn;
    /**
     * The name of the voice profile domain summary.
     */
    Name?: VoiceProfileDomainName;
    /**
     * Describes the voice profile domain summary.
     */
    Description?: VoiceProfileDomainDescription;
    /**
     * The time at which the voice profile domain summary was created.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which the voice profile domain summary was last updated.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
  }
  export type VoiceProfileDomainSummaryList = VoiceProfileDomainSummary[];
  export interface VoiceProfileSummary {
    /**
     * The ID of the voice profile in a voice profile summary.
     */
    VoiceProfileId?: NonEmptyString256;
    /**
     * The ARN of the voice profile in a voice profile summary.
     */
    VoiceProfileArn?: Arn;
    /**
     * The ID of the voice profile domain in a voice profile summary.
     */
    VoiceProfileDomainId?: NonEmptyString256;
    /**
     * The time at which a voice profile summary was created.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which a voice profile summary was last updated.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
    /**
     * Extends the life of the voice profile. You can use UpdateVoiceProfile to refresh an existing voice profile's voice print and extend the life of the summary.
     */
    ExpirationTimestamp?: Iso8601Timestamp;
  }
  export type VoiceProfileSummaryList = VoiceProfileSummary[];
  export interface VoiceToneAnalysisTask {
    /**
     * The ID of the voice tone analysis task.
     */
    VoiceToneAnalysisTaskId?: NonEmptyString256;
    /**
     * The status of a voice tone analysis task, IN_QUEUE, IN_PROGRESS, PARTIAL_SUCCESS, SUCCEEDED, FAILED, or STOPPED.
     */
    VoiceToneAnalysisTaskStatus?: NonEmptyString;
    /**
     * The call details of a voice tone analysis task.
     */
    CallDetails?: CallDetails;
    /**
     * The time at which a voice tone analysis task was created.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which a voice tone analysis task was updated.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which a voice tone analysis task started.
     */
    StartedTimestamp?: Iso8601Timestamp;
    /**
     * The status of a voice tone analysis task.
     */
    StatusMessage?: String;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2022-08-03"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ChimeSDKVoice client.
   */
  export import Types = ChimeSDKVoice;
}
export = ChimeSDKVoice;
