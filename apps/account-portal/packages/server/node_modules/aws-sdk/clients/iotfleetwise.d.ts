import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class IoTFleetWise extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: IoTFleetWise.Types.ClientConfiguration)
  config: Config & IoTFleetWise.Types.ClientConfiguration;
  /**
   *  Adds, or associates, a vehicle with a fleet. 
   */
  associateVehicleFleet(params: IoTFleetWise.Types.AssociateVehicleFleetRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.AssociateVehicleFleetResponse) => void): Request<IoTFleetWise.Types.AssociateVehicleFleetResponse, AWSError>;
  /**
   *  Adds, or associates, a vehicle with a fleet. 
   */
  associateVehicleFleet(callback?: (err: AWSError, data: IoTFleetWise.Types.AssociateVehicleFleetResponse) => void): Request<IoTFleetWise.Types.AssociateVehicleFleetResponse, AWSError>;
  /**
   *  Creates a group, or batch, of vehicles.    You must specify a decoder manifest and a vehicle model (model manifest) for each vehicle.   For more information, see Create multiple vehicles (AWS CLI) in the Amazon Web Services IoT FleetWise Developer Guide. 
   */
  batchCreateVehicle(params: IoTFleetWise.Types.BatchCreateVehicleRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.BatchCreateVehicleResponse) => void): Request<IoTFleetWise.Types.BatchCreateVehicleResponse, AWSError>;
  /**
   *  Creates a group, or batch, of vehicles.    You must specify a decoder manifest and a vehicle model (model manifest) for each vehicle.   For more information, see Create multiple vehicles (AWS CLI) in the Amazon Web Services IoT FleetWise Developer Guide. 
   */
  batchCreateVehicle(callback?: (err: AWSError, data: IoTFleetWise.Types.BatchCreateVehicleResponse) => void): Request<IoTFleetWise.Types.BatchCreateVehicleResponse, AWSError>;
  /**
   *  Updates a group, or batch, of vehicles.   You must specify a decoder manifest and a vehicle model (model manifest) for each vehicle.   For more information, see Update multiple vehicles (AWS CLI) in the Amazon Web Services IoT FleetWise Developer Guide. 
   */
  batchUpdateVehicle(params: IoTFleetWise.Types.BatchUpdateVehicleRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.BatchUpdateVehicleResponse) => void): Request<IoTFleetWise.Types.BatchUpdateVehicleResponse, AWSError>;
  /**
   *  Updates a group, or batch, of vehicles.   You must specify a decoder manifest and a vehicle model (model manifest) for each vehicle.   For more information, see Update multiple vehicles (AWS CLI) in the Amazon Web Services IoT FleetWise Developer Guide. 
   */
  batchUpdateVehicle(callback?: (err: AWSError, data: IoTFleetWise.Types.BatchUpdateVehicleResponse) => void): Request<IoTFleetWise.Types.BatchUpdateVehicleResponse, AWSError>;
  /**
   * Creates an orchestration of data collection rules. The Amazon Web Services IoT FleetWise Edge Agent software running in vehicles uses campaigns to decide how to collect and transfer data to the cloud. You create campaigns in the cloud. After you or your team approve campaigns, Amazon Web Services IoT FleetWise automatically deploys them to vehicles.  For more information, see Collect and transfer data with campaigns in the Amazon Web Services IoT FleetWise Developer Guide.
   */
  createCampaign(params: IoTFleetWise.Types.CreateCampaignRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.CreateCampaignResponse) => void): Request<IoTFleetWise.Types.CreateCampaignResponse, AWSError>;
  /**
   * Creates an orchestration of data collection rules. The Amazon Web Services IoT FleetWise Edge Agent software running in vehicles uses campaigns to decide how to collect and transfer data to the cloud. You create campaigns in the cloud. After you or your team approve campaigns, Amazon Web Services IoT FleetWise automatically deploys them to vehicles.  For more information, see Collect and transfer data with campaigns in the Amazon Web Services IoT FleetWise Developer Guide.
   */
  createCampaign(callback?: (err: AWSError, data: IoTFleetWise.Types.CreateCampaignResponse) => void): Request<IoTFleetWise.Types.CreateCampaignResponse, AWSError>;
  /**
   * Creates the decoder manifest associated with a model manifest. To create a decoder manifest, the following must be true:   Every signal decoder has a unique name.   Each signal decoder is associated with a network interface.   Each network interface has a unique ID.   The signal decoders are specified in the model manifest.  
   */
  createDecoderManifest(params: IoTFleetWise.Types.CreateDecoderManifestRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.CreateDecoderManifestResponse) => void): Request<IoTFleetWise.Types.CreateDecoderManifestResponse, AWSError>;
  /**
   * Creates the decoder manifest associated with a model manifest. To create a decoder manifest, the following must be true:   Every signal decoder has a unique name.   Each signal decoder is associated with a network interface.   Each network interface has a unique ID.   The signal decoders are specified in the model manifest.  
   */
  createDecoderManifest(callback?: (err: AWSError, data: IoTFleetWise.Types.CreateDecoderManifestResponse) => void): Request<IoTFleetWise.Types.CreateDecoderManifestResponse, AWSError>;
  /**
   *  Creates a fleet that represents a group of vehicles.   You must create both a signal catalog and vehicles before you can create a fleet.   For more information, see Fleets in the Amazon Web Services IoT FleetWise Developer Guide.
   */
  createFleet(params: IoTFleetWise.Types.CreateFleetRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.CreateFleetResponse) => void): Request<IoTFleetWise.Types.CreateFleetResponse, AWSError>;
  /**
   *  Creates a fleet that represents a group of vehicles.   You must create both a signal catalog and vehicles before you can create a fleet.   For more information, see Fleets in the Amazon Web Services IoT FleetWise Developer Guide.
   */
  createFleet(callback?: (err: AWSError, data: IoTFleetWise.Types.CreateFleetResponse) => void): Request<IoTFleetWise.Types.CreateFleetResponse, AWSError>;
  /**
   *  Creates a vehicle model (model manifest) that specifies signals (attributes, branches, sensors, and actuators).  For more information, see Vehicle models in the Amazon Web Services IoT FleetWise Developer Guide.
   */
  createModelManifest(params: IoTFleetWise.Types.CreateModelManifestRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.CreateModelManifestResponse) => void): Request<IoTFleetWise.Types.CreateModelManifestResponse, AWSError>;
  /**
   *  Creates a vehicle model (model manifest) that specifies signals (attributes, branches, sensors, and actuators).  For more information, see Vehicle models in the Amazon Web Services IoT FleetWise Developer Guide.
   */
  createModelManifest(callback?: (err: AWSError, data: IoTFleetWise.Types.CreateModelManifestResponse) => void): Request<IoTFleetWise.Types.CreateModelManifestResponse, AWSError>;
  /**
   *  Creates a collection of standardized signals that can be reused to create vehicle models.
   */
  createSignalCatalog(params: IoTFleetWise.Types.CreateSignalCatalogRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.CreateSignalCatalogResponse) => void): Request<IoTFleetWise.Types.CreateSignalCatalogResponse, AWSError>;
  /**
   *  Creates a collection of standardized signals that can be reused to create vehicle models.
   */
  createSignalCatalog(callback?: (err: AWSError, data: IoTFleetWise.Types.CreateSignalCatalogResponse) => void): Request<IoTFleetWise.Types.CreateSignalCatalogResponse, AWSError>;
  /**
   *  Creates a vehicle, which is an instance of a vehicle model (model manifest). Vehicles created from the same vehicle model consist of the same signals inherited from the vehicle model.   If you have an existing Amazon Web Services IoT thing, you can use Amazon Web Services IoT FleetWise to create a vehicle and collect data from your thing.   For more information, see Create a vehicle (AWS CLI) in the Amazon Web Services IoT FleetWise Developer Guide.
   */
  createVehicle(params: IoTFleetWise.Types.CreateVehicleRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.CreateVehicleResponse) => void): Request<IoTFleetWise.Types.CreateVehicleResponse, AWSError>;
  /**
   *  Creates a vehicle, which is an instance of a vehicle model (model manifest). Vehicles created from the same vehicle model consist of the same signals inherited from the vehicle model.   If you have an existing Amazon Web Services IoT thing, you can use Amazon Web Services IoT FleetWise to create a vehicle and collect data from your thing.   For more information, see Create a vehicle (AWS CLI) in the Amazon Web Services IoT FleetWise Developer Guide.
   */
  createVehicle(callback?: (err: AWSError, data: IoTFleetWise.Types.CreateVehicleResponse) => void): Request<IoTFleetWise.Types.CreateVehicleResponse, AWSError>;
  /**
   *  Deletes a data collection campaign. Deleting a campaign suspends all data collection and removes it from any vehicles. 
   */
  deleteCampaign(params: IoTFleetWise.Types.DeleteCampaignRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.DeleteCampaignResponse) => void): Request<IoTFleetWise.Types.DeleteCampaignResponse, AWSError>;
  /**
   *  Deletes a data collection campaign. Deleting a campaign suspends all data collection and removes it from any vehicles. 
   */
  deleteCampaign(callback?: (err: AWSError, data: IoTFleetWise.Types.DeleteCampaignResponse) => void): Request<IoTFleetWise.Types.DeleteCampaignResponse, AWSError>;
  /**
   *  Deletes a decoder manifest. You can't delete a decoder manifest if it has vehicles associated with it.   If the decoder manifest is successfully deleted, Amazon Web Services IoT FleetWise sends back an HTTP 200 response with an empty body. 
   */
  deleteDecoderManifest(params: IoTFleetWise.Types.DeleteDecoderManifestRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.DeleteDecoderManifestResponse) => void): Request<IoTFleetWise.Types.DeleteDecoderManifestResponse, AWSError>;
  /**
   *  Deletes a decoder manifest. You can't delete a decoder manifest if it has vehicles associated with it.   If the decoder manifest is successfully deleted, Amazon Web Services IoT FleetWise sends back an HTTP 200 response with an empty body. 
   */
  deleteDecoderManifest(callback?: (err: AWSError, data: IoTFleetWise.Types.DeleteDecoderManifestResponse) => void): Request<IoTFleetWise.Types.DeleteDecoderManifestResponse, AWSError>;
  /**
   *  Deletes a fleet. Before you delete a fleet, all vehicles must be dissociated from the fleet. For more information, see Delete a fleet (AWS CLI) in the Amazon Web Services IoT FleetWise Developer Guide.  If the fleet is successfully deleted, Amazon Web Services IoT FleetWise sends back an HTTP 200 response with an empty body. 
   */
  deleteFleet(params: IoTFleetWise.Types.DeleteFleetRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.DeleteFleetResponse) => void): Request<IoTFleetWise.Types.DeleteFleetResponse, AWSError>;
  /**
   *  Deletes a fleet. Before you delete a fleet, all vehicles must be dissociated from the fleet. For more information, see Delete a fleet (AWS CLI) in the Amazon Web Services IoT FleetWise Developer Guide.  If the fleet is successfully deleted, Amazon Web Services IoT FleetWise sends back an HTTP 200 response with an empty body. 
   */
  deleteFleet(callback?: (err: AWSError, data: IoTFleetWise.Types.DeleteFleetResponse) => void): Request<IoTFleetWise.Types.DeleteFleetResponse, AWSError>;
  /**
   *  Deletes a vehicle model (model manifest).  If the vehicle model is successfully deleted, Amazon Web Services IoT FleetWise sends back an HTTP 200 response with an empty body. 
   */
  deleteModelManifest(params: IoTFleetWise.Types.DeleteModelManifestRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.DeleteModelManifestResponse) => void): Request<IoTFleetWise.Types.DeleteModelManifestResponse, AWSError>;
  /**
   *  Deletes a vehicle model (model manifest).  If the vehicle model is successfully deleted, Amazon Web Services IoT FleetWise sends back an HTTP 200 response with an empty body. 
   */
  deleteModelManifest(callback?: (err: AWSError, data: IoTFleetWise.Types.DeleteModelManifestResponse) => void): Request<IoTFleetWise.Types.DeleteModelManifestResponse, AWSError>;
  /**
   *  Deletes a signal catalog.   If the signal catalog is successfully deleted, Amazon Web Services IoT FleetWise sends back an HTTP 200 response with an empty body. 
   */
  deleteSignalCatalog(params: IoTFleetWise.Types.DeleteSignalCatalogRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.DeleteSignalCatalogResponse) => void): Request<IoTFleetWise.Types.DeleteSignalCatalogResponse, AWSError>;
  /**
   *  Deletes a signal catalog.   If the signal catalog is successfully deleted, Amazon Web Services IoT FleetWise sends back an HTTP 200 response with an empty body. 
   */
  deleteSignalCatalog(callback?: (err: AWSError, data: IoTFleetWise.Types.DeleteSignalCatalogResponse) => void): Request<IoTFleetWise.Types.DeleteSignalCatalogResponse, AWSError>;
  /**
   *  Deletes a vehicle and removes it from any campaigns.  If the vehicle is successfully deleted, Amazon Web Services IoT FleetWise sends back an HTTP 200 response with an empty body. 
   */
  deleteVehicle(params: IoTFleetWise.Types.DeleteVehicleRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.DeleteVehicleResponse) => void): Request<IoTFleetWise.Types.DeleteVehicleResponse, AWSError>;
  /**
   *  Deletes a vehicle and removes it from any campaigns.  If the vehicle is successfully deleted, Amazon Web Services IoT FleetWise sends back an HTTP 200 response with an empty body. 
   */
  deleteVehicle(callback?: (err: AWSError, data: IoTFleetWise.Types.DeleteVehicleResponse) => void): Request<IoTFleetWise.Types.DeleteVehicleResponse, AWSError>;
  /**
   * Removes, or disassociates, a vehicle from a fleet. Disassociating a vehicle from a fleet doesn't delete the vehicle.  If the vehicle is successfully dissociated from a fleet, Amazon Web Services IoT FleetWise sends back an HTTP 200 response with an empty body. 
   */
  disassociateVehicleFleet(params: IoTFleetWise.Types.DisassociateVehicleFleetRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.DisassociateVehicleFleetResponse) => void): Request<IoTFleetWise.Types.DisassociateVehicleFleetResponse, AWSError>;
  /**
   * Removes, or disassociates, a vehicle from a fleet. Disassociating a vehicle from a fleet doesn't delete the vehicle.  If the vehicle is successfully dissociated from a fleet, Amazon Web Services IoT FleetWise sends back an HTTP 200 response with an empty body. 
   */
  disassociateVehicleFleet(callback?: (err: AWSError, data: IoTFleetWise.Types.DisassociateVehicleFleetResponse) => void): Request<IoTFleetWise.Types.DisassociateVehicleFleetResponse, AWSError>;
  /**
   *  Retrieves information about a campaign. 
   */
  getCampaign(params: IoTFleetWise.Types.GetCampaignRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.GetCampaignResponse) => void): Request<IoTFleetWise.Types.GetCampaignResponse, AWSError>;
  /**
   *  Retrieves information about a campaign. 
   */
  getCampaign(callback?: (err: AWSError, data: IoTFleetWise.Types.GetCampaignResponse) => void): Request<IoTFleetWise.Types.GetCampaignResponse, AWSError>;
  /**
   *  Retrieves information about a created decoder manifest. 
   */
  getDecoderManifest(params: IoTFleetWise.Types.GetDecoderManifestRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.GetDecoderManifestResponse) => void): Request<IoTFleetWise.Types.GetDecoderManifestResponse, AWSError>;
  /**
   *  Retrieves information about a created decoder manifest. 
   */
  getDecoderManifest(callback?: (err: AWSError, data: IoTFleetWise.Types.GetDecoderManifestResponse) => void): Request<IoTFleetWise.Types.GetDecoderManifestResponse, AWSError>;
  /**
   * Retrieves the encryption configuration for resources and data in Amazon Web Services IoT FleetWise.
   */
  getEncryptionConfiguration(params: IoTFleetWise.Types.GetEncryptionConfigurationRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.GetEncryptionConfigurationResponse) => void): Request<IoTFleetWise.Types.GetEncryptionConfigurationResponse, AWSError>;
  /**
   * Retrieves the encryption configuration for resources and data in Amazon Web Services IoT FleetWise.
   */
  getEncryptionConfiguration(callback?: (err: AWSError, data: IoTFleetWise.Types.GetEncryptionConfigurationResponse) => void): Request<IoTFleetWise.Types.GetEncryptionConfigurationResponse, AWSError>;
  /**
   *  Retrieves information about a fleet. 
   */
  getFleet(params: IoTFleetWise.Types.GetFleetRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.GetFleetResponse) => void): Request<IoTFleetWise.Types.GetFleetResponse, AWSError>;
  /**
   *  Retrieves information about a fleet. 
   */
  getFleet(callback?: (err: AWSError, data: IoTFleetWise.Types.GetFleetResponse) => void): Request<IoTFleetWise.Types.GetFleetResponse, AWSError>;
  /**
   * Retrieves the logging options.
   */
  getLoggingOptions(params: IoTFleetWise.Types.GetLoggingOptionsRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.GetLoggingOptionsResponse) => void): Request<IoTFleetWise.Types.GetLoggingOptionsResponse, AWSError>;
  /**
   * Retrieves the logging options.
   */
  getLoggingOptions(callback?: (err: AWSError, data: IoTFleetWise.Types.GetLoggingOptionsResponse) => void): Request<IoTFleetWise.Types.GetLoggingOptionsResponse, AWSError>;
  /**
   *  Retrieves information about a vehicle model (model manifest). 
   */
  getModelManifest(params: IoTFleetWise.Types.GetModelManifestRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.GetModelManifestResponse) => void): Request<IoTFleetWise.Types.GetModelManifestResponse, AWSError>;
  /**
   *  Retrieves information about a vehicle model (model manifest). 
   */
  getModelManifest(callback?: (err: AWSError, data: IoTFleetWise.Types.GetModelManifestResponse) => void): Request<IoTFleetWise.Types.GetModelManifestResponse, AWSError>;
  /**
   *  Retrieves information about the status of registering your Amazon Web Services account, IAM, and Amazon Timestream resources so that Amazon Web Services IoT FleetWise can transfer your vehicle data to the Amazon Web Services Cloud.  For more information, including step-by-step procedures, see Setting up Amazon Web Services IoT FleetWise.   This API operation doesn't require input parameters. 
   */
  getRegisterAccountStatus(params: IoTFleetWise.Types.GetRegisterAccountStatusRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.GetRegisterAccountStatusResponse) => void): Request<IoTFleetWise.Types.GetRegisterAccountStatusResponse, AWSError>;
  /**
   *  Retrieves information about the status of registering your Amazon Web Services account, IAM, and Amazon Timestream resources so that Amazon Web Services IoT FleetWise can transfer your vehicle data to the Amazon Web Services Cloud.  For more information, including step-by-step procedures, see Setting up Amazon Web Services IoT FleetWise.   This API operation doesn't require input parameters. 
   */
  getRegisterAccountStatus(callback?: (err: AWSError, data: IoTFleetWise.Types.GetRegisterAccountStatusResponse) => void): Request<IoTFleetWise.Types.GetRegisterAccountStatusResponse, AWSError>;
  /**
   *  Retrieves information about a signal catalog. 
   */
  getSignalCatalog(params: IoTFleetWise.Types.GetSignalCatalogRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.GetSignalCatalogResponse) => void): Request<IoTFleetWise.Types.GetSignalCatalogResponse, AWSError>;
  /**
   *  Retrieves information about a signal catalog. 
   */
  getSignalCatalog(callback?: (err: AWSError, data: IoTFleetWise.Types.GetSignalCatalogResponse) => void): Request<IoTFleetWise.Types.GetSignalCatalogResponse, AWSError>;
  /**
   *  Retrieves information about a vehicle. 
   */
  getVehicle(params: IoTFleetWise.Types.GetVehicleRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.GetVehicleResponse) => void): Request<IoTFleetWise.Types.GetVehicleResponse, AWSError>;
  /**
   *  Retrieves information about a vehicle. 
   */
  getVehicle(callback?: (err: AWSError, data: IoTFleetWise.Types.GetVehicleResponse) => void): Request<IoTFleetWise.Types.GetVehicleResponse, AWSError>;
  /**
   *  Retrieves information about the status of a vehicle with any associated campaigns. 
   */
  getVehicleStatus(params: IoTFleetWise.Types.GetVehicleStatusRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.GetVehicleStatusResponse) => void): Request<IoTFleetWise.Types.GetVehicleStatusResponse, AWSError>;
  /**
   *  Retrieves information about the status of a vehicle with any associated campaigns. 
   */
  getVehicleStatus(callback?: (err: AWSError, data: IoTFleetWise.Types.GetVehicleStatusResponse) => void): Request<IoTFleetWise.Types.GetVehicleStatusResponse, AWSError>;
  /**
   *  Creates a decoder manifest using your existing CAN DBC file from your local device. 
   */
  importDecoderManifest(params: IoTFleetWise.Types.ImportDecoderManifestRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.ImportDecoderManifestResponse) => void): Request<IoTFleetWise.Types.ImportDecoderManifestResponse, AWSError>;
  /**
   *  Creates a decoder manifest using your existing CAN DBC file from your local device. 
   */
  importDecoderManifest(callback?: (err: AWSError, data: IoTFleetWise.Types.ImportDecoderManifestResponse) => void): Request<IoTFleetWise.Types.ImportDecoderManifestResponse, AWSError>;
  /**
   *  Creates a signal catalog using your existing VSS formatted content from your local device. 
   */
  importSignalCatalog(params: IoTFleetWise.Types.ImportSignalCatalogRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.ImportSignalCatalogResponse) => void): Request<IoTFleetWise.Types.ImportSignalCatalogResponse, AWSError>;
  /**
   *  Creates a signal catalog using your existing VSS formatted content from your local device. 
   */
  importSignalCatalog(callback?: (err: AWSError, data: IoTFleetWise.Types.ImportSignalCatalogResponse) => void): Request<IoTFleetWise.Types.ImportSignalCatalogResponse, AWSError>;
  /**
   *  Lists information about created campaigns.   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listCampaigns(params: IoTFleetWise.Types.ListCampaignsRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.ListCampaignsResponse) => void): Request<IoTFleetWise.Types.ListCampaignsResponse, AWSError>;
  /**
   *  Lists information about created campaigns.   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listCampaigns(callback?: (err: AWSError, data: IoTFleetWise.Types.ListCampaignsResponse) => void): Request<IoTFleetWise.Types.ListCampaignsResponse, AWSError>;
  /**
   *  Lists the network interfaces specified in a decoder manifest.   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listDecoderManifestNetworkInterfaces(params: IoTFleetWise.Types.ListDecoderManifestNetworkInterfacesRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.ListDecoderManifestNetworkInterfacesResponse) => void): Request<IoTFleetWise.Types.ListDecoderManifestNetworkInterfacesResponse, AWSError>;
  /**
   *  Lists the network interfaces specified in a decoder manifest.   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listDecoderManifestNetworkInterfaces(callback?: (err: AWSError, data: IoTFleetWise.Types.ListDecoderManifestNetworkInterfacesResponse) => void): Request<IoTFleetWise.Types.ListDecoderManifestNetworkInterfacesResponse, AWSError>;
  /**
   *  A list of information about signal decoders specified in a decoder manifest.   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listDecoderManifestSignals(params: IoTFleetWise.Types.ListDecoderManifestSignalsRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.ListDecoderManifestSignalsResponse) => void): Request<IoTFleetWise.Types.ListDecoderManifestSignalsResponse, AWSError>;
  /**
   *  A list of information about signal decoders specified in a decoder manifest.   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listDecoderManifestSignals(callback?: (err: AWSError, data: IoTFleetWise.Types.ListDecoderManifestSignalsResponse) => void): Request<IoTFleetWise.Types.ListDecoderManifestSignalsResponse, AWSError>;
  /**
   *  Lists decoder manifests.   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listDecoderManifests(params: IoTFleetWise.Types.ListDecoderManifestsRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.ListDecoderManifestsResponse) => void): Request<IoTFleetWise.Types.ListDecoderManifestsResponse, AWSError>;
  /**
   *  Lists decoder manifests.   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listDecoderManifests(callback?: (err: AWSError, data: IoTFleetWise.Types.ListDecoderManifestsResponse) => void): Request<IoTFleetWise.Types.ListDecoderManifestsResponse, AWSError>;
  /**
   *  Retrieves information for each created fleet in an Amazon Web Services account.   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listFleets(params: IoTFleetWise.Types.ListFleetsRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.ListFleetsResponse) => void): Request<IoTFleetWise.Types.ListFleetsResponse, AWSError>;
  /**
   *  Retrieves information for each created fleet in an Amazon Web Services account.   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listFleets(callback?: (err: AWSError, data: IoTFleetWise.Types.ListFleetsResponse) => void): Request<IoTFleetWise.Types.ListFleetsResponse, AWSError>;
  /**
   * Retrieves a list of IDs for all fleets that the vehicle is associated with.  This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listFleetsForVehicle(params: IoTFleetWise.Types.ListFleetsForVehicleRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.ListFleetsForVehicleResponse) => void): Request<IoTFleetWise.Types.ListFleetsForVehicleResponse, AWSError>;
  /**
   * Retrieves a list of IDs for all fleets that the vehicle is associated with.  This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listFleetsForVehicle(callback?: (err: AWSError, data: IoTFleetWise.Types.ListFleetsForVehicleResponse) => void): Request<IoTFleetWise.Types.ListFleetsForVehicleResponse, AWSError>;
  /**
   *  Lists information about nodes specified in a vehicle model (model manifest).   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listModelManifestNodes(params: IoTFleetWise.Types.ListModelManifestNodesRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.ListModelManifestNodesResponse) => void): Request<IoTFleetWise.Types.ListModelManifestNodesResponse, AWSError>;
  /**
   *  Lists information about nodes specified in a vehicle model (model manifest).   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listModelManifestNodes(callback?: (err: AWSError, data: IoTFleetWise.Types.ListModelManifestNodesResponse) => void): Request<IoTFleetWise.Types.ListModelManifestNodesResponse, AWSError>;
  /**
   *  Retrieves a list of vehicle models (model manifests).   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listModelManifests(params: IoTFleetWise.Types.ListModelManifestsRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.ListModelManifestsResponse) => void): Request<IoTFleetWise.Types.ListModelManifestsResponse, AWSError>;
  /**
   *  Retrieves a list of vehicle models (model manifests).   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listModelManifests(callback?: (err: AWSError, data: IoTFleetWise.Types.ListModelManifestsResponse) => void): Request<IoTFleetWise.Types.ListModelManifestsResponse, AWSError>;
  /**
   *  Lists of information about the signals (nodes) specified in a signal catalog.   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listSignalCatalogNodes(params: IoTFleetWise.Types.ListSignalCatalogNodesRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.ListSignalCatalogNodesResponse) => void): Request<IoTFleetWise.Types.ListSignalCatalogNodesResponse, AWSError>;
  /**
   *  Lists of information about the signals (nodes) specified in a signal catalog.   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listSignalCatalogNodes(callback?: (err: AWSError, data: IoTFleetWise.Types.ListSignalCatalogNodesResponse) => void): Request<IoTFleetWise.Types.ListSignalCatalogNodesResponse, AWSError>;
  /**
   *  Lists all the created signal catalogs in an Amazon Web Services account.  You can use to list information about each signal (node) specified in a signal catalog.  This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listSignalCatalogs(params: IoTFleetWise.Types.ListSignalCatalogsRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.ListSignalCatalogsResponse) => void): Request<IoTFleetWise.Types.ListSignalCatalogsResponse, AWSError>;
  /**
   *  Lists all the created signal catalogs in an Amazon Web Services account.  You can use to list information about each signal (node) specified in a signal catalog.  This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listSignalCatalogs(callback?: (err: AWSError, data: IoTFleetWise.Types.ListSignalCatalogsResponse) => void): Request<IoTFleetWise.Types.ListSignalCatalogsResponse, AWSError>;
  /**
   * Lists the tags (metadata) you have assigned to the resource.
   */
  listTagsForResource(params: IoTFleetWise.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.ListTagsForResourceResponse) => void): Request<IoTFleetWise.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags (metadata) you have assigned to the resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: IoTFleetWise.Types.ListTagsForResourceResponse) => void): Request<IoTFleetWise.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  Retrieves a list of summaries of created vehicles.   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listVehicles(params: IoTFleetWise.Types.ListVehiclesRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.ListVehiclesResponse) => void): Request<IoTFleetWise.Types.ListVehiclesResponse, AWSError>;
  /**
   *  Retrieves a list of summaries of created vehicles.   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listVehicles(callback?: (err: AWSError, data: IoTFleetWise.Types.ListVehiclesResponse) => void): Request<IoTFleetWise.Types.ListVehiclesResponse, AWSError>;
  /**
   *  Retrieves a list of summaries of all vehicles associated with a fleet.   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listVehiclesInFleet(params: IoTFleetWise.Types.ListVehiclesInFleetRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.ListVehiclesInFleetResponse) => void): Request<IoTFleetWise.Types.ListVehiclesInFleetResponse, AWSError>;
  /**
   *  Retrieves a list of summaries of all vehicles associated with a fleet.   This API operation uses pagination. Specify the nextToken parameter in the request to return more results. 
   */
  listVehiclesInFleet(callback?: (err: AWSError, data: IoTFleetWise.Types.ListVehiclesInFleetResponse) => void): Request<IoTFleetWise.Types.ListVehiclesInFleetResponse, AWSError>;
  /**
   * Creates or updates the encryption configuration. Amazon Web Services IoT FleetWise can encrypt your data and resources using an Amazon Web Services managed key. Or, you can use a KMS key that you own and manage. For more information, see Data encryption in the Amazon Web Services IoT FleetWise Developer Guide.
   */
  putEncryptionConfiguration(params: IoTFleetWise.Types.PutEncryptionConfigurationRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.PutEncryptionConfigurationResponse) => void): Request<IoTFleetWise.Types.PutEncryptionConfigurationResponse, AWSError>;
  /**
   * Creates or updates the encryption configuration. Amazon Web Services IoT FleetWise can encrypt your data and resources using an Amazon Web Services managed key. Or, you can use a KMS key that you own and manage. For more information, see Data encryption in the Amazon Web Services IoT FleetWise Developer Guide.
   */
  putEncryptionConfiguration(callback?: (err: AWSError, data: IoTFleetWise.Types.PutEncryptionConfigurationResponse) => void): Request<IoTFleetWise.Types.PutEncryptionConfigurationResponse, AWSError>;
  /**
   * Creates or updates the logging option.
   */
  putLoggingOptions(params: IoTFleetWise.Types.PutLoggingOptionsRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.PutLoggingOptionsResponse) => void): Request<IoTFleetWise.Types.PutLoggingOptionsResponse, AWSError>;
  /**
   * Creates or updates the logging option.
   */
  putLoggingOptions(callback?: (err: AWSError, data: IoTFleetWise.Types.PutLoggingOptionsResponse) => void): Request<IoTFleetWise.Types.PutLoggingOptionsResponse, AWSError>;
  /**
   *  This API operation contains deprecated parameters. Register your account again without the Timestream resources parameter so that Amazon Web Services IoT FleetWise can remove the Timestream metadata stored. You should then pass the data destination into the CreateCampaign API operation. You must delete any existing campaigns that include an empty data destination before you register your account again. For more information, see the DeleteCampaign API operation. If you want to delete the Timestream inline policy from the service-linked role, such as to mitigate an overly permissive policy, you must first delete any existing campaigns. Then delete the service-linked role and register your account again to enable CloudWatch metrics. For more information, see DeleteServiceLinkedRole in the Identity and Access Management API Reference.   &lt;p&gt;Registers your Amazon Web Services account, IAM, and Amazon Timestream resources so Amazon Web Services IoT FleetWise can transfer your vehicle data to the Amazon Web Services Cloud. For more information, including step-by-step procedures, see &lt;a href=&quot;https://docs.aws.amazon.com/iot-fleetwise/latest/developerguide/setting-up.html&quot;&gt;Setting up Amazon Web Services IoT FleetWise&lt;/a&gt;. &lt;/p&gt; &lt;note&gt; &lt;p&gt;An Amazon Web Services account is &lt;b&gt;not&lt;/b&gt; the same thing as a &quot;user.&quot; An &lt;a href=&quot;https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_identity-management.html#intro-identity-users&quot;&gt;Amazon Web Services user&lt;/a&gt; is an identity that you create using Identity and Access Management (IAM) and takes the form of either an &lt;a href=&quot;https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html&quot;&gt;IAM user&lt;/a&gt; or an &lt;a href=&quot;https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html&quot;&gt;IAM role, both with credentials&lt;/a&gt;. A single Amazon Web Services account can, and typically does, contain many users and roles.&lt;/p&gt; &lt;/note&gt; 
   */
  registerAccount(params: IoTFleetWise.Types.RegisterAccountRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.RegisterAccountResponse) => void): Request<IoTFleetWise.Types.RegisterAccountResponse, AWSError>;
  /**
   *  This API operation contains deprecated parameters. Register your account again without the Timestream resources parameter so that Amazon Web Services IoT FleetWise can remove the Timestream metadata stored. You should then pass the data destination into the CreateCampaign API operation. You must delete any existing campaigns that include an empty data destination before you register your account again. For more information, see the DeleteCampaign API operation. If you want to delete the Timestream inline policy from the service-linked role, such as to mitigate an overly permissive policy, you must first delete any existing campaigns. Then delete the service-linked role and register your account again to enable CloudWatch metrics. For more information, see DeleteServiceLinkedRole in the Identity and Access Management API Reference.   &lt;p&gt;Registers your Amazon Web Services account, IAM, and Amazon Timestream resources so Amazon Web Services IoT FleetWise can transfer your vehicle data to the Amazon Web Services Cloud. For more information, including step-by-step procedures, see &lt;a href=&quot;https://docs.aws.amazon.com/iot-fleetwise/latest/developerguide/setting-up.html&quot;&gt;Setting up Amazon Web Services IoT FleetWise&lt;/a&gt;. &lt;/p&gt; &lt;note&gt; &lt;p&gt;An Amazon Web Services account is &lt;b&gt;not&lt;/b&gt; the same thing as a &quot;user.&quot; An &lt;a href=&quot;https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_identity-management.html#intro-identity-users&quot;&gt;Amazon Web Services user&lt;/a&gt; is an identity that you create using Identity and Access Management (IAM) and takes the form of either an &lt;a href=&quot;https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html&quot;&gt;IAM user&lt;/a&gt; or an &lt;a href=&quot;https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html&quot;&gt;IAM role, both with credentials&lt;/a&gt;. A single Amazon Web Services account can, and typically does, contain many users and roles.&lt;/p&gt; &lt;/note&gt; 
   */
  registerAccount(callback?: (err: AWSError, data: IoTFleetWise.Types.RegisterAccountResponse) => void): Request<IoTFleetWise.Types.RegisterAccountResponse, AWSError>;
  /**
   * Adds to or modifies the tags of the given resource. Tags are metadata which can be used to manage a resource.
   */
  tagResource(params: IoTFleetWise.Types.TagResourceRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.TagResourceResponse) => void): Request<IoTFleetWise.Types.TagResourceResponse, AWSError>;
  /**
   * Adds to or modifies the tags of the given resource. Tags are metadata which can be used to manage a resource.
   */
  tagResource(callback?: (err: AWSError, data: IoTFleetWise.Types.TagResourceResponse) => void): Request<IoTFleetWise.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the given tags (metadata) from the resource.
   */
  untagResource(params: IoTFleetWise.Types.UntagResourceRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.UntagResourceResponse) => void): Request<IoTFleetWise.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the given tags (metadata) from the resource.
   */
  untagResource(callback?: (err: AWSError, data: IoTFleetWise.Types.UntagResourceResponse) => void): Request<IoTFleetWise.Types.UntagResourceResponse, AWSError>;
  /**
   *  Updates a campaign. 
   */
  updateCampaign(params: IoTFleetWise.Types.UpdateCampaignRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.UpdateCampaignResponse) => void): Request<IoTFleetWise.Types.UpdateCampaignResponse, AWSError>;
  /**
   *  Updates a campaign. 
   */
  updateCampaign(callback?: (err: AWSError, data: IoTFleetWise.Types.UpdateCampaignResponse) => void): Request<IoTFleetWise.Types.UpdateCampaignResponse, AWSError>;
  /**
   *  Updates a decoder manifest. A decoder manifest can only be updated when the status is DRAFT. Only ACTIVE decoder manifests can be associated with vehicles.
   */
  updateDecoderManifest(params: IoTFleetWise.Types.UpdateDecoderManifestRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.UpdateDecoderManifestResponse) => void): Request<IoTFleetWise.Types.UpdateDecoderManifestResponse, AWSError>;
  /**
   *  Updates a decoder manifest. A decoder manifest can only be updated when the status is DRAFT. Only ACTIVE decoder manifests can be associated with vehicles.
   */
  updateDecoderManifest(callback?: (err: AWSError, data: IoTFleetWise.Types.UpdateDecoderManifestResponse) => void): Request<IoTFleetWise.Types.UpdateDecoderManifestResponse, AWSError>;
  /**
   *  Updates the description of an existing fleet.   If the fleet is successfully updated, Amazon Web Services IoT FleetWise sends back an HTTP 200 response with an empty HTTP body. 
   */
  updateFleet(params: IoTFleetWise.Types.UpdateFleetRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.UpdateFleetResponse) => void): Request<IoTFleetWise.Types.UpdateFleetResponse, AWSError>;
  /**
   *  Updates the description of an existing fleet.   If the fleet is successfully updated, Amazon Web Services IoT FleetWise sends back an HTTP 200 response with an empty HTTP body. 
   */
  updateFleet(callback?: (err: AWSError, data: IoTFleetWise.Types.UpdateFleetResponse) => void): Request<IoTFleetWise.Types.UpdateFleetResponse, AWSError>;
  /**
   *  Updates a vehicle model (model manifest). If created vehicles are associated with a vehicle model, it can't be updated.
   */
  updateModelManifest(params: IoTFleetWise.Types.UpdateModelManifestRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.UpdateModelManifestResponse) => void): Request<IoTFleetWise.Types.UpdateModelManifestResponse, AWSError>;
  /**
   *  Updates a vehicle model (model manifest). If created vehicles are associated with a vehicle model, it can't be updated.
   */
  updateModelManifest(callback?: (err: AWSError, data: IoTFleetWise.Types.UpdateModelManifestResponse) => void): Request<IoTFleetWise.Types.UpdateModelManifestResponse, AWSError>;
  /**
   *  Updates a signal catalog. 
   */
  updateSignalCatalog(params: IoTFleetWise.Types.UpdateSignalCatalogRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.UpdateSignalCatalogResponse) => void): Request<IoTFleetWise.Types.UpdateSignalCatalogResponse, AWSError>;
  /**
   *  Updates a signal catalog. 
   */
  updateSignalCatalog(callback?: (err: AWSError, data: IoTFleetWise.Types.UpdateSignalCatalogResponse) => void): Request<IoTFleetWise.Types.UpdateSignalCatalogResponse, AWSError>;
  /**
   *  Updates a vehicle. 
   */
  updateVehicle(params: IoTFleetWise.Types.UpdateVehicleRequest, callback?: (err: AWSError, data: IoTFleetWise.Types.UpdateVehicleResponse) => void): Request<IoTFleetWise.Types.UpdateVehicleResponse, AWSError>;
  /**
   *  Updates a vehicle. 
   */
  updateVehicle(callback?: (err: AWSError, data: IoTFleetWise.Types.UpdateVehicleResponse) => void): Request<IoTFleetWise.Types.UpdateVehicleResponse, AWSError>;
}
declare namespace IoTFleetWise {
  export interface Actuator {
    /**
     * The fully qualified name of the actuator. For example, the fully qualified name of an actuator might be Vehicle.Front.Left.Door.Lock.
     */
    fullyQualifiedName: string;
    /**
     * The specified data type of the actuator. 
     */
    dataType: NodeDataType;
    /**
     * A brief description of the actuator.
     */
    description?: description;
    /**
     * The scientific unit for the actuator.
     */
    unit?: string;
    /**
     * A list of possible values an actuator can take.
     */
    allowedValues?: listOfStrings;
    /**
     * The specified possible minimum value of an actuator.
     */
    min?: double;
    /**
     * The specified possible maximum value of an actuator.
     */
    max?: double;
    /**
     * A specified value for the actuator.
     */
    assignedValue?: string;
    /**
     * The deprecation message for the node or the branch that was moved or deleted.
     */
    deprecationMessage?: message;
    /**
     * A comment in addition to the description.
     */
    comment?: message;
  }
  export type AmazonResourceName = string;
  export interface AssociateVehicleFleetRequest {
    /**
     *  The unique ID of the vehicle to associate with the fleet. 
     */
    vehicleName: vehicleName;
    /**
     *  The ID of a fleet. 
     */
    fleetId: fleetId;
  }
  export interface AssociateVehicleFleetResponse {
  }
  export interface Attribute {
    /**
     * The fully qualified name of the attribute. For example, the fully qualified name of an attribute might be Vehicle.Body.Engine.Type.
     */
    fullyQualifiedName: string;
    /**
     * The specified data type of the attribute. 
     */
    dataType: NodeDataType;
    /**
     * A brief description of the attribute.
     */
    description?: description;
    /**
     * The scientific unit for the attribute.
     */
    unit?: string;
    /**
     * A list of possible values an attribute can be assigned.
     */
    allowedValues?: listOfStrings;
    /**
     * The specified possible minimum value of the attribute.
     */
    min?: double;
    /**
     * The specified possible maximum value of the attribute.
     */
    max?: double;
    /**
     * A specified value for the attribute.
     */
    assignedValue?: string;
    /**
     * The default value of the attribute.
     */
    defaultValue?: string;
    /**
     * The deprecation message for the node or the branch that was moved or deleted.
     */
    deprecationMessage?: message;
    /**
     * A comment in addition to the description.
     */
    comment?: message;
  }
  export interface BatchCreateVehicleRequest {
    /**
     *  A list of information about each vehicle to create. For more information, see the API data type.
     */
    vehicles: createVehicleRequestItems;
  }
  export interface BatchCreateVehicleResponse {
    /**
     *  A list of information about a batch of created vehicles. For more information, see the API data type.
     */
    vehicles?: createVehicleResponses;
    /**
     * A list of information about creation errors, or an empty list if there aren't any errors. 
     */
    errors?: createVehicleErrors;
  }
  export interface BatchUpdateVehicleRequest {
    /**
     *  A list of information about the vehicles to update. For more information, see the API data type.
     */
    vehicles: updateVehicleRequestItems;
  }
  export interface BatchUpdateVehicleResponse {
    /**
     *  A list of information about the batch of updated vehicles.   This list contains only unique IDs for the vehicles that were updated. 
     */
    vehicles?: updateVehicleResponseItems;
    /**
     * A list of information about errors returned while updating a batch of vehicles, or, if there aren't any errors, an empty list.
     */
    errors?: updateVehicleErrors;
  }
  export interface Branch {
    /**
     * The fully qualified name of the branch. For example, the fully qualified name of a branch might be Vehicle.Body.Engine.
     */
    fullyQualifiedName: string;
    /**
     * A brief description of the branch.
     */
    description?: description;
    /**
     * The deprecation message for the node or the branch that was moved or deleted.
     */
    deprecationMessage?: message;
    /**
     * A comment in addition to the description.
     */
    comment?: message;
  }
  export type CampaignStatus = "CREATING"|"WAITING_FOR_APPROVAL"|"RUNNING"|"SUSPENDED"|string;
  export interface CampaignSummary {
    /**
     * The Amazon Resource Name (ARN) of a campaign.
     */
    arn?: arn;
    /**
     * The name of a campaign.
     */
    name?: campaignName;
    /**
     * The description of the campaign.
     */
    description?: description;
    /**
     * The ARN of the signal catalog associated with the campaign.
     */
    signalCatalogArn?: arn;
    /**
     * The ARN of a vehicle or fleet to which the campaign is deployed.
     */
    targetArn?: arn;
    /**
     * The state of a campaign. The status can be one of the following:    CREATING - Amazon Web Services IoT FleetWise is processing your request to create the campaign.    WAITING_FOR_APPROVAL - After a campaign is created, it enters the WAITING_FOR_APPROVAL state. To allow Amazon Web Services IoT FleetWise to deploy the campaign to the target vehicle or fleet, use the API operation to approve the campaign.     RUNNING - The campaign is active.     SUSPENDED - The campaign is suspended. To resume the campaign, use the API operation.   
     */
    status?: CampaignStatus;
    /**
     * The time the campaign was created.
     */
    creationTime: timestamp;
    /**
     * The last time the campaign was modified.
     */
    lastModificationTime: timestamp;
  }
  export interface CanDbcDefinition {
    /**
     * Contains information about a network interface.
     */
    networkInterface: InterfaceId;
    /**
     * A list of DBC files. You can upload only one DBC file for each network interface and specify up to five (inclusive) files in the list.
     */
    canDbcFiles: NetworkFilesList;
    /**
     * Pairs every signal specified in your vehicle model with a signal decoder.
     */
    signalsMap?: ModelSignalsMap;
  }
  export interface CanInterface {
    /**
     * The unique name of the interface.
     */
    name: CanInterfaceName;
    /**
     * The name of the communication protocol for the interface.
     */
    protocolName?: ProtocolName;
    /**
     * The version of the communication protocol for the interface.
     */
    protocolVersion?: ProtocolVersion;
  }
  export type CanInterfaceName = string;
  export interface CanSignal {
    /**
     * The ID of the message.
     */
    messageId: nonNegativeInteger;
    /**
     * Whether the byte ordering of a CAN message is big-endian.
     */
    isBigEndian: boolean;
    /**
     * Whether the message data is specified as a signed value.
     */
    isSigned: boolean;
    /**
     * Indicates the beginning of the CAN signal. This should always be the least significant bit (LSB). This value might be different from the value in a DBC file. For little endian signals, startBit is the same value as in the DBC file. For big endian signals in a DBC file, the start bit is the most significant bit (MSB). You will have to calculate the LSB instead and pass it as the startBit.
     */
    startBit: nonNegativeInteger;
    /**
     * The offset used to calculate the signal value. Combined with factor, the calculation is value = raw_value * factor + offset.
     */
    offset: double;
    /**
     * A multiplier used to decode the CAN message.
     */
    factor: double;
    /**
     * How many bytes of data are in the message.
     */
    length: nonNegativeInteger;
    /**
     * The name of the signal.
     */
    name?: CanSignalName;
  }
  export type CanSignalName = string;
  export interface CloudWatchLogDeliveryOptions {
    /**
     * The type of log to send data to Amazon CloudWatch Logs.
     */
    logType: LogType;
    /**
     * The Amazon CloudWatch Logs group the operation sends data to.
     */
    logGroupName?: CloudWatchLogGroupName;
  }
  export type CloudWatchLogGroupName = string;
  export interface CollectionScheme {
    /**
     * Information about a collection scheme that uses a time period to decide how often to collect data.
     */
    timeBasedCollectionScheme?: TimeBasedCollectionScheme;
    /**
     * Information about a collection scheme that uses a simple logical expression to recognize what data to collect.
     */
    conditionBasedCollectionScheme?: ConditionBasedCollectionScheme;
  }
  export type Compression = "OFF"|"SNAPPY"|string;
  export interface ConditionBasedCollectionScheme {
    /**
     * The logical expression used to recognize what data to collect. For example, $variable.Vehicle.OutsideAirTemperature &gt;= 105.0.
     */
    expression: eventExpression;
    /**
     * The minimum duration of time between two triggering events to collect data, in milliseconds.  If a signal changes often, you might want to collect data at a slower rate. 
     */
    minimumTriggerIntervalMs?: uint32;
    /**
     * Whether to collect data for all triggering events (ALWAYS). Specify (RISING_EDGE), or specify only when the condition first evaluates to false. For example, triggering on "AirbagDeployed"; Users aren't interested on triggering when the airbag is already exploded; they only care about the change from not deployed =&gt; deployed.
     */
    triggerMode?: TriggerMode;
    /**
     * Specifies the version of the conditional expression language.
     */
    conditionLanguageVersion?: languageVersion;
  }
  export interface CreateCampaignRequest {
    /**
     *  The name of the campaign to create. 
     */
    name: campaignName;
    /**
     * An optional description of the campaign to help identify its purpose.
     */
    description?: description;
    /**
     * (Optional) The Amazon Resource Name (ARN) of the signal catalog to associate with the campaign. 
     */
    signalCatalogArn: arn;
    /**
     *  The ARN of the vehicle or fleet to deploy a campaign to. 
     */
    targetArn: arn;
    /**
     * (Optional) The time, in milliseconds, to deliver a campaign after it was approved. If it's not specified, 0 is used. Default: 0 
     */
    startTime?: timestamp;
    /**
     *  (Optional) The time the campaign expires, in seconds since epoch (January 1, 1970 at midnight UTC time). Vehicle data isn't collected after the campaign expires.  Default: 253402214400 (December 31, 9999, 00:00:00 UTC)
     */
    expiryTime?: timestamp;
    /**
     *  (Optional) How long (in milliseconds) to collect raw data after a triggering event initiates the collection. If it's not specified, 0 is used. Default: 0 
     */
    postTriggerCollectionDuration?: uint32;
    /**
     *  (Optional) Option for a vehicle to send diagnostic trouble codes to Amazon Web Services IoT FleetWise. If you want to send diagnostic trouble codes, use SEND_ACTIVE_DTCS. If it's not specified, OFF is used. Default: OFF 
     */
    diagnosticsMode?: DiagnosticsMode;
    /**
     * (Optional) Whether to store collected data after a vehicle lost a connection with the cloud. After a connection is re-established, the data is automatically forwarded to Amazon Web Services IoT FleetWise. If you want to store collected data when a vehicle loses connection with the cloud, use TO_DISK. If it's not specified, OFF is used. Default: OFF 
     */
    spoolingMode?: SpoolingMode;
    /**
     *  (Optional) Whether to compress signals before transmitting data to Amazon Web Services IoT FleetWise. If you don't want to compress the signals, use OFF. If it's not specified, SNAPPY is used.  Default: SNAPPY 
     */
    compression?: Compression;
    /**
     * (Optional) A number indicating the priority of one campaign over another campaign for a certain vehicle or fleet. A campaign with the lowest value is deployed to vehicles before any other campaigns. If it's not specified, 0 is used.  Default: 0 
     */
    priority?: priority;
    /**
     * (Optional) A list of information about signals to collect. 
     */
    signalsToCollect?: SignalInformationList;
    /**
     *  The data collection scheme associated with the campaign. You can specify a scheme that collects data based on time or an event.
     */
    collectionScheme: CollectionScheme;
    /**
     *  (Optional) A list of vehicle attributes to associate with a campaign.  Enrich the data with specified vehicle attributes. For example, add make and model to the campaign, and Amazon Web Services IoT FleetWise will associate the data with those attributes as dimensions in Amazon Timestream. You can then query the data against make and model. Default: An empty array
     */
    dataExtraDimensions?: DataExtraDimensionNodePathList;
    /**
     * Metadata that can be used to manage the campaign.
     */
    tags?: TagList;
    /**
     * The destination where the campaign sends data. You can choose to send data to be stored in Amazon S3 or Amazon Timestream. Amazon S3 optimizes the cost of data storage and provides additional mechanisms to use vehicle data, such as data lakes, centralized data storage, data processing pipelines, and analytics. Amazon Web Services IoT FleetWise supports at-least-once file delivery to S3. Your vehicle data is stored on multiple Amazon Web Services IoT FleetWise servers for redundancy and high availability. You can use Amazon Timestream to access and analyze time series data, and Timestream to query vehicle data so that you can identify trends and patterns.
     */
    dataDestinationConfigs?: DataDestinationConfigs;
  }
  export interface CreateCampaignResponse {
    /**
     * The name of the created campaign.
     */
    name?: campaignName;
    /**
     *  The ARN of the created campaign. 
     */
    arn?: arn;
  }
  export interface CreateDecoderManifestRequest {
    /**
     *  The unique name of the decoder manifest to create.
     */
    name: resourceName;
    /**
     *  A brief description of the decoder manifest. 
     */
    description?: description;
    /**
     *  The Amazon Resource Name (ARN) of the vehicle model (model manifest). 
     */
    modelManifestArn: arn;
    /**
     *  A list of information about signal decoders. 
     */
    signalDecoders?: SignalDecoders;
    /**
     *  A list of information about available network interfaces. 
     */
    networkInterfaces?: NetworkInterfaces;
    /**
     * Metadata that can be used to manage the decoder manifest.
     */
    tags?: TagList;
  }
  export interface CreateDecoderManifestResponse {
    /**
     *  The name of the created decoder manifest. 
     */
    name: resourceName;
    /**
     *  The ARN of the created decoder manifest. 
     */
    arn: arn;
  }
  export interface CreateFleetRequest {
    /**
     *  The unique ID of the fleet to create. 
     */
    fleetId: fleetId;
    /**
     *  A brief description of the fleet to create. 
     */
    description?: description;
    /**
     *  The Amazon Resource Name (ARN) of a signal catalog. 
     */
    signalCatalogArn: arn;
    /**
     * Metadata that can be used to manage the fleet.
     */
    tags?: TagList;
  }
  export interface CreateFleetResponse {
    /**
     *  The ID of the created fleet. 
     */
    id: fleetId;
    /**
     *  The ARN of the created fleet. 
     */
    arn: arn;
  }
  export interface CreateModelManifestRequest {
    /**
     *  The name of the vehicle model to create.
     */
    name: resourceName;
    /**
     *  A brief description of the vehicle model. 
     */
    description?: description;
    /**
     *  A list of nodes, which are a general abstraction of signals. 
     */
    nodes: listOfStrings;
    /**
     *  The Amazon Resource Name (ARN) of a signal catalog. 
     */
    signalCatalogArn: arn;
    /**
     * Metadata that can be used to manage the vehicle model.
     */
    tags?: TagList;
  }
  export interface CreateModelManifestResponse {
    /**
     *  The name of the created vehicle model.
     */
    name: resourceName;
    /**
     *  The ARN of the created vehicle model.
     */
    arn: arn;
  }
  export interface CreateSignalCatalogRequest {
    /**
     *  The name of the signal catalog to create. 
     */
    name: resourceName;
    /**
     * A brief description of the signal catalog.
     */
    description?: description;
    /**
     *  A list of information about nodes, which are a general abstraction of signals. For more information, see the API data type.
     */
    nodes?: Nodes;
    /**
     * Metadata that can be used to manage the signal catalog.
     */
    tags?: TagList;
  }
  export interface CreateSignalCatalogResponse {
    /**
     *  The name of the created signal catalog. 
     */
    name: resourceName;
    /**
     *  The ARN of the created signal catalog. 
     */
    arn: arn;
  }
  export interface CreateVehicleError {
    /**
     * The ID of the vehicle with the error.
     */
    vehicleName?: vehicleName;
    /**
     * An HTTP error code.
     */
    code?: string;
    /**
     * A description of the HTTP error.
     */
    message?: string;
  }
  export interface CreateVehicleRequest {
    /**
     *  The unique ID of the vehicle to create. 
     */
    vehicleName: vehicleName;
    /**
     *  The Amazon Resource Name ARN of a vehicle model. 
     */
    modelManifestArn: arn;
    /**
     *  The ARN of a decoder manifest. 
     */
    decoderManifestArn: arn;
    /**
     * Static information about a vehicle in a key-value pair. For example: "engineType" : "1.3 L R2"  A campaign must include the keys (attribute names) in dataExtraDimensions for them to display in Amazon Timestream.
     */
    attributes?: attributesMap;
    /**
     *  An option to create a new Amazon Web Services IoT thing when creating a vehicle, or to validate an existing Amazon Web Services IoT thing as a vehicle.  Default:  
     */
    associationBehavior?: VehicleAssociationBehavior;
    /**
     * Metadata that can be used to manage the vehicle.
     */
    tags?: TagList;
  }
  export interface CreateVehicleRequestItem {
    /**
     * The unique ID of the vehicle to create.
     */
    vehicleName: vehicleName;
    /**
     * The ARN of the vehicle model (model manifest) to create the vehicle from.
     */
    modelManifestArn: arn;
    /**
     * The Amazon Resource Name (ARN) of a decoder manifest associated with the vehicle to create. 
     */
    decoderManifestArn: arn;
    /**
     * Static information about a vehicle in a key-value pair. For example: "engine Type" : "v6" 
     */
    attributes?: attributesMap;
    /**
     * An option to create a new Amazon Web Services IoT thing when creating a vehicle, or to validate an existing thing as a vehicle.
     */
    associationBehavior?: VehicleAssociationBehavior;
    /**
     * Metadata which can be used to manage the vehicle.
     */
    tags?: TagList;
  }
  export interface CreateVehicleResponse {
    /**
     * The unique ID of the created vehicle.
     */
    vehicleName?: vehicleName;
    /**
     *  The ARN of the created vehicle. 
     */
    arn?: arn;
    /**
     *  The ARN of a created or validated Amazon Web Services IoT thing. 
     */
    thingArn?: arn;
  }
  export interface CreateVehicleResponseItem {
    /**
     * The unique ID of the vehicle to create.
     */
    vehicleName?: vehicleName;
    /**
     * The ARN of the created vehicle.
     */
    arn?: arn;
    /**
     * The ARN of a created or validated Amazon Web Services IoT thing.
     */
    thingArn?: arn;
  }
  export interface DataDestinationConfig {
    /**
     * The Amazon S3 bucket where the Amazon Web Services IoT FleetWise campaign sends data.
     */
    s3Config?: S3Config;
    /**
     * The Amazon Timestream table where the campaign sends data.
     */
    timestreamConfig?: TimestreamConfig;
  }
  export type DataDestinationConfigs = DataDestinationConfig[];
  export type DataExtraDimensionNodePathList = NodePath[];
  export type DataFormat = "JSON"|"PARQUET"|string;
  export interface DecoderManifestSummary {
    /**
     * The name of the decoder manifest.
     */
    name?: string;
    /**
     * The ARN of a vehicle model (model manifest) associated with the decoder manifest. 
     */
    arn?: arn;
    /**
     * The ARN of a vehicle model (model manifest) associated with the decoder manifest.
     */
    modelManifestArn?: arn;
    /**
     * A brief description of the decoder manifest.
     */
    description?: description;
    /**
     * The state of the decoder manifest. If the status is ACTIVE, the decoder manifest can't be edited. If the status is marked DRAFT, you can edit the decoder manifest.
     */
    status?: ManifestStatus;
    /**
     * The time the decoder manifest was created in seconds since epoch (January 1, 1970 at midnight UTC time).
     */
    creationTime: timestamp;
    /**
     * The time the decoder manifest was last updated in seconds since epoch (January 1, 1970 at midnight UTC time).
     */
    lastModificationTime: timestamp;
  }
  export interface DeleteCampaignRequest {
    /**
     *  The name of the campaign to delete. 
     */
    name: campaignName;
  }
  export interface DeleteCampaignResponse {
    /**
     * The name of the deleted campaign.
     */
    name?: campaignName;
    /**
     *  The Amazon Resource Name (ARN) of the deleted campaign.  The ARN isn’t returned if a campaign doesn’t exist. 
     */
    arn?: arn;
  }
  export interface DeleteDecoderManifestRequest {
    /**
     *  The name of the decoder manifest to delete. 
     */
    name: resourceName;
  }
  export interface DeleteDecoderManifestResponse {
    /**
     * The name of the deleted decoder manifest.
     */
    name: resourceName;
    /**
     * The Amazon Resource Name (ARN) of the deleted decoder manifest.
     */
    arn: arn;
  }
  export interface DeleteFleetRequest {
    /**
     *  The ID of the fleet to delete. 
     */
    fleetId: fleetId;
  }
  export interface DeleteFleetResponse {
    /**
     * The ID of the deleted fleet.
     */
    id?: fleetId;
    /**
     * The Amazon Resource Name (ARN) of the deleted fleet.
     */
    arn?: arn;
  }
  export interface DeleteModelManifestRequest {
    /**
     *  The name of the model manifest to delete. 
     */
    name: resourceName;
  }
  export interface DeleteModelManifestResponse {
    /**
     * The name of the deleted model manifest.
     */
    name: resourceName;
    /**
     * The Amazon Resource Name (ARN) of the deleted model manifest.
     */
    arn: arn;
  }
  export interface DeleteSignalCatalogRequest {
    /**
     *  The name of the signal catalog to delete. 
     */
    name: resourceName;
  }
  export interface DeleteSignalCatalogResponse {
    /**
     * The name of the deleted signal catalog.
     */
    name: resourceName;
    /**
     * The Amazon Resource Name (ARN) of the deleted signal catalog.
     */
    arn: arn;
  }
  export interface DeleteVehicleRequest {
    /**
     * The ID of the vehicle to delete. 
     */
    vehicleName: vehicleName;
  }
  export interface DeleteVehicleResponse {
    /**
     * The ID of the deleted vehicle.
     */
    vehicleName: vehicleName;
    /**
     * The Amazon Resource Name (ARN) of the deleted vehicle.
     */
    arn: arn;
  }
  export type DiagnosticsMode = "OFF"|"SEND_ACTIVE_DTCS"|string;
  export interface DisassociateVehicleFleetRequest {
    /**
     *  The unique ID of the vehicle to disassociate from the fleet.
     */
    vehicleName: vehicleName;
    /**
     *  The unique ID of a fleet. 
     */
    fleetId: fleetId;
  }
  export interface DisassociateVehicleFleetResponse {
  }
  export type EncryptionStatus = "PENDING"|"SUCCESS"|"FAILURE"|string;
  export type EncryptionType = "KMS_BASED_ENCRYPTION"|"FLEETWISE_DEFAULT_ENCRYPTION"|string;
  export interface FleetSummary {
    /**
     * The unique ID of the fleet.
     */
    id: fleetId;
    /**
     * The Amazon Resource Name (ARN) of the fleet.
     */
    arn: arn;
    /**
     * A brief description of the fleet.
     */
    description?: description;
    /**
     * The ARN of the signal catalog associated with the fleet.
     */
    signalCatalogArn: arn;
    /**
     * The time the fleet was created, in seconds since epoch (January 1, 1970 at midnight UTC time).
     */
    creationTime: timestamp;
    /**
     * The time the fleet was last updated in seconds since epoch (January 1, 1970 at midnight UTC time).
     */
    lastModificationTime?: timestamp;
  }
  export interface FormattedVss {
    /**
     * Provides the VSS in JSON format.
     */
    vssJson?: String;
  }
  export type Fqns = FullyQualifiedName[];
  export type FullyQualifiedName = string;
  export interface GetCampaignRequest {
    /**
     *  The name of the campaign to retrieve information about. 
     */
    name: campaignName;
  }
  export interface GetCampaignResponse {
    /**
     * The name of the campaign.
     */
    name?: campaignName;
    /**
     *  The Amazon Resource Name (ARN) of the campaign. 
     */
    arn?: arn;
    /**
     * The description of the campaign.
     */
    description?: description;
    /**
     *  The ARN of a signal catalog. 
     */
    signalCatalogArn?: arn;
    /**
     *  The ARN of the vehicle or the fleet targeted by the campaign. 
     */
    targetArn?: arn;
    /**
     * The state of the campaign. The status can be one of: CREATING, WAITING_FOR_APPROVAL, RUNNING, and SUSPENDED. 
     */
    status?: CampaignStatus;
    /**
     *  The time, in milliseconds, to deliver a campaign after it was approved.
     */
    startTime?: timestamp;
    /**
     *  The time the campaign expires, in seconds since epoch (January 1, 1970 at midnight UTC time). Vehicle data won't be collected after the campaign expires.
     */
    expiryTime?: timestamp;
    /**
     *  How long (in seconds) to collect raw data after a triggering event initiates the collection. 
     */
    postTriggerCollectionDuration?: uint32;
    /**
     *  Option for a vehicle to send diagnostic trouble codes to Amazon Web Services IoT FleetWise. 
     */
    diagnosticsMode?: DiagnosticsMode;
    /**
     *  Whether to store collected data after a vehicle lost a connection with the cloud. After a connection is re-established, the data is automatically forwarded to Amazon Web Services IoT FleetWise. 
     */
    spoolingMode?: SpoolingMode;
    /**
     *  Whether to compress signals before transmitting data to Amazon Web Services IoT FleetWise. If OFF is specified, the signals aren't compressed. If it's not specified, SNAPPY is used. 
     */
    compression?: Compression;
    /**
     *  A number indicating the priority of one campaign over another campaign for a certain vehicle or fleet. A campaign with the lowest value is deployed to vehicles before any other campaigns.
     */
    priority?: priority;
    /**
     *  Information about a list of signals to collect data on. 
     */
    signalsToCollect?: SignalInformationList;
    /**
     *  Information about the data collection scheme associated with the campaign. 
     */
    collectionScheme?: CollectionScheme;
    /**
     *  A list of vehicle attributes associated with the campaign. 
     */
    dataExtraDimensions?: DataExtraDimensionNodePathList;
    /**
     *  The time the campaign was created in seconds since epoch (January 1, 1970 at midnight UTC time). 
     */
    creationTime?: timestamp;
    /**
     * The last time the campaign was modified.
     */
    lastModificationTime?: timestamp;
    /**
     * The destination where the campaign sends data. You can choose to send data to be stored in Amazon S3 or Amazon Timestream. Amazon S3 optimizes the cost of data storage and provides additional mechanisms to use vehicle data, such as data lakes, centralized data storage, data processing pipelines, and analytics.  You can use Amazon Timestream to access and analyze time series data, and Timestream to query vehicle data so that you can identify trends and patterns.
     */
    dataDestinationConfigs?: DataDestinationConfigs;
  }
  export interface GetDecoderManifestRequest {
    /**
     *  The name of the decoder manifest to retrieve information about. 
     */
    name: resourceName;
  }
  export interface GetDecoderManifestResponse {
    /**
     *  The name of the decoder manifest. 
     */
    name: string;
    /**
     *  The Amazon Resource Name (ARN) of the decoder manifest. 
     */
    arn: arn;
    /**
     *  A brief description of the decoder manifest.
     */
    description?: description;
    /**
     *  The ARN of a vehicle model (model manifest) associated with the decoder manifest.
     */
    modelManifestArn?: arn;
    /**
     *  The state of the decoder manifest. If the status is ACTIVE, the decoder manifest can't be edited. If the status is marked DRAFT, you can edit the decoder manifest.
     */
    status?: ManifestStatus;
    /**
     *  The time the decoder manifest was created in seconds since epoch (January 1, 1970 at midnight UTC time). 
     */
    creationTime: timestamp;
    /**
     *  The time the decoder manifest was last updated in seconds since epoch (January 1, 1970 at midnight UTC time). 
     */
    lastModificationTime: timestamp;
  }
  export interface GetEncryptionConfigurationRequest {
  }
  export interface GetEncryptionConfigurationResponse {
    /**
     * The ID of the KMS key that is used for encryption.
     */
    kmsKeyId?: String;
    /**
     * The encryption status.
     */
    encryptionStatus: EncryptionStatus;
    /**
     * The type of encryption. Set to KMS_BASED_ENCRYPTION to use an KMS key that you own and manage. Set to FLEETWISE_DEFAULT_ENCRYPTION to use an Amazon Web Services managed key that is owned by the Amazon Web Services IoT FleetWise service account.
     */
    encryptionType: EncryptionType;
    /**
     * The error message that describes why encryption settings couldn't be configured, if applicable.
     */
    errorMessage?: errorMessage;
    /**
     * The time when encryption was configured in seconds since epoch (January 1, 1970 at midnight UTC time).
     */
    creationTime?: timestamp;
    /**
     * The time when encryption was last updated in seconds since epoch (January 1, 1970 at midnight UTC time).
     */
    lastModificationTime?: timestamp;
  }
  export interface GetFleetRequest {
    /**
     *  The ID of the fleet to retrieve information about. 
     */
    fleetId: fleetId;
  }
  export interface GetFleetResponse {
    /**
     *  The ID of the fleet.
     */
    id: fleetId;
    /**
     *  The Amazon Resource Name (ARN) of the fleet. 
     */
    arn: arn;
    /**
     *  A brief description of the fleet. 
     */
    description?: description;
    /**
     *  The ARN of a signal catalog associated with the fleet. 
     */
    signalCatalogArn: arn;
    /**
     *  The time the fleet was created in seconds since epoch (January 1, 1970 at midnight UTC time). 
     */
    creationTime: timestamp;
    /**
     *  The time the fleet was last updated, in seconds since epoch (January 1, 1970 at midnight UTC time). 
     */
    lastModificationTime: timestamp;
  }
  export interface GetLoggingOptionsRequest {
  }
  export interface GetLoggingOptionsResponse {
    /**
     * Returns information about log delivery to Amazon CloudWatch Logs.
     */
    cloudWatchLogDelivery: CloudWatchLogDeliveryOptions;
  }
  export interface GetModelManifestRequest {
    /**
     *  The name of the vehicle model to retrieve information about. 
     */
    name: resourceName;
  }
  export interface GetModelManifestResponse {
    /**
     *  The name of the vehicle model. 
     */
    name: resourceName;
    /**
     *  The Amazon Resource Name (ARN) of the vehicle model. 
     */
    arn: arn;
    /**
     *  A brief description of the vehicle model. 
     */
    description?: description;
    /**
     *  The ARN of the signal catalog associated with the vehicle model. 
     */
    signalCatalogArn?: arn;
    /**
     *  The state of the vehicle model. If the status is ACTIVE, the vehicle model can't be edited. You can edit the vehicle model if the status is marked DRAFT.
     */
    status?: ManifestStatus;
    /**
     * The time the vehicle model was created, in seconds since epoch (January 1, 1970 at midnight UTC time).
     */
    creationTime: timestamp;
    /**
     * The last time the vehicle model was modified.
     */
    lastModificationTime: timestamp;
  }
  export interface GetRegisterAccountStatusRequest {
  }
  export interface GetRegisterAccountStatusResponse {
    /**
     *  The unique ID of the Amazon Web Services account, provided at account creation. 
     */
    customerAccountId: customerAccountId;
    /**
     *  The status of registering your account and resources. The status can be one of:    REGISTRATION_SUCCESS - The Amazon Web Services resource is successfully registered.    REGISTRATION_PENDING - Amazon Web Services IoT FleetWise is processing the registration request. This process takes approximately five minutes to complete.    REGISTRATION_FAILURE - Amazon Web Services IoT FleetWise can't register the AWS resource. Try again later.  
     */
    accountStatus: RegistrationStatus;
    /**
     *  Information about the registered Amazon Timestream resources or errors, if any.
     */
    timestreamRegistrationResponse?: TimestreamRegistrationResponse;
    /**
     *  Information about the registered IAM resources or errors, if any. 
     */
    iamRegistrationResponse: IamRegistrationResponse;
    /**
     *  The time the account was registered, in seconds since epoch (January 1, 1970 at midnight UTC time). 
     */
    creationTime: timestamp;
    /**
     *  The time this registration was last updated, in seconds since epoch (January 1, 1970 at midnight UTC time). 
     */
    lastModificationTime: timestamp;
  }
  export interface GetSignalCatalogRequest {
    /**
     *  The name of the signal catalog to retrieve information about. 
     */
    name: resourceName;
  }
  export interface GetSignalCatalogResponse {
    /**
     *  The name of the signal catalog. 
     */
    name: resourceName;
    /**
     *  The Amazon Resource Name (ARN) of the signal catalog. 
     */
    arn: arn;
    /**
     *  A brief description of the signal catalog. 
     */
    description?: description;
    /**
     *  The total number of network nodes specified in a signal catalog. 
     */
    nodeCounts?: NodeCounts;
    /**
     *  The time the signal catalog was created in seconds since epoch (January 1, 1970 at midnight UTC time). 
     */
    creationTime: timestamp;
    /**
     * The last time the signal catalog was modified.
     */
    lastModificationTime: timestamp;
  }
  export interface GetVehicleRequest {
    /**
     *  The ID of the vehicle to retrieve information about. 
     */
    vehicleName: vehicleName;
  }
  export interface GetVehicleResponse {
    /**
     * The ID of the vehicle.
     */
    vehicleName?: vehicleName;
    /**
     *  The Amazon Resource Name (ARN) of the vehicle to retrieve information about. 
     */
    arn?: arn;
    /**
     *  The ARN of a vehicle model (model manifest) associated with the vehicle. 
     */
    modelManifestArn?: arn;
    /**
     *  The ARN of a decoder manifest associated with the vehicle. 
     */
    decoderManifestArn?: arn;
    /**
     * Static information about a vehicle in a key-value pair. For example:  "engineType" : "1.3 L R2" 
     */
    attributes?: attributesMap;
    /**
     *  The time the vehicle was created in seconds since epoch (January 1, 1970 at midnight UTC time). 
     */
    creationTime?: timestamp;
    /**
     *  The time the vehicle was last updated in seconds since epoch (January 1, 1970 at midnight UTC time). 
     */
    lastModificationTime?: timestamp;
  }
  export interface GetVehicleStatusRequest {
    /**
     * A pagination token for the next set of results. If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next set of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value. 
     */
    nextToken?: nextToken;
    /**
     *  The maximum number of items to return, between 1 and 100, inclusive. 
     */
    maxResults?: maxResults;
    /**
     *  The ID of the vehicle to retrieve information about. 
     */
    vehicleName: vehicleName;
  }
  export interface GetVehicleStatusResponse {
    /**
     *  Lists information about the state of the vehicle with deployed campaigns. 
     */
    campaigns?: VehicleStatusList;
    /**
     *  The token to retrieve the next set of results, or null if there are no more results. 
     */
    nextToken?: nextToken;
  }
  export type IAMRoleArn = string;
  export interface IamRegistrationResponse {
    /**
     * The Amazon Resource Name (ARN) of the IAM role to register.
     */
    roleArn: arn;
    /**
     * The status of registering your IAM resource. The status can be one of REGISTRATION_SUCCESS, REGISTRATION_PENDING, REGISTRATION_FAILURE.
     */
    registrationStatus: RegistrationStatus;
    /**
     * A message associated with a registration error.
     */
    errorMessage?: errorMessage;
  }
  export interface IamResources {
    /**
     * The Amazon Resource Name (ARN) of the IAM resource that allows Amazon Web Services IoT FleetWise to send data to Amazon Timestream. For example, arn:aws:iam::123456789012:role/SERVICE-ROLE-ARN. 
     */
    roleArn: IAMRoleArn;
  }
  export interface ImportDecoderManifestRequest {
    /**
     *  The name of the decoder manifest to import. 
     */
    name: resourceName;
    /**
     *  The file to load into an Amazon Web Services account. 
     */
    networkFileDefinitions: NetworkFileDefinitions;
  }
  export interface ImportDecoderManifestResponse {
    /**
     *  The name of the imported decoder manifest. 
     */
    name: resourceName;
    /**
     *  The Amazon Resource Name (ARN) of the decoder manifest that was imported. 
     */
    arn: arn;
  }
  export interface ImportSignalCatalogRequest {
    /**
     * The name of the signal catalog to import.
     */
    name: resourceName;
    /**
     *  A brief description of the signal catalog. 
     */
    description?: description;
    /**
     * The contents of the Vehicle Signal Specification (VSS) configuration. VSS is a precise language used to describe and model signals in vehicle networks.
     */
    vss?: FormattedVss;
    /**
     * Metadata that can be used to manage the signal catalog.
     */
    tags?: TagList;
  }
  export interface ImportSignalCatalogResponse {
    /**
     *  The name of the imported signal catalog. 
     */
    name: resourceName;
    /**
     *  The Amazon Resource Name (ARN) of the imported signal catalog.
     */
    arn: arn;
  }
  export type InterfaceId = string;
  export type InterfaceIds = InterfaceId[];
  export interface ListCampaignsRequest {
    /**
     * A pagination token for the next set of results. If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next set of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value. 
     */
    nextToken?: nextToken;
    /**
     *  The maximum number of items to return, between 1 and 100, inclusive. 
     */
    maxResults?: maxResults;
    /**
     * Optional parameter to filter the results by the status of each created campaign in your account. The status can be one of: CREATING, WAITING_FOR_APPROVAL, RUNNING, or SUSPENDED.
     */
    status?: status;
  }
  export interface ListCampaignsResponse {
    /**
     *  A summary of information about each campaign. 
     */
    campaignSummaries?: campaignSummaries;
    /**
     *  The token to retrieve the next set of results, or null if there are no more results. 
     */
    nextToken?: nextToken;
  }
  export interface ListDecoderManifestNetworkInterfacesRequest {
    /**
     *  The name of the decoder manifest to list information about. 
     */
    name: resourceName;
    /**
     * A pagination token for the next set of results. If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next set of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value. 
     */
    nextToken?: nextToken;
    /**
     *  The maximum number of items to return, between 1 and 100, inclusive. 
     */
    maxResults?: maxResults;
  }
  export interface ListDecoderManifestNetworkInterfacesResponse {
    /**
     *  A list of information about network interfaces. 
     */
    networkInterfaces?: NetworkInterfaces;
    /**
     *  The token to retrieve the next set of results, or null if there are no more results. 
     */
    nextToken?: nextToken;
  }
  export interface ListDecoderManifestSignalsRequest {
    /**
     *  The name of the decoder manifest to list information about. 
     */
    name: resourceName;
    /**
     * A pagination token for the next set of results. If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next set of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value. 
     */
    nextToken?: nextToken;
    /**
     *  The maximum number of items to return, between 1 and 100, inclusive. 
     */
    maxResults?: maxResults;
  }
  export interface ListDecoderManifestSignalsResponse {
    /**
     *  Information about a list of signals to decode. 
     */
    signalDecoders?: SignalDecoders;
    /**
     *  The token to retrieve the next set of results, or null if there are no more results. 
     */
    nextToken?: nextToken;
  }
  export interface ListDecoderManifestsRequest {
    /**
     *  The Amazon Resource Name (ARN) of a vehicle model (model manifest) associated with the decoder manifest. 
     */
    modelManifestArn?: arn;
    /**
     * A pagination token for the next set of results. If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next set of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value. 
     */
    nextToken?: nextToken;
    /**
     *  The maximum number of items to return, between 1 and 100, inclusive. 
     */
    maxResults?: maxResults;
  }
  export interface ListDecoderManifestsResponse {
    /**
     *  A list of information about each decoder manifest. 
     */
    summaries?: decoderManifestSummaries;
    /**
     *  The token to retrieve the next set of results, or null if there are no more results. 
     */
    nextToken?: nextToken;
  }
  export interface ListFleetsForVehicleRequest {
    /**
     *  The ID of the vehicle to retrieve information about. 
     */
    vehicleName: vehicleName;
    /**
     * A pagination token for the next set of results. If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next set of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value. 
     */
    nextToken?: nextToken;
    /**
     *  The maximum number of items to return, between 1 and 100, inclusive. 
     */
    maxResults?: maxResults;
  }
  export interface ListFleetsForVehicleResponse {
    /**
     *  A list of fleet IDs that the vehicle is associated with. 
     */
    fleets?: fleets;
    /**
     *  The token to retrieve the next set of results, or null if there are no more results. 
     */
    nextToken?: nextToken;
  }
  export interface ListFleetsRequest {
    /**
     * A pagination token for the next set of results. If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next set of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value. 
     */
    nextToken?: nextToken;
    /**
     *  The maximum number of items to return, between 1 and 100, inclusive. 
     */
    maxResults?: maxResults;
  }
  export interface ListFleetsResponse {
    /**
     *  A list of information for each fleet. 
     */
    fleetSummaries?: fleetSummaries;
    /**
     *  The token to retrieve the next set of results, or null if there are no more results. 
     */
    nextToken?: nextToken;
  }
  export interface ListModelManifestNodesRequest {
    /**
     *  The name of the vehicle model to list information about. 
     */
    name: resourceName;
    /**
     * A pagination token for the next set of results. If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next set of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value. 
     */
    nextToken?: nextToken;
    /**
     *  The maximum number of items to return, between 1 and 100, inclusive. 
     */
    maxResults?: maxResults;
  }
  export interface ListModelManifestNodesResponse {
    /**
     *  A list of information about nodes. 
     */
    nodes?: Nodes;
    /**
     *  The token to retrieve the next set of results, or null if there are no more results. 
     */
    nextToken?: nextToken;
  }
  export interface ListModelManifestsRequest {
    /**
     *  The ARN of a signal catalog. If you specify a signal catalog, only the vehicle models associated with it are returned.
     */
    signalCatalogArn?: arn;
    /**
     * A pagination token for the next set of results. If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next set of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value. 
     */
    nextToken?: nextToken;
    /**
     *  The maximum number of items to return, between 1 and 100, inclusive. 
     */
    maxResults?: maxResults;
  }
  export interface ListModelManifestsResponse {
    /**
     *  A list of information about vehicle models.
     */
    summaries?: modelManifestSummaries;
    /**
     *  The token to retrieve the next set of results, or null if there are no more results. 
     */
    nextToken?: nextToken;
  }
  export interface ListSignalCatalogNodesRequest {
    /**
     *  The name of the signal catalog to list information about. 
     */
    name: resourceName;
    /**
     * A pagination token for the next set of results. If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next set of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value. 
     */
    nextToken?: nextToken;
    /**
     *  The maximum number of items to return, between 1 and 100, inclusive. 
     */
    maxResults?: maxResults;
  }
  export interface ListSignalCatalogNodesResponse {
    /**
     *  A list of information about nodes. 
     */
    nodes?: Nodes;
    /**
     *  The token to retrieve the next set of results, or null if there are no more results. 
     */
    nextToken?: nextToken;
  }
  export interface ListSignalCatalogsRequest {
    /**
     * A pagination token for the next set of results. If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next set of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value. 
     */
    nextToken?: nextToken;
    /**
     *  The maximum number of items to return, between 1 and 100, inclusive. 
     */
    maxResults?: maxResults;
  }
  export interface ListSignalCatalogsResponse {
    /**
     *  A list of information about each signal catalog. 
     */
    summaries?: signalCatalogSummaries;
    /**
     *  The token to retrieve the next set of results, or null if there are no more results. 
     */
    nextToken?: nextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource.
     */
    ResourceARN: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The list of tags assigned to the resource.
     */
    Tags?: TagList;
  }
  export interface ListVehiclesInFleetRequest {
    /**
     *  The ID of a fleet. 
     */
    fleetId: fleetId;
    /**
     * A pagination token for the next set of results. If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next set of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value. 
     */
    nextToken?: nextToken;
    /**
     *  The maximum number of items to return, between 1 and 100, inclusive. 
     */
    maxResults?: maxResults;
  }
  export interface ListVehiclesInFleetResponse {
    /**
     *  A list of vehicles associated with the fleet. 
     */
    vehicles?: vehicles;
    /**
     *  The token to retrieve the next set of results, or null if there are no more results. 
     */
    nextToken?: nextToken;
  }
  export interface ListVehiclesRequest {
    /**
     *  The Amazon Resource Name (ARN) of a vehicle model (model manifest). You can use this optional parameter to list only the vehicles created from a certain vehicle model. 
     */
    modelManifestArn?: arn;
    /**
     * A pagination token for the next set of results. If the results of a search are large, only a portion of the results are returned, and a nextToken pagination token is returned in the response. To retrieve the next set of results, reissue the search request and include the returned token. When all results have been returned, the response does not contain a pagination token value. 
     */
    nextToken?: nextToken;
    /**
     *  The maximum number of items to return, between 1 and 100, inclusive. 
     */
    maxResults?: listVehiclesMaxResults;
  }
  export interface ListVehiclesResponse {
    /**
     *  A list of vehicles and information about them. 
     */
    vehicleSummaries?: vehicleSummaries;
    /**
     *  The token to retrieve the next set of results, or null if there are no more results. 
     */
    nextToken?: nextToken;
  }
  export type LogType = "OFF"|"ERROR"|string;
  export type ManifestStatus = "ACTIVE"|"DRAFT"|string;
  export interface ModelManifestSummary {
    /**
     * The name of the vehicle model.
     */
    name?: string;
    /**
     * The Amazon Resource Name (ARN) of the vehicle model.
     */
    arn?: arn;
    /**
     * The ARN of the signal catalog associated with the vehicle model.
     */
    signalCatalogArn?: arn;
    /**
     * A brief description of the vehicle model.
     */
    description?: description;
    /**
     * The state of the vehicle model. If the status is ACTIVE, the vehicle model can't be edited. If the status is DRAFT, you can edit the vehicle model.
     */
    status?: ManifestStatus;
    /**
     * The time the vehicle model was created, in seconds since epoch (January 1, 1970 at midnight UTC time).
     */
    creationTime: timestamp;
    /**
     * The time the vehicle model was last updated, in seconds since epoch (January 1, 1970 at midnight UTC time).
     */
    lastModificationTime: timestamp;
  }
  export type ModelSignalsMap = {[key: string]: string};
  export type NetworkFileBlob = Buffer|Uint8Array|Blob|string;
  export interface NetworkFileDefinition {
    /**
     * Information, including CAN DBC files, about the configurations used to create a decoder manifest.
     */
    canDbc?: CanDbcDefinition;
  }
  export type NetworkFileDefinitions = NetworkFileDefinition[];
  export type NetworkFilesList = NetworkFileBlob[];
  export interface NetworkInterface {
    /**
     * The ID of the network interface.
     */
    interfaceId: InterfaceId;
    /**
     * The network protocol for the vehicle. For example, CAN_SIGNAL specifies a protocol that defines how data is communicated between electronic control units (ECUs). OBD_SIGNAL specifies a protocol that defines how self-diagnostic data is communicated between ECUs.
     */
    type: NetworkInterfaceType;
    /**
     * Information about a network interface specified by the Controller Area Network (CAN) protocol.
     */
    canInterface?: CanInterface;
    /**
     * Information about a network interface specified by the On-board diagnostic (OBD) II protocol.
     */
    obdInterface?: ObdInterface;
  }
  export type NetworkInterfaceType = "CAN_INTERFACE"|"OBD_INTERFACE"|string;
  export type NetworkInterfaces = NetworkInterface[];
  export interface Node {
    /**
     * Information about a node specified as a branch.  A group of signals that are defined in a hierarchical structure. 
     */
    branch?: Branch;
    sensor?: Sensor;
    /**
     * Information about a node specified as an actuator.  An actuator is a digital representation of a vehicle device. 
     */
    actuator?: Actuator;
    /**
     * Information about a node specified as an attribute.  An attribute represents static information about a vehicle. 
     */
    attribute?: Attribute;
  }
  export interface NodeCounts {
    /**
     * The total number of nodes in a vehicle network.
     */
    totalNodes?: number;
    /**
     * The total number of nodes in a vehicle network that represent branches.
     */
    totalBranches?: number;
    /**
     * The total number of nodes in a vehicle network that represent sensors.
     */
    totalSensors?: number;
    /**
     * The total number of nodes in a vehicle network that represent attributes.
     */
    totalAttributes?: number;
    /**
     * The total number of nodes in a vehicle network that represent actuators.
     */
    totalActuators?: number;
  }
  export type NodeDataType = "INT8"|"UINT8"|"INT16"|"UINT16"|"INT32"|"UINT32"|"INT64"|"UINT64"|"BOOLEAN"|"FLOAT"|"DOUBLE"|"STRING"|"UNIX_TIMESTAMP"|"INT8_ARRAY"|"UINT8_ARRAY"|"INT16_ARRAY"|"UINT16_ARRAY"|"INT32_ARRAY"|"UINT32_ARRAY"|"INT64_ARRAY"|"UINT64_ARRAY"|"BOOLEAN_ARRAY"|"FLOAT_ARRAY"|"DOUBLE_ARRAY"|"STRING_ARRAY"|"UNIX_TIMESTAMP_ARRAY"|"UNKNOWN"|string;
  export type NodePath = string;
  export type NodePaths = NodePath[];
  export type Nodes = Node[];
  export type ObdBitmaskLength = number;
  export type ObdByteLength = number;
  export interface ObdInterface {
    /**
     * The name of the interface.
     */
    name: ObdInterfaceName;
    /**
     * The ID of the message requesting vehicle data.
     */
    requestMessageId: nonNegativeInteger;
    /**
     * The standard OBD II PID.
     */
    obdStandard?: ObdStandard;
    /**
     * The maximum number message requests per second.
     */
    pidRequestIntervalSeconds?: nonNegativeInteger;
    /**
     * The maximum number message requests per diagnostic trouble code per second.
     */
    dtcRequestIntervalSeconds?: nonNegativeInteger;
    /**
     * Whether to use extended IDs in the message.
     */
    useExtendedIds?: boolean;
    /**
     * Whether the vehicle has a transmission control module (TCM).
     */
    hasTransmissionEcu?: boolean;
  }
  export type ObdInterfaceName = string;
  export interface ObdSignal {
    /**
     * The length of the requested data.
     */
    pidResponseLength: positiveInteger;
    /**
     * The mode of operation (diagnostic service) in a message.
     */
    serviceMode: nonNegativeInteger;
    /**
     * The diagnostic code used to request data from a vehicle for this signal.
     */
    pid: nonNegativeInteger;
    /**
     * A multiplier used to decode the message.
     */
    scaling: double;
    /**
     * The offset used to calculate the signal value. Combined with scaling, the calculation is value = raw_value * scaling + offset.
     */
    offset: double;
    /**
     * Indicates the beginning of the message.
     */
    startByte: nonNegativeInteger;
    /**
     * The length of a message.
     */
    byteLength: ObdByteLength;
    /**
     * The number of positions to shift bits in the message.
     */
    bitRightShift?: nonNegativeInteger;
    /**
     * The number of bits to mask in a message.
     */
    bitMaskLength?: ObdBitmaskLength;
  }
  export type ObdStandard = string;
  export type Prefix = string;
  export type ProtocolName = string;
  export type ProtocolVersion = string;
  export interface PutEncryptionConfigurationRequest {
    /**
     * The ID of the KMS key that is used for encryption.
     */
    kmsKeyId?: String;
    /**
     * The type of encryption. Choose KMS_BASED_ENCRYPTION to use a KMS key or FLEETWISE_DEFAULT_ENCRYPTION to use an Amazon Web Services managed key.
     */
    encryptionType: EncryptionType;
  }
  export interface PutEncryptionConfigurationResponse {
    /**
     * The ID of the KMS key that is used for encryption.
     */
    kmsKeyId?: String;
    /**
     * The encryption status.
     */
    encryptionStatus: EncryptionStatus;
    /**
     * The type of encryption. Set to KMS_BASED_ENCRYPTION to use an KMS key that you own and manage. Set to FLEETWISE_DEFAULT_ENCRYPTION to use an Amazon Web Services managed key that is owned by the Amazon Web Services IoT FleetWise service account.
     */
    encryptionType: EncryptionType;
  }
  export interface PutLoggingOptionsRequest {
    /**
     * Creates or updates the log delivery option to Amazon CloudWatch Logs.
     */
    cloudWatchLogDelivery: CloudWatchLogDeliveryOptions;
  }
  export interface PutLoggingOptionsResponse {
  }
  export interface RegisterAccountRequest {
    timestreamResources?: TimestreamResources;
    /**
     * The IAM resource that allows Amazon Web Services IoT FleetWise to send data to Amazon Timestream.
     */
    iamResources?: IamResources;
  }
  export interface RegisterAccountResponse {
    /**
     *  The status of registering your Amazon Web Services account, IAM role, and Timestream resources. 
     */
    registerAccountStatus: RegistrationStatus;
    timestreamResources?: TimestreamResources;
    /**
     *  The registered IAM resource that allows Amazon Web Services IoT FleetWise to send data to Amazon Timestream. 
     */
    iamResources: IamResources;
    /**
     *  The time the account was registered, in seconds since epoch (January 1, 1970 at midnight UTC time). 
     */
    creationTime: timestamp;
    /**
     *  The time this registration was last updated, in seconds since epoch (January 1, 1970 at midnight UTC time). 
     */
    lastModificationTime: timestamp;
  }
  export type RegistrationStatus = "REGISTRATION_PENDING"|"REGISTRATION_SUCCESS"|"REGISTRATION_FAILURE"|string;
  export type S3BucketArn = string;
  export interface S3Config {
    /**
     * The Amazon Resource Name (ARN) of the Amazon S3 bucket.
     */
    bucketArn: S3BucketArn;
    /**
     * Specify the format that files are saved in the Amazon S3 bucket. You can save files in an Apache Parquet or JSON format.   Parquet - Store data in a columnar storage file format. Parquet is optimal for fast data retrieval and can reduce costs. This option is selected by default.   JSON - Store data in a standard text-based JSON file format.  
     */
    dataFormat?: DataFormat;
    /**
     * By default, stored data is compressed as a .gzip file. Compressed files have a reduced file size, which can optimize the cost of data storage.
     */
    storageCompressionFormat?: StorageCompressionFormat;
    /**
     * (Optional) Enter an S3 bucket prefix. The prefix is the string of characters after the bucket name and before the object name. You can use the prefix to organize data stored in Amazon S3 buckets. For more information, see Organizing objects using prefixes in the Amazon Simple Storage Service User Guide. By default, Amazon Web Services IoT FleetWise sets the prefix processed-data/year=YY/month=MM/date=DD/hour=HH/ (in UTC) to data it delivers to Amazon S3. You can enter a prefix to append it to this default prefix. For example, if you enter the prefix vehicles, the prefix will be vehicles/processed-data/year=YY/month=MM/date=DD/hour=HH/.
     */
    prefix?: Prefix;
  }
  export interface Sensor {
    /**
     * The fully qualified name of the sensor. For example, the fully qualified name of a sensor might be Vehicle.Body.Engine.Battery.
     */
    fullyQualifiedName: string;
    /**
     * The specified data type of the sensor. 
     */
    dataType: NodeDataType;
    /**
     * A brief description of a sensor.
     */
    description?: description;
    /**
     * The scientific unit of measurement for data collected by the sensor.
     */
    unit?: string;
    /**
     * A list of possible values a sensor can take.
     */
    allowedValues?: listOfStrings;
    /**
     * The specified possible minimum value of the sensor.
     */
    min?: double;
    /**
     * The specified possible maximum value of the sensor.
     */
    max?: double;
    /**
     * The deprecation message for the node or the branch that was moved or deleted.
     */
    deprecationMessage?: message;
    /**
     * A comment in addition to the description.
     */
    comment?: message;
  }
  export interface SignalCatalogSummary {
    /**
     * The name of the signal catalog.
     */
    name?: string;
    /**
     * The Amazon Resource Name (ARN) of the signal catalog.
     */
    arn?: arn;
    /**
     * The time the signal catalog was created in seconds since epoch (January 1, 1970 at midnight UTC time). 
     */
    creationTime?: timestamp;
    /**
     * The time the signal catalog was last updated in seconds since epoch (January 1, 1970 at midnight UTC time). 
     */
    lastModificationTime?: timestamp;
  }
  export interface SignalDecoder {
    /**
     * The fully qualified name of a signal decoder as defined in a vehicle model.
     */
    fullyQualifiedName: FullyQualifiedName;
    /**
     * The network protocol for the vehicle. For example, CAN_SIGNAL specifies a protocol that defines how data is communicated between electronic control units (ECUs). OBD_SIGNAL specifies a protocol that defines how self-diagnostic data is communicated between ECUs.
     */
    type: SignalDecoderType;
    /**
     * The ID of a network interface that specifies what network protocol a vehicle follows.
     */
    interfaceId: InterfaceId;
    /**
     * Information about signal decoder using the Controller Area Network (CAN) protocol.
     */
    canSignal?: CanSignal;
    /**
     * Information about signal decoder using the On-board diagnostic (OBD) II protocol.
     */
    obdSignal?: ObdSignal;
  }
  export type SignalDecoderType = "CAN_SIGNAL"|"OBD_SIGNAL"|string;
  export type SignalDecoders = SignalDecoder[];
  export interface SignalInformation {
    /**
     * The name of the signal.
     */
    name: wildcardSignalName;
    /**
     * The maximum number of samples to collect.
     */
    maxSampleCount?: maxSampleCount;
    /**
     * The minimum duration of time (in milliseconds) between two triggering events to collect data.  If a signal changes often, you might want to collect data at a slower rate. 
     */
    minimumSamplingIntervalMs?: uint32;
  }
  export type SignalInformationList = SignalInformation[];
  export type SpoolingMode = "OFF"|"TO_DISK"|string;
  export type StorageCompressionFormat = "NONE"|"GZIP"|string;
  export type String = string;
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
     * The ARN of the resource.
     */
    ResourceARN: AmazonResourceName;
    /**
     * The new or modified tags for the resource.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface TimeBasedCollectionScheme {
    /**
     * The time period (in milliseconds) to decide how often to collect data. For example, if the time period is 60000, the Edge Agent software collects data once every minute.
     */
    periodMs: collectionPeriodMs;
  }
  export interface TimestreamConfig {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Timestream table.
     */
    timestreamTableArn: TimestreamTableArn;
    /**
     * The Amazon Resource Name (ARN) of the task execution role that grants Amazon Web Services IoT FleetWise permission to deliver data to the Amazon Timestream table.
     */
    executionRoleArn: IAMRoleArn;
  }
  export type TimestreamDatabaseName = string;
  export interface TimestreamRegistrationResponse {
    /**
     * The name of the Timestream database.
     */
    timestreamDatabaseName: TimestreamDatabaseName;
    /**
     * The name of the Timestream database table.
     */
    timestreamTableName: TimestreamTableName;
    /**
     * The Amazon Resource Name (ARN) of the Timestream database.
     */
    timestreamDatabaseArn?: arn;
    /**
     * The ARN of the Timestream database table.
     */
    timestreamTableArn?: arn;
    /**
     * The status of registering your Amazon Timestream resources. The status can be one of REGISTRATION_SUCCESS, REGISTRATION_PENDING, REGISTRATION_FAILURE.
     */
    registrationStatus: RegistrationStatus;
    /**
     * A message associated with a registration error.
     */
    errorMessage?: errorMessage;
  }
  export interface TimestreamResources {
    /**
     * The name of the registered Amazon Timestream database.
     */
    timestreamDatabaseName: TimestreamDatabaseName;
    /**
     * The name of the registered Amazon Timestream database table.
     */
    timestreamTableName: TimestreamTableName;
  }
  export type TimestreamTableArn = string;
  export type TimestreamTableName = string;
  export type TriggerMode = "ALWAYS"|"RISING_EDGE"|string;
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource.
     */
    ResourceARN: AmazonResourceName;
    /**
     * A list of the keys of the tags to be removed from the resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export type UpdateCampaignAction = "APPROVE"|"SUSPEND"|"RESUME"|"UPDATE"|string;
  export interface UpdateCampaignRequest {
    /**
     *  The name of the campaign to update. 
     */
    name: campaignName;
    /**
     * The description of the campaign.
     */
    description?: description;
    /**
     *  A list of vehicle attributes to associate with a signal.  Default: An empty array
     */
    dataExtraDimensions?: DataExtraDimensionNodePathList;
    /**
     *  Specifies how to update a campaign. The action can be one of the following:    APPROVE - To approve delivering a data collection scheme to vehicles.     SUSPEND - To suspend collecting signal data. The campaign is deleted from vehicles and all vehicles in the suspended campaign will stop sending data.    RESUME - To reactivate the SUSPEND campaign. The campaign is redeployed to all vehicles and the vehicles will resume sending data.    UPDATE - To update a campaign.   
     */
    action: UpdateCampaignAction;
  }
  export interface UpdateCampaignResponse {
    /**
     *  The Amazon Resource Name (ARN) of the campaign. 
     */
    arn?: arn;
    /**
     * The name of the updated campaign.
     */
    name?: campaignName;
    /**
     * The state of a campaign. The status can be one of:    CREATING - Amazon Web Services IoT FleetWise is processing your request to create the campaign.     WAITING_FOR_APPROVAL - After a campaign is created, it enters the WAITING_FOR_APPROVAL state. To allow Amazon Web Services IoT FleetWise to deploy the campaign to the target vehicle or fleet, use the API operation to approve the campaign.     RUNNING - The campaign is active.     SUSPENDED - The campaign is suspended. To resume the campaign, use the API operation.   
     */
    status?: CampaignStatus;
  }
  export interface UpdateDecoderManifestRequest {
    /**
     *  The name of the decoder manifest to update.
     */
    name: resourceName;
    /**
     *  A brief description of the decoder manifest to update. 
     */
    description?: description;
    /**
     *  A list of information about decoding additional signals to add to the decoder manifest. 
     */
    signalDecodersToAdd?: SignalDecoders;
    /**
     *  A list of updated information about decoding signals to update in the decoder manifest. 
     */
    signalDecodersToUpdate?: SignalDecoders;
    /**
     *  A list of signal decoders to remove from the decoder manifest. 
     */
    signalDecodersToRemove?: Fqns;
    /**
     *  A list of information about the network interfaces to add to the decoder manifest. 
     */
    networkInterfacesToAdd?: NetworkInterfaces;
    /**
     *  A list of information about the network interfaces to update in the decoder manifest. 
     */
    networkInterfacesToUpdate?: NetworkInterfaces;
    /**
     *  A list of network interfaces to remove from the decoder manifest.
     */
    networkInterfacesToRemove?: InterfaceIds;
    /**
     *  The state of the decoder manifest. If the status is ACTIVE, the decoder manifest can't be edited. If the status is DRAFT, you can edit the decoder manifest. 
     */
    status?: ManifestStatus;
  }
  export interface UpdateDecoderManifestResponse {
    /**
     *  The name of the updated decoder manifest. 
     */
    name: resourceName;
    /**
     *  The Amazon Resource Name (ARN) of the updated decoder manifest. 
     */
    arn: arn;
  }
  export interface UpdateFleetRequest {
    /**
     *  The ID of the fleet to update. 
     */
    fleetId: fleetId;
    /**
     *  An updated description of the fleet. 
     */
    description?: description;
  }
  export interface UpdateFleetResponse {
    /**
     * The ID of the updated fleet.
     */
    id?: fleetId;
    /**
     * The Amazon Resource Name (ARN) of the updated fleet.
     */
    arn?: arn;
  }
  export type UpdateMode = "Overwrite"|"Merge"|string;
  export interface UpdateModelManifestRequest {
    /**
     *  The name of the vehicle model to update. 
     */
    name: resourceName;
    /**
     *  A brief description of the vehicle model. 
     */
    description?: description;
    /**
     *  A list of fullyQualifiedName of nodes, which are a general abstraction of signals, to add to the vehicle model. 
     */
    nodesToAdd?: NodePaths;
    /**
     *  A list of fullyQualifiedName of nodes, which are a general abstraction of signals, to remove from the vehicle model. 
     */
    nodesToRemove?: NodePaths;
    /**
     *  The state of the vehicle model. If the status is ACTIVE, the vehicle model can't be edited. If the status is DRAFT, you can edit the vehicle model. 
     */
    status?: ManifestStatus;
  }
  export interface UpdateModelManifestResponse {
    /**
     *  The name of the updated vehicle model. 
     */
    name: resourceName;
    /**
     *  The Amazon Resource Name (ARN) of the updated vehicle model. 
     */
    arn: arn;
  }
  export interface UpdateSignalCatalogRequest {
    /**
     *  The name of the signal catalog to update. 
     */
    name: resourceName;
    /**
     *  A brief description of the signal catalog to update.
     */
    description?: description;
    /**
     *  A list of information about nodes to add to the signal catalog. 
     */
    nodesToAdd?: Nodes;
    /**
     *  A list of information about nodes to update in the signal catalog. 
     */
    nodesToUpdate?: Nodes;
    /**
     *  A list of fullyQualifiedName of nodes to remove from the signal catalog. 
     */
    nodesToRemove?: NodePaths;
  }
  export interface UpdateSignalCatalogResponse {
    /**
     *  The name of the updated signal catalog. 
     */
    name: resourceName;
    /**
     *  The ARN of the updated signal catalog. 
     */
    arn: arn;
  }
  export interface UpdateVehicleError {
    /**
     * The ID of the vehicle with the error.
     */
    vehicleName?: vehicleName;
    /**
     * The relevant HTTP error code (400+).
     */
    code?: number;
    /**
     * A message associated with the error.
     */
    message?: string;
  }
  export interface UpdateVehicleRequest {
    /**
     * The unique ID of the vehicle to update.
     */
    vehicleName: vehicleName;
    /**
     * The ARN of a vehicle model (model manifest) associated with the vehicle.
     */
    modelManifestArn?: arn;
    /**
     * The ARN of the decoder manifest associated with this vehicle.
     */
    decoderManifestArn?: arn;
    /**
     * Static information about a vehicle in a key-value pair. For example:  "engineType" : "1.3 L R2" 
     */
    attributes?: attributesMap;
    /**
     * The method the specified attributes will update the existing attributes on the vehicle. UseOverwite to replace the vehicle attributes with the specified attributes. Or use Merge to combine all attributes. This is required if attributes are present in the input.
     */
    attributeUpdateMode?: UpdateMode;
  }
  export interface UpdateVehicleRequestItem {
    /**
     * The unique ID of the vehicle to update.
     */
    vehicleName: vehicleName;
    /**
     * The ARN of the vehicle model (model manifest) associated with the vehicle to update.
     */
    modelManifestArn?: arn;
    /**
     * The ARN of the signal decoder manifest associated with the vehicle to update.
     */
    decoderManifestArn?: arn;
    /**
     * Static information about a vehicle in a key-value pair. For example:  "engineType" : "1.3 L R2" 
     */
    attributes?: attributesMap;
    /**
     * The method the specified attributes will update the existing attributes on the vehicle. UseOverwite to replace the vehicle attributes with the specified attributes. Or use Merge to combine all attributes. This is required if attributes are present in the input.
     */
    attributeUpdateMode?: UpdateMode;
  }
  export interface UpdateVehicleResponse {
    /**
     * The ID of the updated vehicle.
     */
    vehicleName?: vehicleName;
    /**
     * The ARN of the updated vehicle.
     */
    arn?: arn;
  }
  export interface UpdateVehicleResponseItem {
    /**
     * The unique ID of the updated vehicle.
     */
    vehicleName?: vehicleName;
    /**
     * The Amazon Resource Name (ARN) of the updated vehicle.
     */
    arn?: arn;
  }
  export type VehicleAssociationBehavior = "CreateIotThing"|"ValidateIotThingExists"|string;
  export type VehicleState = "CREATED"|"READY"|"HEALTHY"|"SUSPENDED"|"DELETING"|string;
  export interface VehicleStatus {
    /**
     * The name of a campaign.
     */
    campaignName?: string;
    /**
     * The unique ID of the vehicle.
     */
    vehicleName?: vehicleName;
    /**
     * The state of a vehicle, which can be one of the following:    CREATED - Amazon Web Services IoT FleetWise sucessfully created the vehicle.     READY - The vehicle is ready to receive a campaign deployment.     HEALTHY - A campaign deployment was delivered to the vehicle.     SUSPENDED - A campaign associated with the vehicle was suspended and data collection was paused.     DELETING - Amazon Web Services IoT FleetWise is removing a campaign from the vehicle.   
     */
    status?: VehicleState;
  }
  export type VehicleStatusList = VehicleStatus[];
  export interface VehicleSummary {
    /**
     * The unique ID of the vehicle.
     */
    vehicleName: vehicleName;
    /**
     * The Amazon Resource Name (ARN) of the vehicle.
     */
    arn: arn;
    /**
     * The ARN of a vehicle model (model manifest) associated with the vehicle.
     */
    modelManifestArn: arn;
    /**
     * The ARN of a decoder manifest associated with the vehicle.
     */
    decoderManifestArn: arn;
    /**
     * The time the vehicle was created in seconds since epoch (January 1, 1970 at midnight UTC time).
     */
    creationTime: timestamp;
    /**
     * The time the vehicle was last updated in seconds since epoch (January 1, 1970 at midnight UTC time). 
     */
    lastModificationTime: timestamp;
  }
  export type arn = string;
  export type attributeName = string;
  export type attributeValue = string;
  export type attributesMap = {[key: string]: attributeValue};
  export type campaignName = string;
  export type campaignSummaries = CampaignSummary[];
  export type collectionPeriodMs = number;
  export type createVehicleErrors = CreateVehicleError[];
  export type createVehicleRequestItems = CreateVehicleRequestItem[];
  export type createVehicleResponses = CreateVehicleResponseItem[];
  export type customerAccountId = string;
  export type decoderManifestSummaries = DecoderManifestSummary[];
  export type description = string;
  export type double = number;
  export type errorMessage = string;
  export type eventExpression = string;
  export type fleetId = string;
  export type fleetSummaries = FleetSummary[];
  export type fleets = fleetId[];
  export type languageVersion = number;
  export type listOfStrings = string[];
  export type listVehiclesMaxResults = number;
  export type maxResults = number;
  export type maxSampleCount = number;
  export type message = string;
  export type modelManifestSummaries = ModelManifestSummary[];
  export type nextToken = string;
  export type nonNegativeInteger = number;
  export type positiveInteger = number;
  export type priority = number;
  export type resourceName = string;
  export type signalCatalogSummaries = SignalCatalogSummary[];
  export type status = string;
  export type timestamp = Date;
  export type uint32 = number;
  export type updateVehicleErrors = UpdateVehicleError[];
  export type updateVehicleRequestItems = UpdateVehicleRequestItem[];
  export type updateVehicleResponseItems = UpdateVehicleResponseItem[];
  export type vehicleName = string;
  export type vehicleSummaries = VehicleSummary[];
  export type vehicles = vehicleName[];
  export type wildcardSignalName = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-06-17"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the IoTFleetWise client.
   */
  export import Types = IoTFleetWise;
}
export = IoTFleetWise;
