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
   * Evaluates device positions against the geofence geometries from a given geofence collection. This operation always returns an empty response because geofences are asynchronously evaluated. The evaluation determines if the device has entered or exited a geofenced area, and then publishes one of the following events to Amazon EventBridge:    ENTER if Amazon Location determines that the tracked device has entered a geofenced area.    EXIT if Amazon Location determines that the tracked device has exited a geofenced area.    The last geofence that a device was observed within is tracked for 30 days after the most recent device position update. 
   */
  batchEvaluateGeofences(params: Location.Types.BatchEvaluateGeofencesRequest, callback?: (err: AWSError, data: Location.Types.BatchEvaluateGeofencesResponse) => void): Request<Location.Types.BatchEvaluateGeofencesResponse, AWSError>;
  /**
   * Evaluates device positions against the geofence geometries from a given geofence collection. This operation always returns an empty response because geofences are asynchronously evaluated. The evaluation determines if the device has entered or exited a geofenced area, and then publishes one of the following events to Amazon EventBridge:    ENTER if Amazon Location determines that the tracked device has entered a geofenced area.    EXIT if Amazon Location determines that the tracked device has exited a geofenced area.    The last geofence that a device was observed within is tracked for 30 days after the most recent device position update. 
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
   * Uploads position update data for one or more devices to a tracker resource. Amazon Location uses the data when it reports the last known device position and position history. Amazon Location retains location data for 30 days.  Position updates are handled based on the PositionFiltering property of the tracker. When PositionFiltering is set to TimeBased, updates are evaluated against linked geofence collections, and location data is stored at a maximum of one position per 30 second interval. If your update frequency is more often than every 30 seconds, only one update per 30 seconds is stored for each unique device ID. When PositionFiltering is set to DistanceBased filtering, location data is stored and evaluated against linked geofence collections only if the device has moved more than 30 m (98.4 ft). 
   */
  batchUpdateDevicePosition(params: Location.Types.BatchUpdateDevicePositionRequest, callback?: (err: AWSError, data: Location.Types.BatchUpdateDevicePositionResponse) => void): Request<Location.Types.BatchUpdateDevicePositionResponse, AWSError>;
  /**
   * Uploads position update data for one or more devices to a tracker resource. Amazon Location uses the data when it reports the last known device position and position history. Amazon Location retains location data for 30 days.  Position updates are handled based on the PositionFiltering property of the tracker. When PositionFiltering is set to TimeBased, updates are evaluated against linked geofence collections, and location data is stored at a maximum of one position per 30 second interval. If your update frequency is more often than every 30 seconds, only one update per 30 seconds is stored for each unique device ID. When PositionFiltering is set to DistanceBased filtering, location data is stored and evaluated against linked geofence collections only if the device has moved more than 30 m (98.4 ft). 
   */
  batchUpdateDevicePosition(callback?: (err: AWSError, data: Location.Types.BatchUpdateDevicePositionResponse) => void): Request<Location.Types.BatchUpdateDevicePositionResponse, AWSError>;
  /**
   *  Calculates a route given the following required parameters: DeparturePostiton and DestinationPosition. Requires that you first create a route calculator resource  By default, a request that doesn't specify a departure time uses the best time of day to travel with the best traffic conditions when calculating the route. Additional options include:    Specifying a departure time using either DepartureTime or DepartureNow. This calculates a route based on predictive traffic data at the given time.   You can't specify both DepartureTime and DepartureNow in a single request. Specifying both parameters returns an error message.     Specifying a travel mode using TravelMode. This lets you specify an additional route preference such as CarModeOptions if traveling by Car, or TruckModeOptions if traveling by Truck.    
   */
  calculateRoute(params: Location.Types.CalculateRouteRequest, callback?: (err: AWSError, data: Location.Types.CalculateRouteResponse) => void): Request<Location.Types.CalculateRouteResponse, AWSError>;
  /**
   *  Calculates a route given the following required parameters: DeparturePostiton and DestinationPosition. Requires that you first create a route calculator resource  By default, a request that doesn't specify a departure time uses the best time of day to travel with the best traffic conditions when calculating the route. Additional options include:    Specifying a departure time using either DepartureTime or DepartureNow. This calculates a route based on predictive traffic data at the given time.   You can't specify both DepartureTime and DepartureNow in a single request. Specifying both parameters returns an error message.     Specifying a travel mode using TravelMode. This lets you specify an additional route preference such as CarModeOptions if traveling by Car, or TruckModeOptions if traveling by Truck.    
   */
  calculateRoute(callback?: (err: AWSError, data: Location.Types.CalculateRouteResponse) => void): Request<Location.Types.CalculateRouteResponse, AWSError>;
  /**
   * Creates a geofence collection, which manages and stores geofences.
   */
  createGeofenceCollection(params: Location.Types.CreateGeofenceCollectionRequest, callback?: (err: AWSError, data: Location.Types.CreateGeofenceCollectionResponse) => void): Request<Location.Types.CreateGeofenceCollectionResponse, AWSError>;
  /**
   * Creates a geofence collection, which manages and stores geofences.
   */
  createGeofenceCollection(callback?: (err: AWSError, data: Location.Types.CreateGeofenceCollectionResponse) => void): Request<Location.Types.CreateGeofenceCollectionResponse, AWSError>;
  /**
   * Creates a map resource in your AWS account, which provides map tiles of different styles sourced from global location data providers.
   */
  createMap(params: Location.Types.CreateMapRequest, callback?: (err: AWSError, data: Location.Types.CreateMapResponse) => void): Request<Location.Types.CreateMapResponse, AWSError>;
  /**
   * Creates a map resource in your AWS account, which provides map tiles of different styles sourced from global location data providers.
   */
  createMap(callback?: (err: AWSError, data: Location.Types.CreateMapResponse) => void): Request<Location.Types.CreateMapResponse, AWSError>;
  /**
   * Creates a place index resource in your AWS account, which supports functions with geospatial data sourced from your chosen data provider.
   */
  createPlaceIndex(params: Location.Types.CreatePlaceIndexRequest, callback?: (err: AWSError, data: Location.Types.CreatePlaceIndexResponse) => void): Request<Location.Types.CreatePlaceIndexResponse, AWSError>;
  /**
   * Creates a place index resource in your AWS account, which supports functions with geospatial data sourced from your chosen data provider.
   */
  createPlaceIndex(callback?: (err: AWSError, data: Location.Types.CreatePlaceIndexResponse) => void): Request<Location.Types.CreatePlaceIndexResponse, AWSError>;
  /**
   * Creates a route calculator resource in your AWS account. You can send requests to a route calculator resource to estimate travel time, distance, and get directions. A route calculator sources traffic and road network data from your chosen data provider.
   */
  createRouteCalculator(params: Location.Types.CreateRouteCalculatorRequest, callback?: (err: AWSError, data: Location.Types.CreateRouteCalculatorResponse) => void): Request<Location.Types.CreateRouteCalculatorResponse, AWSError>;
  /**
   * Creates a route calculator resource in your AWS account. You can send requests to a route calculator resource to estimate travel time, distance, and get directions. A route calculator sources traffic and road network data from your chosen data provider.
   */
  createRouteCalculator(callback?: (err: AWSError, data: Location.Types.CreateRouteCalculatorResponse) => void): Request<Location.Types.CreateRouteCalculatorResponse, AWSError>;
  /**
   * Creates a tracker resource in your AWS account, which lets you retrieve current and historical location of devices.
   */
  createTracker(params: Location.Types.CreateTrackerRequest, callback?: (err: AWSError, data: Location.Types.CreateTrackerResponse) => void): Request<Location.Types.CreateTrackerResponse, AWSError>;
  /**
   * Creates a tracker resource in your AWS account, which lets you retrieve current and historical location of devices.
   */
  createTracker(callback?: (err: AWSError, data: Location.Types.CreateTrackerResponse) => void): Request<Location.Types.CreateTrackerResponse, AWSError>;
  /**
   * Deletes a geofence collection from your AWS account.  This operation deletes the resource permanently. If the geofence collection is the target of a tracker resource, the devices will no longer be monitored. 
   */
  deleteGeofenceCollection(params: Location.Types.DeleteGeofenceCollectionRequest, callback?: (err: AWSError, data: Location.Types.DeleteGeofenceCollectionResponse) => void): Request<Location.Types.DeleteGeofenceCollectionResponse, AWSError>;
  /**
   * Deletes a geofence collection from your AWS account.  This operation deletes the resource permanently. If the geofence collection is the target of a tracker resource, the devices will no longer be monitored. 
   */
  deleteGeofenceCollection(callback?: (err: AWSError, data: Location.Types.DeleteGeofenceCollectionResponse) => void): Request<Location.Types.DeleteGeofenceCollectionResponse, AWSError>;
  /**
   * Deletes a map resource from your AWS account.  This operation deletes the resource permanently. If the map is being used in an application, the map may not render. 
   */
  deleteMap(params: Location.Types.DeleteMapRequest, callback?: (err: AWSError, data: Location.Types.DeleteMapResponse) => void): Request<Location.Types.DeleteMapResponse, AWSError>;
  /**
   * Deletes a map resource from your AWS account.  This operation deletes the resource permanently. If the map is being used in an application, the map may not render. 
   */
  deleteMap(callback?: (err: AWSError, data: Location.Types.DeleteMapResponse) => void): Request<Location.Types.DeleteMapResponse, AWSError>;
  /**
   * Deletes a place index resource from your AWS account.  This operation deletes the resource permanently. 
   */
  deletePlaceIndex(params: Location.Types.DeletePlaceIndexRequest, callback?: (err: AWSError, data: Location.Types.DeletePlaceIndexResponse) => void): Request<Location.Types.DeletePlaceIndexResponse, AWSError>;
  /**
   * Deletes a place index resource from your AWS account.  This operation deletes the resource permanently. 
   */
  deletePlaceIndex(callback?: (err: AWSError, data: Location.Types.DeletePlaceIndexResponse) => void): Request<Location.Types.DeletePlaceIndexResponse, AWSError>;
  /**
   * Deletes a route calculator resource from your AWS account.  This operation deletes the resource permanently. 
   */
  deleteRouteCalculator(params: Location.Types.DeleteRouteCalculatorRequest, callback?: (err: AWSError, data: Location.Types.DeleteRouteCalculatorResponse) => void): Request<Location.Types.DeleteRouteCalculatorResponse, AWSError>;
  /**
   * Deletes a route calculator resource from your AWS account.  This operation deletes the resource permanently. 
   */
  deleteRouteCalculator(callback?: (err: AWSError, data: Location.Types.DeleteRouteCalculatorResponse) => void): Request<Location.Types.DeleteRouteCalculatorResponse, AWSError>;
  /**
   * Deletes a tracker resource from your AWS account.  This operation deletes the resource permanently. If the tracker resource is in use, you may encounter an error. Make sure that the target resource isn't a dependency for your applications. 
   */
  deleteTracker(params: Location.Types.DeleteTrackerRequest, callback?: (err: AWSError, data: Location.Types.DeleteTrackerResponse) => void): Request<Location.Types.DeleteTrackerResponse, AWSError>;
  /**
   * Deletes a tracker resource from your AWS account.  This operation deletes the resource permanently. If the tracker resource is in use, you may encounter an error. Make sure that the target resource isn't a dependency for your applications. 
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
   * A batch request to retrieve all device positions.
   */
  listDevicePositions(params: Location.Types.ListDevicePositionsRequest, callback?: (err: AWSError, data: Location.Types.ListDevicePositionsResponse) => void): Request<Location.Types.ListDevicePositionsResponse, AWSError>;
  /**
   * A batch request to retrieve all device positions.
   */
  listDevicePositions(callback?: (err: AWSError, data: Location.Types.ListDevicePositionsResponse) => void): Request<Location.Types.ListDevicePositionsResponse, AWSError>;
  /**
   * Lists geofence collections in your AWS account.
   */
  listGeofenceCollections(params: Location.Types.ListGeofenceCollectionsRequest, callback?: (err: AWSError, data: Location.Types.ListGeofenceCollectionsResponse) => void): Request<Location.Types.ListGeofenceCollectionsResponse, AWSError>;
  /**
   * Lists geofence collections in your AWS account.
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
   * Lists map resources in your AWS account.
   */
  listMaps(params: Location.Types.ListMapsRequest, callback?: (err: AWSError, data: Location.Types.ListMapsResponse) => void): Request<Location.Types.ListMapsResponse, AWSError>;
  /**
   * Lists map resources in your AWS account.
   */
  listMaps(callback?: (err: AWSError, data: Location.Types.ListMapsResponse) => void): Request<Location.Types.ListMapsResponse, AWSError>;
  /**
   * Lists place index resources in your AWS account.
   */
  listPlaceIndexes(params: Location.Types.ListPlaceIndexesRequest, callback?: (err: AWSError, data: Location.Types.ListPlaceIndexesResponse) => void): Request<Location.Types.ListPlaceIndexesResponse, AWSError>;
  /**
   * Lists place index resources in your AWS account.
   */
  listPlaceIndexes(callback?: (err: AWSError, data: Location.Types.ListPlaceIndexesResponse) => void): Request<Location.Types.ListPlaceIndexesResponse, AWSError>;
  /**
   * Lists route calculator resources in your AWS account.
   */
  listRouteCalculators(params: Location.Types.ListRouteCalculatorsRequest, callback?: (err: AWSError, data: Location.Types.ListRouteCalculatorsResponse) => void): Request<Location.Types.ListRouteCalculatorsResponse, AWSError>;
  /**
   * Lists route calculator resources in your AWS account.
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
   * Lists tracker resources in your AWS account.
   */
  listTrackers(params: Location.Types.ListTrackersRequest, callback?: (err: AWSError, data: Location.Types.ListTrackersResponse) => void): Request<Location.Types.ListTrackersResponse, AWSError>;
  /**
   * Lists tracker resources in your AWS account.
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
   * Geocodes free-form text, such as an address, name, city, or region to allow you to search for Places or points of interest.  Includes the option to apply additional parameters to narrow your list of results.  You can search for places near a given position using BiasPosition, or filter results within a bounding box using FilterBBox. Providing both parameters simultaneously returns an error. 
   */
  searchPlaceIndexForText(params: Location.Types.SearchPlaceIndexForTextRequest, callback?: (err: AWSError, data: Location.Types.SearchPlaceIndexForTextResponse) => void): Request<Location.Types.SearchPlaceIndexForTextResponse, AWSError>;
  /**
   * Geocodes free-form text, such as an address, name, city, or region to allow you to search for Places or points of interest.  Includes the option to apply additional parameters to narrow your list of results.  You can search for places near a given position using BiasPosition, or filter results within a bounding box using FilterBBox. Providing both parameters simultaneously returns an error. 
   */
  searchPlaceIndexForText(callback?: (err: AWSError, data: Location.Types.SearchPlaceIndexForTextResponse) => void): Request<Location.Types.SearchPlaceIndexForTextResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified Amazon Location Service resource.  &lt;p&gt;Tags can help you organize and categorize your resources. You can also use them to scope user permissions, by granting a user permission to access or change only resources with certain tag values.&lt;/p&gt; &lt;p&gt;You can use the &lt;code&gt;TagResource&lt;/code&gt; operation with an Amazon Location Service resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the tags already associated with the resource. If you specify a tag key that's already associated with the resource, the new tag value that you specify replaces the previous value for that tag. &lt;/p&gt; &lt;p&gt;You can associate up to 50 tags with a resource.&lt;/p&gt; 
   */
  tagResource(params: Location.Types.TagResourceRequest, callback?: (err: AWSError, data: Location.Types.TagResourceResponse) => void): Request<Location.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified Amazon Location Service resource.  &lt;p&gt;Tags can help you organize and categorize your resources. You can also use them to scope user permissions, by granting a user permission to access or change only resources with certain tag values.&lt;/p&gt; &lt;p&gt;You can use the &lt;code&gt;TagResource&lt;/code&gt; operation with an Amazon Location Service resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the tags already associated with the resource. If you specify a tag key that's already associated with the resource, the new tag value that you specify replaces the previous value for that tag. &lt;/p&gt; &lt;p&gt;You can associate up to 50 tags with a resource.&lt;/p&gt; 
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
  export type Arn = string;
  export type ArnList = Arn[];
  export interface AssociateTrackerConsumerRequest {
    /**
     * The Amazon Resource Name (ARN) for the geofence collection to be associated to tracker resource. Used when you need to specify a resource across all AWS.   Format example: arn:aws:geo:region:account-id:geofence-collection/ExampleGeofenceCollectionConsumer   
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
     * Contains the polygon details to specify the position of the geofence.  Each geofence polygon can have a maximum of 1,000 vertices. 
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
     * Contains the position update details for each device.
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
  export interface CalculateRouteRequest {
    /**
     * The name of the route calculator resource that you want to use to calculate a route. 
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
     * The start position for the route. Defined in WGS 84 format: [longitude, latitude].   For example, [-123.115, 49.285]     If you specify a departure that's not located on a road, Amazon Location moves the position to the nearest road. If Esri is the provider for your route calculator, specifying a route that is longer than 400 km returns a 400 RoutesValidationException error.  Valid Values: [-180 to 180,-90 to 90] 
     */
    DeparturePosition: Position;
    /**
     * Specifies the desired time of departure. Uses the given time to calculate a route. Otherwise, the best time of day to travel with the best traffic conditions is used to calculate the route.  Setting a departure time in the past returns a 400 ValidationException error.    In ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. For example, 2020–07-2T12:15:20.000Z+01:00   
     */
    DepartureTime?: Timestamp;
    /**
     * The finish position for the route. Defined in WGS 84 format: [longitude, latitude].    For example, [-122.339, 47.615]     If you specify a destination that's not located on a road, Amazon Location moves the position to the nearest road.   Valid Values: [-180 to 180,-90 to 90] 
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
     * Specifies the mode of transport when calculating a route. Used in estimating the speed of travel and road compatibility. The TravelMode you specify determines how you specify route preferences:    If traveling by Car use the CarModeOptions parameter.   If traveling by Truck use the TruckModeOptions parameter.   Default Value: Car 
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
     * The data provider of traffic and road network data used to calculate the route. Indicates one of the available providers:    Esri     Here    For more information about data providers, see Amazon Location Service data providers.
     */
    DataSource: String;
    /**
     * The total distance covered by the route. The sum of the distance travelled between every stop on the route.  If Esri is the data source for the route calculator, the route distance can’t be greater than 400 km. If the route exceeds 400 km, the response is a 400 RoutesValidationException error. 
     */
    Distance: CalculateRouteSummaryDistanceDouble;
    /**
     * The unit of measurement for the distance.
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
     * Avoids ferries when calculating routes. Default Value: false  Valid Values: false | true 
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
  export type CountryCode = string;
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
     * A key identifier for an AWS KMS customer managed key. Enter a key ID, key ARN, alias name, or alias ARN. 
     */
    KmsKeyId?: KmsKeyId;
    /**
     * Specifies the pricing plan for the geofence collection. For additional details and restrictions on each pricing plan option, see the Amazon Location Service pricing page.
     */
    PricingPlan: PricingPlan;
    /**
     * Specifies the data provider for the geofence collection.   Required value for the following pricing plans: MobileAssetTracking | MobileAssetManagement    For more information about Data Providers, and Pricing plans, see the Amazon Location Service product page.  Amazon Location Service only uses PricingPlanDataSource to calculate billing for your geofence collection. Your data won't be shared with the data provider, and will remain in your AWS account or Region unless you move it.  Valid Values: Esri | Here 
     */
    PricingPlanDataSource?: String;
    /**
     * Applies one or more tags to the geofence collection. A tag is a key-value pair helps manage, identify, search, and filter your resources by labelling them. Format: "key" : "value"  Restrictions:   Maximum 50 tags per resource   Each resource tag must be unique with a maximum of one value.   Maximum key length: 128 Unicode characters in UTF-8   Maximum value length: 256 Unicode characters in UTF-8   Can use alphanumeric characters (A–Z, a–z, 0–9), and the following characters: + - = . _ : / @.   
     */
    Tags?: TagMap;
  }
  export interface CreateGeofenceCollectionResponse {
    /**
     * The Amazon Resource Name (ARN) for the geofence collection resource. Used when you need to specify a resource across all AWS.    Format example: arn:aws:geo:region:account-id:geofence-collection/ExampleGeofenceCollection   
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
  export interface CreateMapRequest {
    /**
     * Specifies the map style selected from an available data provider.
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
     * Specifies the pricing plan for your map resource. For additional details and restrictions on each pricing plan option, see Amazon Location Service pricing.
     */
    PricingPlan: PricingPlan;
    /**
     * Applies one or more tags to the map resource. A tag is a key-value pair helps manage, identify, search, and filter your resources by labelling them. Format: "key" : "value"  Restrictions:   Maximum 50 tags per resource   Each resource tag must be unique with a maximum of one value.   Maximum key length: 128 Unicode characters in UTF-8   Maximum value length: 256 Unicode characters in UTF-8   Can use alphanumeric characters (A–Z, a–z, 0–9), and the following characters: + - = . _ : / @.   
     */
    Tags?: TagMap;
  }
  export interface CreateMapResponse {
    /**
     * The timestamp for when the map resource was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ.
     */
    CreateTime: Timestamp;
    /**
     * The Amazon Resource Name (ARN) for the map resource. Used to specify a resource across all AWS.   Format example: arn:aws:geo:region:account-id:maps/ExampleMap   
     */
    MapArn: Arn;
    /**
     * The name of the map resource.
     */
    MapName: ResourceName;
  }
  export interface CreatePlaceIndexRequest {
    /**
     * Specifies the data provider of geospatial data.  This field is case-sensitive. Enter the valid values as shown. For example, entering HERE returns an error.  Valid values include:    Esri – For additional information about Esri's coverage in your region of interest, see Esri details on geocoding coverage.    Here – For additional information about HERE Technologies' coverage in your region of interest, see HERE details on goecoding coverage.  Place index resources using HERE Technologies as a data provider can't store results for locations in Japan. For more information, see the AWS Service Terms for Amazon Location Service.    For additional information , see Data providers on the Amazon Location Service Developer Guide.
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
     * Specifies the pricing plan for your place index resource. For additional details and restrictions on each pricing plan option, see Amazon Location Service pricing.
     */
    PricingPlan: PricingPlan;
    /**
     * Applies one or more tags to the place index resource. A tag is a key-value pair helps manage, identify, search, and filter your resources by labelling them. Format: "key" : "value"  Restrictions:   Maximum 50 tags per resource   Each resource tag must be unique with a maximum of one value.   Maximum key length: 128 Unicode characters in UTF-8   Maximum value length: 256 Unicode characters in UTF-8   Can use alphanumeric characters (A–Z, a–z, 0–9), and the following characters: + - = . _ : / @.   
     */
    Tags?: TagMap;
  }
  export interface CreatePlaceIndexResponse {
    /**
     * The timestamp for when the place index resource was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    CreateTime: Timestamp;
    /**
     * The Amazon Resource Name (ARN) for the place index resource. Used to specify a resource across AWS.    Format example: arn:aws:geo:region:account-id:place-index/ExamplePlaceIndex   
     */
    IndexArn: Arn;
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
     * Specifies the data provider of traffic and road network data.  This field is case-sensitive. Enter the valid values as shown. For example, entering HERE returns an error. Route calculators that use Esri as a data source only calculate routes that are shorter than 400 km.  Valid values include:    Esri – For additional information about Esri's coverage in your region of interest, see Esri details on street networks and traffic coverage.    Here – For additional information about HERE Technologies' coverage in your region of interest, see HERE car routing coverage and HERE truck routing coverage.   For additional information , see Data providers on the Amazon Location Service Developer Guide.
     */
    DataSource: String;
    /**
     * The optional description for the route calculator resource.
     */
    Description?: ResourceDescription;
    /**
     * Specifies the pricing plan for your route calculator resource. For additional details and restrictions on each pricing plan option, see Amazon Location Service pricing.
     */
    PricingPlan: PricingPlan;
    /**
     * Applies one or more tags to the route calculator resource. A tag is a key-value pair helps manage, identify, search, and filter your resources by labelling them.   For example: { "tag1" : "value1", "tag2" : "value2"}   Format: "key" : "value"  Restrictions:   Maximum 50 tags per resource   Each resource tag must be unique with a maximum of one value.   Maximum key length: 128 Unicode characters in UTF-8   Maximum value length: 256 Unicode characters in UTF-8   Can use alphanumeric characters (A–Z, a–z, 0–9), and the following characters: + - = . _ : / @.   
     */
    Tags?: TagMap;
  }
  export interface CreateRouteCalculatorResponse {
    /**
     * The Amazon Resource Name (ARN) for the route calculator resource. Use the ARN when you specify a resource across all AWS.   Format example: arn:aws:geo:region:account-id:route-calculator/ExampleCalculator   
     */
    CalculatorArn: Arn;
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
     * A key identifier for an AWS KMS customer managed key. Enter a key ID, key ARN, alias name, or alias ARN.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * Specifies the position filtering for the tracker resource. Valid values:    TimeBased - Location updates are evaluated against linked geofence collections, but not every location update is stored. If your update frequency is more often than 30 seconds, only one update per 30 seconds is stored for each unique device ID.     DistanceBased - If the device has moved less than 30 m (98.4 ft), location updates are ignored. Location updates within this distance are neither evaluated against linked geofence collections, nor stored. This helps control costs by reducing the number of geofence evaluations and device positions to retrieve. Distance-based filtering can also reduce the jitter effect when displaying device trajectory on a map.    This field is optional. If not specified, the default value is TimeBased.
     */
    PositionFiltering?: PositionFiltering;
    /**
     * Specifies the pricing plan for the tracker resource. For additional details and restrictions on each pricing plan option, see Amazon Location Service pricing.
     */
    PricingPlan: PricingPlan;
    /**
     * Specifies the data provider for the tracker resource.   Required value for the following pricing plans: MobileAssetTracking | MobileAssetManagement    For more information about Data Providers, and Pricing plans, see the Amazon Location Service product page.  Amazon Location Service only uses PricingPlanDataSource to calculate billing for your tracker resource. Your data will not be shared with the data provider, and will remain in your AWS account or Region unless you move it.  Valid values: Esri | Here 
     */
    PricingPlanDataSource?: String;
    /**
     * Applies one or more tags to the tracker resource. A tag is a key-value pair helps manage, identify, search, and filter your resources by labelling them. Format: "key" : "value"  Restrictions:   Maximum 50 tags per resource   Each resource tag must be unique with a maximum of one value.   Maximum key length: 128 Unicode characters in UTF-8   Maximum value length: 256 Unicode characters in UTF-8   Can use alphanumeric characters (A–Z, a–z, 0–9), and the following characters: + - = . _ : / @.   
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
     * The Amazon Resource Name (ARN) for the tracker resource. Used when you need to specify a resource across all AWS.   Format example: arn:aws:geo:region:account-id:tracker/ExampleTracker   
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
     * The Amazon Resource Name (ARN) for the geofence collection resource. Used when you need to specify a resource across all AWS.    Format example: arn:aws:geo:region:account-id:geofence-collection/ExampleGeofenceCollection   
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
     * A key identifier for an AWS KMS customer managed key assigned to the Amazon Location resource
     */
    KmsKeyId?: KmsKeyId;
    /**
     * The pricing plan selected for the specified geofence collection. For additional details and restrictions on each pricing plan option, see the Amazon Location Service pricing page.
     */
    PricingPlan: PricingPlan;
    /**
     * The specified data provider for the geofence collection.
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
     * The Amazon Resource Name (ARN) for the map resource. Used to specify a resource across all AWS.   Format example: arn:aws:geo:region:account-id:maps/ExampleMap   
     */
    MapArn: Arn;
    /**
     * The map style selected from an available provider.
     */
    MapName: ResourceName;
    /**
     * The pricing plan selected for the specified map resource.  &lt;p&gt;For additional details and restrictions on each pricing plan option, see &lt;a href=&quot;https://aws.amazon.com/location/pricing/&quot;&gt;Amazon Location Service pricing&lt;/a&gt;.&lt;/p&gt; 
     */
    PricingPlan: PricingPlan;
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
     * The data provider of geospatial data. Indicates one of the available providers:    Esri     Here    For additional details on data providers, see Amazon Location Service data providers.
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
     * The Amazon Resource Name (ARN) for the place index resource. Used to specify a resource across AWS.    Format example: arn:aws:geo:region:account-id:place-index/ExamplePlaceIndex   
     */
    IndexArn: Arn;
    /**
     * The name of the place index resource being described.
     */
    IndexName: ResourceName;
    /**
     * The pricing plan selected for the specified place index resource. For additional details and restrictions on each pricing plan option, see Amazon Location Service pricing.
     */
    PricingPlan: PricingPlan;
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
     * The Amazon Resource Name (ARN) for the Route calculator resource. Use the ARN when you specify a resource across AWS.   Format example: arn:aws:geo:region:account-id:route-calculator/ExampleCalculator   
     */
    CalculatorArn: Arn;
    /**
     * The name of the route calculator resource being described.
     */
    CalculatorName: ResourceName;
    /**
     * The timestamp when the route calculator resource was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ.    For example, 2020–07-2T12:15:20.000Z+01:00   
     */
    CreateTime: Timestamp;
    /**
     * The data provider of traffic and road network data. Indicates one of the available providers:    Esri     Here    For more information about data providers, see Amazon Location Service data providers.
     */
    DataSource: String;
    /**
     * The optional description of the route calculator resource.
     */
    Description: ResourceDescription;
    /**
     * The pricing plan selected for the specified route calculator resource. For additional details and restrictions on each pricing plan option, see Amazon Location Service pricing.
     */
    PricingPlan: PricingPlan;
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
     * A key identifier for an AWS KMS customer managed key assigned to the Amazon Location resource.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * The position filtering method of the tracker resource.
     */
    PositionFiltering?: PositionFiltering;
    /**
     * The pricing plan selected for the specified tracker resource. For additional details and restrictions on each pricing plan option, see Amazon Location Service pricing.
     */
    PricingPlan: PricingPlan;
    /**
     * The specified data provider for the tracker resource.
     */
    PricingPlanDataSource?: String;
    /**
     * The tags associated with the tracker resource.
     */
    Tags?: TagMap;
    /**
     * The Amazon Resource Name (ARN) for the tracker resource. Used when you need to specify a resource across all AWS.   Format example: arn:aws:geo:region:account-id:tracker/ExampleTracker   
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
     * The device whose position you retrieved.
     */
    DeviceId?: Id;
    /**
     * The last known device position.
     */
    Position: Position;
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
     * The device associated to the position update.
     */
    DeviceId: Id;
    /**
     * The latest device position defined in WGS 84 format: [X or longitude, Y or latitude].
     */
    Position: Position;
    /**
     * The timestamp at which the device's position was determined. Uses ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ 
     */
    SampleTime: Timestamp;
  }
  export type DimensionUnit = "Meters"|"Feet"|string;
  export interface DisassociateTrackerConsumerRequest {
    /**
     * The Amazon Resource Name (ARN) for the geofence collection to be disassociated from the tracker resource. Used when you need to specify a resource across all AWS.    Format example: arn:aws:geo:region:account-id:geofence-collection/ExampleGeofenceCollectionConsumer   
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
  export interface GeofenceGeometry {
    /**
     * An array of 1 or more linear rings. A linear ring is an array of 4 or more vertices, where the first and last vertex are the same to form a closed boundary. Each vertex is a 2-dimensional point of the form: [longitude, latitude].  The first linear ring is an outer ring, describing the polygon's boundary. Subsequent linear rings may be inner or outer rings to describe holes and islands. Outer rings must list their vertices in counter-clockwise order around the ring's center, where the left side is the polygon's exterior. Inner rings must list their vertices in clockwise order, where the left side is the polygon's interior.
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
     * The device whose position you retrieved.
     */
    DeviceId?: Id;
    /**
     * The last known device position.
     */
    Position: Position;
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
     * Contains the geofence geometry details describing a polygon.
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
     * A comma-separated list of fonts to load glyphs from in order of preference. For example, Noto Sans Regular, Arial Unicode. Valid fonts stacks for Esri styles:    VectorEsriDarkGrayCanvas – Ubuntu Medium Italic | Ubuntu Medium | Ubuntu Italic | Ubuntu Regular | Ubuntu Bold    VectorEsriLightGrayCanvas – Ubuntu Italic | Ubuntu Regular | Ubuntu Light | Ubuntu Bold    VectorEsriTopographic – Noto Sans Italic | Noto Sans Regular | Noto Sans Bold | Noto Serif Regular | Roboto Condensed Light Italic    VectorEsriStreets – Arial Regular | Arial Italic | Arial Bold    VectorEsriNavigation – Arial Regular | Arial Italic | Arial Bold    Valid font stacks for HERE Technologies styles:    VectorHereBerlin – Fira GO Regular | Fira GO Bold   
     */
    FontStack: String;
    /**
     * A Unicode range of characters to download glyphs for. Each response will contain 256 characters. For example, 0–255 includes all characters from range U+0000 to 00FF. Must be aligned to multiples of 256.
     */
    FontUnicodeRange: GetMapGlyphsRequestFontUnicodeRangeString;
    /**
     * The map resource associated with the glyph ﬁle.
     */
    MapName: ResourceName;
  }
  export type GetMapGlyphsRequestFontUnicodeRangeString = string;
  export interface GetMapGlyphsResponse {
    /**
     * The blob's content type.
     */
    Blob?: _Blob;
    /**
     * The map glyph content type. For example, application/octet-stream.
     */
    ContentType?: String;
  }
  export interface GetMapSpritesRequest {
    /**
     * The name of the sprite ﬁle. Use the following ﬁle names for the sprite sheet:    sprites.png     sprites@2x.png for high pixel density displays   For the JSON document contain image offsets. Use the following ﬁle names:    sprites.json     sprites@2x.json for high pixel density displays  
     */
    FileName: GetMapSpritesRequestFileNameString;
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
     * The content type of the sprite sheet and offsets. For example, the sprite sheet content type is image/png, and the sprite offset JSON document is application/json. 
     */
    ContentType?: String;
  }
  export interface GetMapStyleDescriptorRequest {
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
     * The style descriptor's content type. For example, application/json.
     */
    ContentType?: String;
  }
  export interface GetMapTileRequest {
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
     * The map tile's content type. For example, application/vnd.mapbox-vector-tile.
     */
    ContentType?: String;
  }
  export type Id = string;
  export type IntendedUse = "SingleUse"|"Storage"|string;
  export type KmsKeyId = string;
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
     * Contains details about each device's last known position. These details includes the device ID, the time when the position was sampled on the device, the time that the service received the update, and the most recent coordinates.
     */
    Entries: ListDevicePositionsResponseEntryList;
    /**
     * A pagination token indicating there are additional pages available. You can use the token in a following request to fetch the next set of results.
     */
    NextToken?: Token;
  }
  export interface ListDevicePositionsResponseEntry {
    /**
     * The ID of the device for this position.
     */
    DeviceId: Id;
    /**
     * The last known device position. Empty if no positions currently stored.
     */
    Position: Position;
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
     * Lists the geofence collections that exist in your AWS account.
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
     * The pricing plan for the specified geofence collection. For additional details and restrictions on each pricing plan option, see the Amazon Location Service pricing page.
     */
    PricingPlan: PricingPlan;
    /**
     * The specified data provider for the geofence collection.
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
     * Contains the geofence geometry details describing a polygon.
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
     * The pagination token specifying which page of results to return in the response. If no token is provided, the default page is the first page.  Default value: null 
     */
    NextToken?: Token;
  }
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
     * Contains a list of maps in your AWS account
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
     * The pricing plan for the specified map resource. For additional details and restrictions on each pricing plan option, see Amazon Location Service pricing.
     */
    PricingPlan: PricingPlan;
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
     * Lists the place index resources that exist in your AWS account
     */
    Entries: ListPlaceIndexesResponseEntryList;
    /**
     * A pagination token indicating there are additional pages available. You can use the token in a following request to fetch the next set of results.
     */
    NextToken?: Token;
  }
  export interface ListPlaceIndexesResponseEntry {
    /**
     * The timestamp for when the place index resource was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ. 
     */
    CreateTime: Timestamp;
    /**
     * The data provider of geospatial data. Indicates one of the available providers:    Esri     Here    For additional details on data providers, see Amazon Location Service data providers.
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
     * The pricing plan for the specified place index resource. For additional details and restrictions on each pricing plan option, see Amazon Location Service pricing.
     */
    PricingPlan: PricingPlan;
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
     * Lists the route calculator resources that exist in your AWS account
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
     * The data provider of traffic and road network data. Indicates one of the available providers:    Esri     Here    For more information about data providers, see Amazon Location Service data providers.
     */
    DataSource: String;
    /**
     * The optional description of the route calculator resource.
     */
    Description: ResourceDescription;
    /**
     * The pricing plan for the specified route calculator resource. For additional details and restrictions on each pricing plan option, see Amazon Location Service pricing.
     */
    PricingPlan: PricingPlan;
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
     * Contains tracker resources in your AWS account. Details include tracker name, description and timestamps for when the tracker was created and last updated.
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
     * The pricing plan for the specified tracker resource. For additional details and restrictions on each pricing plan option, see Amazon Location Service pricing.
     */
    PricingPlan: PricingPlan;
    /**
     * The specified data provider for the tracker resource.
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
     * Specifies the map style selected from an available data provider. Valid Esri map styles:    VectorEsriDarkGrayCanvas – The Esri Dark Gray Canvas map style. A vector basemap with a dark gray, neutral background with minimal colors, labels, and features that's designed to draw attention to your thematic content.     RasterEsriImagery – The Esri Imagery map style. A raster basemap that provides one meter or better satellite and aerial imagery in many parts of the world and lower resolution satellite imagery worldwide.     VectorEsriLightGrayCanvas – The Esri Light Gray Canvas map style, which provides a detailed vector basemap with a light gray, neutral background style with minimal colors, labels, and features that's designed to draw attention to your thematic content.     VectorEsriTopographic – The Esri Light map style, which provides a detailed vector basemap with a classic Esri map style.    VectorEsriStreets – The Esri World Streets map style, which provides a detailed vector basemap for the world symbolized with a classic Esri street map style. The vector tile layer is similar in content and style to the World Street Map raster map.    VectorEsriNavigation – The Esri World Navigation map style, which provides a detailed basemap for the world symbolized with a custom navigation map style that's designed for use during the day in mobile devices.   Valid HERE Technologies map styles:    VectorHereBerlin – The HERE Berlin map style is a high contrast detailed base map of the world that blends 3D and 2D rendering.  When using HERE as your data provider, and selecting the Style VectorHereBerlin, you may not use HERE Technologies maps for Asset Management. See the AWS Service Terms for Amazon Location Service.   
     */
    Style: MapStyle;
  }
  export type MapStyle = string;
  export interface Place {
    /**
     * The numerical portion of an address, such as a building number. 
     */
    AddressNumber?: String;
    /**
     * A country/region specified using ISO 3166 3-digit country/region code. For example, CAN.
     */
    Country?: String;
    Geometry: PlaceGeometry;
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
     * A country, or an area that's part of a larger region . For example, Metro Vancouver.
     */
    SubRegion?: String;
  }
  export interface PlaceGeometry {
    /**
     * A single point geometry specifies a location for a Place using WGS 84 coordinates:    x — Specifies the x coordinate or longitude.     y — Specifies the y coordinate or latitude.   
     */
    Point?: Position;
  }
  export type PlaceIndexSearchResultLimit = number;
  export type Position = Double[];
  export type PositionFiltering = "TimeBased"|"DistanceBased"|string;
  export type PricingPlan = "RequestBasedUsage"|"MobileAssetTracking"|"MobileAssetManagement"|string;
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
     * Contains the polygon details to specify the position of the geofence.  Each geofence polygon can have a maximum of 1,000 vertices. 
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
  export type ResourceDescription = string;
  export type ResourceName = string;
  export interface SearchForPositionResult {
    /**
     * Contains details about the relevant point of interest.
     */
    Place: Place;
  }
  export type SearchForPositionResultList = SearchForPositionResult[];
  export interface SearchForTextResult {
    /**
     * Contains details about the relevant point of interest.
     */
    Place: Place;
  }
  export type SearchForTextResultList = SearchForTextResult[];
  export interface SearchPlaceIndexForPositionRequest {
    /**
     * The name of the place index resource you want to use for the search.
     */
    IndexName: ResourceName;
    /**
     * An optional paramer. The maximum number of results returned per request.  Default value: 50 
     */
    MaxResults?: PlaceIndexSearchResultLimit;
    /**
     * Specifies a coordinate for the query defined by a longitude, and latitude.   The first position is the X coordinate, or longitude.   The second position is the Y coordinate, or latitude.    For example, position=xLongitude&amp;position=yLatitude .
     */
    Position: Position;
  }
  export interface SearchPlaceIndexForPositionResponse {
    /**
     * Returns a list of Places closest to the specified position. Each result contains additional information about the Places returned.
     */
    Results: SearchForPositionResultList;
    /**
     * Contains a summary of the request.
     */
    Summary: SearchPlaceIndexForPositionSummary;
  }
  export interface SearchPlaceIndexForPositionSummary {
    /**
     * The data provider of geospatial data. Indicates one of the available providers:   Esri   HERE   For additional details on data providers, see Amazon Location Service data providers.
     */
    DataSource: String;
    /**
     * An optional parameter. The maximum number of results returned per request.  Default value: 50 
     */
    MaxResults?: PlaceIndexSearchResultLimit;
    /**
     * The position given in the reverse geocoding request.
     */
    Position: Position;
  }
  export interface SearchPlaceIndexForTextRequest {
    /**
     * Searches for results closest to the given position. An optional parameter defined by longitude, and latitude.   The first bias position is the X coordinate, or longitude.   The second bias position is the Y coordinate, or latitude.    For example, bias=xLongitude&amp;bias=yLatitude.
     */
    BiasPosition?: Position;
    /**
     * Filters the results by returning only Places within the provided bounding box. An optional parameter. The first 2 bbox parameters describe the lower southwest corner:   The first bbox position is the X coordinate or longitude of the lower southwest corner.   The second bbox position is the Y coordinate or latitude of the lower southwest corner.   For example, bbox=xLongitudeSW&amp;bbox=yLatitudeSW. The next bbox parameters describe the upper northeast corner:   The third bbox position is the X coordinate, or longitude of the upper northeast corner.   The fourth bbox position is the Y coordinate, or longitude of the upper northeast corner.   For example, bbox=xLongitudeNE&amp;bbox=yLatitudeNE 
     */
    FilterBBox?: BoundingBox;
    /**
     * Limits the search to the given a list of countries/regions. An optional parameter.   Use the ISO 3166 3-digit country code. For example, Australia uses three upper-case characters: AUS.  
     */
    FilterCountries?: CountryCodeList;
    /**
     * The name of the place index resource you want to use for the search.
     */
    IndexName: ResourceName;
    /**
     * An optional parameter. The maximum number of results returned per request.  The default: 50 
     */
    MaxResults?: PlaceIndexSearchResultLimit;
    /**
     * The address, name, city, or region to be used in the search. In free-form text format. For example, 123 Any Street.
     */
    Text: SyntheticSearchPlaceIndexForTextRequestString;
  }
  export interface SearchPlaceIndexForTextResponse {
    /**
     * A list of Places closest to the specified position. Each result contains additional information about the specific point of interest. 
     */
    Results: SearchForTextResultList;
    /**
     * Contains a summary of the request. Contains the BiasPosition, DataSource, FilterBBox, FilterCountries, MaxResults, ResultBBox, and Text.
     */
    Summary: SearchPlaceIndexForTextSummary;
  }
  export interface SearchPlaceIndexForTextSummary {
    /**
     * Contains the coordinates for the bias position entered in the geocoding request.
     */
    BiasPosition?: Position;
    /**
     * The data provider of geospatial data. Indicates one of the available providers:   Esri   HERE   For additional details on data providers, see Amazon Location Service data providers.
     */
    DataSource: String;
    /**
     * Contains the coordinates for the optional bounding box coordinated entered in the geocoding request.
     */
    FilterBBox?: BoundingBox;
    /**
     * Contains the country filter entered in the geocoding request.
     */
    FilterCountries?: CountryCodeList;
    /**
     * Contains the maximum number of results indicated for the request.
     */
    MaxResults?: PlaceIndexSearchResultLimit;
    /**
     * A bounding box that contains the search results within the specified area indicated by FilterBBox. A subset of bounding box specified using FilterBBox.
     */
    ResultBBox?: BoundingBox;
    /**
     * The address, name, city or region to be used in the geocoding request. In free-form text format. For example, Vancouver.
     */
    Text: SyntheticSearchPlaceIndexForTextSummaryString;
  }
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
  export type SyntheticSearchPlaceIndexForTextRequestString = string;
  export type SyntheticSearchPlaceIndexForTextSummaryString = string;
  export type TagKey = string;
  export type TagKeys = String[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource whose tags you want to update.   Format example: arn:aws:geo:region:account-id:resourcetype/ExampleResource   
     */
    ResourceArn: Arn;
    /**
     * Tags that have been applied to the specified resource. Tags are mapped from the tag key to the tag value: "TagKey" : "TagValue".   Format example: {"tag1" : "value1", "tag2" : "value2"}    
     */
    Tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export type Token = string;
  export type TravelMode = "Car"|"Truck"|"Walking"|string;
  export interface TruckDimensions {
    /**
     * The height of the truck.   For example, 4.5.  
     */
    Height?: TruckDimensionsHeightDouble;
    /**
     * The length of the truck.   For example, 15.5.  
     */
    Length?: TruckDimensionsLengthDouble;
    /**
     *  Specifies the unit of measurement for the truck dimensions. Default Value: Meters 
     */
    Unit?: DimensionUnit;
    /**
     * The width of the truck.   For example, 4.5.  
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
     * Updates the pricing plan for the geofence collection. For more information about each pricing plan option restrictions, see Amazon Location Service pricing.
     */
    PricingPlan?: PricingPlan;
    /**
     * Updates the data provider for the geofence collection.  A required value for the following pricing plans: MobileAssetTracking| MobileAssetManagement  For more information about data providers and pricing plans, see the Amazon Location Service product page.  This can only be updated when updating the PricingPlan in the same request. Amazon Location Service uses PricingPlanDataSource to calculate billing for your geofence collection. Your data won't be shared with the data provider, and will remain in your AWS account and Region unless you move it. 
     */
    PricingPlanDataSource?: String;
  }
  export interface UpdateGeofenceCollectionResponse {
    /**
     * The Amazon Resource Name (ARN) of the updated geofence collection. Used to specify a resource across AWS.   Format example: arn:aws:geo:region:account-id:geofence-collection/ExampleGeofenceCollection   
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
  export interface UpdateMapRequest {
    /**
     * Updates the description for the map resource.
     */
    Description?: ResourceDescription;
    /**
     * The name of the map resource to update.
     */
    MapName: ResourceName;
    /**
     * Updates the pricing plan for the map resource. For more information about each pricing plan option restrictions, see Amazon Location Service pricing.
     */
    PricingPlan?: PricingPlan;
  }
  export interface UpdateMapResponse {
    /**
     * The Amazon Resource Name (ARN) of the updated map resource. Used to specify a resource across AWS.   Format example: arn:aws:geo:region:account-id:maps/ExampleMap   
     */
    MapArn: Arn;
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
     * Updates the pricing plan for the place index resource. For more information about each pricing plan option restrictions, see Amazon Location Service pricing.
     */
    PricingPlan?: PricingPlan;
  }
  export interface UpdatePlaceIndexResponse {
    /**
     * The Amazon Resource Name (ARN) of the upated place index resource. Used to specify a resource across AWS.   Format example: arn:aws:geo:region:account-id:place- index/ExamplePlaceIndex   
     */
    IndexArn: Arn;
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
     * Updates the pricing plan for the route calculator resource. For more information about each pricing plan option restrictions, see Amazon Location Service pricing.
     */
    PricingPlan?: PricingPlan;
  }
  export interface UpdateRouteCalculatorResponse {
    /**
     * The Amazon Resource Name (ARN) of the updated route calculator resource. Used to specify a resource across AWS.   Format example: arn:aws:geo:region:account-id:route- calculator/ExampleCalculator   
     */
    CalculatorArn: Arn;
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
     * Updates the position filtering for the tracker resource. Valid values:    TimeBased - Location updates are evaluated against linked geofence collections, but not every location update is stored. If your update frequency is more often than 30 seconds, only one update per 30 seconds is stored for each unique device ID.     DistanceBased - If the device has moved less than 30 m (98.4 ft), location updates are ignored. Location updates within this distance are neither evaluated against linked geofence collections, nor stored. This helps control costs by reducing the number of geofence evaluations and device positions to retrieve. Distance-based filtering can also reduce the jitter effect when displaying device trajectory on a map.   
     */
    PositionFiltering?: PositionFiltering;
    /**
     * Updates the pricing plan for the tracker resource. For more information about each pricing plan option restrictions, see Amazon Location Service pricing.
     */
    PricingPlan?: PricingPlan;
    /**
     * Updates the data provider for the tracker resource.  A required value for the following pricing plans: MobileAssetTracking| MobileAssetManagement  For more information about data providers and pricing plans, see the Amazon Location Service product page  This can only be updated when updating the PricingPlan in the same request. Amazon Location Service uses PricingPlanDataSource to calculate billing for your tracker resource. Your data won't be shared with the data provider, and will remain in your AWS account and Region unless you move it. 
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
