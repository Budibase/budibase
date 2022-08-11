import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Pinpoint extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Pinpoint.Types.ClientConfiguration)
  config: Config & Pinpoint.Types.ClientConfiguration;
  /**
   *  Creates an application.
   */
  createApp(params: Pinpoint.Types.CreateAppRequest, callback?: (err: AWSError, data: Pinpoint.Types.CreateAppResponse) => void): Request<Pinpoint.Types.CreateAppResponse, AWSError>;
  /**
   *  Creates an application.
   */
  createApp(callback?: (err: AWSError, data: Pinpoint.Types.CreateAppResponse) => void): Request<Pinpoint.Types.CreateAppResponse, AWSError>;
  /**
   * Creates a new campaign for an application or updates the settings of an existing campaign for an application.
   */
  createCampaign(params: Pinpoint.Types.CreateCampaignRequest, callback?: (err: AWSError, data: Pinpoint.Types.CreateCampaignResponse) => void): Request<Pinpoint.Types.CreateCampaignResponse, AWSError>;
  /**
   * Creates a new campaign for an application or updates the settings of an existing campaign for an application.
   */
  createCampaign(callback?: (err: AWSError, data: Pinpoint.Types.CreateCampaignResponse) => void): Request<Pinpoint.Types.CreateCampaignResponse, AWSError>;
  /**
   * Creates a message template for messages that are sent through the email channel.
   */
  createEmailTemplate(params: Pinpoint.Types.CreateEmailTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.CreateEmailTemplateResponse) => void): Request<Pinpoint.Types.CreateEmailTemplateResponse, AWSError>;
  /**
   * Creates a message template for messages that are sent through the email channel.
   */
  createEmailTemplate(callback?: (err: AWSError, data: Pinpoint.Types.CreateEmailTemplateResponse) => void): Request<Pinpoint.Types.CreateEmailTemplateResponse, AWSError>;
  /**
   * Creates an export job for an application.
   */
  createExportJob(params: Pinpoint.Types.CreateExportJobRequest, callback?: (err: AWSError, data: Pinpoint.Types.CreateExportJobResponse) => void): Request<Pinpoint.Types.CreateExportJobResponse, AWSError>;
  /**
   * Creates an export job for an application.
   */
  createExportJob(callback?: (err: AWSError, data: Pinpoint.Types.CreateExportJobResponse) => void): Request<Pinpoint.Types.CreateExportJobResponse, AWSError>;
  /**
   * Creates an import job for an application.
   */
  createImportJob(params: Pinpoint.Types.CreateImportJobRequest, callback?: (err: AWSError, data: Pinpoint.Types.CreateImportJobResponse) => void): Request<Pinpoint.Types.CreateImportJobResponse, AWSError>;
  /**
   * Creates an import job for an application.
   */
  createImportJob(callback?: (err: AWSError, data: Pinpoint.Types.CreateImportJobResponse) => void): Request<Pinpoint.Types.CreateImportJobResponse, AWSError>;
  /**
   * Creates a new message template for messages using the in-app message channel.
   */
  createInAppTemplate(params: Pinpoint.Types.CreateInAppTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.CreateInAppTemplateResponse) => void): Request<Pinpoint.Types.CreateInAppTemplateResponse, AWSError>;
  /**
   * Creates a new message template for messages using the in-app message channel.
   */
  createInAppTemplate(callback?: (err: AWSError, data: Pinpoint.Types.CreateInAppTemplateResponse) => void): Request<Pinpoint.Types.CreateInAppTemplateResponse, AWSError>;
  /**
   * Creates a journey for an application.
   */
  createJourney(params: Pinpoint.Types.CreateJourneyRequest, callback?: (err: AWSError, data: Pinpoint.Types.CreateJourneyResponse) => void): Request<Pinpoint.Types.CreateJourneyResponse, AWSError>;
  /**
   * Creates a journey for an application.
   */
  createJourney(callback?: (err: AWSError, data: Pinpoint.Types.CreateJourneyResponse) => void): Request<Pinpoint.Types.CreateJourneyResponse, AWSError>;
  /**
   * Creates a message template for messages that are sent through a push notification channel.
   */
  createPushTemplate(params: Pinpoint.Types.CreatePushTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.CreatePushTemplateResponse) => void): Request<Pinpoint.Types.CreatePushTemplateResponse, AWSError>;
  /**
   * Creates a message template for messages that are sent through a push notification channel.
   */
  createPushTemplate(callback?: (err: AWSError, data: Pinpoint.Types.CreatePushTemplateResponse) => void): Request<Pinpoint.Types.CreatePushTemplateResponse, AWSError>;
  /**
   * Creates an Amazon Pinpoint configuration for a recommender model.
   */
  createRecommenderConfiguration(params: Pinpoint.Types.CreateRecommenderConfigurationRequest, callback?: (err: AWSError, data: Pinpoint.Types.CreateRecommenderConfigurationResponse) => void): Request<Pinpoint.Types.CreateRecommenderConfigurationResponse, AWSError>;
  /**
   * Creates an Amazon Pinpoint configuration for a recommender model.
   */
  createRecommenderConfiguration(callback?: (err: AWSError, data: Pinpoint.Types.CreateRecommenderConfigurationResponse) => void): Request<Pinpoint.Types.CreateRecommenderConfigurationResponse, AWSError>;
  /**
   * Creates a new segment for an application or updates the configuration, dimension, and other settings for an existing segment that's associated with an application.
   */
  createSegment(params: Pinpoint.Types.CreateSegmentRequest, callback?: (err: AWSError, data: Pinpoint.Types.CreateSegmentResponse) => void): Request<Pinpoint.Types.CreateSegmentResponse, AWSError>;
  /**
   * Creates a new segment for an application or updates the configuration, dimension, and other settings for an existing segment that's associated with an application.
   */
  createSegment(callback?: (err: AWSError, data: Pinpoint.Types.CreateSegmentResponse) => void): Request<Pinpoint.Types.CreateSegmentResponse, AWSError>;
  /**
   * Creates a message template for messages that are sent through the SMS channel.
   */
  createSmsTemplate(params: Pinpoint.Types.CreateSmsTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.CreateSmsTemplateResponse) => void): Request<Pinpoint.Types.CreateSmsTemplateResponse, AWSError>;
  /**
   * Creates a message template for messages that are sent through the SMS channel.
   */
  createSmsTemplate(callback?: (err: AWSError, data: Pinpoint.Types.CreateSmsTemplateResponse) => void): Request<Pinpoint.Types.CreateSmsTemplateResponse, AWSError>;
  /**
   * Creates a message template for messages that are sent through the voice channel.
   */
  createVoiceTemplate(params: Pinpoint.Types.CreateVoiceTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.CreateVoiceTemplateResponse) => void): Request<Pinpoint.Types.CreateVoiceTemplateResponse, AWSError>;
  /**
   * Creates a message template for messages that are sent through the voice channel.
   */
  createVoiceTemplate(callback?: (err: AWSError, data: Pinpoint.Types.CreateVoiceTemplateResponse) => void): Request<Pinpoint.Types.CreateVoiceTemplateResponse, AWSError>;
  /**
   * Disables the ADM channel for an application and deletes any existing settings for the channel.
   */
  deleteAdmChannel(params: Pinpoint.Types.DeleteAdmChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteAdmChannelResponse) => void): Request<Pinpoint.Types.DeleteAdmChannelResponse, AWSError>;
  /**
   * Disables the ADM channel for an application and deletes any existing settings for the channel.
   */
  deleteAdmChannel(callback?: (err: AWSError, data: Pinpoint.Types.DeleteAdmChannelResponse) => void): Request<Pinpoint.Types.DeleteAdmChannelResponse, AWSError>;
  /**
   * Disables the APNs channel for an application and deletes any existing settings for the channel.
   */
  deleteApnsChannel(params: Pinpoint.Types.DeleteApnsChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteApnsChannelResponse) => void): Request<Pinpoint.Types.DeleteApnsChannelResponse, AWSError>;
  /**
   * Disables the APNs channel for an application and deletes any existing settings for the channel.
   */
  deleteApnsChannel(callback?: (err: AWSError, data: Pinpoint.Types.DeleteApnsChannelResponse) => void): Request<Pinpoint.Types.DeleteApnsChannelResponse, AWSError>;
  /**
   * Disables the APNs sandbox channel for an application and deletes any existing settings for the channel.
   */
  deleteApnsSandboxChannel(params: Pinpoint.Types.DeleteApnsSandboxChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteApnsSandboxChannelResponse) => void): Request<Pinpoint.Types.DeleteApnsSandboxChannelResponse, AWSError>;
  /**
   * Disables the APNs sandbox channel for an application and deletes any existing settings for the channel.
   */
  deleteApnsSandboxChannel(callback?: (err: AWSError, data: Pinpoint.Types.DeleteApnsSandboxChannelResponse) => void): Request<Pinpoint.Types.DeleteApnsSandboxChannelResponse, AWSError>;
  /**
   * Disables the APNs VoIP channel for an application and deletes any existing settings for the channel.
   */
  deleteApnsVoipChannel(params: Pinpoint.Types.DeleteApnsVoipChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteApnsVoipChannelResponse) => void): Request<Pinpoint.Types.DeleteApnsVoipChannelResponse, AWSError>;
  /**
   * Disables the APNs VoIP channel for an application and deletes any existing settings for the channel.
   */
  deleteApnsVoipChannel(callback?: (err: AWSError, data: Pinpoint.Types.DeleteApnsVoipChannelResponse) => void): Request<Pinpoint.Types.DeleteApnsVoipChannelResponse, AWSError>;
  /**
   * Disables the APNs VoIP sandbox channel for an application and deletes any existing settings for the channel.
   */
  deleteApnsVoipSandboxChannel(params: Pinpoint.Types.DeleteApnsVoipSandboxChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteApnsVoipSandboxChannelResponse) => void): Request<Pinpoint.Types.DeleteApnsVoipSandboxChannelResponse, AWSError>;
  /**
   * Disables the APNs VoIP sandbox channel for an application and deletes any existing settings for the channel.
   */
  deleteApnsVoipSandboxChannel(callback?: (err: AWSError, data: Pinpoint.Types.DeleteApnsVoipSandboxChannelResponse) => void): Request<Pinpoint.Types.DeleteApnsVoipSandboxChannelResponse, AWSError>;
  /**
   * Deletes an application.
   */
  deleteApp(params: Pinpoint.Types.DeleteAppRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteAppResponse) => void): Request<Pinpoint.Types.DeleteAppResponse, AWSError>;
  /**
   * Deletes an application.
   */
  deleteApp(callback?: (err: AWSError, data: Pinpoint.Types.DeleteAppResponse) => void): Request<Pinpoint.Types.DeleteAppResponse, AWSError>;
  /**
   * Disables the Baidu channel for an application and deletes any existing settings for the channel.
   */
  deleteBaiduChannel(params: Pinpoint.Types.DeleteBaiduChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteBaiduChannelResponse) => void): Request<Pinpoint.Types.DeleteBaiduChannelResponse, AWSError>;
  /**
   * Disables the Baidu channel for an application and deletes any existing settings for the channel.
   */
  deleteBaiduChannel(callback?: (err: AWSError, data: Pinpoint.Types.DeleteBaiduChannelResponse) => void): Request<Pinpoint.Types.DeleteBaiduChannelResponse, AWSError>;
  /**
   * Deletes a campaign from an application.
   */
  deleteCampaign(params: Pinpoint.Types.DeleteCampaignRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteCampaignResponse) => void): Request<Pinpoint.Types.DeleteCampaignResponse, AWSError>;
  /**
   * Deletes a campaign from an application.
   */
  deleteCampaign(callback?: (err: AWSError, data: Pinpoint.Types.DeleteCampaignResponse) => void): Request<Pinpoint.Types.DeleteCampaignResponse, AWSError>;
  /**
   * Disables the email channel for an application and deletes any existing settings for the channel.
   */
  deleteEmailChannel(params: Pinpoint.Types.DeleteEmailChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteEmailChannelResponse) => void): Request<Pinpoint.Types.DeleteEmailChannelResponse, AWSError>;
  /**
   * Disables the email channel for an application and deletes any existing settings for the channel.
   */
  deleteEmailChannel(callback?: (err: AWSError, data: Pinpoint.Types.DeleteEmailChannelResponse) => void): Request<Pinpoint.Types.DeleteEmailChannelResponse, AWSError>;
  /**
   * Deletes a message template for messages that were sent through the email channel.
   */
  deleteEmailTemplate(params: Pinpoint.Types.DeleteEmailTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteEmailTemplateResponse) => void): Request<Pinpoint.Types.DeleteEmailTemplateResponse, AWSError>;
  /**
   * Deletes a message template for messages that were sent through the email channel.
   */
  deleteEmailTemplate(callback?: (err: AWSError, data: Pinpoint.Types.DeleteEmailTemplateResponse) => void): Request<Pinpoint.Types.DeleteEmailTemplateResponse, AWSError>;
  /**
   * Deletes an endpoint from an application.
   */
  deleteEndpoint(params: Pinpoint.Types.DeleteEndpointRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteEndpointResponse) => void): Request<Pinpoint.Types.DeleteEndpointResponse, AWSError>;
  /**
   * Deletes an endpoint from an application.
   */
  deleteEndpoint(callback?: (err: AWSError, data: Pinpoint.Types.DeleteEndpointResponse) => void): Request<Pinpoint.Types.DeleteEndpointResponse, AWSError>;
  /**
   * Deletes the event stream for an application.
   */
  deleteEventStream(params: Pinpoint.Types.DeleteEventStreamRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteEventStreamResponse) => void): Request<Pinpoint.Types.DeleteEventStreamResponse, AWSError>;
  /**
   * Deletes the event stream for an application.
   */
  deleteEventStream(callback?: (err: AWSError, data: Pinpoint.Types.DeleteEventStreamResponse) => void): Request<Pinpoint.Types.DeleteEventStreamResponse, AWSError>;
  /**
   * Disables the GCM channel for an application and deletes any existing settings for the channel.
   */
  deleteGcmChannel(params: Pinpoint.Types.DeleteGcmChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteGcmChannelResponse) => void): Request<Pinpoint.Types.DeleteGcmChannelResponse, AWSError>;
  /**
   * Disables the GCM channel for an application and deletes any existing settings for the channel.
   */
  deleteGcmChannel(callback?: (err: AWSError, data: Pinpoint.Types.DeleteGcmChannelResponse) => void): Request<Pinpoint.Types.DeleteGcmChannelResponse, AWSError>;
  /**
   * Deletes a message template for messages sent using the in-app message channel.
   */
  deleteInAppTemplate(params: Pinpoint.Types.DeleteInAppTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteInAppTemplateResponse) => void): Request<Pinpoint.Types.DeleteInAppTemplateResponse, AWSError>;
  /**
   * Deletes a message template for messages sent using the in-app message channel.
   */
  deleteInAppTemplate(callback?: (err: AWSError, data: Pinpoint.Types.DeleteInAppTemplateResponse) => void): Request<Pinpoint.Types.DeleteInAppTemplateResponse, AWSError>;
  /**
   * Deletes a journey from an application.
   */
  deleteJourney(params: Pinpoint.Types.DeleteJourneyRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteJourneyResponse) => void): Request<Pinpoint.Types.DeleteJourneyResponse, AWSError>;
  /**
   * Deletes a journey from an application.
   */
  deleteJourney(callback?: (err: AWSError, data: Pinpoint.Types.DeleteJourneyResponse) => void): Request<Pinpoint.Types.DeleteJourneyResponse, AWSError>;
  /**
   * Deletes a message template for messages that were sent through a push notification channel.
   */
  deletePushTemplate(params: Pinpoint.Types.DeletePushTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeletePushTemplateResponse) => void): Request<Pinpoint.Types.DeletePushTemplateResponse, AWSError>;
  /**
   * Deletes a message template for messages that were sent through a push notification channel.
   */
  deletePushTemplate(callback?: (err: AWSError, data: Pinpoint.Types.DeletePushTemplateResponse) => void): Request<Pinpoint.Types.DeletePushTemplateResponse, AWSError>;
  /**
   * Deletes an Amazon Pinpoint configuration for a recommender model.
   */
  deleteRecommenderConfiguration(params: Pinpoint.Types.DeleteRecommenderConfigurationRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteRecommenderConfigurationResponse) => void): Request<Pinpoint.Types.DeleteRecommenderConfigurationResponse, AWSError>;
  /**
   * Deletes an Amazon Pinpoint configuration for a recommender model.
   */
  deleteRecommenderConfiguration(callback?: (err: AWSError, data: Pinpoint.Types.DeleteRecommenderConfigurationResponse) => void): Request<Pinpoint.Types.DeleteRecommenderConfigurationResponse, AWSError>;
  /**
   * Deletes a segment from an application.
   */
  deleteSegment(params: Pinpoint.Types.DeleteSegmentRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteSegmentResponse) => void): Request<Pinpoint.Types.DeleteSegmentResponse, AWSError>;
  /**
   * Deletes a segment from an application.
   */
  deleteSegment(callback?: (err: AWSError, data: Pinpoint.Types.DeleteSegmentResponse) => void): Request<Pinpoint.Types.DeleteSegmentResponse, AWSError>;
  /**
   * Disables the SMS channel for an application and deletes any existing settings for the channel.
   */
  deleteSmsChannel(params: Pinpoint.Types.DeleteSmsChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteSmsChannelResponse) => void): Request<Pinpoint.Types.DeleteSmsChannelResponse, AWSError>;
  /**
   * Disables the SMS channel for an application and deletes any existing settings for the channel.
   */
  deleteSmsChannel(callback?: (err: AWSError, data: Pinpoint.Types.DeleteSmsChannelResponse) => void): Request<Pinpoint.Types.DeleteSmsChannelResponse, AWSError>;
  /**
   * Deletes a message template for messages that were sent through the SMS channel.
   */
  deleteSmsTemplate(params: Pinpoint.Types.DeleteSmsTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteSmsTemplateResponse) => void): Request<Pinpoint.Types.DeleteSmsTemplateResponse, AWSError>;
  /**
   * Deletes a message template for messages that were sent through the SMS channel.
   */
  deleteSmsTemplate(callback?: (err: AWSError, data: Pinpoint.Types.DeleteSmsTemplateResponse) => void): Request<Pinpoint.Types.DeleteSmsTemplateResponse, AWSError>;
  /**
   * Deletes all the endpoints that are associated with a specific user ID.
   */
  deleteUserEndpoints(params: Pinpoint.Types.DeleteUserEndpointsRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteUserEndpointsResponse) => void): Request<Pinpoint.Types.DeleteUserEndpointsResponse, AWSError>;
  /**
   * Deletes all the endpoints that are associated with a specific user ID.
   */
  deleteUserEndpoints(callback?: (err: AWSError, data: Pinpoint.Types.DeleteUserEndpointsResponse) => void): Request<Pinpoint.Types.DeleteUserEndpointsResponse, AWSError>;
  /**
   * Disables the voice channel for an application and deletes any existing settings for the channel.
   */
  deleteVoiceChannel(params: Pinpoint.Types.DeleteVoiceChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteVoiceChannelResponse) => void): Request<Pinpoint.Types.DeleteVoiceChannelResponse, AWSError>;
  /**
   * Disables the voice channel for an application and deletes any existing settings for the channel.
   */
  deleteVoiceChannel(callback?: (err: AWSError, data: Pinpoint.Types.DeleteVoiceChannelResponse) => void): Request<Pinpoint.Types.DeleteVoiceChannelResponse, AWSError>;
  /**
   * Deletes a message template for messages that were sent through the voice channel.
   */
  deleteVoiceTemplate(params: Pinpoint.Types.DeleteVoiceTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.DeleteVoiceTemplateResponse) => void): Request<Pinpoint.Types.DeleteVoiceTemplateResponse, AWSError>;
  /**
   * Deletes a message template for messages that were sent through the voice channel.
   */
  deleteVoiceTemplate(callback?: (err: AWSError, data: Pinpoint.Types.DeleteVoiceTemplateResponse) => void): Request<Pinpoint.Types.DeleteVoiceTemplateResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the ADM channel for an application.
   */
  getAdmChannel(params: Pinpoint.Types.GetAdmChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetAdmChannelResponse) => void): Request<Pinpoint.Types.GetAdmChannelResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the ADM channel for an application.
   */
  getAdmChannel(callback?: (err: AWSError, data: Pinpoint.Types.GetAdmChannelResponse) => void): Request<Pinpoint.Types.GetAdmChannelResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the APNs channel for an application.
   */
  getApnsChannel(params: Pinpoint.Types.GetApnsChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetApnsChannelResponse) => void): Request<Pinpoint.Types.GetApnsChannelResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the APNs channel for an application.
   */
  getApnsChannel(callback?: (err: AWSError, data: Pinpoint.Types.GetApnsChannelResponse) => void): Request<Pinpoint.Types.GetApnsChannelResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the APNs sandbox channel for an application.
   */
  getApnsSandboxChannel(params: Pinpoint.Types.GetApnsSandboxChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetApnsSandboxChannelResponse) => void): Request<Pinpoint.Types.GetApnsSandboxChannelResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the APNs sandbox channel for an application.
   */
  getApnsSandboxChannel(callback?: (err: AWSError, data: Pinpoint.Types.GetApnsSandboxChannelResponse) => void): Request<Pinpoint.Types.GetApnsSandboxChannelResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the APNs VoIP channel for an application.
   */
  getApnsVoipChannel(params: Pinpoint.Types.GetApnsVoipChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetApnsVoipChannelResponse) => void): Request<Pinpoint.Types.GetApnsVoipChannelResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the APNs VoIP channel for an application.
   */
  getApnsVoipChannel(callback?: (err: AWSError, data: Pinpoint.Types.GetApnsVoipChannelResponse) => void): Request<Pinpoint.Types.GetApnsVoipChannelResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the APNs VoIP sandbox channel for an application.
   */
  getApnsVoipSandboxChannel(params: Pinpoint.Types.GetApnsVoipSandboxChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetApnsVoipSandboxChannelResponse) => void): Request<Pinpoint.Types.GetApnsVoipSandboxChannelResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the APNs VoIP sandbox channel for an application.
   */
  getApnsVoipSandboxChannel(callback?: (err: AWSError, data: Pinpoint.Types.GetApnsVoipSandboxChannelResponse) => void): Request<Pinpoint.Types.GetApnsVoipSandboxChannelResponse, AWSError>;
  /**
   * Retrieves information about an application.
   */
  getApp(params: Pinpoint.Types.GetAppRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetAppResponse) => void): Request<Pinpoint.Types.GetAppResponse, AWSError>;
  /**
   * Retrieves information about an application.
   */
  getApp(callback?: (err: AWSError, data: Pinpoint.Types.GetAppResponse) => void): Request<Pinpoint.Types.GetAppResponse, AWSError>;
  /**
   * Retrieves (queries) pre-aggregated data for a standard metric that applies to an application.
   */
  getApplicationDateRangeKpi(params: Pinpoint.Types.GetApplicationDateRangeKpiRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetApplicationDateRangeKpiResponse) => void): Request<Pinpoint.Types.GetApplicationDateRangeKpiResponse, AWSError>;
  /**
   * Retrieves (queries) pre-aggregated data for a standard metric that applies to an application.
   */
  getApplicationDateRangeKpi(callback?: (err: AWSError, data: Pinpoint.Types.GetApplicationDateRangeKpiResponse) => void): Request<Pinpoint.Types.GetApplicationDateRangeKpiResponse, AWSError>;
  /**
   * Retrieves information about the settings for an application.
   */
  getApplicationSettings(params: Pinpoint.Types.GetApplicationSettingsRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetApplicationSettingsResponse) => void): Request<Pinpoint.Types.GetApplicationSettingsResponse, AWSError>;
  /**
   * Retrieves information about the settings for an application.
   */
  getApplicationSettings(callback?: (err: AWSError, data: Pinpoint.Types.GetApplicationSettingsResponse) => void): Request<Pinpoint.Types.GetApplicationSettingsResponse, AWSError>;
  /**
   * Retrieves information about all the applications that are associated with your Amazon Pinpoint account.
   */
  getApps(params: Pinpoint.Types.GetAppsRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetAppsResponse) => void): Request<Pinpoint.Types.GetAppsResponse, AWSError>;
  /**
   * Retrieves information about all the applications that are associated with your Amazon Pinpoint account.
   */
  getApps(callback?: (err: AWSError, data: Pinpoint.Types.GetAppsResponse) => void): Request<Pinpoint.Types.GetAppsResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the Baidu channel for an application.
   */
  getBaiduChannel(params: Pinpoint.Types.GetBaiduChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetBaiduChannelResponse) => void): Request<Pinpoint.Types.GetBaiduChannelResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the Baidu channel for an application.
   */
  getBaiduChannel(callback?: (err: AWSError, data: Pinpoint.Types.GetBaiduChannelResponse) => void): Request<Pinpoint.Types.GetBaiduChannelResponse, AWSError>;
  /**
   * Retrieves information about the status, configuration, and other settings for a campaign.
   */
  getCampaign(params: Pinpoint.Types.GetCampaignRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetCampaignResponse) => void): Request<Pinpoint.Types.GetCampaignResponse, AWSError>;
  /**
   * Retrieves information about the status, configuration, and other settings for a campaign.
   */
  getCampaign(callback?: (err: AWSError, data: Pinpoint.Types.GetCampaignResponse) => void): Request<Pinpoint.Types.GetCampaignResponse, AWSError>;
  /**
   * Retrieves information about all the activities for a campaign.
   */
  getCampaignActivities(params: Pinpoint.Types.GetCampaignActivitiesRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetCampaignActivitiesResponse) => void): Request<Pinpoint.Types.GetCampaignActivitiesResponse, AWSError>;
  /**
   * Retrieves information about all the activities for a campaign.
   */
  getCampaignActivities(callback?: (err: AWSError, data: Pinpoint.Types.GetCampaignActivitiesResponse) => void): Request<Pinpoint.Types.GetCampaignActivitiesResponse, AWSError>;
  /**
   * Retrieves (queries) pre-aggregated data for a standard metric that applies to a campaign.
   */
  getCampaignDateRangeKpi(params: Pinpoint.Types.GetCampaignDateRangeKpiRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetCampaignDateRangeKpiResponse) => void): Request<Pinpoint.Types.GetCampaignDateRangeKpiResponse, AWSError>;
  /**
   * Retrieves (queries) pre-aggregated data for a standard metric that applies to a campaign.
   */
  getCampaignDateRangeKpi(callback?: (err: AWSError, data: Pinpoint.Types.GetCampaignDateRangeKpiResponse) => void): Request<Pinpoint.Types.GetCampaignDateRangeKpiResponse, AWSError>;
  /**
   * Retrieves information about the status, configuration, and other settings for a specific version of a campaign.
   */
  getCampaignVersion(params: Pinpoint.Types.GetCampaignVersionRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetCampaignVersionResponse) => void): Request<Pinpoint.Types.GetCampaignVersionResponse, AWSError>;
  /**
   * Retrieves information about the status, configuration, and other settings for a specific version of a campaign.
   */
  getCampaignVersion(callback?: (err: AWSError, data: Pinpoint.Types.GetCampaignVersionResponse) => void): Request<Pinpoint.Types.GetCampaignVersionResponse, AWSError>;
  /**
   * Retrieves information about the status, configuration, and other settings for all versions of a campaign.
   */
  getCampaignVersions(params: Pinpoint.Types.GetCampaignVersionsRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetCampaignVersionsResponse) => void): Request<Pinpoint.Types.GetCampaignVersionsResponse, AWSError>;
  /**
   * Retrieves information about the status, configuration, and other settings for all versions of a campaign.
   */
  getCampaignVersions(callback?: (err: AWSError, data: Pinpoint.Types.GetCampaignVersionsResponse) => void): Request<Pinpoint.Types.GetCampaignVersionsResponse, AWSError>;
  /**
   * Retrieves information about the status, configuration, and other settings for all the campaigns that are associated with an application.
   */
  getCampaigns(params: Pinpoint.Types.GetCampaignsRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetCampaignsResponse) => void): Request<Pinpoint.Types.GetCampaignsResponse, AWSError>;
  /**
   * Retrieves information about the status, configuration, and other settings for all the campaigns that are associated with an application.
   */
  getCampaigns(callback?: (err: AWSError, data: Pinpoint.Types.GetCampaignsResponse) => void): Request<Pinpoint.Types.GetCampaignsResponse, AWSError>;
  /**
   * Retrieves information about the history and status of each channel for an application.
   */
  getChannels(params: Pinpoint.Types.GetChannelsRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetChannelsResponse) => void): Request<Pinpoint.Types.GetChannelsResponse, AWSError>;
  /**
   * Retrieves information about the history and status of each channel for an application.
   */
  getChannels(callback?: (err: AWSError, data: Pinpoint.Types.GetChannelsResponse) => void): Request<Pinpoint.Types.GetChannelsResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the email channel for an application.
   */
  getEmailChannel(params: Pinpoint.Types.GetEmailChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetEmailChannelResponse) => void): Request<Pinpoint.Types.GetEmailChannelResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the email channel for an application.
   */
  getEmailChannel(callback?: (err: AWSError, data: Pinpoint.Types.GetEmailChannelResponse) => void): Request<Pinpoint.Types.GetEmailChannelResponse, AWSError>;
  /**
   * Retrieves the content and settings of a message template for messages that are sent through the email channel.
   */
  getEmailTemplate(params: Pinpoint.Types.GetEmailTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetEmailTemplateResponse) => void): Request<Pinpoint.Types.GetEmailTemplateResponse, AWSError>;
  /**
   * Retrieves the content and settings of a message template for messages that are sent through the email channel.
   */
  getEmailTemplate(callback?: (err: AWSError, data: Pinpoint.Types.GetEmailTemplateResponse) => void): Request<Pinpoint.Types.GetEmailTemplateResponse, AWSError>;
  /**
   * Retrieves information about the settings and attributes of a specific endpoint for an application.
   */
  getEndpoint(params: Pinpoint.Types.GetEndpointRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetEndpointResponse) => void): Request<Pinpoint.Types.GetEndpointResponse, AWSError>;
  /**
   * Retrieves information about the settings and attributes of a specific endpoint for an application.
   */
  getEndpoint(callback?: (err: AWSError, data: Pinpoint.Types.GetEndpointResponse) => void): Request<Pinpoint.Types.GetEndpointResponse, AWSError>;
  /**
   * Retrieves information about the event stream settings for an application.
   */
  getEventStream(params: Pinpoint.Types.GetEventStreamRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetEventStreamResponse) => void): Request<Pinpoint.Types.GetEventStreamResponse, AWSError>;
  /**
   * Retrieves information about the event stream settings for an application.
   */
  getEventStream(callback?: (err: AWSError, data: Pinpoint.Types.GetEventStreamResponse) => void): Request<Pinpoint.Types.GetEventStreamResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of a specific export job for an application.
   */
  getExportJob(params: Pinpoint.Types.GetExportJobRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetExportJobResponse) => void): Request<Pinpoint.Types.GetExportJobResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of a specific export job for an application.
   */
  getExportJob(callback?: (err: AWSError, data: Pinpoint.Types.GetExportJobResponse) => void): Request<Pinpoint.Types.GetExportJobResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of all the export jobs for an application.
   */
  getExportJobs(params: Pinpoint.Types.GetExportJobsRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetExportJobsResponse) => void): Request<Pinpoint.Types.GetExportJobsResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of all the export jobs for an application.
   */
  getExportJobs(callback?: (err: AWSError, data: Pinpoint.Types.GetExportJobsResponse) => void): Request<Pinpoint.Types.GetExportJobsResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the GCM channel for an application.
   */
  getGcmChannel(params: Pinpoint.Types.GetGcmChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetGcmChannelResponse) => void): Request<Pinpoint.Types.GetGcmChannelResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the GCM channel for an application.
   */
  getGcmChannel(callback?: (err: AWSError, data: Pinpoint.Types.GetGcmChannelResponse) => void): Request<Pinpoint.Types.GetGcmChannelResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of a specific import job for an application.
   */
  getImportJob(params: Pinpoint.Types.GetImportJobRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetImportJobResponse) => void): Request<Pinpoint.Types.GetImportJobResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of a specific import job for an application.
   */
  getImportJob(callback?: (err: AWSError, data: Pinpoint.Types.GetImportJobResponse) => void): Request<Pinpoint.Types.GetImportJobResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of all the import jobs for an application.
   */
  getImportJobs(params: Pinpoint.Types.GetImportJobsRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetImportJobsResponse) => void): Request<Pinpoint.Types.GetImportJobsResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of all the import jobs for an application.
   */
  getImportJobs(callback?: (err: AWSError, data: Pinpoint.Types.GetImportJobsResponse) => void): Request<Pinpoint.Types.GetImportJobsResponse, AWSError>;
  /**
   * Retrieves the in-app messages targeted for the provided endpoint ID.
   */
  getInAppMessages(params: Pinpoint.Types.GetInAppMessagesRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetInAppMessagesResponse) => void): Request<Pinpoint.Types.GetInAppMessagesResponse, AWSError>;
  /**
   * Retrieves the in-app messages targeted for the provided endpoint ID.
   */
  getInAppMessages(callback?: (err: AWSError, data: Pinpoint.Types.GetInAppMessagesResponse) => void): Request<Pinpoint.Types.GetInAppMessagesResponse, AWSError>;
  /**
   * Retrieves the content and settings of a message template for messages sent through the in-app channel.
   */
  getInAppTemplate(params: Pinpoint.Types.GetInAppTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetInAppTemplateResponse) => void): Request<Pinpoint.Types.GetInAppTemplateResponse, AWSError>;
  /**
   * Retrieves the content and settings of a message template for messages sent through the in-app channel.
   */
  getInAppTemplate(callback?: (err: AWSError, data: Pinpoint.Types.GetInAppTemplateResponse) => void): Request<Pinpoint.Types.GetInAppTemplateResponse, AWSError>;
  /**
   * Retrieves information about the status, configuration, and other settings for a journey.
   */
  getJourney(params: Pinpoint.Types.GetJourneyRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetJourneyResponse) => void): Request<Pinpoint.Types.GetJourneyResponse, AWSError>;
  /**
   * Retrieves information about the status, configuration, and other settings for a journey.
   */
  getJourney(callback?: (err: AWSError, data: Pinpoint.Types.GetJourneyResponse) => void): Request<Pinpoint.Types.GetJourneyResponse, AWSError>;
  /**
   * Retrieves (queries) pre-aggregated data for a standard engagement metric that applies to a journey.
   */
  getJourneyDateRangeKpi(params: Pinpoint.Types.GetJourneyDateRangeKpiRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetJourneyDateRangeKpiResponse) => void): Request<Pinpoint.Types.GetJourneyDateRangeKpiResponse, AWSError>;
  /**
   * Retrieves (queries) pre-aggregated data for a standard engagement metric that applies to a journey.
   */
  getJourneyDateRangeKpi(callback?: (err: AWSError, data: Pinpoint.Types.GetJourneyDateRangeKpiResponse) => void): Request<Pinpoint.Types.GetJourneyDateRangeKpiResponse, AWSError>;
  /**
   * Retrieves (queries) pre-aggregated data for a standard execution metric that applies to a journey activity.
   */
  getJourneyExecutionActivityMetrics(params: Pinpoint.Types.GetJourneyExecutionActivityMetricsRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetJourneyExecutionActivityMetricsResponse) => void): Request<Pinpoint.Types.GetJourneyExecutionActivityMetricsResponse, AWSError>;
  /**
   * Retrieves (queries) pre-aggregated data for a standard execution metric that applies to a journey activity.
   */
  getJourneyExecutionActivityMetrics(callback?: (err: AWSError, data: Pinpoint.Types.GetJourneyExecutionActivityMetricsResponse) => void): Request<Pinpoint.Types.GetJourneyExecutionActivityMetricsResponse, AWSError>;
  /**
   * Retrieves (queries) pre-aggregated data for a standard execution metric that applies to a journey.
   */
  getJourneyExecutionMetrics(params: Pinpoint.Types.GetJourneyExecutionMetricsRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetJourneyExecutionMetricsResponse) => void): Request<Pinpoint.Types.GetJourneyExecutionMetricsResponse, AWSError>;
  /**
   * Retrieves (queries) pre-aggregated data for a standard execution metric that applies to a journey.
   */
  getJourneyExecutionMetrics(callback?: (err: AWSError, data: Pinpoint.Types.GetJourneyExecutionMetricsResponse) => void): Request<Pinpoint.Types.GetJourneyExecutionMetricsResponse, AWSError>;
  /**
   * Retrieves the content and settings of a message template for messages that are sent through a push notification channel.
   */
  getPushTemplate(params: Pinpoint.Types.GetPushTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetPushTemplateResponse) => void): Request<Pinpoint.Types.GetPushTemplateResponse, AWSError>;
  /**
   * Retrieves the content and settings of a message template for messages that are sent through a push notification channel.
   */
  getPushTemplate(callback?: (err: AWSError, data: Pinpoint.Types.GetPushTemplateResponse) => void): Request<Pinpoint.Types.GetPushTemplateResponse, AWSError>;
  /**
   * Retrieves information about an Amazon Pinpoint configuration for a recommender model.
   */
  getRecommenderConfiguration(params: Pinpoint.Types.GetRecommenderConfigurationRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetRecommenderConfigurationResponse) => void): Request<Pinpoint.Types.GetRecommenderConfigurationResponse, AWSError>;
  /**
   * Retrieves information about an Amazon Pinpoint configuration for a recommender model.
   */
  getRecommenderConfiguration(callback?: (err: AWSError, data: Pinpoint.Types.GetRecommenderConfigurationResponse) => void): Request<Pinpoint.Types.GetRecommenderConfigurationResponse, AWSError>;
  /**
   * Retrieves information about all the recommender model configurations that are associated with your Amazon Pinpoint account.
   */
  getRecommenderConfigurations(params: Pinpoint.Types.GetRecommenderConfigurationsRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetRecommenderConfigurationsResponse) => void): Request<Pinpoint.Types.GetRecommenderConfigurationsResponse, AWSError>;
  /**
   * Retrieves information about all the recommender model configurations that are associated with your Amazon Pinpoint account.
   */
  getRecommenderConfigurations(callback?: (err: AWSError, data: Pinpoint.Types.GetRecommenderConfigurationsResponse) => void): Request<Pinpoint.Types.GetRecommenderConfigurationsResponse, AWSError>;
  /**
   * Retrieves information about the configuration, dimension, and other settings for a specific segment that's associated with an application.
   */
  getSegment(params: Pinpoint.Types.GetSegmentRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetSegmentResponse) => void): Request<Pinpoint.Types.GetSegmentResponse, AWSError>;
  /**
   * Retrieves information about the configuration, dimension, and other settings for a specific segment that's associated with an application.
   */
  getSegment(callback?: (err: AWSError, data: Pinpoint.Types.GetSegmentResponse) => void): Request<Pinpoint.Types.GetSegmentResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the export jobs for a segment.
   */
  getSegmentExportJobs(params: Pinpoint.Types.GetSegmentExportJobsRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetSegmentExportJobsResponse) => void): Request<Pinpoint.Types.GetSegmentExportJobsResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the export jobs for a segment.
   */
  getSegmentExportJobs(callback?: (err: AWSError, data: Pinpoint.Types.GetSegmentExportJobsResponse) => void): Request<Pinpoint.Types.GetSegmentExportJobsResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the import jobs for a segment.
   */
  getSegmentImportJobs(params: Pinpoint.Types.GetSegmentImportJobsRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetSegmentImportJobsResponse) => void): Request<Pinpoint.Types.GetSegmentImportJobsResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the import jobs for a segment.
   */
  getSegmentImportJobs(callback?: (err: AWSError, data: Pinpoint.Types.GetSegmentImportJobsResponse) => void): Request<Pinpoint.Types.GetSegmentImportJobsResponse, AWSError>;
  /**
   * Retrieves information about the configuration, dimension, and other settings for a specific version of a segment that's associated with an application.
   */
  getSegmentVersion(params: Pinpoint.Types.GetSegmentVersionRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetSegmentVersionResponse) => void): Request<Pinpoint.Types.GetSegmentVersionResponse, AWSError>;
  /**
   * Retrieves information about the configuration, dimension, and other settings for a specific version of a segment that's associated with an application.
   */
  getSegmentVersion(callback?: (err: AWSError, data: Pinpoint.Types.GetSegmentVersionResponse) => void): Request<Pinpoint.Types.GetSegmentVersionResponse, AWSError>;
  /**
   * Retrieves information about the configuration, dimension, and other settings for all the versions of a specific segment that's associated with an application.
   */
  getSegmentVersions(params: Pinpoint.Types.GetSegmentVersionsRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetSegmentVersionsResponse) => void): Request<Pinpoint.Types.GetSegmentVersionsResponse, AWSError>;
  /**
   * Retrieves information about the configuration, dimension, and other settings for all the versions of a specific segment that's associated with an application.
   */
  getSegmentVersions(callback?: (err: AWSError, data: Pinpoint.Types.GetSegmentVersionsResponse) => void): Request<Pinpoint.Types.GetSegmentVersionsResponse, AWSError>;
  /**
   * Retrieves information about the configuration, dimension, and other settings for all the segments that are associated with an application.
   */
  getSegments(params: Pinpoint.Types.GetSegmentsRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetSegmentsResponse) => void): Request<Pinpoint.Types.GetSegmentsResponse, AWSError>;
  /**
   * Retrieves information about the configuration, dimension, and other settings for all the segments that are associated with an application.
   */
  getSegments(callback?: (err: AWSError, data: Pinpoint.Types.GetSegmentsResponse) => void): Request<Pinpoint.Types.GetSegmentsResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the SMS channel for an application.
   */
  getSmsChannel(params: Pinpoint.Types.GetSmsChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetSmsChannelResponse) => void): Request<Pinpoint.Types.GetSmsChannelResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the SMS channel for an application.
   */
  getSmsChannel(callback?: (err: AWSError, data: Pinpoint.Types.GetSmsChannelResponse) => void): Request<Pinpoint.Types.GetSmsChannelResponse, AWSError>;
  /**
   * Retrieves the content and settings of a message template for messages that are sent through the SMS channel.
   */
  getSmsTemplate(params: Pinpoint.Types.GetSmsTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetSmsTemplateResponse) => void): Request<Pinpoint.Types.GetSmsTemplateResponse, AWSError>;
  /**
   * Retrieves the content and settings of a message template for messages that are sent through the SMS channel.
   */
  getSmsTemplate(callback?: (err: AWSError, data: Pinpoint.Types.GetSmsTemplateResponse) => void): Request<Pinpoint.Types.GetSmsTemplateResponse, AWSError>;
  /**
   * Retrieves information about all the endpoints that are associated with a specific user ID.
   */
  getUserEndpoints(params: Pinpoint.Types.GetUserEndpointsRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetUserEndpointsResponse) => void): Request<Pinpoint.Types.GetUserEndpointsResponse, AWSError>;
  /**
   * Retrieves information about all the endpoints that are associated with a specific user ID.
   */
  getUserEndpoints(callback?: (err: AWSError, data: Pinpoint.Types.GetUserEndpointsResponse) => void): Request<Pinpoint.Types.GetUserEndpointsResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the voice channel for an application.
   */
  getVoiceChannel(params: Pinpoint.Types.GetVoiceChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetVoiceChannelResponse) => void): Request<Pinpoint.Types.GetVoiceChannelResponse, AWSError>;
  /**
   * Retrieves information about the status and settings of the voice channel for an application.
   */
  getVoiceChannel(callback?: (err: AWSError, data: Pinpoint.Types.GetVoiceChannelResponse) => void): Request<Pinpoint.Types.GetVoiceChannelResponse, AWSError>;
  /**
   * Retrieves the content and settings of a message template for messages that are sent through the voice channel.
   */
  getVoiceTemplate(params: Pinpoint.Types.GetVoiceTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.GetVoiceTemplateResponse) => void): Request<Pinpoint.Types.GetVoiceTemplateResponse, AWSError>;
  /**
   * Retrieves the content and settings of a message template for messages that are sent through the voice channel.
   */
  getVoiceTemplate(callback?: (err: AWSError, data: Pinpoint.Types.GetVoiceTemplateResponse) => void): Request<Pinpoint.Types.GetVoiceTemplateResponse, AWSError>;
  /**
   * Retrieves information about the status, configuration, and other settings for all the journeys that are associated with an application.
   */
  listJourneys(params: Pinpoint.Types.ListJourneysRequest, callback?: (err: AWSError, data: Pinpoint.Types.ListJourneysResponse) => void): Request<Pinpoint.Types.ListJourneysResponse, AWSError>;
  /**
   * Retrieves information about the status, configuration, and other settings for all the journeys that are associated with an application.
   */
  listJourneys(callback?: (err: AWSError, data: Pinpoint.Types.ListJourneysResponse) => void): Request<Pinpoint.Types.ListJourneysResponse, AWSError>;
  /**
   * Retrieves all the tags (keys and values) that are associated with an application, campaign, message template, or segment.
   */
  listTagsForResource(params: Pinpoint.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Pinpoint.Types.ListTagsForResourceResponse) => void): Request<Pinpoint.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves all the tags (keys and values) that are associated with an application, campaign, message template, or segment.
   */
  listTagsForResource(callback?: (err: AWSError, data: Pinpoint.Types.ListTagsForResourceResponse) => void): Request<Pinpoint.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves information about all the versions of a specific message template.
   */
  listTemplateVersions(params: Pinpoint.Types.ListTemplateVersionsRequest, callback?: (err: AWSError, data: Pinpoint.Types.ListTemplateVersionsResponse) => void): Request<Pinpoint.Types.ListTemplateVersionsResponse, AWSError>;
  /**
   * Retrieves information about all the versions of a specific message template.
   */
  listTemplateVersions(callback?: (err: AWSError, data: Pinpoint.Types.ListTemplateVersionsResponse) => void): Request<Pinpoint.Types.ListTemplateVersionsResponse, AWSError>;
  /**
   * Retrieves information about all the message templates that are associated with your Amazon Pinpoint account.
   */
  listTemplates(params: Pinpoint.Types.ListTemplatesRequest, callback?: (err: AWSError, data: Pinpoint.Types.ListTemplatesResponse) => void): Request<Pinpoint.Types.ListTemplatesResponse, AWSError>;
  /**
   * Retrieves information about all the message templates that are associated with your Amazon Pinpoint account.
   */
  listTemplates(callback?: (err: AWSError, data: Pinpoint.Types.ListTemplatesResponse) => void): Request<Pinpoint.Types.ListTemplatesResponse, AWSError>;
  /**
   * Retrieves information about a phone number.
   */
  phoneNumberValidate(params: Pinpoint.Types.PhoneNumberValidateRequest, callback?: (err: AWSError, data: Pinpoint.Types.PhoneNumberValidateResponse) => void): Request<Pinpoint.Types.PhoneNumberValidateResponse, AWSError>;
  /**
   * Retrieves information about a phone number.
   */
  phoneNumberValidate(callback?: (err: AWSError, data: Pinpoint.Types.PhoneNumberValidateResponse) => void): Request<Pinpoint.Types.PhoneNumberValidateResponse, AWSError>;
  /**
   * Creates a new event stream for an application or updates the settings of an existing event stream for an application.
   */
  putEventStream(params: Pinpoint.Types.PutEventStreamRequest, callback?: (err: AWSError, data: Pinpoint.Types.PutEventStreamResponse) => void): Request<Pinpoint.Types.PutEventStreamResponse, AWSError>;
  /**
   * Creates a new event stream for an application or updates the settings of an existing event stream for an application.
   */
  putEventStream(callback?: (err: AWSError, data: Pinpoint.Types.PutEventStreamResponse) => void): Request<Pinpoint.Types.PutEventStreamResponse, AWSError>;
  /**
   * Creates a new event to record for endpoints, or creates or updates endpoint data that existing events are associated with.
   */
  putEvents(params: Pinpoint.Types.PutEventsRequest, callback?: (err: AWSError, data: Pinpoint.Types.PutEventsResponse) => void): Request<Pinpoint.Types.PutEventsResponse, AWSError>;
  /**
   * Creates a new event to record for endpoints, or creates or updates endpoint data that existing events are associated with.
   */
  putEvents(callback?: (err: AWSError, data: Pinpoint.Types.PutEventsResponse) => void): Request<Pinpoint.Types.PutEventsResponse, AWSError>;
  /**
   * Removes one or more attributes, of the same attribute type, from all the endpoints that are associated with an application.
   */
  removeAttributes(params: Pinpoint.Types.RemoveAttributesRequest, callback?: (err: AWSError, data: Pinpoint.Types.RemoveAttributesResponse) => void): Request<Pinpoint.Types.RemoveAttributesResponse, AWSError>;
  /**
   * Removes one or more attributes, of the same attribute type, from all the endpoints that are associated with an application.
   */
  removeAttributes(callback?: (err: AWSError, data: Pinpoint.Types.RemoveAttributesResponse) => void): Request<Pinpoint.Types.RemoveAttributesResponse, AWSError>;
  /**
   * Creates and sends a direct message.
   */
  sendMessages(params: Pinpoint.Types.SendMessagesRequest, callback?: (err: AWSError, data: Pinpoint.Types.SendMessagesResponse) => void): Request<Pinpoint.Types.SendMessagesResponse, AWSError>;
  /**
   * Creates and sends a direct message.
   */
  sendMessages(callback?: (err: AWSError, data: Pinpoint.Types.SendMessagesResponse) => void): Request<Pinpoint.Types.SendMessagesResponse, AWSError>;
  /**
   * Creates and sends a message to a list of users.
   */
  sendUsersMessages(params: Pinpoint.Types.SendUsersMessagesRequest, callback?: (err: AWSError, data: Pinpoint.Types.SendUsersMessagesResponse) => void): Request<Pinpoint.Types.SendUsersMessagesResponse, AWSError>;
  /**
   * Creates and sends a message to a list of users.
   */
  sendUsersMessages(callback?: (err: AWSError, data: Pinpoint.Types.SendUsersMessagesResponse) => void): Request<Pinpoint.Types.SendUsersMessagesResponse, AWSError>;
  /**
   * Adds one or more tags (keys and values) to an application, campaign, message template, or segment.
   */
  tagResource(params: Pinpoint.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds one or more tags (keys and values) to an application, campaign, message template, or segment.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes one or more tags (keys and values) from an application, campaign, message template, or segment.
   */
  untagResource(params: Pinpoint.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes one or more tags (keys and values) from an application, campaign, message template, or segment.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables the ADM channel for an application or updates the status and settings of the ADM channel for an application.
   */
  updateAdmChannel(params: Pinpoint.Types.UpdateAdmChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateAdmChannelResponse) => void): Request<Pinpoint.Types.UpdateAdmChannelResponse, AWSError>;
  /**
   * Enables the ADM channel for an application or updates the status and settings of the ADM channel for an application.
   */
  updateAdmChannel(callback?: (err: AWSError, data: Pinpoint.Types.UpdateAdmChannelResponse) => void): Request<Pinpoint.Types.UpdateAdmChannelResponse, AWSError>;
  /**
   * Enables the APNs channel for an application or updates the status and settings of the APNs channel for an application.
   */
  updateApnsChannel(params: Pinpoint.Types.UpdateApnsChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateApnsChannelResponse) => void): Request<Pinpoint.Types.UpdateApnsChannelResponse, AWSError>;
  /**
   * Enables the APNs channel for an application or updates the status and settings of the APNs channel for an application.
   */
  updateApnsChannel(callback?: (err: AWSError, data: Pinpoint.Types.UpdateApnsChannelResponse) => void): Request<Pinpoint.Types.UpdateApnsChannelResponse, AWSError>;
  /**
   * Enables the APNs sandbox channel for an application or updates the status and settings of the APNs sandbox channel for an application.
   */
  updateApnsSandboxChannel(params: Pinpoint.Types.UpdateApnsSandboxChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateApnsSandboxChannelResponse) => void): Request<Pinpoint.Types.UpdateApnsSandboxChannelResponse, AWSError>;
  /**
   * Enables the APNs sandbox channel for an application or updates the status and settings of the APNs sandbox channel for an application.
   */
  updateApnsSandboxChannel(callback?: (err: AWSError, data: Pinpoint.Types.UpdateApnsSandboxChannelResponse) => void): Request<Pinpoint.Types.UpdateApnsSandboxChannelResponse, AWSError>;
  /**
   * Enables the APNs VoIP channel for an application or updates the status and settings of the APNs VoIP channel for an application.
   */
  updateApnsVoipChannel(params: Pinpoint.Types.UpdateApnsVoipChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateApnsVoipChannelResponse) => void): Request<Pinpoint.Types.UpdateApnsVoipChannelResponse, AWSError>;
  /**
   * Enables the APNs VoIP channel for an application or updates the status and settings of the APNs VoIP channel for an application.
   */
  updateApnsVoipChannel(callback?: (err: AWSError, data: Pinpoint.Types.UpdateApnsVoipChannelResponse) => void): Request<Pinpoint.Types.UpdateApnsVoipChannelResponse, AWSError>;
  /**
   * Enables the APNs VoIP sandbox channel for an application or updates the status and settings of the APNs VoIP sandbox channel for an application.
   */
  updateApnsVoipSandboxChannel(params: Pinpoint.Types.UpdateApnsVoipSandboxChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateApnsVoipSandboxChannelResponse) => void): Request<Pinpoint.Types.UpdateApnsVoipSandboxChannelResponse, AWSError>;
  /**
   * Enables the APNs VoIP sandbox channel for an application or updates the status and settings of the APNs VoIP sandbox channel for an application.
   */
  updateApnsVoipSandboxChannel(callback?: (err: AWSError, data: Pinpoint.Types.UpdateApnsVoipSandboxChannelResponse) => void): Request<Pinpoint.Types.UpdateApnsVoipSandboxChannelResponse, AWSError>;
  /**
   * Updates the settings for an application.
   */
  updateApplicationSettings(params: Pinpoint.Types.UpdateApplicationSettingsRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateApplicationSettingsResponse) => void): Request<Pinpoint.Types.UpdateApplicationSettingsResponse, AWSError>;
  /**
   * Updates the settings for an application.
   */
  updateApplicationSettings(callback?: (err: AWSError, data: Pinpoint.Types.UpdateApplicationSettingsResponse) => void): Request<Pinpoint.Types.UpdateApplicationSettingsResponse, AWSError>;
  /**
   * Enables the Baidu channel for an application or updates the status and settings of the Baidu channel for an application.
   */
  updateBaiduChannel(params: Pinpoint.Types.UpdateBaiduChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateBaiduChannelResponse) => void): Request<Pinpoint.Types.UpdateBaiduChannelResponse, AWSError>;
  /**
   * Enables the Baidu channel for an application or updates the status and settings of the Baidu channel for an application.
   */
  updateBaiduChannel(callback?: (err: AWSError, data: Pinpoint.Types.UpdateBaiduChannelResponse) => void): Request<Pinpoint.Types.UpdateBaiduChannelResponse, AWSError>;
  /**
   * Updates the configuration and other settings for a campaign.
   */
  updateCampaign(params: Pinpoint.Types.UpdateCampaignRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateCampaignResponse) => void): Request<Pinpoint.Types.UpdateCampaignResponse, AWSError>;
  /**
   * Updates the configuration and other settings for a campaign.
   */
  updateCampaign(callback?: (err: AWSError, data: Pinpoint.Types.UpdateCampaignResponse) => void): Request<Pinpoint.Types.UpdateCampaignResponse, AWSError>;
  /**
   * Enables the email channel for an application or updates the status and settings of the email channel for an application.
   */
  updateEmailChannel(params: Pinpoint.Types.UpdateEmailChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateEmailChannelResponse) => void): Request<Pinpoint.Types.UpdateEmailChannelResponse, AWSError>;
  /**
   * Enables the email channel for an application or updates the status and settings of the email channel for an application.
   */
  updateEmailChannel(callback?: (err: AWSError, data: Pinpoint.Types.UpdateEmailChannelResponse) => void): Request<Pinpoint.Types.UpdateEmailChannelResponse, AWSError>;
  /**
   * Updates an existing message template for messages that are sent through the email channel.
   */
  updateEmailTemplate(params: Pinpoint.Types.UpdateEmailTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateEmailTemplateResponse) => void): Request<Pinpoint.Types.UpdateEmailTemplateResponse, AWSError>;
  /**
   * Updates an existing message template for messages that are sent through the email channel.
   */
  updateEmailTemplate(callback?: (err: AWSError, data: Pinpoint.Types.UpdateEmailTemplateResponse) => void): Request<Pinpoint.Types.UpdateEmailTemplateResponse, AWSError>;
  /**
   * Creates a new endpoint for an application or updates the settings and attributes of an existing endpoint for an application. You can also use this operation to define custom attributes for an endpoint. If an update includes one or more values for a custom attribute, Amazon Pinpoint replaces (overwrites) any existing values with the new values.
   */
  updateEndpoint(params: Pinpoint.Types.UpdateEndpointRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateEndpointResponse) => void): Request<Pinpoint.Types.UpdateEndpointResponse, AWSError>;
  /**
   * Creates a new endpoint for an application or updates the settings and attributes of an existing endpoint for an application. You can also use this operation to define custom attributes for an endpoint. If an update includes one or more values for a custom attribute, Amazon Pinpoint replaces (overwrites) any existing values with the new values.
   */
  updateEndpoint(callback?: (err: AWSError, data: Pinpoint.Types.UpdateEndpointResponse) => void): Request<Pinpoint.Types.UpdateEndpointResponse, AWSError>;
  /**
   * Creates a new batch of endpoints for an application or updates the settings and attributes of a batch of existing endpoints for an application. You can also use this operation to define custom attributes for a batch of endpoints. If an update includes one or more values for a custom attribute, Amazon Pinpoint replaces (overwrites) any existing values with the new values.
   */
  updateEndpointsBatch(params: Pinpoint.Types.UpdateEndpointsBatchRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateEndpointsBatchResponse) => void): Request<Pinpoint.Types.UpdateEndpointsBatchResponse, AWSError>;
  /**
   * Creates a new batch of endpoints for an application or updates the settings and attributes of a batch of existing endpoints for an application. You can also use this operation to define custom attributes for a batch of endpoints. If an update includes one or more values for a custom attribute, Amazon Pinpoint replaces (overwrites) any existing values with the new values.
   */
  updateEndpointsBatch(callback?: (err: AWSError, data: Pinpoint.Types.UpdateEndpointsBatchResponse) => void): Request<Pinpoint.Types.UpdateEndpointsBatchResponse, AWSError>;
  /**
   * Enables the GCM channel for an application or updates the status and settings of the GCM channel for an application.
   */
  updateGcmChannel(params: Pinpoint.Types.UpdateGcmChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateGcmChannelResponse) => void): Request<Pinpoint.Types.UpdateGcmChannelResponse, AWSError>;
  /**
   * Enables the GCM channel for an application or updates the status and settings of the GCM channel for an application.
   */
  updateGcmChannel(callback?: (err: AWSError, data: Pinpoint.Types.UpdateGcmChannelResponse) => void): Request<Pinpoint.Types.UpdateGcmChannelResponse, AWSError>;
  /**
   * Updates an existing message template for messages sent through the in-app message channel.
   */
  updateInAppTemplate(params: Pinpoint.Types.UpdateInAppTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateInAppTemplateResponse) => void): Request<Pinpoint.Types.UpdateInAppTemplateResponse, AWSError>;
  /**
   * Updates an existing message template for messages sent through the in-app message channel.
   */
  updateInAppTemplate(callback?: (err: AWSError, data: Pinpoint.Types.UpdateInAppTemplateResponse) => void): Request<Pinpoint.Types.UpdateInAppTemplateResponse, AWSError>;
  /**
   * Updates the configuration and other settings for a journey.
   */
  updateJourney(params: Pinpoint.Types.UpdateJourneyRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateJourneyResponse) => void): Request<Pinpoint.Types.UpdateJourneyResponse, AWSError>;
  /**
   * Updates the configuration and other settings for a journey.
   */
  updateJourney(callback?: (err: AWSError, data: Pinpoint.Types.UpdateJourneyResponse) => void): Request<Pinpoint.Types.UpdateJourneyResponse, AWSError>;
  /**
   * Cancels (stops) an active journey.
   */
  updateJourneyState(params: Pinpoint.Types.UpdateJourneyStateRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateJourneyStateResponse) => void): Request<Pinpoint.Types.UpdateJourneyStateResponse, AWSError>;
  /**
   * Cancels (stops) an active journey.
   */
  updateJourneyState(callback?: (err: AWSError, data: Pinpoint.Types.UpdateJourneyStateResponse) => void): Request<Pinpoint.Types.UpdateJourneyStateResponse, AWSError>;
  /**
   * Updates an existing message template for messages that are sent through a push notification channel.
   */
  updatePushTemplate(params: Pinpoint.Types.UpdatePushTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdatePushTemplateResponse) => void): Request<Pinpoint.Types.UpdatePushTemplateResponse, AWSError>;
  /**
   * Updates an existing message template for messages that are sent through a push notification channel.
   */
  updatePushTemplate(callback?: (err: AWSError, data: Pinpoint.Types.UpdatePushTemplateResponse) => void): Request<Pinpoint.Types.UpdatePushTemplateResponse, AWSError>;
  /**
   * Updates an Amazon Pinpoint configuration for a recommender model.
   */
  updateRecommenderConfiguration(params: Pinpoint.Types.UpdateRecommenderConfigurationRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateRecommenderConfigurationResponse) => void): Request<Pinpoint.Types.UpdateRecommenderConfigurationResponse, AWSError>;
  /**
   * Updates an Amazon Pinpoint configuration for a recommender model.
   */
  updateRecommenderConfiguration(callback?: (err: AWSError, data: Pinpoint.Types.UpdateRecommenderConfigurationResponse) => void): Request<Pinpoint.Types.UpdateRecommenderConfigurationResponse, AWSError>;
  /**
   * Creates a new segment for an application or updates the configuration, dimension, and other settings for an existing segment that's associated with an application.
   */
  updateSegment(params: Pinpoint.Types.UpdateSegmentRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateSegmentResponse) => void): Request<Pinpoint.Types.UpdateSegmentResponse, AWSError>;
  /**
   * Creates a new segment for an application or updates the configuration, dimension, and other settings for an existing segment that's associated with an application.
   */
  updateSegment(callback?: (err: AWSError, data: Pinpoint.Types.UpdateSegmentResponse) => void): Request<Pinpoint.Types.UpdateSegmentResponse, AWSError>;
  /**
   * Enables the SMS channel for an application or updates the status and settings of the SMS channel for an application.
   */
  updateSmsChannel(params: Pinpoint.Types.UpdateSmsChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateSmsChannelResponse) => void): Request<Pinpoint.Types.UpdateSmsChannelResponse, AWSError>;
  /**
   * Enables the SMS channel for an application or updates the status and settings of the SMS channel for an application.
   */
  updateSmsChannel(callback?: (err: AWSError, data: Pinpoint.Types.UpdateSmsChannelResponse) => void): Request<Pinpoint.Types.UpdateSmsChannelResponse, AWSError>;
  /**
   * Updates an existing message template for messages that are sent through the SMS channel.
   */
  updateSmsTemplate(params: Pinpoint.Types.UpdateSmsTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateSmsTemplateResponse) => void): Request<Pinpoint.Types.UpdateSmsTemplateResponse, AWSError>;
  /**
   * Updates an existing message template for messages that are sent through the SMS channel.
   */
  updateSmsTemplate(callback?: (err: AWSError, data: Pinpoint.Types.UpdateSmsTemplateResponse) => void): Request<Pinpoint.Types.UpdateSmsTemplateResponse, AWSError>;
  /**
   * Changes the status of a specific version of a message template to active.
   */
  updateTemplateActiveVersion(params: Pinpoint.Types.UpdateTemplateActiveVersionRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateTemplateActiveVersionResponse) => void): Request<Pinpoint.Types.UpdateTemplateActiveVersionResponse, AWSError>;
  /**
   * Changes the status of a specific version of a message template to active.
   */
  updateTemplateActiveVersion(callback?: (err: AWSError, data: Pinpoint.Types.UpdateTemplateActiveVersionResponse) => void): Request<Pinpoint.Types.UpdateTemplateActiveVersionResponse, AWSError>;
  /**
   * Enables the voice channel for an application or updates the status and settings of the voice channel for an application.
   */
  updateVoiceChannel(params: Pinpoint.Types.UpdateVoiceChannelRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateVoiceChannelResponse) => void): Request<Pinpoint.Types.UpdateVoiceChannelResponse, AWSError>;
  /**
   * Enables the voice channel for an application or updates the status and settings of the voice channel for an application.
   */
  updateVoiceChannel(callback?: (err: AWSError, data: Pinpoint.Types.UpdateVoiceChannelResponse) => void): Request<Pinpoint.Types.UpdateVoiceChannelResponse, AWSError>;
  /**
   * Updates an existing message template for messages that are sent through the voice channel.
   */
  updateVoiceTemplate(params: Pinpoint.Types.UpdateVoiceTemplateRequest, callback?: (err: AWSError, data: Pinpoint.Types.UpdateVoiceTemplateResponse) => void): Request<Pinpoint.Types.UpdateVoiceTemplateResponse, AWSError>;
  /**
   * Updates an existing message template for messages that are sent through the voice channel.
   */
  updateVoiceTemplate(callback?: (err: AWSError, data: Pinpoint.Types.UpdateVoiceTemplateResponse) => void): Request<Pinpoint.Types.UpdateVoiceTemplateResponse, AWSError>;
}
declare namespace Pinpoint {
  export interface ADMChannelRequest {
    /**
     * The Client ID that you received from Amazon to send messages by using ADM.
     */
    ClientId: __string;
    /**
     * The Client Secret that you received from Amazon to send messages by using ADM.
     */
    ClientSecret: __string;
    /**
     * Specifies whether to enable the ADM channel for the application.
     */
    Enabled?: __boolean;
  }
  export interface ADMChannelResponse {
    /**
     * The unique identifier for the application that the ADM channel applies to.
     */
    ApplicationId?: __string;
    /**
     * The date and time when the ADM channel was enabled.
     */
    CreationDate?: __string;
    /**
     * Specifies whether the ADM channel is enabled for the application.
     */
    Enabled?: __boolean;
    /**
     * (Not used) This property is retained only for backward compatibility.
     */
    HasCredential?: __boolean;
    /**
     * (Deprecated) An identifier for the ADM channel. This property is retained only for backward compatibility.
     */
    Id?: __string;
    /**
     * Specifies whether the ADM channel is archived.
     */
    IsArchived?: __boolean;
    /**
     * The user who last modified the ADM channel.
     */
    LastModifiedBy?: __string;
    /**
     * The date and time when the ADM channel was last modified.
     */
    LastModifiedDate?: __string;
    /**
     * The type of messaging or notification platform for the channel. For the ADM channel, this value is ADM.
     */
    Platform: __string;
    /**
     * The current version of the ADM channel.
     */
    Version?: __integer;
  }
  export interface ADMMessage {
    /**
     * The action to occur if the recipient taps the push notification. Valid values are: OPEN_APP - Your app opens or it becomes the foreground app if it was sent to the background. This is the default action. DEEP_LINK - Your app opens and displays a designated user interface in the app. This action uses the deep-linking features of the Android platform. URL - The default mobile browser on the recipient's device opens and loads the web page at a URL that you specify.
     */
    Action?: Action;
    /**
     * The body of the notification message.
     */
    Body?: __string;
    /**
     * An arbitrary string that indicates that multiple messages are logically the same and that Amazon Device Messaging (ADM) can drop previously enqueued messages in favor of this message.
     */
    ConsolidationKey?: __string;
    /**
     * The JSON data payload to use for the push notification, if the notification is a silent push notification. This payload is added to the data.pinpoint.jsonBody object of the notification.
     */
    Data?: MapOf__string;
    /**
     * The amount of time, in seconds, that ADM should store the message if the recipient's device is offline. Amazon Pinpoint specifies this value in the expiresAfter parameter when it sends the notification message to ADM.
     */
    ExpiresAfter?: __string;
    /**
     * The icon image name of the asset saved in your app.
     */
    IconReference?: __string;
    /**
     * The URL of the large icon image to display in the content view of the push notification.
     */
    ImageIconUrl?: __string;
    /**
     * The URL of an image to display in the push notification.
     */
    ImageUrl?: __string;
    /**
     * The base64-encoded, MD5 checksum of the value specified by the Data property. ADM uses the MD5 value to verify the integrity of the data.
     */
    MD5?: __string;
    /**
     * The raw, JSON-formatted string to use as the payload for the notification message. If specified, this value overrides all other content for the message.
     */
    RawContent?: __string;
    /**
     * Specifies whether the notification is a silent push notification, which is a push notification that doesn't display on a recipient's device. Silent push notifications can be used for cases such as updating an app's configuration or supporting phone home functionality.
     */
    SilentPush?: __boolean;
    /**
     * The URL of the small icon image to display in the status bar and the content view of the push notification.
     */
    SmallImageIconUrl?: __string;
    /**
     * The sound to play when the recipient receives the push notification. You can use the default stream or specify the file name of a sound resource that's bundled in your app. On an Android platform, the sound file must reside in /res/raw/.
     */
    Sound?: __string;
    /**
     * The default message variables to use in the notification message. You can override the default variables with individual address variables.
     */
    Substitutions?: MapOfListOf__string;
    /**
     * The title to display above the notification message on the recipient's device.
     */
    Title?: __string;
    /**
     * The URL to open in the recipient's default mobile browser, if a recipient taps the push notification and the value of the Action property is URL.
     */
    Url?: __string;
  }
  export interface APNSChannelRequest {
    /**
     * The bundle identifier that's assigned to your iOS app. This identifier is used for APNs tokens.
     */
    BundleId?: __string;
    /**
     * The APNs client certificate that you received from Apple, if you want Amazon Pinpoint to communicate with APNs by using an APNs certificate.
     */
    Certificate?: __string;
    /**
     * The default authentication method that you want Amazon Pinpoint to use when authenticating with APNs, key or certificate.
     */
    DefaultAuthenticationMethod?: __string;
    /**
     * Specifies whether to enable the APNs channel for the application.
     */
    Enabled?: __boolean;
    /**
     * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with APNs.
     */
    PrivateKey?: __string;
    /**
     * The identifier that's assigned to your Apple developer account team. This identifier is used for APNs tokens.
     */
    TeamId?: __string;
    /**
     * The authentication key to use for APNs tokens.
     */
    TokenKey?: __string;
    /**
     * The key identifier that's assigned to your APNs signing key, if you want Amazon Pinpoint to communicate with APNs by using APNs tokens.
     */
    TokenKeyId?: __string;
  }
  export interface APNSChannelResponse {
    /**
     * The unique identifier for the application that the APNs channel applies to.
     */
    ApplicationId?: __string;
    /**
     * The date and time when the APNs channel was enabled.
     */
    CreationDate?: __string;
    /**
     * The default authentication method that Amazon Pinpoint uses to authenticate with APNs for this channel, key or certificate.
     */
    DefaultAuthenticationMethod?: __string;
    /**
     * Specifies whether the APNs channel is enabled for the application.
     */
    Enabled?: __boolean;
    /**
     * (Not used) This property is retained only for backward compatibility.
     */
    HasCredential?: __boolean;
    /**
     * Specifies whether the APNs channel is configured to communicate with APNs by using APNs tokens. To provide an authentication key for APNs tokens, set the TokenKey property of the channel.
     */
    HasTokenKey?: __boolean;
    /**
     * (Deprecated) An identifier for the APNs channel. This property is retained only for backward compatibility.
     */
    Id?: __string;
    /**
     * Specifies whether the APNs channel is archived.
     */
    IsArchived?: __boolean;
    /**
     * The user who last modified the APNs channel.
     */
    LastModifiedBy?: __string;
    /**
     * The date and time when the APNs channel was last modified.
     */
    LastModifiedDate?: __string;
    /**
     *  The type of messaging or notification platform for the channel. For the APNs channel, this value is APNS.
     */
    Platform: __string;
    /**
     * The current version of the APNs channel.
     */
    Version?: __integer;
  }
  export interface APNSMessage {
    /**
     * The type of push notification to send. Valid values are: alert - For a standard notification that's displayed on recipients' devices and prompts a recipient to interact with the notification. background - For a silent notification that delivers content in the background and isn't displayed on recipients' devices. complication - For a notification that contains update information for an app’s complication timeline. fileprovider - For a notification that signals changes to a File Provider extension. mdm - For a notification that tells managed devices to contact the MDM server. voip - For a notification that provides information about an incoming VoIP call. Amazon Pinpoint specifies this value in the apns-push-type request header when it sends the notification message to APNs. If you don't specify a value for this property, Amazon Pinpoint sets the value to alert or background automatically, based on the value that you specify for the SilentPush or RawContent property of the message. For more information about the apns-push-type request header, see Sending Notification Requests to APNs on the Apple Developer website.
     */
    APNSPushType?: __string;
    /**
     * The action to occur if the recipient taps the push notification. Valid values are: OPEN_APP - Your app opens or it becomes the foreground app if it was sent to the background. This is the default action. DEEP_LINK - Your app opens and displays a designated user interface in the app. This setting uses the deep-linking features of the iOS platform. URL - The default mobile browser on the recipient's device opens and loads the web page at a URL that you specify.
     */
    Action?: Action;
    /**
     * The key that indicates whether and how to modify the badge of your app's icon when the recipient receives the push notification. If this key isn't included in the dictionary, the badge doesn't change. To remove the badge, set this value to 0.
     */
    Badge?: __integer;
    /**
     * The body of the notification message.
     */
    Body?: __string;
    /**
     * The key that indicates the notification type for the push notification. This key is a value that's defined by the identifier property of one of your app's registered categories.
     */
    Category?: __string;
    /**
     * An arbitrary identifier that, if assigned to multiple messages, APNs uses to coalesce the messages into a single push notification instead of delivering each message individually. This value can't exceed 64 bytes. Amazon Pinpoint specifies this value in the apns-collapse-id request header when it sends the notification message to APNs.
     */
    CollapseId?: __string;
    /**
     * The JSON payload to use for a silent push notification. This payload is added to the data.pinpoint.jsonBody object of the notification.
     */
    Data?: MapOf__string;
    /**
     * The URL of an image or video to display in the push notification.
     */
    MediaUrl?: __string;
    /**
     * The authentication method that you want Amazon Pinpoint to use when authenticating with APNs, CERTIFICATE or TOKEN.
     */
    PreferredAuthenticationMethod?: __string;
    /**
     * para>5 - Low priority, the notification might be delayed, delivered as part of a group, or throttled./listitem> 10 - High priority, the notification is sent immediately. This is the default value. A high priority notification should trigger an alert, play a sound, or badge your app's icon on the recipient's device./para> Amazon Pinpoint specifies this value in the apns-priority request header when it sends the notification message to APNs. The equivalent values for Firebase Cloud Messaging (FCM), formerly Google Cloud Messaging (GCM), are normal, for 5, and high, for 10. If you specify an FCM value for this property, Amazon Pinpoint accepts and converts the value to the corresponding APNs value.
     */
    Priority?: __string;
    /**
     * The raw, JSON-formatted string to use as the payload for the notification message. If specified, this value overrides all other content for the message. If you specify the raw content of an APNs push notification, the message payload has to include the content-available key. The value of the content-available key has to be an integer, and can only be 0 or 1. If you're sending a standard notification, set the value of content-available to 0. If you're sending a silent (background) notification, set the value of content-available to 1. Additionally, silent notification payloads can't include the alert, badge, or sound keys. For more information, see Generating a Remote Notification and Pushing Background Updates to Your App on the Apple Developer website.
     */
    RawContent?: __string;
    /**
     * Specifies whether the notification is a silent push notification. A silent (or background) push notification isn't displayed on recipients' devices. You can use silent push notifications to make small updates to your app, or to display messages in an in-app message center. Amazon Pinpoint uses this property to determine the correct value for the apns-push-type request header when it sends the notification message to APNs. If you specify a value of true for this property, Amazon Pinpoint sets the value for the apns-push-type header field to background. If you specify the raw content of an APNs push notification, the message payload has to include the content-available key. For silent (background) notifications, set the value of content-available to 1. Additionally, the message payload for a silent notification can't include the alert, badge, or sound keys. For more information, see Generating a Remote Notification and Pushing Background Updates to Your App on the Apple Developer website. Apple has indicated that they will throttle "excessive" background notifications based on current traffic volumes. To prevent your notifications being throttled, Apple recommends that you send no more than 3 silent push notifications to each recipient per hour.
     */
    SilentPush?: __boolean;
    /**
     * The key for the sound to play when the recipient receives the push notification. The value for this key is the name of a sound file in your app's main bundle or the Library/Sounds folder in your app's data container. If the sound file can't be found or you specify default for the value, the system plays the default alert sound.
     */
    Sound?: __string;
    /**
     * The default message variables to use in the notification message. You can override these default variables with individual address variables.
     */
    Substitutions?: MapOfListOf__string;
    /**
     * The key that represents your app-specific identifier for grouping notifications. If you provide a Notification Content app extension, you can use this value to group your notifications together.
     */
    ThreadId?: __string;
    /**
     * The amount of time, in seconds, that APNs should store and attempt to deliver the push notification, if the service is unable to deliver the notification the first time. If this value is 0, APNs treats the notification as if it expires immediately and the service doesn't store or try to deliver the notification again. Amazon Pinpoint specifies this value in the apns-expiration request header when it sends the notification message to APNs.
     */
    TimeToLive?: __integer;
    /**
     * The title to display above the notification message on the recipient's device.
     */
    Title?: __string;
    /**
     * The URL to open in the recipient's default mobile browser, if a recipient taps the push notification and the value of the Action property is URL.
     */
    Url?: __string;
  }
  export interface APNSPushNotificationTemplate {
    /**
     * The action to occur if a recipient taps a push notification that's based on the message template. Valid values are: OPEN_APP - Your app opens or it becomes the foreground app if it was sent to the background. This is the default action. DEEP_LINK - Your app opens and displays a designated user interface in the app. This setting uses the deep-linking features of the iOS platform. URL - The default mobile browser on the recipient's device opens and loads the web page at a URL that you specify.
     */
    Action?: Action;
    /**
     * The message body to use in push notifications that are based on the message template.
     */
    Body?: __string;
    /**
     * The URL of an image or video to display in push notifications that are based on the message template.
     */
    MediaUrl?: __string;
    /**
     * The raw, JSON-formatted string to use as the payload for push notifications that are based on the message template. If specified, this value overrides all other content for the message template.
     */
    RawContent?: __string;
    /**
     * The key for the sound to play when the recipient receives a push notification that's based on the message template. The value for this key is the name of a sound file in your app's main bundle or the Library/Sounds folder in your app's data container. If the sound file can't be found or you specify default for the value, the system plays the default alert sound.
     */
    Sound?: __string;
    /**
     * The title to use in push notifications that are based on the message template. This title appears above the notification message on a recipient's device.
     */
    Title?: __string;
    /**
     * The URL to open in the recipient's default mobile browser, if a recipient taps a push notification that's based on the message template and the value of the Action property is URL.
     */
    Url?: __string;
  }
  export interface APNSSandboxChannelRequest {
    /**
     * The bundle identifier that's assigned to your iOS app. This identifier is used for APNs tokens.
     */
    BundleId?: __string;
    /**
     * The APNs client certificate that you received from Apple, if you want Amazon Pinpoint to communicate with the APNs sandbox environment by using an APNs certificate.
     */
    Certificate?: __string;
    /**
     * The default authentication method that you want Amazon Pinpoint to use when authenticating with the APNs sandbox environment, key or certificate.
     */
    DefaultAuthenticationMethod?: __string;
    /**
     * Specifies whether to enable the APNs sandbox channel for the application.
     */
    Enabled?: __boolean;
    /**
     * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with the APNs sandbox environment.
     */
    PrivateKey?: __string;
    /**
     * The identifier that's assigned to your Apple developer account team. This identifier is used for APNs tokens.
     */
    TeamId?: __string;
    /**
     * The authentication key to use for APNs tokens.
     */
    TokenKey?: __string;
    /**
     * The key identifier that's assigned to your APNs signing key, if you want Amazon Pinpoint to communicate with the APNs sandbox environment by using APNs tokens.
     */
    TokenKeyId?: __string;
  }
  export interface APNSSandboxChannelResponse {
    /**
     * The unique identifier for the application that the APNs sandbox channel applies to.
     */
    ApplicationId?: __string;
    /**
     * The date and time when the APNs sandbox channel was enabled.
     */
    CreationDate?: __string;
    /**
     * The default authentication method that Amazon Pinpoint uses to authenticate with the APNs sandbox environment for this channel, key or certificate.
     */
    DefaultAuthenticationMethod?: __string;
    /**
     * Specifies whether the APNs sandbox channel is enabled for the application.
     */
    Enabled?: __boolean;
    /**
     * (Not used) This property is retained only for backward compatibility.
     */
    HasCredential?: __boolean;
    /**
     * Specifies whether the APNs sandbox channel is configured to communicate with APNs by using APNs tokens. To provide an authentication key for APNs tokens, set the TokenKey property of the channel.
     */
    HasTokenKey?: __boolean;
    /**
     * (Deprecated) An identifier for the APNs sandbox channel. This property is retained only for backward compatibility.
     */
    Id?: __string;
    /**
     * Specifies whether the APNs sandbox channel is archived.
     */
    IsArchived?: __boolean;
    /**
     * The user who last modified the APNs sandbox channel.
     */
    LastModifiedBy?: __string;
    /**
     * The date and time when the APNs sandbox channel was last modified.
     */
    LastModifiedDate?: __string;
    /**
     * The type of messaging or notification platform for the channel. For the APNs sandbox channel, this value is APNS_SANDBOX.
     */
    Platform: __string;
    /**
     * The current version of the APNs sandbox channel.
     */
    Version?: __integer;
  }
  export interface APNSVoipChannelRequest {
    /**
     * The bundle identifier that's assigned to your iOS app. This identifier is used for APNs tokens.
     */
    BundleId?: __string;
    /**
     * The APNs client certificate that you received from Apple, if you want Amazon Pinpoint to communicate with APNs by using an APNs certificate.
     */
    Certificate?: __string;
    /**
     * The default authentication method that you want Amazon Pinpoint to use when authenticating with APNs, key or certificate.
     */
    DefaultAuthenticationMethod?: __string;
    /**
     * Specifies whether to enable the APNs VoIP channel for the application.
     */
    Enabled?: __boolean;
    /**
     * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with APNs.
     */
    PrivateKey?: __string;
    /**
     * The identifier that's assigned to your Apple developer account team. This identifier is used for APNs tokens.
     */
    TeamId?: __string;
    /**
     * The authentication key to use for APNs tokens.
     */
    TokenKey?: __string;
    /**
     * The key identifier that's assigned to your APNs signing key, if you want Amazon Pinpoint to communicate with APNs by using APNs tokens.
     */
    TokenKeyId?: __string;
  }
  export interface APNSVoipChannelResponse {
    /**
     * The unique identifier for the application that the APNs VoIP channel applies to.
     */
    ApplicationId?: __string;
    /**
     * The date and time when the APNs VoIP channel was enabled.
     */
    CreationDate?: __string;
    /**
     * The default authentication method that Amazon Pinpoint uses to authenticate with APNs for this channel, key or certificate.
     */
    DefaultAuthenticationMethod?: __string;
    /**
     * Specifies whether the APNs VoIP channel is enabled for the application.
     */
    Enabled?: __boolean;
    /**
     * (Not used) This property is retained only for backward compatibility.
     */
    HasCredential?: __boolean;
    /**
     * Specifies whether the APNs VoIP channel is configured to communicate with APNs by using APNs tokens. To provide an authentication key for APNs tokens, set the TokenKey property of the channel.
     */
    HasTokenKey?: __boolean;
    /**
     * (Deprecated) An identifier for the APNs VoIP channel. This property is retained only for backward compatibility.
     */
    Id?: __string;
    /**
     * Specifies whether the APNs VoIP channel is archived.
     */
    IsArchived?: __boolean;
    /**
     * The user who last modified the APNs VoIP channel.
     */
    LastModifiedBy?: __string;
    /**
     * The date and time when the APNs VoIP channel was last modified.
     */
    LastModifiedDate?: __string;
    /**
     * The type of messaging or notification platform for the channel. For the APNs VoIP channel, this value is APNS_VOIP.
     */
    Platform: __string;
    /**
     * The current version of the APNs VoIP channel.
     */
    Version?: __integer;
  }
  export interface APNSVoipSandboxChannelRequest {
    /**
     * The bundle identifier that's assigned to your iOS app. This identifier is used for APNs tokens.
     */
    BundleId?: __string;
    /**
     * The APNs client certificate that you received from Apple, if you want Amazon Pinpoint to communicate with the APNs sandbox environment by using an APNs certificate.
     */
    Certificate?: __string;
    /**
     * The default authentication method that you want Amazon Pinpoint to use when authenticating with the APNs sandbox environment for this channel, key or certificate.
     */
    DefaultAuthenticationMethod?: __string;
    /**
     * Specifies whether the APNs VoIP sandbox channel is enabled for the application.
     */
    Enabled?: __boolean;
    /**
     * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with the APNs sandbox environment.
     */
    PrivateKey?: __string;
    /**
     * The identifier that's assigned to your Apple developer account team. This identifier is used for APNs tokens.
     */
    TeamId?: __string;
    /**
     * The authentication key to use for APNs tokens.
     */
    TokenKey?: __string;
    /**
     * The key identifier that's assigned to your APNs signing key, if you want Amazon Pinpoint to communicate with the APNs sandbox environment by using APNs tokens.
     */
    TokenKeyId?: __string;
  }
  export interface APNSVoipSandboxChannelResponse {
    /**
     * The unique identifier for the application that the APNs VoIP sandbox channel applies to.
     */
    ApplicationId?: __string;
    /**
     * The date and time when the APNs VoIP sandbox channel was enabled.
     */
    CreationDate?: __string;
    /**
     * The default authentication method that Amazon Pinpoint uses to authenticate with the APNs sandbox environment for this channel, key or certificate.
     */
    DefaultAuthenticationMethod?: __string;
    /**
     * Specifies whether the APNs VoIP sandbox channel is enabled for the application.
     */
    Enabled?: __boolean;
    /**
     * (Not used) This property is retained only for backward compatibility.
     */
    HasCredential?: __boolean;
    /**
     * Specifies whether the APNs VoIP sandbox channel is configured to communicate with APNs by using APNs tokens. To provide an authentication key for APNs tokens, set the TokenKey property of the channel.
     */
    HasTokenKey?: __boolean;
    /**
     * (Deprecated) An identifier for the APNs VoIP sandbox channel. This property is retained only for backward compatibility.
     */
    Id?: __string;
    /**
     * Specifies whether the APNs VoIP sandbox channel is archived.
     */
    IsArchived?: __boolean;
    /**
     * The user who last modified the APNs VoIP sandbox channel.
     */
    LastModifiedBy?: __string;
    /**
     * The date and time when the APNs VoIP sandbox channel was last modified.
     */
    LastModifiedDate?: __string;
    /**
     * The type of messaging or notification platform for the channel. For the APNs VoIP sandbox channel, this value is APNS_VOIP_SANDBOX.
     */
    Platform: __string;
    /**
     * The current version of the APNs VoIP sandbox channel.
     */
    Version?: __integer;
  }
  export type Action = "OPEN_APP"|"DEEP_LINK"|"URL"|string;
  export interface ActivitiesResponse {
    /**
     * An array of responses, one for each activity that was performed by the campaign.
     */
    Item: ListOfActivityResponse;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    NextToken?: __string;
  }
  export interface Activity {
    /**
     * The settings for a custom message activity. This type of activity calls an AWS Lambda function or web hook that sends messages to participants.
     */
    CUSTOM?: CustomMessageActivity;
    /**
     * The settings for a yes/no split activity. This type of activity sends participants down one of two paths in a journey, based on conditions that you specify.
     */
    ConditionalSplit?: ConditionalSplitActivity;
    /**
     * The custom description of the activity.
     */
    Description?: __string;
    /**
     * The settings for an email activity. This type of activity sends an email message to participants.
     */
    EMAIL?: EmailMessageActivity;
    /**
     * The settings for a holdout activity. This type of activity stops a journey for a specified percentage of participants.
     */
    Holdout?: HoldoutActivity;
    /**
     * The settings for a multivariate split activity. This type of activity sends participants down one of as many as five paths (including a default Else path) in a journey, based on conditions that you specify.
     */
    MultiCondition?: MultiConditionalSplitActivity;
    /**
     * The settings for a push notification activity. This type of activity sends a push notification to participants.
     */
    PUSH?: PushMessageActivity;
    /**
     * The settings for a random split activity. This type of activity randomly sends specified percentages of participants down one of as many as five paths in a journey, based on conditions that you specify.
     */
    RandomSplit?: RandomSplitActivity;
    /**
     * The settings for an SMS activity. This type of activity sends a text message to participants.
     */
    SMS?: SMSMessageActivity;
    /**
     * The settings for a wait activity. This type of activity waits for a certain amount of time or until a specific date and time before moving participants to the next activity in a journey.
     */
    Wait?: WaitActivity;
    /**
     * The settings for a connect activity. This type of activity initiates a contact center call to participants.
     */
    ContactCenter?: ContactCenterActivity;
  }
  export interface ActivityResponse {
    /**
     * The unique identifier for the application that the campaign applies to.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the campaign that the activity applies to.
     */
    CampaignId: __string;
    /**
     * The actual time, in ISO 8601 format, when the activity was marked CANCELLED or COMPLETED.
     */
    End?: __string;
    /**
     * The unique identifier for the activity.
     */
    Id: __string;
    /**
     * Specifies whether the activity succeeded. Possible values are SUCCESS and FAIL.
     */
    Result?: __string;
    /**
     * The scheduled start time, in ISO 8601 format, for the activity.
     */
    ScheduledStart?: __string;
    /**
     * The actual start time, in ISO 8601 format, of the activity.
     */
    Start?: __string;
    /**
     * The current status of the activity. Possible values are: PENDING, INITIALIZING, RUNNING, PAUSED, CANCELLED, and COMPLETED.
     */
    State?: __string;
    /**
     * The total number of endpoints that the campaign successfully delivered messages to.
     */
    SuccessfulEndpointCount?: __integer;
    /**
     * The total number of time zones that were completed.
     */
    TimezonesCompletedCount?: __integer;
    /**
     * The total number of unique time zones that are in the segment for the campaign.
     */
    TimezonesTotalCount?: __integer;
    /**
     * The total number of endpoints that the campaign attempted to deliver messages to.
     */
    TotalEndpointCount?: __integer;
    /**
     * The unique identifier for the campaign treatment that the activity applies to. A treatment is a variation of a campaign that's used for A/B testing of a campaign.
     */
    TreatmentId?: __string;
  }
  export interface AddressConfiguration {
    /**
     * The message body to use instead of the default message body. This value overrides the default message body.
     */
    BodyOverride?: __string;
    /**
     * The channel to use when sending the message.
     */
    ChannelType?: ChannelType;
    /**
     * An object that maps custom attributes to attributes for the address and is attached to the message. Attribute names are case sensitive. For a push notification, this payload is added to the data.pinpoint object. For an email or text message, this payload is added to email/SMS delivery receipt event attributes.
     */
    Context?: MapOf__string;
    /**
     * The raw, JSON-formatted string to use as the payload for the message. If specified, this value overrides all other values for the message.
     */
    RawContent?: __string;
    /**
     * A map of the message variables to merge with the variables specified by properties of the DefaultMessage object. The variables specified in this map take precedence over all other variables.
     */
    Substitutions?: MapOfListOf__string;
    /**
     * The message title to use instead of the default message title. This value overrides the default message title.
     */
    TitleOverride?: __string;
  }
  export type Alignment = "LEFT"|"CENTER"|"RIGHT"|string;
  export interface AndroidPushNotificationTemplate {
    /**
     * The action to occur if a recipient taps a push notification that's based on the message template. Valid values are: OPEN_APP - Your app opens or it becomes the foreground app if it was sent to the background. This is the default action. DEEP_LINK - Your app opens and displays a designated user interface in the app. This action uses the deep-linking features of the Android platform. URL - The default mobile browser on the recipient's device opens and loads the web page at a URL that you specify.
     */
    Action?: Action;
    /**
     * The message body to use in a push notification that's based on the message template.
     */
    Body?: __string;
    /**
     * The URL of the large icon image to display in the content view of a push notification that's based on the message template.
     */
    ImageIconUrl?: __string;
    /**
     * The URL of an image to display in a push notification that's based on the message template.
     */
    ImageUrl?: __string;
    /**
     * The raw, JSON-formatted string to use as the payload for a push notification that's based on the message template. If specified, this value overrides all other content for the message template.
     */
    RawContent?: __string;
    /**
     * The URL of the small icon image to display in the status bar and the content view of a push notification that's based on the message template.
     */
    SmallImageIconUrl?: __string;
    /**
     * The sound to play when a recipient receives a push notification that's based on the message template. You can use the default stream or specify the file name of a sound resource that's bundled in your app. On an Android platform, the sound file must reside in /res/raw/.
     */
    Sound?: __string;
    /**
     * The title to use in a push notification that's based on the message template. This title appears above the notification message on a recipient's device.
     */
    Title?: __string;
    /**
     * The URL to open in a recipient's default mobile browser, if a recipient taps a push notification that's based on the message template and the value of the Action property is URL.
     */
    Url?: __string;
  }
  export interface ApplicationDateRangeKpiResponse {
    /**
     * The unique identifier for the application that the metric applies to.
     */
    ApplicationId: __string;
    /**
     * The last date and time of the date range that was used to filter the query results, in extended ISO 8601 format. The date range is inclusive.
     */
    EndTime: __timestampIso8601;
    /**
     * The name of the metric, also referred to as a key performance indicator (KPI), that the data was retrieved for. This value describes the associated metric and consists of two or more terms, which are comprised of lowercase alphanumeric characters, separated by a hyphen. For a list of possible values, see the Amazon Pinpoint Developer Guide.
     */
    KpiName: __string;
    /**
     * An array of objects that contains the results of the query. Each object contains the value for the metric and metadata about that value.
     */
    KpiResult: BaseKpiResult;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null for the Application Metrics resource because the resource returns all results in a single page.
     */
    NextToken?: __string;
    /**
     * The first date and time of the date range that was used to filter the query results, in extended ISO 8601 format. The date range is inclusive.
     */
    StartTime: __timestampIso8601;
  }
  export interface ApplicationResponse {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    Arn: __string;
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    Id: __string;
    /**
     * The display name of the application. This name is displayed as the Project name on the Amazon Pinpoint console.
     */
    Name: __string;
    /**
     * A string-to-string map of key-value pairs that identifies the tags that are associated with the application. Each tag consists of a required tag key and an associated tag value.
     */
    tags?: MapOf__string;
  }
  export interface ApplicationSettingsResource {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The settings for the AWS Lambda function to invoke by default as a code hook for campaigns in the application. You can use this hook to customize segments that are used by campaigns in the application.
     */
    CampaignHook?: CampaignHook;
    /**
     * The date and time, in ISO 8601 format, when the application's settings were last modified.
     */
    LastModifiedDate?: __string;
    /**
     * The default sending limits for campaigns in the application.
     */
    Limits?: CampaignLimits;
    /**
     * The default quiet time for campaigns in the application. Quiet time is a specific time range when messages aren't sent to endpoints, if all the following conditions are met: The EndpointDemographic.Timezone property of the endpoint is set to a valid value. The current time in the endpoint's time zone is later than or equal to the time specified by the QuietTime.Start property for the application (or a campaign or journey that has custom quiet time settings). The current time in the endpoint's time zone is earlier than or equal to the time specified by the QuietTime.End property for the application (or a campaign or journey that has custom quiet time settings). If any of the preceding conditions isn't met, the endpoint will receive messages from a campaign or journey, even if quiet time is enabled.
     */
    QuietTime?: QuietTime;
  }
  export interface ApplicationsResponse {
    /**
     * An array of responses, one for each application that was returned.
     */
    Item?: ListOfApplicationResponse;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    NextToken?: __string;
  }
  export interface AttributeDimension {
    /**
     * The type of segment dimension to use. Valid values are: INCLUSIVE - endpoints that have attributes matching the values are included in the segment.EXCLUSIVE - endpoints that have attributes matching the values are excluded in the segment.CONTAINS - endpoints that have attributes' substrings match the values are included in the segment.BEFORE - endpoints with attributes read as ISO_INSTANT datetimes before the value are included in the segment.AFTER - endpoints with attributes read as ISO_INSTANT datetimes after the value are included in the segment.ON - endpoints with attributes read as ISO_INSTANT dates on the value are included in the segment. Time is ignored in this comparison.BETWEEN - endpoints with attributes read as ISO_INSTANT datetimes between the values are included in the segment.
     */
    AttributeType?: AttributeType;
    /**
     * The criteria values to use for the segment dimension. Depending on the value of the AttributeType property, endpoints are included or excluded from the segment if their attribute values match the criteria values.
     */
    Values: ListOf__string;
  }
  export type AttributeType = "INCLUSIVE"|"EXCLUSIVE"|"CONTAINS"|"BEFORE"|"AFTER"|"ON"|"BETWEEN"|string;
  export interface AttributesResource {
    /**
     * The unique identifier for the application.
     */
    ApplicationId: __string;
    /**
     * The type of attribute or attributes that were removed from the endpoints. Valid values are: endpoint-custom-attributes - Custom attributes that describe endpoints. endpoint-metric-attributes - Custom metrics that your app reports to Amazon Pinpoint for endpoints. endpoint-user-attributes - Custom attributes that describe users.
     */
    AttributeType: __string;
    /**
     * An array that specifies the names of the attributes that were removed from the endpoints.
     */
    Attributes?: ListOf__string;
  }
  export interface BaiduChannelRequest {
    /**
     * The API key that you received from the Baidu Cloud Push service to communicate with the service.
     */
    ApiKey: __string;
    /**
     * Specifies whether to enable the Baidu channel for the application.
     */
    Enabled?: __boolean;
    /**
     * The secret key that you received from the Baidu Cloud Push service to communicate with the service.
     */
    SecretKey: __string;
  }
  export interface BaiduChannelResponse {
    /**
     * The unique identifier for the application that the Baidu channel applies to.
     */
    ApplicationId?: __string;
    /**
     * The date and time when the Baidu channel was enabled.
     */
    CreationDate?: __string;
    /**
     * The API key that you received from the Baidu Cloud Push service to communicate with the service.
     */
    Credential: __string;
    /**
     * Specifies whether the Baidu channel is enabled for the application.
     */
    Enabled?: __boolean;
    /**
     * (Not used) This property is retained only for backward compatibility.
     */
    HasCredential?: __boolean;
    /**
     * (Deprecated) An identifier for the Baidu channel. This property is retained only for backward compatibility.
     */
    Id?: __string;
    /**
     * Specifies whether the Baidu channel is archived.
     */
    IsArchived?: __boolean;
    /**
     * The user who last modified the Baidu channel.
     */
    LastModifiedBy?: __string;
    /**
     * The date and time when the Baidu channel was last modified.
     */
    LastModifiedDate?: __string;
    /**
     * The type of messaging or notification platform for the channel. For the Baidu channel, this value is BAIDU.
     */
    Platform: __string;
    /**
     * The current version of the Baidu channel.
     */
    Version?: __integer;
  }
  export interface BaiduMessage {
    /**
     * The action to occur if the recipient taps the push notification. Valid values are: OPEN_APP - Your app opens or it becomes the foreground app if it was sent to the background. This is the default action. DEEP_LINK - Your app opens and displays a designated user interface in the app. This action uses the deep-linking features of the Android platform. URL - The default mobile browser on the recipient's device opens and loads the web page at a URL that you specify.
     */
    Action?: Action;
    /**
     * The body of the notification message.
     */
    Body?: __string;
    /**
     * The JSON data payload to use for the push notification, if the notification is a silent push notification. This payload is added to the data.pinpoint.jsonBody object of the notification.
     */
    Data?: MapOf__string;
    /**
     * The icon image name of the asset saved in your app.
     */
    IconReference?: __string;
    /**
     * The URL of the large icon image to display in the content view of the push notification.
     */
    ImageIconUrl?: __string;
    /**
     * The URL of an image to display in the push notification.
     */
    ImageUrl?: __string;
    /**
     * The raw, JSON-formatted string to use as the payload for the notification message. If specified, this value overrides all other content for the message.
     */
    RawContent?: __string;
    /**
     * Specifies whether the notification is a silent push notification, which is a push notification that doesn't display on a recipient's device. Silent push notifications can be used for cases such as updating an app's configuration or supporting phone home functionality.
     */
    SilentPush?: __boolean;
    /**
     * The URL of the small icon image to display in the status bar and the content view of the push notification.
     */
    SmallImageIconUrl?: __string;
    /**
     * The sound to play when the recipient receives the push notification. You can use the default stream or specify the file name of a sound resource that's bundled in your app. On an Android platform, the sound file must reside in /res/raw/.
     */
    Sound?: __string;
    /**
     * The default message variables to use in the notification message. You can override the default variables with individual address variables.
     */
    Substitutions?: MapOfListOf__string;
    /**
     * The amount of time, in seconds, that the Baidu Cloud Push service should store the message if the recipient's device is offline. The default value and maximum supported time is 604,800 seconds (7 days).
     */
    TimeToLive?: __integer;
    /**
     * The title to display above the notification message on the recipient's device.
     */
    Title?: __string;
    /**
     * The URL to open in the recipient's default mobile browser, if a recipient taps the push notification and the value of the Action property is URL.
     */
    Url?: __string;
  }
  export interface BaseKpiResult {
    /**
     * An array of objects that provides the results of a query that retrieved the data for a standard metric that applies to an application, campaign, or journey.
     */
    Rows: ListOfResultRow;
  }
  export type ButtonAction = "LINK"|"DEEP_LINK"|"CLOSE"|string;
  export interface CampaignCustomMessage {
    /**
     * The raw, JSON-formatted string to use as the payload for the message. The maximum size is 5 KB.
     */
    Data?: __string;
  }
  export interface CampaignDateRangeKpiResponse {
    /**
     * The unique identifier for the application that the metric applies to.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the campaign that the metric applies to.
     */
    CampaignId: __string;
    /**
     * The last date and time of the date range that was used to filter the query results, in extended ISO 8601 format. The date range is inclusive.
     */
    EndTime: __timestampIso8601;
    /**
     * The name of the metric, also referred to as a key performance indicator (KPI), that the data was retrieved for. This value describes the associated metric and consists of two or more terms, which are comprised of lowercase alphanumeric characters, separated by a hyphen. For a list of possible values, see the Amazon Pinpoint Developer Guide.
     */
    KpiName: __string;
    /**
     * An array of objects that contains the results of the query. Each object contains the value for the metric and metadata about that value.
     */
    KpiResult: BaseKpiResult;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null for the Campaign Metrics resource because the resource returns all results in a single page.
     */
    NextToken?: __string;
    /**
     * The first date and time of the date range that was used to filter the query results, in extended ISO 8601 format. The date range is inclusive.
     */
    StartTime: __timestampIso8601;
  }
  export interface CampaignEmailMessage {
    /**
     * The body of the email for recipients whose email clients don't render HTML content.
     */
    Body?: __string;
    /**
     * The verified email address to send the email from. The default address is the FromAddress specified for the email channel for the application.
     */
    FromAddress?: __string;
    /**
     * The body of the email, in HTML format, for recipients whose email clients render HTML content.
     */
    HtmlBody?: __string;
    /**
     * The subject line, or title, of the email.
     */
    Title?: __string;
  }
  export interface CampaignEventFilter {
    /**
     * The dimension settings of the event filter for the campaign.
     */
    Dimensions: EventDimensions;
    /**
     * The type of event that causes the campaign to be sent. Valid values are: SYSTEM, sends the campaign when a system event occurs; and, ENDPOINT, sends the campaign when an endpoint event (Events resource) occurs.
     */
    FilterType: FilterType;
  }
  export interface CampaignHook {
    /**
     * The name or Amazon Resource Name (ARN) of the AWS Lambda function that Amazon Pinpoint invokes to customize a segment for a campaign.
     */
    LambdaFunctionName?: __string;
    /**
     * The mode that Amazon Pinpoint uses to invoke the AWS Lambda function. Possible values are: FILTER - Invoke the function to customize the segment that's used by a campaign. DELIVERY - (Deprecated) Previously, invoked the function to send a campaign through a custom channel. This functionality is not supported anymore. To send a campaign through a custom channel, use the CustomDeliveryConfiguration and CampaignCustomMessage objects of the campaign.
     */
    Mode?: Mode;
    /**
     *  The web URL that Amazon Pinpoint calls to invoke the AWS Lambda function over HTTPS.
     */
    WebUrl?: __string;
  }
  export interface CampaignInAppMessage {
    /**
     * The message body of the notification, the email body or the text message.
     */
    Body?: __string;
    /**
     * In-app message content.
     */
    Content?: ListOfInAppMessageContent;
    /**
     * Custom config to be sent to client.
     */
    CustomConfig?: MapOf__string;
    /**
     * In-app message layout.
     */
    Layout?: Layout;
  }
  export interface CampaignLimits {
    /**
     * The maximum number of messages that a campaign can send to a single endpoint during a 24-hour period. For an application, this value specifies the default limit for the number of messages that campaigns and journeys can send to a single endpoint during a 24-hour period. The maximum value is 100.
     */
    Daily?: __integer;
    /**
     * The maximum amount of time, in seconds, that a campaign can attempt to deliver a message after the scheduled start time for the campaign. The minimum value is 60 seconds.
     */
    MaximumDuration?: __integer;
    /**
     * The maximum number of messages that a campaign can send each second. For an application, this value specifies the default limit for the number of messages that campaigns can send each second. The minimum value is 50. The maximum value is 20,000.
     */
    MessagesPerSecond?: __integer;
    /**
     * The maximum number of messages that a campaign can send to a single endpoint during the course of the campaign. If a campaign recurs, this setting applies to all runs of the campaign. The maximum value is 100.
     */
    Total?: __integer;
    /**
     * The maximum total number of messages that the campaign can send per user session.
     */
    Session?: __integer;
  }
  export interface CampaignResponse {
    /**
     * An array of responses, one for each treatment that you defined for the campaign, in addition to the default treatment.
     */
    AdditionalTreatments?: ListOfTreatmentResource;
    /**
     * The unique identifier for the application that the campaign applies to.
     */
    ApplicationId: __string;
    /**
     * The Amazon Resource Name (ARN) of the campaign.
     */
    Arn: __string;
    /**
     * The date, in ISO 8601 format, when the campaign was created.
     */
    CreationDate: __string;
    /**
     * The delivery configuration settings for sending the campaign through a custom channel.
     */
    CustomDeliveryConfiguration?: CustomDeliveryConfiguration;
    /**
     * The current status of the campaign's default treatment. This value exists only for campaigns that have more than one treatment.
     */
    DefaultState?: CampaignState;
    /**
     * The custom description of the campaign.
     */
    Description?: __string;
    /**
     * The allocated percentage of users (segment members) who shouldn't receive messages from the campaign.
     */
    HoldoutPercent?: __integer;
    /**
     * The settings for the AWS Lambda function to use as a code hook for the campaign. You can use this hook to customize the segment that's used by the campaign.
     */
    Hook?: CampaignHook;
    /**
     * The unique identifier for the campaign.
     */
    Id: __string;
    /**
     * Specifies whether the campaign is paused. A paused campaign doesn't run unless you resume it by changing this value to false.
     */
    IsPaused?: __boolean;
    /**
     * The date, in ISO 8601 format, when the campaign was last modified.
     */
    LastModifiedDate: __string;
    /**
     * The messaging limits for the campaign.
     */
    Limits?: CampaignLimits;
    /**
     * The message configuration settings for the campaign.
     */
    MessageConfiguration?: MessageConfiguration;
    /**
     * The name of the campaign.
     */
    Name?: __string;
    /**
     * The schedule settings for the campaign.
     */
    Schedule?: Schedule;
    /**
     * The unique identifier for the segment that's associated with the campaign.
     */
    SegmentId: __string;
    /**
     * The version number of the segment that's associated with the campaign.
     */
    SegmentVersion: __integer;
    /**
     * The current status of the campaign.
     */
    State?: CampaignState;
    /**
     * A string-to-string map of key-value pairs that identifies the tags that are associated with the campaign. Each tag consists of a required tag key and an associated tag value.
     */
    tags?: MapOf__string;
    /**
     * The message template that’s used for the campaign.
     */
    TemplateConfiguration?: TemplateConfiguration;
    /**
     * The custom description of the default treatment for the campaign.
     */
    TreatmentDescription?: __string;
    /**
     * The custom name of the default treatment for the campaign, if the campaign has multiple treatments. A treatment is a variation of a campaign that's used for A/B testing.
     */
    TreatmentName?: __string;
    /**
     * The version number of the campaign.
     */
    Version?: __integer;
    /**
     * Defines the priority of the campaign, used to decide the order of messages displayed to user if there are multiple messages scheduled to be displayed at the same moment.
     */
    Priority?: __integer;
  }
  export interface CampaignSmsMessage {
    /**
     * The body of the SMS message.
     */
    Body?: __string;
    /**
     * The SMS message type. Valid values are TRANSACTIONAL (for messages that are critical or time-sensitive, such as a one-time passwords) and PROMOTIONAL (for messsages that aren't critical or time-sensitive, such as marketing messages).
     */
    MessageType?: MessageType;
    /**
     * The long code to send the SMS message from. This value should be one of the dedicated long codes that's assigned to your AWS account. Although it isn't required, we recommend that you specify the long code using an E.164 format to ensure prompt and accurate delivery of the message. For example, +12065550100.
     */
    OriginationNumber?: __string;
    /**
     * The sender ID to display on recipients' devices when they receive the SMS message.
     */
    SenderId?: __string;
    /**
     * The entity ID or Principal Entity (PE) id received from the regulatory body for sending SMS in your country.
     */
    EntityId?: __string;
    /**
     * The template ID received from the regulatory body for sending SMS in your country.
     */
    TemplateId?: __string;
  }
  export interface CampaignState {
    /**
     * The current status of the campaign, or the current status of a treatment that belongs to an A/B test campaign. If a campaign uses A/B testing, the campaign has a status of COMPLETED only if all campaign treatments have a status of COMPLETED. If you delete the segment that's associated with a campaign, the campaign fails and has a status of DELETED.
     */
    CampaignStatus?: CampaignStatus;
  }
  export type CampaignStatus = "SCHEDULED"|"EXECUTING"|"PENDING_NEXT_RUN"|"COMPLETED"|"PAUSED"|"DELETED"|"INVALID"|string;
  export interface CampaignsResponse {
    /**
     * An array of responses, one for each campaign that's associated with the application.
     */
    Item: ListOfCampaignResponse;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    NextToken?: __string;
  }
  export interface ChannelResponse {
    /**
     * The unique identifier for the application.
     */
    ApplicationId?: __string;
    /**
     * The date and time, in ISO 8601 format, when the channel was enabled.
     */
    CreationDate?: __string;
    /**
     * Specifies whether the channel is enabled for the application.
     */
    Enabled?: __boolean;
    /**
     * (Not used) This property is retained only for backward compatibility.
     */
    HasCredential?: __boolean;
    /**
     * (Deprecated) An identifier for the channel. This property is retained only for backward compatibility.
     */
    Id?: __string;
    /**
     * Specifies whether the channel is archived.
     */
    IsArchived?: __boolean;
    /**
     * The user who last modified the channel.
     */
    LastModifiedBy?: __string;
    /**
     * The date and time, in ISO 8601 format, when the channel was last modified.
     */
    LastModifiedDate?: __string;
    /**
     * The current version of the channel.
     */
    Version?: __integer;
  }
  export type ChannelType = "PUSH"|"GCM"|"APNS"|"APNS_SANDBOX"|"APNS_VOIP"|"APNS_VOIP_SANDBOX"|"ADM"|"SMS"|"VOICE"|"EMAIL"|"BAIDU"|"CUSTOM"|"IN_APP"|string;
  export interface ChannelsResponse {
    /**
     * A map that contains a multipart response for each channel. For each item in this object, the ChannelType is the key and the Channel is the value.
     */
    Channels: MapOfChannelResponse;
  }
  export interface Condition {
    /**
     * The conditions to evaluate for the activity.
     */
    Conditions?: ListOfSimpleCondition;
    /**
     * Specifies how to handle multiple conditions for the activity. For example, if you specify two conditions for an activity, whether both or only one of the conditions must be met for the activity to be performed.
     */
    Operator?: Operator;
  }
  export interface ConditionalSplitActivity {
    /**
     * The conditions that define the paths for the activity, and the relationship between the conditions.
     */
    Condition?: Condition;
    /**
     * The amount of time to wait before determining whether the conditions are met, or the date and time when Amazon Pinpoint determines whether the conditions are met.
     */
    EvaluationWaitTime?: WaitTime;
    /**
     * The unique identifier for the activity to perform if the conditions aren't met.
     */
    FalseActivity?: __string;
    /**
     * The unique identifier for the activity to perform if the conditions are met.
     */
    TrueActivity?: __string;
  }
  export interface ContactCenterActivity {
    /**
     * The unique identifier for the next activity to perform after the this activity.
     */
    NextActivity?: __string;
  }
  export interface CreateAppRequest {
    CreateApplicationRequest: CreateApplicationRequest;
  }
  export interface CreateAppResponse {
    ApplicationResponse: ApplicationResponse;
  }
  export interface CreateApplicationRequest {
    /**
     * The display name of the application. This name is displayed as the Project name on the Amazon Pinpoint console.
     */
    Name: __string;
    /**
     * A string-to-string map of key-value pairs that defines the tags to associate with the application. Each tag consists of a required tag key and an associated tag value.
     */
    tags?: MapOf__string;
  }
  export interface CreateCampaignRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    WriteCampaignRequest: WriteCampaignRequest;
  }
  export interface CreateCampaignResponse {
    CampaignResponse: CampaignResponse;
  }
  export interface CreateEmailTemplateRequest {
    EmailTemplateRequest: EmailTemplateRequest;
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
  }
  export interface CreateEmailTemplateResponse {
    CreateTemplateMessageBody: CreateTemplateMessageBody;
  }
  export interface CreateExportJobRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    ExportJobRequest: ExportJobRequest;
  }
  export interface CreateExportJobResponse {
    ExportJobResponse: ExportJobResponse;
  }
  export interface CreateImportJobRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    ImportJobRequest: ImportJobRequest;
  }
  export interface CreateImportJobResponse {
    ImportJobResponse: ImportJobResponse;
  }
  export interface CreateInAppTemplateRequest {
    InAppTemplateRequest: InAppTemplateRequest;
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
  }
  export interface CreateInAppTemplateResponse {
    TemplateCreateMessageBody: TemplateCreateMessageBody;
  }
  export interface CreateJourneyRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    WriteJourneyRequest: WriteJourneyRequest;
  }
  export interface CreateJourneyResponse {
    JourneyResponse: JourneyResponse;
  }
  export interface CreatePushTemplateRequest {
    PushNotificationTemplateRequest: PushNotificationTemplateRequest;
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
  }
  export interface CreatePushTemplateResponse {
    CreateTemplateMessageBody: CreateTemplateMessageBody;
  }
  export interface CreateRecommenderConfiguration {
    /**
     * A map of key-value pairs that defines 1-10 custom endpoint or user attributes, depending on the value for the RecommendationProviderIdType property. Each of these attributes temporarily stores a recommended item that's retrieved from the recommender model and sent to an AWS Lambda function for additional processing. Each attribute can be used as a message variable in a message template. In the map, the key is the name of a custom attribute and the value is a custom display name for that attribute. The display name appears in the Attribute finder of the template editor on the Amazon Pinpoint console. The following restrictions apply to these names: An attribute name must start with a letter or number and it can contain up to 50 characters. The characters can be letters, numbers, underscores (_), or hyphens (-). Attribute names are case sensitive and must be unique. An attribute display name must start with a letter or number and it can contain up to 25 characters. The characters can be letters, numbers, spaces, underscores (_), or hyphens (-). This object is required if the configuration invokes an AWS Lambda function (RecommendationTransformerUri) to process recommendation data. Otherwise, don't include this object in your request.
     */
    Attributes?: MapOf__string;
    /**
     * A custom description of the configuration for the recommender model. The description can contain up to 128 characters. The characters can be letters, numbers, spaces, or the following symbols: _ ; () , ‐.
     */
    Description?: __string;
    /**
     * A custom name of the configuration for the recommender model. The name must start with a letter or number and it can contain up to 128 characters. The characters can be letters, numbers, spaces, underscores (_), or hyphens (-).
     */
    Name?: __string;
    /**
     * The type of Amazon Pinpoint ID to associate with unique user IDs in the recommender model. This value enables the model to use attribute and event data that’s specific to a particular endpoint or user in an Amazon Pinpoint application. Valid values are: PINPOINT_ENDPOINT_ID - Associate each user in the model with a particular endpoint in Amazon Pinpoint. The data is correlated based on endpoint IDs in Amazon Pinpoint. This is the default value. PINPOINT_USER_ID - Associate each user in the model with a particular user and endpoint in Amazon Pinpoint. The data is correlated based on user IDs in Amazon Pinpoint. If you specify this value, an endpoint definition in Amazon Pinpoint has to specify both a user ID (UserId) and an endpoint ID. Otherwise, messages won’t be sent to the user's endpoint.
     */
    RecommendationProviderIdType?: __string;
    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that authorizes Amazon Pinpoint to retrieve recommendation data from the recommender model.
     */
    RecommendationProviderRoleArn: __string;
    /**
     * The Amazon Resource Name (ARN) of the recommender model to retrieve recommendation data from. This value must match the ARN of an Amazon Personalize campaign.
     */
    RecommendationProviderUri: __string;
    /**
     * The name or Amazon Resource Name (ARN) of the AWS Lambda function to invoke for additional processing of recommendation data that's retrieved from the recommender model.
     */
    RecommendationTransformerUri?: __string;
    /**
     * A custom display name for the standard endpoint or user attribute (RecommendationItems) that temporarily stores recommended items for each endpoint or user, depending on the value for the RecommendationProviderIdType property. This value is required if the configuration doesn't invoke an AWS Lambda function (RecommendationTransformerUri) to perform additional processing of recommendation data. This name appears in the Attribute finder of the template editor on the Amazon Pinpoint console. The name can contain up to 25 characters. The characters can be letters, numbers, spaces, underscores (_), or hyphens (-). These restrictions don't apply to attribute values.
     */
    RecommendationsDisplayName?: __string;
    /**
     * The number of recommended items to retrieve from the model for each endpoint or user, depending on the value for the RecommendationProviderIdType property. This number determines how many recommended items are available for use in message variables. The minimum value is 1. The maximum value is 5. The default value is 5. To use multiple recommended items and custom attributes with message variables, you have to use an AWS Lambda function (RecommendationTransformerUri) to perform additional processing of recommendation data.
     */
    RecommendationsPerMessage?: __integer;
  }
  export interface CreateRecommenderConfigurationRequest {
    CreateRecommenderConfiguration: CreateRecommenderConfiguration;
  }
  export interface CreateRecommenderConfigurationResponse {
    RecommenderConfigurationResponse: RecommenderConfigurationResponse;
  }
  export interface CreateSegmentRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    WriteSegmentRequest: WriteSegmentRequest;
  }
  export interface CreateSegmentResponse {
    SegmentResponse: SegmentResponse;
  }
  export interface CreateSmsTemplateRequest {
    SMSTemplateRequest: SMSTemplateRequest;
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
  }
  export interface CreateSmsTemplateResponse {
    CreateTemplateMessageBody: CreateTemplateMessageBody;
  }
  export interface CreateTemplateMessageBody {
    /**
     * The Amazon Resource Name (ARN) of the message template that was created.
     */
    Arn?: __string;
    /**
     * The message that's returned from the API for the request to create the message template.
     */
    Message?: __string;
    /**
     * The unique identifier for the request to create the message template.
     */
    RequestID?: __string;
  }
  export interface CreateVoiceTemplateRequest {
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
    VoiceTemplateRequest: VoiceTemplateRequest;
  }
  export interface CreateVoiceTemplateResponse {
    CreateTemplateMessageBody: CreateTemplateMessageBody;
  }
  export interface CustomDeliveryConfiguration {
    /**
     * The destination to send the campaign or treatment to. This value can be one of the following: The name or Amazon Resource Name (ARN) of an AWS Lambda function to invoke to handle delivery of the campaign or treatment. The URL for a web application or service that supports HTTPS and can receive the message. The URL has to be a full URL, including the HTTPS protocol. 
     */
    DeliveryUri: __string;
    /**
     * The types of endpoints to send the campaign or treatment to. Each valid value maps to a type of channel that you can associate with an endpoint by using the ChannelType property of an endpoint.
     */
    EndpointTypes?: ListOf__EndpointTypesElement;
  }
  export interface CustomMessageActivity {
    /**
     * The destination to send the campaign or treatment to. This value can be one of the following: The name or Amazon Resource Name (ARN) of an AWS Lambda function to invoke to handle delivery of the campaign or treatment. The URL for a web application or service that supports HTTPS and can receive the message. The URL has to be a full URL, including the HTTPS protocol.
     */
    DeliveryUri?: __string;
    /**
     * The types of endpoints to send the custom message to. Each valid value maps to a type of channel that you can associate with an endpoint by using the ChannelType property of an endpoint.
     */
    EndpointTypes?: ListOf__EndpointTypesElement;
    /**
     * Specifies the message data included in a custom channel message that's sent to participants in a journey.
     */
    MessageConfig?: JourneyCustomMessage;
    /**
     * The unique identifier for the next activity to perform, after Amazon Pinpoint calls the AWS Lambda function or web hook.
     */
    NextActivity?: __string;
    /**
     * The name of the custom message template to use for the message. If specified, this value must match the name of an existing message template.
     */
    TemplateName?: __string;
    /**
     * The unique identifier for the version of the message template to use for the message. If specified, this value must match the identifier for an existing template version. To retrieve a list of versions and version identifiers for a template, use the Template Versions resource. If you don't specify a value for this property, Amazon Pinpoint uses the active version of the template. The active version is typically the version of a template that's been most recently reviewed and approved for use, depending on your workflow. It isn't necessarily the latest version of a template.
     */
    TemplateVersion?: __string;
  }
  export interface DefaultButtonConfiguration {
    /**
     * The background color of the button.
     */
    BackgroundColor?: __string;
    /**
     * The border radius of the button.
     */
    BorderRadius?: __integer;
    /**
     * Action triggered by the button.
     */
    ButtonAction: ButtonAction;
    /**
     * Button destination.
     */
    Link?: __string;
    /**
     * Button text.
     */
    Text: __string;
    /**
     * The text color of the button.
     */
    TextColor?: __string;
  }
  export interface DefaultMessage {
    /**
     * The default body of the message.
     */
    Body?: __string;
    /**
     * The default message variables to use in the message. You can override these default variables with individual address variables.
     */
    Substitutions?: MapOfListOf__string;
  }
  export interface DefaultPushNotificationMessage {
    /**
     * The default action to occur if a recipient taps the push notification. Valid values are: OPEN_APP - Your app opens or it becomes the foreground app if it was sent to the background. This is the default action. DEEP_LINK - Your app opens and displays a designated user interface in the app. This setting uses the deep-linking features of the iOS and Android platforms. URL - The default mobile browser on the recipient's device opens and loads the web page at a URL that you specify.
     */
    Action?: Action;
    /**
     * The default body of the notification message.
     */
    Body?: __string;
    /**
     * The JSON data payload to use for the default push notification, if the notification is a silent push notification. This payload is added to the data.pinpoint.jsonBody object of the notification.
     */
    Data?: MapOf__string;
    /**
     * Specifies whether the default notification is a silent push notification, which is a push notification that doesn't display on a recipient's device. Silent push notifications can be used for cases such as updating an app's configuration or delivering messages to an in-app notification center.
     */
    SilentPush?: __boolean;
    /**
     * The default message variables to use in the notification message. You can override the default variables with individual address variables.
     */
    Substitutions?: MapOfListOf__string;
    /**
     * The default title to display above the notification message on a recipient's device.
     */
    Title?: __string;
    /**
     * The default URL to open in a recipient's default mobile browser, if a recipient taps the push notification and the value of the Action property is URL.
     */
    Url?: __string;
  }
  export interface DefaultPushNotificationTemplate {
    /**
     * The action to occur if a recipient taps a push notification that's based on the message template. Valid values are: OPEN_APP - Your app opens or it becomes the foreground app if it was sent to the background. This is the default action. DEEP_LINK - Your app opens and displays a designated user interface in the app. This setting uses the deep-linking features of the iOS and Android platforms. URL - The default mobile browser on the recipient's device opens and loads the web page at a URL that you specify.
     */
    Action?: Action;
    /**
     * The message body to use in push notifications that are based on the message template.
     */
    Body?: __string;
    /**
     * The sound to play when a recipient receives a push notification that's based on the message template. You can use the default stream or specify the file name of a sound resource that's bundled in your app. On an Android platform, the sound file must reside in /res/raw/. For an iOS platform, this value is the key for the name of a sound file in your app's main bundle or the Library/Sounds folder in your app's data container. If the sound file can't be found or you specify default for the value, the system plays the default alert sound.
     */
    Sound?: __string;
    /**
     * The title to use in push notifications that are based on the message template. This title appears above the notification message on a recipient's device.
     */
    Title?: __string;
    /**
     * The URL to open in a recipient's default mobile browser, if a recipient taps a push notification that's based on the message template and the value of the Action property is URL.
     */
    Url?: __string;
  }
  export interface DeleteAdmChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface DeleteAdmChannelResponse {
    ADMChannelResponse: ADMChannelResponse;
  }
  export interface DeleteApnsChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface DeleteApnsChannelResponse {
    APNSChannelResponse: APNSChannelResponse;
  }
  export interface DeleteApnsSandboxChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface DeleteApnsSandboxChannelResponse {
    APNSSandboxChannelResponse: APNSSandboxChannelResponse;
  }
  export interface DeleteApnsVoipChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface DeleteApnsVoipChannelResponse {
    APNSVoipChannelResponse: APNSVoipChannelResponse;
  }
  export interface DeleteApnsVoipSandboxChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface DeleteApnsVoipSandboxChannelResponse {
    APNSVoipSandboxChannelResponse: APNSVoipSandboxChannelResponse;
  }
  export interface DeleteAppRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface DeleteAppResponse {
    ApplicationResponse: ApplicationResponse;
  }
  export interface DeleteBaiduChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface DeleteBaiduChannelResponse {
    BaiduChannelResponse: BaiduChannelResponse;
  }
  export interface DeleteCampaignRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the campaign.
     */
    CampaignId: __string;
  }
  export interface DeleteCampaignResponse {
    CampaignResponse: CampaignResponse;
  }
  export interface DeleteEmailChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface DeleteEmailChannelResponse {
    EmailChannelResponse: EmailChannelResponse;
  }
  export interface DeleteEmailTemplateRequest {
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
    /**
     * The unique identifier for the version of the message template to update, retrieve information about, or delete. To retrieve identifiers and other information for all the versions of a template, use the Template Versions resource. If specified, this value must match the identifier for an existing template version. If specified for an update operation, this value must match the identifier for the latest existing version of the template. This restriction helps ensure that race conditions don't occur. If you don't specify a value for this parameter, Amazon Pinpoint does the following: For a get operation, retrieves information about the active version of the template. For an update operation, saves the updates to (overwrites) the latest existing version of the template, if the create-new-version parameter isn't used or is set to false. For a delete operation, deletes the template, including all versions of the template.
     */
    Version?: __string;
  }
  export interface DeleteEmailTemplateResponse {
    MessageBody: MessageBody;
  }
  export interface DeleteEndpointRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the endpoint.
     */
    EndpointId: __string;
  }
  export interface DeleteEndpointResponse {
    EndpointResponse: EndpointResponse;
  }
  export interface DeleteEventStreamRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface DeleteEventStreamResponse {
    EventStream: EventStream;
  }
  export interface DeleteGcmChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface DeleteGcmChannelResponse {
    GCMChannelResponse: GCMChannelResponse;
  }
  export interface DeleteInAppTemplateRequest {
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
    /**
     * The unique identifier for the version of the message template to update, retrieve information about, or delete. To retrieve identifiers and other information for all the versions of a template, use the Template Versions resource. If specified, this value must match the identifier for an existing template version. If specified for an update operation, this value must match the identifier for the latest existing version of the template. This restriction helps ensure that race conditions don't occur. If you don't specify a value for this parameter, Amazon Pinpoint does the following: For a get operation, retrieves information about the active version of the template. For an update operation, saves the updates to (overwrites) the latest existing version of the template, if the create-new-version parameter isn't used or is set to false. For a delete operation, deletes the template, including all versions of the template.
     */
    Version?: __string;
  }
  export interface DeleteInAppTemplateResponse {
    MessageBody: MessageBody;
  }
  export interface DeleteJourneyRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the journey.
     */
    JourneyId: __string;
  }
  export interface DeleteJourneyResponse {
    JourneyResponse: JourneyResponse;
  }
  export interface DeletePushTemplateRequest {
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
    /**
     * The unique identifier for the version of the message template to update, retrieve information about, or delete. To retrieve identifiers and other information for all the versions of a template, use the Template Versions resource. If specified, this value must match the identifier for an existing template version. If specified for an update operation, this value must match the identifier for the latest existing version of the template. This restriction helps ensure that race conditions don't occur. If you don't specify a value for this parameter, Amazon Pinpoint does the following: For a get operation, retrieves information about the active version of the template. For an update operation, saves the updates to (overwrites) the latest existing version of the template, if the create-new-version parameter isn't used or is set to false. For a delete operation, deletes the template, including all versions of the template.
     */
    Version?: __string;
  }
  export interface DeletePushTemplateResponse {
    MessageBody: MessageBody;
  }
  export interface DeleteRecommenderConfigurationRequest {
    /**
     * The unique identifier for the recommender model configuration. This identifier is displayed as the Recommender ID on the Amazon Pinpoint console.
     */
    RecommenderId: __string;
  }
  export interface DeleteRecommenderConfigurationResponse {
    RecommenderConfigurationResponse: RecommenderConfigurationResponse;
  }
  export interface DeleteSegmentRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the segment.
     */
    SegmentId: __string;
  }
  export interface DeleteSegmentResponse {
    SegmentResponse: SegmentResponse;
  }
  export interface DeleteSmsChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface DeleteSmsChannelResponse {
    SMSChannelResponse: SMSChannelResponse;
  }
  export interface DeleteSmsTemplateRequest {
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
    /**
     * The unique identifier for the version of the message template to update, retrieve information about, or delete. To retrieve identifiers and other information for all the versions of a template, use the Template Versions resource. If specified, this value must match the identifier for an existing template version. If specified for an update operation, this value must match the identifier for the latest existing version of the template. This restriction helps ensure that race conditions don't occur. If you don't specify a value for this parameter, Amazon Pinpoint does the following: For a get operation, retrieves information about the active version of the template. For an update operation, saves the updates to (overwrites) the latest existing version of the template, if the create-new-version parameter isn't used or is set to false. For a delete operation, deletes the template, including all versions of the template.
     */
    Version?: __string;
  }
  export interface DeleteSmsTemplateResponse {
    MessageBody: MessageBody;
  }
  export interface DeleteUserEndpointsRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the user.
     */
    UserId: __string;
  }
  export interface DeleteUserEndpointsResponse {
    EndpointsResponse: EndpointsResponse;
  }
  export interface DeleteVoiceChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface DeleteVoiceChannelResponse {
    VoiceChannelResponse: VoiceChannelResponse;
  }
  export interface DeleteVoiceTemplateRequest {
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
    /**
     * The unique identifier for the version of the message template to update, retrieve information about, or delete. To retrieve identifiers and other information for all the versions of a template, use the Template Versions resource. If specified, this value must match the identifier for an existing template version. If specified for an update operation, this value must match the identifier for the latest existing version of the template. This restriction helps ensure that race conditions don't occur. If you don't specify a value for this parameter, Amazon Pinpoint does the following: For a get operation, retrieves information about the active version of the template. For an update operation, saves the updates to (overwrites) the latest existing version of the template, if the create-new-version parameter isn't used or is set to false. For a delete operation, deletes the template, including all versions of the template.
     */
    Version?: __string;
  }
  export interface DeleteVoiceTemplateResponse {
    MessageBody: MessageBody;
  }
  export type DeliveryStatus = "SUCCESSFUL"|"THROTTLED"|"TEMPORARY_FAILURE"|"PERMANENT_FAILURE"|"UNKNOWN_FAILURE"|"OPT_OUT"|"DUPLICATE"|string;
  export type DimensionType = "INCLUSIVE"|"EXCLUSIVE"|string;
  export interface DirectMessageConfiguration {
    /**
     * The default push notification message for the ADM (Amazon Device Messaging) channel. This message overrides the default push notification message (DefaultPushNotificationMessage).
     */
    ADMMessage?: ADMMessage;
    /**
     * The default push notification message for the APNs (Apple Push Notification service) channel. This message overrides the default push notification message (DefaultPushNotificationMessage).
     */
    APNSMessage?: APNSMessage;
    /**
     * The default push notification message for the Baidu (Baidu Cloud Push) channel. This message overrides the default push notification message (DefaultPushNotificationMessage).
     */
    BaiduMessage?: BaiduMessage;
    /**
     * The default message for all channels.
     */
    DefaultMessage?: DefaultMessage;
    /**
     * The default push notification message for all push notification channels.
     */
    DefaultPushNotificationMessage?: DefaultPushNotificationMessage;
    /**
     * The default message for the email channel. This message overrides the default message (DefaultMessage).
     */
    EmailMessage?: EmailMessage;
    /**
     * The default push notification message for the GCM channel, which is used to send notifications through the Firebase Cloud Messaging (FCM), formerly Google Cloud Messaging (GCM), service. This message overrides the default push notification message (DefaultPushNotificationMessage).
     */
    GCMMessage?: GCMMessage;
    /**
     * The default message for the SMS channel. This message overrides the default message (DefaultMessage).
     */
    SMSMessage?: SMSMessage;
    /**
     * The default message for the voice channel. This message overrides the default message (DefaultMessage).
     */
    VoiceMessage?: VoiceMessage;
  }
  export type Duration = "HR_24"|"DAY_7"|"DAY_14"|"DAY_30"|string;
  export interface EmailChannelRequest {
    /**
     * The Amazon SES configuration set that you want to apply to messages that you send through the channel.
     */
    ConfigurationSet?: __string;
    /**
     * Specifies whether to enable the email channel for the application.
     */
    Enabled?: __boolean;
    /**
     *  The verified email address that you want to send email from when you send email through the channel.
     */
    FromAddress: __string;
    /**
     *  The Amazon Resource Name (ARN) of the identity, verified with Amazon Simple Email Service (Amazon SES), that you want to use when you send email through the channel.
     */
    Identity: __string;
    /**
     *  The ARN of the AWS Identity and Access Management (IAM) role that you want Amazon Pinpoint to use when it submits email-related event data for the channel.
     */
    RoleArn?: __string;
  }
  export interface EmailChannelResponse {
    /**
     * The unique identifier for the application that the email channel applies to.
     */
    ApplicationId?: __string;
    /**
     * The Amazon SES configuration set that's applied to messages that are sent through the channel.
     */
    ConfigurationSet?: __string;
    /**
     * The date and time, in ISO 8601 format, when the email channel was enabled.
     */
    CreationDate?: __string;
    /**
     * Specifies whether the email channel is enabled for the application.
     */
    Enabled?: __boolean;
    /**
     * The verified email address that email is sent from when you send email through the channel.
     */
    FromAddress?: __string;
    /**
     * (Not used) This property is retained only for backward compatibility.
     */
    HasCredential?: __boolean;
    /**
     * (Deprecated) An identifier for the email channel. This property is retained only for backward compatibility.
     */
    Id?: __string;
    /**
     *  The Amazon Resource Name (ARN) of the identity, verified with Amazon Simple Email Service (Amazon SES), that's used when you send email through the channel.
     */
    Identity?: __string;
    /**
     * Specifies whether the email channel is archived.
     */
    IsArchived?: __boolean;
    /**
     * The user who last modified the email channel.
     */
    LastModifiedBy?: __string;
    /**
     * The date and time, in ISO 8601 format, when the email channel was last modified.
     */
    LastModifiedDate?: __string;
    /**
     * The maximum number of emails that can be sent through the channel each second.
     */
    MessagesPerSecond?: __integer;
    /**
     * The type of messaging or notification platform for the channel. For the email channel, this value is EMAIL.
     */
    Platform: __string;
    /**
     *  The ARN of the AWS Identity and Access Management (IAM) role that Amazon Pinpoint uses to submit email-related event data for the channel.
     */
    RoleArn?: __string;
    /**
     * The current version of the email channel.
     */
    Version?: __integer;
  }
  export interface EmailMessage {
    /**
     * The body of the email message.
     */
    Body?: __string;
    /**
     * The email address to forward bounces and complaints to, if feedback forwarding is enabled.
     */
    FeedbackForwardingAddress?: __string;
    /**
     * The verified email address to send the email message from. The default value is the FromAddress specified for the email channel.
     */
    FromAddress?: __string;
    /**
     * The email message, represented as a raw MIME message.
     */
    RawEmail?: RawEmail;
    /**
     * The reply-to email address(es) for the email message. If a recipient replies to the email, each reply-to address receives the reply.
     */
    ReplyToAddresses?: ListOf__string;
    /**
     * The email message, composed of a subject, a text part, and an HTML part.
     */
    SimpleEmail?: SimpleEmail;
    /**
     * The default message variables to use in the email message. You can override the default variables with individual address variables.
     */
    Substitutions?: MapOfListOf__string;
  }
  export interface EmailMessageActivity {
    /**
     * Specifies the sender address for an email message that's sent to participants in the journey.
     */
    MessageConfig?: JourneyEmailMessage;
    /**
     * The unique identifier for the next activity to perform, after the message is sent.
     */
    NextActivity?: __string;
    /**
     * The name of the email message template to use for the message. If specified, this value must match the name of an existing message template.
     */
    TemplateName?: __string;
    /**
     * The unique identifier for the version of the email template to use for the message. If specified, this value must match the identifier for an existing template version. To retrieve a list of versions and version identifiers for a template, use the Template Versions resource. If you don't specify a value for this property, Amazon Pinpoint uses the active version of the template. The active version is typically the version of a template that's been most recently reviewed and approved for use, depending on your workflow. It isn't necessarily the latest version of a template.
     */
    TemplateVersion?: __string;
  }
  export interface EmailTemplateRequest {
    /**
     * A JSON object that specifies the default values to use for message variables in the message template. This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the default value for that variable. When you create a message that's based on the template, you can override these defaults with message-specific and address-specific variables and values.
     */
    DefaultSubstitutions?: __string;
    /**
     * The message body, in HTML format, to use in email messages that are based on the message template. We recommend using HTML format for email clients that render HTML content. You can include links, formatted text, and more in an HTML message.
     */
    HtmlPart?: __string;
    /**
     * The unique identifier for the recommender model to use for the message template. Amazon Pinpoint uses this value to determine how to retrieve and process data from a recommender model when it sends messages that use the template, if the template contains message variables for recommendation data.
     */
    RecommenderId?: __string;
    /**
     * The subject line, or title, to use in email messages that are based on the message template.
     */
    Subject?: __string;
    /**
     * A string-to-string map of key-value pairs that defines the tags to associate with the message template. Each tag consists of a required tag key and an associated tag value.
     */
    tags?: MapOf__string;
    /**
     * A custom description of the message template.
     */
    TemplateDescription?: __string;
    /**
     * The message body, in plain text format, to use in email messages that are based on the message template. We recommend using plain text format for email clients that don't render HTML content and clients that are connected to high-latency networks, such as mobile devices.
     */
    TextPart?: __string;
  }
  export interface EmailTemplateResponse {
    /**
     * The Amazon Resource Name (ARN) of the message template.
     */
    Arn?: __string;
    /**
     * The date, in ISO 8601 format, when the message template was created.
     */
    CreationDate: __string;
    /**
     * The JSON object that specifies the default values that are used for message variables in the message template. This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the default value for that variable.
     */
    DefaultSubstitutions?: __string;
    /**
     * The message body, in HTML format, that's used in email messages that are based on the message template.
     */
    HtmlPart?: __string;
    /**
     * The date, in ISO 8601 format, when the message template was last modified.
     */
    LastModifiedDate: __string;
    /**
     * The unique identifier for the recommender model that's used by the message template.
     */
    RecommenderId?: __string;
    /**
     * The subject line, or title, that's used in email messages that are based on the message template.
     */
    Subject?: __string;
    /**
     * A string-to-string map of key-value pairs that identifies the tags that are associated with the message template. Each tag consists of a required tag key and an associated tag value.
     */
    tags?: MapOf__string;
    /**
     * The custom description of the message template.
     */
    TemplateDescription?: __string;
    /**
     * The name of the message template.
     */
    TemplateName: __string;
    /**
     * The type of channel that the message template is designed for. For an email template, this value is EMAIL.
     */
    TemplateType: TemplateType;
    /**
     * The message body, in plain text format, that's used in email messages that are based on the message template.
     */
    TextPart?: __string;
    /**
     * The unique identifier, as an integer, for the active version of the message template, or the version of the template that you specified by using the version parameter in your request.
     */
    Version?: __string;
  }
  export interface EndpointBatchItem {
    /**
     * The destination address for messages or push notifications that you send to the endpoint. The address varies by channel. For a push-notification channel, use the token provided by the push notification service, such as an Apple Push Notification service (APNs) device token or a Firebase Cloud Messaging (FCM) registration token. For the SMS channel, use a phone number in E.164 format, such as +12065550100. For the email channel, use an email address.
     */
    Address?: __string;
    /**
     * One or more custom attributes that describe the endpoint by associating a name with an array of values. For example, the value of a custom attribute named Interests might be: ["Science", "Music", "Travel"]. You can use these attributes as filter criteria when you create segments. Attribute names are case sensitive. An attribute name can contain up to 50 characters. An attribute value can contain up to 100 characters. When you define the name of a custom attribute, avoid using the following characters: number sign (#), colon (:), question mark (?), backslash (\), and slash (/). The Amazon Pinpoint console can't display attribute names that contain these characters. This restriction doesn't apply to attribute values.
     */
    Attributes?: MapOfListOf__string;
    /**
     * The channel to use when sending messages or push notifications to the endpoint.
     */
    ChannelType?: ChannelType;
    /**
     * The demographic information for the endpoint, such as the time zone and platform.
     */
    Demographic?: EndpointDemographic;
    /**
     * The date and time, in ISO 8601 format, when the endpoint was created or updated.
     */
    EffectiveDate?: __string;
    /**
     * Specifies whether to send messages or push notifications to the endpoint. Valid values are: ACTIVE, messages are sent to the endpoint; and, INACTIVE, messages aren’t sent to the endpoint. Amazon Pinpoint automatically sets this value to ACTIVE when you create an endpoint or update an existing endpoint. Amazon Pinpoint automatically sets this value to INACTIVE if you update another endpoint that has the same address specified by the Address property.
     */
    EndpointStatus?: __string;
    /**
     * The unique identifier for the endpoint in the context of the batch.
     */
    Id?: __string;
    /**
     * The geographic information for the endpoint.
     */
    Location?: EndpointLocation;
    /**
     * One or more custom metrics that your app reports to Amazon Pinpoint for the endpoint.
     */
    Metrics?: MapOf__double;
    /**
     * Specifies whether the user who's associated with the endpoint has opted out of receiving messages and push notifications from you. Possible values are: ALL, the user has opted out and doesn't want to receive any messages or push notifications; and, NONE, the user hasn't opted out and wants to receive all messages and push notifications.
     */
    OptOut?: __string;
    /**
     * The unique identifier for the request to create or update the endpoint.
     */
    RequestId?: __string;
    /**
     * One or more custom attributes that describe the user who's associated with the endpoint.
     */
    User?: EndpointUser;
  }
  export interface EndpointBatchRequest {
    /**
     * An array that defines the endpoints to create or update and, for each endpoint, the property values to set or change. An array can contain a maximum of 100 items.
     */
    Item: ListOfEndpointBatchItem;
  }
  export interface EndpointDemographic {
    /**
     * The version of the app that's associated with the endpoint.
     */
    AppVersion?: __string;
    /**
     * The locale of the endpoint, in the following format: the ISO 639-1 alpha-2 code, followed by an underscore (_), followed by an ISO 3166-1 alpha-2 value.
     */
    Locale?: __string;
    /**
     * The manufacturer of the endpoint device, such as apple or samsung.
     */
    Make?: __string;
    /**
     * The model name or number of the endpoint device, such as iPhone or SM-G900F.
     */
    Model?: __string;
    /**
     * The model version of the endpoint device.
     */
    ModelVersion?: __string;
    /**
     * The platform of the endpoint device, such as ios.
     */
    Platform?: __string;
    /**
     * The platform version of the endpoint device.
     */
    PlatformVersion?: __string;
    /**
     * The time zone of the endpoint, specified as a tz database name value, such as America/Los_Angeles.
     */
    Timezone?: __string;
  }
  export interface EndpointItemResponse {
    /**
     * The custom message that's returned in the response as a result of processing the endpoint data.
     */
    Message?: __string;
    /**
     * The status code that's returned in the response as a result of processing the endpoint data.
     */
    StatusCode?: __integer;
  }
  export interface EndpointLocation {
    /**
     * The name of the city where the endpoint is located.
     */
    City?: __string;
    /**
     * The two-character code, in ISO 3166-1 alpha-2 format, for the country or region where the endpoint is located. For example, US for the United States.
     */
    Country?: __string;
    /**
     * The latitude coordinate of the endpoint location, rounded to one decimal place.
     */
    Latitude?: __double;
    /**
     * The longitude coordinate of the endpoint location, rounded to one decimal place.
     */
    Longitude?: __double;
    /**
     * The postal or ZIP code for the area where the endpoint is located.
     */
    PostalCode?: __string;
    /**
     * The name of the region where the endpoint is located. For locations in the United States, this value is the name of a state.
     */
    Region?: __string;
  }
  export interface EndpointMessageResult {
    /**
     * The endpoint address that the message was delivered to.
     */
    Address?: __string;
    /**
     * The delivery status of the message. Possible values are:  DUPLICATE - The endpoint address is a duplicate of another endpoint address. Amazon Pinpoint won't attempt to send the message again. OPT_OUT - The user who's associated with the endpoint has opted out of receiving messages from you. Amazon Pinpoint won't attempt to send the message again. PERMANENT_FAILURE - An error occurred when delivering the message to the endpoint. Amazon Pinpoint won't attempt to send the message again.    SUCCESSFUL - The message was successfully delivered to the endpoint. TEMPORARY_FAILURE - A temporary error occurred. Amazon Pinpoint won't attempt to send the message again. THROTTLED - Amazon Pinpoint throttled the operation to send the message to the endpoint. TIMEOUT - The message couldn't be sent within the timeout period. UNKNOWN_FAILURE - An unknown error occurred.
     */
    DeliveryStatus: DeliveryStatus;
    /**
     * The unique identifier for the message that was sent.
     */
    MessageId?: __string;
    /**
     * The downstream service status code for delivering the message.
     */
    StatusCode: __integer;
    /**
     * The status message for delivering the message.
     */
    StatusMessage?: __string;
    /**
     * For push notifications that are sent through the GCM channel, specifies whether the endpoint's device registration token was updated as part of delivering the message.
     */
    UpdatedToken?: __string;
  }
  export interface EndpointRequest {
    /**
     * The destination address for messages or push notifications that you send to the endpoint. The address varies by channel. For a push-notification channel, use the token provided by the push notification service, such as an Apple Push Notification service (APNs) device token or a Firebase Cloud Messaging (FCM) registration token. For the SMS channel, use a phone number in E.164 format, such as +12065550100. For the email channel, use an email address.
     */
    Address?: __string;
    /**
     * One or more custom attributes that describe the endpoint by associating a name with an array of values. For example, the value of a custom attribute named Interests might be: ["Science", "Music", "Travel"]. You can use these attributes as filter criteria when you create segments. Attribute names are case sensitive. An attribute name can contain up to 50 characters. An attribute value can contain up to 100 characters. When you define the name of a custom attribute, avoid using the following characters: number sign (#), colon (:), question mark (?), backslash (\), and slash (/). The Amazon Pinpoint console can't display attribute names that contain these characters. This restriction doesn't apply to attribute values.
     */
    Attributes?: MapOfListOf__string;
    /**
     * The channel to use when sending messages or push notifications to the endpoint.
     */
    ChannelType?: ChannelType;
    /**
     * The demographic information for the endpoint, such as the time zone and platform.
     */
    Demographic?: EndpointDemographic;
    /**
     * The date and time, in ISO 8601 format, when the endpoint is updated.
     */
    EffectiveDate?: __string;
    /**
     * Specifies whether to send messages or push notifications to the endpoint. Valid values are: ACTIVE, messages are sent to the endpoint; and, INACTIVE, messages aren’t sent to the endpoint. Amazon Pinpoint automatically sets this value to ACTIVE when you create an endpoint or update an existing endpoint. Amazon Pinpoint automatically sets this value to INACTIVE if you update another endpoint that has the same address specified by the Address property.
     */
    EndpointStatus?: __string;
    /**
     * The geographic information for the endpoint.
     */
    Location?: EndpointLocation;
    /**
     * One or more custom metrics that your app reports to Amazon Pinpoint for the endpoint.
     */
    Metrics?: MapOf__double;
    /**
     * Specifies whether the user who's associated with the endpoint has opted out of receiving messages and push notifications from you. Possible values are: ALL, the user has opted out and doesn't want to receive any messages or push notifications; and, NONE, the user hasn't opted out and wants to receive all messages and push notifications.
     */
    OptOut?: __string;
    /**
     * The unique identifier for the most recent request to update the endpoint.
     */
    RequestId?: __string;
    /**
     * One or more custom attributes that describe the user who's associated with the endpoint.
     */
    User?: EndpointUser;
  }
  export interface EndpointResponse {
    /**
     * The destination address for messages or push notifications that you send to the endpoint. The address varies by channel. For example, the address for a push-notification channel is typically the token provided by a push notification service, such as an Apple Push Notification service (APNs) device token or a Firebase Cloud Messaging (FCM) registration token. The address for the SMS channel is a phone number in E.164 format, such as +12065550100. The address for the email channel is an email address.
     */
    Address?: __string;
    /**
     * The unique identifier for the application that's associated with the endpoint.
     */
    ApplicationId?: __string;
    /**
     * One or more custom attributes that describe the endpoint by associating a name with an array of values. For example, the value of a custom attribute named Interests might be: ["Science", "Music", "Travel"]. You can use these attributes as filter criteria when you create segments.
     */
    Attributes?: MapOfListOf__string;
    /**
     * The channel that's used when sending messages or push notifications to the endpoint.
     */
    ChannelType?: ChannelType;
    /**
     * A number from 0-99 that represents the cohort that the endpoint is assigned to. Endpoints are grouped into cohorts randomly, and each cohort contains approximately 1 percent of the endpoints for an application. Amazon Pinpoint assigns cohorts to the holdout or treatment allocations for campaigns.
     */
    CohortId?: __string;
    /**
     * The date and time, in ISO 8601 format, when the endpoint was created.
     */
    CreationDate?: __string;
    /**
     * The demographic information for the endpoint, such as the time zone and platform.
     */
    Demographic?: EndpointDemographic;
    /**
     * The date and time, in ISO 8601 format, when the endpoint was last updated.
     */
    EffectiveDate?: __string;
    /**
     * Specifies whether messages or push notifications are sent to the endpoint. Possible values are: ACTIVE, messages are sent to the endpoint; and, INACTIVE, messages aren’t sent to the endpoint. Amazon Pinpoint automatically sets this value to ACTIVE when you create an endpoint or update an existing endpoint. Amazon Pinpoint automatically sets this value to INACTIVE if you update another endpoint that has the same address specified by the Address property.
     */
    EndpointStatus?: __string;
    /**
     * The unique identifier that you assigned to the endpoint. The identifier should be a globally unique identifier (GUID) to ensure that it doesn't conflict with other endpoint identifiers that are associated with the application.
     */
    Id?: __string;
    /**
     * The geographic information for the endpoint.
     */
    Location?: EndpointLocation;
    /**
     * One or more custom metrics that your app reports to Amazon Pinpoint for the endpoint.
     */
    Metrics?: MapOf__double;
    /**
     * Specifies whether the user who's associated with the endpoint has opted out of receiving messages and push notifications from you. Possible values are: ALL, the user has opted out and doesn't want to receive any messages or push notifications; and, NONE, the user hasn't opted out and wants to receive all messages and push notifications.
     */
    OptOut?: __string;
    /**
     * The unique identifier for the most recent request to update the endpoint.
     */
    RequestId?: __string;
    /**
     * One or more custom user attributes that your app reports to Amazon Pinpoint for the user who's associated with the endpoint.
     */
    User?: EndpointUser;
  }
  export interface EndpointSendConfiguration {
    /**
     * The body of the message. If specified, this value overrides the default message body.
     */
    BodyOverride?: __string;
    /**
     * A map of custom attributes to attach to the message for the address. Attribute names are case sensitive. For a push notification, this payload is added to the data.pinpoint object. For an email or text message, this payload is added to email/SMS delivery receipt event attributes.
     */
    Context?: MapOf__string;
    /**
     * The raw, JSON-formatted string to use as the payload for the message. If specified, this value overrides all other values for the message.
     */
    RawContent?: __string;
    /**
     * A map of the message variables to merge with the variables specified for the default message (DefaultMessage.Substitutions). The variables specified in this map take precedence over all other variables.
     */
    Substitutions?: MapOfListOf__string;
    /**
     * The title or subject line of the message. If specified, this value overrides the default message title or subject line.
     */
    TitleOverride?: __string;
  }
  export interface EndpointUser {
    /**
     * One or more custom attributes that describe the user by associating a name with an array of values. For example, the value of an attribute named Interests might be: ["Science", "Music", "Travel"]. You can use these attributes as filter criteria when you create segments. Attribute names are case sensitive. An attribute name can contain up to 50 characters. An attribute value can contain up to 100 characters. When you define the name of a custom attribute, avoid using the following characters: number sign (#), colon (:), question mark (?), backslash (\), and slash (/). The Amazon Pinpoint console can't display attribute names that contain these characters. This restriction doesn't apply to attribute values.
     */
    UserAttributes?: MapOfListOf__string;
    /**
     * The unique identifier for the user.
     */
    UserId?: __string;
  }
  export interface EndpointsResponse {
    /**
     * An array of responses, one for each endpoint that's associated with the user ID.
     */
    Item: ListOfEndpointResponse;
  }
  export interface Event {
    /**
     * The package name of the app that's recording the event.
     */
    AppPackageName?: __string;
    /**
     * The title of the app that's recording the event.
     */
    AppTitle?: __string;
    /**
     * The version number of the app that's recording the event.
     */
    AppVersionCode?: __string;
    /**
     * One or more custom attributes that are associated with the event.
     */
    Attributes?: MapOf__string;
    /**
     * The version of the SDK that's running on the client device.
     */
    ClientSdkVersion?: __string;
    /**
     * The name of the event.
     */
    EventType: __string;
    /**
     * One or more custom metrics that are associated with the event.
     */
    Metrics?: MapOf__double;
    /**
     * The name of the SDK that's being used to record the event.
     */
    SdkName?: __string;
    /**
     * Information about the session in which the event occurred.
     */
    Session?: Session;
    /**
     * The date and time, in ISO 8601 format, when the event occurred.
     */
    Timestamp: __string;
  }
  export interface EventCondition {
    /**
     * The dimensions for the event filter to use for the activity.
     */
    Dimensions?: EventDimensions;
    /**
     * The message identifier (message_id) for the message to use when determining whether message events meet the condition.
     */
    MessageActivity?: __string;
  }
  export interface EventDimensions {
    /**
     * One or more custom attributes that your application reports to Amazon Pinpoint. You can use these attributes as selection criteria when you create an event filter.
     */
    Attributes?: MapOfAttributeDimension;
    /**
     * The name of the event that causes the campaign to be sent or the journey activity to be performed. This can be a standard event that Amazon Pinpoint generates, such as _email.delivered. For campaigns, this can also be a custom event that's specific to your application. For information about standard events, see Streaming Amazon Pinpoint Events in the Amazon Pinpoint Developer Guide.
     */
    EventType?: SetDimension;
    /**
     * One or more custom metrics that your application reports to Amazon Pinpoint. You can use these metrics as selection criteria when you create an event filter.
     */
    Metrics?: MapOfMetricDimension;
  }
  export interface EventFilter {
    /**
     * The dimensions for the event filter to use for the campaign or the journey activity.
     */
    Dimensions: EventDimensions;
    /**
     * The type of event that causes the campaign to be sent or the journey activity to be performed. Valid values are: SYSTEM, sends the campaign or performs the activity when a system event occurs; and, ENDPOINT, sends the campaign or performs the activity when an endpoint event (Events resource) occurs.
     */
    FilterType: FilterType;
  }
  export interface EventItemResponse {
    /**
     * A custom message that's returned in the response as a result of processing the event.
     */
    Message?: __string;
    /**
     * The status code that's returned in the response as a result of processing the event. Possible values are: 202, for events that were accepted; and, 400, for events that weren't valid.
     */
    StatusCode?: __integer;
  }
  export interface EventStartCondition {
    EventFilter?: EventFilter;
    SegmentId?: __string;
  }
  export interface EventStream {
    /**
     * The unique identifier for the application to publish event data for.
     */
    ApplicationId: __string;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Kinesis data stream or Amazon Kinesis Data Firehose delivery stream to publish event data to. For a Kinesis data stream, the ARN format is: arn:aws:kinesis:region:account-id:stream/stream_name
                For a Kinesis Data Firehose delivery stream, the ARN format is: arn:aws:firehose:region:account-id:deliverystream/stream_name
               
     */
    DestinationStreamArn: __string;
    /**
     * (Deprecated) Your AWS account ID, which you assigned to an external ID key in an IAM trust policy. Amazon Pinpoint previously used this value to assume an IAM role when publishing event data, but we removed this requirement. We don't recommend use of external IDs for IAM roles that are assumed by Amazon Pinpoint.
     */
    ExternalId?: __string;
    /**
     * The date, in ISO 8601 format, when the event stream was last modified.
     */
    LastModifiedDate?: __string;
    /**
     * The IAM user who last modified the event stream.
     */
    LastUpdatedBy?: __string;
    /**
     * The AWS Identity and Access Management (IAM) role that authorizes Amazon Pinpoint to publish event data to the stream in your AWS account.
     */
    RoleArn: __string;
  }
  export interface EventsBatch {
    /**
     * A set of properties and attributes that are associated with the endpoint.
     */
    Endpoint: PublicEndpoint;
    /**
     * A set of properties that are associated with the event.
     */
    Events: MapOfEvent;
  }
  export interface EventsRequest {
    /**
     * The batch of events to process. For each item in a batch, the endpoint ID acts as a key that has an EventsBatch object as its value.
     */
    BatchItem: MapOfEventsBatch;
  }
  export interface EventsResponse {
    /**
     * A map that contains a multipart response for each endpoint. For each item in this object, the endpoint ID is the key and the item response is the value. If no item response exists, the value can also be one of the following: 202, the request was processed successfully; or 400, the payload wasn't valid or required fields were missing.
     */
    Results?: MapOfItemResponse;
  }
  export interface ExportJobRequest {
    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that authorizes Amazon Pinpoint to access the Amazon S3 location where you want to export endpoint definitions to.
     */
    RoleArn: __string;
    /**
     * The URL of the location in an Amazon Simple Storage Service (Amazon S3) bucket where you want to export endpoint definitions to. This location is typically a folder that contains multiple files. The URL should be in the following format: s3://bucket-name/folder-name/.
     */
    S3UrlPrefix: __string;
    /**
     * The identifier for the segment to export endpoint definitions from. If you don't specify this value, Amazon Pinpoint exports definitions for all the endpoints that are associated with the application.
     */
    SegmentId?: __string;
    /**
     * The version of the segment to export endpoint definitions from, if specified.
     */
    SegmentVersion?: __integer;
  }
  export interface ExportJobResource {
    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that authorized Amazon Pinpoint to access the Amazon S3 location where the endpoint definitions were exported to.
     */
    RoleArn: __string;
    /**
     * The URL of the location in an Amazon Simple Storage Service (Amazon S3) bucket where the endpoint definitions were exported to. This location is typically a folder that contains multiple files. The URL should be in the following format: s3://bucket-name/folder-name/.
     */
    S3UrlPrefix: __string;
    /**
     * The identifier for the segment that the endpoint definitions were exported from. If this value isn't present, Amazon Pinpoint exported definitions for all the endpoints that are associated with the application.
     */
    SegmentId?: __string;
    /**
     * The version of the segment that the endpoint definitions were exported from.
     */
    SegmentVersion?: __integer;
  }
  export interface ExportJobResponse {
    /**
     * The unique identifier for the application that's associated with the export job.
     */
    ApplicationId: __string;
    /**
     * The number of pieces that were processed successfully (completed) by the export job, as of the time of the request.
     */
    CompletedPieces?: __integer;
    /**
     * The date, in ISO 8601 format, when the export job was completed.
     */
    CompletionDate?: __string;
    /**
     * The date, in ISO 8601 format, when the export job was created.
     */
    CreationDate: __string;
    /**
     * The resource settings that apply to the export job.
     */
    Definition: ExportJobResource;
    /**
     * The number of pieces that weren't processed successfully (failed) by the export job, as of the time of the request.
     */
    FailedPieces?: __integer;
    /**
     * An array of entries, one for each of the first 100 entries that weren't processed successfully (failed) by the export job, if any.
     */
    Failures?: ListOf__string;
    /**
     * The unique identifier for the export job.
     */
    Id: __string;
    /**
     * The status of the export job. The job status is FAILED if Amazon Pinpoint wasn't able to process one or more pieces in the job.
     */
    JobStatus: JobStatus;
    /**
     * The total number of endpoint definitions that weren't processed successfully (failed) by the export job, typically because an error, such as a syntax error, occurred.
     */
    TotalFailures?: __integer;
    /**
     * The total number of pieces that must be processed to complete the export job. Each piece consists of an approximately equal portion of the endpoint definitions that are part of the export job.
     */
    TotalPieces?: __integer;
    /**
     * The total number of endpoint definitions that were processed by the export job.
     */
    TotalProcessed?: __integer;
    /**
     * The job type. This value is EXPORT for export jobs.
     */
    Type: __string;
  }
  export interface ExportJobsResponse {
    /**
     * An array of responses, one for each export job that's associated with the application (Export Jobs resource) or segment (Segment Export Jobs resource).
     */
    Item: ListOfExportJobResponse;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    NextToken?: __string;
  }
  export type FilterType = "SYSTEM"|"ENDPOINT"|string;
  export type Format = "CSV"|"JSON"|string;
  export type Frequency = "ONCE"|"HOURLY"|"DAILY"|"WEEKLY"|"MONTHLY"|"EVENT"|"IN_APP_EVENT"|string;
  export interface GCMChannelRequest {
    /**
     * The Web API Key, also referred to as an API_KEY or server key, that you received from Google to communicate with Google services.
     */
    ApiKey: __string;
    /**
     * Specifies whether to enable the GCM channel for the application.
     */
    Enabled?: __boolean;
  }
  export interface GCMChannelResponse {
    /**
     * The unique identifier for the application that the GCM channel applies to.
     */
    ApplicationId?: __string;
    /**
     * The date and time when the GCM channel was enabled.
     */
    CreationDate?: __string;
    /**
     * The Web API Key, also referred to as an API_KEY or server key, that you received from Google to communicate with Google services.
     */
    Credential: __string;
    /**
     * Specifies whether the GCM channel is enabled for the application.
     */
    Enabled?: __boolean;
    /**
     * (Not used) This property is retained only for backward compatibility.
     */
    HasCredential?: __boolean;
    /**
     * (Deprecated) An identifier for the GCM channel. This property is retained only for backward compatibility.
     */
    Id?: __string;
    /**
     * Specifies whether the GCM channel is archived.
     */
    IsArchived?: __boolean;
    /**
     * The user who last modified the GCM channel.
     */
    LastModifiedBy?: __string;
    /**
     * The date and time when the GCM channel was last modified.
     */
    LastModifiedDate?: __string;
    /**
     * The type of messaging or notification platform for the channel. For the GCM channel, this value is GCM.
     */
    Platform: __string;
    /**
     * The current version of the GCM channel.
     */
    Version?: __integer;
  }
  export interface GCMMessage {
    /**
     * The action to occur if the recipient taps the push notification. Valid values are: OPEN_APP - Your app opens or it becomes the foreground app if it was sent to the background. This is the default action. DEEP_LINK - Your app opens and displays a designated user interface in the app. This action uses the deep-linking features of the Android platform. URL - The default mobile browser on the recipient's device opens and loads the web page at a URL that you specify.
     */
    Action?: Action;
    /**
     * The body of the notification message.
     */
    Body?: __string;
    /**
     * An arbitrary string that identifies a group of messages that can be collapsed to ensure that only the last message is sent when delivery can resume. This helps avoid sending too many instances of the same messages when the recipient's device comes online again or becomes active. Amazon Pinpoint specifies this value in the Firebase Cloud Messaging (FCM) collapse_key parameter when it sends the notification message to FCM.
     */
    CollapseKey?: __string;
    /**
     * The JSON data payload to use for the push notification, if the notification is a silent push notification. This payload is added to the data.pinpoint.jsonBody object of the notification.
     */
    Data?: MapOf__string;
    /**
     * The icon image name of the asset saved in your app.
     */
    IconReference?: __string;
    /**
     * The URL of the large icon image to display in the content view of the push notification.
     */
    ImageIconUrl?: __string;
    /**
     * The URL of an image to display in the push notification.
     */
    ImageUrl?: __string;
    /**
     * para>normal - The notification might be delayed. Delivery is optimized for battery usage on the recipient's device. Use this value unless immediate delivery is required./listitem> high - The notification is sent immediately and might wake a sleeping device./para> Amazon Pinpoint specifies this value in the FCM priority parameter when it sends the notification message to FCM. The equivalent values for Apple Push Notification service (APNs) are 5, for normal, and 10, for high. If you specify an APNs value for this property, Amazon Pinpoint accepts and converts the value to the corresponding FCM value.
     */
    Priority?: __string;
    /**
     * The raw, JSON-formatted string to use as the payload for the notification message. If specified, this value overrides all other content for the message.
     */
    RawContent?: __string;
    /**
     * The package name of the application where registration tokens must match in order for the recipient to receive the message.
     */
    RestrictedPackageName?: __string;
    /**
     * Specifies whether the notification is a silent push notification, which is a push notification that doesn't display on a recipient's device. Silent push notifications can be used for cases such as updating an app's configuration or supporting phone home functionality.
     */
    SilentPush?: __boolean;
    /**
     * The URL of the small icon image to display in the status bar and the content view of the push notification.
     */
    SmallImageIconUrl?: __string;
    /**
     * The sound to play when the recipient receives the push notification. You can use the default stream or specify the file name of a sound resource that's bundled in your app. On an Android platform, the sound file must reside in /res/raw/.
     */
    Sound?: __string;
    /**
     * The default message variables to use in the notification message. You can override the default variables with individual address variables.
     */
    Substitutions?: MapOfListOf__string;
    /**
     * The amount of time, in seconds, that FCM should store and attempt to deliver the push notification, if the service is unable to deliver the notification the first time. If you don't specify this value, FCM defaults to the maximum value, which is 2,419,200 seconds (28 days). Amazon Pinpoint specifies this value in the FCM time_to_live parameter when it sends the notification message to FCM.
     */
    TimeToLive?: __integer;
    /**
     * The title to display above the notification message on the recipient's device.
     */
    Title?: __string;
    /**
     * The URL to open in the recipient's default mobile browser, if a recipient taps the push notification and the value of the Action property is URL.
     */
    Url?: __string;
  }
  export interface GPSCoordinates {
    /**
     * The latitude coordinate of the location.
     */
    Latitude: __double;
    /**
     * The longitude coordinate of the location.
     */
    Longitude: __double;
  }
  export interface GPSPointDimension {
    /**
     * The GPS coordinates to measure distance from.
     */
    Coordinates: GPSCoordinates;
    /**
     * The range, in kilometers, from the GPS coordinates.
     */
    RangeInKilometers?: __double;
  }
  export interface GetAdmChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface GetAdmChannelResponse {
    ADMChannelResponse: ADMChannelResponse;
  }
  export interface GetApnsChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface GetApnsChannelResponse {
    APNSChannelResponse: APNSChannelResponse;
  }
  export interface GetApnsSandboxChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface GetApnsSandboxChannelResponse {
    APNSSandboxChannelResponse: APNSSandboxChannelResponse;
  }
  export interface GetApnsVoipChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface GetApnsVoipChannelResponse {
    APNSVoipChannelResponse: APNSVoipChannelResponse;
  }
  export interface GetApnsVoipSandboxChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface GetApnsVoipSandboxChannelResponse {
    APNSVoipSandboxChannelResponse: APNSVoipSandboxChannelResponse;
  }
  export interface GetAppRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface GetAppResponse {
    ApplicationResponse: ApplicationResponse;
  }
  export interface GetApplicationDateRangeKpiRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The last date and time to retrieve data for, as part of an inclusive date range that filters the query results. This value should be in extended ISO 8601 format and use Coordinated Universal Time (UTC), for example: 2019-07-26T20:00:00Z for 8:00 PM UTC July 26, 2019.
     */
    EndTime?: __timestampIso8601;
    /**
     * The name of the metric, also referred to as a key performance indicator (KPI), to retrieve data for. This value describes the associated metric and consists of two or more terms, which are comprised of lowercase alphanumeric characters, separated by a hyphen. Examples are email-open-rate and successful-delivery-rate. For a list of valid values, see the Amazon Pinpoint Developer Guide.
     */
    KpiName: __string;
    /**
     * The  string that specifies which page of results to return in a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    NextToken?: __string;
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
    /**
     * The first date and time to retrieve data for, as part of an inclusive date range that filters the query results. This value should be in extended ISO 8601 format and use Coordinated Universal Time (UTC), for example: 2019-07-19T20:00:00Z for 8:00 PM UTC July 19, 2019. This value should also be fewer than 90 days from the current day.
     */
    StartTime?: __timestampIso8601;
  }
  export interface GetApplicationDateRangeKpiResponse {
    ApplicationDateRangeKpiResponse: ApplicationDateRangeKpiResponse;
  }
  export interface GetApplicationSettingsRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface GetApplicationSettingsResponse {
    ApplicationSettingsResource: ApplicationSettingsResource;
  }
  export interface GetAppsRequest {
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
    /**
     * The NextToken string that specifies which page of results to return in a paginated response.
     */
    Token?: __string;
  }
  export interface GetAppsResponse {
    ApplicationsResponse: ApplicationsResponse;
  }
  export interface GetBaiduChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface GetBaiduChannelResponse {
    BaiduChannelResponse: BaiduChannelResponse;
  }
  export interface GetCampaignActivitiesRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the campaign.
     */
    CampaignId: __string;
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
    /**
     * The NextToken string that specifies which page of results to return in a paginated response.
     */
    Token?: __string;
  }
  export interface GetCampaignActivitiesResponse {
    ActivitiesResponse: ActivitiesResponse;
  }
  export interface GetCampaignDateRangeKpiRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the campaign.
     */
    CampaignId: __string;
    /**
     * The last date and time to retrieve data for, as part of an inclusive date range that filters the query results. This value should be in extended ISO 8601 format and use Coordinated Universal Time (UTC), for example: 2019-07-26T20:00:00Z for 8:00 PM UTC July 26, 2019.
     */
    EndTime?: __timestampIso8601;
    /**
     * The name of the metric, also referred to as a key performance indicator (KPI), to retrieve data for. This value describes the associated metric and consists of two or more terms, which are comprised of lowercase alphanumeric characters, separated by a hyphen. Examples are email-open-rate and successful-delivery-rate. For a list of valid values, see the Amazon Pinpoint Developer Guide.
     */
    KpiName: __string;
    /**
     * The  string that specifies which page of results to return in a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    NextToken?: __string;
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
    /**
     * The first date and time to retrieve data for, as part of an inclusive date range that filters the query results. This value should be in extended ISO 8601 format and use Coordinated Universal Time (UTC), for example: 2019-07-19T20:00:00Z for 8:00 PM UTC July 19, 2019. This value should also be fewer than 90 days from the current day.
     */
    StartTime?: __timestampIso8601;
  }
  export interface GetCampaignDateRangeKpiResponse {
    CampaignDateRangeKpiResponse: CampaignDateRangeKpiResponse;
  }
  export interface GetCampaignRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the campaign.
     */
    CampaignId: __string;
  }
  export interface GetCampaignResponse {
    CampaignResponse: CampaignResponse;
  }
  export interface GetCampaignVersionRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the campaign.
     */
    CampaignId: __string;
    /**
     * The unique version number (Version property) for the campaign version.
     */
    Version: __string;
  }
  export interface GetCampaignVersionResponse {
    CampaignResponse: CampaignResponse;
  }
  export interface GetCampaignVersionsRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the campaign.
     */
    CampaignId: __string;
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
    /**
     * The NextToken string that specifies which page of results to return in a paginated response.
     */
    Token?: __string;
  }
  export interface GetCampaignVersionsResponse {
    CampaignsResponse: CampaignsResponse;
  }
  export interface GetCampaignsRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
    /**
     * The NextToken string that specifies which page of results to return in a paginated response.
     */
    Token?: __string;
  }
  export interface GetCampaignsResponse {
    CampaignsResponse: CampaignsResponse;
  }
  export interface GetChannelsRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface GetChannelsResponse {
    ChannelsResponse: ChannelsResponse;
  }
  export interface GetEmailChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface GetEmailChannelResponse {
    EmailChannelResponse: EmailChannelResponse;
  }
  export interface GetEmailTemplateRequest {
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
    /**
     * The unique identifier for the version of the message template to update, retrieve information about, or delete. To retrieve identifiers and other information for all the versions of a template, use the Template Versions resource. If specified, this value must match the identifier for an existing template version. If specified for an update operation, this value must match the identifier for the latest existing version of the template. This restriction helps ensure that race conditions don't occur. If you don't specify a value for this parameter, Amazon Pinpoint does the following: For a get operation, retrieves information about the active version of the template. For an update operation, saves the updates to (overwrites) the latest existing version of the template, if the create-new-version parameter isn't used or is set to false. For a delete operation, deletes the template, including all versions of the template.
     */
    Version?: __string;
  }
  export interface GetEmailTemplateResponse {
    EmailTemplateResponse: EmailTemplateResponse;
  }
  export interface GetEndpointRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the endpoint.
     */
    EndpointId: __string;
  }
  export interface GetEndpointResponse {
    EndpointResponse: EndpointResponse;
  }
  export interface GetEventStreamRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface GetEventStreamResponse {
    EventStream: EventStream;
  }
  export interface GetExportJobRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the job.
     */
    JobId: __string;
  }
  export interface GetExportJobResponse {
    ExportJobResponse: ExportJobResponse;
  }
  export interface GetExportJobsRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
    /**
     * The NextToken string that specifies which page of results to return in a paginated response.
     */
    Token?: __string;
  }
  export interface GetExportJobsResponse {
    ExportJobsResponse: ExportJobsResponse;
  }
  export interface GetGcmChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface GetGcmChannelResponse {
    GCMChannelResponse: GCMChannelResponse;
  }
  export interface GetImportJobRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the job.
     */
    JobId: __string;
  }
  export interface GetImportJobResponse {
    ImportJobResponse: ImportJobResponse;
  }
  export interface GetImportJobsRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
    /**
     * The NextToken string that specifies which page of results to return in a paginated response.
     */
    Token?: __string;
  }
  export interface GetImportJobsResponse {
    ImportJobsResponse: ImportJobsResponse;
  }
  export interface GetInAppMessagesRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the endpoint.
     */
    EndpointId: __string;
  }
  export interface GetInAppMessagesResponse {
    InAppMessagesResponse: InAppMessagesResponse;
  }
  export interface GetInAppTemplateRequest {
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
    /**
     * The unique identifier for the version of the message template to update, retrieve information about, or delete. To retrieve identifiers and other information for all the versions of a template, use the Template Versions resource. If specified, this value must match the identifier for an existing template version. If specified for an update operation, this value must match the identifier for the latest existing version of the template. This restriction helps ensure that race conditions don't occur. If you don't specify a value for this parameter, Amazon Pinpoint does the following: For a get operation, retrieves information about the active version of the template. For an update operation, saves the updates to (overwrites) the latest existing version of the template, if the create-new-version parameter isn't used or is set to false. For a delete operation, deletes the template, including all versions of the template.
     */
    Version?: __string;
  }
  export interface GetInAppTemplateResponse {
    InAppTemplateResponse: InAppTemplateResponse;
  }
  export interface GetJourneyDateRangeKpiRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The last date and time to retrieve data for, as part of an inclusive date range that filters the query results. This value should be in extended ISO 8601 format and use Coordinated Universal Time (UTC), for example: 2019-07-26T20:00:00Z for 8:00 PM UTC July 26, 2019.
     */
    EndTime?: __timestampIso8601;
    /**
     * The unique identifier for the journey.
     */
    JourneyId: __string;
    /**
     * The name of the metric, also referred to as a key performance indicator (KPI), to retrieve data for. This value describes the associated metric and consists of two or more terms, which are comprised of lowercase alphanumeric characters, separated by a hyphen. Examples are email-open-rate and successful-delivery-rate. For a list of valid values, see the Amazon Pinpoint Developer Guide.
     */
    KpiName: __string;
    /**
     * The  string that specifies which page of results to return in a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    NextToken?: __string;
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
    /**
     * The first date and time to retrieve data for, as part of an inclusive date range that filters the query results. This value should be in extended ISO 8601 format and use Coordinated Universal Time (UTC), for example: 2019-07-19T20:00:00Z for 8:00 PM UTC July 19, 2019. This value should also be fewer than 90 days from the current day.
     */
    StartTime?: __timestampIso8601;
  }
  export interface GetJourneyDateRangeKpiResponse {
    JourneyDateRangeKpiResponse: JourneyDateRangeKpiResponse;
  }
  export interface GetJourneyExecutionActivityMetricsRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the journey activity.
     */
    JourneyActivityId: __string;
    /**
     * The unique identifier for the journey.
     */
    JourneyId: __string;
    /**
     * The  string that specifies which page of results to return in a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    NextToken?: __string;
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
  }
  export interface GetJourneyExecutionActivityMetricsResponse {
    JourneyExecutionActivityMetricsResponse: JourneyExecutionActivityMetricsResponse;
  }
  export interface GetJourneyExecutionMetricsRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the journey.
     */
    JourneyId: __string;
    /**
     * The  string that specifies which page of results to return in a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    NextToken?: __string;
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
  }
  export interface GetJourneyExecutionMetricsResponse {
    JourneyExecutionMetricsResponse: JourneyExecutionMetricsResponse;
  }
  export interface GetJourneyRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the journey.
     */
    JourneyId: __string;
  }
  export interface GetJourneyResponse {
    JourneyResponse: JourneyResponse;
  }
  export interface GetPushTemplateRequest {
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
    /**
     * The unique identifier for the version of the message template to update, retrieve information about, or delete. To retrieve identifiers and other information for all the versions of a template, use the Template Versions resource. If specified, this value must match the identifier for an existing template version. If specified for an update operation, this value must match the identifier for the latest existing version of the template. This restriction helps ensure that race conditions don't occur. If you don't specify a value for this parameter, Amazon Pinpoint does the following: For a get operation, retrieves information about the active version of the template. For an update operation, saves the updates to (overwrites) the latest existing version of the template, if the create-new-version parameter isn't used or is set to false. For a delete operation, deletes the template, including all versions of the template.
     */
    Version?: __string;
  }
  export interface GetPushTemplateResponse {
    PushNotificationTemplateResponse: PushNotificationTemplateResponse;
  }
  export interface GetRecommenderConfigurationRequest {
    /**
     * The unique identifier for the recommender model configuration. This identifier is displayed as the Recommender ID on the Amazon Pinpoint console.
     */
    RecommenderId: __string;
  }
  export interface GetRecommenderConfigurationResponse {
    RecommenderConfigurationResponse: RecommenderConfigurationResponse;
  }
  export interface GetRecommenderConfigurationsRequest {
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
    /**
     * The NextToken string that specifies which page of results to return in a paginated response.
     */
    Token?: __string;
  }
  export interface GetRecommenderConfigurationsResponse {
    ListRecommenderConfigurationsResponse: ListRecommenderConfigurationsResponse;
  }
  export interface GetSegmentExportJobsRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
    /**
     * The unique identifier for the segment.
     */
    SegmentId: __string;
    /**
     * The NextToken string that specifies which page of results to return in a paginated response.
     */
    Token?: __string;
  }
  export interface GetSegmentExportJobsResponse {
    ExportJobsResponse: ExportJobsResponse;
  }
  export interface GetSegmentImportJobsRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
    /**
     * The unique identifier for the segment.
     */
    SegmentId: __string;
    /**
     * The NextToken string that specifies which page of results to return in a paginated response.
     */
    Token?: __string;
  }
  export interface GetSegmentImportJobsResponse {
    ImportJobsResponse: ImportJobsResponse;
  }
  export interface GetSegmentRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the segment.
     */
    SegmentId: __string;
  }
  export interface GetSegmentResponse {
    SegmentResponse: SegmentResponse;
  }
  export interface GetSegmentVersionRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the segment.
     */
    SegmentId: __string;
    /**
     * The unique version number (Version property) for the campaign version.
     */
    Version: __string;
  }
  export interface GetSegmentVersionResponse {
    SegmentResponse: SegmentResponse;
  }
  export interface GetSegmentVersionsRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
    /**
     * The unique identifier for the segment.
     */
    SegmentId: __string;
    /**
     * The NextToken string that specifies which page of results to return in a paginated response.
     */
    Token?: __string;
  }
  export interface GetSegmentVersionsResponse {
    SegmentsResponse: SegmentsResponse;
  }
  export interface GetSegmentsRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
    /**
     * The NextToken string that specifies which page of results to return in a paginated response.
     */
    Token?: __string;
  }
  export interface GetSegmentsResponse {
    SegmentsResponse: SegmentsResponse;
  }
  export interface GetSmsChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface GetSmsChannelResponse {
    SMSChannelResponse: SMSChannelResponse;
  }
  export interface GetSmsTemplateRequest {
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
    /**
     * The unique identifier for the version of the message template to update, retrieve information about, or delete. To retrieve identifiers and other information for all the versions of a template, use the Template Versions resource. If specified, this value must match the identifier for an existing template version. If specified for an update operation, this value must match the identifier for the latest existing version of the template. This restriction helps ensure that race conditions don't occur. If you don't specify a value for this parameter, Amazon Pinpoint does the following: For a get operation, retrieves information about the active version of the template. For an update operation, saves the updates to (overwrites) the latest existing version of the template, if the create-new-version parameter isn't used or is set to false. For a delete operation, deletes the template, including all versions of the template.
     */
    Version?: __string;
  }
  export interface GetSmsTemplateResponse {
    SMSTemplateResponse: SMSTemplateResponse;
  }
  export interface GetUserEndpointsRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the user.
     */
    UserId: __string;
  }
  export interface GetUserEndpointsResponse {
    EndpointsResponse: EndpointsResponse;
  }
  export interface GetVoiceChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface GetVoiceChannelResponse {
    VoiceChannelResponse: VoiceChannelResponse;
  }
  export interface GetVoiceTemplateRequest {
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
    /**
     * The unique identifier for the version of the message template to update, retrieve information about, or delete. To retrieve identifiers and other information for all the versions of a template, use the Template Versions resource. If specified, this value must match the identifier for an existing template version. If specified for an update operation, this value must match the identifier for the latest existing version of the template. This restriction helps ensure that race conditions don't occur. If you don't specify a value for this parameter, Amazon Pinpoint does the following: For a get operation, retrieves information about the active version of the template. For an update operation, saves the updates to (overwrites) the latest existing version of the template, if the create-new-version parameter isn't used or is set to false. For a delete operation, deletes the template, including all versions of the template.
     */
    Version?: __string;
  }
  export interface GetVoiceTemplateResponse {
    VoiceTemplateResponse: VoiceTemplateResponse;
  }
  export interface HoldoutActivity {
    /**
     * The unique identifier for the next activity to perform, after performing the holdout activity.
     */
    NextActivity?: __string;
    /**
     * The percentage of participants who shouldn't continue the journey. To determine which participants are held out, Amazon Pinpoint applies a probability-based algorithm to the percentage that you specify. Therefore, the actual percentage of participants who are held out may not be equal to the percentage that you specify.
     */
    Percentage: __integer;
  }
  export interface ImportJobRequest {
    /**
     * Specifies whether to create a segment that contains the endpoints, when the endpoint definitions are imported.
     */
    DefineSegment?: __boolean;
    /**
     * (Deprecated) Your AWS account ID, which you assigned to an external ID key in an IAM trust policy. Amazon Pinpoint previously used this value to assume an IAM role when importing endpoint definitions, but we removed this requirement. We don't recommend use of external IDs for IAM roles that are assumed by Amazon Pinpoint.
     */
    ExternalId?: __string;
    /**
     * The format of the files that contain the endpoint definitions to import. Valid values are: CSV, for comma-separated values format; and, JSON, for newline-delimited JSON format. If the Amazon S3 location stores multiple files that use different formats, Amazon Pinpoint imports data only from the files that use the specified format.
     */
    Format: Format;
    /**
     * Specifies whether to register the endpoints with Amazon Pinpoint, when the endpoint definitions are imported.
     */
    RegisterEndpoints?: __boolean;
    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that authorizes Amazon Pinpoint to access the Amazon S3 location to import endpoint definitions from.
     */
    RoleArn: __string;
    /**
     * The URL of the Amazon Simple Storage Service (Amazon S3) bucket that contains the endpoint definitions to import. This location can be a folder or a single file. If the location is a folder, Amazon Pinpoint imports endpoint definitions from the files in this location, including any subfolders that the folder contains. The URL should be in the following format: s3://bucket-name/folder-name/file-name. The location can end with the key for an individual object or a prefix that qualifies multiple objects.
     */
    S3Url: __string;
    /**
     * The identifier for the segment to update or add the imported endpoint definitions to, if the import job is meant to update an existing segment.
     */
    SegmentId?: __string;
    /**
     * A custom name for the segment that's created by the import job, if the value of the DefineSegment property is true.
     */
    SegmentName?: __string;
  }
  export interface ImportJobResource {
    /**
     * Specifies whether the import job creates a segment that contains the endpoints, when the endpoint definitions are imported.
     */
    DefineSegment?: __boolean;
    /**
     * (Deprecated) Your AWS account ID, which you assigned to an external ID key in an IAM trust policy. Amazon Pinpoint previously used this value to assume an IAM role when importing endpoint definitions, but we removed this requirement. We don't recommend use of external IDs for IAM roles that are assumed by Amazon Pinpoint.
     */
    ExternalId?: __string;
    /**
     * The format of the files that contain the endpoint definitions to import. Valid values are: CSV, for comma-separated values format; and, JSON, for newline-delimited JSON format. If the files are stored in an Amazon S3 location and that location contains multiple files that use different formats, Amazon Pinpoint imports data only from the files that use the specified format.
     */
    Format: Format;
    /**
     * Specifies whether the import job registers the endpoints with Amazon Pinpoint, when the endpoint definitions are imported.
     */
    RegisterEndpoints?: __boolean;
    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that authorizes Amazon Pinpoint to access the Amazon S3 location to import endpoint definitions from.
     */
    RoleArn: __string;
    /**
     * The URL of the Amazon Simple Storage Service (Amazon S3) bucket that contains the endpoint definitions to import. This location can be a folder or a single file. If the location is a folder, Amazon Pinpoint imports endpoint definitions from the files in this location, including any subfolders that the folder contains. The URL should be in the following format: s3://bucket-name/folder-name/file-name. The location can end with the key for an individual object or a prefix that qualifies multiple objects.
     */
    S3Url: __string;
    /**
     * The identifier for the segment that the import job updates or adds endpoint definitions to, if the import job updates an existing segment.
     */
    SegmentId?: __string;
    /**
     * The custom name for the segment that's created by the import job, if the value of the DefineSegment property is true.
     */
    SegmentName?: __string;
  }
  export interface ImportJobResponse {
    /**
     * The unique identifier for the application that's associated with the import job.
     */
    ApplicationId: __string;
    /**
     * The number of pieces that were processed successfully (completed) by the import job, as of the time of the request.
     */
    CompletedPieces?: __integer;
    /**
     * The date, in ISO 8601 format, when the import job was completed.
     */
    CompletionDate?: __string;
    /**
     * The date, in ISO 8601 format, when the import job was created.
     */
    CreationDate: __string;
    /**
     * The resource settings that apply to the import job.
     */
    Definition: ImportJobResource;
    /**
     * The number of pieces that weren't processed successfully (failed) by the import job, as of the time of the request.
     */
    FailedPieces?: __integer;
    /**
     * An array of entries, one for each of the first 100 entries that weren't processed successfully (failed) by the import job, if any.
     */
    Failures?: ListOf__string;
    /**
     * The unique identifier for the import job.
     */
    Id: __string;
    /**
     * The status of the import job. The job status is FAILED if Amazon Pinpoint wasn't able to process one or more pieces in the job.
     */
    JobStatus: JobStatus;
    /**
     * The total number of endpoint definitions that weren't processed successfully (failed) by the import job, typically because an error, such as a syntax error, occurred.
     */
    TotalFailures?: __integer;
    /**
     * The total number of pieces that must be processed to complete the import job. Each piece consists of an approximately equal portion of the endpoint definitions that are part of the import job.
     */
    TotalPieces?: __integer;
    /**
     * The total number of endpoint definitions that were processed by the import job.
     */
    TotalProcessed?: __integer;
    /**
     * The job type. This value is IMPORT for import jobs.
     */
    Type: __string;
  }
  export interface ImportJobsResponse {
    /**
     * An array of responses, one for each import job that's associated with the application (Import Jobs resource) or segment (Segment Import Jobs resource).
     */
    Item: ListOfImportJobResponse;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    NextToken?: __string;
  }
  export interface InAppCampaignSchedule {
    /**
     * The scheduled time after which the in-app message should not be shown. Timestamp is in ISO 8601 format.
     */
    EndDate?: __string;
    /**
     * The event filter the SDK has to use to show the in-app message in the application.
     */
    EventFilter?: CampaignEventFilter;
    /**
     * Time during which the in-app message should not be shown to the user.
     */
    QuietTime?: QuietTime;
  }
  export interface InAppMessage {
    /**
     * In-app message content.
     */
    Content?: ListOfInAppMessageContent;
    /**
     * Custom config to be sent to SDK.
     */
    CustomConfig?: MapOf__string;
    /**
     * The layout of the message.
     */
    Layout?: Layout;
  }
  export interface InAppMessageBodyConfig {
    /**
     * The alignment of the text. Valid values: LEFT, CENTER, RIGHT.
     */
    Alignment: Alignment;
    /**
     * Message Body.
     */
    Body: __string;
    /**
     * The text color.
     */
    TextColor: __string;
  }
  export interface InAppMessageButton {
    /**
     * Default button content.
     */
    Android?: OverrideButtonConfiguration;
    /**
     * Default button content.
     */
    DefaultConfig?: DefaultButtonConfiguration;
    /**
     * Default button content.
     */
    IOS?: OverrideButtonConfiguration;
    /**
     * Default button content.
     */
    Web?: OverrideButtonConfiguration;
  }
  export interface InAppMessageCampaign {
    /**
     * Campaign id of the corresponding campaign.
     */
    CampaignId?: __string;
    /**
     * Daily cap which controls the number of times any in-app messages can be shown to the endpoint during a day.
     */
    DailyCap?: __integer;
    /**
     * In-app message content with all fields required for rendering an in-app message.
     */
    InAppMessage?: InAppMessage;
    /**
     * Priority of the in-app message.
     */
    Priority?: __integer;
    /**
     * Schedule of the campaign.
     */
    Schedule?: InAppCampaignSchedule;
    /**
     * Session cap which controls the number of times an in-app message can be shown to the endpoint during an application session.
     */
    SessionCap?: __integer;
    /**
     * Total cap which controls the number of times an in-app message can be shown to the endpoint.
     */
    TotalCap?: __integer;
    /**
     * Treatment id of the campaign.
     */
    TreatmentId?: __string;
  }
  export interface InAppMessageContent {
    /**
     * The background color for the message.
     */
    BackgroundColor?: __string;
    /**
     * The configuration for the message body.
     */
    BodyConfig?: InAppMessageBodyConfig;
    /**
     * The configuration for the message header.
     */
    HeaderConfig?: InAppMessageHeaderConfig;
    /**
     * The image url for the background of message.
     */
    ImageUrl?: __string;
    /**
     * The first button inside the message.
     */
    PrimaryBtn?: InAppMessageButton;
    /**
     * The second button inside message.
     */
    SecondaryBtn?: InAppMessageButton;
  }
  export interface InAppMessageHeaderConfig {
    /**
     * The alignment of the text. Valid values: LEFT, CENTER, RIGHT.
     */
    Alignment: Alignment;
    /**
     * Message Header.
     */
    Header: __string;
    /**
     * The text color.
     */
    TextColor: __string;
  }
  export interface InAppMessagesResponse {
    /**
     * List of targeted in-app message campaigns.
     */
    InAppMessageCampaigns?: ListOfInAppMessageCampaign;
  }
  export interface InAppTemplateRequest {
    /**
     * The content of the message, can include up to 5 modals. Each modal must contain a message, a header, and background color. ImageUrl and buttons are optional.
     */
    Content?: ListOfInAppMessageContent;
    /**
     * Custom config to be sent to client.
     */
    CustomConfig?: MapOf__string;
    /**
     * The layout of the message.
     */
    Layout?: Layout;
    /**
     * A string-to-string map of key-value pairs that defines the tags to associate with the message template. Each tag consists of a required tag key and an associated tag value.
     */
    tags?: MapOf__string;
    /**
     * The description of the template.
     */
    TemplateDescription?: __string;
  }
  export interface InAppTemplateResponse {
    /**
     * The resource arn of the template.
     */
    Arn?: __string;
    /**
     * The content of the message, can include up to 5 modals. Each modal must contain a message, a header, and background color. ImageUrl and buttons are optional.
     */
    Content?: ListOfInAppMessageContent;
    /**
     * The creation date of the template.
     */
    CreationDate: __string;
    /**
     * Custom config to be sent to client.
     */
    CustomConfig?: MapOf__string;
    /**
     * The last modified date of the template.
     */
    LastModifiedDate: __string;
    /**
     * The layout of the message.
     */
    Layout?: Layout;
    /**
     * A string-to-string map of key-value pairs that defines the tags to associate with the message template. Each tag consists of a required tag key and an associated tag value.
     */
    tags?: MapOf__string;
    /**
     * The description of the template.
     */
    TemplateDescription?: __string;
    /**
     * The name of the template.
     */
    TemplateName: __string;
    /**
     * The type of the template.
     */
    TemplateType: TemplateType;
    /**
     * The version id of the template.
     */
    Version?: __string;
  }
  export type Include = "ALL"|"ANY"|"NONE"|string;
  export interface ItemResponse {
    /**
     * The response that was received after the endpoint data was accepted.
     */
    EndpointItemResponse?: EndpointItemResponse;
    /**
     * A multipart response object that contains a key and a value for each event in the request. In each object, the event ID is the key and an EventItemResponse object is the value.
     */
    EventsItemResponse?: MapOfEventItemResponse;
  }
  export type JobStatus = "CREATED"|"PREPARING_FOR_INITIALIZATION"|"INITIALIZING"|"PROCESSING"|"PENDING_JOB"|"COMPLETING"|"COMPLETED"|"FAILING"|"FAILED"|string;
  export interface JourneyCustomMessage {
    /**
     * The message content that's passed to an AWS Lambda function or to a web hook.
     */
    Data?: __string;
  }
  export interface JourneyDateRangeKpiResponse {
    /**
     * The unique identifier for the application that the metric applies to.
     */
    ApplicationId: __string;
    /**
     * The last date and time of the date range that was used to filter the query results, in extended ISO 8601 format. The date range is inclusive.
     */
    EndTime: __timestampIso8601;
    /**
     * The unique identifier for the journey that the metric applies to.
     */
    JourneyId: __string;
    /**
     * The name of the metric, also referred to as a key performance indicator (KPI), that the data was retrieved for. This value describes the associated metric and consists of two or more terms, which are comprised of lowercase alphanumeric characters, separated by a hyphen. For a list of possible values, see the Amazon Pinpoint Developer Guide.
     */
    KpiName: __string;
    /**
     * An array of objects that contains the results of the query. Each object contains the value for the metric and metadata about that value.
     */
    KpiResult: BaseKpiResult;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null for the Journey Engagement Metrics resource because the resource returns all results in a single page.
     */
    NextToken?: __string;
    /**
     * The first date and time of the date range that was used to filter the query results, in extended ISO 8601 format. The date range is inclusive.
     */
    StartTime: __timestampIso8601;
  }
  export interface JourneyEmailMessage {
    /**
     * The verified email address to send the email message from. The default address is the FromAddress specified for the email channel for the application.
     */
    FromAddress?: __string;
  }
  export interface JourneyExecutionActivityMetricsResponse {
    /**
     * The type of activity that the metric applies to. Possible values are: CONDITIONAL_SPLIT - For a yes/no split activity, which is an activity that sends participants down one of two paths in a journey. HOLDOUT - For a holdout activity, which is an activity that stops a journey for a specified percentage of participants. MESSAGE - For an email activity, which is an activity that sends an email message to participants. MULTI_CONDITIONAL_SPLIT - For a multivariate split activity, which is an activity that sends participants down one of as many as five paths in a journey. RANDOM_SPLIT - For a random split activity, which is an activity that sends specified percentages of participants down one of as many as five paths in a journey. WAIT - For a wait activity, which is an activity that waits for a certain amount of time or until a specific date and time before moving participants to the next activity in a journey.
     */
    ActivityType: __string;
    /**
     * The unique identifier for the application that the metric applies to.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the activity that the metric applies to.
     */
    JourneyActivityId: __string;
    /**
     * The unique identifier for the journey that the metric applies to.
     */
    JourneyId: __string;
    /**
     * The date and time, in ISO 8601 format, when Amazon Pinpoint last evaluated the execution status of the activity and updated the data for the metric.
     */
    LastEvaluatedTime: __string;
    /**
     * A JSON object that contains the results of the query. The results vary depending on the type of activity (ActivityType). For information about the structure and contents of the results, see the Amazon Pinpoint Developer Guide.
     */
    Metrics: MapOf__string;
  }
  export interface JourneyExecutionMetricsResponse {
    /**
     * The unique identifier for the application that the metric applies to.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the journey that the metric applies to.
     */
    JourneyId: __string;
    /**
     * The date and time, in ISO 8601 format, when Amazon Pinpoint last evaluated the journey and updated the data for the metric.
     */
    LastEvaluatedTime: __string;
    /**
     * A JSON object that contains the results of the query. For information about the structure and contents of the results, see the Amazon Pinpoint Developer Guide.
     */
    Metrics: MapOf__string;
  }
  export interface JourneyLimits {
    /**
     * The maximum number of messages that the journey can send to a single participant during a 24-hour period. The maximum value is 100.
     */
    DailyCap?: __integer;
    /**
     * The maximum number of times that a participant can enter the journey. The maximum value is 100. To allow participants to enter the journey an unlimited number of times, set this value to 0.
     */
    EndpointReentryCap?: __integer;
    /**
     * The maximum number of messages that the journey can send each second.
     */
    MessagesPerSecond?: __integer;
    /**
     * Minimum time that must pass before an endpoint can re-enter a given journey. The duration should use an ISO 8601 format, such as PT1H. 
     */
    EndpointReentryInterval?: __string;
  }
  export interface JourneyPushMessage {
    /**
     * The number of seconds that the push notification service should keep the message, if the service is unable to deliver the notification the first time. This value is converted to an expiration value when it's sent to a push-notification service. If this value is 0, the service treats the notification as if it expires immediately and the service doesn't store or try to deliver the notification again. This value doesn't apply to messages that are sent through the Amazon Device Messaging (ADM) service.
     */
    TimeToLive?: __string;
  }
  export interface JourneyChannelSettings {
    /**
     * Amazon Resource Name (ARN) of the Connect Campaign.
     */
    ConnectCampaignArn?: __string;
    /**
     * IAM role ARN to be assumed when invoking Connect campaign execution APIs for dialing.
     */
    ConnectCampaignExecutionRoleArn?: __string;
  }
  export interface JourneyResponse {
    /**
     * A map that contains a set of Activity objects, one object for each activity in the journey. For each Activity object, the key is the unique identifier (string) for an activity and the value is the settings for the activity.
     */
    Activities?: MapOfActivity;
    /**
     * The unique identifier for the application that the journey applies to.
     */
    ApplicationId: __string;
    /**
     * The date, in ISO 8601 format, when the journey was created.
     */
    CreationDate?: __string;
    /**
     * The unique identifier for the journey.
     */
    Id: __string;
    /**
     * The date, in ISO 8601 format, when the journey was last modified.
     */
    LastModifiedDate?: __string;
    /**
     * The messaging and entry limits for the journey.
     */
    Limits?: JourneyLimits;
    /**
     * Specifies whether the journey's scheduled start and end times use each participant's local time. If this value is true, the schedule uses each participant's local time.
     */
    LocalTime?: __boolean;
    /**
     * The name of the journey.
     */
    Name: __string;
    /**
     * The quiet time settings for the journey. Quiet time is a specific time range when a journey doesn't send messages to participants, if all the following conditions are met: The EndpointDemographic.Timezone property of the endpoint for the participant is set to a valid value. The current time in the participant's time zone is later than or equal to the time specified by the QuietTime.Start property for the journey. The current time in the participant's time zone is earlier than or equal to the time specified by the QuietTime.End property for the journey. If any of the preceding conditions isn't met, the participant will receive messages from the journey, even if quiet time is enabled.
     */
    QuietTime?: QuietTime;
    /**
     * The frequency with which Amazon Pinpoint evaluates segment and event data for the journey, as a duration in ISO 8601 format.
     */
    RefreshFrequency?: __string;
    /**
     * The schedule settings for the journey.
     */
    Schedule?: JourneySchedule;
    /**
     * The unique identifier for the first activity in the journey.
     */
    StartActivity?: __string;
    /**
     * The segment that defines which users are participants in the journey.
     */
    StartCondition?: StartCondition;
    /**
     * The current status of the journey. Possible values are: DRAFT - The journey is being developed and hasn't been published yet. ACTIVE - The journey has been developed and published. Depending on the journey's schedule, the journey may currently be running or scheduled to start running at a later time. If a journey's status is ACTIVE, you can't add, change, or remove activities from it. COMPLETED - The journey has been published and has finished running. All participants have entered the journey and no participants are waiting to complete the journey or any activities in the journey. CANCELLED - The journey has been stopped. If a journey's status is CANCELLED, you can't add, change, or remove activities or segment settings from the journey. CLOSED - The journey has been published and has started running. It may have also passed its scheduled end time, or passed its scheduled start time and a refresh frequency hasn't been specified for it. If a journey's status is CLOSED, you can't add participants to it, and no existing participants can enter the journey for the first time. However, any existing participants who are currently waiting to start an activity may continue the journey.
     */
    State?: State;
    /**
     * This object is not used or supported.
     */
    tags?: MapOf__string;
    /**
     * Specifies whether endpoints in quiet hours should enter a wait till the end of their quiet hours.
     */
    WaitForQuietTime?: __boolean;
    /**
     * Specifies whether a journey should be refreshed on segment update.
     */
    RefreshOnSegmentUpdate?: __boolean;
    /**
     * The channel-specific configurations for the journey.
     */
    JourneyChannelSettings?: JourneyChannelSettings;
  }
  export interface JourneySMSMessage {
    /**
     * The SMS message type. Valid values are TRANSACTIONAL (for messages that are critical or time-sensitive, such as a one-time passwords) and PROMOTIONAL (for messsages that aren't critical or time-sensitive, such as marketing messages).
     */
    MessageType?: MessageType;
    /**
     * The long code to send the SMS message from. This value should be one of the dedicated long codes that's assigned to your AWS account. Although it isn't required, we recommend that you specify the long code using an E.164 format to ensure prompt and accurate delivery of the message. For example, +12065550100.
     */
    OriginationNumber?: __string;
    /**
     * The sender ID to display as the sender of the message on a recipient's device. Support for sender IDs varies by country or region. For more information, see Supported Countries and Regions in the Amazon Pinpoint User Guide.
     */
    SenderId?: __string;
    /**
     * The entity ID or Principal Entity (PE) id received from the regulatory body for sending SMS in your country.
     */
    EntityId?: __string;
    /**
     * The template ID received from the regulatory body for sending SMS in your country.
     */
    TemplateId?: __string;
  }
  export interface JourneySchedule {
    /**
     * The scheduled time, in ISO 8601 format, when the journey ended or will end.
     */
    EndTime?: __timestampIso8601;
    /**
     * The scheduled time, in ISO 8601 format, when the journey began or will begin.
     */
    StartTime?: __timestampIso8601;
    /**
     * The starting UTC offset for the journey schedule, if the value of the journey's LocalTime property is true. Valid values are: UTC,
                  UTC+01, UTC+02, UTC+03, UTC+03:30, UTC+04, UTC+04:30, UTC+05, UTC+05:30,
                  UTC+05:45, UTC+06, UTC+06:30, UTC+07, UTC+08, UTC+08:45, UTC+09, UTC+09:30,
                  UTC+10, UTC+10:30, UTC+11, UTC+12, UTC+12:45, UTC+13, UTC+13:45, UTC-02,
                  UTC-02:30, UTC-03, UTC-03:30, UTC-04, UTC-05, UTC-06, UTC-07, UTC-08, UTC-09,
                  UTC-09:30, UTC-10, and UTC-11.
     */
    Timezone?: __string;
  }
  export interface JourneyStateRequest {
    /**
     * The status of the journey. Currently, Supported values are ACTIVE, PAUSED, and CANCELLED If you cancel a journey, Amazon Pinpoint continues to perform activities that are currently in progress, until those activities are complete. Amazon Pinpoint also continues to collect and aggregate analytics data for those activities, until they are complete, and any activities that were complete when you cancelled the journey. After you cancel a journey, you can't add, change, or remove any activities from the journey. In addition, Amazon Pinpoint stops evaluating the journey and doesn't perform any activities that haven't started. When the journey is paused, Amazon Pinpoint continues to perform activities that are currently in progress, until those activities are complete. Endpoints will stop entering journeys when the journey is paused and will resume entering the journey after the journey is resumed. For wait activities, wait time is paused when the journey is paused. Currently, PAUSED only supports journeys with a segment refresh interval.
     */
    State?: State;
  }
  export interface JourneysResponse {
    /**
     * An array of responses, one for each journey that's associated with the application.
     */
    Item: ListOfJourneyResponse;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    NextToken?: __string;
  }
  export type Layout = "BOTTOM_BANNER"|"TOP_BANNER"|"OVERLAYS"|"MOBILE_FEED"|"MIDDLE_BANNER"|"CAROUSEL"|string;
  export interface ListJourneysRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
    /**
     * The NextToken string that specifies which page of results to return in a paginated response.
     */
    Token?: __string;
  }
  export interface ListJourneysResponse {
    JourneysResponse: JourneysResponse;
  }
  export interface ListRecommenderConfigurationsResponse {
    /**
     * An array of responses, one for each recommender model configuration that's associated with your Amazon Pinpoint account.
     */
    Item: ListOfRecommenderConfigurationResponse;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    NextToken?: __string;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: __string;
  }
  export interface ListTagsForResourceResponse {
    TagsModel: TagsModel;
  }
  export interface ListTemplateVersionsRequest {
    /**
     * The  string that specifies which page of results to return in a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    NextToken?: __string;
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
    /**
     * The type of channel that the message template is designed for. Valid values are: EMAIL, PUSH, SMS, and VOICE.
     */
    TemplateType: __string;
  }
  export interface ListTemplateVersionsResponse {
    TemplateVersionsResponse: TemplateVersionsResponse;
  }
  export interface ListTemplatesRequest {
    /**
     * The  string that specifies which page of results to return in a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    NextToken?: __string;
    /**
     * The maximum number of items to include in each page of a paginated response. This parameter is not supported for application, campaign, and journey metrics.
     */
    PageSize?: __string;
    /**
     * The substring to match in the names of the message templates to include in the results. If you specify this value, Amazon Pinpoint returns only those templates whose names begin with the value that you specify.
     */
    Prefix?: __string;
    /**
     * The type of message template to include in the results. Valid values are: EMAIL, PUSH, SMS, and VOICE. To include all types of templates in the results, don't include this parameter in your request.
     */
    TemplateType?: __string;
  }
  export interface ListTemplatesResponse {
    TemplatesResponse: TemplatesResponse;
  }
  export interface Message {
    /**
     * The action to occur if a recipient taps the push notification. Valid values are: OPEN_APP - Your app opens or it becomes the foreground app if it was sent to the background. This is the default action. DEEP_LINK - Your app opens and displays a designated user interface in the app. This setting uses the deep-linking features of iOS and Android. URL - The default mobile browser on the recipient's device opens and loads the web page at a URL that you specify.
     */
    Action?: Action;
    /**
     * The body of the notification message. The maximum number of characters is 200.
     */
    Body?: __string;
    /**
     * The URL of the image to display as the push-notification icon, such as the icon for the app.
     */
    ImageIconUrl?: __string;
    /**
     * The URL of the image to display as the small, push-notification icon, such as a small version of the icon for the app.
     */
    ImageSmallIconUrl?: __string;
    /**
     * The URL of an image to display in the push notification.
     */
    ImageUrl?: __string;
    /**
     * The JSON payload to use for a silent push notification.
     */
    JsonBody?: __string;
    /**
     * The URL of the image or video to display in the push notification.
     */
    MediaUrl?: __string;
    /**
     * The raw, JSON-formatted string to use as the payload for the notification message. If specified, this value overrides all other content for the message.
     */
    RawContent?: __string;
    /**
     * Specifies whether the notification is a silent push notification, which is a push notification that doesn't display on a recipient's device. Silent push notifications can be used for cases such as updating an app's configuration, displaying messages in an in-app message center, or supporting phone home functionality.
     */
    SilentPush?: __boolean;
    /**
     * The number of seconds that the push-notification service should keep the message, if the service is unable to deliver the notification the first time. This value is converted to an expiration value when it's sent to a push-notification service. If this value is 0, the service treats the notification as if it expires immediately and the service doesn't store or try to deliver the notification again. This value doesn't apply to messages that are sent through the Amazon Device Messaging (ADM) service.
     */
    TimeToLive?: __integer;
    /**
     * The title to display above the notification message on a recipient's device.
     */
    Title?: __string;
    /**
     * The URL to open in a recipient's default mobile browser, if a recipient taps the push notification and the value of the Action property is URL.
     */
    Url?: __string;
  }
  export interface MessageBody {
    /**
     * The message that's returned from the API.
     */
    Message?: __string;
    /**
     * The unique identifier for the request or response.
     */
    RequestID?: __string;
  }
  export interface MessageConfiguration {
    /**
     * The message that the campaign sends through the ADM (Amazon Device Messaging) channel. If specified, this message overrides the default message.
     */
    ADMMessage?: Message;
    /**
     * The message that the campaign sends through the APNs (Apple Push Notification service) channel. If specified, this message overrides the default message.
     */
    APNSMessage?: Message;
    /**
     * The message that the campaign sends through the Baidu (Baidu Cloud Push) channel. If specified, this message overrides the default message.
     */
    BaiduMessage?: Message;
    /**
     * The message that the campaign sends through a custom channel, as specified by the delivery configuration (CustomDeliveryConfiguration) settings for the campaign. If specified, this message overrides the default message. 
     */
    CustomMessage?: CampaignCustomMessage;
    /**
     * The default message that the campaign sends through all the channels that are configured for the campaign.
     */
    DefaultMessage?: Message;
    /**
     * The message that the campaign sends through the email channel. If specified, this message overrides the default message.
     */
    EmailMessage?: CampaignEmailMessage;
    /**
     * The message that the campaign sends through the GCM channel, which enables Amazon Pinpoint to send push notifications through the Firebase Cloud Messaging (FCM), formerly Google Cloud Messaging (GCM), service. If specified, this message overrides the default message.
     */
    GCMMessage?: Message;
    /**
     * The message that the campaign sends through the SMS channel. If specified, this message overrides the default message.
     */
    SMSMessage?: CampaignSmsMessage;
    /**
     * The in-app message configuration.
     */
    InAppMessage?: CampaignInAppMessage;
  }
  export interface MessageRequest {
    /**
     * A map of key-value pairs, where each key is an address and each value is an AddressConfiguration object. An address can be a push notification token, a phone number, or an email address. You can use an AddressConfiguration object to tailor the message for an address by specifying settings such as content overrides and message variables.
     */
    Addresses?: MapOfAddressConfiguration;
    /**
     * A map of custom attributes to attach to the message. For a push notification, this payload is added to the data.pinpoint object. For an email or text message, this payload is added to email/SMS delivery receipt event attributes.
     */
    Context?: MapOf__string;
    /**
     * A map of key-value pairs, where each key is an endpoint ID and each value is an EndpointSendConfiguration object. You can use an EndpointSendConfiguration object to tailor the message for an endpoint by specifying settings such as content overrides and message variables.
     */
    Endpoints?: MapOfEndpointSendConfiguration;
    /**
     * The settings and content for the default message and any default messages that you defined for specific channels.
     */
    MessageConfiguration: DirectMessageConfiguration;
    /**
     * The message template to use for the message.
     */
    TemplateConfiguration?: TemplateConfiguration;
    /**
     * The unique identifier for tracing the message. This identifier is visible to message recipients.
     */
    TraceId?: __string;
  }
  export interface MessageResponse {
    /**
     * The unique identifier for the application that was used to send the message.
     */
    ApplicationId: __string;
    /**
     * A map that contains a multipart response for each address that the message was sent to. In the map, the endpoint ID is the key and the result is the value.
     */
    EndpointResult?: MapOfEndpointMessageResult;
    /**
     * The identifier for the original request that the message was delivered for.
     */
    RequestId?: __string;
    /**
     * A map that contains a multipart response for each address (email address, phone number, or push notification token) that the message was sent to. In the map, the address is the key and the result is the value.
     */
    Result?: MapOfMessageResult;
  }
  export interface MessageResult {
    /**
     * The delivery status of the message. Possible values are:  DUPLICATE - The endpoint address is a duplicate of another endpoint address. Amazon Pinpoint won't attempt to send the message again.   OPT_OUT - The user who's associated with the endpoint address has opted out of receiving messages from you. Amazon Pinpoint won't attempt to send the message again. PERMANENT_FAILURE - An error occurred when delivering the message to the endpoint address. Amazon Pinpoint won't attempt to send the message again.   SUCCESSFUL - The message was successfully delivered to the endpoint address. TEMPORARY_FAILURE - A temporary error occurred. Amazon Pinpoint won't attempt to send the message again. THROTTLED - Amazon Pinpoint throttled the operation to send the message to the endpoint address. TIMEOUT - The message couldn't be sent within the timeout period. UNKNOWN_FAILURE - An unknown error occurred.
     */
    DeliveryStatus: DeliveryStatus;
    /**
     * The unique identifier for the message that was sent.
     */
    MessageId?: __string;
    /**
     * The downstream service status code for delivering the message.
     */
    StatusCode: __integer;
    /**
     * The status message for delivering the message.
     */
    StatusMessage?: __string;
    /**
     * For push notifications that are sent through the GCM channel, specifies whether the endpoint's device registration token was updated as part of delivering the message.
     */
    UpdatedToken?: __string;
  }
  export type MessageType = "TRANSACTIONAL"|"PROMOTIONAL"|string;
  export interface MetricDimension {
    /**
     * The operator to use when comparing metric values. Valid values are: GREATER_THAN, LESS_THAN, GREATER_THAN_OR_EQUAL, LESS_THAN_OR_EQUAL, and EQUAL.
     */
    ComparisonOperator: __string;
    /**
     * The value to compare.
     */
    Value: __double;
  }
  export type Mode = "DELIVERY"|"FILTER"|string;
  export interface MultiConditionalBranch {
    /**
     * The condition to evaluate for the activity path.
     */
    Condition?: SimpleCondition;
    /**
     * The unique identifier for the next activity to perform, after completing the activity for the path.
     */
    NextActivity?: __string;
  }
  export interface MultiConditionalSplitActivity {
    /**
     * The paths for the activity, including the conditions for entering each path and the activity to perform for each path.
     */
    Branches?: ListOfMultiConditionalBranch;
    /**
     * The unique identifier for the activity to perform for participants who don't meet any of the conditions specified for other paths in the activity.
     */
    DefaultActivity?: __string;
    /**
     * The amount of time to wait or the date and time when Amazon Pinpoint determines whether the conditions are met.
     */
    EvaluationWaitTime?: WaitTime;
  }
  export interface NumberValidateRequest {
    /**
     * The two-character code, in ISO 3166-1 alpha-2 format, for the country or region where the phone number was originally registered.
     */
    IsoCountryCode?: __string;
    /**
     * The phone number to retrieve information about. The phone number that you provide should include a valid numeric country code. Otherwise, the operation might result in an error.
     */
    PhoneNumber?: __string;
  }
  export interface NumberValidateResponse {
    /**
     * The carrier or service provider that the phone number is currently registered with. In some countries and regions, this value may be the carrier or service provider that the phone number was originally registered with.
     */
    Carrier?: __string;
    /**
     * The name of the city where the phone number was originally registered.
     */
    City?: __string;
    /**
     * The cleansed phone number, in E.164 format, for the location where the phone number was originally registered.
     */
    CleansedPhoneNumberE164?: __string;
    /**
     * The cleansed phone number, in the format for the location where the phone number was originally registered.
     */
    CleansedPhoneNumberNational?: __string;
    /**
     * The name of the country or region where the phone number was originally registered.
     */
    Country?: __string;
    /**
     * The two-character code, in ISO 3166-1 alpha-2 format, for the country or region where the phone number was originally registered.
     */
    CountryCodeIso2?: __string;
    /**
     * The numeric code for the country or region where the phone number was originally registered.
     */
    CountryCodeNumeric?: __string;
    /**
     * The name of the county where the phone number was originally registered.
     */
    County?: __string;
    /**
     * The two-character code, in ISO 3166-1 alpha-2 format, that was sent in the request body.
     */
    OriginalCountryCodeIso2?: __string;
    /**
     * The phone number that was sent in the request body.
     */
    OriginalPhoneNumber?: __string;
    /**
     * The description of the phone type. Valid values are: MOBILE, LANDLINE, VOIP,
                  INVALID, PREPAID, and OTHER.
     */
    PhoneType?: __string;
    /**
     * The phone type, represented by an integer. Valid values are: 0 (mobile), 1 (landline), 2 (VoIP), 3 (invalid), 4 (other), and 5 (prepaid).
     */
    PhoneTypeCode?: __integer;
    /**
     * The time zone for the location where the phone number was originally registered.
     */
    Timezone?: __string;
    /**
     * The postal or ZIP code for the location where the phone number was originally registered.
     */
    ZipCode?: __string;
  }
  export type Operator = "ALL"|"ANY"|string;
  export interface OverrideButtonConfiguration {
    /**
     * Action triggered by the button.
     */
    ButtonAction: ButtonAction;
    /**
     * Button destination.
     */
    Link?: __string;
  }
  export interface PhoneNumberValidateRequest {
    NumberValidateRequest: NumberValidateRequest;
  }
  export interface PhoneNumberValidateResponse {
    NumberValidateResponse: NumberValidateResponse;
  }
  export interface PublicEndpoint {
    /**
     * The unique identifier for the recipient, such as a device token, email address, or mobile phone number.
     */
    Address?: __string;
    /**
     * One or more custom attributes that describe the endpoint by associating a name with an array of values. You can use these attributes as filter criteria when you create segments.
     */
    Attributes?: MapOfListOf__string;
    /**
     * The channel that's used when sending messages or push notifications to the endpoint.
     */
    ChannelType?: ChannelType;
    /**
     * The demographic information for the endpoint, such as the time zone and platform.
     */
    Demographic?: EndpointDemographic;
    /**
     * The date and time, in ISO 8601 format, when the endpoint was last updated.
     */
    EffectiveDate?: __string;
    /**
     * Specifies whether to send messages or push notifications to the endpoint. Valid values are: ACTIVE, messages are sent to the endpoint; and, INACTIVE, messages aren’t sent to the endpoint. Amazon Pinpoint automatically sets this value to ACTIVE when you create an endpoint or update an existing endpoint. Amazon Pinpoint automatically sets this value to INACTIVE if you update another endpoint that has the same address specified by the Address property.
     */
    EndpointStatus?: __string;
    /**
     * The geographic information for the endpoint.
     */
    Location?: EndpointLocation;
    /**
     * One or more custom metrics that your app reports to Amazon Pinpoint for the endpoint.
     */
    Metrics?: MapOf__double;
    /**
     * Specifies whether the user who's associated with the endpoint has opted out of receiving messages and push notifications from you. Possible values are: ALL, the user has opted out and doesn't want to receive any messages or push notifications; and, NONE, the user hasn't opted out and wants to receive all messages and push notifications.
     */
    OptOut?: __string;
    /**
     * A unique identifier that's generated each time the endpoint is updated.
     */
    RequestId?: __string;
    /**
     * One or more custom user attributes that your app reports to Amazon Pinpoint for the user who's associated with the endpoint.
     */
    User?: EndpointUser;
  }
  export interface PushMessageActivity {
    /**
     * Specifies the time to live (TTL) value for push notifications that are sent to participants in a journey.
     */
    MessageConfig?: JourneyPushMessage;
    /**
     * The unique identifier for the next activity to perform, after the message is sent.
     */
    NextActivity?: __string;
    /**
     * The name of the push notification template to use for the message. If specified, this value must match the name of an existing message template.
     */
    TemplateName?: __string;
    /**
     * The unique identifier for the version of the push notification template to use for the message. If specified, this value must match the identifier for an existing template version. To retrieve a list of versions and version identifiers for a template, use the Template Versions resource. If you don't specify a value for this property, Amazon Pinpoint uses the active version of the template. The active version is typically the version of a template that's been most recently reviewed and approved for use, depending on your workflow. It isn't necessarily the latest version of a template.
     */
    TemplateVersion?: __string;
  }
  export interface PushNotificationTemplateRequest {
    /**
     * The message template to use for the ADM (Amazon Device Messaging) channel. This message template overrides the default template for push notification channels (DefaultPushNotificationTemplate).
     */
    ADM?: AndroidPushNotificationTemplate;
    /**
     * The message template to use for the APNs (Apple Push Notification service) channel. This message template overrides the default template for push notification channels (DefaultPushNotificationTemplate).
     */
    APNS?: APNSPushNotificationTemplate;
    /**
     * The message template to use for the Baidu (Baidu Cloud Push) channel. This message template overrides the default template for push notification channels (DefaultPushNotificationTemplate).
     */
    Baidu?: AndroidPushNotificationTemplate;
    /**
     * The default message template to use for push notification channels.
     */
    Default?: DefaultPushNotificationTemplate;
    /**
     * A JSON object that specifies the default values to use for message variables in the message template. This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the default value for that variable. When you create a message that's based on the template, you can override these defaults with message-specific and address-specific variables and values.
     */
    DefaultSubstitutions?: __string;
    /**
     * The message template to use for the GCM channel, which is used to send notifications through the Firebase Cloud Messaging (FCM), formerly Google Cloud Messaging (GCM), service. This message template overrides the default template for push notification channels (DefaultPushNotificationTemplate).
     */
    GCM?: AndroidPushNotificationTemplate;
    /**
     * The unique identifier for the recommender model to use for the message template. Amazon Pinpoint uses this value to determine how to retrieve and process data from a recommender model when it sends messages that use the template, if the template contains message variables for recommendation data.
     */
    RecommenderId?: __string;
    /**
     * A string-to-string map of key-value pairs that defines the tags to associate with the message template. Each tag consists of a required tag key and an associated tag value.
     */
    tags?: MapOf__string;
    /**
     * A custom description of the message template.
     */
    TemplateDescription?: __string;
  }
  export interface PushNotificationTemplateResponse {
    /**
     * The message template that's used for the ADM (Amazon Device Messaging) channel. This message template overrides the default template for push notification channels (DefaultPushNotificationTemplate).
     */
    ADM?: AndroidPushNotificationTemplate;
    /**
     * The message template that's used for the APNs (Apple Push Notification service) channel. This message template overrides the default template for push notification channels (DefaultPushNotificationTemplate).
     */
    APNS?: APNSPushNotificationTemplate;
    /**
     * The Amazon Resource Name (ARN) of the message template.
     */
    Arn?: __string;
    /**
     * The message template that's used for the Baidu (Baidu Cloud Push) channel. This message template overrides the default template for push notification channels (DefaultPushNotificationTemplate).
     */
    Baidu?: AndroidPushNotificationTemplate;
    /**
     * The date, in ISO 8601 format, when the message template was created.
     */
    CreationDate: __string;
    /**
     * The default message template that's used for push notification channels.
     */
    Default?: DefaultPushNotificationTemplate;
    /**
     * The JSON object that specifies the default values that are used for message variables in the message template. This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the default value for that variable.
     */
    DefaultSubstitutions?: __string;
    /**
     * The message template that's used for the GCM channel, which is used to send notifications through the Firebase Cloud Messaging (FCM), formerly Google Cloud Messaging (GCM), service. This message template overrides the default template for push notification channels (DefaultPushNotificationTemplate).
     */
    GCM?: AndroidPushNotificationTemplate;
    /**
     * The date, in ISO 8601 format, when the message template was last modified.
     */
    LastModifiedDate: __string;
    /**
     * The unique identifier for the recommender model that's used by the message template.
     */
    RecommenderId?: __string;
    /**
     * A string-to-string map of key-value pairs that identifies the tags that are associated with the message template. Each tag consists of a required tag key and an associated tag value.
     */
    tags?: MapOf__string;
    /**
     * The custom description of the message template.
     */
    TemplateDescription?: __string;
    /**
     * The name of the message template.
     */
    TemplateName: __string;
    /**
     * The type of channel that the message template is designed for. For a push notification template, this value is PUSH.
     */
    TemplateType: TemplateType;
    /**
     * The unique identifier, as an integer, for the active version of the message template, or the version of the template that you specified by using the version parameter in your request.
     */
    Version?: __string;
  }
  export interface PutEventStreamRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    WriteEventStream: WriteEventStream;
  }
  export interface PutEventStreamResponse {
    EventStream: EventStream;
  }
  export interface PutEventsRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    EventsRequest: EventsRequest;
  }
  export interface PutEventsResponse {
    EventsResponse: EventsResponse;
  }
  export interface QuietTime {
    /**
     * The specific time when quiet time ends. This value has to use 24-hour notation and be in HH:MM format, where HH is the hour (with a leading zero, if applicable) and MM is the minutes. For example, use 02:30 to represent 2:30 AM, or 14:30 to represent 2:30 PM.
     */
    End?: __string;
    /**
     * The specific time when quiet time begins. This value has to use 24-hour notation and be in HH:MM format, where HH is the hour (with a leading zero, if applicable) and MM is the minutes. For example, use 02:30 to represent 2:30 AM, or 14:30 to represent 2:30 PM.
     */
    Start?: __string;
  }
  export interface RandomSplitActivity {
    /**
     * The paths for the activity, including the percentage of participants to enter each path and the activity to perform for each path.
     */
    Branches?: ListOfRandomSplitEntry;
  }
  export interface RandomSplitEntry {
    /**
     * The unique identifier for the next activity to perform, after completing the activity for the path.
     */
    NextActivity?: __string;
    /**
     * The percentage of participants to send down the activity path. To determine which participants are sent down each path, Amazon Pinpoint applies a probability-based algorithm to the percentages that you specify for the paths. Therefore, the actual percentage of participants who are sent down a path may not be equal to the percentage that you specify.
     */
    Percentage?: __integer;
  }
  export interface RawEmail {
    /**
     * The email message, represented as a raw MIME message. The entire message must be base64 encoded.
     */
    Data?: __blob;
  }
  export type __blob = Buffer|Uint8Array|Blob|string;
  export interface RecencyDimension {
    /**
     * The duration to use when determining whether an endpoint is active or inactive.
     */
    Duration: Duration;
    /**
     * The type of recency dimension to use for the segment. Valid values are: ACTIVE, endpoints that were active within the specified duration are included in the segment; and, INACTIVE, endpoints that weren't active within the specified duration are included in the segment.
     */
    RecencyType: RecencyType;
  }
  export type RecencyType = "ACTIVE"|"INACTIVE"|string;
  export interface RecommenderConfigurationResponse {
    /**
     * A map that defines 1-10 custom endpoint or user attributes, depending on the value for the RecommendationProviderIdType property. Each of these attributes temporarily stores a recommended item that's retrieved from the recommender model and sent to an AWS Lambda function for additional processing. Each attribute can be used as a message variable in a message template. This value is null if the configuration doesn't invoke an AWS Lambda function (RecommendationTransformerUri) to perform additional processing of recommendation data.
     */
    Attributes?: MapOf__string;
    /**
     * The date, in extended ISO 8601 format, when the configuration was created for the recommender model.
     */
    CreationDate: __string;
    /**
     * The custom description of the configuration for the recommender model.
     */
    Description?: __string;
    /**
     * The unique identifier for the recommender model configuration.
     */
    Id: __string;
    /**
     * The date, in extended ISO 8601 format, when the configuration for the recommender model was last modified.
     */
    LastModifiedDate: __string;
    /**
     * The custom name of the configuration for the recommender model.
     */
    Name?: __string;
    /**
     * The type of Amazon Pinpoint ID that's associated with unique user IDs in the recommender model. This value enables the model to use attribute and event data that’s specific to a particular endpoint or user in an Amazon Pinpoint application. Possible values are: PINPOINT_ENDPOINT_ID - Each user in the model is associated with a particular endpoint in Amazon Pinpoint. The data is correlated based on endpoint IDs in Amazon Pinpoint. This is the default value. PINPOINT_USER_ID - Each user in the model is associated with a particular user and endpoint in Amazon Pinpoint. The data is correlated based on user IDs in Amazon Pinpoint. If this value is specified, an endpoint definition in Amazon Pinpoint has to specify both a user ID (UserId) and an endpoint ID. Otherwise, messages won’t be sent to the user's endpoint.
     */
    RecommendationProviderIdType?: __string;
    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that authorizes Amazon Pinpoint to retrieve recommendation data from the recommender model.
     */
    RecommendationProviderRoleArn: __string;
    /**
     * The Amazon Resource Name (ARN) of the recommender model that Amazon Pinpoint retrieves the recommendation data from. This value is the ARN of an Amazon Personalize campaign.
     */
    RecommendationProviderUri: __string;
    /**
     * The name or Amazon Resource Name (ARN) of the AWS Lambda function that Amazon Pinpoint invokes to perform additional processing of recommendation data that it retrieves from the recommender model.
     */
    RecommendationTransformerUri?: __string;
    /**
     * The custom display name for the standard endpoint or user attribute (RecommendationItems) that temporarily stores recommended items for each endpoint or user, depending on the value for the RecommendationProviderIdType property. This name appears in the Attribute finder of the template editor on the Amazon Pinpoint console. This value is null if the configuration doesn't invoke an AWS Lambda function (RecommendationTransformerUri) to perform additional processing of recommendation data.
     */
    RecommendationsDisplayName?: __string;
    /**
     * The number of recommended items that are retrieved from the model for each endpoint or user, depending on the value for the RecommendationProviderIdType property. This number determines how many recommended items are available for use in message variables.
     */
    RecommendationsPerMessage?: __integer;
  }
  export interface RemoveAttributesRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     *  The type of attribute or attributes to remove. Valid values are: endpoint-custom-attributes - Custom attributes that describe endpoints, such as the date when an associated user opted in or out of receiving communications from you through a specific type of channel. endpoint-metric-attributes - Custom metrics that your app reports to Amazon Pinpoint for endpoints, such as the number of app sessions or the number of items left in a cart. endpoint-user-attributes - Custom attributes that describe users, such as first name, last name, and age.
     */
    AttributeType: __string;
    UpdateAttributesRequest: UpdateAttributesRequest;
  }
  export interface RemoveAttributesResponse {
    AttributesResource: AttributesResource;
  }
  export interface ResultRow {
    /**
     * An array of objects that defines the field and field values that were used to group data in a result set that contains multiple results. This value is null if the data in a result set isn’t grouped.
     */
    GroupedBys: ListOfResultRowValue;
    /**
     * An array of objects that provides pre-aggregated values for a standard metric that applies to an application, campaign, or journey.
     */
    Values: ListOfResultRowValue;
  }
  export interface ResultRowValue {
    /**
     * The friendly name of the metric whose value is specified by the Value property.
     */
    Key: __string;
    /**
     * The data type of the value specified by the Value property.
     */
    Type: __string;
    /**
     * In a Values object, the value for the metric that the query retrieved data for. In a GroupedBys object, the value for the field that was used to group data in a result set that contains multiple results (Values objects).
     */
    Value: __string;
  }
  export interface SMSChannelRequest {
    /**
     * Specifies whether to enable the SMS channel for the application.
     */
    Enabled?: __boolean;
    /**
     * The identity that you want to display on recipients' devices when they receive messages from the SMS channel.
     */
    SenderId?: __string;
    /**
     * The registered short code that you want to use when you send messages through the SMS channel.
     */
    ShortCode?: __string;
  }
  export interface SMSChannelResponse {
    /**
     * The unique identifier for the application that the SMS channel applies to.
     */
    ApplicationId?: __string;
    /**
     * The date and time, in ISO 8601 format, when the SMS channel was enabled.
     */
    CreationDate?: __string;
    /**
     * Specifies whether the SMS channel is enabled for the application.
     */
    Enabled?: __boolean;
    /**
     * (Not used) This property is retained only for backward compatibility.
     */
    HasCredential?: __boolean;
    /**
     * (Deprecated) An identifier for the SMS channel. This property is retained only for backward compatibility.
     */
    Id?: __string;
    /**
     * Specifies whether the SMS channel is archived.
     */
    IsArchived?: __boolean;
    /**
     * The user who last modified the SMS channel.
     */
    LastModifiedBy?: __string;
    /**
     * The date and time, in ISO 8601 format, when the SMS channel was last modified.
     */
    LastModifiedDate?: __string;
    /**
     * The type of messaging or notification platform for the channel. For the SMS channel, this value is SMS.
     */
    Platform: __string;
    /**
     * The maximum number of promotional messages that you can send through the SMS channel each second.
     */
    PromotionalMessagesPerSecond?: __integer;
    /**
     * The identity that displays on recipients' devices when they receive messages from the SMS channel.
     */
    SenderId?: __string;
    /**
     * The registered short code to use when you send messages through the SMS channel.
     */
    ShortCode?: __string;
    /**
     * The maximum number of transactional messages that you can send through the SMS channel each second.
     */
    TransactionalMessagesPerSecond?: __integer;
    /**
     * The current version of the SMS channel.
     */
    Version?: __integer;
  }
  export interface SMSMessage {
    /**
     * The body of the SMS message.
     */
    Body?: __string;
    /**
     * The SMS program name that you provided to AWS Support when you requested your dedicated number.
     */
    Keyword?: __string;
    /**
     * This field is reserved for future use.
     */
    MediaUrl?: __string;
    /**
     * The SMS message type. Valid values are TRANSACTIONAL (for messages that are critical or time-sensitive, such as a one-time passwords) and PROMOTIONAL (for messsages that aren't critical or time-sensitive, such as marketing messages).
     */
    MessageType?: MessageType;
    /**
     * The number to send the SMS message from. This value should be one of the dedicated long or short codes that's assigned to your AWS account. If you don't specify a long or short code, Amazon Pinpoint assigns a random long code to the SMS message and sends the message from that code.
     */
    OriginationNumber?: __string;
    /**
     * The sender ID to display as the sender of the message on a recipient's device. Support for sender IDs varies by country or region.
     */
    SenderId?: __string;
    /**
     * The message variables to use in the SMS message. You can override the default variables with individual address variables.
     */
    Substitutions?: MapOfListOf__string;
    /**
     * The entity ID or Principal Entity (PE) id received from the regulatory body for sending SMS in your country.
     */
    EntityId?: __string;
    /**
     * The template ID received from the regulatory body for sending SMS in your country.
     */
    TemplateId?: __string;
  }
  export interface SMSMessageActivity {
    /**
     * Specifies the sender ID and message type for an SMS message that's sent to participants in a journey.
     */
    MessageConfig?: JourneySMSMessage;
    /**
     * The unique identifier for the next activity to perform, after the message is sent.
     */
    NextActivity?: __string;
    /**
     * The name of the SMS message template to use for the message. If specified, this value must match the name of an existing message template.
     */
    TemplateName?: __string;
    /**
     * The unique identifier for the version of the SMS template to use for the message. If specified, this value must match the identifier for an existing template version. To retrieve a list of versions and version identifiers for a template, use the Template Versions resource. If you don't specify a value for this property, Amazon Pinpoint uses the active version of the template. The active version is typically the version of a template that's been most recently reviewed and approved for use, depending on your workflow. It isn't necessarily the latest version of a template.
     */
    TemplateVersion?: __string;
  }
  export interface SMSTemplateRequest {
    /**
     * The message body to use in text messages that are based on the message template.
     */
    Body?: __string;
    /**
     * A JSON object that specifies the default values to use for message variables in the message template. This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the default value for that variable. When you create a message that's based on the template, you can override these defaults with message-specific and address-specific variables and values.
     */
    DefaultSubstitutions?: __string;
    /**
     * The unique identifier for the recommender model to use for the message template. Amazon Pinpoint uses this value to determine how to retrieve and process data from a recommender model when it sends messages that use the template, if the template contains message variables for recommendation data.
     */
    RecommenderId?: __string;
    /**
     * A string-to-string map of key-value pairs that defines the tags to associate with the message template. Each tag consists of a required tag key and an associated tag value.
     */
    tags?: MapOf__string;
    /**
     * A custom description of the message template.
     */
    TemplateDescription?: __string;
  }
  export interface SMSTemplateResponse {
    /**
     * The Amazon Resource Name (ARN) of the message template.
     */
    Arn?: __string;
    /**
     * The message body that's used in text messages that are based on the message template.
     */
    Body?: __string;
    /**
     * The date, in ISO 8601 format, when the message template was created.
     */
    CreationDate: __string;
    /**
     * The JSON object that specifies the default values that are used for message variables in the message template. This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the default value for that variable.
     */
    DefaultSubstitutions?: __string;
    /**
     * The date, in ISO 8601 format, when the message template was last modified.
     */
    LastModifiedDate: __string;
    /**
     * The unique identifier for the recommender model that's used by the message template.
     */
    RecommenderId?: __string;
    /**
     * A string-to-string map of key-value pairs that identifies the tags that are associated with the message template. Each tag consists of a required tag key and an associated tag value.
     */
    tags?: MapOf__string;
    /**
     * The custom description of the message template.
     */
    TemplateDescription?: __string;
    /**
     * The name of the message template.
     */
    TemplateName: __string;
    /**
     * The type of channel that the message template is designed for. For an SMS template, this value is SMS.
     */
    TemplateType: TemplateType;
    /**
     * The unique identifier, as an integer, for the active version of the message template, or the version of the template that you specified by using the version parameter in your request.
     */
    Version?: __string;
  }
  export interface Schedule {
    /**
     * The scheduled time, in ISO 8601 format, when the campaign ended or will end.
     */
    EndTime?: __string;
    /**
     * The type of event that causes the campaign to be sent, if the value of the Frequency property is EVENT.
     */
    EventFilter?: CampaignEventFilter;
    /**
     * Specifies how often the campaign is sent or whether the campaign is sent in response to a specific event.
     */
    Frequency?: Frequency;
    /**
     * Specifies whether the start and end times for the campaign schedule use each recipient's local time. To base the schedule on each recipient's local time, set this value to true.
     */
    IsLocalTime?: __boolean;
    /**
     * The default quiet time for the campaign. Quiet time is a specific time range when a campaign doesn't send messages to endpoints, if all the following conditions are met: The EndpointDemographic.Timezone property of the endpoint is set to a valid value. The current time in the endpoint's time zone is later than or equal to the time specified by the QuietTime.Start property for the campaign. The current time in the endpoint's time zone is earlier than or equal to the time specified by the QuietTime.End property for the campaign. If any of the preceding conditions isn't met, the endpoint will receive messages from the campaign, even if quiet time is enabled.
     */
    QuietTime?: QuietTime;
    /**
     * The scheduled time when the campaign began or will begin. Valid values are: IMMEDIATE, to start the campaign immediately; or, a specific time in ISO 8601 format.
     */
    StartTime: __string;
    /**
     * The starting UTC offset for the campaign schedule, if the value of the IsLocalTime property is true. Valid values are: UTC, UTC+01, UTC+02, UTC+03, UTC+03:30, UTC+04, UTC+04:30, UTC+05,
                  UTC+05:30, UTC+05:45, UTC+06, UTC+06:30, UTC+07, UTC+08, UTC+09, UTC+09:30,
                  UTC+10, UTC+10:30, UTC+11, UTC+12, UTC+13, UTC-02, UTC-03, UTC-04, UTC-05, UTC-06,
                  UTC-07, UTC-08, UTC-09, UTC-10, and UTC-11.
     */
    Timezone?: __string;
  }
  export interface SegmentBehaviors {
    /**
     * The dimension settings that are based on how recently an endpoint was active.
     */
    Recency?: RecencyDimension;
  }
  export interface SegmentCondition {
    /**
     * The unique identifier for the segment to associate with the activity.
     */
    SegmentId: __string;
  }
  export interface SegmentDemographics {
    /**
     * The app version criteria for the segment.
     */
    AppVersion?: SetDimension;
    /**
     * The channel criteria for the segment.
     */
    Channel?: SetDimension;
    /**
     * The device type criteria for the segment.
     */
    DeviceType?: SetDimension;
    /**
     * The device make criteria for the segment.
     */
    Make?: SetDimension;
    /**
     * The device model criteria for the segment.
     */
    Model?: SetDimension;
    /**
     * The device platform criteria for the segment.
     */
    Platform?: SetDimension;
  }
  export interface SegmentDimensions {
    /**
     * One or more custom attributes to use as criteria for the segment.
     */
    Attributes?: MapOfAttributeDimension;
    /**
     * The behavior-based criteria, such as how recently users have used your app, for the segment.
     */
    Behavior?: SegmentBehaviors;
    /**
     * The demographic-based criteria, such as device platform, for the segment.
     */
    Demographic?: SegmentDemographics;
    /**
     * The location-based criteria, such as region or GPS coordinates, for the segment.
     */
    Location?: SegmentLocation;
    /**
     * One or more custom metrics to use as criteria for the segment.
     */
    Metrics?: MapOfMetricDimension;
    /**
     * One or more custom user attributes to use as criteria for the segment.
     */
    UserAttributes?: MapOfAttributeDimension;
  }
  export interface SegmentGroup {
    /**
     * An array that defines the dimensions for the segment.
     */
    Dimensions?: ListOfSegmentDimensions;
    /**
     * The base segment to build the segment on. A base segment, also referred to as a source segment, defines the initial population of endpoints for a segment. When you add dimensions to a segment, Amazon Pinpoint filters the base segment by using the dimensions that you specify. You can specify more than one dimensional segment or only one imported segment. If you specify an imported segment, the Amazon Pinpoint console displays a segment size estimate that indicates the size of the imported segment without any filters applied to it.
     */
    SourceSegments?: ListOfSegmentReference;
    /**
     * Specifies how to handle multiple base segments for the segment. For example, if you specify three base segments for the segment, whether the resulting segment is based on all, any, or none of the base segments.
     */
    SourceType?: SourceType;
    /**
     * Specifies how to handle multiple dimensions for the segment. For example, if you specify three dimensions for the segment, whether the resulting segment includes endpoints that match all, any, or none of the dimensions.
     */
    Type?: Type;
  }
  export interface SegmentGroupList {
    /**
     * An array that defines the set of segment criteria to evaluate when handling segment groups for the segment.
     */
    Groups?: ListOfSegmentGroup;
    /**
     * Specifies how to handle multiple segment groups for the segment. For example, if the segment includes three segment groups, whether the resulting segment includes endpoints that match all, any, or none of the segment groups.
     */
    Include?: Include;
  }
  export interface SegmentImportResource {
    /**
     * The number of channel types in the endpoint definitions that were imported to create the segment.
     */
    ChannelCounts?: MapOf__integer;
    /**
     * (Deprecated) Your AWS account ID, which you assigned to an external ID key in an IAM trust policy. Amazon Pinpoint previously used this value to assume an IAM role when importing endpoint definitions, but we removed this requirement. We don't recommend use of external IDs for IAM roles that are assumed by Amazon Pinpoint.
     */
    ExternalId: __string;
    /**
     * The format of the files that were imported to create the segment. Valid values are: CSV, for comma-separated values format; and, JSON, for newline-delimited JSON format.
     */
    Format: Format;
    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that authorized Amazon Pinpoint to access the Amazon S3 location to import endpoint definitions from.
     */
    RoleArn: __string;
    /**
     * The URL of the Amazon Simple Storage Service (Amazon S3) bucket that the endpoint definitions were imported from to create the segment.
     */
    S3Url: __string;
    /**
     * The number of endpoint definitions that were imported successfully to create the segment.
     */
    Size: __integer;
  }
  export interface SegmentLocation {
    /**
     * The country or region code, in ISO 3166-1 alpha-2 format, for the segment.
     */
    Country?: SetDimension;
    /**
     * The GPS location and range for the segment.
     */
    GPSPoint?: GPSPointDimension;
  }
  export interface SegmentReference {
    /**
     * The unique identifier for the segment.
     */
    Id: __string;
    /**
     * The version number of the segment.
     */
    Version?: __integer;
  }
  export interface SegmentResponse {
    /**
     * The unique identifier for the application that the segment is associated with.
     */
    ApplicationId: __string;
    /**
     * The Amazon Resource Name (ARN) of the segment.
     */
    Arn: __string;
    /**
     * The date and time when the segment was created.
     */
    CreationDate: __string;
    /**
     * The dimension settings for the segment.
     */
    Dimensions?: SegmentDimensions;
    /**
     * The unique identifier for the segment.
     */
    Id: __string;
    /**
     * The settings for the import job that's associated with the segment.
     */
    ImportDefinition?: SegmentImportResource;
    /**
     * The date and time when the segment was last modified.
     */
    LastModifiedDate?: __string;
    /**
     * The name of the segment.
     */
    Name?: __string;
    /**
     * A list of one or more segment groups that apply to the segment. Each segment group consists of zero or more base segments and the dimensions that are applied to those base segments.
     */
    SegmentGroups?: SegmentGroupList;
    /**
     * The segment type. Valid values are: DIMENSIONAL - A dynamic segment, which is a segment that uses selection criteria that you specify and is based on endpoint data that's reported by your app. Dynamic segments can change over time. IMPORT - A static segment, which is a segment that uses selection criteria that you specify and is based on endpoint definitions that you import from a file. Imported segments are static; they don't change over time.
     */
    SegmentType: SegmentType;
    /**
     * A string-to-string map of key-value pairs that identifies the tags that are associated with the segment. Each tag consists of a required tag key and an associated tag value.
     */
    tags?: MapOf__string;
    /**
     * The version number of the segment.
     */
    Version?: __integer;
  }
  export type SegmentType = "DIMENSIONAL"|"IMPORT"|string;
  export interface SegmentsResponse {
    /**
     * An array of responses, one for each segment that's associated with the application (Segments resource) or each version of a segment that's associated with the application (Segment Versions resource).
     */
    Item: ListOfSegmentResponse;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    NextToken?: __string;
  }
  export interface SendMessagesRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    MessageRequest: MessageRequest;
  }
  export interface SendMessagesResponse {
    MessageResponse: MessageResponse;
  }
  export interface SendUsersMessageRequest {
    /**
     * A map of custom attribute-value pairs. For a push notification, Amazon Pinpoint adds these attributes to the data.pinpoint object in the body of the notification payload. Amazon Pinpoint also provides these attributes in the events that it generates for users-messages deliveries.
     */
    Context?: MapOf__string;
    /**
     * The settings and content for the default message and any default messages that you defined for specific channels.
     */
    MessageConfiguration: DirectMessageConfiguration;
    /**
     * The message template to use for the message.
     */
    TemplateConfiguration?: TemplateConfiguration;
    /**
     * The unique identifier for tracing the message. This identifier is visible to message recipients.
     */
    TraceId?: __string;
    /**
     * A map that associates user IDs with EndpointSendConfiguration objects. You can use an EndpointSendConfiguration object to tailor the message for a user by specifying settings such as content overrides and message variables.
     */
    Users: MapOfEndpointSendConfiguration;
  }
  export interface SendUsersMessageResponse {
    /**
     * The unique identifier for the application that was used to send the message.
     */
    ApplicationId: __string;
    /**
     * The unique identifier that was assigned to the message request.
     */
    RequestId?: __string;
    /**
     * An object that indicates which endpoints the message was sent to, for each user. The object lists user IDs and, for each user ID, provides the endpoint IDs that the message was sent to. For each endpoint ID, it provides an EndpointMessageResult object.
     */
    Result?: MapOfMapOfEndpointMessageResult;
  }
  export interface SendUsersMessagesRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    SendUsersMessageRequest: SendUsersMessageRequest;
  }
  export interface SendUsersMessagesResponse {
    SendUsersMessageResponse: SendUsersMessageResponse;
  }
  export interface Session {
    /**
     * The duration of the session, in milliseconds.
     */
    Duration?: __integer;
    /**
     * The unique identifier for the session.
     */
    Id: __string;
    /**
     * The date and time when the session began.
     */
    StartTimestamp: __string;
    /**
     * The date and time when the session ended.
     */
    StopTimestamp?: __string;
  }
  export interface SetDimension {
    /**
     * The type of segment dimension to use. Valid values are: INCLUSIVE, endpoints that match the criteria are included in the segment; and, EXCLUSIVE, endpoints that match the criteria are excluded from the segment.
     */
    DimensionType?: DimensionType;
    /**
     * The criteria values to use for the segment dimension. Depending on the value of the DimensionType property, endpoints are included or excluded from the segment if their values match the criteria values.
     */
    Values: ListOf__string;
  }
  export interface SimpleCondition {
    /**
     * The dimension settings for the event that's associated with the activity.
     */
    EventCondition?: EventCondition;
    /**
     * The segment that's associated with the activity.
     */
    SegmentCondition?: SegmentCondition;
    /**
     * The dimension settings for the segment that's associated with the activity.
     */
    SegmentDimensions?: SegmentDimensions;
  }
  export interface SimpleEmail {
    /**
     * The body of the email message, in HTML format. We recommend using HTML format for email clients that render HTML content. You can include links, formatted text, and more in an HTML message.
     */
    HtmlPart?: SimpleEmailPart;
    /**
     * The subject line, or title, of the email.
     */
    Subject?: SimpleEmailPart;
    /**
     * The body of the email message, in plain text format. We recommend using plain text format for email clients that don't render HTML content and clients that are connected to high-latency networks, such as mobile devices.
     */
    TextPart?: SimpleEmailPart;
  }
  export interface SimpleEmailPart {
    /**
     * The applicable character set for the message content.
     */
    Charset?: __string;
    /**
     * The textual data of the message content.
     */
    Data?: __string;
  }
  export type SourceType = "ALL"|"ANY"|"NONE"|string;
  export interface StartCondition {
    /**
     * The custom description of the condition.
     */
    Description?: __string;
    EventStartCondition?: EventStartCondition;
    /**
     * The segment that's associated with the first activity in the journey. This segment determines which users are participants in the journey.
     */
    SegmentStartCondition?: SegmentCondition;
  }
  export type State = "DRAFT"|"ACTIVE"|"COMPLETED"|"CANCELLED"|"CLOSED"|"PAUSED"|string;
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: __string;
    TagsModel: TagsModel;
  }
  export interface TagsModel {
    /**
     * A string-to-string map of key-value pairs that defines the tags for an application, campaign, message template, or segment. Each of these resources can have a maximum of 50 tags. Each tag consists of a required tag key and an associated tag value. The maximum length of a tag key is 128 characters. The maximum length of a tag value is 256 characters.
     */
    tags: MapOf__string;
  }
  export interface Template {
    /**
     * The name of the message template to use for the message. If specified, this value must match the name of an existing message template.
     */
    Name?: __string;
    /**
     * The unique identifier for the version of the message template to use for the message. If specified, this value must match the identifier for an existing template version. To retrieve a list of versions and version identifiers for a template, use the Template Versions resource. If you don't specify a value for this property, Amazon Pinpoint uses the active version of the template. The active version is typically the version of a template that's been most recently reviewed and approved for use, depending on your workflow. It isn't necessarily the latest version of a template.
     */
    Version?: __string;
  }
  export interface TemplateActiveVersionRequest {
    /**
     * The version of the message template to use as the active version of the template. Valid values are: latest, for the most recent version of the template; or, the unique identifier for any existing version of the template. If you specify an identifier, the value must match the identifier for an existing template version. To retrieve a list of versions and version identifiers for a template, use the Template Versions resource.
     */
    Version?: __string;
  }
  export interface TemplateConfiguration {
    /**
     * The email template to use for the message.
     */
    EmailTemplate?: Template;
    /**
     * The push notification template to use for the message.
     */
    PushTemplate?: Template;
    /**
     * The SMS template to use for the message.
     */
    SMSTemplate?: Template;
    /**
     * The voice template to use for the message. This object isn't supported for campaigns.
     */
    VoiceTemplate?: Template;
  }
  export interface TemplateCreateMessageBody {
    /**
     * The Amazon Resource Name (ARN) of the message template that was created.
     */
    Arn?: __string;
    /**
     * The message that's returned from the API for the request to create the message template.
     */
    Message?: __string;
    /**
     * The unique identifier for the request to create the message template.
     */
    RequestID?: __string;
  }
  export interface TemplateResponse {
    /**
     * The Amazon Resource Name (ARN) of the message template. This value isn't included in a TemplateResponse object. To retrieve the ARN of a template, use the GetEmailTemplate, GetPushTemplate, GetSmsTemplate, or GetVoiceTemplate operation, depending on the type of template that you want to retrieve the ARN for.
     */
    Arn?: __string;
    /**
     * The date, in ISO 8601 format, when the message template was created.
     */
    CreationDate: __string;
    /**
     * The JSON object that specifies the default values that are used for message variables in the message template. This object isn't included in a TemplateResponse object. To retrieve this object for a template, use the GetEmailTemplate, GetPushTemplate, GetSmsTemplate, or GetVoiceTemplate operation, depending on the type of template that you want to retrieve the object for.
     */
    DefaultSubstitutions?: __string;
    /**
     * The date, in ISO 8601 format, when the message template was last modified.
     */
    LastModifiedDate: __string;
    /**
     * A map of key-value pairs that identifies the tags that are associated with the message template. This object isn't included in a TemplateResponse object. To retrieve this object for a template, use the GetEmailTemplate, GetPushTemplate, GetSmsTemplate, or GetVoiceTemplate operation, depending on the type of template that you want to retrieve the object for.
     */
    tags?: MapOf__string;
    /**
     * The custom description of the message template. This value isn't included in a TemplateResponse object. To retrieve the description of a template, use the GetEmailTemplate, GetPushTemplate, GetSmsTemplate, or GetVoiceTemplate operation, depending on the type of template that you want to retrieve the description for.
     */
    TemplateDescription?: __string;
    /**
     * The name of the message template.
     */
    TemplateName: __string;
    /**
     * The type of channel that the message template is designed for. Possible values are: EMAIL, PUSH, SMS, and VOICE.
     */
    TemplateType: TemplateType;
    /**
     * The unique identifier, as an integer, for the active version of the message template.
     */
    Version?: __string;
  }
  export type TemplateType = "EMAIL"|"SMS"|"VOICE"|"PUSH"|"INAPP"|string;
  export interface TemplateVersionResponse {
    /**
     * The date, in ISO 8601 format, when the version of the message template was created.
     */
    CreationDate: __string;
    /**
     * A JSON object that specifies the default values that are used for message variables in the version of the message template. This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the default value for that variable.
     */
    DefaultSubstitutions?: __string;
    /**
     * The date, in ISO 8601 format, when the version of the message template was last modified.
     */
    LastModifiedDate: __string;
    /**
     * The custom description of the version of the message template.
     */
    TemplateDescription?: __string;
    /**
     * The name of the message template.
     */
    TemplateName: __string;
    /**
     * The type of channel that the message template is designed for. Possible values are: EMAIL, PUSH, SMS, and VOICE.
     */
    TemplateType: __string;
    /**
     * The unique identifier for the version of the message template. This value is an integer that Amazon Pinpoint automatically increments and assigns to each new version of a template.
     */
    Version?: __string;
  }
  export interface TemplateVersionsResponse {
    /**
     * An array of responses, one for each version of the message template.
     */
    Item: ListOfTemplateVersionResponse;
    /**
     * The message that's returned from the API for the request to retrieve information about all the versions of the message template.
     */
    Message?: __string;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    NextToken?: __string;
    /**
     * The unique identifier for the request to retrieve information about all the versions of the message template.
     */
    RequestID?: __string;
  }
  export interface TemplatesResponse {
    /**
     * An array of responses, one for each message template that's associated with your Amazon Pinpoint account and meets any filter criteria that you specified in the request.
     */
    Item: ListOfTemplateResponse;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    NextToken?: __string;
  }
  export interface TreatmentResource {
    /**
     * The delivery configuration settings for sending the treatment through a custom channel. This object is required if the MessageConfiguration object for the treatment specifies a CustomMessage object.
     */
    CustomDeliveryConfiguration?: CustomDeliveryConfiguration;
    /**
     * The unique identifier for the treatment.
     */
    Id: __string;
    /**
     * The message configuration settings for the treatment.
     */
    MessageConfiguration?: MessageConfiguration;
    /**
     * The schedule settings for the treatment.
     */
    Schedule?: Schedule;
    /**
     * The allocated percentage of users (segment members) that the treatment is sent to.
     */
    SizePercent: __integer;
    /**
     * The current status of the treatment.
     */
    State?: CampaignState;
    /**
     * The message template to use for the treatment.
     */
    TemplateConfiguration?: TemplateConfiguration;
    /**
     * The custom description of the treatment.
     */
    TreatmentDescription?: __string;
    /**
     * The custom name of the treatment.
     */
    TreatmentName?: __string;
  }
  export type Type = "ALL"|"ANY"|"NONE"|string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: __string;
    /**
     * The key of the tag to remove from the resource. To remove multiple tags, append the tagKeys parameter and argument for each additional tag to remove, separated by an ampersand (&amp;).
     */
    TagKeys: ListOf__string;
  }
  export interface UpdateAdmChannelRequest {
    ADMChannelRequest: ADMChannelRequest;
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface UpdateAdmChannelResponse {
    ADMChannelResponse: ADMChannelResponse;
  }
  export interface UpdateApnsChannelRequest {
    APNSChannelRequest: APNSChannelRequest;
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface UpdateApnsChannelResponse {
    APNSChannelResponse: APNSChannelResponse;
  }
  export interface UpdateApnsSandboxChannelRequest {
    APNSSandboxChannelRequest: APNSSandboxChannelRequest;
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface UpdateApnsSandboxChannelResponse {
    APNSSandboxChannelResponse: APNSSandboxChannelResponse;
  }
  export interface UpdateApnsVoipChannelRequest {
    APNSVoipChannelRequest: APNSVoipChannelRequest;
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface UpdateApnsVoipChannelResponse {
    APNSVoipChannelResponse: APNSVoipChannelResponse;
  }
  export interface UpdateApnsVoipSandboxChannelRequest {
    APNSVoipSandboxChannelRequest: APNSVoipSandboxChannelRequest;
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
  }
  export interface UpdateApnsVoipSandboxChannelResponse {
    APNSVoipSandboxChannelResponse: APNSVoipSandboxChannelResponse;
  }
  export interface UpdateApplicationSettingsRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    WriteApplicationSettingsRequest: WriteApplicationSettingsRequest;
  }
  export interface UpdateApplicationSettingsResponse {
    ApplicationSettingsResource: ApplicationSettingsResource;
  }
  export interface UpdateAttributesRequest {
    /**
     * An array of the attributes to remove from all the endpoints that are associated with the application. The array can specify the complete, exact name of each attribute to remove or it can specify a glob pattern that an attribute name must match in order for the attribute to be removed.
     */
    Blacklist?: ListOf__string;
  }
  export interface UpdateBaiduChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    BaiduChannelRequest: BaiduChannelRequest;
  }
  export interface UpdateBaiduChannelResponse {
    BaiduChannelResponse: BaiduChannelResponse;
  }
  export interface UpdateCampaignRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the campaign.
     */
    CampaignId: __string;
    WriteCampaignRequest: WriteCampaignRequest;
  }
  export interface UpdateCampaignResponse {
    CampaignResponse: CampaignResponse;
  }
  export interface UpdateEmailChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    EmailChannelRequest: EmailChannelRequest;
  }
  export interface UpdateEmailChannelResponse {
    EmailChannelResponse: EmailChannelResponse;
  }
  export interface UpdateEmailTemplateRequest {
    /**
     * Specifies whether to save the updates as a new version of the message template. Valid values are: true, save the updates as a new version; and, false, save the updates to (overwrite) the latest existing version of the template. If you don't specify a value for this parameter, Amazon Pinpoint saves the updates to (overwrites) the latest existing version of the template. If you specify a value of true for this parameter, don't specify a value for the version parameter. Otherwise, an error will occur.
     */
    CreateNewVersion?: __boolean;
    EmailTemplateRequest: EmailTemplateRequest;
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
    /**
     * The unique identifier for the version of the message template to update, retrieve information about, or delete. To retrieve identifiers and other information for all the versions of a template, use the Template Versions resource. If specified, this value must match the identifier for an existing template version. If specified for an update operation, this value must match the identifier for the latest existing version of the template. This restriction helps ensure that race conditions don't occur. If you don't specify a value for this parameter, Amazon Pinpoint does the following: For a get operation, retrieves information about the active version of the template. For an update operation, saves the updates to (overwrites) the latest existing version of the template, if the create-new-version parameter isn't used or is set to false. For a delete operation, deletes the template, including all versions of the template.
     */
    Version?: __string;
  }
  export interface UpdateEmailTemplateResponse {
    MessageBody: MessageBody;
  }
  export interface UpdateEndpointRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the endpoint.
     */
    EndpointId: __string;
    EndpointRequest: EndpointRequest;
  }
  export interface UpdateEndpointResponse {
    MessageBody: MessageBody;
  }
  export interface UpdateEndpointsBatchRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    EndpointBatchRequest: EndpointBatchRequest;
  }
  export interface UpdateEndpointsBatchResponse {
    MessageBody: MessageBody;
  }
  export interface UpdateGcmChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    GCMChannelRequest: GCMChannelRequest;
  }
  export interface UpdateGcmChannelResponse {
    GCMChannelResponse: GCMChannelResponse;
  }
  export interface UpdateInAppTemplateRequest {
    /**
     * Specifies whether to save the updates as a new version of the message template. Valid values are: true, save the updates as a new version; and, false, save the updates to (overwrite) the latest existing version of the template. If you don't specify a value for this parameter, Amazon Pinpoint saves the updates to (overwrites) the latest existing version of the template. If you specify a value of true for this parameter, don't specify a value for the version parameter. Otherwise, an error will occur.
     */
    CreateNewVersion?: __boolean;
    InAppTemplateRequest: InAppTemplateRequest;
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
    /**
     * The unique identifier for the version of the message template to update, retrieve information about, or delete. To retrieve identifiers and other information for all the versions of a template, use the Template Versions resource. If specified, this value must match the identifier for an existing template version. If specified for an update operation, this value must match the identifier for the latest existing version of the template. This restriction helps ensure that race conditions don't occur. If you don't specify a value for this parameter, Amazon Pinpoint does the following: For a get operation, retrieves information about the active version of the template. For an update operation, saves the updates to (overwrites) the latest existing version of the template, if the create-new-version parameter isn't used or is set to false. For a delete operation, deletes the template, including all versions of the template.
     */
    Version?: __string;
  }
  export interface UpdateInAppTemplateResponse {
    MessageBody: MessageBody;
  }
  export interface UpdateJourneyRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the journey.
     */
    JourneyId: __string;
    WriteJourneyRequest: WriteJourneyRequest;
  }
  export interface UpdateJourneyResponse {
    JourneyResponse: JourneyResponse;
  }
  export interface UpdateJourneyStateRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the journey.
     */
    JourneyId: __string;
    JourneyStateRequest: JourneyStateRequest;
  }
  export interface UpdateJourneyStateResponse {
    JourneyResponse: JourneyResponse;
  }
  export interface UpdatePushTemplateRequest {
    /**
     * Specifies whether to save the updates as a new version of the message template. Valid values are: true, save the updates as a new version; and, false, save the updates to (overwrite) the latest existing version of the template. If you don't specify a value for this parameter, Amazon Pinpoint saves the updates to (overwrites) the latest existing version of the template. If you specify a value of true for this parameter, don't specify a value for the version parameter. Otherwise, an error will occur.
     */
    CreateNewVersion?: __boolean;
    PushNotificationTemplateRequest: PushNotificationTemplateRequest;
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
    /**
     * The unique identifier for the version of the message template to update, retrieve information about, or delete. To retrieve identifiers and other information for all the versions of a template, use the Template Versions resource. If specified, this value must match the identifier for an existing template version. If specified for an update operation, this value must match the identifier for the latest existing version of the template. This restriction helps ensure that race conditions don't occur. If you don't specify a value for this parameter, Amazon Pinpoint does the following: For a get operation, retrieves information about the active version of the template. For an update operation, saves the updates to (overwrites) the latest existing version of the template, if the create-new-version parameter isn't used or is set to false. For a delete operation, deletes the template, including all versions of the template.
     */
    Version?: __string;
  }
  export interface UpdatePushTemplateResponse {
    MessageBody: MessageBody;
  }
  export interface UpdateRecommenderConfiguration {
    /**
     * A map of key-value pairs that defines 1-10 custom endpoint or user attributes, depending on the value for the RecommendationProviderIdType property. Each of these attributes temporarily stores a recommended item that's retrieved from the recommender model and sent to an AWS Lambda function for additional processing. Each attribute can be used as a message variable in a message template. In the map, the key is the name of a custom attribute and the value is a custom display name for that attribute. The display name appears in the Attribute finder of the template editor on the Amazon Pinpoint console. The following restrictions apply to these names: An attribute name must start with a letter or number and it can contain up to 50 characters. The characters can be letters, numbers, underscores (_), or hyphens (-). Attribute names are case sensitive and must be unique. An attribute display name must start with a letter or number and it can contain up to 25 characters. The characters can be letters, numbers, spaces, underscores (_), or hyphens (-). This object is required if the configuration invokes an AWS Lambda function (RecommendationTransformerUri) to process recommendation data. Otherwise, don't include this object in your request.
     */
    Attributes?: MapOf__string;
    /**
     * A custom description of the configuration for the recommender model. The description can contain up to 128 characters. The characters can be letters, numbers, spaces, or the following symbols: _ ; () , ‐.
     */
    Description?: __string;
    /**
     * A custom name of the configuration for the recommender model. The name must start with a letter or number and it can contain up to 128 characters. The characters can be letters, numbers, spaces, underscores (_), or hyphens (-).
     */
    Name?: __string;
    /**
     * The type of Amazon Pinpoint ID to associate with unique user IDs in the recommender model. This value enables the model to use attribute and event data that’s specific to a particular endpoint or user in an Amazon Pinpoint application. Valid values are: PINPOINT_ENDPOINT_ID - Associate each user in the model with a particular endpoint in Amazon Pinpoint. The data is correlated based on endpoint IDs in Amazon Pinpoint. This is the default value. PINPOINT_USER_ID - Associate each user in the model with a particular user and endpoint in Amazon Pinpoint. The data is correlated based on user IDs in Amazon Pinpoint. If you specify this value, an endpoint definition in Amazon Pinpoint has to specify both a user ID (UserId) and an endpoint ID. Otherwise, messages won’t be sent to the user's endpoint.
     */
    RecommendationProviderIdType?: __string;
    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that authorizes Amazon Pinpoint to retrieve recommendation data from the recommender model.
     */
    RecommendationProviderRoleArn: __string;
    /**
     * The Amazon Resource Name (ARN) of the recommender model to retrieve recommendation data from. This value must match the ARN of an Amazon Personalize campaign.
     */
    RecommendationProviderUri: __string;
    /**
     * The name or Amazon Resource Name (ARN) of the AWS Lambda function to invoke for additional processing of recommendation data that's retrieved from the recommender model.
     */
    RecommendationTransformerUri?: __string;
    /**
     * A custom display name for the standard endpoint or user attribute (RecommendationItems) that temporarily stores recommended items for each endpoint or user, depending on the value for the RecommendationProviderIdType property. This value is required if the configuration doesn't invoke an AWS Lambda function (RecommendationTransformerUri) to perform additional processing of recommendation data. This name appears in the Attribute finder of the template editor on the Amazon Pinpoint console. The name can contain up to 25 characters. The characters can be letters, numbers, spaces, underscores (_), or hyphens (-). These restrictions don't apply to attribute values.
     */
    RecommendationsDisplayName?: __string;
    /**
     * The number of recommended items to retrieve from the model for each endpoint or user, depending on the value for the RecommendationProviderIdType property. This number determines how many recommended items are available for use in message variables. The minimum value is 1. The maximum value is 5. The default value is 5. To use multiple recommended items and custom attributes with message variables, you have to use an AWS Lambda function (RecommendationTransformerUri) to perform additional processing of recommendation data.
     */
    RecommendationsPerMessage?: __integer;
  }
  export interface UpdateRecommenderConfigurationRequest {
    /**
     * The unique identifier for the recommender model configuration. This identifier is displayed as the Recommender ID on the Amazon Pinpoint console.
     */
    RecommenderId: __string;
    UpdateRecommenderConfiguration: UpdateRecommenderConfiguration;
  }
  export interface UpdateRecommenderConfigurationResponse {
    RecommenderConfigurationResponse: RecommenderConfigurationResponse;
  }
  export interface UpdateSegmentRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    /**
     * The unique identifier for the segment.
     */
    SegmentId: __string;
    WriteSegmentRequest: WriteSegmentRequest;
  }
  export interface UpdateSegmentResponse {
    SegmentResponse: SegmentResponse;
  }
  export interface UpdateSmsChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    SMSChannelRequest: SMSChannelRequest;
  }
  export interface UpdateSmsChannelResponse {
    SMSChannelResponse: SMSChannelResponse;
  }
  export interface UpdateSmsTemplateRequest {
    /**
     * Specifies whether to save the updates as a new version of the message template. Valid values are: true, save the updates as a new version; and, false, save the updates to (overwrite) the latest existing version of the template. If you don't specify a value for this parameter, Amazon Pinpoint saves the updates to (overwrites) the latest existing version of the template. If you specify a value of true for this parameter, don't specify a value for the version parameter. Otherwise, an error will occur.
     */
    CreateNewVersion?: __boolean;
    SMSTemplateRequest: SMSTemplateRequest;
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
    /**
     * The unique identifier for the version of the message template to update, retrieve information about, or delete. To retrieve identifiers and other information for all the versions of a template, use the Template Versions resource. If specified, this value must match the identifier for an existing template version. If specified for an update operation, this value must match the identifier for the latest existing version of the template. This restriction helps ensure that race conditions don't occur. If you don't specify a value for this parameter, Amazon Pinpoint does the following: For a get operation, retrieves information about the active version of the template. For an update operation, saves the updates to (overwrites) the latest existing version of the template, if the create-new-version parameter isn't used or is set to false. For a delete operation, deletes the template, including all versions of the template.
     */
    Version?: __string;
  }
  export interface UpdateSmsTemplateResponse {
    MessageBody: MessageBody;
  }
  export interface UpdateTemplateActiveVersionRequest {
    TemplateActiveVersionRequest: TemplateActiveVersionRequest;
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
    /**
     * The type of channel that the message template is designed for. Valid values are: EMAIL, PUSH, SMS, and VOICE.
     */
    TemplateType: __string;
  }
  export interface UpdateTemplateActiveVersionResponse {
    MessageBody: MessageBody;
  }
  export interface UpdateVoiceChannelRequest {
    /**
     * The unique identifier for the application. This identifier is displayed as the Project ID on the Amazon Pinpoint console.
     */
    ApplicationId: __string;
    VoiceChannelRequest: VoiceChannelRequest;
  }
  export interface UpdateVoiceChannelResponse {
    VoiceChannelResponse: VoiceChannelResponse;
  }
  export interface UpdateVoiceTemplateRequest {
    /**
     * Specifies whether to save the updates as a new version of the message template. Valid values are: true, save the updates as a new version; and, false, save the updates to (overwrite) the latest existing version of the template. If you don't specify a value for this parameter, Amazon Pinpoint saves the updates to (overwrites) the latest existing version of the template. If you specify a value of true for this parameter, don't specify a value for the version parameter. Otherwise, an error will occur.
     */
    CreateNewVersion?: __boolean;
    /**
     * The name of the message template. A template name must start with an alphanumeric character and can contain a maximum of 128 characters. The characters can be alphanumeric characters, underscores (_), or hyphens (-). Template names are case sensitive.
     */
    TemplateName: __string;
    /**
     * The unique identifier for the version of the message template to update, retrieve information about, or delete. To retrieve identifiers and other information for all the versions of a template, use the Template Versions resource. If specified, this value must match the identifier for an existing template version. If specified for an update operation, this value must match the identifier for the latest existing version of the template. This restriction helps ensure that race conditions don't occur. If you don't specify a value for this parameter, Amazon Pinpoint does the following: For a get operation, retrieves information about the active version of the template. For an update operation, saves the updates to (overwrites) the latest existing version of the template, if the create-new-version parameter isn't used or is set to false. For a delete operation, deletes the template, including all versions of the template.
     */
    Version?: __string;
    VoiceTemplateRequest: VoiceTemplateRequest;
  }
  export interface UpdateVoiceTemplateResponse {
    MessageBody: MessageBody;
  }
  export interface VoiceChannelRequest {
    /**
     * Specifies whether to enable the voice channel for the application.
     */
    Enabled?: __boolean;
  }
  export interface VoiceChannelResponse {
    /**
     * The unique identifier for the application that the voice channel applies to.
     */
    ApplicationId?: __string;
    /**
     * The date and time, in ISO 8601 format, when the voice channel was enabled.
     */
    CreationDate?: __string;
    /**
     * Specifies whether the voice channel is enabled for the application.
     */
    Enabled?: __boolean;
    /**
     * (Not used) This property is retained only for backward compatibility.
     */
    HasCredential?: __boolean;
    /**
     * (Deprecated) An identifier for the voice channel. This property is retained only for backward compatibility.
     */
    Id?: __string;
    /**
     * Specifies whether the voice channel is archived.
     */
    IsArchived?: __boolean;
    /**
     * The user who last modified the voice channel.
     */
    LastModifiedBy?: __string;
    /**
     * The date and time, in ISO 8601 format, when the voice channel was last modified.
     */
    LastModifiedDate?: __string;
    /**
     * The type of messaging or notification platform for the channel. For the voice channel, this value is VOICE.
     */
    Platform: __string;
    /**
     * The current version of the voice channel.
     */
    Version?: __integer;
  }
  export interface VoiceMessage {
    /**
     * The text of the script to use for the voice message.
     */
    Body?: __string;
    /**
     * The code for the language to use when synthesizing the text of the message script. For a list of supported languages and the code for each one, see the Amazon Polly Developer Guide.
     */
    LanguageCode?: __string;
    /**
     * The long code to send the voice message from. This value should be one of the dedicated long codes that's assigned to your AWS account. Although it isn't required, we recommend that you specify the long code in E.164 format, for example +12065550100, to ensure prompt and accurate delivery of the message.
     */
    OriginationNumber?: __string;
    /**
     * The default message variables to use in the voice message. You can override the default variables with individual address variables.
     */
    Substitutions?: MapOfListOf__string;
    /**
     * The name of the voice to use when delivering the message. For a list of supported voices, see the Amazon Polly Developer Guide.
     */
    VoiceId?: __string;
  }
  export interface VoiceTemplateRequest {
    /**
     * The text of the script to use in messages that are based on the message template, in plain text format.
     */
    Body?: __string;
    /**
     * A JSON object that specifies the default values to use for message variables in the message template. This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the default value for that variable. When you create a message that's based on the template, you can override these defaults with message-specific and address-specific variables and values.
     */
    DefaultSubstitutions?: __string;
    /**
     * The code for the language to use when synthesizing the text of the script in messages that are based on the message template. For a list of supported languages and the code for each one, see the Amazon Polly Developer Guide.
     */
    LanguageCode?: __string;
    /**
     * A string-to-string map of key-value pairs that defines the tags to associate with the message template. Each tag consists of a required tag key and an associated tag value.
     */
    tags?: MapOf__string;
    /**
     * A custom description of the message template.
     */
    TemplateDescription?: __string;
    /**
     * The name of the voice to use when delivering messages that are based on the message template. For a list of supported voices, see the Amazon Polly Developer Guide.
     */
    VoiceId?: __string;
  }
  export interface VoiceTemplateResponse {
    /**
     * The Amazon Resource Name (ARN) of the message template.
     */
    Arn?: __string;
    /**
     * The text of the script that's used in messages that are based on the message template, in plain text format.
     */
    Body?: __string;
    /**
     * The date, in ISO 8601 format, when the message template was created.
     */
    CreationDate: __string;
    /**
     * The JSON object that specifies the default values that are used for message variables in the message template. This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the default value for that variable.
     */
    DefaultSubstitutions?: __string;
    /**
     * The code for the language that's used when synthesizing the text of the script in messages that are based on the message template. For a list of supported languages and the code for each one, see the Amazon Polly Developer Guide.
     */
    LanguageCode?: __string;
    /**
     * The date, in ISO 8601 format, when the message template was last modified.
     */
    LastModifiedDate: __string;
    /**
     * A string-to-string map of key-value pairs that identifies the tags that are associated with the message template. Each tag consists of a required tag key and an associated tag value.
     */
    tags?: MapOf__string;
    /**
     * The custom description of the message template.
     */
    TemplateDescription?: __string;
    /**
     * The name of the message template.
     */
    TemplateName: __string;
    /**
     * The type of channel that the message template is designed for. For a voice template, this value is VOICE.
     */
    TemplateType: TemplateType;
    /**
     * The unique identifier, as an integer, for the active version of the message template, or the version of the template that you specified by using the version parameter in your request.
     */
    Version?: __string;
    /**
     * The name of the voice that's used when delivering messages that are based on the message template. For a list of supported voices, see the Amazon Polly Developer Guide.
     */
    VoiceId?: __string;
  }
  export interface WaitActivity {
    /**
     * The unique identifier for the next activity to perform, after performing the wait activity.
     */
    NextActivity?: __string;
    /**
     * The amount of time to wait or the date and time when the activity moves participants to the next activity in the journey.
     */
    WaitTime?: WaitTime;
  }
  export interface WaitTime {
    /**
     * The amount of time to wait, as a duration in ISO 8601 format, before determining whether the activity's conditions have been met or moving participants to the next activity in the journey.
     */
    WaitFor?: __string;
    /**
     * The date and time, in ISO 8601 format, when Amazon Pinpoint determines whether the activity's conditions have been met or the activity moves participants to the next activity in the journey.
     */
    WaitUntil?: __string;
  }
  export interface WriteApplicationSettingsRequest {
    /**
     * The settings for the AWS Lambda function to invoke by default as a code hook for campaigns in the application. You can use this hook to customize segments that are used by campaigns in the application. To override these settings and define custom settings for a specific campaign, use the CampaignHook object of the Campaign resource.
     */
    CampaignHook?: CampaignHook;
    /**
     * Specifies whether to enable application-related alarms in Amazon CloudWatch.
     */
    CloudWatchMetricsEnabled?: __boolean;
    EventTaggingEnabled?: __boolean;
    /**
     * The default sending limits for campaigns in the application. To override these limits and define custom limits for a specific campaign or journey, use the Campaign resource or the Journey resource, respectively.
     */
    Limits?: CampaignLimits;
    /**
     * The default quiet time for campaigns in the application. Quiet time is a specific time range when messages aren't sent to endpoints, if all the following conditions are met: The EndpointDemographic.Timezone property of the endpoint is set to a valid value. The current time in the endpoint's time zone is later than or equal to the time specified by the QuietTime.Start property for the application (or a campaign or journey that has custom quiet time settings). The current time in the endpoint's time zone is earlier than or equal to the time specified by the QuietTime.End property for the application (or a campaign or journey that has custom quiet time settings). If any of the preceding conditions isn't met, the endpoint will receive messages from a campaign or journey, even if quiet time is enabled. To override the default quiet time settings for a specific campaign or journey, use the Campaign resource or the Journey resource to define a custom quiet time for the campaign or journey.
     */
    QuietTime?: QuietTime;
  }
  export interface WriteCampaignRequest {
    /**
     * An array of requests that defines additional treatments for the campaign, in addition to the default treatment for the campaign.
     */
    AdditionalTreatments?: ListOfWriteTreatmentResource;
    /**
     * The delivery configuration settings for sending the campaign through a custom channel. This object is required if the MessageConfiguration object for the campaign specifies a CustomMessage object.
     */
    CustomDeliveryConfiguration?: CustomDeliveryConfiguration;
    /**
     * A custom description of the campaign.
     */
    Description?: __string;
    /**
     * The allocated percentage of users (segment members) who shouldn't receive messages from the campaign.
     */
    HoldoutPercent?: __integer;
    /**
     * The settings for the AWS Lambda function to invoke as a code hook for the campaign. You can use this hook to customize the segment that's used by the campaign.
     */
    Hook?: CampaignHook;
    /**
     * Specifies whether to pause the campaign. A paused campaign doesn't run unless you resume it by changing this value to false.
     */
    IsPaused?: __boolean;
    /**
     * The messaging limits for the campaign.
     */
    Limits?: CampaignLimits;
    /**
     * The message configuration settings for the campaign.
     */
    MessageConfiguration?: MessageConfiguration;
    /**
     * A custom name for the campaign.
     */
    Name?: __string;
    /**
     * The schedule settings for the campaign.
     */
    Schedule?: Schedule;
    /**
     * The unique identifier for the segment to associate with the campaign.
     */
    SegmentId?: __string;
    /**
     * The version of the segment to associate with the campaign.
     */
    SegmentVersion?: __integer;
    /**
     * A string-to-string map of key-value pairs that defines the tags to associate with the campaign. Each tag consists of a required tag key and an associated tag value.
     */
    tags?: MapOf__string;
    /**
     * The message template to use for the campaign.
     */
    TemplateConfiguration?: TemplateConfiguration;
    /**
     * A custom description of the default treatment for the campaign.
     */
    TreatmentDescription?: __string;
    /**
     * A custom name of the default treatment for the campaign, if the campaign has multiple treatments. A treatment is a variation of a campaign that's used for A/B testing.
     */
    TreatmentName?: __string;
    /**
     * Defines the priority of the campaign, used to decide the order of messages displayed to user if there are multiple messages scheduled to be displayed at the same moment.
     */
    Priority?: __integer;
  }
  export interface WriteEventStream {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Kinesis data stream or Amazon Kinesis Data Firehose delivery stream that you want to publish event data to. For a Kinesis data stream, the ARN format is: arn:aws:kinesis:region:account-id:stream/stream_name
                For a Kinesis Data Firehose delivery stream, the ARN format is: arn:aws:firehose:region:account-id:deliverystream/stream_name
               
     */
    DestinationStreamArn: __string;
    /**
     * The AWS Identity and Access Management (IAM) role that authorizes Amazon Pinpoint to publish event data to the stream in your AWS account.
     */
    RoleArn: __string;
  }
  export interface WriteJourneyRequest {
    /**
     * A map that contains a set of Activity objects, one object for each activity in the journey. For each Activity object, the key is the unique identifier (string) for an activity and the value is the settings for the activity. An activity identifier can contain a maximum of 100 characters. The characters must be alphanumeric characters.
     */
    Activities?: MapOfActivity;
    /**
     * The date, in ISO 8601 format, when the journey was created.
     */
    CreationDate?: __string;
    /**
     * The date, in ISO 8601 format, when the journey was last modified.
     */
    LastModifiedDate?: __string;
    /**
     * The messaging and entry limits for the journey.
     */
    Limits?: JourneyLimits;
    /**
     * Specifies whether the journey's scheduled start and end times use each participant's local time. To base the schedule on each participant's local time, set this value to true.
     */
    LocalTime?: __boolean;
    /**
     * The name of the journey. A journey name can contain a maximum of 150 characters. The characters can be alphanumeric characters or symbols, such as underscores (_) or hyphens (-). A journey name can't contain any spaces.
     */
    Name: __string;
    /**
     * The quiet time settings for the journey. Quiet time is a specific time range when a journey doesn't send messages to participants, if all the following conditions are met: The EndpointDemographic.Timezone property of the endpoint for the participant is set to a valid value. The current time in the participant's time zone is later than or equal to the time specified by the QuietTime.Start property for the journey. The current time in the participant's time zone is earlier than or equal to the time specified by the QuietTime.End property for the journey. If any of the preceding conditions isn't met, the participant will receive messages from the journey, even if quiet time is enabled.
     */
    QuietTime?: QuietTime;
    /**
     * The frequency with which Amazon Pinpoint evaluates segment and event data for the journey, as a duration in ISO 8601 format.
     */
    RefreshFrequency?: __string;
    /**
     * The schedule settings for the journey.
     */
    Schedule?: JourneySchedule;
    /**
     * The unique identifier for the first activity in the journey. The identifier for this activity can contain a maximum of 128 characters. The characters must be alphanumeric characters.
     */
    StartActivity?: __string;
    /**
     * The segment that defines which users are participants in the journey.
     */
    StartCondition?: StartCondition;
    /**
     * The status of the journey. Valid values are: DRAFT - Saves the journey and doesn't publish it. ACTIVE - Saves and publishes the journey. Depending on the journey's schedule, the journey starts running immediately or at the scheduled start time. If a journey's status is ACTIVE, you can't add, change, or remove activities from it. PAUSED, CANCELLED, COMPLETED, and CLOSED states are not supported in requests to create or update a journey. To cancel, pause, or resume a journey, use the Journey State resource.
     */
    State?: State;
    /**
     * Specifies whether endpoints in quiet hours should enter a wait till the end of their quiet hours.
     */
    WaitForQuietTime?: __boolean;
    /**
     * Specifies whether a journey should be refreshed on segment update.
     */
    RefreshOnSegmentUpdate?: __boolean;
  }
  export interface WriteSegmentRequest {
    /**
     * The criteria that define the dimensions for the segment.
     */
    Dimensions?: SegmentDimensions;
    /**
     * The name of the segment.
     */
    Name?: __string;
    /**
     * The segment group to use and the dimensions to apply to the group's base segments in order to build the segment. A segment group can consist of zero or more base segments. Your request can include only one segment group.
     */
    SegmentGroups?: SegmentGroupList;
    /**
     * A string-to-string map of key-value pairs that defines the tags to associate with the segment. Each tag consists of a required tag key and an associated tag value.
     */
    tags?: MapOf__string;
  }
  export interface WriteTreatmentResource {
    /**
     * The delivery configuration settings for sending the treatment through a custom channel. This object is required if the MessageConfiguration object for the treatment specifies a CustomMessage object.
     */
    CustomDeliveryConfiguration?: CustomDeliveryConfiguration;
    /**
     * The message configuration settings for the treatment.
     */
    MessageConfiguration?: MessageConfiguration;
    /**
     * The schedule settings for the treatment.
     */
    Schedule?: Schedule;
    /**
     * The allocated percentage of users (segment members) to send the treatment to.
     */
    SizePercent: __integer;
    /**
     * The message template to use for the treatment.
     */
    TemplateConfiguration?: TemplateConfiguration;
    /**
     * A custom description of the treatment.
     */
    TreatmentDescription?: __string;
    /**
     * A custom name for the treatment.
     */
    TreatmentName?: __string;
  }
  export type __EndpointTypesElement = "PUSH"|"GCM"|"APNS"|"APNS_SANDBOX"|"APNS_VOIP"|"APNS_VOIP_SANDBOX"|"ADM"|"SMS"|"VOICE"|"EMAIL"|"BAIDU"|"CUSTOM"|"IN_APP"|string;
  export type __boolean = boolean;
  export type __double = number;
  export type __integer = number;
  export type ListOfActivityResponse = ActivityResponse[];
  export type ListOfApplicationResponse = ApplicationResponse[];
  export type ListOfCampaignResponse = CampaignResponse[];
  export type ListOfEndpointBatchItem = EndpointBatchItem[];
  export type ListOfEndpointResponse = EndpointResponse[];
  export type ListOfExportJobResponse = ExportJobResponse[];
  export type ListOfImportJobResponse = ImportJobResponse[];
  export type ListOfInAppMessageCampaign = InAppMessageCampaign[];
  export type ListOfInAppMessageContent = InAppMessageContent[];
  export type ListOfJourneyResponse = JourneyResponse[];
  export type ListOfMultiConditionalBranch = MultiConditionalBranch[];
  export type ListOfRandomSplitEntry = RandomSplitEntry[];
  export type ListOfRecommenderConfigurationResponse = RecommenderConfigurationResponse[];
  export type ListOfResultRow = ResultRow[];
  export type ListOfResultRowValue = ResultRowValue[];
  export type ListOfSegmentDimensions = SegmentDimensions[];
  export type ListOfSegmentGroup = SegmentGroup[];
  export type ListOfSegmentReference = SegmentReference[];
  export type ListOfSegmentResponse = SegmentResponse[];
  export type ListOfSimpleCondition = SimpleCondition[];
  export type ListOfTemplateResponse = TemplateResponse[];
  export type ListOfTemplateVersionResponse = TemplateVersionResponse[];
  export type ListOfTreatmentResource = TreatmentResource[];
  export type ListOfWriteTreatmentResource = WriteTreatmentResource[];
  export type ListOf__EndpointTypesElement = __EndpointTypesElement[];
  export type ListOf__string = __string[];
  export type MapOfActivity = {[key: string]: Activity};
  export type MapOfAddressConfiguration = {[key: string]: AddressConfiguration};
  export type MapOfAttributeDimension = {[key: string]: AttributeDimension};
  export type MapOfChannelResponse = {[key: string]: ChannelResponse};
  export type MapOfEndpointMessageResult = {[key: string]: EndpointMessageResult};
  export type MapOfEndpointSendConfiguration = {[key: string]: EndpointSendConfiguration};
  export type MapOfEvent = {[key: string]: Event};
  export type MapOfEventItemResponse = {[key: string]: EventItemResponse};
  export type MapOfEventsBatch = {[key: string]: EventsBatch};
  export type MapOfItemResponse = {[key: string]: ItemResponse};
  export type MapOfMessageResult = {[key: string]: MessageResult};
  export type MapOfMetricDimension = {[key: string]: MetricDimension};
  export type MapOf__double = {[key: string]: __double};
  export type MapOf__integer = {[key: string]: __integer};
  export type MapOfListOf__string = {[key: string]: ListOf__string};
  export type MapOfMapOfEndpointMessageResult = {[key: string]: MapOfEndpointMessageResult};
  export type MapOf__string = {[key: string]: __string};
  export type __string = string;
  export type __timestampIso8601 = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2016-12-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Pinpoint client.
   */
  export import Types = Pinpoint;
}
export = Pinpoint;
