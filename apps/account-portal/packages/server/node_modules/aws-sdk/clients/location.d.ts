import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Location extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Location.Types.ClientConfiguration)
  config: Config & Location.Types.ClientConfiguration;
  /**
   * Creates an association between a geofence collection and a tracker resource. This allows the tracker resource to communicate location data to the linked geofence collection.  You can associate up to five geofence collections to each tracker resource.  Currently not supported — Cross-account configurations, such as creating associations between a tracker resource in one account and a geofence collection in another account. 
   */
  associateTrackerConsumer(params: Location.Types.AssociateTrackerConsumerRequest, callback?: (err: AWSError, data: Location.Types.AssociateTrackerConsumerResponse) => void): Request<Location.Types.AssociateTrackerConsumerResponse, AWSError>;
  /**
   * Creates an association between a geofence collection and a tracker resource. This allows the tracker resource to communicate location data to the linked geofence collection.  You can associate up to five geofence collections to each tracker resource.  Currently not supported — Cross-account configurations, such as creating associations between a tracker resource in one account and a geofence collection in another account. 
   */
  associateTrackerConsumer(callback?: (err: AWSError, data: Location.Types.AssociateTrackerConsumerResponse) => void): Request<Location.Types.AssociateTrackerConsumerResponse, AWSError>;
  /**
   * Deletes the position history of one or more devices from a tracker resource.
   */
  batchDeleteDevicePositionHistory(params: Location.Types.BatchDeleteDevicePositionHistoryRequest, callback?: (err: AWSError, data: Location.Types.BatchDeleteDevicePositionHistoryResponse) => void): Request<Location.Types.BatchDeleteDevicePositionHistoryResponse, AWSError>;
  /**
   * Deletes the position history of one or more devices from a tracker resource.
   */
  batchDeleteDevicePositionHistory(callback?: (err: AWSError, data: Location.Types.BatchDeleteDevicePositionHistoryResponse) => void): Request<Location.Types.BatchDeleteDevicePositionHistoryResponse, AWSError>;
  /**
   * Deletes a batch of geofences from a geofence collection.  This operation deletes the resource permanently. 
   */
  batchDeleteGeofence(params: Location.Types.BatchDeleteGeofenceRequest, callback?: (err: AWSError, data: Location.Types.BatchDeleteGeofenceResponse) => void): Request<Location.Types.BatchDeleteGeofenceResponse, AWSError>;
  /**
   * Deletes a batch of geofences from a geofence collection.  This operation deletes the resource permanently. 
   */
  batchDeleteGeofence(callback?: (err: AWSError, data: Location.Types.BatchDeleteGeofenceResponse) => void): Request<Location.Types.BatchDeleteGeofenceResponse, AWSError>;
  /**
   * Evaluates device positions against the geofence geometries from a given geofence collection. This operation always returns an empty response because geofences are asynchronously evaluated. The evaluation determines if the device has entered or exited a geofenced area, and then publishes one of the following events to Amazon EventBridge:    ENTER if Amazon Location determines that the tracked device has entered a geofenced area.    EXIT if Amazon Location determines that the tracked device has exited a geofenced area.    The last geofence that a device was observed within is tracked for 30 days after the most recent device position update.   Geofence evaluation uses the given device position. It does not account for the optional Accuracy of a DevicePositionUpdate.   The DeviceID is used as a string to represent the device. You do not need to have a Tracker associated with the DeviceID. 
   */
  batchEvaluateGeofences(params: Location.Types.BatchEvaluateGeofencesRequest, callback?: (err: AWSError, data: Location.Types.BatchEvaluateGeofencesResponse) => void): Request<Location.Types.BatchEvaluateGeofencesResponse, AWSError>;
  /**
   * Evaluates device positions against the geofence geometries from a given geofence collection. This operation always returns an empty response because geofences are asynchronously evaluated. The evaluation determines if the device has entered or exited a geofenced area, and then publishes one of the following events to Amazon EventBridge:    ENTER if Amazon Location determines that the tracked device has entered a geofenced area.    EXIT if Amazon Location determines that the tracked device has exited a geofenced area.    The last geofence that a device was observed within is tracked for 30 days after the most recent device position update.   Geofence evaluation uses the given device position. It does not account for the optional Accuracy of a DevicePositionUpdate.   The DeviceID is used as a string to represent the device. You do not need to have a Tracker associated with the DeviceID. 
   */
  batchEvaluateGeofences(callback?: (err: AWSError, data: Location.Types.BatchEvaluateGeofencesResponse) => void): Request<Location.Types.BatchEvaluateGeofencesResponse, AWSError>;
  /**
   * Lists the latest device positions for requested devices.
   */
  batchGetDevicePosition(params: Location.Types.BatchGetDevicePositionRequest, callback?: (err: AWSError, data: Location.Types.BatchGetDevicePositionResponse) => void): Request<Location.Types.BatchGetDevicePositionResponse, AWSError>;
  /**
   * Lists the latest device positions for requested devices.
   */
  batchGetDevicePosition(callback?: (err: AWSError, data: Location.Types.BatchGetDevicePositionResponse) => void): Request<Location.Types.BatchGetDevicePositionResponse, AWSError>;
  /**
   * A batch request for storing geofence geometries into a given geofence collection, or updates the geometry of an existing geofence if a geofence ID is included in the request.
   */
  batchPutGeofence(params: Location.Types.BatchPutGeofenceRequest, callback?: (err: AWSError, data: Location.Types.BatchPutGeofenceResponse) => void): Request<Location.Types.BatchPutGeofenceResponse, AWSError>;
  /**
   * A batch request for storing geofence geometries into a given geofence collection, or updates the geometry of an existing geofence if a geofence ID is included in the request.
   */
  batchPutGeofence(callback?: (err: AWSError, data: Location.Types.BatchPutGeofenceResponse) => void): Request<Location.Types.BatchPutGeofenceResponse, AWSError>;
  /**
   * Uploads position update data for one or more devices to a tracker resource (up to 10 devices per batch). Amazon Location uses the data when it reports the last known device position and position history. Amazon Location retains location data for 30 days.  Position updates are handled based on the PositionFiltering property of the tracker. When PositionFiltering is set to TimeBased, updates are evaluated against linked geofence collections, and location data is stored at a maximum of one position per 30 second interval. If your update frequency is more often than every 30 seconds, only one update per 30 seconds is stored for each unique device ID. When PositionFiltering is set to DistanceBased filtering, location data is stored and evaluated against linked geofence collections only if the device has moved more than 30 m (98.4 ft). When PositionFiltering is set to AccuracyBased filtering, location data is stored and evaluated against linked geofence collections only if the device has moved more than the measured accuracy. For example, if two consecutive updates from a device have a horizontal accuracy of 5 m and 10 m, the second update is neither stored or evaluated if the device has moved less than 15 m. If PositionFiltering is set to AccuracyBased filtering, Amazon Location uses the default value { "Horizontal": 0} when accuracy is not provided on a DevicePositionUpdate. 
   */
  batchUpdateDevicePosition(params: Location.Types.BatchUpdateDevicePositionRequest, callback?: (err: AWSError, data: Location.Types.BatchUpdateDevicePositionResponse) => void): Request<Location.Types.BatchUpdateDevicePositionResponse, AWSError>;
  /**
   * Uploads position update data for one or more devices to a tracker resource (up to 10 devices per batch). Amazon Location uses the data when it reports the last known device position and position history. Amazon Location retains location data for 30 days.  Position updates are handled based on the PositionFiltering property of the tracker. When PositionFiltering is set to TimeBased, updates are evaluated against linked geofence collections, and location data is stored at a maximum of one position per 30 second interval. If your update frequency is more often than every 30 seconds, only one update per 30 seconds is stored for each unique device ID. When PositionFiltering is set to DistanceBased filtering, location data is stored and evaluated against linked geofence collections only if the device has moved more than 30 m (98.4 ft). When PositionFiltering is set to AccuracyBased filtering, location data is stored and evaluated against linked geofence collections only if the device has moved more than the measured accuracy. For example, if two consecutive updates from a device have a horizontal accuracy of 5 m and 10 m, the second update is neither stored or evaluated if the device has moved less than 15 m. If PositionFiltering is set to AccuracyBased filtering, Amazon Location uses the default value { "Horizontal": 0} when accuracy is not provided on a DevicePositionUpdate. 
   */
  batchUpdateDevicePosition(callback?: (err: AWSError, data: Location.Types.BatchUpdateDevicePositionResponse) => void): Request<Location.Types.BatchUpdateDevicePositionResponse, AWSError>;
  /**
   *  Calculates a route given the following required parameters: DeparturePosition and DestinationPosition. Requires that you first create a route calculator resource. By default, a request that doesn't specify a departure time uses the best time of day to travel with the best traffic conditions when calculating the route. Additional options include:    Specifying a departure time using either DepartureTime or DepartNow. This calculates a route based on predictive traffic data at the given time.   You can't specify both DepartureTime and DepartNow in a single request. Specifying both parameters returns a validation error.     Specifying a travel mode using TravelMode sets the transportation mode used to calculate the routes. This also lets you specify additional route preferences in CarModeOptions if traveling by Car, or TruckModeOptions if traveling by Truck.  If you specify walking for the travel mode and your data provider is Esri, the start and destination must be within 40km.   
   */
  calculateRoute(params: Location.Types.CalculateRouteRequest, callback?: (err: AWSError, data: Location.Types.CalculateRouteResponse) => void): Request<Location.Types.CalculateRouteResponse, AWSError>;
  /**
   *  Calculates a route given the following required parameters: DeparturePosition and DestinationPosition. Requires that you first create a route calculator resource. By default, a request that doesn't specify a departure time uses the best time of day to travel with the best traffic conditions when calculating the route. Additional options include:    Specifying a departure time using either DepartureTime or DepartNow. This calculates a route based on predictive traffic data at the given time.   You can't specify both DepartureTime and DepartNow in a single request. Specifying both parameters returns a validation error.     Specifying a travel mode using TravelMode sets the transportation mode used to calculate the routes. This also lets you specify additional route preferences in CarModeOptions if traveling by Car, or TruckModeOptions if traveling by Truck.  If you specify walking for the travel mode and your data provider is Esri, the start and destination must be within 40km.   
   */
  calculateRoute(callback?: (err: AWSError, data: Location.Types.CalculateRouteResponse) => void): Request<Location.Types.CalculateRouteResponse, AWSError>;
  /**
   *   Calculates a route matrix given the following required parameters: DeparturePositions and DestinationPositions. CalculateRouteMatrix calculates routes and returns the travel time and travel distance from each departure position to each destination position in the request. For example, given departure positions A and B, and destination positions X and Y, CalculateRouteMatrix will return time and distance for routes from A to X, A to Y, B to X, and B to Y (in that order). The number of results returned (and routes calculated) will be the number of DeparturePositions times the number of DestinationPositions.  Your account is charged for each route calculated, not the number of requests.  Requires that you first create a route calculator resource. By default, a request that doesn't specify a departure time uses the best time of day to travel with the best traffic conditions when calculating routes. Additional options include:     Specifying a departure time using either DepartureTime or DepartNow. This calculates routes based on predictive traffic data at the given time.   You can't specify both DepartureTime and DepartNow in a single request. Specifying both parameters returns a validation error.     Specifying a travel mode using TravelMode sets the transportation mode used to calculate the routes. This also lets you specify additional route preferences in CarModeOptions if traveling by Car, or TruckModeOptions if traveling by Truck.  
   */
  calculateRouteMatrix(params: Location.Types.CalculateRouteMatrixRequest, callback?: (err: AWSError, data: Location.Types.CalculateRouteMatrixResponse) => void): Request<Location.Types.CalculateRouteMatrixResponse, AWSError>;
  /**
   *   Calculates a route matrix given the following required parameters: DeparturePositions and DestinationPositions. CalculateRouteMatrix calculates routes and returns the travel time and travel distance from each departure position to each destination position in the request. For example, given departure positions A and B, and destination positions X and Y, CalculateRouteMatrix will return time and distance for routes from A to X, A to Y, B to X, and B to Y (in that order). The number of results returned (and routes calculated) will be the number of DeparturePositions times the number of DestinationPositions.  Your account is charged for each route calculated, not the number of requests.  Requires that you first create a route calculator resource. By default, a request that doesn't specify a departure time uses the best time of day to travel with the best traffic conditions when calculating routes. Additional options include:     Specifying a departure time using either DepartureTime or DepartNow. This calculates routes based on predictive traffic data at the given time.   You can't specify both DepartureTime and DepartNow in a single request. Specifying both parameters returns a validation error.     Specifying a travel mode using TravelMode sets the transportation mode used to calculate the routes. This also lets you specify additional route preferences in CarModeOptions if traveling by Car, or TruckModeOptions if traveling by Truck.  
   */
  calculateRouteMatrix(callback?: (err: AWSError, data: Location.Types.CalculateRouteMatrixResponse) => void): Request<Location.Types.CalculateRouteMatrixResponse, AWSError>;
  /**
   * Creates a geofence collection, which manages and stores geofences.
   */
  createGeofenceCollection(params: Location.Types.CreateGeofenceCollectionRequest, callback?: (err: AWSError, data: Location.Types.CreateGeofenceCollectionResponse) => void): Request<Location.Types.CreateGeofenceCollectionResponse, AWSError>;
  /**
   * Creates a geofence collection, which manages and stores geofences.
   */
  createGeofenceCollection(callback?: (err: AWSError, data: Location.Types.CreateGeofenceCollectionResponse) => void): Request<Location.Types.CreateGeofenceCollectionResponse, AWSError>;
  /**
   * Creates an API key resource in your Amazon Web Services account, which lets you grant actions for Amazon Location resources to the API key bearer.  For more information, see Using API keys. 
   */
  createKey(params: Location.Types.CreateKeyRequest, callback?: (err: AWSError, data: Location.Types.CreateKeyResponse) => void): Request<Location.Types.CreateKeyResponse, AWSError>;
  /**
   * Creates an API key resource in your Amazon Web Services account, which lets you grant actions for Amazon Location resources to the API key bearer.  For more information, see Using API keys. 
   */
  createKey(callback?: (err: AWSError, data: Location.Types.CreateKeyResponse) => void): Request<Location.Types.CreateKeyResponse, AWSError>;
  /**
   * Creates a map resource in your Amazon Web Services account, which provides map tiles of different styles sourced from global location data providers.  If your application is tracking or routing assets you use in your business, such as delivery vehicles or employees, you must not use Esri as your geolocation provider. See section 82 of the Amazon Web Services service terms for more details. 
   */
  createMap(params: Location.Types.CreateMapRequest, callback?: (err: AWSError, data: Location.Types.CreateMapResponse) => void): Request<Location.Types.CreateMapResponse, AWSError>;
  /**
   * Creates a map resource in your Amazon Web Services account, which provides map tiles of different styles sourced from global location data providers.  If your application is tracking or routing assets you use in your business, such as delivery vehicles or employees, you must not use Esri as your geolocation provider. See section 82 of the Amazon Web Services service terms for more details. 
   */
  createMap(callback?: (err: AWSError, data: Location.Types.CreateMapResponse) => void): Request<Location.Types.CreateMapResponse, AWSError>;
  /**
   * Creates a place index resource in your Amazon Web Services account. Use a place index resource to geocode addresses and other text queries by using the SearchPlaceIndexForText operation, and reverse geocode coordinates by using the SearchPlaceIndexForPosition operation, and enable autosuggestions by using the SearchPlaceIndexForSuggestions operation.  If your application is tracking or routing assets you use in your business, such as delivery vehicles or employees, you must not use Esri as your geolocation provider. See section 82 of the Amazon Web Services service terms for more details. 
   */
  createPlaceIndex(params: Location.Types.CreatePlaceIndexRequest, callback?: (err: AWSError, data: Location.Types.CreatePlaceIndexResponse) => void): Request<Location.Types.CreatePlaceIndexResponse, AWSError>;
  /**
   * Creates a place index resource in your Amazon Web Services account. Use a place index resource to geocode addresses and other text queries by using the SearchPlaceIndexForText operation, and reverse geocode coordinates by using the SearchPlaceIndexForPosition operation, and enable autosuggestions by using the SearchPlaceIndexForSuggestions operation.  If your application is tracking or routing assets you use in your business, such as delivery vehicles or employees, you must not use Esri as your geolocation provider. See section 82 of the Amazon Web Services service terms for more details. 
   */
  createPlaceIndex(callback?: (err: AWSError, data: Location.Types.CreatePlaceIndexResponse) => void): Request<Location.Types.CreatePlaceIndexResponse, AWSError>;
  /**
   * Creates a route calculator resource in your Amazon Web Services account. You can send requests to a route calculator resource to estimate travel time, distance, and get directions. A route calculator sources traffic and road network data from your chosen data provider.  If your application is tracking or routing assets you use in your business, such as delivery vehicles or employees, you must not use Esri as your geolocation provider. See section 82 of the Amazon Web Services service terms for more details. 
   */
  createRouteCalculator(params: Location.Types.CreateRouteCalculatorRequest, callback?: (err: AWSError, data: Location.Types.CreateRouteCalculatorResponse) => void): Request<Location.Types.CreateRouteCalculatorResponse, AWSError>;
  /**
   * Creates a route calculator resource in your Amazon Web Services account. You can send requests to a route calculator resource to estimate travel time, distance, and get directions. A route calculator sources traffic and road network data from your chosen data provider.  If your application is tracking or routing assets you use in your business, such as delivery vehicles or employees, you must not use Esri as your geolocation provider. See section 82 of the Amazon Web Services service terms for more details. 
   */
  createRouteCalculator(callback?: (err: AWSError, data: Location.Types.CreateRouteCalculatorResponse) => void): Request<Location.Types.CreateRouteCalculatorResponse, AWSError>;
  /**
   * Creates a tracker resource in your Amazon Web Services account, which lets you retrieve current and historical location of devices.
   */
  createTracker(params: Location.Types.CreateTrackerRequest, callback?: (err: AWSError, data: Location.Types.CreateTrackerResponse) => void): Request<Location.Types.CreateTrackerResponse, AWSError>;
  /**
   * Creates a tracker resource in your Amazon Web Services account, which lets you retrieve current and historical location of devices.
   */
  createTracker(callback?: (err: AWSError, data: Location.Types.CreateTrackerResponse) => void): Request<Location.Types.CreateTrackerResponse, AWSError>;
  /**
   * Deletes a geofence collection from your Amazon Web Services account.  This operation deletes the resource permanently. If the geofence collection is the target of a tracker resource, the devices will no longer be monitored. 
   */
  deleteGeofenceCollection(params: Location.Types.DeleteGeofenceCollectionRequest, callback?: (err: AWSError, data: Location.Types.DeleteGeofenceCollectionResponse) => void): Request<Location.Types.DeleteGeofenceCollectionResponse, AWSError>;
  /**
   * Deletes a geofence collection from your Amazon Web Services account.  This operation deletes the resource permanently. If the geofence collection is the target of a tracker resource, the devices will no longer be monitored. 
   */
  deleteGeofenceCollection(callback?: (err: AWSError, data: Location.Types.DeleteGeofenceCollectionResponse) => void): Request<Location.Types.DeleteGeofenceCollectionResponse, AWSError>;
  /**
   * Deletes the specified API key. The API key must have been deactivated more than 90 days previously.
   */
  deleteKey(params: Location.Types.DeleteKeyRequest, callback?: (err: AWSError, data: Location.Types.DeleteKeyResponse) => void): Request<Location.Types.DeleteKeyResponse, AWSError>;
  /**
   * Deletes the specified API key. The API key must have been deactivated more than 90 days previously.
   */
  deleteKey(callback?: (err: AWSError, data: Location.Types.DeleteKeyResponse) => void): Request<Location.Types.DeleteKeyResponse, AWSError>;
  /**
   * Deletes a map resource from your Amazon Web Services account.  This operation deletes the resource permanently. If the map is being used in an application, the map may not render. 
   */
  deleteMap(params: Location.Types.DeleteMapRequest, callback?: (err: AWSError, data: Location.Types.DeleteMapResponse) => void): Request<Location.Types.DeleteMapResponse, AWSError>;
  /**
   * Deletes a map resource from your Amazon Web Services account.  This operation deletes the resource permanently. If the map is being used in an application, the map may not render. 
   */
  deleteMap(callback?: (err: AWSError, data: Location.Types.DeleteMapResponse) => void): Request<Location.Types.DeleteMapResponse, AWSError>;
  /**
   * Deletes a place index resource from your Amazon Web Services account.  This operation deletes the resource permanently. 
   */
  deletePlaceIndex(params: Location.Types.DeletePlaceIndexRequest, callback?: (err: AWSError, data: Location.Types.DeletePlaceIndexResponse) => void): Request<Location.Types.DeletePlaceIndexResponse, AWSError>;
  /**
   * Deletes a place index resource from your Amazon Web Services account.  This operation deletes the resource permanently. 
   */
  deletePlaceIndex(callback?: (err: AWSError, data: Location.Types.DeletePlaceIndexResponse) => void): Request<Location.Types.DeletePlaceIndexResponse, AWSError>;
  /**
   * Deletes a route calculator resource from your Amazon Web Services account.  This operation deletes the resource permanently. 
   */
  deleteRouteCalculator(params: Location.Types.DeleteRouteCalculatorRequest, callback?: (err: AWSError, data: Location.Types.DeleteRouteCalculatorResponse) => void): Request<Location.Types.DeleteRouteCalculatorResponse, AWSError>;
  /**
   * Deletes a route calculator resource from your Amazon Web Services account.  This operation deletes the resource permanently. 
   */
  deleteRouteCalculator(callback?: (err: AWSError, data: Location.Types.DeleteRouteCalculatorResponse) => void): Request<Location.Types.DeleteRouteCalculatorResponse, AWSError>;
  /**
   * Deletes a tracker resource from your Amazon Web Services account.  This operation deletes the resource permanently. If the tracker resource is in use, you may encounter an error. Make sure that the target resource isn't a dependency for your applications. 
   */
  deleteTracker(params: Location.Types.DeleteTrackerRequest, callback?: (err: AWSError, data: Location.Types.DeleteTrackerResponse) => void): Request<Location.Types.DeleteTrackerResponse, AWSError>;
  /**
   * Deletes a tracker resource from your Amazon Web Services account.  This operation deletes the resource permanently. If the tracker resource is in use, you may encounter an error. Make sure that the target resource isn't a dependency for your applications. 
   */
  deleteTracker(callback?: (err: AWSError, data: Location.Types.DeleteTrackerResponse) => void): Request<Location.Types.DeleteTrackerResponse, AWSError>;
  /**
   * Retrieves the geofence collection details.
   */
  describeGeofenceCollection(params: Location.Types.DescribeGeofenceCollectionRequest, callback?: (err: AWSError, data: Location.Types.DescribeGeofenceCollectionResponse) => void): Request<Location.Types.DescribeGeofenceCollectionResponse, AWSError>;
  /**
   * Retrieves the geofence collection details.
   */
  describeGeofenceCollection(callback?: (err: AWSError, data: Location.Types.DescribeGeofenceCollectionResponse) => void): Request<Location.Types.DescribeGeofenceCollectionResponse, AWSError>;
  /**
   * Retrieves the API key resource details.
   */
  describeKey(params: Location.Types.DescribeKeyRequest, callback?: (err: AWSError, data: Location.Types.DescribeKeyResponse) => void): Request<Location.Types.DescribeKeyResponse, AWSError>;
  /**
   * Retrieves the API key resource details.
   */
  describeKey(callback?: (err: AWSError, data: Location.Types.DescribeKeyResponse) => void): Request<Location.Types.DescribeKeyResponse, AWSError>;
  /**
   * Retrieves the map resource details.
   */
  describeMap(params: Location.Types.DescribeMapRequest, callback?: (err: AWSError, data: Location.Types.DescribeMapResponse) => void): Request<Location.Types.DescribeMapResponse, AWSError>;
  /**
   * Retrieves the map resource details.
   */
  describeMap(callback?: (err: AWSError, data: Location.Types.DescribeMapResponse) => void): Request<Location.Types.DescribeMapResponse, AWSError>;
  /**
   * Retrieves the place index resource details.
   */
  describePlaceIndex(params: Location.Types.DescribePlaceIndexRequest, callback?: (err: AWSError, data: Location.Types.DescribePlaceIndexResponse) => void): Request<Location.Types.DescribePlaceIndexResponse, AWSError>;
  /**
   * Retrieves the place index resource details.
   */
  describePlaceIndex(callback?: (err: AWSError, data: Location.Types.DescribePlaceIndexResponse) => void): Request<Location.Types.DescribePlaceIndexResponse, AWSError>;
  /**
   * Retrieves the route calculator resource details.
   */
  describeRouteCalculator(params: Location.Types.DescribeRouteCalculatorRequest, callback?: (err: AWSError, data: Location.Types.DescribeRouteCalculatorResponse) => void): Request<Location.Types.DescribeRouteCalculatorResponse, AWSError>;
  /**
   * Retrieves the route calculator resource details.
   */
  describeRouteCalculator(callback?: (err: AWSError, data: Location.Types.DescribeRouteCalculatorResponse) => void): Request<Location.Types.DescribeRouteCalculatorResponse, AWSError>;
  /**
   * Retrieves the tracker resource details.
   */
  describeTracker(params: Location.Types.DescribeTrackerRequest, callback?: (err: AWSError, data: Location.Types.DescribeTrackerResponse) => void): Request<Location.Types.DescribeTrackerResponse, AWSError>;
  /**
   * Retrieves the tracker resource details.
   */
  describeTracker(callback?: (err: AWSError, data: Location.Types.DescribeTrackerResponse) => void): Request<Location.Types.DescribeTrackerResponse, AWSError>;
  /**
   * Removes the association between a tracker resource and a geofence collection.  Once you unlink a tracker resource from a geofence collection, the tracker positions will no longer be automatically evaluated against geofences. 
   */
  disassociateTrackerConsumer(params: Location.Types.DisassociateTrackerConsumerRequest, callback?: (err: AWSError, data: Location.Types.DisassociateTrackerConsumerResponse) => void): Request<Location.Types.DisassociateTrackerConsumerResponse, AWSError>;
  /**
   * Removes the association between a tracker resource and a geofence collection.  Once you unlink a tracker resource from a geofence collection, the tracker positions will no longer be automatically evaluated against geofences. 
   */
  disassociateTrackerConsumer(callback?: (err: AWSError, data: Location.Types.DisassociateTrackerConsumerResponse) => void): Request<Location.Types.DisassociateTrackerConsumerResponse, AWSError>;
  /**
   * Retrieves a device's most recent position according to its sample time.  Device positions are deleted after 30 days. 
   */
  getDevicePosition(params: Location.Types.GetDevicePositionRequest, callback?: (err: AWSError, data: Location.Types.GetDevicePositionResponse) => void): Request<Location.Types.GetDevicePositionResponse, AWSError>;
  /**
   * Retrieves a device's most recent position according to its sample time.  Device positions are deleted after 30 days. 
   */
  getDevicePosition(callback?: (err: AWSError, data: Location.Types.GetDevicePositionResponse) => void): Request<Location.Types.GetDevicePositionResponse, AWSError>;
  /**
   * Retrieves the device position history from a tracker resource within a specified range of time.  Device positions are deleted after 30 days. 
   */
  getDevicePositionHistory(params: Location.Types.GetDevicePositionHistoryRequest, callback?: (err: AWSError, data: Location.Types.GetDevicePositionHistoryResponse) => void): Request<Location.Types.GetDevicePositionHistoryResponse, AWSError>;
  /**
   * Retrieves the device position history from a tracker resource within a specified range of time.  Device positions are deleted after 30 days. 
   */
  getDevicePositionHistory(callback?: (err: AWSError, data: Location.Types.GetDevicePositionHistoryResponse) => void): Request<Location.Types.GetDevicePositionHistoryResponse, AWSError>;
  /**
   * Retrieves the geofence details from a geofence collection.
   */
  getGeofence(params: Location.Types.GetGeofenceRequest, callback?: (err: AWSError, data: Location.Types.GetGeofenceResponse) => void): Request<Location.Types.GetGeofenceResponse, AWSError>;
  /**
   * Retrieves the geofence details from a geofence collection.
   */
  getGeofence(callback?: (err: AWSError, data: Location.Types.GetGeofenceResponse) => void): Request<Location.Types.GetGeofenceResponse, AWSError>;
  /**
   * Retrieves glyphs used to display labels on a map.
   */
  getMapGlyphs(params: Location.Types.GetMapGlyphsRequest, callback?: (err: AWSError, data: Location.Types.GetMapGlyphsResponse) => void): Request<Location.Types.GetMapGlyphsResponse, AWSError>;
  /**
   * Retrieves glyphs used to display labels on a map.
   */
  getMapGlyphs(callback?: (err: AWSError, data: Location.Types.GetMapGlyphsResponse) => void): Request<Location.Types.GetMapGlyphsResponse, AWSError>;
  /**
   * Retrieves the sprite sheet corresponding to a map resource. The sprite sheet is a PNG image paired with a JSON document describing the offsets of individual icons that will be displayed on a rendered map.
   */
  getMapSprites(params: Location.Types.GetMapSpritesRequest, callback?: (err: AWSError, data: Location.Types.GetMapSpritesResponse) => void): Request<Location.Types.GetMapSpritesResponse, AWSError>;
  /**
   * Retrieves the sprite sheet corresponding to a map resource. The sprite sheet is a PNG image paired with a JSON document describing the offsets of individual icons that will be displayed on a rendered map.
   */
  getMapSprites(callback?: (err: AWSError, data: Location.Types.GetMapSpritesResponse) => void): Request<Location.Types.GetMapSpritesResponse, AWSError>;
  /**
   * Retrieves the map style descriptor from a map resource.  The style descriptor contains speciﬁcations on how features render on a map. For example, what data to display, what order to display the data in, and the style for the data. Style descriptors follow the Mapbox Style Specification.
   */
  getMapStyleDescriptor(params: Location.Types.GetMapStyleDescriptorRequest, callback?: (err: AWSError, data: Location.Types.GetMapStyleDescriptorResponse) => void): Request<Location.Types.GetMapStyleDescriptorResponse, AWSError>;
  /**
   * Retrieves the map style descriptor from a map resource.  The style descriptor contains speciﬁcations on how features render on a map. For example, what data to display, what order to display the data in, and the style for the data. Style descriptors follow the Mapbox Style Specification.
   */
  getMapStyleDescriptor(callback?: (err: AWSError, data: Location.Types.GetMapStyleDescriptorResponse) => void): Request<Location.Types.GetMapStyleDescriptorResponse, AWSError>;
  /**
   * Retrieves a vector data tile from the map resource. Map tiles are used by clients to render a map. they're addressed using a grid arrangement with an X coordinate, Y coordinate, and Z (zoom) level.  The origin (0, 0) is the top left of the map. Increasing the zoom level by 1 doubles both the X and Y dimensions, so a tile containing data for the entire world at (0/0/0) will be split into 4 tiles at zoom 1 (1/0/0, 1/0/1, 1/1/0, 1/1/1).
   */
  getMapTile(params: Location.Types.GetMapTileRequest, callback?: (err: AWSError, data: Location.Types.GetMapTileResponse) => void): Request<Location.Types.GetMapTileResponse, AWSError>;
  /**
   * Retrieves a vector data tile from the map resource. Map tiles are used by clients to render a map. they're addressed using a grid arrangement with an X coordinate, Y coordinate, and Z (zoom) level.  The origin (0, 0) is the top left of the map. Increasing the zoom level by 1 doubles both the X and Y dimensions, so a tile containing data for the entire world at (0/0/0) will be split into 4 tiles at zoom 1 (1/0/0, 1/0/1, 1/1/0, 1/1/1).
   */
  getMapTile(callback?: (err: AWSError, data: Location.Types.GetMapTileResponse) => void): Request<Location.Types.GetMapTileResponse, AWSError>;
  /**
   * Finds a place by its unique ID. A PlaceId is returned by other search operations.  A PlaceId is valid only if all of the following are the same in the original search request and the call to GetPlace.   Customer Amazon Web Services account   Amazon Web Services Region   Data provider specified in the place index resource   
   */
  getPlace(params: Location.Types.GetPlaceRequest, callback?: (err: AWSError, data: Location.Types.GetPlaceResponse) => void): Request<Location.Types.GetPlaceResponse, AWSError>;
  /**
   * Finds a place by its unique ID. A PlaceId is returned by other search operations.  A PlaceId is valid only if all of the following are the same in the original search request and the call to GetPlace.   Customer Amazon Web Services account   Amazon Web Services Region   Data provider specified in the place index resource   
   */
  getPlace(callback?: (err: AWSError, data: Location.Types.GetPlaceResponse) => void): Request<Location.Types.GetPlaceResponse, AWSError>;
  /**
   * A batch request to retrieve all device positions.
   */
  listDevicePositions(params: Location.Types.ListDevicePositionsRequest, callback?: (err: AWSError, data: Location.Types.ListDevicePositionsResponse) => void): Request<Location.Types.ListDevicePositionsResponse, AWSError>;
  /**
   * A batch request to retrieve all device positions.
   */
  listDevicePositions(callback?: (err: AWSError, data: Location.Types.ListDevicePositionsResponse) => void): Request<Location.Types.ListDevicePositionsResponse, AWSError>;
  /**
   * Lists geofence collections in your Amazon Web Services account.
   */
  listGeofenceCollections(params: Location.Types.ListGeofenceCollectionsRequest, callback?: (err: AWSError, data: Location.Types.ListGeofenceCollectionsResponse) => void): Request<Location.Types.ListGeofenceCollectionsResponse, AWSError>;
  /**
   * Lists geofence collections in your Amazon Web Services account.
   */
  listGeofenceCollections(callback?: (err: AWSError, data: Location.Types.ListGeofenceCollectionsResponse) => void): Request<Location.Types.ListGeofenceCollectionsResponse, AWSError>;
  /**
   * Lists geofences stored in a given geofence collection.
   */
  listGeofences(params: Location.Types.ListGeofencesRequest, callback?: (err: AWSError, data: Location.Types.ListGeofencesResponse) => void): Request<Location.Types.ListGeofencesResponse, AWSError>;
  /**
   * Lists geofences stored in a given geofence collection.
   */
  listGeofences(callback?: (err: AWSError, data: Location.Types.ListGeofencesResponse) => void): Request<Location.Types.ListGeofencesResponse, AWSError>;
  /**
   * Lists API key resources in your Amazon Web Services account.
   */
  listKeys(params: Location.Types.ListKeysRequest, callback?: (err: AWSError, data: Location.Types.ListKeysResponse) => void): Request<Location.Types.ListKeysResponse, AWSError>;
  /**
   * Lists API key resources in your Amazon Web Services account.
   */
  listKeys(callback?: (err: AWSError, data: Location.Types.ListKeysResponse) => void): Request<Location.Types.ListKeysResponse, AWSError>;
  /**
   * Lists map resources in your Amazon Web Services account.
   */
  listMaps(params: Location.Types.ListMapsRequest, callback?: (err: AWSError, data: Location.Types.ListMapsResponse) => void): Request<Location.Types.ListMapsResponse, AWSError>;
  /**
   * Lists map resources in your Amazon Web Services account.
   */
  listMaps(callback?: (err: AWSError, data: Location.Types.ListMapsResponse) => void): Request<Location.Types.ListMapsResponse, AWSError>;
  /**
   * Lists place index resources in your Amazon Web Services account.
   */
  listPlaceIndexes(params: Location.Types.ListPlaceIndexesRequest, callback?: (err: AWSError, data: Location.Types.ListPlaceIndexesResponse) => void): Request<Location.Types.ListPlaceIndexesResponse, AWSError>;
  /**
   * Lists place index resources in your Amazon Web Services account.
   */
  listPlaceIndexes(callback?: (err: AWSError, data: Location.Types.ListPlaceIndexesResponse) => void): Request<Location.Types.ListPlaceIndexesResponse, AWSError>;
  /**
   * Lists route calculator resources in your Amazon Web Services account.
   */
  listRouteCalculators(params: Location.Types.ListRouteCalculatorsRequest, callback?: (err: AWSError, data: Location.Types.ListRouteCalculatorsResponse) => void): Request<Location.Types.ListRouteCalculatorsResponse, AWSError>;
  /**
   * Lists route calculator resources in your Amazon Web Services account.
   */
  listRouteCalculators(callback?: (err: AWSError, data: Location.Types.ListRouteCalculatorsResponse) => void): Request<Location.Types.ListRouteCalculatorsResponse, AWSError>;
  /**
   * Returns a list of tags that are applied to the specified Amazon Location resource.
   */
  listTagsForResource(params: Location.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Location.Types.ListTagsForResourceResponse) => void): Request<Location.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns a list of tags that are applied to the specified Amazon Location resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Location.Types.ListTagsForResourceResponse) => void): Request<Location.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists geofence collections currently associated to the given tracker resource.
   */
  listTrackerConsumers(params: Location.Types.ListTrackerConsumersRequest, callback?: (err: AWSError, data: Location.Types.ListTrackerConsumersResponse) => void): Request<Location.Types.ListTrackerConsumersResponse, AWSError>;
  /**
   * Lists geofence collections currently associated to the given tracker resource.
   */
  listTrackerConsumers(callback?: (err: AWSError, data: Location.Types.ListTrackerConsumersResponse) => void): Request<Location.Types.ListTrackerConsumersResponse, AWSError>;
  /**
   * Lists tracker resources in your Amazon Web Services account.
   */
  listTrackers(params: Location.Types.ListTrackersRequest, callback?: (err: AWSError, data: Location.Types.ListTrackersResponse) => void): Request<Location.Types.ListTrackersResponse, AWSError>;
  /**
   * Lists tracker resources in your Amazon Web Services account.
   */
  listTrackers(callback?: (err: AWSError, data: Location.Types.ListTrackersResponse) => void): Request<Location.Types.ListTrackersResponse, AWSError>;
  /**
   * Stores a geofence geometry in a given geofence collection, or updates the geometry of an existing geofence if a geofence ID is included in the request. 
   */
  putGeofence(params: Location.Types.PutGeofenceRequest, callback?: (err: AWSError, data: Location.Types.PutGeofenceResponse) => void): Request<Location.Types.PutGeofenceResponse, AWSError>;
  /**
   * Stores a geofence geometry in a given geofence collection, or updates the geometry of an existing geofence if a geofence ID is included in the request. 
   */
  putGeofence(callback?: (err: AWSError, data: Location.Types.PutGeofenceResponse) => void): Request<Location.Types.PutGeofenceResponse, AWSError>;
  /**
   * Reverse geocodes a given coordinate and returns a legible address. Allows you to search for Places or points of interest near a given position.
   */
  searchPlaceIndexForPosition(params: Location.Types.SearchPlaceIndexForPositionRequest, callback?: (err: AWSError, data: Location.Types.SearchPlaceIndexForPositionResponse) => void): Request<Location.Types.SearchPlaceIndexForPositionResponse, AWSError>;
  /**
   * Reverse geocodes a given coordinate and returns a legible address. Allows you to search for Places or points of interest near a given position.
   */
  searchPlaceIndexForPosition(callback?: (err: AWSError, data: Location.Types.SearchPlaceIndexForPositionResponse) => void): Request<Location.Types.SearchPlaceIndexForPositionResponse, AWSError>;
  /**
   * Generates suggestions for addresses and points of interest based on partial or misspelled free-form text. This operation is also known as autocomplete, autosuggest, or fuzzy matching. Optional parameters let you narrow your search results by bounding box or country, or bias your search toward a specific position on the globe.  You can search for suggested place names near a specified position by using BiasPosition, or filter results within a bounding box by using FilterBBox. These parameters are mutually exclusive; using both BiasPosition and FilterBBox in the same command returns an error. 
   */
  searchPlaceIndexForSuggestions(params: Location.Types.SearchPlaceIndexForSuggestionsRequest, callback?: (err: AWSError, data: Location.Types.SearchPlaceIndexForSuggestionsResponse) => void): Request<Location.Types.SearchPlaceIndexForSuggestionsResponse, AWSError>;
  /**
   * Generates suggestions for addresses and points of interest based on partial or misspelled free-form text. This operation is also known as autocomplete, autosuggest, or fuzzy matching. Optional parameters let you narrow your search results by bounding box or country, or bias your search toward a specific position on the globe.  You can search for suggested place names near a specified position by using BiasPosition, or filter results within a bounding box by using FilterBBox. These parameters are mutually exclusive; using both BiasPosition and FilterBBox in the same command returns an error. 
   */
  searchPlaceIndexForSuggestions(callback?: (err: AWSError, data: Location.Types.SearchPlaceIndexForSuggestionsResponse) => void): Request<Location.Types.SearchPlaceIndexForSuggestionsResponse, AWSError>;
  /**
   * Geocodes free-form text, such as an address, name, city, or region to allow you to search for Places or points of interest.  Optional parameters let you narrow your search results by bounding box or country, or bias your search toward a specific position on the globe.  You can search for places near a given position using BiasPosition, or filter results within a bounding box using FilterBBox. Providing both parameters simultaneously returns an error.  Search results are returned in order of highest to lowest relevance.
   */
  searchPlaceIndexForText(params: Location.Types.SearchPlaceIndexForTextRequest, callback?: (err: AWSError, data: Location.Types.SearchPlaceIndexForTextResponse) => void): Request<Location.Types.SearchPlaceIndexForTextResponse, AWSError>;
  /**
   * Geocodes free-form text, such as an address, name, city, or region to allow you to search for Places or points of interest.  Optional parameters let you narrow your search results by bounding box or country, or bias your search toward a specific position on the globe.  You can search for places near a given position using BiasPosition, or filter results within a bounding box using FilterBBox. Providing both parameters simultaneously returns an error.  Search results are returned in order of highest to lowest relevance.
   */
  searchPlaceIndexForText(callback?: (err: AWSError, data: Location.Types.SearchPlaceIndexForTextResponse) => void): Request<Location.Types.SearchPlaceIndexForTextResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified Amazon Location Service resource. Tags can help you organize and categorize your resources. You can also use them to scope user permissions, by granting a user permission to access or change only resources with certain tag values. You can use the TagResource operation with an Amazon Location Service resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the tags already associated with the resource. If you specify a tag key that's already associated with the resource, the new tag value that you specify replaces the previous value for that tag.  You can associate up to 50 tags with a resource.
   */
  tagResource(params: Location.Types.TagResourceRequest, callback?: (err: AWSError, data: Location.Types.TagResourceResponse) => void): Request<Location.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified Amazon Location Service resource. Tags can help you organize and categorize your resources. You can also use them to scope user permissions, by granting a user permission to access or change only resources with certain tag values. You can use the TagResource operation with an Amazon Location Service resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the tags already associated with the resource. If you specify a tag key that's already associated with the resource, the new tag value that you specify replaces the previous value for that tag.  You can associate up to 50 tags with a resource.
   */
  tagResource(callback?: (err: AWSError, data: Location.Types.TagResourceResponse) => void): Request<Location.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified Amazon Location resource.
   */
  untagResource(params: Location.Types.UntagResourceRequest, callback?: (err: AWSError, data: Location.Types.UntagResourceResponse) => void): Request<Location.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified Amazon Location resource.
   */
  untagResource(callback?: (err: AWSError, data: Location.Types.UntagResourceResponse) => void): Request<Location.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the specified properties of a given geofence collection.
   */
  updateGeofenceCollection(params: Location.Types.UpdateGeofenceCollectionRequest, callback?: (err: AWSError, data: Location.Types.UpdateGeofenceCollectionResponse) => void): Request<Location.Types.UpdateGeofenceCollectionResponse, AWSError>;
  /**
   * Updates the specified properties of a given geofence collection.
   */
  updateGeofenceCollection(callback?: (err: AWSError, data: Location.Types.UpdateGeofenceCollectionResponse) => void): Request<Location.Types.UpdateGeofenceCollectionResponse, AWSError>;
  /**
   * Updates the specified properties of a given API key resource.
   */
  updateKey(params: Location.Types.UpdateKeyRequest, callback?: (err: AWSError, data: Location.Types.UpdateKeyResponse) => void): Request<Location.Types.UpdateKeyResponse, AWSError>;
  /**
   * Updates the specified properties of a given API key resource.
   */
  updateKey(callback?: (err: AWSError, data: Location.Types.UpdateKeyResponse) => void): Request<Location.Types.UpdateKeyResponse, AWSError>;
  /**
   * Updates the specified properties of a given map resource.
   */
  updateMap(params: Location.Types.UpdateMapRequest, callback?: (err: AWSError, data: Location.Types.UpdateMapResponse) => void): Request<Location.Types.UpdateMapResponse, AWSError>;
  /**
   * Updates the specified properties of a given map resource.
   */
  updateMap(callback?: (err: AWSError, data: Location.Types.UpdateMapResponse) => void): Request<Location.Types.UpdateMapResponse, AWSError>;
  /**
   * Updates the specified properties of a given place index resource.
   */
  updatePlaceIndex(params: Location.Types.UpdatePlaceIndexRequest, callback?: (err: AWSError, data: Location.Types.UpdatePlaceIndexResponse) => void): Request<Location.Types.UpdatePlaceIndexResponse, AWSError>;
  /**
   * Updates the specified properties of a given place index resource.
   */
  updatePlaceIndex(callback?: (err: AWSError, data: Location.Types.UpdatePlaceIndexResponse) => void): Request<Location.Types.UpdatePlaceIndexResponse, AWSError>;
  /**
   * Updates the specified properties for a given route calculator resource.
   */
  updateRouteCalculator(params: Location.Types.UpdateRouteCalculatorRequest, callback?: (err: AWSError, data: Location.Types.UpdateRouteCalculatorResponse) => void): Request<Location.Types.UpdateRouteCalculatorResponse, AWSError>;
  /**
   * Updates the specified properties for a given route calculator resource.
   */
  updateRouteCalculator(callback?: (err: AWSError, data: Location.Types.UpdateRouteCalculatorResponse) => void): Request<Location.Types.UpdateRouteCalculatorResponse, AWSError>;
  /**
   * Updates the specified properties of a given tracker resource.
   */
  updateTracker(params: Location.Types.UpdateTrackerRequest, callback?: (err: AWSError, data: Location.Types.UpdateTrackerResponse) => void): Request<Location.Types.UpdateTrackerResponse, AWSError>;
  /**
   * Updates the specified properties of a given tracker resource.
   */
  updateTracker(callback?: (err: AWSError, data: Location.Types.UpdateTrackerResponse) => void): Request<Location.Types.UpdateTrackerResponse, AWSError>;
}
declare namespace Location {
  export type ApiKey = string;
  export type ApiKeyAction = string;
  export interface ApiKeyFilter {
    /**
     * Filter on Active or Expired API keys.
     */
    KeyStatus?: Status;
  }
  export interface ApiKeyRestrictions {
    /**
     * A list of allowed actions that an API key resource grants permissions to perform. You must have at least one action for each type of resource. For example, if you have a place resource, you must include at least one place action. The following are valid values for the actions.    Map actions     geo:GetMap* - Allows all actions needed for map rendering.      Place actions     geo:SearchPlaceIndexForText - Allows geocoding.    geo:SearchPlaceIndexForPosition - Allows reverse geocoding.    geo:SearchPlaceIndexForSuggestions - Allows generating suggestions from text.    GetPlace - Allows finding a place by place ID.      Route actions     geo:CalculateRoute - Allows point to point routing.    geo:CalculateRouteMatrix - Allows calculating a matrix of routes.      You must use these strings exactly. For example, to provide access to map rendering, the only valid action is geo:GetMap* as an input to the list. ["geo:GetMap*"] is valid but ["geo:GetMapTile"] is not. Similarly, you cannot use ["geo:SearchPlaceIndexFor*"] - you must list each of the Place actions separately. 
     */
    AllowActions: ApiKeyRestrictionsAllowActionsList;
    /**
     * An optional list of allowed HTTP referers for which requests must originate from. Requests using this API key from other domains will not be allowed. Requirements:   Contain only alphanumeric characters (A–Z, a–z, 0–9) or any symbols in this list $\-._+!*`(),;/?:@=&amp;    May contain a percent (%) if followed by 2 hexadecimal digits (A-F, a-f, 0-9); this is used for URL encoding purposes.   May contain wildcard characters question mark (?) and asterisk (*). Question mark (?) will replace any single character (including hexadecimal digits). Asterisk (*) will replace any multiple characters (including multiple hexadecimal digits).   No spaces allowed. For example, https://example.com.  
     */
    AllowReferers?: ApiKeyRestrictionsAllowReferersList;
    /**
     * A list of allowed resource ARNs that a API key bearer can perform actions on.   The ARN must be the correct ARN for a map, place, or route ARN. You may include wildcards in the resource-id to match multiple resources of the same type.   The resources must be in the same partition, region, and account-id as the key that is being created.   Other than wildcards, you must include the full ARN, including the arn, partition, service, region, account-id and resource-id, delimited by colons (:).   No spaces allowed, even with wildcards. For example, arn:aws:geo:region:account-id:map/ExampleMap*.   For more information about ARN format, see Amazon Resource Names (ARNs).
     */
    AllowResources: ApiKeyRestrictionsAllowResourcesList;
  }
  export type ApiKeyRestrictionsAllowActionsList = ApiKeyAction[];
  export type ApiKeyRestrictionsAllowReferersList = RefererPattern[];
  export type ApiKeyRestrictionsAllowResourcesList = GeoArn[];
  export type Arn = string;
  export type ArnList = Arn[];
  export interface AssociateTrackerConsumerRequest {
    /**
     * The Amazon Resource Name (ARN) for the geofence collection to be associated to tracker resource. Used when you need to specify a resource across all Amazon Web Services.   Format example: arn:aws:geo:region:account-id:geofence-collection/ExampleGeofenceCollectionConsumer   
     */
    ConsumerArn: Arn;
    /**
     * The name of the tracker resource to be associated with a geofence collection.
     */
    TrackerName: ResourceName;
  }
  export interface AssociateTrackerConsumerResponse {
  }
  export interface BatchDeleteDevicePositionHistoryError {
    /**
     * The ID of the device for this position.
     */
    DeviceId: Id;
    Error: BatchItemError;
  }
  export type BatchDeleteDevicePositionHistoryErrorList = BatchDeleteDevicePositionHistoryError[];
  export interface BatchDeleteDevicePositionHistoryRequest {
    /**
     * Devices whose position history you want to delete.   For example, for two devices: “DeviceIds” : [DeviceId1,DeviceId2]   
     */
    DeviceIds: BatchDeleteDevicePositionHistoryRequestDeviceIdsList;
    /**
     * The name of the tracker resource to delete the device position history from.
     */
    TrackerName: ResourceName;
  }
  export type BatchDeleteDevicePositionHistoryRequestDeviceIdsList = Id[];
  export interface BatchDeleteDevicePositionHistoryResponse {
    /**
     * Contains error details for each device history that failed to delete.
     */
    Errors: BatchDeleteDevicePositionHistoryErrorList;
  }
  export interface BatchDeleteGeofenceError {
    /**
     * Contains details associated to the batch error.
     */
    Error: BatchItemError;
    /**
     * The geofence associated with the error message.
     */
    GeofenceId: Id;
  }
  export type BatchDeleteGeofenceErrorList = BatchDeleteGeofenceError[];
  export interface BatchDeleteGeofenceRequest {
    /**
     * The geofence collection storing the geofences to be deleted.
     */
    CollectionName: ResourceName;
    /**
     * The batch of geofences to be deleted.
     */
    GeofenceIds: BatchDeleteGeofenceRequestGeofenceIdsList;
  }
  export type BatchDeleteGeofenceRequestGeofenceIdsList = Id[];
  export interface BatchDeleteGeofenceResponse {
    /**
     * Contains error details for each geofence that failed to delete.
     */
    Errors: BatchDeleteGeofenceErrorList;
  }
  export interface BatchEvaluateGeofencesError {
    /**
     * The device associated with the position evaluation error.
     */
    DeviceId: Id;
    /**
     * Contains details associated to the batch error.
     */
    Error: BatchItemError;
    /**
     * Specifies a timestamp for when the error occurred in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ 
     */
    SampleTime: Timestamp;
  }
  export type BatchEvaluateGeofencesErrorList = BatchEvaluateGeofencesError[];
  export interface BatchEvaluateGeofencesRequest {
    /**
     * The geofence collection used in evaluating the position of devices against its geofences.
     */
    CollectionName: ResourceName;
    /**
     * Contains device details for each device to be evaluated against the given geofence collection.
     */
    DevicePositionUpdates: BatchEvaluateGeofencesRequestDevicePositionUpdatesList;
  }
  export type BatchEvaluateGeofencesRequestDevicePositionUpdatesList = DevicePositionUpdate[];
  export interface BatchEvaluateGeofencesResponse {
    /**
     * Contains error details for each device that failed to evaluate its position against the given geofence collection.
     */
    Errors: BatchEvaluateGeofencesErrorList;
  }
  export interface BatchGetDevicePositionError {
    /**
     * The ID of the device that didn't return a position.
     */
    DeviceId: Id;
    /**
     * Contains details related to the error code.
     */
    Error: BatchItemError;
  }
  export type BatchGetDevicePositionErrorList = BatchGetDevicePositionError[];
  export interface BatchGetDevicePositionRequest {
    /**
     * Devices whose position you want to retrieve.   For example, for two devices: device-ids=DeviceId1&amp;device-ids=DeviceId2   
     */
    DeviceIds: BatchGetDevicePositionRequestDeviceIdsList;
    /**
     * The tracker resource retrieving the device position.
     */
    TrackerName: BatchGetDevicePositionRequestTrackerNameString;
  }
  export type BatchGetDevicePositionRequestDeviceIdsList = Id[];
  export type BatchGetDevicePositionRequestTrackerNameString = string;
  export interface BatchGetDevicePositionResponse {
    /**
     * Contains device position details such as the device ID, position, and timestamps for when the position was received and sampled.
     */
    DevicePositions: DevicePositionList;
    /**
     * Contains error details for each device that failed to send its position to the tracker resource.
     */
    Errors: BatchGetDevicePositionErrorList;
  }
  export interface BatchItemError {
    /**
     * The error code associated with the batch request error.
     */
    Code?: BatchItemErrorCode;
    /**
     * A message with the reason for the batch request error.
     */
    Message?: String;
  }
  export type BatchItemErrorCode = "AccessDeniedError"|"ConflictError"|"InternalServerError"|"ResourceNotFoundError"|"ThrottlingError"|"ValidationError"|string;
  export interface BatchPutGeofenceError {
    /**
     * Contains details associated to the batch error.
     */
    Error: BatchItemError;
    /**
     * The geofence associated with the error message.
     */
    GeofenceId: Id;
  }
  export type BatchPutGeofenceErrorList = BatchPutGeofenceError[];
  export interface BatchPutGeofenceRequest {
    /**
     * The geofence collection storing the geofences.
     */
    CollectionName: ResourceName;
    /**
     * The batch of geofences to be stored in a geofence collection.
     */
    Entries: BatchPutGeofenceRequestEntriesList;
  }
  export type BatchPutGeofenceRequestEntriesList = BatchPutGeofenceRequestEntry[];
  export interface BatchPutGeofenceRequestEntry {
    /**
     * The identifier for the geofence to be stored in a given geofence collection.
     */
    GeofenceId: Id;
    /**
     * Associates one of more properties with the geofence. A property is a key-value pair stored with the geofence and added to any geofence event triggered with that geofence. Format: "key" : "value" 
     */
    GeofenceProperties?: PropertyMap;
    /**
     * Contains the details of the position of the geofence. Can be either a polygon or a circle. Including both will return a validation error.  Each  geofence polygon can have a maximum of 1,000 vertices. 
     */
    Geometry: GeofenceGeometry;
  }
  export interface BatchPutGeofenceResponse {
    /**
     * Contains additional error details for each geofence that failed to be stored in a geofence collection.
     */
    Errors: BatchPutGeofenceErrorList;
    /**
     * Contains each geofence that was successfully stored in a geofence collection.
     */
    Successes: BatchPutGeofenceSuccessList;
  }
  export interface BatchPutGeofenceSuccess {
    /**
     * The timestamp for when the geofence was stored in a geofence collection in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ 
     */
    CreateTime: Timestamp;
    /**
     * The geofence successfully stored in a geofence collection.
     */
    GeofenceId: Id;
    /**
     * The timestamp for when the geofence was last updated in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ 
     */
    UpdateTime: Timestamp;
  }
  export type BatchPutGeofenceSuccessList = BatchPutGeofenceSuccess[];
  export interface BatchUpdateDevicePositionError {
    /**
     * The device associated with the failed location update.
     */
    DeviceId: Id;
    /**
     * Contains details related to the error code such as the error code and error message.
     */
    Error: BatchItemError;
    /**
     * The timestamp at which the device position was determined. Uses  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    SampleTime: Timestamp;
  }
  export type BatchUpdateDevicePositionErrorList = BatchUpdateDevicePositionError[];
  export interface BatchUpdateDevicePositionRequest {
    /**
     * The name of the tracker resource to update.
     */
    TrackerName: ResourceName;
    /**
     * Contains the position update details for each device, up to 10 devices.
     */
    Updates: BatchUpdateDevicePositionRequestUpdatesList;
  }
  export type BatchUpdateDevicePositionRequestUpdatesList = DevicePositionUpdate[];
  export interface BatchUpdateDevicePositionResponse {
    /**
     * Contains error details for each device that failed to update its position.
     */
    Errors: BatchUpdateDevicePositionErrorList;
  }
  export type _Blob = Buffer|Uint8Array|Blob|string;
  export type Boolean = boolean;
  export type BoundingBox = Double[];
  export interface CalculateRouteCarModeOptions {
    /**
     * Avoids ferries when calculating routes. Default Value: false  Valid Values: false | true 
     */
    AvoidFerries?: Boolean;
    /**
     * Avoids tolls when calculating routes. Default Value: false  Valid Values: false | true 
     */
    AvoidTolls?: Boolean;
  }
  export interface CalculateRouteMatrixRequest {
    /**
     * The name of the route calculator resource that you want to use to calculate the route matrix. 
     */
    CalculatorName: ResourceName;
    /**
     * Specifies route preferences when traveling by Car, such as avoiding routes that use ferries or tolls. Requirements: TravelMode must be specified as Car.
     */
    CarModeOptions?: CalculateRouteCarModeOptions;
    /**
     * Sets the time of departure as the current time. Uses the current time to calculate the route matrix. You can't set both DepartureTime and DepartNow. If neither is set, the best time of day to travel with the best traffic conditions is used to calculate the route matrix. Default Value: false  Valid Values: false | true 
     */
    DepartNow?: Boolean;
    /**
     * The list of departure (origin) positions for the route matrix. An array of points, each of which is itself a 2-value array defined in WGS 84 format: [longitude, latitude]. For example, [-123.115, 49.285].  Depending on the data provider selected in the route calculator resource there may be additional restrictions on the inputs you can choose. See  Position restrictions in the Amazon Location Service Developer Guide.   For route calculators that use Esri as the data provider, if you specify a departure that's not located on a road, Amazon Location  moves the position to the nearest road. The snapped value is available in the result in SnappedDeparturePositions.  Valid Values: [-180 to 180,-90 to 90] 
     */
    DeparturePositions: CalculateRouteMatrixRequestDeparturePositionsList;
    /**
     * Specifies the desired time of departure. Uses the given time to calculate the route matrix. You can't set both DepartureTime and DepartNow. If neither is set, the best time of day to travel with the best traffic conditions is used to calculate the route matrix.  Setting a departure time in the past returns a 400 ValidationException error.    In ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. For example, 2020–07-2T12:15:20.000Z+01:00   
     */
    DepartureTime?: Timestamp;
    /**
     * The list of destination positions for the route matrix. An array of points, each of which is itself a 2-value array defined in WGS 84 format: [longitude, latitude]. For example, [-122.339, 47.615]   Depending on the data provider selected in the route calculator resource there may be additional restrictions on the inputs you can choose. See  Position restrictions in the Amazon Location Service Developer Guide.   For route calculators that use Esri as the data provider, if you specify a destination that's not located on a road, Amazon Location  moves the position to the nearest road. The snapped value is available in the result in SnappedDestinationPositions.  Valid Values: [-180 to 180,-90 to 90] 
     */
    DestinationPositions: CalculateRouteMatrixRequestDestinationPositionsList;
    /**
     * Set the unit system to specify the distance. Default Value: Kilometers 
     */
    DistanceUnit?: DistanceUnit;
    /**
     * The optional API key to authorize the request.
     */
    Key?: ApiKey;
    /**
     * Specifies the mode of transport when calculating a route. Used in estimating the speed of travel and road compatibility. The TravelMode you specify also determines how you specify route preferences:    If traveling by Car use the CarModeOptions parameter.   If traveling by Truck use the TruckModeOptions parameter.     Bicycle or Motorcycle are only valid when using Grab as a data provider, and only within Southeast Asia.  Truck is not available for Grab. For more information about using Grab as a data provider, see GrabMaps in the Amazon Location Service Developer Guide.  Default Value: Car 
     */
    TravelMode?: TravelMode;
    /**
     * Specifies route preferences when traveling by Truck, such as avoiding routes that use ferries or tolls, and truck specifications to consider when choosing an optimal road. Requirements: TravelMode must be specified as Truck.
     */
    TruckModeOptions?: CalculateRouteTruckModeOptions;
  }
  export type CalculateRouteMatrixRequestDeparturePositionsList = Position[];
  export type CalculateRouteMatrixRequestDestinationPositionsList = Position[];
  export interface CalculateRouteMatrixResponse {
    /**
     * The calculated route matrix containing the results for all pairs of DeparturePositions to DestinationPositions. Each row corresponds to one entry in DeparturePositions. Each entry in the row corresponds to the route from that entry in DeparturePositions to an entry in DestinationPositions. 
     */
    RouteMatrix: RouteMatrix;
    /**
     * For routes calculated using an Esri route calculator resource, departure positions are snapped to the closest road. For Esri route calculator resources, this returns the list of departure/origin positions used for calculation of the RouteMatrix.
     */
    SnappedDeparturePositions?: CalculateRouteMatrixResponseSnappedDeparturePositionsList;
    /**
     * The list of destination positions for the route matrix used for calculation of the RouteMatrix.
     */
    SnappedDestinationPositions?: CalculateRouteMatrixResponseSnappedDestinationPositionsList;
    /**
     * Contains information about the route matrix, DataSource, DistanceUnit, RouteCount and ErrorCount.
     */
    Summary: CalculateRouteMatrixSummary;
  }
  export type CalculateRouteMatrixResponseSnappedDeparturePositionsList = Position[];
  export type CalculateRouteMatrixResponseSnappedDestinationPositionsList = Position[];
  export interface CalculateRouteMatrixSummary {
    /**
     * The data provider of traffic and road network data used to calculate the routes. Indicates one of the available providers:    Esri     Grab     Here    For more information about data providers, see Amazon Location Service data providers.
     */
    DataSource: String;
    /**
     * The unit of measurement for route distances.
     */
    DistanceUnit: DistanceUnit;
    /**
     * The count of error results in the route matrix. If this number is 0, all routes were calculated successfully.
     */
    ErrorCount: CalculateRouteMatrixSummaryErrorCountInteger;
    /**
     * The count of cells in the route matrix. Equal to the number of DeparturePositions multiplied by the number of DestinationPositions.
     */
    RouteCount: CalculateRouteMatrixSummaryRouteCountInteger;
  }
  export type CalculateRouteMatrixSummaryErrorCountInteger = number;
  export type CalculateRouteMatrixSummaryRouteCountInteger = number;
  export interface CalculateRouteRequest {
    /**
     * The name of the route calculator resource that you want to use to calculate the route. 
     */
    CalculatorName: ResourceName;
    /**
     * Specifies route preferences when traveling by Car, such as avoiding routes that use ferries or tolls. Requirements: TravelMode must be specified as Car.
     */
    CarModeOptions?: CalculateRouteCarModeOptions;
    /**
     * Sets the time of departure as the current time. Uses the current time to calculate a route. Otherwise, the best time of day to travel with the best traffic conditions is used to calculate the route. Default Value: false  Valid Values: false | true 
     */
    DepartNow?: Boolean;
    /**
     * The start position for the route. Defined in World Geodetic System (WGS 84) format: [longitude, latitude].   For example, [-123.115, 49.285]     If you specify a departure that's not located on a road, Amazon Location moves the position to the nearest road. If Esri is the provider for your route calculator, specifying a route that is longer than 400 km returns a 400 RoutesValidationException error.  Valid Values: [-180 to 180,-90 to 90] 
     */
    DeparturePosition: Position;
    /**
     * Specifies the desired time of departure. Uses the given time to calculate the route. Otherwise, the best time of day to travel with the best traffic conditions is used to calculate the route.  Setting a departure time in the past returns a 400 ValidationException error.    In ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. For example, 2020–07-2T12:15:20.000Z+01:00   
     */
    DepartureTime?: Timestamp;
    /**
     * The finish position for the route. Defined in World Geodetic System (WGS 84) format: [longitude, latitude].    For example, [-122.339, 47.615]     If you specify a destination that's not located on a road, Amazon Location moves the position to the nearest road.   Valid Values: [-180 to 180,-90 to 90] 
     */
    DestinationPosition: Position;
    /**
     * Set the unit system to specify the distance. Default Value: Kilometers 
     */
    DistanceUnit?: DistanceUnit;
    /**
     * Set to include the geometry details in the result for each path between a pair of positions. Default Value: false  Valid Values: false | true 
     */
    IncludeLegGeometry?: Boolean;
    /**
     * The optional API key to authorize the request.
     */
    Key?: ApiKey;
    /**
     * Specifies the mode of transport when calculating a route. Used in estimating the speed of travel and road compatibility. You can choose Car, Truck, Walking, Bicycle or Motorcycle as options for the TravelMode.   Bicycle and Motorcycle are only valid when using Grab as a data provider, and only within Southeast Asia.  Truck is not available for Grab. For more details on the using Grab for routing, including areas of coverage, see GrabMaps in the Amazon Location Service Developer Guide.  The TravelMode you specify also determines how you specify route preferences:    If traveling by Car use the CarModeOptions parameter.   If traveling by Truck use the TruckModeOptions parameter.   Default Value: Car 
     */
    TravelMode?: TravelMode;
    /**
     * Specifies route preferences when traveling by Truck, such as avoiding routes that use ferries or tolls, and truck specifications to consider when choosing an optimal road. Requirements: TravelMode must be specified as Truck.
     */
    TruckModeOptions?: CalculateRouteTruckModeOptions;
    /**
     * Specifies an ordered list of up to 23 intermediate positions to include along a route between the departure position and destination position.    For example, from the DeparturePosition [-123.115, 49.285], the route follows the order that the waypoint positions are given [[-122.757, 49.0021],[-122.349, 47.620]]     If you specify a waypoint position that's not located on a road, Amazon Location moves the position to the nearest road.  Specifying more than 23 waypoints returns a 400 ValidationException error. If Esri is the provider for your route calculator, specifying a route that is longer than 400 km returns a 400 RoutesValidationException error.  Valid Values: [-180 to 180,-90 to 90] 
     */
    WaypointPositions?: CalculateRouteRequestWaypointPositionsList;
  }
  export type CalculateRouteRequestWaypointPositionsList = Position[];
  export interface CalculateRouteResponse {
    /**
     * Contains details about each path between a pair of positions included along a route such as: StartPosition, EndPosition, Distance, DurationSeconds, Geometry, and Steps. The number of legs returned corresponds to one fewer than the total number of positions in the request.  For example, a route with a departure position and destination position returns one leg with the positions snapped to a nearby road:   The StartPosition is the departure position.   The EndPosition is the destination position.   A route with a waypoint between the departure and destination position returns two legs with the positions snapped to a nearby road:   Leg 1: The StartPosition is the departure position . The EndPosition is the waypoint positon.   Leg 2: The StartPosition is the waypoint position. The EndPosition is the destination position.  
     */
    Legs: LegList;
    /**
     * Contains information about the whole route, such as: RouteBBox, DataSource, Distance, DistanceUnit, and DurationSeconds.
     */
    Summary: CalculateRouteSummary;
  }
  export interface CalculateRouteSummary {
    /**
     * The data provider of traffic and road network data used to calculate the route. Indicates one of the available providers:    Esri     Grab     Here    For more information about data providers, see Amazon Location Service data providers.
     */
    DataSource: String;
    /**
     * The total distance covered by the route. The sum of the distance travelled between every stop on the route.  If Esri is the data source for the route calculator, the route distance can’t be greater than 400 km. If the route exceeds 400 km, the response is a 400 RoutesValidationException error. 
     */
    Distance: CalculateRouteSummaryDistanceDouble;
    /**
     * The unit of measurement for route distances.
     */
    DistanceUnit: DistanceUnit;
    /**
     * The total travel time for the route measured in seconds. The sum of the travel time between every stop on the route.
     */
    DurationSeconds: CalculateRouteSummaryDurationSecondsDouble;
    /**
     * Specifies a geographical box surrounding a route. Used to zoom into a route when displaying it in a map. For example, [min x, min y, max x, max y]. The first 2 bbox parameters describe the lower southwest corner:    The first bbox position is the X coordinate or longitude of the lower southwest corner.    The second bbox position is the Y coordinate or latitude of the lower southwest corner.    The next 2 bbox parameters describe the upper northeast corner:    The third bbox position is the X coordinate, or longitude of the upper northeast corner.    The fourth bbox position is the Y coordinate, or latitude of the upper northeast corner.   
     */
    RouteBBox: BoundingBox;
  }
  export type CalculateRouteSummaryDistanceDouble = number;
  export type CalculateRouteSummaryDurationSecondsDouble = number;
  export interface CalculateRouteTruckModeOptions {
    /**
     * Avoids ferries when calculating routes. Default Value: false  Valid Values: false | true 
     */
    AvoidFerries?: Boolean;
    /**
     * Avoids tolls when calculating routes. Default Value: false  Valid Values: false | true 
     */
    AvoidTolls?: Boolean;
    /**
     * Specifies the truck's dimension specifications including length, height, width, and unit of measurement. Used to avoid roads that can't support the truck's dimensions.
     */
    Dimensions?: TruckDimensions;
    /**
     * Specifies the truck's weight specifications including total weight and unit of measurement. Used to avoid roads that can't support the truck's weight.
     */
    Weight?: TruckWeight;
  }
  export interface Circle {
    /**
     * A single point geometry, specifying the center of the circle, using WGS 84 coordinates, in the form [longitude, latitude].
     */
    Center: Position;
    /**
     * The radius of the circle in meters. Must be greater than zero and no larger than 100,000 (100 kilometers).
     */
    Radius: Double;
  }
  export type CountryCode = string;
  export type CountryCode3 = string;
  export type CountryCode3OrEmpty = string;
  export type CountryCodeList = CountryCode[];
  export interface CreateGeofenceCollectionRequest {
    /**
     * A custom name for the geofence collection. Requirements:   Contain only alphanumeric characters (A–Z, a–z, 0–9), hyphens (-), periods (.), and underscores (_).    Must be a unique geofence collection name.   No spaces allowed. For example, ExampleGeofenceCollection.  
     */
    CollectionName: ResourceName;
    /**
     * An optional description for the geofence collection.
     */
    Description?: ResourceDescription;
    /**
     * A key identifier for an Amazon Web Services KMS customer managed key. Enter a key ID, key ARN, alias name, or alias ARN. 
     */
    KmsKeyId?: KmsKeyId;
    /**
     * No longer used. If included, the only allowed value is RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
    /**
     * This parameter is no longer used.
     */
    PricingPlanDataSource?: String;
    /**
     * Applies one or more tags to the geofence collection. A tag is a key-value pair helps manage, identify, search, and filter your resources by labelling them. Format: "key" : "value"  Restrictions:   Maximum 50 tags per resource   Each resource tag must be unique with a maximum of one value.   Maximum key length: 128 Unicode characters in UTF-8   Maximum value length: 256 Unicode characters in UTF-8   Can use alphanumeric characters (A–Z, a–z, 0–9), and the following characters: + - = . _ : / @.    Cannot use "aws:" as a prefix for a key.  
     */
    Tags?: TagMap;
  }
  export interface CreateGeofenceCollectionResponse {
    /**
     * The Amazon Resource Name (ARN) for the geofence collection resource. Used when you need to specify a resource across all Amazon Web Services.    Format example: arn:aws:geo:region:account-id:geofence-collection/ExampleGeofenceCollection   
     */
    CollectionArn: Arn;
    /**
     * The name for the geofence collection.
     */
    CollectionName: ResourceName;
    /**
     * The timestamp for when the geofence collection was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ 
     */
    CreateTime: Timestamp;
  }
  export interface CreateKeyRequest {
    /**
     * An optional description for the API key resource.
     */
    Description?: ResourceDescription;
    /**
     * The optional timestamp for when the API key resource will expire in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. One of NoExpiry or ExpireTime must be set.
     */
    ExpireTime?: Timestamp;
    /**
     * A custom name for the API key resource. Requirements:   Contain only alphanumeric characters (A–Z, a–z, 0–9), hyphens (-), periods (.), and underscores (_).    Must be a unique API key name.   No spaces allowed. For example, ExampleAPIKey.  
     */
    KeyName: ResourceName;
    /**
     * Optionally set to true to set no expiration time for the API key. One of NoExpiry or ExpireTime must be set.
     */
    NoExpiry?: Boolean;
    /**
     * The API key restrictions for the API key resource.
     */
    Restrictions: ApiKeyRestrictions;
    /**
     * Applies one or more tags to the map resource. A tag is a key-value pair that helps manage, identify, search, and filter your resources by labelling them. Format: "key" : "value"  Restrictions:   Maximum 50 tags per resource   Each resource tag must be unique with a maximum of one value.   Maximum key length: 128 Unicode characters in UTF-8   Maximum value length: 256 Unicode characters in UTF-8   Can use alphanumeric characters (A–Z, a–z, 0–9), and the following characters: + - = . _ : / @.    Cannot use "aws:" as a prefix for a key.  
     */
    Tags?: TagMap;
  }
  export interface CreateKeyResponse {
    /**
     * The timestamp for when the API key resource was created in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    CreateTime: Timestamp;
    /**
     * The key value/string of an API key. This value is used when making API calls to authorize the call. For example, see GetMapGlyphs.
     */
    Key: ApiKey;
    /**
     * The Amazon Resource Name (ARN) for the API key resource. Used when you need to specify a resource across all Amazon Web Services.   Format example: arn:aws:geo:region:account-id:key/ExampleKey   
     */
    KeyArn: Arn;
    /**
     * The name of the API key resource.
     */
    KeyName: ResourceName;
  }
  export interface CreateMapRequest {
    /**
     * Specifies the MapConfiguration, including the map style, for the map resource that you create. The map style defines the look of maps and the data provider for your map resource.
     */
    Configuration: MapConfiguration;
    /**
     * An optional description for the map resource.
     */
    Description?: ResourceDescription;
    /**
     * The name for the map resource. Requirements:   Must contain only alphanumeric characters (A–Z, a–z, 0–9), hyphens (-), periods (.), and underscores (_).    Must be a unique map resource name.    No spaces allowed. For example, ExampleMap.  
     */
    MapName: ResourceName;
    /**
     * No longer used. If included, the only allowed value is RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
    /**
     * Applies one or more tags to the map resource. A tag is a key-value pair helps manage, identify, search, and filter your resources by labelling them. Format: "key" : "value"  Restrictions:   Maximum 50 tags per resource   Each resource tag must be unique with a maximum of one value.   Maximum key length: 128 Unicode characters in UTF-8   Maximum value length: 256 Unicode characters in UTF-8   Can use alphanumeric characters (A–Z, a–z, 0–9), and the following characters: + - = . _ : / @.    Cannot use "aws:" as a prefix for a key.  
     */
    Tags?: TagMap;
  }
  export interface CreateMapResponse {
    /**
     * The timestamp for when the map resource was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ.
     */
    CreateTime: Timestamp;
    /**
     * The Amazon Resource Name (ARN) for the map resource. Used to specify a resource across all Amazon Web Services.   Format example: arn:aws:geo:region:account-id:map/ExampleMap   
     */
    MapArn: GeoArn;
    /**
     * The name of the map resource.
     */
    MapName: ResourceName;
  }
  export interface CreatePlaceIndexRequest {
    /**
     * Specifies the geospatial data provider for the new place index.  This field is case-sensitive. Enter the valid values as shown. For example, entering HERE returns an error.  Valid values include:    Esri – For additional information about Esri's coverage in your region of interest, see Esri details on geocoding coverage.    Grab – Grab provides place index functionality for Southeast Asia. For additional information about GrabMaps' coverage, see GrabMaps countries and areas covered.    Here – For additional information about HERE Technologies' coverage in your region of interest, see HERE details on goecoding coverage.  If you specify HERE Technologies (Here) as the data provider, you may not store results for locations in Japan. For more information, see the Amazon Web Services Service Terms for Amazon Location Service.    For additional information , see Data providers on the Amazon Location Service Developer Guide.
     */
    DataSource: String;
    /**
     * Specifies the data storage option requesting Places.
     */
    DataSourceConfiguration?: DataSourceConfiguration;
    /**
     * The optional description for the place index resource.
     */
    Description?: ResourceDescription;
    /**
     * The name of the place index resource.  Requirements:   Contain only alphanumeric characters (A–Z, a–z, 0–9), hyphens (-), periods (.), and underscores (_).   Must be a unique place index resource name.   No spaces allowed. For example, ExamplePlaceIndex.  
     */
    IndexName: ResourceName;
    /**
     * No longer used. If included, the only allowed value is RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
    /**
     * Applies one or more tags to the place index resource. A tag is a key-value pair that helps you manage, identify, search, and filter your resources. Format: "key" : "value"  Restrictions:   Maximum 50 tags per resource.   Each tag key must be unique and must have exactly one associated value.   Maximum key length: 128 Unicode characters in UTF-8.   Maximum value length: 256 Unicode characters in UTF-8.   Can use alphanumeric characters (A–Z, a–z, 0–9), and the following characters: + - = . _ : / @   Cannot use "aws:" as a prefix for a key.  
     */
    Tags?: TagMap;
  }
  export interface CreatePlaceIndexResponse {
    /**
     * The timestamp for when the place index resource was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    CreateTime: Timestamp;
    /**
     * The Amazon Resource Name (ARN) for the place index resource. Used to specify a resource across Amazon Web Services.    Format example: arn:aws:geo:region:account-id:place-index/ExamplePlaceIndex   
     */
    IndexArn: GeoArn;
    /**
     * The name for the place index resource.
     */
    IndexName: ResourceName;
  }
  export interface CreateRouteCalculatorRequest {
    /**
     * The name of the route calculator resource.  Requirements:   Can use alphanumeric characters (A–Z, a–z, 0–9) , hyphens (-), periods (.), and underscores (_).   Must be a unique Route calculator resource name.   No spaces allowed. For example, ExampleRouteCalculator.  
     */
    CalculatorName: ResourceName;
    /**
     * Specifies the data provider of traffic and road network data.  This field is case-sensitive. Enter the valid values as shown. For example, entering HERE returns an error.  Valid values include:    Esri – For additional information about Esri's coverage in your region of interest, see Esri details on street networks and traffic coverage. Route calculators that use Esri as a data source only calculate routes that are shorter than 400 km.    Grab – Grab provides routing functionality for Southeast Asia. For additional information about GrabMaps' coverage, see GrabMaps countries and areas covered.    Here – For additional information about HERE Technologies' coverage in your region of interest, see HERE car routing coverage and HERE truck routing coverage.   For additional information , see Data providers on the Amazon Location Service Developer Guide.
     */
    DataSource: String;
    /**
     * The optional description for the route calculator resource.
     */
    Description?: ResourceDescription;
    /**
     * No longer used. If included, the only allowed value is RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
    /**
     * Applies one or more tags to the route calculator resource. A tag is a key-value pair helps manage, identify, search, and filter your resources by labelling them.   For example: { "tag1" : "value1", "tag2" : "value2"}   Format: "key" : "value"  Restrictions:   Maximum 50 tags per resource   Each resource tag must be unique with a maximum of one value.   Maximum key length: 128 Unicode characters in UTF-8   Maximum value length: 256 Unicode characters in UTF-8   Can use alphanumeric characters (A–Z, a–z, 0–9), and the following characters: + - = . _ : / @.    Cannot use "aws:" as a prefix for a key.  
     */
    Tags?: TagMap;
  }
  export interface CreateRouteCalculatorResponse {
    /**
     * The Amazon Resource Name (ARN) for the route calculator resource. Use the ARN when you specify a resource across all Amazon Web Services.   Format example: arn:aws:geo:region:account-id:route-calculator/ExampleCalculator   
     */
    CalculatorArn: GeoArn;
    /**
     * The name of the route calculator resource.    For example, ExampleRouteCalculator.  
     */
    CalculatorName: ResourceName;
    /**
     * The timestamp when the route calculator resource was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ.    For example, 2020–07-2T12:15:20.000Z+01:00   
     */
    CreateTime: Timestamp;
  }
  export interface CreateTrackerRequest {
    /**
     * An optional description for the tracker resource.
     */
    Description?: ResourceDescription;
    /**
     * Whether to enable position UPDATE events from this tracker to be sent to EventBridge.  You do not need enable this feature to get ENTER and EXIT events for geofences with this tracker. Those events are always sent to EventBridge. 
     */
    EventBridgeEnabled?: Boolean;
    /**
     * Enables GeospatialQueries for a tracker that uses a Amazon Web Services KMS customer managed key. This parameter is only used if you are using a KMS customer managed key.  If you wish to encrypt your data using your own KMS customer managed key, then the Bounding Polygon Queries feature will be disabled by default. This is because by using this feature, a representation of your device positions will not be encrypted using the your KMS managed key. The exact device position, however; is still encrypted using your managed key. You can choose to opt-in to the Bounding Polygon Quseries feature. This is done by setting the KmsKeyEnableGeospatialQueries parameter to true when creating or updating a Tracker. 
     */
    KmsKeyEnableGeospatialQueries?: Boolean;
    /**
     * A key identifier for an Amazon Web Services KMS customer managed key. Enter a key ID, key ARN, alias name, or alias ARN.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * Specifies the position filtering for the tracker resource. Valid values:    TimeBased - Location updates are evaluated against linked geofence collections, but not every location update is stored. If your update frequency is more often than 30 seconds, only one update per 30 seconds is stored for each unique device ID.     DistanceBased - If the device has moved less than 30 m (98.4 ft), location updates are ignored. Location updates within this area are neither evaluated against linked geofence collections, nor stored. This helps control costs by reducing the number of geofence evaluations and historical device positions to paginate through. Distance-based filtering can also reduce the effects of GPS noise when displaying device trajectories on a map.     AccuracyBased - If the device has moved less than the measured accuracy, location updates are ignored. For example, if two consecutive updates from a device have a horizontal accuracy of 5 m and 10 m, the second update is ignored if the device has moved less than 15 m. Ignored location updates are neither evaluated against linked geofence collections, nor stored. This can reduce the effects of GPS noise when displaying device trajectories on a map, and can help control your costs by reducing the number of geofence evaluations.    This field is optional. If not specified, the default value is TimeBased.
     */
    PositionFiltering?: PositionFiltering;
    /**
     * No longer used. If included, the only allowed value is RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
    /**
     * This parameter is no longer used.
     */
    PricingPlanDataSource?: String;
    /**
     * Applies one or more tags to the tracker resource. A tag is a key-value pair helps manage, identify, search, and filter your resources by labelling them. Format: "key" : "value"  Restrictions:   Maximum 50 tags per resource   Each resource tag must be unique with a maximum of one value.   Maximum key length: 128 Unicode characters in UTF-8   Maximum value length: 256 Unicode characters in UTF-8   Can use alphanumeric characters (A–Z, a–z, 0–9), and the following characters: + - = . _ : / @.    Cannot use "aws:" as a prefix for a key.  
     */
    Tags?: TagMap;
    /**
     * The name for the tracker resource. Requirements:   Contain only alphanumeric characters (A-Z, a-z, 0-9) , hyphens (-), periods (.), and underscores (_).   Must be a unique tracker resource name.   No spaces allowed. For example, ExampleTracker.  
     */
    TrackerName: ResourceName;
  }
  export interface CreateTrackerResponse {
    /**
     * The timestamp for when the tracker resource was created in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    CreateTime: Timestamp;
    /**
     * The Amazon Resource Name (ARN) for the tracker resource. Used when you need to specify a resource across all Amazon Web Services.   Format example: arn:aws:geo:region:account-id:tracker/ExampleTracker   
     */
    TrackerArn: Arn;
    /**
     * The name of the tracker resource.
     */
    TrackerName: ResourceName;
  }
  export interface DataSourceConfiguration {
    /**
     * Specifies how the results of an operation will be stored by the caller.  Valid values include:    SingleUse specifies that the results won't be stored.     Storage specifies that the result can be cached or stored in a database.   Default value: SingleUse 
     */
    IntendedUse?: IntendedUse;
  }
  export interface DeleteGeofenceCollectionRequest {
    /**
     * The name of the geofence collection to be deleted.
     */
    CollectionName: ResourceName;
  }
  export interface DeleteGeofenceCollectionResponse {
  }
  export interface DeleteKeyRequest {
    /**
     * The name of the API key to delete.
     */
    KeyName: ResourceName;
  }
  export interface DeleteKeyResponse {
  }
  export interface DeleteMapRequest {
    /**
     * The name of the map resource to be deleted.
     */
    MapName: ResourceName;
  }
  export interface DeleteMapResponse {
  }
  export interface DeletePlaceIndexRequest {
    /**
     * The name of the place index resource to be deleted.
     */
    IndexName: ResourceName;
  }
  export interface DeletePlaceIndexResponse {
  }
  export interface DeleteRouteCalculatorRequest {
    /**
     * The name of the route calculator resource to be deleted.
     */
    CalculatorName: ResourceName;
  }
  export interface DeleteRouteCalculatorResponse {
  }
  export interface DeleteTrackerRequest {
    /**
     * The name of the tracker resource to be deleted.
     */
    TrackerName: ResourceName;
  }
  export interface DeleteTrackerResponse {
  }
  export interface DescribeGeofenceCollectionRequest {
    /**
     * The name of the geofence collection.
     */
    CollectionName: ResourceName;
  }
  export interface DescribeGeofenceCollectionResponse {
    /**
     * The Amazon Resource Name (ARN) for the geofence collection resource. Used when you need to specify a resource across all Amazon Web Services.    Format example: arn:aws:geo:region:account-id:geofence-collection/ExampleGeofenceCollection   
     */
    CollectionArn: Arn;
    /**
     * The name of the geofence collection.
     */
    CollectionName: ResourceName;
    /**
     * The timestamp for when the geofence resource was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ 
     */
    CreateTime: Timestamp;
    /**
     * The optional description for the geofence collection.
     */
    Description: ResourceDescription;
    /**
     * The number of geofences in the geofence collection.
     */
    GeofenceCount?: DescribeGeofenceCollectionResponseGeofenceCountInteger;
    /**
     * A key identifier for an Amazon Web Services KMS customer managed key assigned to the Amazon Location resource
     */
    KmsKeyId?: KmsKeyId;
    /**
     * No longer used. Always returns RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
    /**
     * No longer used. Always returns an empty string.
     */
    PricingPlanDataSource?: String;
    /**
     * Displays the key, value pairs of tags associated with this resource.
     */
    Tags?: TagMap;
    /**
     * The timestamp for when the geofence collection was last updated in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ 
     */
    UpdateTime: Timestamp;
  }
  export type DescribeGeofenceCollectionResponseGeofenceCountInteger = number;
  export interface DescribeKeyRequest {
    /**
     * The name of the API key resource.
     */
    KeyName: ResourceName;
  }
  export interface DescribeKeyResponse {
    /**
     * The timestamp for when the API key resource was created in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    CreateTime: Timestamp;
    /**
     * The optional description for the API key resource.
     */
    Description?: ResourceDescription;
    /**
     * The timestamp for when the API key resource will expire in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    ExpireTime: Timestamp;
    /**
     * The key value/string of an API key.
     */
    Key: ApiKey;
    /**
     * The Amazon Resource Name (ARN) for the API key resource. Used when you need to specify a resource across all Amazon Web Services.   Format example: arn:aws:geo:region:account-id:key/ExampleKey   
     */
    KeyArn: Arn;
    /**
     * The name of the API key resource.
     */
    KeyName: ResourceName;
    Restrictions: ApiKeyRestrictions;
    /**
     * Tags associated with the API key resource.
     */
    Tags?: TagMap;
    /**
     * The timestamp for when the API key resource was last updated in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    UpdateTime: Timestamp;
  }
  export interface DescribeMapRequest {
    /**
     * The name of the map resource.
     */
    MapName: ResourceName;
  }
  export interface DescribeMapResponse {
    /**
     * Specifies the map tile style selected from a partner data provider.
     */
    Configuration: MapConfiguration;
    /**
     * The timestamp for when the map resource was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ.
     */
    CreateTime: Timestamp;
    /**
     * Specifies the data provider for the associated map tiles.
     */
    DataSource: String;
    /**
     * The optional description for the map resource.
     */
    Description: ResourceDescription;
    /**
     * The Amazon Resource Name (ARN) for the map resource. Used to specify a resource across all Amazon Web Services.   Format example: arn:aws:geo:region:account-id:map/ExampleMap   
     */
    MapArn: GeoArn;
    /**
     * The map style selected from an available provider.
     */
    MapName: ResourceName;
    /**
     * No longer used. Always returns RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
    /**
     * Tags associated with the map resource.
     */
    Tags?: TagMap;
    /**
     * The timestamp for when the map resource was last update in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ.
     */
    UpdateTime: Timestamp;
  }
  export interface DescribePlaceIndexRequest {
    /**
     * The name of the place index resource.
     */
    IndexName: ResourceName;
  }
  export interface DescribePlaceIndexResponse {
    /**
     * The timestamp for when the place index resource was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    CreateTime: Timestamp;
    /**
     * The data provider of geospatial data. Values can be one of the following:    Esri     Grab     Here    For more information about data providers, see Amazon Location Service data providers.
     */
    DataSource: String;
    /**
     * The specified data storage option for requesting Places.
     */
    DataSourceConfiguration: DataSourceConfiguration;
    /**
     * The optional description for the place index resource.
     */
    Description: ResourceDescription;
    /**
     * The Amazon Resource Name (ARN) for the place index resource. Used to specify a resource across Amazon Web Services.    Format example: arn:aws:geo:region:account-id:place-index/ExamplePlaceIndex   
     */
    IndexArn: GeoArn;
    /**
     * The name of the place index resource being described.
     */
    IndexName: ResourceName;
    /**
     * No longer used. Always returns RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
    /**
     * Tags associated with place index resource.
     */
    Tags?: TagMap;
    /**
     * The timestamp for when the place index resource was last updated in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    UpdateTime: Timestamp;
  }
  export interface DescribeRouteCalculatorRequest {
    /**
     * The name of the route calculator resource.
     */
    CalculatorName: ResourceName;
  }
  export interface DescribeRouteCalculatorResponse {
    /**
     * The Amazon Resource Name (ARN) for the Route calculator resource. Use the ARN when you specify a resource across Amazon Web Services.   Format example: arn:aws:geo:region:account-id:route-calculator/ExampleCalculator   
     */
    CalculatorArn: GeoArn;
    /**
     * The name of the route calculator resource being described.
     */
    CalculatorName: ResourceName;
    /**
     * The timestamp when the route calculator resource was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ.    For example, 2020–07-2T12:15:20.000Z+01:00   
     */
    CreateTime: Timestamp;
    /**
     * The data provider of traffic and road network data. Indicates one of the available providers:    Esri     Grab     Here    For more information about data providers, see Amazon Location Service data providers.
     */
    DataSource: String;
    /**
     * The optional description of the route calculator resource.
     */
    Description: ResourceDescription;
    /**
     * Always returns RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
    /**
     * Tags associated with route calculator resource.
     */
    Tags?: TagMap;
    /**
     * The timestamp when the route calculator resource was last updated in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ.    For example, 2020–07-2T12:15:20.000Z+01:00   
     */
    UpdateTime: Timestamp;
  }
  export interface DescribeTrackerRequest {
    /**
     * The name of the tracker resource.
     */
    TrackerName: ResourceName;
  }
  export interface DescribeTrackerResponse {
    /**
     * The timestamp for when the tracker resource was created in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    CreateTime: Timestamp;
    /**
     * The optional description for the tracker resource.
     */
    Description: ResourceDescription;
    /**
     * Whether UPDATE events from this tracker in EventBridge are enabled. If set to true these events will be sent to EventBridge.
     */
    EventBridgeEnabled?: Boolean;
    /**
     * Enables GeospatialQueries for a tracker that uses a Amazon Web Services KMS customer managed key. This parameter is only used if you are using a KMS customer managed key.  If you wish to encrypt your data using your own KMS customer managed key, then the Bounding Polygon Queries feature will be disabled by default. This is because by using this feature, a representation of your device positions will not be encrypted using the your KMS managed key. The exact device position, however; is still encrypted using your managed key. You can choose to opt-in to the Bounding Polygon Quseries feature. This is done by setting the KmsKeyEnableGeospatialQueries parameter to true when creating or updating a Tracker. 
     */
    KmsKeyEnableGeospatialQueries?: Boolean;
    /**
     * A key identifier for an Amazon Web Services KMS customer managed key assigned to the Amazon Location resource.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * The position filtering method of the tracker resource.
     */
    PositionFiltering?: PositionFiltering;
    /**
     * Always returns RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
    /**
     * No longer used. Always returns an empty string.
     */
    PricingPlanDataSource?: String;
    /**
     * The tags associated with the tracker resource.
     */
    Tags?: TagMap;
    /**
     * The Amazon Resource Name (ARN) for the tracker resource. Used when you need to specify a resource across all Amazon Web Services.   Format example: arn:aws:geo:region:account-id:tracker/ExampleTracker   
     */
    TrackerArn: Arn;
    /**
     * The name of the tracker resource.
     */
    TrackerName: ResourceName;
    /**
     * The timestamp for when the tracker resource was last updated in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    UpdateTime: Timestamp;
  }
  export interface DevicePosition {
    /**
     * The accuracy of the device position.
     */
    Accuracy?: PositionalAccuracy;
    /**
     * The device whose position you retrieved.
     */
    DeviceId?: Id;
    /**
     * The last known device position.
     */
    Position: Position;
    /**
     * The properties associated with the position.
     */
    PositionProperties?: PropertyMap;
    /**
     * The timestamp for when the tracker resource received the device position in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    ReceivedTime: Timestamp;
    /**
     * The timestamp at which the device's position was determined. Uses  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    SampleTime: Timestamp;
  }
  export type DevicePositionList = DevicePosition[];
  export interface DevicePositionUpdate {
    /**
     * The accuracy of the device position.
     */
    Accuracy?: PositionalAccuracy;
    /**
     * The device associated to the position update.
     */
    DeviceId: Id;
    /**
     * The latest device position defined in WGS 84 format: [X or longitude, Y or latitude].
     */
    Position: Position;
    /**
     * Associates one of more properties with the position update. A property is a key-value pair stored with the position update and added to any geofence event the update may trigger. Format: "key" : "value" 
     */
    PositionProperties?: PropertyMap;
    /**
     * The timestamp at which the device's position was determined. Uses ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ 
     */
    SampleTime: Timestamp;
  }
  export type DimensionUnit = "Meters"|"Feet"|string;
  export interface DisassociateTrackerConsumerRequest {
    /**
     * The Amazon Resource Name (ARN) for the geofence collection to be disassociated from the tracker resource. Used when you need to specify a resource across all Amazon Web Services.    Format example: arn:aws:geo:region:account-id:geofence-collection/ExampleGeofenceCollectionConsumer   
     */
    ConsumerArn: Arn;
    /**
     * The name of the tracker resource to be dissociated from the consumer.
     */
    TrackerName: ResourceName;
  }
  export interface DisassociateTrackerConsumerResponse {
  }
  export type DistanceUnit = "Kilometers"|"Miles"|string;
  export type Double = number;
  export type FilterPlaceCategoryList = PlaceCategory[];
  export type GeoArn = string;
  export interface GeofenceGeometry {
    /**
     * A circle on the earth, as defined by a center point and a radius.
     */
    Circle?: Circle;
    /**
     * A polygon is a list of linear rings which are each made up of a list of vertices. Each vertex is a 2-dimensional point of the form: [longitude, latitude]. This is represented as an array of doubles of length 2 (so [double, double]). An array of 4 or more vertices, where the first and last vertex are the same (to form a closed boundary), is called a linear ring. The linear ring vertices must be listed in counter-clockwise order around the ring’s interior. The linear ring is represented as an array of vertices, or an array of arrays of doubles ([[double, double], ...]). A geofence consists of a single linear ring. To allow for future expansion, the Polygon parameter takes an array of linear rings, which is represented as an array of arrays of arrays of doubles ([[[double, double], ...], ...]). A linear ring for use in geofences can consist of between 4 and 1,000 vertices.
     */
    Polygon?: LinearRings;
  }
  export interface GetDevicePositionHistoryRequest {
    /**
     * The device whose position history you want to retrieve.
     */
    DeviceId: Id;
    /**
     * Specify the end time for the position history in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. By default, the value will be the time that the request is made. Requirement:   The time specified for EndTimeExclusive must be after the time for StartTimeInclusive.  
     */
    EndTimeExclusive?: Timestamp;
    /**
     * An optional limit for the number of device positions returned in a single call. Default value: 100 
     */
    MaxResults?: GetDevicePositionHistoryRequestMaxResultsInteger;
    /**
     * The pagination token specifying which page of results to return in the response. If no token is provided, the default page is the first page.  Default value: null 
     */
    NextToken?: Token;
    /**
     * Specify the start time for the position history in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. By default, the value will be 24 hours prior to the time that the request is made. Requirement:   The time specified for StartTimeInclusive must be before EndTimeExclusive.  
     */
    StartTimeInclusive?: Timestamp;
    /**
     * The tracker resource receiving the request for the device position history.
     */
    TrackerName: ResourceName;
  }
  export type GetDevicePositionHistoryRequestMaxResultsInteger = number;
  export interface GetDevicePositionHistoryResponse {
    /**
     * Contains the position history details for the requested device.
     */
    DevicePositions: DevicePositionList;
    /**
     * A pagination token indicating there are additional pages available. You can use the token in a following request to fetch the next set of results.
     */
    NextToken?: Token;
  }
  export interface GetDevicePositionRequest {
    /**
     * The device whose position you want to retrieve.
     */
    DeviceId: Id;
    /**
     * The tracker resource receiving the position update.
     */
    TrackerName: ResourceName;
  }
  export interface GetDevicePositionResponse {
    /**
     * The accuracy of the device position.
     */
    Accuracy?: PositionalAccuracy;
    /**
     * The device whose position you retrieved.
     */
    DeviceId?: Id;
    /**
     * The last known device position.
     */
    Position: Position;
    /**
     * The properties associated with the position.
     */
    PositionProperties?: PropertyMap;
    /**
     * The timestamp for when the tracker resource received the device position in  ISO 8601  format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    ReceivedTime: Timestamp;
    /**
     * The timestamp at which the device's position was determined. Uses  ISO 8601  format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    SampleTime: Timestamp;
  }
  export interface GetGeofenceRequest {
    /**
     * The geofence collection storing the target geofence.
     */
    CollectionName: ResourceName;
    /**
     * The geofence you're retrieving details for.
     */
    GeofenceId: Id;
  }
  export interface GetGeofenceResponse {
    /**
     * The timestamp for when the geofence collection was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ 
     */
    CreateTime: Timestamp;
    /**
     * The geofence identifier.
     */
    GeofenceId: Id;
    /**
     * User defined properties of the geofence. A property is a key-value pair stored with the geofence and added to any geofence event triggered with that geofence. Format: "key" : "value" 
     */
    GeofenceProperties?: PropertyMap;
    /**
     * Contains the geofence geometry details describing a polygon or a circle.
     */
    Geometry: GeofenceGeometry;
    /**
     * Identifies the state of the geofence. A geofence will hold one of the following states:    ACTIVE — The geofence has been indexed by the system.     PENDING — The geofence is being processed by the system.    FAILED — The geofence failed to be indexed by the system.    DELETED — The geofence has been deleted from the system index.    DELETING — The geofence is being deleted from the system index.  
     */
    Status: String;
    /**
     * The timestamp for when the geofence collection was last updated in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ 
     */
    UpdateTime: Timestamp;
  }
  export interface GetMapGlyphsRequest {
    /**
     * A comma-separated list of fonts to load glyphs from in order of preference. For example, Noto Sans Regular, Arial Unicode. Valid font stacks for Esri styles:    VectorEsriDarkGrayCanvas – Ubuntu Medium Italic | Ubuntu Medium | Ubuntu Italic | Ubuntu Regular | Ubuntu Bold    VectorEsriLightGrayCanvas – Ubuntu Italic | Ubuntu Regular | Ubuntu Light | Ubuntu Bold    VectorEsriTopographic – Noto Sans Italic | Noto Sans Regular | Noto Sans Bold | Noto Serif Regular | Roboto Condensed Light Italic    VectorEsriStreets – Arial Regular | Arial Italic | Arial Bold    VectorEsriNavigation – Arial Regular | Arial Italic | Arial Bold    Valid font stacks for HERE Technologies styles:   VectorHereContrast – Fira GO Regular | Fira GO Bold    VectorHereExplore, VectorHereExploreTruck, HybridHereExploreSatellite – Fira GO Italic | Fira GO Map | Fira GO Map Bold | Noto Sans CJK JP Bold | Noto Sans CJK JP Light | Noto Sans CJK JP Regular    Valid font stacks for GrabMaps styles:   VectorGrabStandardLight, VectorGrabStandardDark – Noto Sans Regular | Noto Sans Medium | Noto Sans Bold    Valid font stacks for Open Data styles:   VectorOpenDataStandardLight, VectorOpenDataStandardDark, VectorOpenDataVisualizationLight, VectorOpenDataVisualizationDark – Amazon Ember Regular,Noto Sans Regular | Amazon Ember Bold,Noto Sans Bold | Amazon Ember Medium,Noto Sans Medium | Amazon Ember Regular Italic,Noto Sans Italic | Amazon Ember Condensed RC Regular,Noto Sans Regular | Amazon Ember Condensed RC Bold,Noto Sans Bold | Amazon Ember Regular,Noto Sans Regular,Noto Sans Arabic Regular | Amazon Ember Condensed RC Bold,Noto Sans Bold,Noto Sans Arabic Condensed Bold | Amazon Ember Bold,Noto Sans Bold,Noto Sans Arabic Bold | Amazon Ember Regular Italic,Noto Sans Italic,Noto Sans Arabic Regular | Amazon Ember Condensed RC Regular,Noto Sans Regular,Noto Sans Arabic Condensed Regular | Amazon Ember Medium,Noto Sans Medium,Noto Sans Arabic Medium     The fonts used by the Open Data map styles are combined fonts that use Amazon Ember for most glyphs but Noto Sans for glyphs unsupported by Amazon Ember. 
     */
    FontStack: String;
    /**
     * A Unicode range of characters to download glyphs for. Each response will contain 256 characters. For example, 0–255 includes all characters from range U+0000 to 00FF. Must be aligned to multiples of 256.
     */
    FontUnicodeRange: GetMapGlyphsRequestFontUnicodeRangeString;
    /**
     * The optional API key to authorize the request.
     */
    Key?: ApiKey;
    /**
     * The map resource associated with the glyph ﬁle.
     */
    MapName: ResourceName;
  }
  export type GetMapGlyphsRequestFontUnicodeRangeString = string;
  export interface GetMapGlyphsResponse {
    /**
     * The glyph, as binary blob.
     */
    Blob?: _Blob;
    /**
     * The HTTP Cache-Control directive for the value.
     */
    CacheControl?: String;
    /**
     * The map glyph content type. For example, application/octet-stream.
     */
    ContentType?: String;
  }
  export interface GetMapSpritesRequest {
    /**
     * The name of the sprite ﬁle. Use the following ﬁle names for the sprite sheet:    sprites.png     sprites@2x.png for high pixel density displays   For the JSON document containing image offsets. Use the following ﬁle names:    sprites.json     sprites@2x.json for high pixel density displays  
     */
    FileName: GetMapSpritesRequestFileNameString;
    /**
     * The optional API key to authorize the request.
     */
    Key?: ApiKey;
    /**
     * The map resource associated with the sprite ﬁle.
     */
    MapName: ResourceName;
  }
  export type GetMapSpritesRequestFileNameString = string;
  export interface GetMapSpritesResponse {
    /**
     * Contains the body of the sprite sheet or JSON offset ﬁle.
     */
    Blob?: _Blob;
    /**
     * The HTTP Cache-Control directive for the value.
     */
    CacheControl?: String;
    /**
     * The content type of the sprite sheet and offsets. For example, the sprite sheet content type is image/png, and the sprite offset JSON document is application/json. 
     */
    ContentType?: String;
  }
  export interface GetMapStyleDescriptorRequest {
    /**
     * The optional API key to authorize the request.
     */
    Key?: ApiKey;
    /**
     * The map resource to retrieve the style descriptor from.
     */
    MapName: ResourceName;
  }
  export interface GetMapStyleDescriptorResponse {
    /**
     * Contains the body of the style descriptor.
     */
    Blob?: _Blob;
    /**
     * The HTTP Cache-Control directive for the value.
     */
    CacheControl?: String;
    /**
     * The style descriptor's content type. For example, application/json.
     */
    ContentType?: String;
  }
  export interface GetMapTileRequest {
    /**
     * The optional API key to authorize the request.
     */
    Key?: ApiKey;
    /**
     * The map resource to retrieve the map tiles from.
     */
    MapName: ResourceName;
    /**
     * The X axis value for the map tile.
     */
    X: GetMapTileRequestXString;
    /**
     * The Y axis value for the map tile. 
     */
    Y: GetMapTileRequestYString;
    /**
     * The zoom value for the map tile.
     */
    Z: GetMapTileRequestZString;
  }
  export type GetMapTileRequestXString = string;
  export type GetMapTileRequestYString = string;
  export type GetMapTileRequestZString = string;
  export interface GetMapTileResponse {
    /**
     * Contains Mapbox Vector Tile (MVT) data.
     */
    Blob?: _Blob;
    /**
     * The HTTP Cache-Control directive for the value.
     */
    CacheControl?: String;
    /**
     * The map tile's content type. For example, application/vnd.mapbox-vector-tile.
     */
    ContentType?: String;
  }
  export interface GetPlaceRequest {
    /**
     * The name of the place index resource that you want to use for the search.
     */
    IndexName: ResourceName;
    /**
     * The optional API key to authorize the request.
     */
    Key?: ApiKey;
    /**
     * The preferred language used to return results. The value must be a valid BCP 47 language tag, for example, en for English. This setting affects the languages used in the results, but not the results themselves. If no language is specified, or not supported for a particular result, the partner automatically chooses a language for the result. For an example, we'll use the Greek language. You search for a location around Athens, Greece, with the language parameter set to en. The city in the results will most likely be returned as Athens. If you set the language parameter to el, for Greek, then the city in the results will more likely be returned as Αθήνα. If the data provider does not have a value for Greek, the result will be in a language that the provider does support.
     */
    Language?: LanguageTag;
    /**
     * The identifier of the place to find.
     */
    PlaceId: PlaceId;
  }
  export interface GetPlaceResponse {
    /**
     * Details about the result, such as its address and position.
     */
    Place: Place;
  }
  export type Id = string;
  export type Integer = number;
  export type IntendedUse = "SingleUse"|"Storage"|string;
  export type KmsKeyId = string;
  export type LanguageTag = string;
  export interface Leg {
    /**
     * The distance between the leg's StartPosition and EndPosition along a calculated route.    The default measurement is Kilometers unless the request specifies a DistanceUnit of Miles.  
     */
    Distance: LegDistanceDouble;
    /**
     * The estimated travel time between the leg's StartPosition and EndPosition. The travel mode and departure time that you specify in the request determines the calculated time.
     */
    DurationSeconds: LegDurationSecondsDouble;
    /**
     * The terminating position of the leg. Follows the format [longitude,latitude].  If the EndPosition isn't located on a road, it's snapped to a nearby road.  
     */
    EndPosition: Position;
    /**
     * Contains the calculated route's path as a linestring geometry.
     */
    Geometry?: LegGeometry;
    /**
     * The starting position of the leg. Follows the format [longitude,latitude].  If the StartPosition isn't located on a road, it's snapped to a nearby road.  
     */
    StartPosition: Position;
    /**
     * Contains a list of steps, which represent subsections of a leg. Each step provides instructions for how to move to the next step in the leg such as the step's start position, end position, travel distance, travel duration, and geometry offset.
     */
    Steps: StepList;
  }
  export type LegDistanceDouble = number;
  export type LegDurationSecondsDouble = number;
  export interface LegGeometry {
    /**
     * An ordered list of positions used to plot a route on a map.  The first position is closest to the start position for the leg, and the last position is the closest to the end position for the leg.   For example, [[-123.117, 49.284],[-123.115, 49.285],[-123.115, 49.285]]   
     */
    LineString?: LineString;
  }
  export type LegList = Leg[];
  export type LineString = Position[];
  export type LinearRing = Position[];
  export type LinearRings = LinearRing[];
  export interface ListDevicePositionsRequest {
    /**
     * The geomerty used to filter device positions.
     */
    FilterGeometry?: TrackingFilterGeometry;
    /**
     * An optional limit for the number of entries returned in a single call. Default value: 100 
     */
    MaxResults?: ListDevicePositionsRequestMaxResultsInteger;
    /**
     * The pagination token specifying which page of results to return in the response. If no token is provided, the default page is the first page. Default value: null 
     */
    NextToken?: Token;
    /**
     * The tracker resource containing the requested devices.
     */
    TrackerName: ResourceName;
  }
  export type ListDevicePositionsRequestMaxResultsInteger = number;
  export interface ListDevicePositionsResponse {
    /**
     * Contains details about each device's last known position.
     */
    Entries: ListDevicePositionsResponseEntryList;
    /**
     * A pagination token indicating there are additional pages available. You can use the token in a following request to fetch the next set of results.
     */
    NextToken?: Token;
  }
  export interface ListDevicePositionsResponseEntry {
    /**
     * The accuracy of the device position.
     */
    Accuracy?: PositionalAccuracy;
    /**
     * The ID of the device for this position.
     */
    DeviceId: Id;
    /**
     * The last known device position. Empty if no positions currently stored.
     */
    Position: Position;
    /**
     * The properties associated with the position.
     */
    PositionProperties?: PropertyMap;
    /**
     * The timestamp at which the device position was determined. Uses  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ.
     */
    SampleTime: Timestamp;
  }
  export type ListDevicePositionsResponseEntryList = ListDevicePositionsResponseEntry[];
  export interface ListGeofenceCollectionsRequest {
    /**
     * An optional limit for the number of resources returned in a single call.  Default value: 100 
     */
    MaxResults?: ListGeofenceCollectionsRequestMaxResultsInteger;
    /**
     * The pagination token specifying which page of results to return in the response. If no token is provided, the default page is the first page.  Default value: null 
     */
    NextToken?: Token;
  }
  export type ListGeofenceCollectionsRequestMaxResultsInteger = number;
  export interface ListGeofenceCollectionsResponse {
    /**
     * Lists the geofence collections that exist in your Amazon Web Services account.
     */
    Entries: ListGeofenceCollectionsResponseEntryList;
    /**
     * A pagination token indicating there are additional pages available. You can use the token in a following request to fetch the next set of results. 
     */
    NextToken?: Token;
  }
  export interface ListGeofenceCollectionsResponseEntry {
    /**
     * The name of the geofence collection.
     */
    CollectionName: ResourceName;
    /**
     * The timestamp for when the geofence collection was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ 
     */
    CreateTime: Timestamp;
    /**
     * The description for the geofence collection
     */
    Description: ResourceDescription;
    /**
     * No longer used. Always returns RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
    /**
     * No longer used. Always returns an empty string.
     */
    PricingPlanDataSource?: String;
    /**
     * Specifies a timestamp for when the resource was last updated in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ 
     */
    UpdateTime: Timestamp;
  }
  export type ListGeofenceCollectionsResponseEntryList = ListGeofenceCollectionsResponseEntry[];
  export interface ListGeofenceResponseEntry {
    /**
     * The timestamp for when the geofence was stored in a geofence collection in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ 
     */
    CreateTime: Timestamp;
    /**
     * The geofence identifier.
     */
    GeofenceId: Id;
    /**
     * User defined properties of the geofence. A property is a key-value pair stored with the geofence and added to any geofence event triggered with that geofence. Format: "key" : "value" 
     */
    GeofenceProperties?: PropertyMap;
    /**
     * Contains the geofence geometry details describing a polygon or a circle.
     */
    Geometry: GeofenceGeometry;
    /**
     * Identifies the state of the geofence. A geofence will hold one of the following states:    ACTIVE — The geofence has been indexed by the system.     PENDING — The geofence is being processed by the system.    FAILED — The geofence failed to be indexed by the system.    DELETED — The geofence has been deleted from the system index.    DELETING — The geofence is being deleted from the system index.  
     */
    Status: String;
    /**
     * The timestamp for when the geofence was last updated in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ 
     */
    UpdateTime: Timestamp;
  }
  export type ListGeofenceResponseEntryList = ListGeofenceResponseEntry[];
  export interface ListGeofencesRequest {
    /**
     * The name of the geofence collection storing the list of geofences.
     */
    CollectionName: ResourceName;
    /**
     * An optional limit for the number of geofences returned in a single call.  Default value: 100 
     */
    MaxResults?: ListGeofencesRequestMaxResultsInteger;
    /**
     * The pagination token specifying which page of results to return in the response. If no token is provided, the default page is the first page.  Default value: null 
     */
    NextToken?: Token;
  }
  export type ListGeofencesRequestMaxResultsInteger = number;
  export interface ListGeofencesResponse {
    /**
     * Contains a list of geofences stored in the geofence collection.
     */
    Entries: ListGeofenceResponseEntryList;
    /**
     * A pagination token indicating there are additional pages available. You can use the token in a following request to fetch the next set of results. 
     */
    NextToken?: Token;
  }
  export interface ListKeysRequest {
    /**
     * Optionally filter the list to only Active or Expired API keys.
     */
    Filter?: ApiKeyFilter;
    /**
     * An optional limit for the number of resources returned in a single call.  Default value: 100 
     */
    MaxResults?: ListKeysRequestMaxResultsInteger;
    /**
     * The pagination token specifying which page of results to return in the response. If no token is provided, the default page is the first page.  Default value: null 
     */
    NextToken?: Token;
  }
  export type ListKeysRequestMaxResultsInteger = number;
  export interface ListKeysResponse {
    /**
     * Contains API key resources in your Amazon Web Services account. Details include API key name, allowed referers and timestamp for when the API key will expire.
     */
    Entries: ListKeysResponseEntryList;
    /**
     * A pagination token indicating there are additional pages available. You can use the token in a following request to fetch the next set of results. 
     */
    NextToken?: Token;
  }
  export interface ListKeysResponseEntry {
    /**
     * The timestamp of when the API key was created, in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ.
     */
    CreateTime: Timestamp;
    /**
     * The optional description for the API key resource.
     */
    Description?: ResourceDescription;
    /**
     * The timestamp for when the API key resource will expire, in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ.
     */
    ExpireTime: Timestamp;
    /**
     * The name of the API key resource.
     */
    KeyName: ResourceName;
    Restrictions: ApiKeyRestrictions;
    /**
     * The timestamp of when the API key was last updated, in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ.
     */
    UpdateTime: Timestamp;
  }
  export type ListKeysResponseEntryList = ListKeysResponseEntry[];
  export interface ListMapsRequest {
    /**
     * An optional limit for the number of resources returned in a single call.  Default value: 100 
     */
    MaxResults?: ListMapsRequestMaxResultsInteger;
    /**
     * The pagination token specifying which page of results to return in the response. If no token is provided, the default page is the first page. Default value: null 
     */
    NextToken?: Token;
  }
  export type ListMapsRequestMaxResultsInteger = number;
  export interface ListMapsResponse {
    /**
     * Contains a list of maps in your Amazon Web Services account
     */
    Entries: ListMapsResponseEntryList;
    /**
     * A pagination token indicating there are additional pages available. You can use the token in a following request to fetch the next set of results. 
     */
    NextToken?: Token;
  }
  export interface ListMapsResponseEntry {
    /**
     * The timestamp for when the map resource was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ.
     */
    CreateTime: Timestamp;
    /**
     * Specifies the data provider for the associated map tiles.
     */
    DataSource: String;
    /**
     * The description for the map resource.
     */
    Description: ResourceDescription;
    /**
     * The name of the associated map resource.
     */
    MapName: ResourceName;
    /**
     * No longer used. Always returns RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
    /**
     * The timestamp for when the map resource was last updated in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ.
     */
    UpdateTime: Timestamp;
  }
  export type ListMapsResponseEntryList = ListMapsResponseEntry[];
  export interface ListPlaceIndexesRequest {
    /**
     * An optional limit for the maximum number of results returned in a single call. Default value: 100 
     */
    MaxResults?: ListPlaceIndexesRequestMaxResultsInteger;
    /**
     * The pagination token specifying which page of results to return in the response. If no token is provided, the default page is the first page. Default value: null 
     */
    NextToken?: Token;
  }
  export type ListPlaceIndexesRequestMaxResultsInteger = number;
  export interface ListPlaceIndexesResponse {
    /**
     * Lists the place index resources that exist in your Amazon Web Services account
     */
    Entries: ListPlaceIndexesResponseEntryList;
    /**
     * A pagination token indicating that there are additional pages available. You can use the token in a new request to fetch the next page of results.
     */
    NextToken?: Token;
  }
  export interface ListPlaceIndexesResponseEntry {
    /**
     * The timestamp for when the place index resource was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    CreateTime: Timestamp;
    /**
     * The data provider of geospatial data. Values can be one of the following:    Esri     Grab     Here    For more information about data providers, see Amazon Location Service data providers.
     */
    DataSource: String;
    /**
     * The optional description for the place index resource.
     */
    Description: ResourceDescription;
    /**
     * The name of the place index resource.
     */
    IndexName: ResourceName;
    /**
     * No longer used. Always returns RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
    /**
     * The timestamp for when the place index resource was last updated in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    UpdateTime: Timestamp;
  }
  export type ListPlaceIndexesResponseEntryList = ListPlaceIndexesResponseEntry[];
  export interface ListRouteCalculatorsRequest {
    /**
     * An optional maximum number of results returned in a single call. Default Value: 100 
     */
    MaxResults?: ListRouteCalculatorsRequestMaxResultsInteger;
    /**
     * The pagination token specifying which page of results to return in the response. If no token is provided, the default page is the first page. Default Value: null 
     */
    NextToken?: Token;
  }
  export type ListRouteCalculatorsRequestMaxResultsInteger = number;
  export interface ListRouteCalculatorsResponse {
    /**
     * Lists the route calculator resources that exist in your Amazon Web Services account
     */
    Entries: ListRouteCalculatorsResponseEntryList;
    /**
     * A pagination token indicating there are additional pages available. You can use the token in a subsequent request to fetch the next set of results.
     */
    NextToken?: Token;
  }
  export interface ListRouteCalculatorsResponseEntry {
    /**
     * The name of the route calculator resource.
     */
    CalculatorName: ResourceName;
    /**
     * The timestamp when the route calculator resource was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ.    For example, 2020–07-2T12:15:20.000Z+01:00   
     */
    CreateTime: Timestamp;
    /**
     * The data provider of traffic and road network data. Indicates one of the available providers:    Esri     Grab     Here    For more information about data providers, see Amazon Location Service data providers.
     */
    DataSource: String;
    /**
     * The optional description of the route calculator resource.
     */
    Description: ResourceDescription;
    /**
     * Always returns RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
    /**
     * The timestamp when the route calculator resource was last updated in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ.    For example, 2020–07-2T12:15:20.000Z+01:00   
     */
    UpdateTime: Timestamp;
  }
  export type ListRouteCalculatorsResponseEntryList = ListRouteCalculatorsResponseEntry[];
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource whose tags you want to retrieve.   Format example: arn:aws:geo:region:account-id:resourcetype/ExampleResource   
     */
    ResourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * Tags that have been applied to the specified resource. Tags are mapped from the tag key to the tag value: "TagKey" : "TagValue".   Format example: {"tag1" : "value1", "tag2" : "value2"}    
     */
    Tags?: TagMap;
  }
  export interface ListTrackerConsumersRequest {
    /**
     * An optional limit for the number of resources returned in a single call.  Default value: 100 
     */
    MaxResults?: ListTrackerConsumersRequestMaxResultsInteger;
    /**
     * The pagination token specifying which page of results to return in the response. If no token is provided, the default page is the first page.  Default value: null 
     */
    NextToken?: Token;
    /**
     * The tracker resource whose associated geofence collections you want to list.
     */
    TrackerName: ResourceName;
  }
  export type ListTrackerConsumersRequestMaxResultsInteger = number;
  export interface ListTrackerConsumersResponse {
    /**
     * Contains the list of geofence collection ARNs associated to the tracker resource.
     */
    ConsumerArns: ArnList;
    /**
     * A pagination token indicating there are additional pages available. You can use the token in a following request to fetch the next set of results. 
     */
    NextToken?: Token;
  }
  export interface ListTrackersRequest {
    /**
     * An optional limit for the number of resources returned in a single call.  Default value: 100 
     */
    MaxResults?: ListTrackersRequestMaxResultsInteger;
    /**
     * The pagination token specifying which page of results to return in the response. If no token is provided, the default page is the first page.  Default value: null 
     */
    NextToken?: Token;
  }
  export type ListTrackersRequestMaxResultsInteger = number;
  export interface ListTrackersResponse {
    /**
     * Contains tracker resources in your Amazon Web Services account. Details include tracker name, description and timestamps for when the tracker was created and last updated.
     */
    Entries: ListTrackersResponseEntryList;
    /**
     * A pagination token indicating there are additional pages available. You can use the token in a following request to fetch the next set of results. 
     */
    NextToken?: Token;
  }
  export interface ListTrackersResponseEntry {
    /**
     * The timestamp for when the tracker resource was created in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    CreateTime: Timestamp;
    /**
     * The description for the tracker resource.
     */
    Description: ResourceDescription;
    /**
     * Always returns RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
    /**
     * No longer used. Always returns an empty string.
     */
    PricingPlanDataSource?: String;
    /**
     * The name of the tracker resource.
     */
    TrackerName: ResourceName;
    /**
     * The timestamp at which the device's position was determined. Uses  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    UpdateTime: Timestamp;
  }
  export type ListTrackersResponseEntryList = ListTrackersResponseEntry[];
  export interface MapConfiguration {
    /**
     * Specifies the political view for the style. Leave unset to not use a political view, or, for styles that support specific political views, you can choose a view, such as IND for the Indian view. Default is unset.  Not all map resources or styles support political view styles. See Political views for more information. 
     */
    PoliticalView?: CountryCode3;
    /**
     * Specifies the map style selected from an available data provider. Valid Esri map styles:    VectorEsriDarkGrayCanvas – The Esri Dark Gray Canvas map style. A vector basemap with a dark gray, neutral background with minimal colors, labels, and features that's designed to draw attention to your thematic content.     RasterEsriImagery – The Esri Imagery map style. A raster basemap that provides one meter or better satellite and aerial imagery in many parts of the world and lower resolution satellite imagery worldwide.     VectorEsriLightGrayCanvas – The Esri Light Gray Canvas map style, which provides a detailed vector basemap with a light gray, neutral background style with minimal colors, labels, and features that's designed to draw attention to your thematic content.     VectorEsriTopographic – The Esri Light map style, which provides a detailed vector basemap with a classic Esri map style.    VectorEsriStreets – The Esri Street Map style, which provides a detailed vector basemap for the world symbolized with a classic Esri street map style. The vector tile layer is similar in content and style to the World Street Map raster map.    VectorEsriNavigation – The Esri Navigation map style, which provides a detailed basemap for the world symbolized with a custom navigation map style that's designed for use during the day in mobile devices.   Valid HERE Technologies map styles:    VectorHereContrast – The HERE Contrast (Berlin) map style is a high contrast detailed base map of the world that blends 3D and 2D rendering.  The VectorHereContrast style has been renamed from VectorHereBerlin. VectorHereBerlin has been deprecated, but will continue to work in applications that use it.     VectorHereExplore – A default HERE map style containing a neutral, global map and its features including roads, buildings, landmarks, and water features. It also now includes a fully designed map of Japan.    VectorHereExploreTruck – A global map containing truck restrictions and attributes (e.g. width / height / HAZMAT) symbolized with highlighted segments and icons on top of HERE Explore to support use cases within transport and logistics.    RasterHereExploreSatellite – A global map containing high resolution satellite imagery.    HybridHereExploreSatellite – A global map displaying the road network, street names, and city labels over satellite imagery. This style will automatically retrieve both raster and vector tiles, and your charges will be based on total tiles retrieved.  Hybrid styles use both vector and raster tiles when rendering the map that you see. This means that more tiles are retrieved than when using either vector or raster tiles alone. Your charges will include all tiles retrieved.    Valid GrabMaps map styles:    VectorGrabStandardLight – The Grab Standard Light map style provides a basemap with detailed land use coloring, area names, roads, landmarks, and points of interest covering Southeast Asia.    VectorGrabStandardDark – The Grab Standard Dark map style provides a dark variation of the standard basemap covering Southeast Asia.    Grab provides maps only for countries in Southeast Asia, and is only available in the Asia Pacific (Singapore) Region (ap-southeast-1). For more information, see GrabMaps countries and area covered.  Valid Open Data map styles:    VectorOpenDataStandardLight – The Open Data Standard Light map style provides a detailed basemap for the world suitable for website and mobile application use. The map includes highways major roads, minor roads, railways, water features, cities, parks, landmarks, building footprints, and administrative boundaries.    VectorOpenDataStandardDark – Open Data Standard Dark is a dark-themed map style that provides a detailed basemap for the world suitable for website and mobile application use. The map includes highways major roads, minor roads, railways, water features, cities, parks, landmarks, building footprints, and administrative boundaries.    VectorOpenDataVisualizationLight – The Open Data Visualization Light map style is a light-themed style with muted colors and fewer features that aids in understanding overlaid data.    VectorOpenDataVisualizationDark – The Open Data Visualization Dark map style is a dark-themed style with muted colors and fewer features that aids in understanding overlaid data.  
     */
    Style: MapStyle;
  }
  export interface MapConfigurationUpdate {
    /**
     * Specifies the political view for the style. Set to an empty string to not use a political view, or, for styles that support specific political views, you can choose a view, such as IND for the Indian view.  Not all map resources or styles support political view styles. See Political views for more information. 
     */
    PoliticalView?: CountryCode3OrEmpty;
  }
  export type MapStyle = string;
  export interface Place {
    /**
     * The numerical portion of an address, such as a building number. 
     */
    AddressNumber?: String;
    /**
     * The Amazon Location categories that describe this Place. For more information about using categories, including a list of Amazon Location categories, see Categories and filtering, in the Amazon Location Service Developer Guide.
     */
    Categories?: PlaceCategoryList;
    /**
     * A country/region specified using ISO 3166 3-digit country/region code. For example, CAN.
     */
    Country?: String;
    Geometry: PlaceGeometry;
    /**
     *  True if the result is interpolated from other known places.  False if the Place is a known place. Not returned when the partner does not provide the information. For example, returns False for an address location that is found in the partner data, but returns True if an address does not exist in the partner data and its location is calculated by interpolating between other known addresses. 
     */
    Interpolated?: Boolean;
    /**
     * The full name and address of the point of interest such as a city, region, or country. For example, 123 Any Street, Any Town, USA.
     */
    Label?: String;
    /**
     * A name for a local area, such as a city or town name. For example, Toronto.
     */
    Municipality?: String;
    /**
     * The name of a community district. For example, Downtown.
     */
    Neighborhood?: String;
    /**
     * A group of numbers and letters in a country-specific format, which accompanies the address for the purpose of identifying a location. 
     */
    PostalCode?: String;
    /**
     * A name for an area or geographical division, such as a province or state name. For example, British Columbia.
     */
    Region?: String;
    /**
     * The name for a street or a road to identify a location. For example, Main Street.
     */
    Street?: String;
    /**
     * A county, or an area that's part of a larger region. For example, Metro Vancouver.
     */
    SubRegion?: String;
    /**
     * Categories from the data provider that describe the Place that are not mapped to any Amazon Location categories.
     */
    SupplementalCategories?: PlaceSupplementalCategoryList;
    /**
     * The time zone in which the Place is located. Returned only when using HERE or Grab as the selected partner.
     */
    TimeZone?: TimeZone;
    /**
     * For addresses with multiple units, the unit identifier. Can include numbers and letters, for example 3B or Unit 123.  Returned only for a place index that uses Esri or Grab as a data provider. Is not returned for SearchPlaceIndexForPosition. 
     */
    UnitNumber?: String;
    /**
     * For addresses with a UnitNumber, the type of unit. For example, Apartment.  Returned only for a place index that uses Esri as a data provider. 
     */
    UnitType?: String;
  }
  export type PlaceCategory = string;
  export type PlaceCategoryList = PlaceCategory[];
  export interface PlaceGeometry {
    /**
     * A single point geometry specifies a location for a Place using WGS 84 coordinates:    x — Specifies the x coordinate or longitude.     y — Specifies the y coordinate or latitude.   
     */
    Point?: Position;
  }
  export type PlaceId = string;
  export type PlaceIndexSearchResultLimit = number;
  export type PlaceSupplementalCategory = string;
  export type PlaceSupplementalCategoryList = PlaceSupplementalCategory[];
  export type Position = Double[];
  export type PositionFiltering = "TimeBased"|"DistanceBased"|"AccuracyBased"|string;
  export interface PositionalAccuracy {
    /**
     * Estimated maximum distance, in meters, between the measured position and the true position of a device, along the Earth's surface.
     */
    Horizontal: PositionalAccuracyHorizontalDouble;
  }
  export type PositionalAccuracyHorizontalDouble = number;
  export type PricingPlan = "RequestBasedUsage"|"MobileAssetTracking"|"MobileAssetManagement"|string;
  export type PropertyMap = {[key: string]: PropertyMapValueString};
  export type PropertyMapKeyString = string;
  export type PropertyMapValueString = string;
  export interface PutGeofenceRequest {
    /**
     * The geofence collection to store the geofence in.
     */
    CollectionName: ResourceName;
    /**
     * An identifier for the geofence. For example, ExampleGeofence-1.
     */
    GeofenceId: Id;
    /**
     * Associates one of more properties with the geofence. A property is a key-value pair stored with the geofence and added to any geofence event triggered with that geofence. Format: "key" : "value" 
     */
    GeofenceProperties?: PropertyMap;
    /**
     * Contains the details to specify the position of the geofence. Can be either a polygon or a circle. Including both will return a validation error.  Each  geofence polygon can have a maximum of 1,000 vertices. 
     */
    Geometry: GeofenceGeometry;
  }
  export interface PutGeofenceResponse {
    /**
     * The timestamp for when the geofence was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ 
     */
    CreateTime: Timestamp;
    /**
     * The geofence identifier entered in the request.
     */
    GeofenceId: Id;
    /**
     * The timestamp for when the geofence was last updated in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ 
     */
    UpdateTime: Timestamp;
  }
  export type RefererPattern = string;
  export type ResourceDescription = string;
  export type ResourceName = string;
  export type RouteMatrix = RouteMatrixRow[];
  export interface RouteMatrixEntry {
    /**
     * The total distance of travel for the route.
     */
    Distance?: RouteMatrixEntryDistanceDouble;
    /**
     * The expected duration of travel for the route.
     */
    DurationSeconds?: RouteMatrixEntryDurationSecondsDouble;
    /**
     * An error corresponding to the calculation of a route between the DeparturePosition and DestinationPosition.
     */
    Error?: RouteMatrixEntryError;
  }
  export type RouteMatrixEntryDistanceDouble = number;
  export type RouteMatrixEntryDurationSecondsDouble = number;
  export interface RouteMatrixEntryError {
    /**
     * The type of error which occurred for the route calculation.
     */
    Code: RouteMatrixErrorCode;
    /**
     * A message about the error that occurred for the route calculation.
     */
    Message?: String;
  }
  export type RouteMatrixErrorCode = "RouteNotFound"|"RouteTooLong"|"PositionsNotFound"|"DestinationPositionNotFound"|"DeparturePositionNotFound"|"OtherValidationError"|string;
  export type RouteMatrixRow = RouteMatrixEntry[];
  export interface SearchForPositionResult {
    /**
     * The distance in meters of a great-circle arc between the query position and the result.  A great-circle arc is the shortest path on a sphere, in this case the Earth. This returns the shortest distance between two locations. 
     */
    Distance: SearchForPositionResultDistanceDouble;
    /**
     * Details about the search result, such as its address and position.
     */
    Place: Place;
    /**
     * The unique identifier of the place. You can use this with the GetPlace operation to find the place again later.  For SearchPlaceIndexForPosition operations, the PlaceId is returned only by place indexes that use HERE or Grab as a data provider. 
     */
    PlaceId?: PlaceId;
  }
  export type SearchForPositionResultDistanceDouble = number;
  export type SearchForPositionResultList = SearchForPositionResult[];
  export interface SearchForSuggestionsResult {
    /**
     * The Amazon Location categories that describe the Place. For more information about using categories, including a list of Amazon Location categories, see Categories and filtering, in the Amazon Location Service Developer Guide.
     */
    Categories?: PlaceCategoryList;
    /**
     * The unique identifier of the Place. You can use this with the GetPlace operation to find the place again later, or to get full information for the Place. The GetPlace request must use the same PlaceIndex resource as the SearchPlaceIndexForSuggestions that generated the Place ID.  For SearchPlaceIndexForSuggestions operations, the PlaceId is returned by place indexes that use Esri, Grab, or HERE as data providers. 
     */
    PlaceId?: PlaceId;
    /**
     * Categories from the data provider that describe the Place that are not mapped to any Amazon Location categories.
     */
    SupplementalCategories?: PlaceSupplementalCategoryList;
    /**
     * The text of the place suggestion, typically formatted as an address string.
     */
    Text: String;
  }
  export type SearchForSuggestionsResultList = SearchForSuggestionsResult[];
  export interface SearchForTextResult {
    /**
     * The distance in meters of a great-circle arc between the bias position specified and the result. Distance will be returned only if a bias position was specified in the query.  A great-circle arc is the shortest path on a sphere, in this case the Earth. This returns the shortest distance between two locations. 
     */
    Distance?: SearchForTextResultDistanceDouble;
    /**
     * Details about the search result, such as its address and position.
     */
    Place: Place;
    /**
     * The unique identifier of the place. You can use this with the GetPlace operation to find the place again later.  For SearchPlaceIndexForText operations, the PlaceId is returned only by place indexes that use HERE or Grab as a data provider. 
     */
    PlaceId?: PlaceId;
    /**
     * The relative confidence in the match for a result among the results returned. For example, if more fields for an address match (including house number, street, city, country/region, and postal code), the relevance score is closer to 1. Returned only when the partner selected is Esri or Grab.
     */
    Relevance?: SearchForTextResultRelevanceDouble;
  }
  export type SearchForTextResultDistanceDouble = number;
  export type SearchForTextResultList = SearchForTextResult[];
  export type SearchForTextResultRelevanceDouble = number;
  export interface SearchPlaceIndexForPositionRequest {
    /**
     * The name of the place index resource you want to use for the search.
     */
    IndexName: ResourceName;
    /**
     * The optional API key to authorize the request.
     */
    Key?: ApiKey;
    /**
     * The preferred language used to return results. The value must be a valid BCP 47 language tag, for example, en for English. This setting affects the languages used in the results, but not the results themselves. If no language is specified, or not supported for a particular result, the partner automatically chooses a language for the result. For an example, we'll use the Greek language. You search for a location around Athens, Greece, with the language parameter set to en. The city in the results will most likely be returned as Athens. If you set the language parameter to el, for Greek, then the city in the results will more likely be returned as Αθήνα. If the data provider does not have a value for Greek, the result will be in a language that the provider does support.
     */
    Language?: LanguageTag;
    /**
     * An optional parameter. The maximum number of results returned per request. Default value: 50 
     */
    MaxResults?: PlaceIndexSearchResultLimit;
    /**
     * Specifies the longitude and latitude of the position to query.  This parameter must contain a pair of numbers. The first number represents the X coordinate, or longitude; the second number represents the Y coordinate, or latitude. For example, [-123.1174, 49.2847] represents a position with longitude -123.1174 and latitude 49.2847.
     */
    Position: Position;
  }
  export interface SearchPlaceIndexForPositionResponse {
    /**
     * Returns a list of Places closest to the specified position. Each result contains additional information about the Places returned.
     */
    Results: SearchForPositionResultList;
    /**
     * Contains a summary of the request. Echoes the input values for Position, Language, MaxResults, and the DataSource of the place index. 
     */
    Summary: SearchPlaceIndexForPositionSummary;
  }
  export interface SearchPlaceIndexForPositionSummary {
    /**
     * The geospatial data provider attached to the place index resource specified in the request. Values can be one of the following:   Esri   Grab   Here   For more information about data providers, see Amazon Location Service data providers.
     */
    DataSource: String;
    /**
     * The preferred language used to return results. Matches the language in the request. The value is a valid BCP 47 language tag, for example, en for English.
     */
    Language?: LanguageTag;
    /**
     * Contains the optional result count limit that is specified in the request. Default value: 50 
     */
    MaxResults?: PlaceIndexSearchResultLimit;
    /**
     * The position specified in the request.
     */
    Position: Position;
  }
  export interface SearchPlaceIndexForSuggestionsRequest {
    /**
     * An optional parameter that indicates a preference for place suggestions that are closer to a specified position.  If provided, this parameter must contain a pair of numbers. The first number represents the X coordinate, or longitude; the second number represents the Y coordinate, or latitude. For example, [-123.1174, 49.2847] represents the position with longitude -123.1174 and latitude 49.2847.   BiasPosition and FilterBBox are mutually exclusive. Specifying both options results in an error.  
     */
    BiasPosition?: Position;
    /**
     * An optional parameter that limits the search results by returning only suggestions within a specified bounding box.  If provided, this parameter must contain a total of four consecutive numbers in two pairs. The first pair of numbers represents the X and Y coordinates (longitude and latitude, respectively) of the southwest corner of the bounding box; the second pair of numbers represents the X and Y coordinates (longitude and latitude, respectively) of the northeast corner of the bounding box. For example, [-12.7935, -37.4835, -12.0684, -36.9542] represents a bounding box where the southwest corner has longitude -12.7935 and latitude -37.4835, and the northeast corner has longitude -12.0684 and latitude -36.9542.   FilterBBox and BiasPosition are mutually exclusive. Specifying both options results in an error.  
     */
    FilterBBox?: BoundingBox;
    /**
     * A list of one or more Amazon Location categories to filter the returned places. If you include more than one category, the results will include results that match any of the categories listed. For more information about using categories, including a list of Amazon Location categories, see Categories and filtering, in the Amazon Location Service Developer Guide.
     */
    FilterCategories?: FilterPlaceCategoryList;
    /**
     * An optional parameter that limits the search results by returning only suggestions within the provided list of countries.   Use the ISO 3166 3-digit country code. For example, Australia uses three upper-case characters: AUS.  
     */
    FilterCountries?: CountryCodeList;
    /**
     * The name of the place index resource you want to use for the search.
     */
    IndexName: ResourceName;
    /**
     * The optional API key to authorize the request.
     */
    Key?: ApiKey;
    /**
     * The preferred language used to return results. The value must be a valid BCP 47 language tag, for example, en for English. This setting affects the languages used in the results. If no language is specified, or not supported for a particular result, the partner automatically chooses a language for the result. For an example, we'll use the Greek language. You search for Athens, Gr to get suggestions with the language parameter set to en. The results found will most likely be returned as Athens, Greece. If you set the language parameter to el, for Greek, then the result found will more likely be returned as Αθήνα, Ελλάδα. If the data provider does not have a value for Greek, the result will be in a language that the provider does support.
     */
    Language?: LanguageTag;
    /**
     * An optional parameter. The maximum number of results returned per request.  The default: 5 
     */
    MaxResults?: SearchPlaceIndexForSuggestionsRequestMaxResultsInteger;
    /**
     * The free-form partial text to use to generate place suggestions. For example, eiffel tow.
     */
    Text: SearchPlaceIndexForSuggestionsRequestTextString;
  }
  export type SearchPlaceIndexForSuggestionsRequestMaxResultsInteger = number;
  export type SearchPlaceIndexForSuggestionsRequestTextString = string;
  export interface SearchPlaceIndexForSuggestionsResponse {
    /**
     * A list of place suggestions that best match the search text.
     */
    Results: SearchForSuggestionsResultList;
    /**
     * Contains a summary of the request. Echoes the input values for BiasPosition, FilterBBox, FilterCountries, Language, MaxResults, and Text. Also includes the DataSource of the place index. 
     */
    Summary: SearchPlaceIndexForSuggestionsSummary;
  }
  export interface SearchPlaceIndexForSuggestionsSummary {
    /**
     * Contains the coordinates for the optional bias position specified in the request. This parameter contains a pair of numbers. The first number represents the X coordinate, or longitude; the second number represents the Y coordinate, or latitude. For example, [-123.1174, 49.2847] represents the position with longitude -123.1174 and latitude 49.2847.
     */
    BiasPosition?: Position;
    /**
     * The geospatial data provider attached to the place index resource specified in the request. Values can be one of the following:   Esri   Grab   Here   For more information about data providers, see Amazon Location Service data providers.
     */
    DataSource: String;
    /**
     * Contains the coordinates for the optional bounding box specified in the request.
     */
    FilterBBox?: BoundingBox;
    /**
     * The optional category filter specified in the request.
     */
    FilterCategories?: FilterPlaceCategoryList;
    /**
     * Contains the optional country filter specified in the request.
     */
    FilterCountries?: CountryCodeList;
    /**
     * The preferred language used to return results. Matches the language in the request. The value is a valid BCP 47 language tag, for example, en for English.
     */
    Language?: LanguageTag;
    /**
     * Contains the optional result count limit specified in the request.
     */
    MaxResults?: Integer;
    /**
     * The free-form partial text input specified in the request.
     */
    Text: SensitiveString;
  }
  export interface SearchPlaceIndexForTextRequest {
    /**
     * An optional parameter that indicates a preference for places that are closer to a specified position.  If provided, this parameter must contain a pair of numbers. The first number represents the X coordinate, or longitude; the second number represents the Y coordinate, or latitude. For example, [-123.1174, 49.2847] represents the position with longitude -123.1174 and latitude 49.2847.   BiasPosition and FilterBBox are mutually exclusive. Specifying both options results in an error.  
     */
    BiasPosition?: Position;
    /**
     * An optional parameter that limits the search results by returning only places that are within the provided bounding box.  If provided, this parameter must contain a total of four consecutive numbers in two pairs. The first pair of numbers represents the X and Y coordinates (longitude and latitude, respectively) of the southwest corner of the bounding box; the second pair of numbers represents the X and Y coordinates (longitude and latitude, respectively) of the northeast corner of the bounding box. For example, [-12.7935, -37.4835, -12.0684, -36.9542] represents a bounding box where the southwest corner has longitude -12.7935 and latitude -37.4835, and the northeast corner has longitude -12.0684 and latitude -36.9542.   FilterBBox and BiasPosition are mutually exclusive. Specifying both options results in an error.  
     */
    FilterBBox?: BoundingBox;
    /**
     * A list of one or more Amazon Location categories to filter the returned places. If you include more than one category, the results will include results that match any of the categories listed. For more information about using categories, including a list of Amazon Location categories, see Categories and filtering, in the Amazon Location Service Developer Guide.
     */
    FilterCategories?: FilterPlaceCategoryList;
    /**
     * An optional parameter that limits the search results by returning only places that are in a specified list of countries.   Valid values include ISO 3166 3-digit country codes. For example, Australia uses three upper-case characters: AUS.  
     */
    FilterCountries?: CountryCodeList;
    /**
     * The name of the place index resource you want to use for the search.
     */
    IndexName: ResourceName;
    /**
     * The optional API key to authorize the request.
     */
    Key?: ApiKey;
    /**
     * The preferred language used to return results. The value must be a valid BCP 47 language tag, for example, en for English. This setting affects the languages used in the results, but not the results themselves. If no language is specified, or not supported for a particular result, the partner automatically chooses a language for the result. For an example, we'll use the Greek language. You search for Athens, Greece, with the language parameter set to en. The result found will most likely be returned as Athens. If you set the language parameter to el, for Greek, then the result found will more likely be returned as Αθήνα. If the data provider does not have a value for Greek, the result will be in a language that the provider does support.
     */
    Language?: LanguageTag;
    /**
     * An optional parameter. The maximum number of results returned per request.  The default: 50 
     */
    MaxResults?: PlaceIndexSearchResultLimit;
    /**
     * The address, name, city, or region to be used in the search in free-form text format. For example, 123 Any Street.
     */
    Text: SearchPlaceIndexForTextRequestTextString;
  }
  export type SearchPlaceIndexForTextRequestTextString = string;
  export interface SearchPlaceIndexForTextResponse {
    /**
     * A list of Places matching the input text. Each result contains additional information about the specific point of interest.  Not all response properties are included with all responses. Some properties may only be returned by specific data partners.
     */
    Results: SearchForTextResultList;
    /**
     * Contains a summary of the request. Echoes the input values for BiasPosition, FilterBBox, FilterCountries, Language, MaxResults, and Text. Also includes the DataSource of the place index and the bounding box, ResultBBox, which surrounds the search results. 
     */
    Summary: SearchPlaceIndexForTextSummary;
  }
  export interface SearchPlaceIndexForTextSummary {
    /**
     * Contains the coordinates for the optional bias position specified in the request. This parameter contains a pair of numbers. The first number represents the X coordinate, or longitude; the second number represents the Y coordinate, or latitude. For example, [-123.1174, 49.2847] represents the position with longitude -123.1174 and latitude 49.2847.
     */
    BiasPosition?: Position;
    /**
     * The geospatial data provider attached to the place index resource specified in the request. Values can be one of the following:   Esri   Grab   Here   For more information about data providers, see Amazon Location Service data providers.
     */
    DataSource: String;
    /**
     * Contains the coordinates for the optional bounding box specified in the request.
     */
    FilterBBox?: BoundingBox;
    /**
     * The optional category filter specified in the request.
     */
    FilterCategories?: FilterPlaceCategoryList;
    /**
     * Contains the optional country filter specified in the request.
     */
    FilterCountries?: CountryCodeList;
    /**
     * The preferred language used to return results. Matches the language in the request. The value is a valid BCP 47 language tag, for example, en for English.
     */
    Language?: LanguageTag;
    /**
     * Contains the optional result count limit specified in the request.
     */
    MaxResults?: PlaceIndexSearchResultLimit;
    /**
     * The bounding box that fully contains all search results.  If you specified the optional FilterBBox parameter in the request, ResultBBox is contained within FilterBBox. 
     */
    ResultBBox?: BoundingBox;
    /**
     * The search text specified in the request.
     */
    Text: SensitiveString;
  }
  export type SensitiveString = string;
  export type Status = "Active"|"Expired"|string;
  export interface Step {
    /**
     * The travel distance between the step's StartPosition and EndPosition.
     */
    Distance: StepDistanceDouble;
    /**
     * The estimated travel time, in seconds, from the step's StartPosition to the EndPosition. . The travel mode and departure time that you specify in the request determines the calculated time.
     */
    DurationSeconds: StepDurationSecondsDouble;
    /**
     * The end position of a step. If the position the last step in the leg, this position is the same as the end position of the leg.
     */
    EndPosition: Position;
    /**
     * Represents the start position, or index, in a sequence of steps within the leg's line string geometry. For example, the index of the first step in a leg geometry is 0.  Included in the response for queries that set IncludeLegGeometry to True. 
     */
    GeometryOffset?: StepGeometryOffsetInteger;
    /**
     * The starting position of a step. If the position is the first step in the leg, this position is the same as the start position of the leg.
     */
    StartPosition: Position;
  }
  export type StepDistanceDouble = number;
  export type StepDurationSecondsDouble = number;
  export type StepGeometryOffsetInteger = number;
  export type StepList = Step[];
  export type String = string;
  export type TagKey = string;
  export type TagKeys = String[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource whose tags you want to update.   Format example: arn:aws:geo:region:account-id:resourcetype/ExampleResource   
     */
    ResourceArn: Arn;
    /**
     * Applies one or more tags to specific resource. A tag is a key-value pair that helps you manage, identify, search, and filter your resources. Format: "key" : "value"  Restrictions:   Maximum 50 tags per resource.   Each tag key must be unique and must have exactly one associated value.   Maximum key length: 128 Unicode characters in UTF-8.   Maximum value length: 256 Unicode characters in UTF-8.   Can use alphanumeric characters (A–Z, a–z, 0–9), and the following characters: + - = . _ : / @   Cannot use "aws:" as a prefix for a key.  
     */
    Tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface TimeZone {
    /**
     * The name of the time zone, following the  IANA time zone standard. For example, America/Los_Angeles.
     */
    Name: String;
    /**
     * The time zone's offset, in seconds, from UTC.
     */
    Offset?: Integer;
  }
  export type Timestamp = Date;
  export type Token = string;
  export interface TrackingFilterGeometry {
    /**
     * The set of arrays which define the polygon. A polygon can have between 4 and 1000 vertices.
     */
    Polygon?: LinearRings;
  }
  export type TravelMode = "Car"|"Truck"|"Walking"|"Bicycle"|"Motorcycle"|string;
  export interface TruckDimensions {
    /**
     * The height of the truck.   For example, 4.5.     For routes calculated with a HERE resource, this value must be between 0 and 50 meters.  
     */
    Height?: TruckDimensionsHeightDouble;
    /**
     * The length of the truck.   For example, 15.5.     For routes calculated with a HERE resource, this value must be between 0 and 300 meters.  
     */
    Length?: TruckDimensionsLengthDouble;
    /**
     *  Specifies the unit of measurement for the truck dimensions. Default Value: Meters 
     */
    Unit?: DimensionUnit;
    /**
     * The width of the truck.   For example, 4.5.     For routes calculated with a HERE resource, this value must be between 0 and 50 meters.  
     */
    Width?: TruckDimensionsWidthDouble;
  }
  export type TruckDimensionsHeightDouble = number;
  export type TruckDimensionsLengthDouble = number;
  export type TruckDimensionsWidthDouble = number;
  export interface TruckWeight {
    /**
     * The total weight of the truck.    For example, 3500.  
     */
    Total?: TruckWeightTotalDouble;
    /**
     * The unit of measurement to use for the truck weight. Default Value: Kilograms 
     */
    Unit?: VehicleWeightUnit;
  }
  export type TruckWeightTotalDouble = number;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource from which you want to remove tags.   Format example: arn:aws:geo:region:account-id:resourcetype/ExampleResource   
     */
    ResourceArn: Arn;
    /**
     * The list of tag keys to remove from the specified resource.
     */
    TagKeys: TagKeys;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateGeofenceCollectionRequest {
    /**
     * The name of the geofence collection to update.
     */
    CollectionName: ResourceName;
    /**
     * Updates the description for the geofence collection.
     */
    Description?: ResourceDescription;
    /**
     * No longer used. If included, the only allowed value is RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
    /**
     * This parameter is no longer used.
     */
    PricingPlanDataSource?: String;
  }
  export interface UpdateGeofenceCollectionResponse {
    /**
     * The Amazon Resource Name (ARN) of the updated geofence collection. Used to specify a resource across Amazon Web Services.   Format example: arn:aws:geo:region:account-id:geofence-collection/ExampleGeofenceCollection   
     */
    CollectionArn: Arn;
    /**
     * The name of the updated geofence collection.
     */
    CollectionName: ResourceName;
    /**
     * The time when the geofence collection was last updated in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ 
     */
    UpdateTime: Timestamp;
  }
  export interface UpdateKeyRequest {
    /**
     * Updates the description for the API key resource.
     */
    Description?: ResourceDescription;
    /**
     * Updates the timestamp for when the API key resource will expire in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    ExpireTime?: Timestamp;
    /**
     * The boolean flag to be included for updating ExpireTime or Restrictions details. Must be set to true to update an API key resource that has been used in the past 7 days.  False if force update is not preferred Default value: False 
     */
    ForceUpdate?: Boolean;
    /**
     * The name of the API key resource to update.
     */
    KeyName: ResourceName;
    /**
     * Whether the API key should expire. Set to true to set the API key to have no expiration time.
     */
    NoExpiry?: Boolean;
    /**
     * Updates the API key restrictions for the API key resource.
     */
    Restrictions?: ApiKeyRestrictions;
  }
  export interface UpdateKeyResponse {
    /**
     * The Amazon Resource Name (ARN) for the API key resource. Used when you need to specify a resource across all Amazon Web Services.   Format example: arn:aws:geo:region:account-id:key/ExampleKey   
     */
    KeyArn: Arn;
    /**
     * The name of the API key resource.
     */
    KeyName: ResourceName;
    /**
     * The timestamp for when the API key resource was last updated in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    UpdateTime: Timestamp;
  }
  export interface UpdateMapRequest {
    /**
     * Updates the parts of the map configuration that can be updated, including the political view.
     */
    ConfigurationUpdate?: MapConfigurationUpdate;
    /**
     * Updates the description for the map resource.
     */
    Description?: ResourceDescription;
    /**
     * The name of the map resource to update.
     */
    MapName: ResourceName;
    /**
     * No longer used. If included, the only allowed value is RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
  }
  export interface UpdateMapResponse {
    /**
     * The Amazon Resource Name (ARN) of the updated map resource. Used to specify a resource across AWS.   Format example: arn:aws:geo:region:account-id:map/ExampleMap   
     */
    MapArn: GeoArn;
    /**
     * The name of the updated map resource.
     */
    MapName: ResourceName;
    /**
     * The timestamp for when the map resource was last updated in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    UpdateTime: Timestamp;
  }
  export interface UpdatePlaceIndexRequest {
    /**
     * Updates the data storage option for the place index resource.
     */
    DataSourceConfiguration?: DataSourceConfiguration;
    /**
     * Updates the description for the place index resource.
     */
    Description?: ResourceDescription;
    /**
     * The name of the place index resource to update.
     */
    IndexName: ResourceName;
    /**
     * No longer used. If included, the only allowed value is RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
  }
  export interface UpdatePlaceIndexResponse {
    /**
     * The Amazon Resource Name (ARN) of the upated place index resource. Used to specify a resource across Amazon Web Services.   Format example: arn:aws:geo:region:account-id:place- index/ExamplePlaceIndex   
     */
    IndexArn: GeoArn;
    /**
     * The name of the updated place index resource.
     */
    IndexName: ResourceName;
    /**
     * The timestamp for when the place index resource was last updated in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    UpdateTime: Timestamp;
  }
  export interface UpdateRouteCalculatorRequest {
    /**
     * The name of the route calculator resource to update.
     */
    CalculatorName: ResourceName;
    /**
     * Updates the description for the route calculator resource.
     */
    Description?: ResourceDescription;
    /**
     * No longer used. If included, the only allowed value is RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
  }
  export interface UpdateRouteCalculatorResponse {
    /**
     * The Amazon Resource Name (ARN) of the updated route calculator resource. Used to specify a resource across AWS.   Format example: arn:aws:geo:region:account-id:route- calculator/ExampleCalculator   
     */
    CalculatorArn: GeoArn;
    /**
     * The name of the updated route calculator resource.
     */
    CalculatorName: ResourceName;
    /**
     * The timestamp for when the route calculator was last updated in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    UpdateTime: Timestamp;
  }
  export interface UpdateTrackerRequest {
    /**
     * Updates the description for the tracker resource.
     */
    Description?: ResourceDescription;
    /**
     * Whether to enable position UPDATE events from this tracker to be sent to EventBridge.  You do not need enable this feature to get ENTER and EXIT events for geofences with this tracker. Those events are always sent to EventBridge. 
     */
    EventBridgeEnabled?: Boolean;
    /**
     * Enables GeospatialQueries for a tracker that uses a Amazon Web Services KMS customer managed key. This parameter is only used if you are using a KMS customer managed key.
     */
    KmsKeyEnableGeospatialQueries?: Boolean;
    /**
     * Updates the position filtering for the tracker resource. Valid values:    TimeBased - Location updates are evaluated against linked geofence collections, but not every location update is stored. If your update frequency is more often than 30 seconds, only one update per 30 seconds is stored for each unique device ID.     DistanceBased - If the device has moved less than 30 m (98.4 ft), location updates are ignored. Location updates within this distance are neither evaluated against linked geofence collections, nor stored. This helps control costs by reducing the number of geofence evaluations and historical device positions to paginate through. Distance-based filtering can also reduce the effects of GPS noise when displaying device trajectories on a map.     AccuracyBased - If the device has moved less than the measured accuracy, location updates are ignored. For example, if two consecutive updates from a device have a horizontal accuracy of 5 m and 10 m, the second update is ignored if the device has moved less than 15 m. Ignored location updates are neither evaluated against linked geofence collections, nor stored. This helps educe the effects of GPS noise when displaying device trajectories on a map, and can help control costs by reducing the number of geofence evaluations.   
     */
    PositionFiltering?: PositionFiltering;
    /**
     * No longer used. If included, the only allowed value is RequestBasedUsage.
     */
    PricingPlan?: PricingPlan;
    /**
     * This parameter is no longer used.
     */
    PricingPlanDataSource?: String;
    /**
     * The name of the tracker resource to update.
     */
    TrackerName: ResourceName;
  }
  export interface UpdateTrackerResponse {
    /**
     * The Amazon Resource Name (ARN) of the updated tracker resource. Used to specify a resource across AWS.   Format example: arn:aws:geo:region:account-id:tracker/ExampleTracker   
     */
    TrackerArn: Arn;
    /**
     * The name of the updated tracker resource.
     */
    TrackerName: ResourceName;
    /**
     * The timestamp for when the tracker resource was last updated in  ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    UpdateTime: Timestamp;
  }
  export type VehicleWeightUnit = "Kilograms"|"Pounds"|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-11-19"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Location client.
   */
  export import Types = Location;
}
export = Location;
